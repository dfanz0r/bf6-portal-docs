import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const definitionsFile = '.vitepress/block-definitions.json'
const helpDir = '.vitepress/blockly-help'
const i18nUrl = 'https://portal.battlefield.com/bf6/13637837/i18n/en-US.json'
const i18nCacheFile = '.vitepress/blockly-help/i18n-cache.json'
const outFile = 'block-code-reference.md'

// ─── I18n resolution ─────────────────────────────────────────────────────────

let i18nData = null

async function loadI18n () {
  const force = process.argv.includes('--force') || process.argv.includes('-f')

  // Try loading from cache first
  const { existsSync } = await import('node:fs')
  if (!force && existsSync(i18nCacheFile)) {
    try {
      i18nData = JSON.parse(await readFile(i18nCacheFile, 'utf8'))
      console.log('Using cached i18n data from', i18nCacheFile)
      return
    } catch {
      // cache corrupt, fall through to fetch
    }
  }

  console.log('Fetching i18n data...')
  const headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Origin': 'https://portal.battlefield.com',
    'Referer': 'https://portal.battlefield.com/bf6/experiences'
  }
  try {
    const res = await fetch(i18nUrl, { headers, cache: 'no-store' })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const text = await res.text()
    if (text.startsWith('<') || text.startsWith('<!')) {
      throw new Error('Received HTML instead of JSON (likely blocked)')
    }
    i18nData = JSON.parse(text)

    // Cache to disk
    await writeFile(i18nCacheFile, JSON.stringify(i18nData, null, 2) + '\n', 'utf8')
    console.log('Fetched and cached i18n data')
  } catch (err) {
    console.warn(`Warning: Failed to fetch i18n data (${err.message})`)
    i18nData = { help: {}, common: {} } // empty fallback
    console.warn('  Block descriptions will show raw i18n tokens. Use --force to retry.')
  }
}

/** Resolve %{...} tokens in a string using i18n data + known type mappings. */
function resolveI18n (str) {
  if (!str) return str

  // Known PYRITE_TYPE mappings
  const typeMap = {
    'PYRITE_TYPE_PLAYER': 'Player',
    'PYRITE_TYPE_TEAMID': 'Team',
    'PYRITE_TYPE_VEHICLE': 'Vehicle',
    'PYRITE_TYPE_CAPTUREPOINT': 'CapturePoint',
    'PYRITE_TYPE_MCOM': 'MCOM',
    'PYRITE_TYPE_AREATRIGGER': 'AreaTrigger',
    'PYRITE_TYPE_RINGOFFIRE': 'RingOfFire',
    'PYRITE_TYPE_NUMBER': 'Number',
    'PYRITE_TYPE_ARRAY': 'Array',
    'PYRITE_TYPE_STRING': 'String',
    'PYRITE_TYPE_BOOLEAN': 'Boolean',
    'PYRITE_TYPE_VECTOR': 'Vector',
    'PYRITE_TYPE_ANYTYPE': 'any',
    'PYRITE_TYPE_VARIABLE': 'Variable',
    'PYRITE_TYPE_PLAYER_STATE': 'PlayerState',
    'PYRITE_TYPE_PLAYER_INVENTORY_ITEM': 'PlayerInventoryItem',
    'PYRITE_TYPE_SOLDIERSTATE': 'SoldierState',
    'PYRITE_TYPE_SOLDIER': 'Soldier',
    'PYRITE_TYPE_MESSAGE': 'Message',
    'PYRITE_TYPE_HARDWAREID': 'HardwareId',
    'PYRITE_TYPE_DEATHTYPE': 'DeathType',
    'PYRITE_TYPE_DAMAGETYPE': 'DamageType',
    'PYRITE_TYPE_WORLDICON': 'WorldIcon',
    'PYRITE_TYPE_WORLDICONS': 'WorldIcons',
    'PYRITE_TYPE_ENUM_PRIMARYWEAPONS': 'Weapon (Primary)',
    'PYRITE_TYPE_ENUM_SECONDARYWEAPONS': 'Weapon (Secondary)',
    'PYRITE_TYPE_ENUM_VEHICLES': 'Vehicle',
    'PYRITE_TYPE_ENUM_VEHICLETYPES': 'Vehicle Type',
    'PYRITE_TYPE_ENUM_VEHICLELIST': 'Vehicle List',
    'PYRITE_TYPE_ENUM_VEHICLECATEGORIES': 'Vehicle Category',
    'PYRITE_TYPE_ENUM_SOLDIERSTATENUMBER': 'Soldier State (Number)',
    'PYRITE_TYPE_ENUM_SOLDIERSTATEBOOL': 'Soldier State (Boolean)',
    'PYRITE_TYPE_ENUM_SOLDIERSTATEVECTOR': 'Soldier State (Vector)',
    'PYRITE_TYPE_ENUM_CAPTUREPOINTS': 'Capture Point',
    'PYRITE_TYPE_ENUM_MCOMS': 'MCOM',
    'PYRITE_TYPE_ENUM_MCOMSTATEBOOL': 'MCOM State (Boolean)',
    'PYRITE_TYPE_ENUM_FACTIONS': 'Faction',
    'PYRITE_TYPE_ENUM_PLAYERDEATHTYPES': 'Player Death Type',
    'PYRITE_TYPE_ENUM_PLAYERDAMAGETYPES': 'Player Damage Type',
    'PYRITE_TYPE_ENUM_MAPS': 'Map',
    'PYRITE_TYPE_ENUM_GADGETS': 'Gadget',
    'PYRITE_TYPE_ENUM_OPENGADGETS': 'Gadget (Open)',
    'PYRITE_TYPE_ENUM_CHARACTERGADGETS': 'Gadget (Character)',
    'PYRITE_TYPE_ENUM_CLASSGADGETS': 'Gadget (Class)',
    'PYRITE_TYPE_ENUM_INVENTORYSLOTS': 'Inventory Slot',
    'PYRITE_TYPE_ENUM_RESTRICTEDINPUTS': 'Restricted Input',
    'PYRITE_TYPE_ENUM_INPUTS': 'Input',
    'PYRITE_TYPE_ENUM_INPUTTRIGGER': 'Input Trigger',
    'PYRITE_TYPE_ENUM_SOLDIERCLASS': 'Soldier Class',
    'PYRITE_TYPE_ENUM_SOLDIERKITS': 'Soldier Kit',
    'PYRITE_TYPE_ENUM_SOLDIEREFFECTS': 'Soldier Effect',
    'PYRITE_TYPE_ENUM_SOUNDS': 'Sound',
    'PYRITE_TYPE_ENUM_VOICEOVERS': 'Voice Over',
    'PYRITE_TYPE_ENUM_VOICEOVEREVENTS2D': 'Voice Over Event (2D)',
    'PYRITE_TYPE_ENUM_VOICEOVEREVENTS3D': 'Voice Over Event (3D)',
    'PYRITE_TYPE_ENUM_VOICEOVERFLAGS': 'Voice Over Flag',
    'PYRITE_TYPE_ENUM_LOCATIONALSOUNDS': 'Sound (Locational)',
    'PYRITE_TYPE_ENUM_MUSICEVENTS': 'Music Event',
    'PYRITE_TYPE_ENUM_MUSICPACKAGES': 'Music Package',
    'PYRITE_TYPE_ENUM_MUSICPARAMS': 'Music Param',
    'PYRITE_TYPE_ENUM_SPAWNMODES': 'Spawn Mode',
    'PYRITE_TYPE_ENUM_STANCES': 'Stance',
    'PYRITE_TYPE_ENUM_MOVESPEED': 'Move Speed',
    'PYRITE_TYPE_ENUM_THROWABLES': 'Throwable',
    'PYRITE_TYPE_ENUM_MELEEWEAPONS': 'Melee Weapon',
    'PYRITE_TYPE_ENUM_WEAPONS': 'Weapon',
    'PYRITE_TYPE_ENUM_WEAPONATTACHMENTS': 'Weapon Attachment',
    'PYRITE_TYPE_ENUM_DMRS': 'DMR',
    'PYRITE_TYPE_ENUM_SMGS': 'SMG',
    'PYRITE_TYPE_ENUM_LMGS': 'LMG',
    'PYRITE_TYPE_ENUM_SNIPERRIFLES': 'Sniper Rifle',
    'PYRITE_TYPE_ENUM_SHOTGUNS': 'Shotgun',
    'PYRITE_TYPE_ENUM_CARBINES': 'Carbine',
    'PYRITE_TYPE_ENUM_ASSAULTRIFLES': 'Assault Rifle',
    'PYRITE_TYPE_ENUM_SIDEARMS': 'Sidearm',
    'PYRITE_TYPE_ENUM_AMMOBOXES': 'Ammo Box',
    'PYRITE_TYPE_ENUM_ARMORTYPES': 'Armor Type',
    'PYRITE_TYPE_ENUM_RESUPPLYTYPES': 'Resupply Type',
    'PYRITE_TYPE_ENUM_MEDGADGETTYPES': 'Med Gadget Type',
    'PYRITE_TYPE_ENUM_MISC_GADGETS': 'Misc Gadget',
    'PYRITE_TYPE_ENUM_SCOREBOARDTYPE': 'Scoreboard Type',
    'PYRITE_TYPE_ENUM_SPECTATINGGROUP': 'Spectating Group',
    'PYRITE_TYPE_ENUM_CUSTOMMESSAGES': 'Custom Message',
    'PYRITE_TYPE_ENUM_UIANCHOR': 'UI Anchor',
    'PYRITE_TYPE_ENUM_UIBGFILL': 'UI BG Fill',
    'PYRITE_TYPE_ENUM_UIDEPTH': 'UI Depth',
    'PYRITE_TYPE_ENUM_UIIMAGETYPE': 'UI Image Type',
    'PYRITE_TYPE_ENUM_UIBUTTONEVENT': 'UI Button Event',
    'PYRITE_TYPE_ENUM_SCREENEFFECTS': 'Screen Effect',
    'PYRITE_TYPE_ENUM_SFX': 'SFX',
    'PYRITE_TYPE_ENUM_VFXTYPES': 'VFX Type',
    'PYRITE_TYPE_ENUM_WORLDICONIMAGES': 'World Icon Image',
    'PYRITE_TYPE_ENUM_WORLDICONS': 'World Icons',
    'PYRITE_TYPE_ENUM_GOLMUDTRAINSTOPREASON': 'Golmud Train Stop Reason',
    'PYRITE_TYPE_ENUM_GOLMUDTRAINVARIANTS': 'Golmud Train Variant',
    'PYRITE_TYPE_ENUM_GOLMUDTRAINMOVECOMMANDS': 'Golmud Train Move Command',
    'PYRITE_TYPE_ENUM_RUNTIMESPAWN_*': 'Runtime Spawn (*)',
    'PYRITE_TYPE_ENUM_AWARENESSSTATE': 'Awareness State',
    'PYRITE_TYPE_ENUM_AIINPUT': 'AI Input',
    'PYRITE_TYPE_ENUM_PLAYERFILTERTYPES': 'Player Filter Type',
    'PYRITE_TYPE_ENUM_SPOTSTATUS': 'Spot Status',
    'PYRITE_TYPE_ENUM_TYPES': 'Type',
    'PYRITE_RULE': 'Rule',
    'PYRITE_EVENT': 'Event',
    'PYRITE_EVENT_ONGOING': 'Ongoing',
    'PYRITE_CONDITION': 'Condition',
    'PYRITE_CONDITIONS': 'Conditions',
    'PYRITE_ACTIONS': 'Actions',
    'PYRITE_NEW_RULE': 'New Rule',
    'PYRITE_SUBROUTINE': 'Subroutine',
    'PYRITE_OBJECT_GLOBAL': 'Global',
    'PYRITE_OPTION_DEPRECATED': '(Deprecated)',
    'PYRITE_TYPE_ANY': 'any',
  }

  // Resolve %{PYRITE_xxx} tokens
  for (const [key, val] of Object.entries(typeMap)) {
    str = str.replace(new RegExp(`%\\{${key}\\}`, 'g'), val)
  }

  // Resolve %{help.xxx.xxx} tokens from i18n data
  str = str.replace(/%\{help\.([^}]+)\}/g, (match, path) => {
    const parts = path.split('.')
    // Start from i18nData.help since path already stripped 'help.'
    let obj = i18nData?.help
    for (const part of parts) {
      if (obj && typeof obj === 'object') {
        obj = obj[part]
      } else {
        return match // can't resolve, keep as-is
      }
    }
    if (typeof obj === 'string') {
      // Clean up markdown bold markers in the resolved text
      return obj.replace(/\*\*/g, '').trim()
        .replace(/%\{PYRITE_TYPE_PLAYER\}/g, 'Player')
        .replace(/%\{PYRITE_TYPE_NUMBER\}/g, 'Number')
        .replace(/%\{PYRITE_TYPE_BOOLEAN\}/g, 'Boolean')
        .replace(/%\{PYRITE_TYPE_VECTOR\}/g, 'Vector')
        .replace(/%\{PYRITE_TYPE_ARRAY\}/g, 'Array')
        .replace(/%\{PYRITE_TYPE_STRING\}/g, 'String')
        .replace(/%\{PYRITE_TYPE_VARIABLE\}/g, 'Variable')
        .replace(/%\{PYRITE_TYPE_ANYTYPE\}/g, 'any')
        .replace(/%\{PYRITE_TYPE_TEAMID\}/g, 'Team')
        .replace(/%\{PYRITE_TYPE_VEHICLE\}/g, 'Vehicle')
        .replace(/%\{PYRITE_TYPE_CAPTUREPOINT\}/g, 'CapturePoint')
        .replace(/%\{PYRITE_TYPE_MCOM\}/g, 'MCOM')
        .replace(/%\{PYRITE_TYPE_PLAYER\}/g, 'Player')
        .replace(/%\{PYRITE_TYPE_NUMBER\}/g, 'Number')
        .replace(/%\{ID_ARRIVAL_BLOCK_([^}]+)\}/g, (m, id) => {
          // Convert ID_ARRIVAL_BLOCK_EVENTPLAYER -> EventPlayer
          const parts = id.split('_')
          return parts.map((p, i) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
        })
        .replace(/%\{ID_ARRIVAL_MODBUILDER_OBJECT_([^}]+)\}/g, (m, id) => {
          const parts = id.split('_')
          return parts.map((p, i) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
        })
        .replace(/%\{PYRITE_TYPE_[^}]+\}/g, '')
        .replace(/%\{PYRITE_[^}]+\}/g, '')
        .replace(/%\{ID_[^}]+\}/g, '')
        .replace(/%\{help\.common\.[^}]+\}/g, '')
        .replace(/[ \t]+/g, ' ')
        .trim()
    }
    return match
  })

  // Resolve %{ID_ARRIVAL_BLOCK_xxx} tokens directly
  str = str.replace(/%\{ID_ARRIVAL_BLOCK_([^}]+)\}/g, (m, id) => {
    const parts = id.split('_')
    return parts.map((p, i) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
  })

  // Resolve %{ID_ARRIVAL_MODBUILDER_OBJECT_xxx}
  str = str.replace(/%\{ID_ARRIVAL_MODBUILDER_OBJECT_([^}]+)\}/g, (m, id) => {
    const parts = id.split('_')
    return parts.map((p, i) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
  })

  // Resolve %{help.common.value-true} -> True, %{help.common.value-false} -> False
  str = str.replace(/%\{help\.common\.value-true\}/g, 'True')
  str = str.replace(/%\{help\.common\.value-false\}/g, 'False')

  // Remove any remaining %{...} tokens that couldn't be resolved
  str = str.replace(/%\{[^}]+\}/g, '')

  // Clean up whitespace
  str = str.replace(/[ \t]+/g, ' ')
    .replace(/^[ \t]+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return str
}

// ─── Parse ruleBlock.md for event data ────────────────────────────────────────

/** Parse the ruleBlock.md help file to extract all event descriptions + payloads. */
function parseRuleBlockEvents (content) {
  const events = new Map()

  // Match sections like:
  // #### OnPlayerDamaged
  //
  // This will trigger when a Player takes damage.
  //
  // Payloads: _EventPlayer (Damaged Player), ...
  const eventRegex = /####\s+(\w+)\n\n([^#]+?)(?=\n####|\n###|$)/g
  let match

  while ((match = eventRegex.exec(content)) !== null) {
    const name = match[1]
    const body = match[2].trim()

    // Split description from payloads
    const payloadsMatch = body.match(/Payloads:\s*(.+)/)
    let description = body
    let payloads = []

    if (payloadsMatch) {
      description = body.substring(0, payloadsMatch.index).trim()
      const payloadStr = payloadsMatch[1].trim()

      // Parse payloads: _EventPlayer (Damaged Player), EventOtherPlayer (Damager Player)
      // Handle italic markers (_..._) around each payload or the whole list
      const payloadRegex = /_?([A-Za-z]+)\s*(?:\(([^)]*)\))?_?/g
      let pMatch
      while ((pMatch = payloadRegex.exec(payloadStr)) !== null) {
        const blockName = pMatch[1].replace(/^%?/, '') // remove stray % prefix
        const blockDesc = (pMatch[2] || '').trim()
        if (blockName && !blockName.startsWith('%')) {
          payloads.push({ name: blockName, description: blockDesc })
        }
      }
    }

    // Clean up description - remove bold markers
    description = description.replace(/\*\*/g, '').trim()

    events.set(name, { description, payloads })
  }

  return events
}

// ─── Parse block help files ─────────────────────────────────────────────────

/** Read a help markdown file and extract its description. */
async function readBlockHelp (name) {
  const filePath = path.join(helpDir, `${name}.md`)
  if (!existsSync(filePath)) return null

  const content = await readFile(filePath, 'utf8')
  return content
}

/** Extract the first paragraph/summary from a help markdown file. */
function extractSummary (content) {
  if (!content) return ''

  // Normalize line endings
  content = content.replace(/\r\n/g, '\n')

  // Remove the title line (# ...)
  const noTitle = content.replace(/^# .+\n?/m, '').trim()

  // Remove the XML code block
  const noCode = noTitle.replace(/```[\s\S]*?```/g, '').trim()

  // Get the first paragraph
  const firstPara = noCode.split('\n\n')[0]?.trim() || ''

  return resolveI18n(firstPara)
}

/** Extract input parameters from a help markdown file. */
function extractInputs (content) {
  if (!content) return []

  const inputs = []
  // Find the ### Input section
  const inputMatch = content.match(/###\s+%\{help\.common\.input\}\s*\n([^#]+)/)
  if (inputMatch) {
    const lines = inputMatch[1].trim().split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('```')) {
        // Format: "1. TYPE: name" or "1. TYPE: %{help.xxx.value0}"
        const paramMatch = trimmed.match(/^\d+\.\s*(.+?):\s*(.+)$/)
        if (paramMatch) {
          inputs.push({
            type: resolveI18n(paramMatch[1].trim()),
            name: resolveI18n(paramMatch[2].trim())
          })
        }
      }
    }
  }
  return inputs
}

/** Extract output type from a help markdown file. */
function extractOutput (content) {
  if (!content) return ''

  const outputMatch = content.match(/###\s+%\{help\.common\.output\}\s*\n\n?-\s*(.+)/)
  if (outputMatch) {
    return resolveI18n(outputMatch[1].trim())
  }
  return ''
}

/** Extract the XML code example from a help markdown file. */
function extractExample (content) {
  if (!content) return ''

  const codeMatch = content.match(/```[\s\S]*?```/g)
  if (codeMatch) {
    return codeMatch[0] // return first code block
  }
  return ''
}

// ─── Type display ────────────────────────────────────────────────────────────

function typeToDisplay (type) {
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
    'Enum_WorldIconImages': 'World Icon Images',
    'Enum_AmmoTypes': 'Ammo Types',
    'Enum_CustomNotificationSlots': 'Custom Notification Slots',
    'LootSpawner': 'Loot Spawner',
    'MapSpecificFeature': 'Map Specific Feature',
    'PortalEnum': 'Portal Enum',
    'SpatialObject': 'Spatial Object',
    'VO': 'Voice Over',
    'WeaponUnlock': 'Weapon'
  }

  // Generic fallback for Enum_ types not in the explicit map
  if (type && type.startsWith('Enum_')) {
    const name = type.slice(5) // Remove 'Enum_'
    // Replace underscores with spaces, then split PascalCase into words
    return name
      .replace(/_/g, ' ')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
  }

  return type || ''
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
  'Objective': 'EventObjective',
  'GolmudTrainStopReason': 'EventGolmudTrainStopReason',
  'RingOfFire': 'EventRingOfFire',
  'Number': 'EventNumber'
}

/** Format a parameter for display, escaping pipe chars that break markdown tables. */
function formatParam (p) {
  if (p.anyType) return 'any'
  if (p.parameterTypes) {
    // Escape pipe chars via '\|' so they don't break markdown table columns
    const types = p.parameterTypes
      .map(t => typeToDisplay(t))
      .join(' | ')
      .replaceAll('|', '\\|')
    return p.parameterName ? `${p.parameterName}: ${types}` : types
  }
  return typeToDisplay(p)
}

/** Check if a signature has any non-empty parameters. */
function sigHasParams (sig) {
  const params = sig.parameterTypes || []
  return params.length > 0
}

/** Build a regex that matches known block/event names and replaces with page-internal links.
 *  Names are sorted longest-first to avoid partial matches.
 */
function buildBlockLinker (eventNames, payloadNames) {
  // Combine all known names and sort by length (longest first)
  const allNames = [...new Set([...eventNames, ...payloadNames])].sort((a, b) => b.length - a.length)

  // Build an alternation regex, escaping special regex characters
  const escaped = allNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  // Only match word-boundary-delimited names so we don't match substrings
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'g')

  return function (text) {
    if (!text) return text
    return text.replace(pattern, (match) => {
      const anchor = match.toLowerCase()
      return `[${match}](#${anchor})`
    })
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main () {
  // Load i18n data
  await loadI18n()

  // Read block definitions
  console.log('Reading block definitions...')
  const raw = await readFile(definitionsFile, 'utf8')
  const data = JSON.parse(raw)

  // Read and parse ruleBlock.md for event data
  let ruleBlockContent = ''
  const ruleBlockPath = path.join(helpDir, 'ruleBlock.md')
  if (existsSync(ruleBlockPath)) {
    ruleBlockContent = await readFile(ruleBlockPath, 'utf8')
  }
  const eventData = parseRuleBlockEvents(ruleBlockContent)
  console.log(`  Parsed ${eventData.size} events from ruleBlock.md`)

  // Build cross-linker for event names and Event payload block names
  const allEventNames = (data.events || []).map(e => e.name).filter(Boolean)
  const allPayloadNames = (data.values || [])
    .filter(v => v.category === 'Event Payloads')
    .map(v => v.name)
    .filter(Boolean)
  const linkifyDesc = buildBlockLinker(allEventNames, allPayloadNames)

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
  lines.push('<script setup>')
  lines.push('import { nextTick, onMounted, ref, watch } from \'vue\'')
  lines.push('')
  lines.push('const blockFilter = ref(\'\')')
  lines.push('')
  lines.push('function isCodeBlock (node) {')
  lines.push('  return [...node.classList].some((className) => className.startsWith(\'language-\'))')
  lines.push('}')
  lines.push('')
  lines.push('function collectEntryNodes (heading) {')
  lines.push('  const nodes = [heading]')
  lines.push('  let current = heading.nextElementSibling')
  lines.push('  while (current && ![\'H2\', \'H3\', \'H4\', \'H5\'].includes(current.tagName)) {')
  lines.push('    nodes.push(current)')
  lines.push('    current = current.nextElementSibling')
  lines.push('  }')
  lines.push('  return nodes')
  lines.push('}')
  lines.push('')
  lines.push('function applyBlockFilter () {')
  lines.push('  const query = blockFilter.value.trim().toLowerCase()')
  lines.push('  const root = document.querySelector(\'.vp-doc\')')
  lines.push('  if (!root) return')
  lines.push('')
  lines.push('  // Collect h3 category heading names')
  lines.push('  const categoryNames = [...root.querySelectorAll(\'h3\')]')
  lines.push('    .map(h => h.textContent?.trim())')
  lines.push('    .filter(Boolean)')
  lines.push('')
  lines.push('  // Entry headings: h4 (events) and h5 (values/actions), excluding category headings')
  lines.push('  const entryHeadings = [...root.querySelectorAll(\'h4, h5\')].filter((heading) => {')
  lines.push('    return heading.textContent && !categoryNames.includes(heading.textContent.trim())')
  lines.push('  })')
  lines.push('')
  lines.push('  for (const heading of entryHeadings) {')
  lines.push('    const nodes = collectEntryNodes(heading)')
  lines.push('    const codeBlocks = nodes.filter(isCodeBlock)')
  lines.push('    const metaText = nodes')
  lines.push('      .filter((node) => !isCodeBlock(node))')
  lines.push('      .map((node) => node.textContent ?? \'\')')
  lines.push('      .join(\' \')')
  lines.push('      .toLowerCase()')
  lines.push('')
  lines.push('    const metaMatches = !query || metaText.includes(query)')
  lines.push('    const matchingCodeBlocks = codeBlocks.filter((node) => (node.textContent ?? \'\').toLowerCase().includes(query))')
  lines.push('    const visible = !query || metaMatches || matchingCodeBlocks.length > 0')
  lines.push('')
  lines.push('    for (const node of nodes) {')
  lines.push('      if (isCodeBlock(node) && query && !metaMatches) {')
  lines.push('        node.classList.toggle(\'api-filter-hidden\', !(node.textContent ?? \'\').toLowerCase().includes(query))')
  lines.push('      } else {')
  lines.push('        node.classList.toggle(\'api-filter-hidden\', !visible)')
  lines.push('      }')
  lines.push('    }')
  lines.push('  }')
  lines.push('')
  lines.push('  // Handle category headings (h3): hide if no visible entries underneath')
  lines.push('  for (const heading of [...root.querySelectorAll(\'h3\')]) {')
  lines.push('    const parent = heading.parentElement')
  lines.push('    const hasVisibleEntry = !!parent?.querySelector(\'h4:not(.api-filter-hidden), h5:not(.api-filter-hidden)\')')
  lines.push('    heading.classList.toggle(\'api-filter-hidden\', query && !hasVisibleEntry)')
  lines.push('  }')
  lines.push('')
  lines.push('  // Handle section headings (h2): hide if all their categories/entries are hidden')
  lines.push('  for (const heading of [...root.querySelectorAll(\'h2\')]) {')
  lines.push('    if (heading.textContent?.trim() === \'Summary\') continue')
  lines.push('    const parent = heading.parentElement')
  lines.push('    const hasVisibleCategory = !!parent?.querySelector(\'h3:not(.api-filter-hidden)\')')
  lines.push('    const hasVisibleEntry = !!parent?.querySelector(\'h4:not(.api-filter-hidden), h5:not(.api-filter-hidden)\')')
  lines.push('    heading.classList.toggle(\'api-filter-hidden\', query && !hasVisibleCategory && !hasVisibleEntry)')
  lines.push('  }')
  lines.push('}')
  lines.push('')
  lines.push('onMounted(() => nextTick(applyBlockFilter))')
  lines.push('watch(blockFilter, () => nextTick(applyBlockFilter))')
  lines.push('</script>')
  lines.push('')
  lines.push('# Block Code Reference')
  lines.push('')
  lines.push('This page documents all available Blocky scripting blocks in Battlefield Portal.')
  lines.push('')
  lines.push(`> **Note:** This reference was compiled from the [Battlefield Portal](https://portal.battlefield.com/bf6/experiences) website's built-in help documentation and organized here for easier navigation and cross-referencing.`)
  lines.push('')
  lines.push('<div class="api-filter">')
  lines.push('  <label for="block-filter-input">Filter Blocks</label>')
  lines.push('  <input id="block-filter-input" v-model="blockFilter" type="search" placeholder="Search block names, descriptions, types..." />')
  lines.push('</div>')
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

  // ── Events section ──
  lines.push('## Events')
  lines.push('')
  lines.push('Events trigger when something happens in the game. Each event has a set of parameters (payloads) that provide context about what occurred.')
  lines.push('')
  lines.push('In the Blocky editor, payload blocks are prefixed with `Event` (e.g. `EventPlayer`, `EventOtherPlayer`, `EventDamageType`).')
  lines.push('')

  // Ongoing event description from ruleBlock.md
  const ongoingSection = ruleBlockContent.match(/### %\{help\.rule\.typesofrule\}\n\n([\s\S]*?)(?=\n###|$)/)
  if (ongoingSection) {
    const ongoingText = ongoingSection[1].trim()
    // Extract the Ongoing description
    const ongoingMatch = ongoingText.match(/#### OnGoing\n\n([\s\S]*?)(?=\n#### |$)/)
    if (ongoingMatch) {
      lines.push('### Ongoing')
      lines.push('')
      lines.push(resolveI18n(ongoingMatch[1].trim()))
      lines.push('')
    }
  }

  // Group events by category
  const eventCategories = {
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
    if (name.match(/^OnPlayer/i)) {
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
      const name = ev.name
      const params = ev.parameters || []
      const ed = eventData.get(name)

      lines.push(`#### ${name}`)
      lines.push('')

      // Description from ruleBlock.md
      if (ed?.description) {
        lines.push(ed.description)
        lines.push('')
      }

      // Payload table
      if (params.length > 0) {
        lines.push(`| Payload | Type | Description |`)
        lines.push(`| --- | --- | --- |`)
        for (const p of params) {
          const blocklyName = eventParamToBlocklyName[p.name] || `Event${p.name}`
          // Look up payload description from ruleBlock.md data
          let pDesc = ''
          if (ed) {
            const found = ed.payloads.find(pp => pp.name === blocklyName || pp.name === p.name)
            if (found) pDesc = found.description
          }
          lines.push(`| [\`${blocklyName}\`](#${blocklyName.toLowerCase()}) | ${typeToDisplay(p.name)} | ${pDesc} |`)
        }
        lines.push('')
      } else {
        lines.push('No payload parameters.')
        lines.push('')
      }
    }
  }

  // ── Values section ──
  lines.push('## Values')
  lines.push('')
  lines.push('Value blocks return a value and can be used as inputs to other blocks.')
  lines.push('')

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

        // Try to read help file for description
        const helpContent = await readBlockHelp(item.name)
        if (helpContent) {
          const summary = linkifyDesc(extractSummary(helpContent))
          if (summary) {
            lines.push(summary)
            lines.push('')
          }
        }

        const hasParams = sigs.some(s => sigHasParams(s))
        if (hasParams) {
          lines.push(`| Signature | Return Type |`)
          lines.push(`| --- | --- |`)
          for (const sig of sigs) {
            const returnType = typeToDisplay(sig.returnType || 'void')
            const paramStr = (sig.parameterTypes || []).map(p => formatParam(p)).join(', ')
            lines.push(`| \`(${paramStr})\` | ${returnType} |`)
          }
        }
        lines.push('')
      }
    }
  }

  // ── Actions section ──
  lines.push('## Actions')
  lines.push('')
  lines.push('Action blocks perform operations and do not return a value.')
  lines.push('')

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

        // Try to read help file for description
        const helpContent = await readBlockHelp(item.name)
        if (helpContent) {
          const summary = linkifyDesc(extractSummary(helpContent))
          if (summary) {
            lines.push(summary)
            lines.push('')
          }
        }

        const hasParams = sigs.some(s => sigHasParams(s))
        if (hasParams) {
          lines.push(`| Signature |`)
          lines.push(`| --- |`)
          for (const sig of sigs) {
            const paramStr = (sig.parameterTypes || []).map(p => formatParam(p)).join(', ')
            lines.push(`| \`(${paramStr})\` |`)
          }
        }
        lines.push('')
      }
    }
  }

  // ── Objects section ──
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

  // ── Selection Lists section ──
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

  // ── Types section ──
  lines.push('## Types')
  lines.push('')
  lines.push('| Type | Category |')
  lines.push('| --- | --- |')

  // Categorize types
  const typeCategories = {}
  for (const t of types) {
    const name = typeof t === 'string' ? t : t.name
    if (typeof t !== 'string' && t.deprecated) continue

    let cat
    if (name.startsWith('Enum_')) {
      cat = 'Enumeration'
    } else if (['String', 'Number', 'Boolean', 'Global', 'Vector', 'Array', 'Any', 'any', 'Variable', 'Text'].includes(name)) {
      cat = 'Primitive'
    } else if (['Player', 'Team', 'Vehicle', 'Soldier', 'CapturePoint', 'MCOM', 'AreaTrigger', 'RingOfFire',
                'Spawner', 'SpawnPoint', 'EmplacementSpawner', 'VehicleSpawner', 'WaypointPath',
                'Sector', 'HQ', 'FixedCamera', 'InteractPoint', 'VL7Cloud', 'Seat', 'Point', 'Normal',
                'Objective', 'Weapon', 'Gadget', 'UIWidget', 'WorldIcon', 'DamageType', 'DeathType',
                'HardwareId', 'PlayerState', 'PlayerInventoryItem', 'SoldierState', 'Message',
                'WeaponPackage', 'GolmudTrainStopReason',
                'LootSpawner', 'MapSpecificFeature', 'SpatialObject', 'Squad', 'WeaponUnlock'].includes(name)) {
      cat = 'Game Entity'
    } else if (name === 'Transform') {
      cat = 'Primitive'
    } else if (['SFX', 'VFX', 'VO'].includes(name)) {
      cat = 'Audio/Visual'
    } else if (name === 'Object') {
      cat = 'Primitive'
    } else if (name === 'PortalEnum') {
      cat = 'Enumeration'
    } else if (name.endsWith('State') || name.startsWith('Player') || name.startsWith('Soldier')) {
      cat = 'State/Property'
    } else {
      cat = 'Other'
    }

    typeCategories[cat] ??= []
    typeCategories[cat].push(name)
  }

  for (const [cat, items] of Object.entries(typeCategories).sort((a, b) => a[0].localeCompare(b[0]))) {
    for (const name of items.sort()) {
      const displayName = typeToDisplay(name)
      const desc = displayName !== name ? `${displayName}` : ''
      lines.push(`| \`${name}\` | ${cat}${desc ? ` — ${desc}` : ''} |`)
    }
  }
  lines.push('')

  await writeFile(outFile, lines.join('\n'), 'utf8')
  console.log(`Generated ${outFile}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
