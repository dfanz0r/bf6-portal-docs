import fs from 'node:fs'
import { createWriteStream } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { promisify } from 'node:util'
import { dirname, join } from 'node:path'

const execFileAsync = promisify(execFile)

const versionsUrl = 'https://download.portal.battlefield.com/versions.json'
const sdkDownloadUrl = 'https://download.portal.battlefield.com/PortalSDK.zip'
const cacheRoot = '.cache/portal-sdk'
// Keep the SDK version tracker inside `.cache/` so Cloudflare's Build Cache
// carries it across builds. See download-block-help.mjs for the rationale.
const sdkVersionOut = '.cache/sdk-version.json'
const apiReferenceOut = 'typescript-api-reference.md'

const scriptDir = dirname(new URL(import.meta.url).pathname)

const browserHeaders = {
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  accept: 'application/json,text/plain,*/*',
  'accept-language': 'en-US,en;q=0.9',
  origin: 'https://portal.battlefield.com',
  referer: 'https://portal.battlefield.com/bf6/experiences'
}

function pickRelease (data) {
  const latest = data?.versions?.[0]
  return {
    version: latest?.version ?? data?.version ?? data?.currentVersion ?? data?.latestVersion ?? null,
    fileSize: latest?.fileSize ?? data?.fileSize ?? null
  }
}

async function fetchLatestRelease () {
  const res = await fetch(versionsUrl, { headers: browserHeaders, cache: 'no-store' })
  const text = await res.text()

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Version endpoint did not return JSON: ${text.trim() || res.status}`)
  }

  const release = pickRelease(data)
  if (!release.version) throw new Error('Version endpoint JSON did not include a version')
  return release
}

async function fileExistsWithSize (path, expectedSize) {
  try {
    const stats = await stat(path)
    if (!expectedSize) return stats.size > 0

    // The SDK endpoint and versions.json can disagree by a few bytes because
    // the version metadata is not the authoritative content-length header.
    return Math.abs(stats.size - Number(expectedSize)) < 1024
  } catch {
    return false
  }
}

async function downloadFile (url, outPath, expectedSize) {
  await mkdir(dirname(outPath), { recursive: true })

  if (await fileExistsWithSize(outPath, expectedSize)) {
    console.log(`Using cached SDK: ${outPath}`)
    return
  }

  console.log(`Downloading Portal SDK to ${outPath}`)
  const res = await fetch(url, { headers: browserHeaders })
  if (!res.ok || !res.body) throw new Error(`SDK download failed: HTTP ${res.status}`)

  await pipeline(Readable.fromWeb(res.body), createWriteStream(outPath))

  if (!(await fileExistsWithSize(outPath, expectedSize))) {
    console.warn('SDK download finished, but file size did not closely match versions.json metadata')
  }
}

async function listZipFiles (zipPath) {
  const { stdout } = await execFileAsync('unzip', ['-Z1', zipPath], { maxBuffer: 1024 * 1024 * 20 })
  return stdout.split('\n').map((line) => line.trim()).filter(Boolean)
}

async function readZipFile (zipPath, filePath) {
  const { stdout } = await execFileAsync('unzip', ['-p', zipPath, filePath], { maxBuffer: 1024 * 1024 * 5 })
  return stdout
}

function normalizeSignature (value) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*;$/, '')
    .replace(/^export\s+async\s+function\s+/, 'async ')
    .replace(/^export\s+function\s+/, '')
    .replace(/^export\s+class\s+/, 'class ')
    .replace(/^export\s+/, '')
    .trim()
}

function escapeTable (value) {
  return String(value).replace(/\|/g, '\\|').replace(/\n/g, '<br>')
}

function splitTopLevelParams (params) {
  const result = []
  let current = ''
  let depth = 0

  for (const char of params) {
    if (char === '<' || char === '(' || char === '[' || char === '{') depth++
    if (char === '>' || char === ')' || char === ']' || char === '}') depth--

    if (char === ',' && depth === 0) {
      result.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  if (current.trim()) result.push(current.trim())
  return result
}

function formatSignatureForDocs (signature) {
  if (signature.length <= 100) return signature

  const match = signature.match(/^(async\s+)?([A-Za-z0-9_]+)(<[^>]+>)?\((.*)\)(:\s*.+)?$/)
  if (!match) return signature

  const [, asyncPrefix = '', name, generic = '', paramsText, returnType = ''] = match
  const params = splitTopLevelParams(paramsText)

  if (params.length <= 1) return signature

  return `${asyncPrefix}${name}${generic}(\n  ${params.join(',\n  ')}\n)${returnType}`
}

function extractLeadingComment (content, index) {
  const before = content.slice(0, index).replace(/\s+$/, '')
  if (!before) return ''

  const blockMatch = before.match(/\/\*\*([\s\S]*?)\*\/$/)
  if (blockMatch) {
    return blockMatch[1]
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean)
      .join(' ')
  }

  const lines = before.split('\n')
  const comments = []

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim()
    if (!line.startsWith('//')) break

    const comment = line.replace(/^\/\/\s?/, '').trim()
    if (/^-+$/.test(comment)) continue
    comments.unshift(comment)
  }

  return comments.join(' ')
}

function parseExportedFunctions (content, source, captureBody) {
  const entries = []
  const regex = /(^|\n)\s*export\s+(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(/g
  let match

  while ((match = regex.exec(content))) {
    const name = match[2]
    let sigEnd = match.index + match[0].indexOf('export')
    const endChars = source.includes('.d.ts') ? [';'] : ['{']

    while (sigEnd < content.length && !endChars.includes(content[sigEnd])) sigEnd++

    const signature = normalizeSignature(content.slice(match.index + match[0].indexOf('export'), sigEnd + 1).replace(/\s*\{$/, ''))
    const description = extractLeadingComment(content, match.index)

    let body = ''
    let bodyEnd = sigEnd
    if (captureBody && content[sigEnd] === '{') {
      let depth = 1
      let i = sigEnd + 1
      while (i < content.length && depth > 0) {
        if (content[i] === '{') depth++
        if (content[i] === '}') depth--
        i++
      }
      body = content.slice(sigEnd + 1, i - 1)
      bodyEnd = i
    }

    entries.push({ name, signature, description, source, body })
    if (captureBody && body) regex.lastIndex = bodyEnd
  }

  return entries
}

function parseLocalInterfaces (content) {
  const entries = []
  const regex = /(^|\n)\s*interface\s+([A-Za-z0-9_]+)\s*\{/g
  let match

  while ((match = regex.exec(content))) {
    const name = match[2]
    const start = regex.lastIndex
    let depth = 1
    let index = start

    while (index < content.length && depth > 0) {
      if (content[index] === '{') depth++
      if (content[index] === '}') depth--
      index++
    }

    const body = content.slice(start, index - 1)
    const lines = body.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//') && !l.startsWith('*'))
    entries.push({ name, members: lines })
    regex.lastIndex = index
  }

  return entries
}

function parseLocalTypes (content) {
  const entries = []
  const regex = /(^|\n)\s*type\s+([A-Za-z0-9_]+)\s*=\s*([^;]+);/g
  let match

  while ((match = regex.exec(content))) {
    entries.push({ name: match[2], signature: `type ${match[2]} = ${match[3].trim()}` })
  }

  return entries
}

function parseExportedTypes (content, source) {
  const entries = []
  const regex = /(^|\n)\s*export\s+type\s+([A-Za-z0-9_]+)\s*=\s*([^;]+);/g
  let match

  while ((match = regex.exec(content))) {
    entries.push({ name: match[2], signature: normalizeSignature(`type ${match[2]} = ${match[3]}`), description: extractLeadingComment(content, match.index), source })
  }

  return entries
}

function parseExportedClasses (content, source) {
  const entries = []
  const regex = /(^|\n)\s*export\s+class\s+([A-Za-z0-9_]+)\s*\{/g
  let match

  while ((match = regex.exec(content))) {
    const name = match[2]
    const start = regex.lastIndex
    let depth = 1
    let index = start

    while (index < content.length && depth > 0) {
      if (content[index] === '{') depth++
      if (content[index] === '}') depth--
      index++
    }

    const body = content.slice(start, index - 1)
    const members = parseClassMembers(body)

    entries.push({ name, signature: `class ${name}`, description: extractLeadingComment(content, match.index), source, members })
    regex.lastIndex = index
  }

  return entries
}

function parseClassMembers (body) {
  const members = []
  const keywords = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'return',
    'throw', 'try', 'catch', 'finally', 'new', 'delete', 'typeof', 'instanceof',
    'in', 'of', 'break', 'continue', 'debugger', 'export', 'import', 'class',
    'extends', 'implements', 'interface', 'type', 'namespace', 'module',
    'var', 'let', 'const', 'function', 'async', 'await', 'yield'])

  // Remove comments first to avoid false matches
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
  const lines = clean.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('}') || trimmed.startsWith('{')) continue

    // Match public/static methods, getters, setters, constructors
    let memberMatch = trimmed.match(
      /^(?:public\s+)?(?:static\s+)?(?:get\s+([A-Za-z_][A-Za-z0-9_]*)|set\s+([A-Za-z_][A-Za-z0-9_]*)|constructor|([A-Za-z_][A-Za-z0-9_]*)\s*\()/
    )

    if (memberMatch) {
      const name = memberMatch[3]
      // Skip if it's a reserved keyword (e.g., `if(...)`)
      if (name && keywords.has(name)) continue

      const isConstructor = trimmed.startsWith('constructor')
      let sig = isConstructor ? 'constructor' : ''

      if (!isConstructor) {
        const isGet = memberMatch[1] !== undefined
        const isSet = memberMatch[2] !== undefined
        sig = isGet ? `get ${memberMatch[1]}` : isSet ? `set ${memberMatch[2]}` : name
      }

      // Extract full signature (parameters, return type)
      const sigMatch = trimmed.match(/\([^)]*\)(?:\s*:\s*[^;{]+)?/)
      if (sigMatch) sig += sigMatch[0]

      members.push(sig.trim())
    } else if (!trimmed.includes('(') && !trimmed.startsWith('this.')) {
      // Property declaration: name: type
      const propMatch = trimmed.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([A-Za-z_][\w<>[\],\s|&]+)/)
      if (propMatch) {
        members.push(`${propMatch[1]}: ${propMatch[2]}`)
      }
    }
  }

  return members
}

function parseExportedEnums (content, source) {
  const entries = []
  const regex = /(^|\n)\s*export\s+enum\s+([A-Za-z0-9_]+)\s*\{/g
  let match

  while ((match = regex.exec(content))) {
    const name = match[2]
    const start = regex.lastIndex
    let depth = 1
    let index = start

    while (index < content.length && depth > 0) {
      if (content[index] === '{') depth++
      if (content[index] === '}') depth--
      index++
    }

    const body = content.slice(start, index - 1)
    const values = body
      .split('\n')
      .map((line) => line.trim().replace(/,$/, ''))
      .filter((line) => line && !line.startsWith('//'))

    entries.push({ name, values, count: values.length, description: extractLeadingComment(content, match.index), source })
    regex.lastIndex = index
  }

  return entries
}

function groupByName (entries) {
  return entries.reduce((groups, entry) => {
    groups[entry.name] ??= []
    groups[entry.name].push(entry)
    return groups
  }, {})
}

function extractNamespaceBody (content, namespaceName) {
  const namespaceStart = content.search(new RegExp(`namespace\\s+${namespaceName}\\s*\\{`))
  if (namespaceStart === -1) return ''

  const openBrace = content.indexOf('{', namespaceStart)
  let depth = 1
  let index = openBrace + 1

  while (index < content.length && depth > 0) {
    if (content[index] === '{') depth++
    if (content[index] === '}') depth--
    index++
  }

  return content.slice(openBrace + 1, index - 1)
}

function removeNamespaceBlock (content, namespaceName) {
  const namespaceStart = content.search(new RegExp(`namespace\\s+${namespaceName}\\s*\\{`))
  if (namespaceStart === -1) return content

  const openBrace = content.indexOf('{', namespaceStart)
  let depth = 1
  let index = openBrace + 1

  while (index < content.length && depth > 0) {
    if (content[index] === '{') depth++
    if (content[index] === '}') depth--
    index++
  }

  return `${content.slice(0, namespaceStart)}${content.slice(index)}`
}

function renderFunctionEntry ([name, overloads], headingLevel = 3) {
  const heading = '#'.repeat(headingLevel)
  const description = overloads.find((entry) => entry.description)?.description
  const signatures = overloads
    .map((entry) => `\`\`\`ts\n${formatSignatureForDocs(entry.signature)}\n\`\`\``)
    .join('\n\n')

  return `${heading} ${name}\n\n${description ? `${description}\n\n` : ''}${signatures}\n`
}

function functionCategory (name, overloads = []) {
  const signatures = overloads.map((entry) => entry.signature).join(' ')
  const text = `${name} ${signatures}`

  const rules = [
    ['UI', /\b(UIWidget|UIAnchor|UIBgFill|UIDepth|UIImageType)\b|\b(AddUI|RemoveUI|DeleteUI|DeleteAllUI|FindUI|SetUI|GetUI|EnableUI|DisableUI|ShowUI|HideUI)/],
    ['World Icons', /\bWorldIcon\b|WorldIcon|UIIcon/],
    ['AI', /\bAISpawner\b|\bAI\b|^AI|AI[A-Z]|AIs/],
    ['Notifications', /\bCustomNotificationSlots\b|Notification|CustomNotification/],
    ['Scoreboard', /Scoreboard/],
    ['Messages', /\bMessage\b|Message|String|Text/],
    ['Arrays', /ValueInArray|AppendToArray|EmptyArray|ArraySlice|RandomValueInArray|RandomizedArray|SortedArray|FilteredArray|CountOf|FirstOf|LastOf/],
    ['Objectives & Map Features', /(CapturePoints?|MCOM|HQ|Sector|MapSpecificFeature|InteractPoint|AreaTrigger|WaypointPath|LootSpawner|RingOfFire|VL7Cloud)/],
    ['Vehicles', /\b(Vehicle|VehicleSpawner|EmplacementSpawner)\b|Vehicle|Seat/],
    ['Audio & Effects', /\b(MusicPackages|MusicEvents|MusicParams|SFX|VFX|VO|ScreenEffects|SoldierEffects)\b|Music|Sound|Effect|PlayVO/],
    ['Teams & Squads', /\b(Team|Squad|Factions)\b/],
    ['Players', /\b(Player|SoldierClass|SoldierStateBool|SoldierStateNumber|SoldierStateVector|Weapons|Gadgets|WeaponPackage|WeaponUnlock|WeaponAttachments|InventorySlots|DamageType|DeathType|ArmorTypes)\b|Player|Players/],
    ['Spawning', /\b(Spawner|SpawnPoint)\b|Spawn|Unspawn|RuntimeSpawn/],
    ['Game Flow', /GameMode|Round|Match|Ticket|End|Start|Pause|Resume/],
    ['Input', /\b(AiInput|RestrictedInputs)\b|Input/],
    ['Variables', /\bVariable\b|Variable/],
    ['Math & Logic', /^(Add|Subtract|Multiply|Divide|Modulo|Normalize|Dot|Cross|Absolute|Clamp|Max|Min|Random|RaiseToPower|SquareRoot|Pi|Equals|Greater|Less|And|Or|Xor|Not|IfThenElse|Boolean|Number|Arc|Arcsine|Arccosine|Arctangent|Sine|Cosine|Tangent|Degrees|Radians|Ceiling|Floor|Round|Angle)/],
    ['Objects & Spatial', /\b(Object|SpatialObject|Transform|Vector)\b|Spatial|Position|Rotation|Distance|Raycast|Location|Teleport/]
  ]

  const categoryOverrides = JSON.parse(fs.readFileSync(join(scriptDir, 'category-overrides.json'), 'utf8'))

  if (categoryOverrides[name]) return categoryOverrides[name]

  return rules.find(([, regex]) => regex.test(text))?.[0] ?? 'Other'
}

function renderCategorizedFunctionReference (title, entries) {
  const grouped = Object.entries(groupByName(entries)).sort(([a], [b]) => a.localeCompare(b))
  if (!grouped.length) return `## ${title}\n\nNo exported functions found.\n`

  // Categorize each overload individually, then re-group by name within each category
  const byCategory = {}
  for (const [name, overloads] of grouped) {
    for (const overload of overloads) {
      const category = functionCategory(name, [overload])
      byCategory[category] ??= {}
      byCategory[category][name] ??= []
      byCategory[category][name].push(overload)
    }
  }

  // Sort function names within each category
  for (const category of Object.keys(byCategory)) {
    byCategory[category] = Object.entries(byCategory[category]).sort(([a], [b]) => a.localeCompare(b))
  }

  const order = [
    'UI',
    'World Icons',
    'AI',
    'Notifications',
    'Scoreboard',
    'Messages',
    'Players',
    'Vehicles',
    'Objects & Spatial',
    'Objectives & Map Features',
    'Spawning',
    'Audio & Effects',
    'Teams & Squads',
    'Game Flow',
    'Arrays',
    'Variables',
    'Input',
    'Math & Logic',
    'Other'
  ]

  return `## ${title}\n\n${order
    .filter((category) => byCategory[category]?.length)
    .map((category) => `### ${category}\n\n::: details Toggle\n\n${byCategory[category].map((group) => renderFunctionEntry(group, 4)).join('\n')}\n:::`)
    .join('\n\n')}`
}

function renderFunctionReference (title, entries, headingLevel = 3) {
  const groups = Object.entries(groupByName(entries)).sort(([a], [b]) => a.localeCompare(b))
  if (!groups.length) return `## ${title}\n\nNo exported functions found.\n`

  return `## ${title}\n\n${groups.map((group) => renderFunctionEntry(group, headingLevel)).join('\n')}`
}

function renderModlibFunctionReference (title, entries, typeLookup) {
  const groups = Object.entries(groupByName(entries)).sort(([a], [b]) => a.localeCompare(b))
  if (!groups.length) return `## ${title}\n\nNo exported functions found.\n`

  return `## ${title}\n\n${groups.map(([name, overloads]) => {
    // Check signature and body for local type references
    const text = overloads.map((o) => `${o.signature} ${o.body || ''}`).join(' ')
    const refs = Object.keys(typeLookup).filter((iface) => text.includes(iface))

    let extra = ''
    if (refs.length) {
      extra = refs.map((typeName) => {
        const entry = typeLookup[typeName]
        if (entry.kind === 'interface') {
          return `\n\n**${typeName}**\n\n\`\`\`ts\ninterface ${typeName} {\n${entry.members.map((m) => `    ${m.replace(/;$/, '')}`).join(';\n')}\n}\n\`\`\``
        } else {
          return `\n\n**${typeName}**\n\n\`\`\`ts\n${entry.signature}\n\`\`\``
        }
      }).join('\n\n')
    }

    return renderFunctionEntry([name, overloads], 4) + extra
  }).join('\n')}`
}

function renderTypesReference (entries) {
  if (!entries.length) return '## Types\n\nNo exported types found.\n'

  const opaqueTypes = entries
    .filter((entry) => entry.signature.includes('_opaque'))
    .sort((a, b) => a.name.localeCompare(b.name))

  const typeAliases = entries
    .filter((entry) => !entry.signature.includes('_opaque'))
    .filter((entry) => entry.name === 'Object')
    .sort((a, b) => a.name.localeCompare(b.name))

  const opaqueSection = opaqueTypes.length
    ? `### SDK Object Types\n\nThese are opaque SDK handles. You generally only need the type name when reading function signatures.\n\n${opaqueTypes.map((entry) => `- \`${entry.name}\``).join('\n')}`
    : ''

  const aliasesSection = typeAliases.length
    ? `### Type Aliases\n\n${typeAliases
      .map((entry) => {
        if (entry.name === 'Object') {
          const objectTypes = entry.signature
            .replace(/^type Object =\s*/, '')
            .split('|')
            .map((value) => value.trim())
            .filter(Boolean)

          return `#### Object\n\n\`Object\` is a generic SDK object handle. It can refer to any of these Portal object types:\n\n${objectTypes.map((value) => `- \`${value}\``).join('\n')}`
        }

        return `#### ${entry.name}\n\n${entry.description ? `${entry.description}\n\n` : ''}\`\`\`ts\n${entry.signature}\n\`\`\``
      })
      .join('\n\n')}`
    : ''

  return `## Types\n\n${[opaqueSection, aliasesSection].filter(Boolean).join('\n\n')}\n`
}

function renderEnumReference (entries) {
  if (!entries.length) return '## Enums\n\nNo exported enums found.\n'

  return `## Enums\n\n${entries.sort((a, b) => a.name.localeCompare(b.name)).map((entry) => {
    const values = entry.count > 80
      ? `${entry.values.slice(0, 80).map((value) => `  ${value},`).join('\n')}\n  // Only the first 80 values are shown.`
      : entry.values.map((value) => `  ${value},`).join('\n')

    return `<details>\n<summary><strong>${entry.name}</strong> (${entry.count} values)</summary>\n\n${entry.description ? `${entry.description}\n\n` : ''}\`\`\`ts\nenum ${entry.name} {\n${values}\n}\n\`\`\`\n\n</details>`
  }).join('\n\n')}\n`
}

function renderClassReference (entries) {
  if (!entries.length) return '## Modlib Classes\n\nNo exported classes found.\n'

  return `## Modlib Classes\n\n${entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => {
      const members = entry.members?.length
        ? ` {\n${entry.members.map((m) => `    ${m}`).join(';\n')};\n}`
        : ''

      const fullSig = entry.signature + members

      return `#### ${entry.name}\n\n${entry.description ? `${entry.description}\n\n` : ''}\`\`\`ts\n${fullSig}\n\`\`\`\n\nSource: \`${entry.source}\``
    })
    .join('\n\n')}\n`
}

async function generateApiReference (zipPath, release) {
  let modTypes = ''
  let modlib = ''

  try {
    modTypes = await readZipFile(zipPath, 'code/types/mod/index.d.ts')
    modlib = await readZipFile(zipPath, 'code/modlib/index.ts')
  } catch (err) {
    await writeFile(apiReferenceOut, `# TypeScript API Reference\n\nSDK version: **${release.version}**\n\nCould not inspect the SDK zip. Make sure \`unzip\` is installed.\n\nError: ${err instanceof Error ? err.message : String(err)}\n`, 'utf8')
    return
  }

  const eventHandlerTypes = extractNamespaceBody(modTypes, 'EventHandlerSignatures')
  const modTypesWithoutEventHandlers = removeNamespaceBlock(modTypes, 'EventHandlerSignatures')

  const eventHandlers = parseExportedFunctions(eventHandlerTypes, 'code/types/mod/index.d.ts#EventHandlerSignatures')
  const modFunctions = parseExportedFunctions(modTypesWithoutEventHandlers, 'code/types/mod/index.d.ts')
  const modTypesList = parseExportedTypes(modTypes, 'code/types/mod/index.d.ts')
  const modEnums = parseExportedEnums(modTypes, 'code/types/mod/index.d.ts')
  const modlibFunctions = parseExportedFunctions(modlib, 'code/modlib/index.ts', true)
  const modlibClasses = parseExportedClasses(modlib, 'code/modlib/index.ts')
  const modlibInterfaces = parseLocalInterfaces(modlib)
  const modlibLocalTypes = parseLocalTypes(modlib)
  const modlibInterfaceLookup = Object.fromEntries(modlibInterfaces.map((iface) => [iface.name, { kind: 'interface', members: iface.members }]))
  const modlibLocalTypeLookup = Object.fromEntries(modlibLocalTypes.map((t) => [t.name, { kind: 'type', signature: t.signature }]))
  const modlibTypeLookup = { ...modlibInterfaceLookup, ...modlibLocalTypeLookup }

  const body = [
    `## Summary\n\n| Category | Count |\n| --- | ---: |\n| event handlers | ${Object.keys(groupByName(eventHandlers)).length} |\n| mod functions | ${Object.keys(groupByName(modFunctions)).length} |\n| mod function overloads | ${modFunctions.length} |\n| mod types | ${modTypesList.length} |\n| mod enums | ${modEnums.length} |\n| modlib functions | ${modlibFunctions.length} |\n| modlib classes | ${modlibClasses.length} |`,
    renderCategorizedFunctionReference('mod Functions', modFunctions),
    renderFunctionReference('Event Handlers', eventHandlers, 4),
    renderTypesReference(modTypesList),
    renderEnumReference(modEnums),
    renderModlibFunctionReference('Modlib Functions', modlibFunctions, modlibTypeLookup),
    renderClassReference(modlibClasses)
  ].join('\n\n')

  await writeFile(apiReferenceOut, `---\noutline: [2, 3]\n---\n\n<script setup>\nimport { nextTick, onMounted, ref, watch } from 'vue'\n\nconst apiFilter = ref('')\nconst categoryNames = ['UI', 'World Icons', 'AI', 'Notifications', 'Scoreboard', 'Messages', 'Players', 'Vehicles', 'Objects & Spatial', 'Objectives & Map Features', 'Spawning', 'Audio & Effects', 'Teams & Squads', 'Game Flow', 'Arrays', 'Variables', 'Input', 'Math & Logic', 'Other']\n\nfunction isCodeBlock (node) {\n  return [...node.classList].some((className) => className.startsWith('language-'))\n}\n\nfunction collectEntryNodes (heading) {\n  const nodes = [heading]\n  let current = heading.nextElementSibling\n\n  while (current && !['H2', 'H3', 'H4'].includes(current.tagName)) {\n    nodes.push(current)\n    current = current.nextElementSibling\n  }\n\n  return nodes\n}\n\nfunction applyApiFilter () {\n  const query = apiFilter.value.trim().toLowerCase()\n  const root = document.querySelector('.vp-doc')\n  if (!root) return\n\n  const entryHeadings = [...root.querySelectorAll('h4, h3')].filter((heading) => {\n    return heading.textContent && !categoryNames.includes(heading.textContent.trim())\n  })\n\n  for (const heading of entryHeadings) {\n    const nodes = collectEntryNodes(heading)\n    const codeBlocks = nodes.filter(isCodeBlock)\n    const metaText = nodes\n      .filter((node) => !isCodeBlock(node))\n      .map((node) => node.textContent ?? '')\n      .join(' ')\n      .toLowerCase()\n\n    const metaMatches = !query || metaText.includes(query)\n    const matchingCodeBlocks = codeBlocks.filter((node) => (node.textContent ?? '').toLowerCase().includes(query))\n    const visible = !query || metaMatches || matchingCodeBlocks.length > 0\n\n    for (const node of nodes) {\n      if (isCodeBlock(node) && query && !metaMatches) {\n        node.classList.toggle('api-filter-hidden', !(node.textContent ?? '').toLowerCase().includes(query))\n      } else {\n        node.classList.toggle('api-filter-hidden', !visible)\n      }\n    }\n  }\n\n  const enumDetails = [...root.querySelectorAll('details')].filter((details) => {\n    return !details.classList.contains('custom-block')\n  })\n\n  for (const details of enumDetails) {\n    const text = (details.textContent ?? '').toLowerCase()\n    const visible = !query || text.includes(query)\n    details.classList.toggle('api-filter-hidden', !visible)\n    if (query && visible) details.open = true\n  }\n\n  const categoryHeadings = [...root.querySelectorAll('h3')].filter((heading) => {\n    return categoryNames.includes(heading.textContent?.trim() ?? '')\n  })\n\n  for (const heading of categoryHeadings) {\n    const category = heading.closest('details.custom-block.details')\n    const searchRoot = category ?? heading.parentElement\n    const hasVisibleEntry = !!searchRoot?.querySelector('h4:not(.api-filter-hidden)')\n\n    if (category) {\n      category.classList.toggle('api-filter-hidden', query && !hasVisibleEntry)\n      heading.classList.toggle('api-filter-hidden', query && !hasVisibleEntry)\n      if (query && hasVisibleEntry) category.open = true\n    } else {\n      const siblingCategory = heading.nextElementSibling?.matches?.('details.custom-block.details') ? heading.nextElementSibling : null\n      const siblingHasVisibleEntry = !!siblingCategory?.querySelector('h4:not(.api-filter-hidden)')\n\n      heading.classList.toggle('api-filter-hidden', query && !siblingHasVisibleEntry)\n      siblingCategory?.classList.toggle('api-filter-hidden', query && !siblingHasVisibleEntry)\n      if (query && siblingHasVisibleEntry) siblingCategory.open = true\n    }\n  }\n}\n\nfunction closedDetailsHeight (details, summary) {
  const styles = window.getComputedStyle(details)
  return summary.offsetHeight +
    parseFloat(styles.paddingTop) +
    parseFloat(styles.paddingBottom) +
    parseFloat(styles.borderTopWidth) +
    parseFloat(styles.borderBottomWidth)
}

function animateDetailsOpen (details, summary) {
  details.classList.add('api-animating')
  details.open = true

  const startHeight = closedDetailsHeight(details, summary)
  const endHeight = details.scrollHeight

  const animation = details.animate([
    { height: startHeight + 'px' },
    { height: endHeight + 'px' }
  ], {
    duration: 220,
    easing: 'ease'
  })

  animation.onfinish = () => {
    details.classList.remove('api-animating')
    details.style.height = ''
  }
}

function animateDetailsClose (details, summary) {
  details.classList.add('api-animating')

  const startHeight = details.offsetHeight
  const endHeight = closedDetailsHeight(details, summary)

  const animation = details.animate([
    { height: startHeight + 'px' },
    { height: endHeight + 'px' }
  ], {
    duration: 220,
    easing: 'ease'
  })

  animation.onfinish = () => {
    details.open = false
    details.classList.remove('api-animating')
    details.style.height = ''
  }
}

function setupDetailsAnimations () {
  const detailsBlocks = [...document.querySelectorAll('details.custom-block.details')]

  for (const details of detailsBlocks) {
    const summary = details.querySelector('summary')
    if (!summary || details.dataset.animationReady) continue

    details.dataset.animationReady = 'true'
    details.open = true

    summary.addEventListener('click', (event) => {
      event.preventDefault()
      if (details.classList.contains('api-animating')) return

      if (details.open) {
        animateDetailsClose(details, summary)
      } else {
        animateDetailsOpen(details, summary)
      }
    })
  }
}

onMounted(() => nextTick(() => {
  setupDetailsAnimations()
  applyApiFilter()
}))
watch(apiFilter, () => nextTick(applyApiFilter))\n</script>\n\n# TypeScript API Reference\n\nSDK version: **${release.version}**\n\nThis page is generated from the SDK's \`code/types/mod/index.d.ts\` and \`code/modlib/index.ts\` files.\n\n<div class=\"api-filter\">\n  <label for=\"api-filter-input\">Filter API</label>\n  <input id=\"api-filter-input\" v-model=\"apiFilter\" type=\"search\" placeholder=\"Search functions, types, comments, signatures...\" />\n</div>\n\n${body}\n`, 'utf8')
}

async function main () {
  const release = await fetchLatestRelease()
  const fetchedAt = new Date().toISOString()
  const versionDir = join(cacheRoot, release.version)
  const zipPath = join(versionDir, 'PortalSDK.zip')

  await mkdir('.cache', { recursive: true })
  await writeFile(sdkVersionOut, `${JSON.stringify({
    currentVersion: release.version,
    fileSize: release.fileSize,
    source: versionsUrl,
    sdkDownloadUrl,
    fetchedAt
  }, null, 2)}\n`, 'utf8')

  await downloadFile(sdkDownloadUrl, zipPath, release.fileSize)
  await generateApiReference(zipPath, release)

  console.log(`Generated ${apiReferenceOut} from SDK ${release.version}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
