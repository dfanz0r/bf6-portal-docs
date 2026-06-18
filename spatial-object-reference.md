---
outline: [2, 3]
---

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'

const spatialObjects = ref([])
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
  spatialObjects.value = await fetch(withBase('/spatial-object-data.json')).then((res) => res.json())
})

const mapOptions = computed(() => [...new Set(spatialObjects.value.flatMap((object) => object.maps))].sort())
const costOptions = computed(() => [...new Set(spatialObjects.value.map((object) => object.physicsCost).filter((cost) => cost !== null && cost !== undefined))].sort((a, b) => Number(a) - Number(b)))
const directoryOptions = computed(() => [...new Set(spatialObjects.value.map((object) => object.directory).filter(Boolean))].sort())

const filteredObjects = computed(() => {
  const query = objectFilter.value.trim().toLowerCase()
  const filtered = spatialObjects.value.filter((object) => {
    const matchesText = !query || object.name.toLowerCase().includes(query) || object.directory.toLowerCase().includes(query)
    const matchesMap = !mapFilter.value || object.maps.includes(mapFilter.value)
    const matchesCost = !costFilter.value || String(object.physicsCost) === costFilter.value
    const matchesDirectory = !directoryFilter.value || object.directory === directoryFilter.value
    const matchesThumbnail = !thumbnailFilter.value || (thumbnailFilter.value === 'with' ? object.hasThumbnail : !object.hasThumbnail)
    const matchesInteractables = !interactablesFilter.value || (interactablesFilter.value === 'with' ? object.hasInteractables : !object.hasInteractables)
    return matchesText && matchesMap && matchesCost && matchesDirectory && matchesThumbnail && matchesInteractables
  })

  return [...filtered].sort((a, b) => {
    if (sortMode.value === 'map-count') return b.maps.length - a.maps.length || a.name.localeCompare(b.name)
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

This page combines all `RuntimeSpawn_*` spatial object lists into one map-aware reference.

Spatial objects are map-based, but many object names are shared across maps. Use the browser filters to narrow the reference to one map, directory, physics cost, thumbnail availability, interactable objects, or free-text matches.

SDK metadata source: **Portal SDK 1.3.2.0** (`FbExportData/asset_types.json` and `FbExportData/thumbnails/`).

## Spatial Asset Browser

This browser is the primary spatial object reference. It contains every unique `RuntimeSpawn_*` object, with filters for map availability and SDK metadata.

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
      <small>Physics: {{ object.physicsCost ?? '—' }} · Maps: {{ object.maps.length }} · Thumbnail: {{ object.hasThumbnail ? 'Yes' : '—' }}</small>
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
      <small>Physics: {{ selectedObject.physicsCost ?? '—' }} · Maps: {{ selectedObject.maps.join(', ') }}</small>
    </div>
  </div>
</div>

## Summary

| Metric | Count |
| --- | ---: |
| RuntimeSpawn lists | 23 |
| Unique spatial object names | 10393 |
| Total map/object entries | 25980 |
| Objects with SDK metadata | 10392 |
| Objects with physics cost | 3064 |
| Objects flagged with interactables | 346 |
| Objects with SDK thumbnails | 9014 |

## Maps

Object counts by RuntimeSpawn map list. Use these names in the Map filter above to limit the browser to one map.

<div class="spatial-chart spatial-chart-wide">
  <div class="spatial-chart-row"><span class="spatial-chart-label">Dumbo</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 100%"></span></span><span class="spatial-chart-value">1,499</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Aftermath</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 100%"></span></span><span class="spatial-chart-value">1,496</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Common</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 98%"></span></span><span class="spatial-chart-value">1,471</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_Downtown</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 97%"></span></span><span class="spatial-chart-value">1,456</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_Underground</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 95%"></span></span><span class="spatial-chart-value">1,430</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_Marina</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 95%"></span></span><span class="spatial-chart-value">1,417</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Abbasid</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 90%"></span></span><span class="spatial-chart-value">1,346</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Contaminated</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 90%"></span></span><span class="spatial-chart-value">1,346</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Sand</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 90%"></span></span><span class="spatial-chart-value">1,346</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Battery</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 82%"></span></span><span class="spatial-chart-value">1,232</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">GolmudRailway</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 79%"></span></span><span class="spatial-chart-value">1,189</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_MilitaryStorage</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 75%"></span></span><span class="spatial-chart-value">1,128</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_MilitaryRnD</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 71%"></span></span><span class="spatial-chart-value">1,064</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Subsurface</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 65%"></span></span><span class="spatial-chart-value">980</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Eastwood</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 63%"></span></span><span class="spatial-chart-value">944</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Limestone</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 62%"></span></span><span class="spatial-chart-value">927</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_ResidentialNorth</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 61%"></span></span><span class="spatial-chart-value">909</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Badlands</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 59%"></span></span><span class="spatial-chart-value">891</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Tungsten</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 59%"></span></span><span class="spatial-chart-value">877</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Outskirts</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 56%"></span></span><span class="spatial-chart-value">842</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Granite_TechCenter</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 56%"></span></span><span class="spatial-chart-value">834</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">FireStorm</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 50%"></span></span><span class="spatial-chart-value">746</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">Capstone</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 41%"></span></span><span class="spatial-chart-value">610</span></div>
</div>

## Sharing Distribution

This shows how many unique object names appear on a given number of RuntimeSpawn lists. Longer bars mean more objects have that level of cross-map availability.

<div class="spatial-chart">
  <div class="spatial-chart-row"><span class="spatial-chart-label">1 map</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 100%"></span></span><span class="spatial-chart-value">5,693</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">2 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 34%"></span></span><span class="spatial-chart-value">1,928</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">3 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 14%"></span></span><span class="spatial-chart-value">817</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">4 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 8%"></span></span><span class="spatial-chart-value">479</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">5 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 7%"></span></span><span class="spatial-chart-value">385</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">6 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 4%"></span></span><span class="spatial-chart-value">246</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">7 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 3%"></span></span><span class="spatial-chart-value">186</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">8 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 3%"></span></span><span class="spatial-chart-value">149</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">9 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">130</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">10 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">80</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">11 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">50</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">12 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">59</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">13 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">42</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">14 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">41</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">15 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">31</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">16 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">28</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">17 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">15</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">18 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">13</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">19 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">4</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">20 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">14</span></div>
  <div class="spatial-chart-row"><span class="spatial-chart-label">21 maps</span><span class="spatial-chart-track"><span class="spatial-chart-bar" style="width: 2%"></span></span><span class="spatial-chart-value">3</span></div>
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

The browser above is generated from `public/spatial-object-data.json`, which contains every unique spatial object plus its maps, SDK directory, physics cost, interactable flag, and thumbnail availability. Use the browser filters instead of separate per-map tables so the same object can be discovered across shared maps without duplicating thousands of rows.
