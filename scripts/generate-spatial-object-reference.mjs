import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join } from 'node:path'

const execFileAsync = promisify(execFile)

const strict = process.argv.includes('--strict')
const definitionsFile = '.vitepress/block-definitions.json'
const sdkVersionFile = '.cache/sdk-version.json'
const sdkCacheRoot = '.cache/portal-sdk'
const outFile = 'spatial-object-reference.md'
const dataOutFile = 'public/spatial-object-data.json'
const thumbnailOutDir = 'public/spatial-thumbnails'

function escapeTable (value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>')
}

function spatialObjectAnchor (name) {
  return `spatial-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

function formatMapName (runtimeSpawnName) {
  return runtimeSpawnName.replace(/^RuntimeSpawn_/, '')
}

function mapLink (listName) {
  return `[${formatMapName(listName)}](#${spatialObjectAnchor(listName)})`
}

function constantLookup (asset) {
  return Object.fromEntries((asset.constants || []).map((constant) => [constant.name, constant.value]))
}

async function listZipFiles (zipPath) {
  const { stdout } = await execFileAsync('unzip', ['-Z1', zipPath], { maxBuffer: 1024 * 1024 * 50 })
  return stdout.split('\n').map((line) => line.trim()).filter(Boolean)
}

async function readZipFile (zipPath, filePath) {
  const { stdout } = await execFileAsync('unzip', ['-p', zipPath, filePath], { maxBuffer: 1024 * 1024 * 50 })
  return stdout
}

async function findSdkZip () {
  if (!existsSync(sdkVersionFile)) return null

  try {
    const versionInfo = JSON.parse(await readFile(sdkVersionFile, 'utf8'))
    if (!versionInfo.currentVersion) return null

    const zipPath = join(sdkCacheRoot, versionInfo.currentVersion, 'PortalSDK.zip')
    return existsSync(zipPath) ? { zipPath, version: versionInfo.currentVersion } : null
  } catch {
    return null
  }
}

async function ensureExtractedThumbnails (zipPath, sdkVersion) {
  const markerFile = join(thumbnailOutDir, '.sdk-version')

  if (existsSync(markerFile)) {
    try {
      const marker = (await readFile(markerFile, 'utf8')).trim()
      if (marker === sdkVersion) return
    } catch {
      // fall through and re-extract
    }
  }

  console.log(`Extracting SDK thumbnails to ${thumbnailOutDir}/`)
  await rm(thumbnailOutDir, { recursive: true, force: true })
  await mkdir(thumbnailOutDir, { recursive: true })
  await execFileAsync('unzip', ['-j', '-oq', zipPath, 'FbExportData/thumbnails/*.png', '-d', thumbnailOutDir], { maxBuffer: 1024 * 1024 * 10 })
  await writeFile(markerFile, `${sdkVersion}\n`, 'utf8')
}

async function readSdkSpatialMetadata () {
  const sdk = await findSdkZip()
  if (!sdk) {
    if (strict) throw new Error('Portal SDK zip is required for strict spatial object metadata generation')
    console.warn('Portal SDK zip unavailable; generating spatial reference without SDK metadata')
    return { assets: new Map(), thumbnails: new Set(), sdkVersion: null }
  }

  try {
    const [assetTypesText, files] = await Promise.all([
      readZipFile(sdk.zipPath, 'FbExportData/asset_types.json'),
      listZipFiles(sdk.zipPath)
    ])

    await ensureExtractedThumbnails(sdk.zipPath, sdk.version)

    const assetTypes = JSON.parse(assetTypesText).AssetTypes || []
    const assets = new Map()

    for (const asset of assetTypes) {
      if (!asset.type) continue
      const constants = constantLookup(asset)
      assets.set(asset.type, {
        type: asset.type,
        directory: asset.directory || '',
        category: constants.category || '',
        mesh: constants.mesh || '',
        physicsCost: constants.physicsCost ?? null,
        hasInteractables: constants.hasInteractables ?? null,
        levelRestrictions: asset.levelRestrictions || [],
        propertyCount: (asset.properties || []).length
      })
    }

    const thumbnails = new Set(
      files
        .filter((file) => file.startsWith('FbExportData/thumbnails/') && file.toLowerCase().endsWith('.png'))
        .map((file) => file.replace(/^FbExportData\/thumbnails\//, '').replace(/\.png$/i, ''))
    )

    return { assets, thumbnails, sdkVersion: sdk.version }
  } catch (err) {
    const message = `Failed to read spatial object metadata from SDK: ${err instanceof Error ? err.message : String(err)}`
    if (strict) throw new Error(message)
    console.warn(message)
    return { assets: new Map(), thumbnails: new Set(), sdkVersion: null }
  }
}

function metadataForObject (sdkMetadata, objectName) {
  const asset = sdkMetadata.assets.get(objectName)
  return {
    directory: asset?.directory || '',
    physicsCost: asset?.physicsCost ?? null,
    hasInteractables: asset?.hasInteractables ?? null,
    levelRestrictions: asset?.levelRestrictions || [],
    propertyCount: asset?.propertyCount ?? null,
    hasThumbnail: sdkMetadata.thumbnails.has(objectName)
  }
}

function formatPhysicsCost (value) {
  return value === null || value === undefined ? '—' : String(value)
}

function formatBooleanish (value) {
  if (value === null || value === undefined || value === '') return '—'
  return value ? 'Yes' : 'No'
}

function thumbnailStatus (hasThumbnail) {
  return hasThumbnail ? 'Yes' : '—'
}

async function main () {
  const raw = await readFile(definitionsFile, 'utf8')
  const data = JSON.parse(raw)
  const sdkMetadata = await readSdkSpatialMetadata()

  const spatialLists = (data.selectionLists || [])
    .filter((list) => list.name?.startsWith('RuntimeSpawn_'))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (spatialLists.length === 0) {
    throw new Error('No RuntimeSpawn selection lists found in block definitions')
  }

  const objectToLists = new Map()
  let totalEntries = 0

  for (const list of spatialLists) {
    const values = list.selectionValues || []
    totalEntries += values.length

    for (const value of values) {
      if (!value.name) continue
      if (!objectToLists.has(value.name)) objectToLists.set(value.name, [])
      objectToLists.get(value.name).push(list.name)
    }
  }

  const objectRows = [...objectToLists.entries()]
    .map(([objectName, listNames]) => ({
      objectName,
      listNames: listNames.sort((a, b) => a.localeCompare(b)),
      metadata: metadataForObject(sdkMetadata, objectName)
    }))
    .sort((a, b) => b.listNames.length - a.listNames.length || a.objectName.localeCompare(b.objectName))

  const sharedCountBuckets = new Map()
  const physicsCostBuckets = new Map()
  let objectsWithPhysicsCost = 0
  let objectsWithInteractables = 0
  let objectsWithThumbnails = 0

  for (const row of objectRows) {
    const count = row.listNames.length
    sharedCountBuckets.set(count, (sharedCountBuckets.get(count) || 0) + 1)

    if (row.metadata.physicsCost !== null && row.metadata.physicsCost !== undefined) {
      objectsWithPhysicsCost++
      physicsCostBuckets.set(row.metadata.physicsCost, (physicsCostBuckets.get(row.metadata.physicsCost) || 0) + 1)
    }
    if (row.metadata.hasInteractables) objectsWithInteractables++
    if (row.metadata.hasThumbnail) objectsWithThumbnails++
  }

  const physicsRanges = [
    { label: '1', min: 1, max: 1, count: 0 },
    { label: '2', min: 2, max: 2, count: 0 },
    { label: '3', min: 3, max: 3, count: 0 },
    { label: '4', min: 4, max: 4, count: 0 },
    { label: '5', min: 5, max: 5, count: 0 },
    { label: '6–10', min: 6, max: 10, count: 0 },
    { label: '11–20', min: 11, max: 20, count: 0 },
    { label: '21–50', min: 21, max: 50, count: 0 },
    { label: '51–100', min: 51, max: 100, count: 0 },
    { label: '101–250', min: 101, max: 250, count: 0 },
    { label: '251–500', min: 251, max: 500, count: 0 },
    { label: '501+', min: 501, max: Infinity, count: 0 }
  ]

  for (const row of objectRows) {
    const cost = row.metadata.physicsCost
    if (cost === null || cost === undefined) continue
    const bucket = physicsRanges.find((range) => cost >= range.min && cost <= range.max)
    if (bucket) bucket.count++
  }

  const browserData = objectRows.map((row) => ({
    name: row.objectName,
    physicsCost: row.metadata.physicsCost,
    directory: row.metadata.directory || '',
    hasInteractables: !!row.metadata.hasInteractables,
    hasThumbnail: row.metadata.hasThumbnail,
    maps: row.listNames.map(formatMapName),
    listNames: row.listNames
  }))
  await writeFile(dataOutFile, `${JSON.stringify(browserData)}\n`, 'utf8')

  const lines = []
  lines.push('---')
  lines.push('outline: [2, 3]')
  lines.push('---')
  lines.push('')
  lines.push('<script setup>')
  lines.push('import { computed, onMounted, ref, watch } from \'vue\'')
  lines.push('import { withBase } from \'vitepress\'')
  lines.push('')
  lines.push('const spatialObjects = ref([])')
  lines.push('const objectFilter = ref(\'\')')
  lines.push('const mapFilter = ref(\'\')')
  lines.push('const costFilter = ref(\'\')')
  lines.push('const directoryFilter = ref(\'\')')
  lines.push('const thumbnailFilter = ref(\'\')')
  lines.push('const interactablesFilter = ref(\'\')')
  lines.push('const sortMode = ref(\'name\')')
  lines.push('const pageSize = 120')
  lines.push('const currentPage = ref(1)')
  lines.push('const selectedObject = ref(null)')
  lines.push('')
  lines.push('onMounted(async () => {')
  lines.push('  spatialObjects.value = await fetch(withBase(\'/spatial-object-data.json\')).then((res) => res.json())')
  lines.push('})')
  lines.push('')
  lines.push('const mapOptions = computed(() => [...new Set(spatialObjects.value.flatMap((object) => object.maps))].sort())')
  lines.push('const costOptions = computed(() => [...new Set(spatialObjects.value.map((object) => object.physicsCost).filter((cost) => cost !== null && cost !== undefined))].sort((a, b) => Number(a) - Number(b)))')
  lines.push('const directoryOptions = computed(() => [...new Set(spatialObjects.value.map((object) => object.directory).filter(Boolean))].sort())')
  lines.push('')
  lines.push('const filteredObjects = computed(() => {')
  lines.push('  const query = objectFilter.value.trim().toLowerCase()')
  lines.push('  const filtered = spatialObjects.value.filter((object) => {')
  lines.push('    const matchesText = !query || object.name.toLowerCase().includes(query) || object.directory.toLowerCase().includes(query)')
  lines.push('    const matchesMap = !mapFilter.value || object.maps.includes(mapFilter.value)')
  lines.push('    const matchesCost = !costFilter.value || String(object.physicsCost) === costFilter.value')
  lines.push('    const matchesDirectory = !directoryFilter.value || object.directory === directoryFilter.value')
  lines.push('    const matchesThumbnail = !thumbnailFilter.value || (thumbnailFilter.value === \'with\' ? object.hasThumbnail : !object.hasThumbnail)')
  lines.push('    const matchesInteractables = !interactablesFilter.value || (interactablesFilter.value === \'with\' ? object.hasInteractables : !object.hasInteractables)')
  lines.push('    return matchesText && matchesMap && matchesCost && matchesDirectory && matchesThumbnail && matchesInteractables')
  lines.push('  })')
  lines.push('')
  lines.push('  return [...filtered].sort((a, b) => {')
  lines.push('    if (sortMode.value === \'map-count\') return b.maps.length - a.maps.length || a.name.localeCompare(b.name)')
  lines.push('    if (sortMode.value === \'physics-cost\') return (Number(b.physicsCost ?? -1) - Number(a.physicsCost ?? -1)) || a.name.localeCompare(b.name)')
  lines.push('    if (sortMode.value === \'directory\') return a.directory.localeCompare(b.directory) || a.name.localeCompare(b.name)')
  lines.push('    return a.name.localeCompare(b.name)')
  lines.push('  })')
  lines.push('})')
  lines.push('')
  lines.push('watch([objectFilter, mapFilter, costFilter, directoryFilter, thumbnailFilter, interactablesFilter, sortMode], () => {')
  lines.push('  currentPage.value = 1')
  lines.push('})')
  lines.push('')
  lines.push('const totalPages = computed(() => Math.max(1, Math.ceil(filteredObjects.value.length / pageSize)))')
  lines.push('watch(totalPages, (pages) => {')
  lines.push('  if (currentPage.value > pages) currentPage.value = pages')
  lines.push('})')
  lines.push('')
  lines.push('const pageStart = computed(() => filteredObjects.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1)')
  lines.push('const pageEnd = computed(() => Math.min(currentPage.value * pageSize, filteredObjects.value.length))')
  lines.push('const visibleObjects = computed(() => filteredObjects.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))')
  lines.push('')
  lines.push('function thumbnailUrl (object) {')
  lines.push('  return withBase(`/spatial-thumbnails/${encodeURIComponent(`${object.name}.png`)}`)')
  lines.push('}')
  lines.push('')
  lines.push('function previousPage () {')
  lines.push('  currentPage.value = Math.max(1, currentPage.value - 1)')
  lines.push('}')
  lines.push('')
  lines.push('function nextPage () {')
  lines.push('  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)')
  lines.push('}')
  lines.push('')
  lines.push('function openPreview (object) {')
  lines.push('  if (object.hasThumbnail) selectedObject.value = object')
  lines.push('}')
  lines.push('')
  lines.push('function closePreview () {')
  lines.push('  selectedObject.value = null')
  lines.push('}')
  lines.push('</script>')
  lines.push('')
  lines.push('# Spatial Object Reference')
  lines.push('')
  lines.push('This page combines all `RuntimeSpawn_*` spatial object lists into one map-aware reference.')
  lines.push('')
  lines.push('Spatial objects are map-based, but many object names are shared across maps. Use the browser filters to narrow the reference to one map, directory, physics cost, thumbnail availability, interactable objects, or free-text matches.')
  lines.push('')
  if (sdkMetadata.sdkVersion) {
    lines.push(`SDK metadata source: **Portal SDK ${sdkMetadata.sdkVersion}** (` + '`FbExportData/asset_types.json` and `FbExportData/thumbnails/`).')
    lines.push('')
  }

  lines.push('## Spatial Asset Browser')
  lines.push('')
  lines.push('This browser is the primary spatial object reference. It contains every unique `RuntimeSpawn_*` object, with filters for map availability and SDK metadata.')
  lines.push('')
  lines.push('<div class="spatial-browser">')
  lines.push('  <div class="spatial-browser-controls">')
  lines.push('    <div class="spatial-filter-panel" aria-label="Filters">')
  lines.push('      <strong>Filters</strong>')
  lines.push('      <label>Map')
  lines.push('        <select v-model="mapFilter">')
  lines.push('          <option value="">All maps</option>')
  lines.push('          <option v-for="map in mapOptions" :key="map" :value="map">{{ map }}</option>')
  lines.push('        </select>')
  lines.push('      </label>')
  lines.push('      <label>Directory')
  lines.push('        <select v-model="directoryFilter">')
  lines.push('          <option value="">All directories</option>')
  lines.push('          <option v-for="directory in directoryOptions" :key="directory" :value="directory">{{ directory }}</option>')
  lines.push('        </select>')
  lines.push('      </label>')
  lines.push('      <label>Physics Cost')
  lines.push('        <select v-model="costFilter">')
  lines.push('          <option value="">Any physics cost</option>')
  lines.push('          <option v-for="cost in costOptions" :key="cost" :value="String(cost)">{{ cost }}</option>')
  lines.push('        </select>')
  lines.push('      </label>')
  lines.push('      <label>Thumbnail')
  lines.push('        <select v-model="thumbnailFilter">')
  lines.push('          <option value="">Any thumbnail status</option>')
  lines.push('          <option value="with">Has thumbnail</option>')
  lines.push('          <option value="without">Missing thumbnail</option>')
  lines.push('        </select>')
  lines.push('      </label>')
  lines.push('      <label>Interactables')
  lines.push('        <select v-model="interactablesFilter">')
  lines.push('          <option value="">Any interactable status</option>')
  lines.push('          <option value="with">Has interactables</option>')
  lines.push('          <option value="without">No interactables flag</option>')
  lines.push('        </select>')
  lines.push('      </label>')
  lines.push('    </div>')
  lines.push('  </div>')
  lines.push('  <div class="spatial-search-panel">')
  lines.push('    <label for="spatial-object-search">Search</label>')
  lines.push('    <input id="spatial-object-search" v-model="objectFilter" type="search" placeholder="Search object names or directories..." />')
  lines.push('  </div>')
  lines.push('  <div class="spatial-results-bar">')
  lines.push('    <p class="spatial-browser-count">Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredObjects.length }} matching objects. Total loaded: {{ spatialObjects.length }}.</p>')
  lines.push('    <div class="spatial-sort-panel" aria-label="Sorting">')
  lines.push('      <label>Sort')
  lines.push('        <select v-model="sortMode">')
  lines.push('          <option value="name">Name</option>')
  lines.push('          <option value="map-count">Map count</option>')
  lines.push('          <option value="physics-cost">Physics cost</option>')
  lines.push('          <option value="directory">Directory</option>')
  lines.push('        </select>')
  lines.push('      </label>')
  lines.push('    </div>')
  lines.push('  </div>')
  lines.push('  <div class="spatial-grid">')
  lines.push('    <button v-for="object in visibleObjects" :key="object.name" type="button" class="spatial-card" :class="{ \'spatial-card-clickable\': object.hasThumbnail }" @click="openPreview(object)">')
  lines.push('      <img v-if="object.hasThumbnail" :src="thumbnailUrl(object)" :alt="`${object.name} thumbnail`" loading="lazy" width="128" height="128" />')
  lines.push('      <div v-else class="spatial-card-missing">No thumbnail</div>')
  lines.push('      <strong>{{ object.name }}</strong>')
  lines.push('      <span>{{ object.directory || \'—\' }}</span>')
  lines.push('      <small>Physics: {{ object.physicsCost ?? \'—\' }} · Maps: {{ object.maps.length }} · Thumbnail: {{ object.hasThumbnail ? \'Yes\' : \'—\' }}</small>')
  lines.push('    </button>')
  lines.push('  </div>')
  lines.push('  <div class="spatial-pagination">')
  lines.push('    <button type="button" :disabled="currentPage === 1" @click="previousPage">Previous</button>')
  lines.push('    <span>Page {{ currentPage }} of {{ totalPages }}</span>')
  lines.push('    <button type="button" :disabled="currentPage === totalPages" @click="nextPage">Next</button>')
  lines.push('  </div>')
  lines.push('</div>')
  lines.push('')
  lines.push('<div v-if="selectedObject" class="spatial-preview-backdrop" role="dialog" aria-modal="true" @click.self="closePreview">')
  lines.push('  <div class="spatial-preview-modal">')
  lines.push('    <button type="button" class="spatial-preview-close" aria-label="Close preview" @click="closePreview">×</button>')
  lines.push('    <img :src="thumbnailUrl(selectedObject)" :alt="`${selectedObject.name} thumbnail`" width="512" height="512" />')
  lines.push('    <div class="spatial-preview-meta">')
  lines.push('      <strong>{{ selectedObject.name }}</strong>')
  lines.push('      <span>{{ selectedObject.directory || \'—\' }}</span>')
  lines.push('      <small>Physics: {{ selectedObject.physicsCost ?? \'—\' }} · Maps: {{ selectedObject.maps.join(\', \') }}</small>')
  lines.push('    </div>')
  lines.push('  </div>')
  lines.push('</div>')
  lines.push('')

  lines.push('## Summary')
  lines.push('')
  lines.push('| Metric | Count |')
  lines.push('| --- | ---: |')
  lines.push(`| RuntimeSpawn lists | ${spatialLists.length} |`)
  lines.push(`| Unique spatial object names | ${objectRows.length} |`)
  lines.push(`| Total map/object entries | ${totalEntries} |`)
  lines.push(`| Objects with SDK metadata | ${objectRows.filter((row) => sdkMetadata.assets.has(row.objectName)).length} |`)
  lines.push(`| Objects with physics cost | ${objectsWithPhysicsCost} |`)
  lines.push(`| Objects flagged with interactables | ${objectsWithInteractables} |`)
  lines.push(`| Objects with SDK thumbnails | ${objectsWithThumbnails} |`)
  lines.push('')

  lines.push('## Maps')
  lines.push('')
  lines.push('Object counts by RuntimeSpawn map list. Use these names in the Map filter above to limit the browser to one map.')
  lines.push('')
  lines.push('<div class="spatial-chart spatial-chart-wide">')
  const mapsByObjectCount = [...spatialLists].sort((a, b) => ((b.selectionValues || []).length) - ((a.selectionValues || []).length))
  const maxMapObjectCount = Math.max(...spatialLists.map((list) => (list.selectionValues || []).length))
  for (const list of mapsByObjectCount) {
    const count = (list.selectionValues || []).length
    const width = maxMapObjectCount > 0 ? Math.max(2, Math.round((count / maxMapObjectCount) * 100)) : 0
    const mapName = formatMapName(list.name)
    lines.push(`  <div class="spatial-chart-row"><span class="spatial-chart-label">${mapName}</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: ${width}%"></span></span><span class="spatial-chart-value">${count.toLocaleString()}</span></div>`)
  }
  lines.push('</div>')
  lines.push('')

  lines.push('## Sharing Distribution')
  lines.push('')
  lines.push('This shows how many unique object names appear on a given number of RuntimeSpawn lists. Longer bars mean more objects have that level of cross-map availability.')
  lines.push('')
  lines.push('<div class="spatial-chart">')
  const sharingRows = [...sharedCountBuckets.entries()].sort((a, b) => Number(a[0]) - Number(b[0]))
  const maxSharedCount = Math.max(...sharingRows.map(([, objectCount]) => objectCount))
  for (const [count, objectCount] of sharingRows) {
    const width = maxSharedCount > 0 ? Math.max(2, Math.round((objectCount / maxSharedCount) * 100)) : 0
    lines.push(`  <div class="spatial-chart-row"><span class="spatial-chart-label">${count} ${Number(count) === 1 ? 'map' : 'maps'}</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: ${width}%"></span></span><span class="spatial-chart-value">${objectCount.toLocaleString()}</span></div>`)
  }
  lines.push('</div>')
  lines.push('')

  if (physicsCostBuckets.size > 0) {
    lines.push('## Physics Cost Distribution')
    lines.push('')
    lines.push('Physics cost comes from the SDK asset metadata when present. This graph groups costs into readable ranges; use the Physics Cost filter above when you need an exact value.')
    lines.push('')
    lines.push('<div class="spatial-chart">')
    const maxPhysicsRangeCount = Math.max(...physicsRanges.map((range) => range.count))
    for (const range of physicsRanges) {
      const width = maxPhysicsRangeCount > 0 ? Math.max(2, Math.round((range.count / maxPhysicsRangeCount) * 100)) : 0
      lines.push(`  <div class="spatial-chart-row"><span class="spatial-chart-label">${range.label}</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: ${width}%"></span></span><span class="spatial-chart-value">${range.count.toLocaleString()}</span></div>`)
    }
    lines.push('</div>')
    lines.push('')
  }

  lines.push('## Reference Data')
  lines.push('')
  lines.push('The browser above is generated from `public/spatial-object-data.json`, which contains every unique spatial object plus its maps, SDK directory, physics cost, interactable flag, and thumbnail availability. Use the browser filters instead of separate per-map tables so the same object can be discovered across shared maps without duplicating thousands of rows.')
  lines.push('')

  await writeFile(outFile, lines.join('\n'), 'utf8')
  console.log(`Generated ${outFile}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
