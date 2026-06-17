import { readFile, writeFile } from 'node:fs/promises'

const definitionsFile = '.vitepress/block-definitions.json'
const outFile = 'block-code-reference.md'
const i18nUrl = 'https://portal.battlefield.com/bf6/13637837/i18n/en-US.json'

// Manual mapping for block names whose i18n key doesn't match by simple lowercasing
const blockNameToI18nKey = {
  'GetCurrentOwnerTeam': 'getcurrentownerteamid',
  'GetOwnerProgressTeam': 'getownerprogressteamid',
  'GetPreviousOwnerTeam': 'getpreviousownerteamid',
  'GetTeam': 'getteamid',
  'GetVehicleTeam': 'getvehicleteamid',
  'SetCapturePointCapturingTime': 'capturepointcapturingtime',
  'SetCapturePointNeutralizationTime': 'capturepointneutralizationtime'
}


function typeToDisplay (type) {
  // Convert PascalCase type names to readable ones
  const map = {
    'Enum_AiInput': 'AI Input',
    'Enum_AmmoBox': 'Ammo Box',
    'Enum_ArmorDurability': 'Armor Durability',
    'Enum_ArmorTypes': 'Armor Types',
    'Enum_AssaultRifles': 'Assault Rifles',
    'Enum_AwarenessState': 'Awareness State',
    'Enum_Cameras': 'Cameras',
    'Enum_CapturePoints': 'Capture Points',
    'Enum_Carbines': 'Carbines',
    'Enum_CharacterGadgets': 'Character Gadgets',
    'Enum_ClassGadgets': 'Class Gadgets',
    'Enum_CustomMessages': 'Custom Messages',
    'Enum_DeathTypes': 'Death Types',
    'Enum_DamageTypes': 'Damage Types',
    'Enum_DMRs': 'DMRs',
    'Enum_Factions': 'Factions',
    'Enum_Gadgets': 'Gadgets',
    'Enum_GolmudTrainVariants': 'Golmud Train Variants',
    'Enum_GolmudTrainStopReason': 'Golmud Train Stop Reason',
    'Enum_GolmudTrainMoveCommands': 'Golmud Train Move Commands',
    'Enum_InputTrigger': 'Input Trigger',
    'Enum_Inputs': 'Inputs',
    'Enum_InventoryModifiers': 'Inventory Modifiers',
    'Enum_InventorySlots': 'Inventory Slots',
    'Enum_LMGs': 'LMGs',
    'Enum_LocationalSounds': 'Locational Sounds',
    'Enum_Maps': 'Maps',
    'Enum_MCOMArmType': 'MCOM Arm Type',
    'Enum_MCOMs': 'MCOMs',
    'Enum_MCOMStateBool': 'MCOM State Bool',
    'Enum_MedGadgetTypes': 'Med Gadget Types',
    'Enum_MeleeWeapons': 'Melee Weapons',
    'Enum_MiscGadgets': 'Misc Gadgets',
    'Enum_MoveSpeed': 'Move Speed',
    'Enum_MusicEvents': 'Music Events',
    'Enum_MusicPackages': 'Music Packages',
    'Enum_MusicParams': 'Music Params',
    'Enum_OpenGadgets': 'Open Gadgets',
    'Enum_PlayerClass': 'Player Class',
    'Enum_PlayerDeathTypes': 'Player Death Types',
    'Enum_PlayerDamageTypes': 'Player Damage Types',
    'Enum_PlayerFilterTypes': 'Player Filter Types',
    'Enum_PortalEnum': 'Portal Enum',
    'Enum_PrimaryWeapons': 'Primary Weapons',
    'Enum_ResupplyTypes': 'Resupply Types',
    'Enum_RestrictedInputs': 'Restricted Inputs',
    'Enum_RuntimeSpawn_*': 'Runtime Spawn (*)',
    'Enum_ScoreboardType': 'Scoreboard Type',
    'Enum_ScreenEffects': 'Screen Effects',
    'Enum_SecondaryWeapons': 'Secondary Weapons',
    'Enum_SFX': 'SFX',
    'Enum_Shotguns': 'Shotguns',
    'Enum_Sidearms': 'Sidearms',
    'Enum_SMGs': 'SMGs',
    'Enum_SniperRifles': 'Sniper Rifles',
    'Enum_SoldierClass': 'Soldier Class',
    'Enum_SoldierEffects': 'Soldier Effects',
    'Enum_SoldierKit': 'Soldier Kit',
    'Enum_SoldierStateBool': 'Soldier State Bool',
    'Enum_SoldierStateNumber': 'Soldier State Number',
    'Enum_SoldierStateVector': 'Soldier State Vector',
    'Enum_Sounds': 'Sounds',
    'Enum_SpawnModes': 'Spawn Modes',
    'Enum_SpectatingGroup': 'Spectating Group',
    'Enum_SpotStatus': 'Spot Status',
    'Enum_Stance': 'Stance',
    'Enum_StationaryEmplacements': 'Stationary Emplacements',
    'Enum_Throwables': 'Throwables',
    'Enum_TickRates': 'Tick Rates',
    'Enum_Types': 'Types',
    'Enum_UIAnchor': 'UI Anchor',
    'Enum_UIBgFill': 'UI BG Fill',
    'Enum_UIButtonEvent': 'UI Button Event',
    'Enum_UIDepth': 'UI Depth',
    'Enum_UIImageType': 'UI Image Type',
    'Enum_VehicleCategories': 'Vehicle Categories',
    'Enum_VehicleList': 'Vehicle List',
    'Enum_Vehicles': 'Vehicles',
    'Enum_VehicleStateVector': 'Vehicle State Vector',
    'Enum_VehicleTypes': 'Vehicle Types',
    'Enum_VFXTypes': 'VFX Types',
    'Enum_VoiceOverEvents2D': 'Voice Over Events 2D',
    'Enum_VoiceOverEvents3D': 'Voice Over Events 3D',
    'Enum_VoiceOverFlags': 'Voice Over Flags',
    'Enum_VoiceOvers': 'Voice Overs',
    'Enum_WeaponAttachments': 'Weapon Attachments',
    'Enum_Weapons': 'Weapons',
    'Enum_WorldIcons': 'World Icons',
    'Enum_WorldIconImages': 'World Icon Images'
  }
  return map[type] || type
}

// Map JSON parameter names to Blockly editor block names (with Event prefix)
const eventParamToBlocklyName = {
  'Player': 'EventPlayer',
  'OtherPlayer': 'EventOtherPlayer',
  'DamageType': 'EventDamageType',
  'WeaponUnlock': 'EventWeapon',
  'DeathType': 'EventDeathType',
  'MCOM': 'EventMCOM',
  'CapturePoint': 'EventCapturePoint',
  'Vehicle': 'EventVehicle',
  'Team': 'EventTeam',
  'AreaTrigger': 'EventAreaTrigger',
  'Seat': 'EventSeat',
  'VL7Cloud': 'EventVL7Cloud',
  'InteractPoint': 'EventInteractPoint',
  'UIWidget': 'EventUIWidget',
  'UIButtonEvent': 'EventUIButtonEvent',
  'Boolean': 'EventBoolean',
  'Point': 'EventPoint',
  'Normal': 'EventNormal',
  'Spawner': 'EventSpawner',
  'GolmudTrainStopReason': 'EventGolmudTrainStopReason',
  'RingOfFire': 'EventRingOfFire',
  'Number': 'EventNumber'
}

function createTypeDisplay (typeName) {
  // Return just the type name; table cells already use code formatting
  return typeName
}

/**
 * Clean up type tokens and formatting in a raw summary string from i18n.
 */
function cleanSummary (text) {
  if (!text) return ''
  return text
    .replace(/\*\*/g, '')           // remove markdown bold markers
    // Replace type tokens with their readable names
    .replace(/%\{PYRITE_TYPE_PLAYER\}/g, 'Player')
    .replace(/%\{PYRITE_TYPE_TEAMID\}/g, 'Team')
    .replace(/%\{PYRITE_TYPE_VEHICLE\}/g, 'Vehicle')
    .replace(/%\{PYRITE_TYPE_CAPTUREPOINT\}/g, 'CapturePoint')
    .replace(/%\{PYRITE_TYPE_MCOM\}/g, 'MCOM')
    .replace(/%\{PYRITE_TYPE_AREATRIGGER\}/g, 'AreaTrigger')
    .replace(/%\{PYRITE_TYPE_RINGOFFIRE\}/g, 'RingOfFire')
    .replace(/%\{PYRITE_TYPE_NUMBER\}/g, 'Number')
    .replace(/%\{PYRITE_TYPE_ARRAY\}/g, 'Array')
    .replace(/%\{PYRITE_TYPE_STRING\}/g, 'String')
    .replace(/%\{PYRITE_TYPE_BOOLEAN\}/g, 'Boolean')
    .replace(/%\{PYRITE_TYPE_VECTOR\}/g, 'Vector')
    .replace(/%\{PYRITE_TYPE_PLAYER_STATE\}/g, 'PlayerState')
    .replace(/%\{PYRITE_TYPE_PLAYER_INVENTORY_ITEM\}/g, 'PlayerInventoryItem')
    .replace(/%\{PYRITE_TYPE_SOLDIERSTATE\}/g, 'SoldierState')
    .replace(/%\{PYRITE_TYPE_SOLDIER\}/g, 'Soldier')
    .replace(/%\{PYRITE_TYPE_ANY\}/g, 'any')
    .replace(/%\{PYRITE_TYPE_VARIABLE\}/g, 'Variable')
    .replace(/%\{PYRITE_TYPE_MESSAGE\}/g, 'Message')
    .replace(/%\{PYRITE_TYPE_DEATHTYPE\}/g, 'DeathType')
    .replace(/%\{PYRITE_TYPE_DAMAGETYPE\}/g, 'DamageType')
    .replace(/%\{PYRITE_TYPE_HARDWAREID\}/g, 'WeaponUnlock')
    .replace(/%\{PYRITE_TYPE_WORLDICON\}/g, 'WorldIcon')
    .replace(/%\{PYRITE_TYPE_ENUM_PLAYERDEATHTYPES\}/g, 'PlayerDeathTypes')
    .replace(/%\{PYRITE_TYPE_ENUM_INVENTORYSLOTS\}/g, 'InventorySlots')
    .replace(/%\{PYRITE_TYPE_ENUM_CHARACTERGADGETS\}/g, 'CharacterGadgets')
    .replace(/%\{PYRITE_TYPE_ENUM_CUSTOMMESSAGES\}/g, 'CustomMessages')
    .replace(/%\{PYRITE_TYPE_ENUM_SOLDIERKITS\}/g, 'SoldierKits')
    .replace(/%\{PYRITE_TYPE_ENUM_MEDGADGETTYPES\}/g, 'MedGadgetTypes')
    .replace(/%\{PYRITE_TYPE_ENUM_MELEEWEAPONS\}/g, 'MeleeWeapons')
    .replace(/%\{PYRITE_TYPE_ENUM_PRIMARYWEAPONS\}/g, 'PrimaryWeapons')
    .replace(/%\{PYRITE_TYPE_ENUM_RESUPPLYTYPES\}/g, 'ResupplyTypes')
    .replace(/%\{PYRITE_TYPE_ENUM_CLASSGADGETS\}/g, 'ClassGadgets')
    .replace(/%\{PYRITE_TYPE_ENUM_TYPES\}/g, 'Types')
    .replace(/%\{PYRITE_TYPE_ENUM_MCOMS\}/g, 'MCOMs')
    .replace(/%\{PYRITE_TYPE_ENUM_MCOMSTATEBOOL\}/g, 'MCOMStateBool')
    .replace(/%\{PYRITE_TYPE_ENUM_PLAYERDAMAGETYPES\}/g, 'PlayerDamageTypes')
    .replace(/%\{PYRITE_TYPE_ENUM_VEHICLES\}/g, 'Vehicles')
    .replace(/%\{PYRITE_TYPE_ENUM_SOLDIERSTATENUMBER\}/g, 'SoldierStateNumber')
    .replace(/%\{PYRITE_TYPE_ENUM_SOLDIERSTATEVECTOR\}/g, 'SoldierStateVector')
    .replace(/%\{PYRITE_TYPE_ENUM_FACTIONS\}/g, 'Factions')
    .replace(/%\{PYRITE_TYPE_ENUM_RESTRICTEDINPUTS\}/g, 'RestrictedInputs')
    .replace(/%\{PYRITE_TYPE_ENUM_WORLDICONS\}/g, 'WorldIcons')
    .replace(/%\{PYRITE_TYPE_ENUM_CAPTUREPOINTS\}/g, 'CapturePoints')
    .replace(/%\{PYRITE_TYPE_ENUM_VEHICLESTATEVECTOR\}/g, 'VehicleStateVector')
    .replace(/%\{PYRITE_TYPE_ENUM_VEHICLETYPES\}/g, 'VehicleTypes')
    .replace(/%\{PYRITE_TYPE_ENUM_SOLDIERSTATEBOOL\}/g, 'SoldierStateBool')
    .replace(/%\{PYRITE_TYPE_ENUM_INPUTTRIGGER\}/g, 'InputTrigger')
    .replace(/%\{PYRITE_TYPE_ENUM_SECONDARYWEAPONS\}/g, 'SecondaryWeapons')
    .replace(/%\{PYRITE_TYPE_ENUM_WORLDICONIMAGES\}/g, 'WorldIconImages')
    .replace(/%\{PYRITE_TYPE_ENUM_SOUNDS\}/g, 'Sounds')
    .replace(/%\{PYRITE_TYPE_ENUM_VOICEOVERS\}/g, 'VoiceOvers')
    .replace(/%\{PYRITE_TYPE_ENUM_LOCATIONALSOUNDS\}/g, 'LocationalSounds')
    .replace(/%\{PYRITE_TYPE_ENUM_MAPS\}/g, 'Maps')
    .replace(/%\{PYRITE_TYPE_ENUM_THROWABLES\}/g, 'Throwables')
    .replace(/%\{PYRITE_TYPE_ENUM_OPENGADGETS\}/g, 'OpenGadgets')
    .replace(/%\{PYRITE_TYPE_[^}]+\}/g, '') // fallback: remove unknown type tokens
    .replace(/%\{PYRITE_EVENT_ONGOING\}/g, 'Ongoing')
    .replace(/%\{PYRITE_MOD\}/g, 'Mod')
    .replace(/%\{PYRITE_EVENT\}/g, 'Event')
    .replace(/%\{PYRITE_CONDITION\}/g, 'Condition')
    .replace(/%\{PYRITE_ACTIONS\}/g, 'Actions')
    .replace(/%\{PYRITE_RULE\}/g, 'Rule')
    .replace(/%\{PYRITE_OBJECT_GLOBAL\}/g, 'Global')
    .replace(/%\{PYRITE_SUBROUTINE\}/g, 'Subroutine')
    // Event reference tokens
    .replace(/%\{ID_ARRIVAL_MODBUILDER_EVENT_ONPLAYERDIED\}/g, 'OnPlayerDied')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_EVENT_ONPLAYEREARNEDKILL\}/g, 'OnPlayerEarnedKill')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_EVENT_ONPLAYERDAMAGED\}/g, 'OnPlayerDamaged')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_EVENT_ONPLAYERDEPLOYED\}/g, 'OnPlayerDeployed')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_OBJECT_PLAYER\}/g, 'Player')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_OBJECT_TEAM\}/g, 'Team')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_OBJECT_VEHICLE\}/g, 'Vehicle')
    .replace(/%\{ID_ARRIVAL_MODBUILDER_OBJECT_CAPTUREPOINT\}/g, 'CapturePoint')
    .replace(/%\{ID_ARRIVAL_BLOCK_EVENTPLAYER\}/g, 'EventPlayer')
    .replace(/%\{ID_ARRIVAL_BLOCK_EVENTTEAM\}/g, 'EventTeam')
    // Convert known block reference tokens to readable names
    .replace(/%\{ID_ARRIVAL_BLOCK_FORVARIABLE\}/g, 'ForVariable')
    .replace(/%\{ID_ARRIVAL_BLOCK_WHILE\}/g, 'While')
    .replace(/%\{ID_ARRIVAL_BLOCK_IF\}/g, 'If')
    .replace(/%\{ID_ARRIVAL_BLOCK_ELSEIF\}/g, 'ElseIf')
    .replace(/%\{ID_ARRIVAL_BLOCK_WAIT\}/g, 'Wait')
    .replace(/%\{ID_ARRIVAL_BLOCK_WAITUNTIL\}/g, 'WaitUntil')
    .replace(/%\{ID_ARRIVAL_BLOCK_ALLPLAYERS\}/g, 'AllPlayers')
    .replace(/%\{ID_ARRIVAL_BLOCK_FILTEREDARRAY\}/g, 'FilteredArray')
    .replace(/%\{ID_ARRIVAL_BLOCK_MAPPEDARRAY\}/g, 'MappedArray')
    .replace(/%\{ID_ARRIVAL_BLOCK_SORTEDARRAY\}/g, 'SortedArray')
    .replace(/%\{ID_ARRIVAL_BLOCK_CURRENTARRAYELEMENT\}/g, 'CurrentArrayElement')
    .replace(/%\{ID_ARRIVAL_BLOCK_ISTRUEFORALL\}/g, 'IsTrueForAll')
    .replace(/%\{ID_ARRIVAL_BLOCK_ISTRUEFORANY\}/g, 'IsTrueForAny')
    .replace(/%\{ID_ARRIVAL_BLOCK_FORCEPLAYERINPUT\}/g, 'ForcePlayerInput')
    .replace(/%\{ID_ARRIVAL_BLOCK_ENABLEINPUTRESTRICTION\}/g, 'EnableInputRestriction')
    .replace(/%\{ID_ARRIVAL_BLOCK_APPLYMEDGADGET\}/g, 'ApplyMedGadget')
    .replace(/%\{ID_ARRIVAL_BLOCK_RESUPPLY\}/g, 'Resupply')
    .replace(/%\{ID_ARRIVAL_BLOCK_SKIPMANDOWN\}/g, 'SkipMandown')
    .replace(/%\{ID_ARRIVAL_BLOCK_CHASEVARIABLEATRATE\}/g, 'ChaseVariableAtRate')
    .replace(/%\{ID_ARRIVAL_BLOCK_CHASEVARIABLEOVERTIME\}/g, 'ChaseVariableOverTime')
    .replace(/%\{ID_ARRIVAL_BLOCK_STOPCHASINGVARIABLE\}/g, 'StopChasingVariable')
    .replace(/%\{ID_ARRIVAL_BLOCK_GETGAMEMODESCORE\}/g, 'GetGameModeScore')
    .replace(/%\{ID_ARRIVAL_BLOCK_SHOWEVENTGAMEMODEMESSAGE\}/g, 'ShowGameModeMessage')
    .replace(/%\{ID_ARRIVAL_BLOCK_SHOWHIGHLIGHTEDGAMEMODEMESSAGE\}/g, 'ShowHighlightedMessage')
    .replace(/%\{ID_ARRIVAL_BLOCK_SHOWNOTIFICATIONMESSAGE\}/g, 'ShowNotificationMessage')
    .replace(/%\{ID_ARRIVAL_BLOCK_DISPLAYCUSTOMNOTIFICATIONMESSAGE\}/g, 'DisplayCustomNotificationMessage')
    .replace(/%\{ID_ARRIVAL_BLOCK_CLEARCUSTOMNOTIFICATIONMESSAGE\}/g, 'ClearCustomNotificationMessage')
    .replace(/%\{ID_ARRIVAL_BLOCK_[^}]+\}/g, '')
    .replace(/%\{help\.common\.value-true\}/g, 'True')
    .replace(/%\{help\.common\.value-false\}/g, 'False')
    .replace(/%\{help\.common\.[^}]+\}/g, '')
    .replace(/%\{[^}]+\}/g, '')
    // Collapse horizontal whitespace but preserve newlines
    .replace(/[ \t]+/g, ' ')
    .replace(/^\s+|\s+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Manual overrides for event names whose auto-converted i18n key doesn't match.
 */
const eventNameI18nOverride = {
  'OnPlayerEarnedKillAssist': 'onplayerearnkillassist'
}

/**
 * Convert a PascalCase event name (e.g. "OnPlayerDamaged") to the lowercase
 * key used in the i18n JSON (e.g. "onplayerdamaged").
 */
function eventNameToI18nKey (name) {
  if (eventNameI18nOverride[name]) return eventNameI18nOverride[name]
  return name.toLowerCase()
}

/**
 * Look up the i18n summary for a given block name.
 * Uses a manual mapping table + simple lowercasing + fallback patterns.
 */
/**
 * Generate a fallback description for Event* blocks that lack i18n entries.
 */
function generateEventFallbackSummary (blockName, returnType) {
  if (!blockName.startsWith('Event')) return ''

  // Basic value types get 'value' instead of 'payload'
  const basicTypes = ['Boolean', 'Number', 'Vector', 'PortalEnum']
  const isBasic = basicTypes.includes(returnType)
  const descriptor = isBasic ? 'value' : 'payload'

  // Map some eventParameter names to their display-friendly form
  const typeDisplay = returnType

  if (returnType) {
    return `Returns the ${typeDisplay} ${descriptor} from the Event context.`
  }
  return ''
}

function getBlockSummary (blockName, summaryMap, returnType) {
  // 1. Check manual mapping first
  if (blockNameToI18nKey[blockName]) {
    const key = blockNameToI18nKey[blockName]
    if (summaryMap.has(key)) return summaryMap.get(key)
  }

  // 2. Direct lowercase match
  const lower = blockName.toLowerCase()
  if (summaryMap.has(lower)) return summaryMap.get(lower)

  // 3. Try with 'id' suffix (e.g. getteam -> getteamid)
  if (summaryMap.has(lower + 'id')) return summaryMap.get(lower + 'id')

  // 4. If starts with 'Set', try the rest lowercased (e.g. SetX -> x)
  if (blockName.startsWith('Set')) {
    const rest = blockName.slice(3).toLowerCase()
    if (summaryMap.has(rest)) return summaryMap.get(rest)
  }

  // 5. If starts with 'Get', try rest + 'id' (e.g. GetTeam -> teamid)
  if (blockName.startsWith('Get')) {
    const rest = blockName.slice(3).toLowerCase()
    if (summaryMap.has(rest + 'id')) return summaryMap.get(rest + 'id')
  }

  // 7. Fallback: generate a basic description for Event* blocks
  if (blockName.startsWith('Event') && returnType) {
    return generateEventFallbackSummary(blockName, returnType)
  }

  return ''
}

/**
 * Fetch and parse the i18n JSON to extract:
 * - eventData: Map of eventName -> { description, payloads }
 * - summaryMap: Map of i18nKey -> summary (for value/action blocks)
 */
async function fetchI18nData () {
  console.log(`Fetching i18n from ${i18nUrl}...`)
  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    Origin: 'https://portal.battlefield.com',
    Referer: 'https://portal.battlefield.com/bf6/experiences'
  }

  const res = await fetch(i18nUrl, { headers, cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch i18n: ${res.status} ${res.statusText}`)
  }
  const i18n = await res.json()
  const help = i18n?.help
  if (!help) {
    console.warn('i18n JSON has no help section, skipping descriptions')
    return { eventData: new Map(), summaryMap: new Map() }
  }

  // --- Build summaryMap for value/action blocks ---
  const summaryMap = new Map()
  for (const [key, val] of Object.entries(help)) {
    if (val && typeof val === 'object' && 'summary' in val) {
      summaryMap.set(key, val.summary)
    }
  }
  // UI action blocks are nested under help.uiactions
  if (help.uiactions) {
    for (const [key, val] of Object.entries(help.uiactions)) {
      if (val && typeof val === 'object' && 'summary' in val) {
        summaryMap.set(key, val.summary)
      }
    }
  }
  console.log(`  Found ${summaryMap.size} block summaries in i18n`)

  // --- Build eventData (existing logic) ---
  const rule = help.rule
  const eventData = new Map()
  if (!rule) {
    console.warn('i18n JSON has no help.rule section, skipping event descriptions')
    return { eventData, summaryMap }
  }

  for (const [key, text] of Object.entries(rule)) {
    if (key === 'summary' || key === 'typesofrule') continue

    const payloadsSplit = text.includes('_Payloads:') ? text.split('_Payloads:') : [text]
    const description = cleanSummary(payloadsSplit[0])

    // Restore _Note: -> **Note:** after cleaning
    const descWithNote = description
      .replace(/_Note:/g, '**Note:**')
      .replace(/_$/g, '')

    const payloads = new Map()
    if (payloadsSplit.length > 1) {
      const payloadsStr = payloadsSplit[1]
        .replace(/^_/, '')
        .replace(/_$/, '')
        .trim()

      const payloadPattern = /%\{ID_ARRIVAL_BLOCK_([^}]+)\}\s*(?:\(([^)]*)\))?/g
      let match
      while ((match = payloadPattern.exec(payloadsStr)) !== null) {
        const blockType = match[1]
        const payloadDesc = (match[2] || '').trim()
        if (payloadDesc) {
          payloads.set(blockType, payloadDesc)
        }
      }
    }

    eventData.set(key, { description: descWithNote, payloads })
  }

  console.log(`  Found ${eventData.size} events in i18n`)
  return { eventData, summaryMap }
}

async function main () {
  console.log(`Reading block definitions from ${definitionsFile}...`)
  const raw = await readFile(definitionsFile, 'utf8')
  const data = JSON.parse(raw)

  // Fetch i18n data (event descriptions + block summaries)
  let i18nEventData, summaryMap
  try {
    const result = await fetchI18nData()
    i18nEventData = result.eventData
    summaryMap = result.summaryMap
  } catch (err) {
    console.warn(`Warning: could not fetch i18n: ${err.message}`)
    console.warn('Proceeding without i18n descriptions')
    i18nEventData = new Map()
    summaryMap = new Map()
  }

  const events = data.events || []
  const values = data.values || []
  const actions = data.actions || []
  const objects = data.objects || []
  const selectionLists = data.selectionLists || []
  const controlActions = data.controlActions || []
  const types = data.types || []

  const lines = []
  lines.push('---')
  lines.push('outline: [2, 3]')
  lines.push('---')
  lines.push('')
  lines.push('# Block Code Reference')
  lines.push('')
  lines.push('This page documents all available Blocky scripting blocks in Battlefield Portal.')
  lines.push('')
  lines.push('## Summary')
  lines.push('')
  lines.push(`| Category | Count |`)
  lines.push(`| --- | ---:|`)
  lines.push(`| Objects | ${objects.length} |`)
  lines.push(`| Events | ${events.length} |`)
  lines.push(`| Values | ${values.length} |`)
  lines.push(`| Actions | ${actions.length} |`)
  lines.push(`| Selection Lists | ${selectionLists.length} |`)
  lines.push(`| Control Actions | ${controlActions.length} |`)
  lines.push(`| Types | ${types.length} |`)
  lines.push('')
  lines.push('## Events')
  lines.push('')
  lines.push('Events trigger when something happens in the game. Each event has a set of parameters (payloads) that provide context about what occurred.')
  lines.push('')
  lines.push('In the Blocky editor, payload blocks are prefixed with `Event` (e.g. `EventPlayer`, `EventOtherPlayer`, `EventDamageType`).')
  lines.push('')

  // Add Ongoing event type description from i18n
  const ongoingI18n = i18nEventData.get('ongoing')
  if (ongoingI18n?.description) {
    const ongoingDesc = ongoingI18n.description
      // The raw text has _Note: which should become **Note:**
      // Also remove trailing _ italic marker
      .replace(/_Note:/g, '**Note:**')
      .replace(/_$/g, '')
    lines.push('### Ongoing')
    lines.push('')
    lines.push(ongoingDesc)
    lines.push('')
  }

  // Group events by their general category (ongoing, ai, player, etc.)
  const eventCategories = {
    'Ongoing': [],
    'Player': [],
    'Capture Point': [],
    'Vehicle': [],
    'MCOM': [],
    'AI': [],
    'Game Mode': [],
    'Other': []
  }

  for (const ev of events) {
    const name = ev.name
    if (name === 'Ongoing') continue
    if (name.startsWith('Ongoing')) {
      eventCategories['Ongoing'].push(ev)
    } else if (name.match(/^OnPlayer/i)) {
      eventCategories['Player'].push(ev)
    } else if (name.match(/^On(CapturePoint|Team)/i)) {
      eventCategories['Capture Point'].push(ev)
    } else if (name.match(/^OnVehicle/i)) {
      eventCategories['Vehicle'].push(ev)
    } else if (name.match(/^OnMCOM/i)) {
      eventCategories['MCOM'].push(ev)
    } else if (name.match(/^OnAI/i)) {
      eventCategories['AI'].push(ev)
    } else if (name.match(/^On(GameMode|Round|Time)/i)) {
      eventCategories['Game Mode'].push(ev)
    } else {
      eventCategories['Other'].push(ev)
    }
  }

  for (const [category, evts] of Object.entries(eventCategories)) {
    if (evts.length === 0) continue
    lines.push(`### ${category}`)
    lines.push('')

    for (const ev of evts) {
      const params = ev.parameters || []

      lines.push(`#### ${ev.name}`)
      lines.push('')

      // Look up i18n description and payload descriptions
      const i18nKey = eventNameToI18nKey(ev.name)
      const i18nInfo = i18nEventData.get(i18nKey)

      // Emit description
      if (i18nInfo?.description) {
        lines.push(`${i18nInfo.description}`)
        lines.push('')
      }

      // Emit payload table
      if (params.length > 0) {
        lines.push(`| Payload | Type | Description |`)
        lines.push(`| --- | --- | --- |`)
        for (const p of params) {
          const blocklyName = eventParamToBlocklyName[p.name] || `Event${p.name}`
          // Look up payload description from i18n
          // i18n keys are uppercase blockly names, e.g. EventPlayer -> EVENTPLAYER
          const i18nPayloadKey = blocklyName.toUpperCase()
          const desc = i18nInfo?.payloads?.get(i18nPayloadKey) || ''
          lines.push(`| \`${blocklyName}\` | ${typeToDisplay(p.name)} | ${desc} |`)
        }
        lines.push('')
      } else {
        lines.push('No payload parameters.')
        lines.push('')
      }
    }
  }

  lines.push('## Values')
  lines.push('')
  lines.push('Value blocks return a value and can be used as inputs to other blocks.')
  lines.push('')

  // Group values by category then subCategory
  const valueCategories = {}
  for (const v of values) {
    if (v.deprecated) continue
    const cat = v.category || 'Other'
    const sub = v.subCategory || 'General'
    valueCategories[cat] ??= {}
    valueCategories[cat][sub] ??= []
    valueCategories[cat][sub].push(v)
  }

  for (const [cat, subs] of Object.entries(valueCategories).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`### ${cat}`)
    lines.push('')

    for (const [sub, items] of Object.entries(subs).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (sub !== 'General') {
        lines.push(`**${sub}**`)
        lines.push('')
      }

      for (const item of items) {
        const sigs = (item.functionSignatures || []).filter(s => !s.deprecated)
        if (sigs.length === 0) continue

        lines.push(`##### ${item.name}`)
        lines.push('')

        // Look up description from i18n summaries (with fallback for Event* blocks)
        const returnType = (item.functionSignatures && item.functionSignatures[0] && item.functionSignatures[0].returnType) || ''
        const blockSummary = cleanSummary(getBlockSummary(item.name, summaryMap, returnType))
        if (blockSummary) {
          lines.push(blockSummary)
          lines.push('')
        }

        lines.push(`| Signature | Return Type |`)
        lines.push(`| --- | --- |`)
        for (const sig of sigs) {
          const returnType = createTypeDisplay(sig.returnType || 'void')
          const paramStr = (sig.parameterTypes || []).map(p => {
            if (p.anyType) return 'any'
            if (p.parameterTypes) {
              const types = p.parameterTypes.map(t => createTypeDisplay(t)).join(' | ')
              return p.parameterName ? `${p.parameterName}: ${types}` : types
            }
            return createTypeDisplay(p)
          }).join(', ')

          lines.push(`| \`(${paramStr})\` | ${returnType} |`)
        }
        lines.push('')
      }
    }
  }

  lines.push('## Actions')
  lines.push('')
  lines.push('Action blocks perform operations and do not return a value.')
  lines.push('')

  // Group actions by category then subCategory
  const actionCategories = {}
  for (const a of actions) {
    if (a.deprecated) continue
    const cat = a.category || 'Other'
    const sub = a.subCategory || 'General'
    actionCategories[cat] ??= {}
    actionCategories[cat][sub] ??= []
    actionCategories[cat][sub].push(a)
  }

  for (const [cat, subs] of Object.entries(actionCategories).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`### ${cat}`)
    lines.push('')

    for (const [sub, items] of Object.entries(subs).sort((a, b) => a[0].localeCompare(b[0]))) {
      if (sub !== 'General') {
        lines.push(`**${sub}**`)
        lines.push('')
      }

      for (const item of items) {
        const sigs = (item.functionSignatures || []).filter(s => !s.deprecated)
        if (sigs.length === 0) continue

        lines.push(`##### ${item.name}`)
        lines.push('')

        // Look up description from i18n summaries
        const blockSummary = cleanSummary(getBlockSummary(item.name, summaryMap))
        if (blockSummary) {
          lines.push(blockSummary)
          lines.push('')
        }

        lines.push(`| Signature |`)
        lines.push(`| --- |`)
        for (const sig of sigs) {
          const paramStr = (sig.parameterTypes || []).map(p => {
            if (p.anyType) return 'any'
            if (p.parameterTypes) {
              const types = p.parameterTypes.map(t => createTypeDisplay(t)).join(' | ')
              return p.parameterName ? `${p.parameterName}: ${types}` : types
            }
            return createTypeDisplay(p)
          }).join(', ')

          lines.push(`| \`(${paramStr})\` |`)
        }
        lines.push('')
      }
    }
  }

  lines.push('## Control Actions')
  lines.push('')
  lines.push('Control action blocks manage the flow of execution in a rule.')
  lines.push('')

  for (const ca of controlActions) {
    if (ca.deprecated) continue

    const sigs = (ca.functionSignatures || []).filter(s => !s.deprecated)
    if (sigs.length === 0) continue

    lines.push(`### ${ca.name}`)
    lines.push('')

    // Look up description from i18n summaries
    const blockSummary = cleanSummary(getBlockSummary(ca.name, summaryMap))
    if (blockSummary) {
      lines.push(blockSummary)
      lines.push('')
    }

    lines.push(`| Signature |`)
    lines.push(`| --- |`)
    for (const sig of sigs) {
      const paramStr = (sig.parameterTypes || []).map(p => {
        if (p.anyType) return 'any'
        if (p.parameterTypes) {
          const types = p.parameterTypes.map(t => createTypeDisplay(t)).join(' | ')
          return p.parameterName ? `${p.parameterName}: ${types}` : types
        }
        return createTypeDisplay(p)
      }).join(', ')

      lines.push(`| \`(${paramStr})\` |`)
    }
    lines.push('')
  }

  lines.push('## Objects')
  lines.push('')
  lines.push('Object blocks represent game entities and can be used as inputs to other blocks.')
  lines.push('')

  lines.push('| Object | Type |')
  lines.push('| --- | --- |')
  for (const obj of objects) {
    const deprecated = obj.deprecated ? ' (deprecated)' : ''
    lines.push(`| \`${obj.name}\` | \`${obj.type}\`${deprecated} |`)
  }
  lines.push('')

  lines.push('## Selection Lists')
  lines.push('')
  lines.push('Selection lists are enum-like values used for dropdown parameters.')
  lines.push('')

  for (const list of selectionLists) {
    const values = list.selectionValues || []
    if (values.length === 0) continue

    const maxShow = 30
    const showValues = values.slice(0, maxShow)
    const remaining = values.length - maxShow

    lines.push(`### ${list.name}`)
    lines.push('')
    lines.push(`List type: \`${list.listType}\``)
    lines.push('')
    lines.push(`| Value | ${list.deprecated ? ' (deprecated)' : ''}|`)
    lines.push(`| --- |`)
    for (const v of showValues) {
      const dep = v.deprecated ? ' (deprecated)' : ''
      lines.push(`| \`${v.name}\`${dep} |`)
    }
    if (remaining > 0) {
      lines.push(`| *... and ${remaining} more* |`)
    }
    lines.push('')
  }

  lines.push('## Types')
  lines.push('')
  lines.push('| Type | Description |')
  lines.push('| --- | --- |')
  for (const t of types) {
    const dep = t.deprecated ? ' (deprecated)' : ''
    lines.push(`| \`${t.name}\` | ${typeToDisplay(t.name)}${dep} |`)
  }
  lines.push('')

  await writeFile(outFile, lines.join('\n'), 'utf8')
  console.log(`Generated ${outFile}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
