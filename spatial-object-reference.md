---
outline: [2, 3]
---

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const spatialData = ref({ maps: [], objects: [] })
const objectFilter = ref('')
const mapFilter = ref('')
const costFilter = ref('')
const directoryFilter = ref('')
const thumbnailFilter = ref('')
const interactablesFilter = ref('')
const sortMode = ref('name')
const pageSize = 120
const currentPage = ref(1)
const selectedObject = ref(null)

onMounted(async () => {
  spatialData.value = await fetch(withBase('/spatial-object-data.json')).then((res) => res.json())
})

const spatialObjects = computed(() => spatialData.value.objects)
const mapOptions = computed(() => spatialData.value.maps.map((map) => map.name))
const costOptions = computed(() => [...new Set(spatialObjects.value.map((object) => object.physicsCost).filter((cost) => cost !== null && cost !== undefined))].sort((a, b) => Number(a) - Number(b)))
const directoryOptions = computed(() => [...new Set(spatialObjects.value.map((object) => object.directory).filter(Boolean))].sort())

// An empty maps list means the object is available on every map.
function mapCount (object) {
  return object.maps.length || mapOptions.value.length
}

const filteredObjects = computed(() => {
  const query = objectFilter.value.trim().toLowerCase()
  const filtered = spatialObjects.value.filter((object) => {
    const matchesText = !query || object.name.toLowerCase().includes(query) || object.directory.toLowerCase().includes(query)
    const matchesMap = !mapFilter.value || object.maps.length === 0 || object.maps.includes(mapFilter.value)
    const matchesCost = !costFilter.value || String(object.physicsCost) === costFilter.value
    const matchesDirectory = !directoryFilter.value || object.directory === directoryFilter.value
    const matchesThumbnail = !thumbnailFilter.value || (thumbnailFilter.value === 'with' ? object.hasThumbnail : !object.hasThumbnail)
    const matchesInteractables = !interactablesFilter.value || (interactablesFilter.value === 'with' ? object.hasInteractables : !object.hasInteractables)
    return matchesText && matchesMap && matchesCost && matchesDirectory && matchesThumbnail && matchesInteractables
  })

  return [...filtered].sort((a, b) => {
    if (sortMode.value === 'map-count') return mapCount(b) - mapCount(a) || a.name.localeCompare(b.name)
    if (sortMode.value === 'physics-cost') return (Number(b.physicsCost ?? -1) - Number(a.physicsCost ?? -1)) || a.name.localeCompare(b.name)
    if (sortMode.value === 'directory') return a.directory.localeCompare(b.directory) || a.name.localeCompare(b.name)
    return a.name.localeCompare(b.name)
  })
})

watch([objectFilter, mapFilter, costFilter, directoryFilter, thumbnailFilter, interactablesFilter, sortMode], () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredObjects.value.length / pageSize)))
watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

const pageStart = computed(() => filteredObjects.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1)
const pageEnd = computed(() => Math.min(currentPage.value * pageSize, filteredObjects.value.length))
const visibleObjects = computed(() => filteredObjects.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function thumbnailUrl (object) {
  return withBase(`/spatial-thumbnails/${encodeURIComponent(`${object.name}.png`)}`)
}

function previousPage () {
  currentPage.value = Math.max(1, currentPage.value - 1)
}

function nextPage () {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1)
}

function openPreview (object) {
  if (object.hasThumbnail) selectedObject.value = object
}

function closePreview () {
  selectedObject.value = null
}
</script>

# Spatial Object Reference

This page lists every placeable spatial object exported by the Portal SDK, with per-map availability.

Map availability comes from each object's SDK `levelRestrictions`; objects without restrictions are available on **all maps**. Use the browser filters to narrow the reference to one map, directory, physics cost, thumbnail availability, interactable objects, or free-text matches.

Source: **Portal SDK 1.4.1.0** (`FbExportData/asset_types.json`, `FbExportData/level_info.json`, and `FbExportData/thumbnails/`).

## Spatial Asset Browser

This browser is the primary spatial object reference. It contains every placeable SDK object, with filters for map availability and SDK metadata.

<div class="spatial-browser">
  <div class="spatial-browser-controls">
    <div class="spatial-filter-panel" aria-label="Filters">
      <strong>Filters</strong>
      <label>Map
        <select v-model="mapFilter">
          <option value="">All maps</option>
          <option v-for="map in mapOptions" :key="map" :value="map">{{ map }}</option>
        </select>
      </label>
      <label>Directory
        <select v-model="directoryFilter">
          <option value="">All directories</option>
          <option v-for="directory in directoryOptions" :key="directory" :value="directory">{{ directory }}</option>
        </select>
      </label>
      <label>Physics Cost
        <select v-model="costFilter">
          <option value="">Any physics cost</option>
          <option v-for="cost in costOptions" :key="cost" :value="String(cost)">{{ cost }}</option>
        </select>
      </label>
      <label>Thumbnail
        <select v-model="thumbnailFilter">
          <option value="">Any thumbnail status</option>
          <option value="with">Has thumbnail</option>
          <option value="without">Missing thumbnail</option>
        </select>
      </label>
      <label>Interactables
        <select v-model="interactablesFilter">
          <option value="">Any interactable status</option>
          <option value="with">Has interactables</option>
          <option value="without">No interactables flag</option>
        </select>
      </label>
    </div>
  </div>
  <div class="spatial-search-panel">
    <label for="spatial-object-search">Search</label>
    <input id="spatial-object-search" v-model="objectFilter" type="search" placeholder="Search object names or directories..." />
  </div>
  <div class="spatial-results-bar">
    <p class="spatial-browser-count">Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredObjects.length }} matching objects. Total loaded: {{ spatialObjects.length }}.</p>
    <div class="spatial-sort-panel" aria-label="Sorting">
      <label>Sort
        <select v-model="sortMode">
          <option value="name">Name</option>
          <option value="map-count">Map count</option>
          <option value="physics-cost">Physics cost</option>
          <option value="directory">Directory</option>
        </select>
      </label>
    </div>
  </div>
  <div class="spatial-grid">
    <button v-for="object in visibleObjects" :key="object.name" type="button" class="spatial-card" :class="{ 'spatial-card-clickable': object.hasThumbnail }" @click="openPreview(object)">
      <img v-if="object.hasThumbnail" :src="thumbnailUrl(object)" :alt="`${object.name} thumbnail`" loading="lazy" width="128" height="128" />
      <div v-else class="spatial-card-missing">No thumbnail</div>
      <strong>{{ object.name }}</strong>
      <span>{{ object.directory || '—' }}</span>
      <small>Physics: {{ object.physicsCost ?? '—' }} · Maps: {{ object.maps.length || 'All' }} · Thumbnail: {{ object.hasThumbnail ? 'Yes' : '—' }}</small>
    </button>
  </div>
  <div class="spatial-pagination">
    <button type="button" :disabled="currentPage === 1" @click="previousPage">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button type="button" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
  </div>
</div>

<div v-if="selectedObject" class="spatial-preview-backdrop" role="dialog" aria-modal="true" @click.self="closePreview">
  <div class="spatial-preview-modal">
    <button type="button" class="spatial-preview-close" aria-label="Close preview" @click="closePreview">×</button>
    <img :src="thumbnailUrl(selectedObject)" :alt="`${selectedObject.name} thumbnail`" width="512" height="512" />
    <div class="spatial-preview-meta">
      <strong>{{ selectedObject.name }}</strong>
      <span>{{ selectedObject.directory || '—' }}</span>
      <small>Physics: {{ selectedObject.physicsCost ?? '—' }} · Maps: {{ selectedObject.maps.length ? selectedObject.maps.join(', ') : 'All maps' }}</small>
    </div>
  </div>
</div>

## Summary

| Metric | Count |
| --- | ---: |
| Maps | 24 |
| Unique spatial objects | 10886 |
| Objects available on all maps | 1512 |
| Total map/object entries | 63677 |
| Objects with physics cost | 3064 |
| Objects flagged with interactables | 366 |
| Objects with SDK thumbnails | 9468 |

## Maps

Maps come from the SDK's `level_info.json`. Use these names in the Map filter above to limit the browser to one map. "Map-specific objects" counts objects restricted to the map; every map additionally has access to the 1,512 unrestricted objects.

| Map | Map-specific objects | Total available | Physics budget |
| --- | ---: | ---: | ---: |
| MP_Abbasid | 1,346 | 2,858 | 100,000 |
| MP_Aftermath | 1,496 | 3,008 | 100,000 |
| MP_Aftermath_Portal | 1,496 | 3,008 | 100,000 |
| MP_Badlands | 891 | 2,403 | 100,000 |
| MP_Battery | 1,232 | 2,744 | 100,000 |
| MP_Capstone | 610 | 2,122 | 100,000 |
| MP_Contaminated | 1,347 | 2,859 | 100,000 |
| MP_Dumbo | 1,499 | 3,011 | 100,000 |
| MP_Eastwood | 944 | 2,456 | 100,000 |
| MP_FireStorm | 746 | 2,258 | 100,000 |
| MP_GolmudRailway | 1,190 | 2,702 | 0 |
| MP_Granite_ClubHouse_Portal | 911 | 2,423 | 100,000 |
| MP_Granite_MainStreet_Portal | 1,457 | 2,969 | 100,000 |
| MP_Granite_Marina_Portal | 1,418 | 2,930 | 100,000 |
| MP_Granite_MilitaryRnD_Portal | 1,064 | 2,576 | 100,000 |
| MP_Granite_MilitaryStorage_Portal | 1,129 | 2,641 | 100,000 |
| MP_Granite_TechCampus_Portal | 835 | 2,347 | 100,000 |
| MP_Granite_Underground_Portal | 1,430 | 2,942 | 0 |
| MP_Limestone | 927 | 2,439 | 100,000 |
| MP_Outskirts | 842 | 2,354 | 100,000 |
| MP_Plaza | 1,376 | 2,888 | 0 |
| MP_Portal_Sand | 1,346 | 2,858 | 100,000 |
| MP_Subsurface | 980 | 2,492 | 0 |
| MP_Tungsten | 877 | 2,389 | 100,000 |

## Sharing Distribution

This shows how many objects are available on a given number of maps, based on SDK `levelRestrictions`. Objects without restrictions appear in the "All maps" row.

<div class="spatial-chart">
  <div class="spatial-chart-row"><span class="spatial-chart-label">1 map</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 100%"></span></span><span class="spatial-chart-value">4,265</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">2 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 42%"></span></span><span class="spatial-chart-value">1,794</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">3 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 26%"></span></span><span class="spatial-chart-value">1,108</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">4 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 13%"></span></span><span class="spatial-chart-value">546</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">5 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 9%"></span></span><span class="spatial-chart-value">378</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">6 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 7%"></span></span><span class="spatial-chart-value">287</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">7 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 5%"></span></span><span class="spatial-chart-value">224</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">8 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 4%"></span></span><span class="spatial-chart-value">154</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">9 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 3%"></span></span><span class="spatial-chart-value">146</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">10 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">97</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">11 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">84</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">12 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">47</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">13 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">50</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">14 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">44</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">15 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">38</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">16 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">27</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">17 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">33</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">18 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">16</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">19 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">14</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">20 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">5</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">21 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">13</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">22 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">4</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">All maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 35%"></span></span><span class="spatial-chart-value">1,512</span></div>
</div>

## Physics Cost Distribution

Physics cost comes from the SDK asset metadata when present. This graph groups costs into readable ranges; use the Physics Cost filter above when you need an exact value.

<div class="spatial-chart">
  <div class="spatial-chart-row"><span class="spatial-chart-label">1</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 8%"></span></span><span class="spatial-chart-value">70</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">2</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 100%"></span></span><span class="spatial-chart-value">932</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">3</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 32%"></span></span><span class="spatial-chart-value">300</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">4</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 30%"></span></span><span class="spatial-chart-value">280</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">5</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 15%"></span></span><span class="spatial-chart-value">137</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">6–10</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 61%"></span></span><span class="spatial-chart-value">570</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">11–20</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 37%"></span></span><span class="spatial-chart-value">343</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">21–50</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 18%"></span></span><span class="spatial-chart-value">165</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">51–100</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 10%"></span></span><span class="spatial-chart-value">89</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">101–250</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 11%"></span></span><span class="spatial-chart-value">106</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">251–500</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 5%"></span></span><span class="spatial-chart-value">45</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">501+</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 3%"></span></span><span class="spatial-chart-value">27</span></div>
</div>

## Reference Data

The browser above is generated from `public/spatial-object-data.json`, which contains the SDK map list (with physics budgets) plus every placeable object with its restricted-map list, SDK directory, physics cost, interactable flag, and thumbnail availability. An object with no restricted maps is available everywhere.
