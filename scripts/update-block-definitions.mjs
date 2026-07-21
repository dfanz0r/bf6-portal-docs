import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

// Refreshes `.vitepress/block-definitions.json` from the live Portal backend.
//
// The block definitions ("modBuilder" JSON) are not part of the Portal SDK
// zip — the web mod builder receives them inside the scheduled Blueprint via
// the Santiago gRPC-web API (`availableGameData.modRules.modBuilder`), and
// that API requires an authenticated session. When no session is available
// (or it has expired) this script leaves the committed snapshot in place, so
// builds never break — they just use the last known definitions.
//
// Session id: the `bf6sessionId` cookie / `x-gateway-session-id` header from
// a logged-in portal.battlefield.com browser session. Provide it via the
// PORTAL_SESSION_ID environment variable.

const strict = process.argv.includes('--strict')
const definitionsFile = '.vitepress/block-definitions.json'

const grpcHost = 'https://santiago-prod-wgw-envoy.ops.dice.se'
const grpcService = 'santiago.web.play.WebPlay'

// Sections the mod builder payload does not include but the reference
// generators rely on. They are carried over from the committed snapshot.
const carriedSections = ['controlActions', 'types', 'constraints']

// ── Minimal protobuf + gRPC-web plumbing ────────────────────────────────────
// The payload path is fixed and shallow, so a full protobuf library is not
// needed. Field numbers (from the web app's generated message types):
//   GetScheduledBlueprintsResponse.blueprintIds = 1 (BlueprintId{id=1, version=2})
//   GetBlueprintsByIdRequest.blueprintIds      = 1
//   GetBlueprintsByIdResponse.blueprints       = 1
//   Blueprint.availableGameData                = 3
//   AvailableGameData.modRules                 = 3
//   ModRulesDefinition.modBuilder              = 2 (bytes: JSON text)

function encodeVarint (value) {
  const bytes = []
  let n = value
  do {
    let b = n & 0x7f
    n >>>= 7
    if (n) b |= 0x80
    bytes.push(b)
  } while (n)
  return Uint8Array.from(bytes)
}

function encodeLengthDelimited (field, payload) {
  const tag = encodeVarint((field << 3) | 2)
  const length = encodeVarint(payload.length)
  const out = new Uint8Array(tag.length + length.length + payload.length)
  out.set(tag, 0)
  out.set(length, tag.length)
  out.set(payload, tag.length + length.length)
  return out
}

function concatBytes (chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

function readVarint (buf, index) {
  let value = 0
  let shift = 0
  let i = index
  for (;;) {
    const b = buf[i++]
    value += (b & 0x7f) * 2 ** shift
    if (!(b & 0x80)) return [value, i]
    shift += 7
  }
}

function * iterateFields (buf) {
  let i = 0
  while (i < buf.length) {
    let tag
    ;[tag, i] = readVarint(buf, i)
    const field = Math.floor(tag / 8)
    const wireType = tag & 7
    if (wireType === 0) {
      let value
      ;[value, i] = readVarint(buf, i)
      yield { field, wireType, value }
    } else if (wireType === 2) {
      let length
      ;[length, i] = readVarint(buf, i)
      yield { field, wireType, value: buf.subarray(i, i + length) }
      i += length
    } else if (wireType === 5) {
      yield { field, wireType, value: buf.subarray(i, i + 4) }
      i += 4
    } else if (wireType === 1) {
      yield { field, wireType, value: buf.subarray(i, i + 8) }
      i += 8
    } else {
      throw new Error(`Unsupported protobuf wire type ${wireType}`)
    }
  }
}

function getLengthDelimited (buf, field) {
  const values = []
  for (const entry of iterateFields(buf)) {
    if (entry.field === field && entry.wireType === 2) values.push(entry.value)
  }
  return values
}

function decodeGrpcWebFrames (body) {
  const view = new DataView(body.buffer, body.byteOffset, body.byteLength)
  const messages = []
  let i = 0
  while (i + 5 <= body.length) {
    const flag = body[i]
    const length = view.getUint32(i + 1)
    const frame = body.subarray(i + 5, i + 5 + length)
    i += 5 + length
    if (flag & 0x80) {
      const trailers = new TextDecoder().decode(frame)
      const status = trailers.match(/grpc-status:\s*(\d+)/)?.[1]
      if (status && status !== '0') {
        const message = trailers.match(/grpc-message:\s*([^\r\n]*)/)?.[1] ?? ''
        throw new Error(`gRPC error ${status}: ${decodeURIComponent(message)}`)
      }
    } else {
      messages.push(frame)
    }
  }
  return concatBytes(messages)
}

async function grpcCall (sessionId, method, requestBytes) {
  const framed = new Uint8Array(5 + requestBytes.length)
  new DataView(framed.buffer).setUint32(1, requestBytes.length)
  framed.set(requestBytes, 5)

  const res = await fetch(`${grpcHost}/${grpcService}/${method}`, {
    method: 'POST',
    body: framed,
    signal: AbortSignal.timeout(120000),
    headers: {
      'content-type': 'application/grpc-web+proto',
      'x-grpc-web': '1',
      'x-user-agent': 'grpc-web-javascript/0.1',
      'x-dice-tenancy': 'prod_default-prod_default-santiago-common',
      'x-gateway-session-id': sessionId,
      origin: 'https://portal.battlefield.com',
      referer: 'https://portal.battlefield.com/'
    }
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const headerStatus = res.headers.get('grpc-status')
  if (headerStatus && headerStatus !== '0') {
    const message = res.headers.get('grpc-message') ?? ''
    const hint = headerStatus === '16' ? ' (session expired or invalid — refresh PORTAL_SESSION_ID)' : ''
    throw new Error(`gRPC error ${headerStatus}: ${decodeURIComponent(message)}${hint}`)
  }

  return decodeGrpcWebFrames(new Uint8Array(await res.arrayBuffer()))
}

// ── Definitions fetch ───────────────────────────────────────────────────────

async function fetchModBuilderDefinitions (sessionId) {
  const scheduled = await grpcCall(sessionId, 'getScheduledBlueprints', new Uint8Array(0))
  const blueprintIds = getLengthDelimited(scheduled, 1)
  if (blueprintIds.length === 0) throw new Error('No scheduled blueprints returned')

  const text = new TextDecoder()
  const id = text.decode(getLengthDelimited(blueprintIds[0], 1)[0] ?? new Uint8Array(0))
  const version = text.decode(getLengthDelimited(blueprintIds[0], 2)[0] ?? new Uint8Array(0))
  if (!id || !version) throw new Error('Scheduled blueprint id/version missing')
  console.log(`Scheduled blueprint: ${id}:${version}`)

  const request = encodeLengthDelimited(1, concatBytes([
    encodeLengthDelimited(1, new TextEncoder().encode(id)),
    encodeLengthDelimited(2, new TextEncoder().encode(version))
  ]))
  const response = await grpcCall(sessionId, 'getBlueprintsById', request)

  const blueprint = getLengthDelimited(response, 1)[0]
  if (!blueprint) throw new Error('Blueprint response contained no blueprints')
  const availableGameData = getLengthDelimited(blueprint, 3)[0]
  const modRules = availableGameData && getLengthDelimited(availableGameData, 3)[0]
  const modBuilder = modRules && getLengthDelimited(modRules, 2)[0]
  if (!modBuilder || modBuilder.length === 0) throw new Error('Blueprint contained no modBuilder definitions')

  return JSON.parse(text.decode(modBuilder))
}

function validateDefinitions (defs) {
  for (const section of ['actions', 'events', 'values', 'objects', 'selectionLists']) {
    if (!Array.isArray(defs[section]) || defs[section].length === 0) {
      throw new Error(`Fetched definitions are missing the '${section}' section`)
    }
  }
}

async function main () {
  const sessionId = process.env.PORTAL_SESSION_ID
  if (!sessionId) {
    console.warn('PORTAL_SESSION_ID not set; keeping committed block definitions.')
    console.warn('  (Set it to the bf6sessionId cookie from a logged-in portal.battlefield.com session to refresh.)')
    return
  }

  let fresh
  try {
    fresh = await fetchModBuilderDefinitions(sessionId)
  } catch (err) {
    // An unreachable backend or expired session is an expected operational
    // state — keep the committed snapshot rather than failing the build.
    console.warn(`Could not refresh block definitions: ${err instanceof Error ? err.message : String(err)}`)
    console.warn('Keeping committed block definitions.')
    return
  }

  try {
    validateDefinitions(fresh)
  } catch (err) {
    if (strict) throw err
    console.warn(`${err instanceof Error ? err.message : String(err)} — keeping committed block definitions.`)
    return
  }

  if (existsSync(definitionsFile)) {
    const existing = JSON.parse(await readFile(definitionsFile, 'utf8'))
    for (const section of carriedSections) {
      if (fresh[section] === undefined && existing[section] !== undefined) {
        fresh[section] = existing[section]
      }
    }
  }

  await writeFile(definitionsFile, `${JSON.stringify(fresh, null, 2)}\n`, 'utf8')
  const summary = Object.entries(fresh)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => `${key}: ${value.length}`)
    .join(', ')
  console.log(`Updated ${definitionsFile} (${summary})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
