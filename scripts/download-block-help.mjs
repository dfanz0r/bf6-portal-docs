import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const strict = process.argv.includes('--strict')

const definitionsFile = '.vitepress/block-definitions.json'
// Cached blockly help files live under `.cache/blockly-help/` rather than
// `.vitepress/blockly-help/`. Cloudflare Pages' Build Cache automatically
// persists directories matching the patterns used by the framework-aware
// cache layer (Astro, Docusaurus, Eleventy, Gatsby, Hugo, Next.js, Nuxt,
// SvelteKit) — `.cache/` specifically is on that allow-list (Eleventy,
// Hugo, and Gatsby all use it). VitePress isn't in that framework list, so
// its own internal `.vitepress/cache` is NOT auto-preserved, but anything
// we put under `.cache/` is. This lets us skip re-downloading 517 CDN .md
// files on every build without committing them to git.
const helpDir = '.cache/blockly-help'
const manifestFile = path.join(helpDir, 'manifest.json')
// Last known site build id — used only if the live build id can't be discovered.
const fallbackBuildId = '13979158'

const requestHeaders = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
  'Origin': 'https://portal.battlefield.com',
  'Referer': 'https://portal.battlefield.com/bf6/experiences'
}

// The help files live under a per-deploy build id
// (portal.battlefield.com/bf6/<buildId>/assets/blockly/help). Discover the
// current id from the app page so help content tracks the live site.
async function discoverBaseHelpUrl () {
  try {
    const res = await fetch('https://portal.battlefield.com/bf6/experiences', { headers: requestHeaders })
    const html = await res.text()
    const buildId = html.match(/\bbf6\/(\d+)\//)?.[1]
    if (buildId) {
      console.log(`Using portal site build ${buildId} for block help files.`)
      return `https://portal.battlefield.com/bf6/${buildId}/assets/blockly/help`
    }
  } catch {
    // fall through to the last known build id
  }
  console.warn(`Could not discover the current portal build id; using ${fallbackBuildId}.`)
  return `https://portal.battlefield.com/bf6/${fallbackBuildId}/assets/blockly/help`
}

async function main () {
  const force = process.argv.includes('--force') || process.argv.includes('-f')
  const baseHelpUrl = await discoverBaseHelpUrl()

  // ── Check for cached files ────────────────────────────────────────────────
  // If help files already exist locally, skip the bulk CDN download.
  // (Strict mode still issues a single probe request to verify upstream
  // is reachable.) Cloudflare Pages build caching preserves .vitepress/
  // between builds, so this is fast on subsequent builds.

  if (!force && existsSync(manifestFile)) {
    let manifest = null
    try {
      manifest = JSON.parse(await readFile(manifestFile, 'utf8'))
    } catch {
      // manifest is corrupt, fall through to download
    }

    if (manifest && manifest.$schema !== baseHelpUrl) {
      console.log('Portal site build changed since the help cache was written — re-downloading.')
      manifest = null
    }

    if (manifest) {
      const fileCount = Object.keys(manifest).length - 1 // exclude $schema

      if (fileCount > 0) {
        // Verify that all manifest-listed files still exist locally.
        // A missing local file (cache eviction, partial restore, manual
        // deletion) means the cache is stale — fall through to re-download.
        const missing = []
        for (const name of Object.keys(manifest)) {
          if (name === '$schema') continue
          if (!existsSync(path.join(helpDir, `${name}.md`))) missing.push(name)
        }

        if (missing.length > 0) {
          console.log(`Cache incomplete: ${missing.length} manifest file(s) missing locally — re-downloading.`)
        } else {
          // Cache is complete. In strict mode, also verify the upstream
          // endpoint is still reachable before trusting the cache.
          if (strict) {
            const probeRes = await fetch(`${baseHelpUrl}/ruleBlock.md`, { headers: requestHeaders })
            if (!probeRes.ok) {
              throw new Error(`Block help endpoint unavailable: HTTP ${probeRes.status}`)
            }
            const probeContent = await probeRes.text()
            if (probeContent.startsWith('<!') || probeContent.startsWith('<html')) {
              throw new Error('Block help endpoint returned HTML instead of Markdown')
            }
          }

          console.log(`Found ${fileCount} cached help files in ${helpDir}/ — skipping download.`)
          console.log('  Use --force or -f to re-download from the CDN.')
          return
        }
      }
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

  // Build a fresh manifest
  /** @type {Record<string, string>} */
  const manifest = { $schema: baseHelpUrl }

  let downloaded = 0
  let notFound = 0
  let failed = 0
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
            const res = await fetch(url, { headers: requestHeaders })

            // 404 — file doesn't exist on the CDN (legitimate miss)
            if (res.status === 404) {
              return { name, status: 'notFound' }
            }

            // Transient error — retry with backoff
            if (!res.ok) {
              if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
                continue
              }
              return { name, status: 'failed' }
            }

            const content = await res.text()
            // Skip HTML error pages — non-fatal in dev (treat as missing),
            // but in strict mode this signals a real CDN problem.
            if (content.startsWith('<!') || content.startsWith('<html')) {
              return { name, status: strict ? 'failed' : 'notFound' }
            }

            await writeFile(filePath, content, 'utf8')

            // Store the ETag (if provided) for the manifest
            const etag = res.headers.get('etag')
            manifest[name] = etag || ''

            return { name, status: 'downloaded', size: content.length }
          } catch {
            if (attempt < maxRetries) {
              await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
              continue
            }
            return { name, status: 'failed' }
          }
        }

        return { name, status: 'failed' }
      })
    )

    for (const result of results) {
      if (result.status !== 'fulfilled' || !result.value) continue
      const { status, name, size } = result.value
      if (status === 'downloaded') {
        downloaded++
        console.log(`  ✓ ${name} (${size} bytes)`)
      } else if (status === 'notFound') {
        notFound++
      } else if (status === 'failed') {
        failed++
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

  if (notFound > 0) {
    console.log(`  (${notFound} blocks had no help file on the CDN — expected for some block types)`)
  }

  if (failed > 0) {
    console.log(`  (${failed} downloads failed after retries)`)
    if (strict) {
      throw new Error(`Failed to download ${failed} block help files`)
    }
  }

  if (strict) {
    // Catch the case where the CDN path is broken but every response is
    // a 200-with-HTML body or a 404 — strict mode should refuse to publish
    // a near-empty help cache. ruleBlock.md is the source of event
    // descriptions parsed by generate-block-reference.mjs, so it's the
    // canary file for the whole batch.
    if (downloaded === 0) {
      throw new Error('No block help files were downloaded')
    }
    if (!manifest.ruleBlock) {
      throw new Error('Required block help file missing: ruleBlock.md')
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
