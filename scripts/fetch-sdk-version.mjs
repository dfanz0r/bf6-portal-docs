import { mkdir, writeFile } from 'node:fs/promises'

// Keep the SDK version tracker inside `.cache/` so Cloudflare's Build Cache
// carries it across builds. See download-block-help.mjs for the rationale.
const outPath = '.cache/sdk-version.json'
const versionsUrl = 'https://download.portal.battlefield.com/versions.json'

function emptyPayload () {
  return {
    currentVersion: null,
    source: versionsUrl,
    fetchedAt: null
  }
}

function pickVersion (data) {
  const candidates = [
    data?.version,
    data?.currentVersion,
    data?.portalVersion,
    data?.latestVersion,
    data?.latest,
    data?.data?.version,
    data?.data?.currentVersion,
    data?.versions?.[0]?.version,
    Array.isArray(data) ? data[0]?.version : null,
    Array.isArray(data) ? data[0]?.currentVersion : null
  ]

  return candidates.find(Boolean) ?? null
}

async function fetchVersion () {
  if (process.env.PORTAL_SDK_VERSION) {
    return {
      currentVersion: process.env.PORTAL_SDK_VERSION,
      source: 'PORTAL_SDK_VERSION',
      fetchedAt: new Date().toISOString()
    }
  }

  const headers = {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    accept: 'application/json,text/plain,*/*',
    'accept-language': 'en-US,en;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    origin: 'https://portal.battlefield.com',
    referer: 'https://portal.battlefield.com/bf6/experiences'
  }

  if (process.env.PORTAL_DOWNLOAD_COOKIE) {
    headers.cookie = process.env.PORTAL_DOWNLOAD_COOKIE
  }

  const res = await fetch(versionsUrl, { headers, cache: 'no-store' })
  const text = await res.text()

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Version endpoint did not return JSON: ${text.trim() || res.status}`)
  }

  const version = pickVersion(data)
  if (!version) throw new Error('Version endpoint JSON did not contain a known version field')

  return {
    currentVersion: String(version),
    source: versionsUrl,
    fetchedAt: new Date().toISOString()
  }
}

async function main () {
  let payload = emptyPayload()

  try {
    payload = await fetchVersion()
    console.log(`Portal SDK version: ${payload.currentVersion}`)
  } catch (err) {
    console.warn(`Portal SDK version unavailable: ${err instanceof Error ? err.message : String(err)}`)
  }

  await mkdir('.cache', { recursive: true })
  await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
