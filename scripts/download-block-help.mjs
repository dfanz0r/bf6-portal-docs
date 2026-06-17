import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const definitionsFile = '.vitepress/block-definitions.json'
const helpDir = '.vitepress/blockly-help'
const manifestFile = path.join(helpDir, 'manifest.json')
const baseHelpUrl = 'https://portal.battlefield.com/bf6/13979158/assets/blockly/help'

async function main () {
  const force = process.argv.includes('--force') || process.argv.includes('-f')

  // ── Check for cached files ────────────────────────────────────────────────
  // If help files already exist locally, skip the CDN entirely.
  // Cloudflare Pages build caching preserves .vitepress/ between builds,
  // so this is fast on subsequent builds.

  if (!force && existsSync(manifestFile)) {
    try {
      const manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
      const fileCount = Object.keys(manifest).length - 1 // exclude $schema
      if (fileCount > 0) {
        console.log(`Found ${fileCount} cached help files in ${helpDir}/ — skipping download.`)
        console.log('  Use --force or -f to re-download from the CDN.')
        return
      }
    } catch {
      // manifest is corrupt, fall through to download
    }
  }

  console.log(`Reading block definitions from ${definitionsFile}...`)
  const raw = await readFile(definitionsFile, 'utf8')
  const data = JSON.parse(raw)

  // ── Collect expected block names ──────────────────────────────────────────

  const blockNames = new Set()

  for (const section of ['values', 'actions', 'objects', 'controlActions']) {
    for (const item of data[section] || []) {
      if (item.name) blockNames.add(item.name)
    }
  }

  for (const ev of data.events || []) {
    for (const p of ev.parameters || []) {
      if (p.name) blockNames.add(p.name)
    }
  }

  const extraBlocks = [
    'ruleBlock', 'conditionBlock', 'subroutineBlock',
    'subroutineInstanceBlock', 'subroutineArgumentBlock',
    'variableReferenceBlock',
    'modBlock',
    'controls_if_if', 'controls_if_elseif', 'controls_if_else',
    'controls_if', 'controls_whileUntil',
    'controls_for', 'controls_forEach',
    'controls_repeat', 'controls_repeat_ext',
    'controls_flow_statements',
    'procedures_defnoreturn', 'procedures_callnoreturn',
    'procedures_defreturn', 'procedures_callreturn',
    'procedures_ifreturn',
    'procedures_mutatorarg', 'procedures_mutatorcontainer',
    'variables_get', 'variables_set',
    'variables_get_dynamic', 'variables_set_dynamic',
    'GetVariable', 'SetVariable',
    'math_change',
    'ArrayContains', 'IndexOfArrayValue', 'RemoveFromArray',
    'Text', 'Number', 'Boolean',
    'Compare',
    'GetWaypointPath', 'AIIdleBehavior',
    'AIDefendPositionBehavior', 'AIBattlefieldBehavior',
    'forVariable', 'actionComment',
  ]

  for (const name of extraBlocks) {
    blockNames.add(name)
  }

  blockNames.delete('')
  blockNames.delete(null)
  blockNames.delete(undefined)

  const namesArray = [...blockNames].sort()
  console.log(`Checking ${namesArray.length} potential block type names...`)

  await mkdir(helpDir, { recursive: true })

  // ── Download from CDN ─────────────────────────────────────────────────────

  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Origin': 'https://portal.battlefield.com',
    'Referer': 'https://portal.battlefield.com/bf6/experiences'
  }

  // Build a fresh manifest
  /** @type {Record<string, string>} */
  const manifest = { $schema: baseHelpUrl }

  let downloaded = 0
  let errors = 0
  const maxRetries = 2

  // Process in parallel batches
  const batchSize = 20
  for (let i = 0; i < namesArray.length; i += batchSize) {
    const batch = namesArray.slice(i, i + batchSize)

    const results = await Promise.allSettled(
      batch.map(async (name) => {
        const url = `${baseHelpUrl}/${name}.md`
        const filePath = path.join(helpDir, `${name}.md`)

        // Retry loop for transient CDN errors
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            const res = await fetch(url, { headers })

            // 404 — file doesn't exist on the CDN
            if (res.status === 404) {
              return null
            }

            // Transient error — retry with backoff
            if (!res.ok) {
              if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
                continue
              }
              return null
            }

            const content = await res.text()
            // Skip HTML error pages
            if (content.startsWith('<!') || content.startsWith('<html')) {
              return null
            }

            await writeFile(filePath, content, 'utf8')

            // Store the ETag (if provided) for the manifest
            const etag = res.headers.get('etag')
            manifest[name] = etag || ''

            return { name, size: content.length }
          } catch {
            if (attempt < maxRetries) {
              await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
              continue
            }
            return null
          }
        }

        return null
      })
    )

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        downloaded++
        console.log(`  ✓ ${result.value.name} (${result.value.size} bytes)`)
      }
    }

    if (downloaded > 0 && downloaded % 50 === 0) {
      console.log(`  ... ${downloaded} files downloaded so far`)
    }

    // Small delay between batches to avoid rate limiting
    await new Promise(r => setTimeout(r, 100))
  }

  // ── Write manifest ────────────────────────────────────────────────────────
  await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n', 'utf8')

  console.log(`\nDone! Downloaded ${downloaded} help files to ${helpDir}/`)

  if (errors > 0) {
    console.log(`  (${errors} errors encountered)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
