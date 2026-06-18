---
outline: [2, 3]
---

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

const blockFilter = ref('')

function isCodeBlock (node) {
  return [...node.classList].some((className) => className.startsWith('language-'))
}

function collectEntryNodes (heading) {
  const nodes = [heading]
  let current = heading.nextElementSibling
  while (current && !['H2', 'H3', 'H4', 'H5'].includes(current.tagName)) {
    nodes.push(current)
    current = current.nextElementSibling
  }
  return nodes
}

function applyBlockFilter () {
  const query = blockFilter.value.trim().toLowerCase()
  const root = document.querySelector('.vp-doc')
  if (!root) return

  // Collect h3 category heading names
  const categoryNames = [...root.querySelectorAll('h3')]
    .map(h => h.textContent?.trim())
    .filter(Boolean)

  // Entry headings: h4 (events) and h5 (values/actions), excluding category headings
  const entryHeadings = [...root.querySelectorAll('h4, h5')].filter((heading) => {
    return heading.textContent && !categoryNames.includes(heading.textContent.trim())
  })

  for (const heading of entryHeadings) {
    const nodes = collectEntryNodes(heading)
    const codeBlocks = nodes.filter(isCodeBlock)
    const metaText = nodes
      .filter((node) => !isCodeBlock(node))
      .map((node) => node.textContent ?? '')
      .join(' ')
      .toLowerCase()

    const metaMatches = !query || metaText.includes(query)
    const matchingCodeBlocks = codeBlocks.filter((node) => (node.textContent ?? '').toLowerCase().includes(query))
    const visible = !query || metaMatches || matchingCodeBlocks.length > 0

    for (const node of nodes) {
      if (isCodeBlock(node) && query && !metaMatches) {
        node.classList.toggle('api-filter-hidden', !(node.textContent ?? '').toLowerCase().includes(query))
      } else {
        node.classList.toggle('api-filter-hidden', !visible)
      }
    }
  }

  // Handle category headings (h3): hide if no visible entries underneath
  for (const heading of [...root.querySelectorAll('h3')]) {
    const parent = heading.parentElement
    const hasVisibleEntry = !!parent?.querySelector('h4:not(.api-filter-hidden), h5:not(.api-filter-hidden)')
    heading.classList.toggle('api-filter-hidden', query && !hasVisibleEntry)
  }

  // Handle section headings (h2): hide if all their categories/entries are hidden
  for (const heading of [...root.querySelectorAll('h2')]) {
    if (heading.textContent?.trim() === 'Summary') continue
    const parent = heading.parentElement
    const hasVisibleCategory = !!parent?.querySelector('h3:not(.api-filter-hidden)')
    const hasVisibleEntry = !!parent?.querySelector('h4:not(.api-filter-hidden), h5:not(.api-filter-hidden)')
    heading.classList.toggle('api-filter-hidden', query && !hasVisibleCategory && !hasVisibleEntry)
  }
}

onMounted(() => nextTick(applyBlockFilter))
watch(blockFilter, () => nextTick(applyBlockFilter))
</script>

# Block Code Reference

This page documents all available Blocky scripting blocks in Battlefield Portal.

> **Note:** This reference was compiled from the [Battlefield Portal](https://portal.battlefield.com/bf6/experiences) website's built-in help documentation and organized here for easier navigation and cross-referencing.

<div class="api-filter">
  <label for="block-filter-input">Filter Blocks</label>
  <input id="block-filter-input" v-model="blockFilter" type="search" placeholder="Search block names, descriptions, types..." />
</div>

## Summary

| Category | Count |
| --- | ---:|
| Objects | 25 |
| Events | 53 |
| Values | 286 |
| Actions | 210 |
| Selection Lists | 70 |
| Control Actions | 5 |
| Types | 110 |

## Events

Events trigger when something happens in the game. Each event has a set of parameters (payloads) that provide context about what occurred.

In the Blocky editor, payload blocks are prefixed with `Event` (e.g. `EventPlayer`, `EventOtherPlayer`, `EventDamageType`).

### Ongoing

Ongoing Event types continually check if its Condition has become True. If so, the Actions will be executed once. In order for the Event to execute again, the Condition must become False before becoming True again.

Ongoing Event types currently exist within the context of:
Player, Team, Vehicle and CapturePoint

Within the Player and Team contexts, payload value blocks, such as EventPlayer and EventTeam, can be used to refer to the specific Player or Team within the Event. Note: In FFA, Ongoing Team will not execute at all.

### Player

#### OnPlayerDamaged

This will trigger when a Player takes damage.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Damaged Player |
| [`EventOtherPlayer`](#eventotherplayer) | OtherPlayer | Damager Player |
| [`EventDamageType`](#eventdamagetype) | DamageType | Type of Damage Dealt |
| [`EventWeapon`](#eventweapon) | WeaponUnlock | Killing Weapon |

#### OnPlayerDeployed

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player |  |

#### OnPlayerDied

This will trigger whenever a Player dies.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Victim |
| [`EventOtherPlayer`](#eventotherplayer) | OtherPlayer | Killer |
| [`EventDeathType`](#eventdeathtype) | DeathType | Victim Death Type |
| [`EventWeapon`](#eventweapon) | WeaponUnlock | Killing Weapon |

#### OnPlayerEarnedKill

This will trigger when a Player earns a kill against another Player.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Killer |
| [`EventOtherPlayer`](#eventotherplayer) | OtherPlayer | Victim |
| [`EventDeathType`](#eventdeathtype) | DeathType |  |
| [`EventWeapon`](#eventweapon) | WeaponUnlock | Killing Weapon |

#### OnPlayerEarnedKillAssist

This will trigger when a Player earns a kill assist.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Assist Player |
| [`EventOtherPlayer`](#eventotherplayer) | OtherPlayer | Victim |

#### OnPlayerEnterAreaTrigger

This will trigger when a Player enters an AreaTrigger.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Entered Volume |
| [`EventAreaTrigger`](#eventareatrigger) | AreaTrigger | Area Trigger Entered |

#### OnPlayerEnterCapturePoint

This will trigger when a Player enters a CapturePoint capturing area.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Entering Capture Area |
| [`EventCapturePoint`](#eventcapturepoint) | CapturePoint | Capture Point Being Entered |

#### OnPlayerEnterVehicle

This will trigger when a Player enters a Vehicle.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Enters Seat |
| [`EventVehicle`](#eventvehicle) | Vehicle | Vehicle |

#### OnPlayerEnterVehicleSeat

This will trigger when a Player enters a Vehicle seat.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Enters Seat |
| [`EventVehicle`](#eventvehicle) | Vehicle | Vehicle |
| [`EventSeat`](#eventseat) | Seat | Seat Index |

#### OnPlayerEnterVL7Cloud

This will trigger when a Player enters a VL7Cloud volume.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Entering Cloud |
| [`EventVL7Cloud`](#eventvl7cloud) | VL7Cloud |  |

#### OnPlayerExitAreaTrigger

This will trigger when a Player exits an AreaTrigger.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Left Volume |
| [`EventAreaTrigger`](#eventareatrigger) | AreaTrigger | Area Trigger Exited |

#### OnPlayerExitCapturePoint

This will trigger when a Player exits a CapturePoint capturing area.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Leaving Capture Area |
| [`EventCapturePoint`](#eventcapturepoint) | CapturePoint | Capture Point Left |

#### OnPlayerExitVehicle

This will trigger when a Player exits a Vehicle.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Enters Seat |
| [`EventVehicle`](#eventvehicle) | Vehicle | Vehicle |

#### OnPlayerExitVehicleSeat

This will trigger when a Player exits a Vehicle seat.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Enters Seat |
| [`EventVehicle`](#eventvehicle) | Vehicle | Vehicle |
| [`EventSeat`](#eventseat) | Seat | Seat Index |

#### OnPlayerExitVL7Cloud

This will trigger when a Player exits a VL7Cloud volume.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Leaving Cloud |
| [`EventVL7Cloud`](#eventvl7cloud) | VL7Cloud |  |

#### OnPlayerInteract

This will trigger when a Player interacts with InteractPoint.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player Who Interacted |
| [`EventInteractPoint`](#eventinteractpoint) | InteractPoint | InteractPoint Interacted With |

#### OnPlayerJoinGame

This will trigger when a Player joins the game.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Joined Player |

#### OnPlayerLeaveGame

This will trigger when any player leaves the game.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventNumber`](#eventnumber) | Number |  |

#### OnPlayerSwitchTeam

This will trigger when a Player changes team.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player changing Team |
| [`EventTeam`](#eventteam) | Team | New Team |

#### OnPlayerUIButtonEvent

This will trigger when a Player interacts with an UI button.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player who interacted |
| [`EventUIWidget`](#eventuiwidget) | UIWidget | Button Interacted With |
| [`EventUIButtonEvent`](#eventuibuttonevent) | UIButtonEvent | Type Of Interaction |

#### OnPlayerUndeploy

This will trigger when the Player dies and returns to the deploy screen.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Dead Player |

### Capture Point

#### OnCapturePointCaptured

This will trigger when a team takes control of a CapturePoint.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventCapturePoint`](#eventcapturepoint) | CapturePoint | Captured Capture Point |

#### OnCapturePointCapturing

This will trigger when a team begins capturing a CapturePoint.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventCapturePoint`](#eventcapturepoint) | CapturePoint | Contested Capture Point |

#### OnCapturePointLost

This will trigger when a team loses control of a CapturePoint.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventCapturePoint`](#eventcapturepoint) | CapturePoint | Lost Capture Point |

### Vehicle

#### OnVehicleDestroyed

This will trigger when a Vehicle is destroyed.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventVehicle`](#eventvehicle) | Vehicle | Destroyed Vehicle |

#### OnVehicleSpawned

This will trigger when a Vehicle is called into the map.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventVehicle`](#eventvehicle) | Vehicle | Spawned Vehicle |

### MCOM

#### OnMCOMArmed

This will trigger when a MCOM is armed.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventMCOM`](#eventmcom) | MCOM | Armed MCOM |

#### OnMCOMDefused

This will trigger when a MCOM is defused.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventMCOM`](#eventmcom) | MCOM | Defused MCOM |

#### OnMCOMDestroyed

This will trigger when a MCOM detonates.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventMCOM`](#eventmcom) | MCOM | Destroyed MCOM |

### AI

#### OnAIMoveToFailed

This will trigger when an AI Soldier stops trying to reach a destination.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

#### OnAIMoveToRunning

This will trigger when an AI Soldier starts moving to a target location.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

#### OnAIMoveToSucceeded

This will trigger when an AI Soldier reaches target location.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

#### OnAIParachuteRunning

This will trigger when an AI Soldier parachute action is running.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

#### OnAIParachuteSucceeded

This will trigger when an AI Soldier parachute action has succeeded.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

#### OnAIWaypointIdleFailed

This will trigger when an AI Soldier stops following a waypoint.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

#### OnAIWaypointIdleRunning

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player |  |

#### OnAIWaypointIdleSucceeded

This will trigger when an AI Soldier finishes following a waypoint.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | AIPlayer |

### Game Mode

#### OnGameModeEnding

This will trigger when the gamemode ends.

No payload parameters.

#### OnGameModeStarted

This will trigger at the start of the gamemode.

No payload parameters.

#### OnTimeLimitReached

This will trigger when the gamemode time limit has been reached.

No payload parameters.

### Other

#### OnGolmudTrainStopped

This will trigger when the Golmud train stops.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventGolmudTrainStopReason`](#eventgolmudtrainstopreason) | GolmudTrainStopReason |  |

#### OnMandown

This will trigger when a Player is forced into the mandown state.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Downed Player |
| [`EventOtherPlayer`](#eventotherplayer) | OtherPlayer |  |

#### OnPortalGadgetAimStart

This will trigger when a Player presses the Zoom button.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player aiming PortalGadget |

#### OnPortalGadgetAimStop

This will trigger when a Player releases the Zoom button.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player who aimed PortalGadget |

#### OnPortalGadgetFireStart

This will trigger when a Player presses the Fire button.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player activating PortalGadget |

#### OnPortalGadgetFireStop

This will trigger when a Player releases the Fire button.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player no longer activating PortalGadget |

#### OnPortalGadgetLaserToggle

This will trigger when a Player presses the Tactical Device button.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Player toggling laser on PortalGadget |
| [`EventBoolean`](#eventboolean) | Boolean | whether the laser is toggled on or off |

#### OnRayCastHit

This will trigger when a Raycast hits a target.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Origin of the Raycast |
| [`EventPoint`](#eventpoint) | Point | Vector with Location of the Hit |
| [`EventNormal`](#eventnormal) | Normal | Vector with orientation of the Normal |

#### OnRayCastMissed

This will trigger when a Raycast is called and doesn't hit any target.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Origin of the Raycast |

#### OnRevived

This will trigger when a Player is revived by another Player.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Revived Player |
| [`EventOtherPlayer`](#eventotherplayer) | OtherPlayer | Reviver Player |

#### OnRingOfFireZoneSizeChange

| Payload | Type | Description |
| --- | --- | --- |
| [`EventRingOfFire`](#eventringoffire) | RingOfFire |  |
| [`EventNumber`](#eventnumber) | Number |  |

#### OnSpawnerSpawned

This will trigger when an AISpawner spawns an AI Soldier.

| Payload | Type | Description |
| --- | --- | --- |
| [`EventPlayer`](#eventplayer) | Player | Newly Spawned AI Soldier |
| [`EventSpawner`](#eventspawner) | Spawner | AI Spawner |

## Values

Value blocks return a value and can be used as inputs to other blocks.

### AI

**Behaviour**

##### AiInputItem

Return an AI input which can be used with SetAiInput

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Ai Input |

##### GetWaypointPath

Returns the waypoint path object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(waypointPathNumber: Number)` | WaypointPath |

### Arrays

##### AppendToArray

Returns a copy of an Array with the provided value appended to the end. 

_Note: It is not possible for an array to contain arrays. Attempting to append an array to an array will concatenate them instead._

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Array |

##### ArraySlice

Returns a copy of the specified Array containing only values from a specified index range.

| Signature | Return Type |
| --- | --- |
| `(array: Array, startIndex: Number, endIndex: Number)` | Array |

##### CountOf

Returns the Number of elements in the specified Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | Number |

##### CurrentArrayElement

Returns a reference to the current Array element being evaluated. Only used for FilteredArray, MappedArray, SortedArray, IsTrueForAll, and IsTrueForAny.


##### EmptyArray

Returns an initialized empty Array.


##### FilteredArray

Returns a filtered version of the specified Array based on the condition provided. This block cycles through the entire array. You can utilize the CurrentArrayElement block to represent the element in the Array for each iteration. For an Array like AllPlayers, CurrentArrayElement would represent each Player in that Array. You can then build your filter condition based on a property of that Player (like score, or some custom player Variable value).

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Array |

##### FirstOf

Returns the first value of the specified Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | void |

##### IndexOfFirstTrue

Returns the index of the first true value in the specified array.

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Number |

##### IsTrueForAll

Returns True if the provided condition is True for every element in the provided Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Boolean |

##### IsTrueForAny

Returns True if the provided condition is True for at least one element in the provided Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Boolean |

##### LastOf

Returns the value at the end of the specified Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | void |

##### MappedArray

Returns a copy of the provided Array with the values evaluated using the mapped expression provided. The following example utilizes the AllPlayers Array with GetGameModeScore and CurrentArrayElement to return an Array of Player scores.

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Array |

##### RandomizedArray

Returns a copy of the specified Array with the values in a random order.

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | Array |

##### RandomValueInArray

Returns a random value from the specified Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | void |

##### SortedArray

Returns a sorted version of the specified Array given a Number value to sort by (ascending). CurrentArrayElement can be utilized to represent each value in the Array. In the following example, CurrentArrayElement is used to represent each Player in AllPlayers. GetGameModeScore is used with CurrentArrayElement to return the score, used as a rank, to sort the Array in ascending order.

| Signature | Return Type |
| --- | --- |
| `(array: Array, index: Number)` | Array |

##### ValueInArray

Returns the value found at a provided index of an Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array, index: Number)` | void |

### Audio

##### GetSFX

Returns the SFX object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | SFX |

##### GetVO

Returns the VO object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | VO |

### Camera

##### GetFixedCamera

Returns a Fixed Camera.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | FixedCamera |

### Effects

**VFX**

##### GetVFX

Returns the VFX object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(vfxNumber: Number)` | VFX |

### Event Payloads

##### EventAreaTrigger

Returns the AreaTrigger payload from the [OnPlayerEnterAreaTrigger](#onplayerenterareatrigger) and [OnPlayerExitAreaTrigger](#onplayerexitareatrigger) Event contexts.


##### EventBoolean

Returns a Boolean payload.


##### EventCapturePoint

Returns the CapturePoint payload from the [OnCapturePointCaptured](#oncapturepointcaptured), [OnCapturePointLost](#oncapturepointlost), [OnCapturePointCapturing](#oncapturepointcapturing), [OnPlayerEnterCapturePoint](#onplayerentercapturepoint) and [OnPlayerExitCapturePoint](#onplayerexitcapturepoint) Event contexts.


##### EventDamageType

Returns the PlayerDamageTypesItem payload from the [OnPlayerDamaged](#onplayerdamaged) Event context.


##### EventDeathType

Returns the PlayerDeathTypesItem payload from the [OnPlayerDied](#onplayerdied) and [OnPlayerEarnedKill](#onplayerearnedkill) Event contexts.


##### EventEmplacementSpawner

Returns the EmplacementSpawner payload from the [Ongoing](#ongoing) (EmplacementSpawner) Event context.


##### EventFixedCamera

Currently unused EventParamter.


##### EventGolmudTrainStopReason

Part of the [OnGolmudTrainStopped](#ongolmudtrainstopped) Payload to specify why the train stopped.


##### EventHQ

Returns the HQ payload from the [Ongoing](#ongoing) (HQ) Event context.


##### EventInteractPoint

Returns the InteractPoint payload from the [OnPlayerInteract](#onplayerinteract) Event context.


##### EventMCOM

Returns the MCOM payload from the [OnMCOMArmed](#onmcomarmed), [OnMCOMDefused](#onmcomdefused) and [OnMCOMDestroyed](#onmcomdestroyed) Event contexts.


##### EventNormal

Returns the Normal payload from the OnRaycastHit Event context.


##### EventNumber

Returns the Number payload from the [OnPlayerLeaveGame](#onplayerleavegame) Event context.


##### EventOtherPlayer

Returns the Team payload from the [OnPlayerDied](#onplayerdied), [OnPlayerEarnedKill](#onplayerearnedkill), [OnPlayerEarnedKillAssist](#onplayerearnedkillassist), [OnPlayerDamaged](#onplayerdamaged), [OnRevived](#onrevived), [OnMandown](#onmandown) Event contexts.


##### EventPlayer

Returns the Player payload from many Event contexts.


##### EventPoint

Returns the Point payload from the OnRaycastHit Event context.


##### EventRingOfFire

Returns the RingOfFire payload from the [OnRingOfFireZoneSizeChange](#onringoffirezonesizechange) Event context.


##### EventSeat

Returns the Seat payload from the [OnPlayerExitVehicleSeat](#onplayerexitvehicleseat) and [OnPlayerEnterVehicleSeat](#onplayerentervehicleseat) Event contexts.


##### EventSector

Returns the Sector payload from the [Ongoing](#ongoing) (Sector) Event context.


##### EventSpawner

Returns the Spawner payload from the [OnSpawnerSpawned](#onspawnerspawned) Event context.


##### EventSpawnPoint

Returns the SpawnPoint payload from the [Ongoing](#ongoing) (SpawnPoint) Event context.


##### EventTeam

Returns the Team payload from the [OnPlayerSwitchTeam](#onplayerswitchteam) Event contexts.


##### EventUIButtonEvent

Returns the UIButtonEventItem payload from the [OnPlayerUIButtonEvent](#onplayeruibuttonevent) Event context.


##### EventUIWidget

Returns the UIWidget payload from the [OnPlayerUIButtonEvent](#onplayeruibuttonevent) Event context.


##### EventVehicle

Returns the Vehicle payload from the [OnVehicleSpawned](#onvehiclespawned), [OnVehicleDestroyed](#onvehicledestroyed), [OnPlayerExitVehicleSeat](#onplayerexitvehicleseat), [OnPlayerExitVehicle](#onplayerexitvehicle), [OnPlayerEnterVehicleSeat](#onplayerentervehicleseat) and [OnPlayerEnterVehicle](#onplayerentervehicle) Event contexts.


##### EventVehicleSpawner

Returns the VehicleSpawner payload from the [Ongoing](#ongoing) (VehicleSpawner) Event context.


##### EventVL7Cloud

Returns the VL7 from the [OnPlayerEnterVL7Cloud](#onplayerentervl7cloud) and [OnPlayerExitVL7Cloud](#onplayerexitvl7cloud) Event context.


##### EventWaypointPath

Returns the WaypointPath payload from the [Ongoing](#ongoing) (WaypointPath) Event context.


##### EventWeapon

Returns the Weapon payload from the [OnPlayerDied](#onplayerdied), [OnPlayerDamaged](#onplayerdamaged), [OnPlayerEarnedKill](#onplayerearnedkill) and [OnPlayerDamaged](#onplayerdamaged) Event contexts.


##### EventWorldIcon

Returns the WorldIcon payload from the [Ongoing](#ongoing) (WorldIcon) Event context.


### Gameplay

**Deploy**

##### GetSpawnPoint

Returns the spawn point object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | SpawnPoint |

**Gamemode**

##### GetGameModeScore

Returns the current gamemode score of the provided Player or Team.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |
| `(team: Team)` | Number |

##### GetMatchTimeElapsed

Returns the amount of time left (seconds) in the current gamemode.


##### GetMatchTimeRemaining

Returns the amount of time left (in seconds) in the current gamemode.


##### GetRingOfFire

Returns the ring of fire object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | RingOfFire |

##### GetRoundTime

Returns the time limit set for the gamemode (in seconds).


##### GetTargetScore

Returns the gamemode target score needed for victory.


##### IsFaction

Returns True if the provided Team is using soldiers from the specified Faction.

| Signature | Return Type |
| --- | --- |
| `(team: Team, factions: Factions)` | Boolean |

##### GetAreaTrigger

Returns the area trigger object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(areaTriggerNumber: Number)` | AreaTrigger |

##### GetEmplacementSpawner

Returns the emplacement spawner object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | EmplacementSpawner |

##### GetGolmudTrainLocation

Returns the World Position of the Golmud Moving Train. (Only on Golmud Railway map).


##### GetInteractPoint

Returns the interact point object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(interactPointNumber: Number)` | InteractPoint |

##### GetLootSpawner

Returns the loot spawner object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | LootSpawner |

##### GetObjId

Returns the id corresponding to the provided object.

| Signature | Return Type |
| --- | --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` | Number |

##### GetSpatialObject

Returns the spatial object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(spatialObjectNumber: Number)` | SpatialObject |

##### GetSpawner

Returns the spawner object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Spawner |

##### GetVehicleSpawner

Returns the vehicle spawner object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | VehicleSpawner |

##### GetVL7Cloud

Returns the VL7Cloud object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(vl7CloudId: Number)` | VL7Cloud |

##### IsCurrentMap

Returns True if the provided Map is the name of the current map.

| Signature | Return Type |
| --- | --- |
| `(maps: Maps)` | Boolean |

##### SpawnObject

Spawns an object at runtime. Returns an object id if the object supports it, otherwise -1

| Signature | Return Type |
| --- | --- |
| `(prefabEnum: Runtime Spawn Common \| Runtime Spawn Abbasid \| Runtime Spawn Aftermath \| Runtime Spawn Badlands \| Runtime Spawn Battery \| Runtime Spawn Capstone \| Runtime Spawn Contaminated \| Runtime Spawn Dumbo \| Runtime Spawn Eastwood \| Runtime Spawn Fire Storm \| Runtime Spawn Limestone \| Runtime Spawn Outskirts \| Runtime Spawn Subsurface \| Runtime Spawn Tungsten \| Runtime Spawn Granite Downtown \| Runtime Spawn Granite Marina \| Runtime Spawn Granite Military Rn D \| Runtime Spawn Granite Military Storage \| Runtime Spawn Granite Residential North \| Runtime Spawn Granite Tech Center \| Runtime Spawn Granite Underground \| Runtime Spawn Sand \| Runtime Spawn Golmud Railway, position: Vector, rotation: Vector, scale: Vector)` | void |
| `(prefabEnum: Runtime Spawn Common \| Runtime Spawn Abbasid \| Runtime Spawn Aftermath \| Runtime Spawn Badlands \| Runtime Spawn Battery \| Runtime Spawn Capstone \| Runtime Spawn Contaminated \| Runtime Spawn Dumbo \| Runtime Spawn Eastwood \| Runtime Spawn Fire Storm \| Runtime Spawn Limestone \| Runtime Spawn Outskirts \| Runtime Spawn Subsurface \| Runtime Spawn Tungsten \| Runtime Spawn Granite Downtown \| Runtime Spawn Granite Marina \| Runtime Spawn Granite Military Rn D \| Runtime Spawn Granite Military Storage \| Runtime Spawn Granite Residential North \| Runtime Spawn Granite Tech Center \| Runtime Spawn Granite Underground \| Runtime Spawn Sand \| Runtime Spawn Golmud Railway, position: Vector, rotation: Vector)` | void |

### Logic

##### And

Returns a Boolean value based on whether both of the provided inputs return True.

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

##### Equals

Returns a Boolean indicating if two values are equal to each other.

| Signature | Return Type |
| --- | --- |
| `(any, any)` | Boolean |

##### GreaterThan

Returns a Boolean indicating if the 1st provided value is greater than the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Boolean |

##### GreaterThanEqualTo

Returns a Boolean indicating if the 1st provided value is greater than the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(left: Number, right: Number)` | Boolean |

##### IfThenElse

Returns the 1st provided value if the condition is True, otherwise, returns the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(condition: Boolean, any, any)` | void |

##### IsType

Returns True if the provided value is equal to the specified Type.

| Signature | Return Type |
| --- | --- |
| `(any, type: Types)` | Boolean |

##### JsValue

Calls a javascript value function.

| Signature | Return Type |
| --- | --- |
| `(valueName: String, any, any)` | void |

##### LessThan

Returns a Boolean indicating if the 1st provided value is less than the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(left: Number, right: Number)` | Boolean |

##### LessThanEqualTo

Returns a Boolean indicating if the 1st provided value is less than or equal to the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(left: Number, right: Number)` | Boolean |

##### Not

Return a Boolean of the opposite value of the Boolean input.

| Signature | Return Type |
| --- | --- |
| `(boolean: Boolean)` | Boolean |

##### NotEqualTo

Returns a Boolean indicating if two values are not equal to each other.

| Signature | Return Type |
| --- | --- |
| `(any, any)` | Boolean |

##### Or

Returns a Boolean based on whether either of the two inputs are True.

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

##### Xor

Returns True if the provided Boolean inputs return different values.

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

**Messages**

##### Concat

Returns a string containing the concatenation of two strings.

| Signature | Return Type |
| --- | --- |
| `(string0: String, string1: String)` | String |

### Math

##### AbsoluteValue

Returns the unsigned value of the provided Number input.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Add

Returns the sum of two Number or two Vector values.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### AngleBetweenVectors

Returns the angle (in degrees) between two provided Vector values.

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Number |

##### AngleDifference

Returns the difference between two angles (in degrees).

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### ArccosineInDegrees

Returns the inverse cosine of a provided Number value in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArccosineInRadians

Returns the inverse cosine of a provided Number value in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArcsineInDegrees

Returns the inverse sine of a provided Number value in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArcsineInRadians

Returns the inverse sine of a provided Number value in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArctangentInDegrees

Returns the inverse tangent of a provided Number value in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArctangentInRadians

Returns the inverse tangent of a provided Number value in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Ceiling

Returns the value rounded up to the nearest integer.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### CosineFromDegrees

Returns the cosine value of a specified angle in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### CosineFromRadians

Returns the cosine value of a specified angle in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### CreateTransform

Creates a Transform from Position and Rotation Vectors

| Signature | Return Type |
| --- | --- |
| `(position: Vector, rotation: Vector)` | Transform |

##### CreateVector

Returns a Vector composed of three provided 'X' (left), 'Y' (up), and 'Z' (forward) values.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number, number2: Number)` | Vector |

##### CrossProduct

Returns the cross product between two Vector values. If the two Vector inputs are parallel, the result will be zero.

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### DegreesToRadians

Returns a value in radians from a specified value in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### DirectionFromAngles

Returns a directional Vector from the provided horizontal (yaw) and vertical (pitch) angles (in degrees).

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Vector |

##### DirectionTowards

Returns the direction, or normalized Vector, from a starting position and ending position.

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### DistanceBetween

Returns the distance between a starting position and ending position.

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Number |

##### Divide

Returns the ratio between two Number values or a Vector and Number value. A Vector divided by a Number will yield a scaled Vector.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector: Vector, number: Number)` | Vector |

##### DotProduct

Returns the dot product between two Vector values. If the two values are orthogonal to each other, the result will be zero.

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Number |

##### Floor

Returns the value rounded down to the nearest integer.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Max

Returns the greater of the two Number values provided.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### Modulo

Returns the remainder of the 1st provided value divided by the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### Multiply

Returns the product of two Number values or the product of a Vector and Number value.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector: Vector, number: Number)` | Vector |

##### Normalize

Returns a unit-length normalization of a Vector.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Vector |

##### Pi

Returns the constant value 3.14159


##### RadiansToDegrees

Returns a value in degrees from a specified value in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### RaiseToPower

Returns the 1st provided value raised to the power of the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### RandomReal

Returns a random Number between a specified minimum and maximum value (inclusive).

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### RoundToInteger

Returns a whole Number rounded from the input value. The value rounds up if the decimal of the Number is greater than or equal to 0.5, and rounds down if it is less than 0.5.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### SineFromDegrees

Returns the sine value of a specified angle in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### SineFromRadians

Returns the sine value of a specified angle in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### SquareRoot

Returns the square root of a provided Number value.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Subtract

Returns the difference between two Number values or two Vector values.

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### TangentFromDegrees

Returns the tangent value of a specified angle in degrees.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### TangentFromRadians

Returns the tangent value of a specified angle in radians.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

### Objectives

**CapturePoint**

##### AllCapturePoints

Returns an Array of all capture points within a game.


##### GetCapturePoint

Returns the CapturePoint or MCOM corresponding to the provided Capture Point or MCOM respectively.

| Signature | Return Type |
| --- | --- |
| `(id: Number)` | CapturePoint |

##### GetCaptureProgress

Returns a Number from zero to one corresponding to the capture progress of the provided CapturePoint.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Number |

##### GetCurrentOwnerTeam

Returns the current owner team corresponding to the provided capture point.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

##### GetOwnerProgressTeam

Returns the team of the team currently capturing the provided capture point.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

##### GetPlayersOnPoint

Returns a Array of all players within the boundaries of a provided CapturePoint.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Array |

##### GetPreviousOwnerTeam

Returns the previous owner team corresponding to the provided capture point.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

**Deploy**

##### GetHQ

Returns the HQ object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | HQ |

**Gamemode**

##### GetMCOM

Returns the MCOM object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | MCOM |

##### GetSector

Returns the sector object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Sector |

### Other

##### AmmoTypesItem

Returns an AmmoTypes Item which can be used with SpawnLoot.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Ammo Types |

##### ArmorTypesItem

Returns an ArmorTypes Item which can be used with SpawnLoot and AddEquipment.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Armor Types |

##### CamerasItem

Returns a Cameras Item which can be used with SetCameraType and SetCameraTypeForAll.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Cameras |

##### CustomNotificationSlotsItem

Returns a CustomNotificationSlot which can be used with DisplayCustomNotificationMessage and ClearCustomNotificationMessage.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Custom Notification Slots |

##### FactionsItem

Returns a Factions Item which can be used with IsFaction.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Factions |

##### GadgetsItem

Returns a Gadgets Item which can be used with SpawnLoot, AddEquipment, AIStartUsingGadget and AddUIGadgetImage.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Gadgets |

##### GetArgument

Returns the value of the argument that is passed into the Subroutine. The list of available parameters will populate once this block is placed inside the Subroutine.

| Signature | Return Type |
| --- | --- |
| `(subroutineArgIndex: Number)` | void |

##### GetVariable

Returns the value of a Variable.

| Signature | Return Type |
| --- | --- |
| `(variable: Variable)` | void |

##### GolmudTrainMoveCommandsItem

Returns a GolmudTrainMoveCommands for use with GolmudTrainSendMoveCommand.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Golmud Train Move Commands |

##### GolmudTrainStopReasonItem

Returns a GolmudTrainStopReason to use with the [OnGolmudTrainStopped](#ongolmudtrainstopped) Event.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Golmud Train Stop Reason |

##### GolmudTrainVariantsItem

Returns a GolmudTrainVariant used by mutators.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Golmud Train Variants |

##### InventorySlotsItem

Returns an InventorySlots Item which can be used with RemovePlayerInventoryAtSlot, SetInventoryAmmo, SetInventoryMagazineAmmo and ForceSwitchInventory.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Inventory Slots |

##### MapsItem

Returns a Maps Item which can be used with IsCurrentMap.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Maps |

##### MoveSpeedItem

Returns a MoveSpeed Item which can be used with AISetMoveSpeed.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Move Speed |

##### MusicEventsItem

Returns a triggerable music event.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Music Events |

##### MusicPackagesItem

Returns a "music package" for loading music, such as loading Core music or loading BattleRoyale music.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Music Packages |

##### MusicParamsItem

Returns a parameter that controls different parts of the music.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Music Params |

##### PlayerDamageTypesItem

Returns a PlayerDamageTypes Item which can be used with EventDamageTypeCompare.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Player Damage Types |

##### PlayerDeathTypesItem

Returns a PlayerDeathTypes Item which can be used with EventDeathTypeCompare.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Player Death Types |

##### RestrictedInputsItem

Returns a RestrictedInputs Item which can be used with EnableInputRestriction.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Restricted Inputs |

##### ResupplyTypesItem

Returns a ResupplyTypes Item which can be used with Resupply.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Resupply Types |

##### RuntimeSpawn_AbbasidItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Abbasid |

##### RuntimeSpawn_AftermathItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Aftermath |

##### RuntimeSpawn_BadlandsItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Badlands |

##### RuntimeSpawn_BatteryItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Battery |

##### RuntimeSpawn_CapstoneItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Capstone |

##### RuntimeSpawn_CommonItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Common |

##### RuntimeSpawn_ContaminatedItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Contaminated |

##### RuntimeSpawn_DumboItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Dumbo |

##### RuntimeSpawn_EastwoodItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Eastwood |

##### RuntimeSpawn_FireStormItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Fire Storm |

##### RuntimeSpawn_GolmudRailwayItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Golmud Railway |

##### RuntimeSpawn_Granite_DowntownItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Granite Downtown |

##### RuntimeSpawn_Granite_MarinaItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Granite Marina |

##### RuntimeSpawn_Granite_ResidentialNorthItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Granite Residential North |

##### RuntimeSpawn_Granite_TechCenterItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Granite Tech Center |

##### RuntimeSpawn_Granite_UndergroundItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Granite Underground |

##### RuntimeSpawn_LimestoneItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Limestone |

##### RuntimeSpawn_OutskirtsItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Outskirts |

##### RuntimeSpawn_SandItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Sand |

##### RuntimeSpawn_SubsurfaceItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Subsurface |

##### RuntimeSpawn_TungstenItem

Returns an object which can used with SpawnObject.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Runtime Spawn Tungsten |

##### ScoreboardTypeItem

Returns a ScoreboardType Item which can used with SetScoreboardType.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Scoreboard Type |

##### ScreenEffectsItem

Returns a ScreenEffectsItem which can used with EnableScreenEffect.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Screen Effects |

##### SoldierClassItem

Returns a SoldierClass Item which can be used with SpawnAIFromAISpawner.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Soldier Class |

##### SoldierEffectsItem

SoldierEffectsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Soldier Effects |

##### SoldierStateBoolItem

Returns a SoldierStateBool Item which can be used with GetSoldierState.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Soldier State Bool |

##### SoldierStateNumberItem

Returns a SoldierStateBool Item which can be used with GetSoldierState.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Soldier State Number |

##### SoldierStateVectorItem

Returns a SoldierStateBool Item which can be used with GetSoldierState.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Soldier State Vector |

##### SpawnModesItem

Returns a SpawnModes Item which can be used with SetSpawnMode.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Spawn Modes |

##### SpectatingGroupItem

Returns a SpectatingGroup for use with SetSpectatingFilters

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Spectating Group |

##### SpotStatusItem

Returns a SpotStatus Item which can be used with SpotTarget.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Spot Status |

##### StanceItem

Returns a Stance Item which can be used with AISetStance.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Stance |

##### StationaryEmplacementsItem

Returns a StationaryEmplacements Item which can be used with SetEmplacementSpawnerType.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Stationary Emplacements |

##### TypesItem

Returns a Types Item which can used with IsType.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Types |

##### UIAnchorItem

Returns a UIAnchor Item which can used with many UI Actions.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | UI Anchor |

##### UIBgFillItem

Returns a UIBgFill Item which can used with many UI Actions.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | UI Bg Fill |

##### UIButtonEventItem

Returns a UIButtonEvent Item which can used with many EnableUIButtonEvent.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | UI Button Event |

##### UIDepthItem

Returns a UIDepth Item which can used with many UI Actions.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | UI Depth |

##### UIImageTypeItem

Returns a UIImageType Item which can used with AddUIImage.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | UI Image Type |

##### VehicleCategoriesItem

Returns a VehicleCategories item.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Vehicle Categories |

##### VehicleListItem

Returns a VehicleList Item which can be used with SetVehicleSpawnerVehicleType and CompareVehicleName.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Vehicle List |

##### VehicleStateVectorItem

Returns a VehicleStateVector Item which can be used with GetVehicleState.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Vehicle State Vector |

##### VoiceOverEvents2DItem

Returns a VoiceOverEvents2D Item which can be used with PlayVO.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Voice Over Events2 D |

##### VoiceOverFlagsItem

Returns a VoiceOverFlags Item which can be used with PlayVO.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Voice Over Flags |

##### WeaponAttachmentsItem

Returns a WeaponAttachments Item which can be used with AddAttachmentToWeaponPackage.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Weapon Attachments |

##### WeaponsItem

Returns an Weapons Item which can be used with AddEquipment, and AddUIWeaponImage.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Weapons |

##### WorldIconImagesItem

Returns a WorldIconImages Item which can be used with SetWorldIconImage.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | World Icon Images |

### Player

##### AllPlayers

Returns an Array of all players within a game.


##### ClosestPlayerTo

Returns the closest alive Player to a provided position. Can be filtered using a Team. 

_Note: If no players are alive when this block is called, the returned Player will be invalid._

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Player |
| `(vector: Vector, team: Team)` | Player |

##### FarthestPlayerFrom

Returns the farthest alive Player from a provided position. Can be filtered using a Team. 

_Note: If no players are alive when this block is called, the returned Player will be invalid._

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Player |
| `(vector: Vector, team: Team)` | Player |

##### GetPlayerDeaths

Returns the total amount of deaths for the target Player.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |

##### GetPlayerKills

Returns the total amount of kills for the target Player.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |

##### GetSquad

Returns the squad object corresponding to the provided player, or team/squad id.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Squad |
| `(teamIdNumber: Number, squadIdNumber: Number)` | Squad |

##### GetSquadName

Returns a string of the name of the provided squad.

| Signature | Return Type |
| --- | --- |
| `(Squad)` | String |

##### GetTeam

Returns the team value of the specified player OR the corresponding team of the provided number.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Team |
| `(teamId: Number)` | Team |

##### IsPlayerValid

Returns True if the provided Player is valid.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Boolean |

##### IsSquadLeader

Returns a boolean checking to see if provided player is the leader of their squad.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Boolean |

**Inventory**

##### CreateNewWeaponPackage

Creates and returns a new weapon package.


**Soldier**

##### EventDamageTypeCompare

Returns a Boolean indicating if the victim was damaged by the provided DamageType.

| Signature | Return Type |
| --- | --- |
| `(damageType: DamageType, playerDamageTypes: Player Damage Types)` | Boolean |

##### EventDeathTypeCompare

Returns a Boolean indicating if the victim died by the provided DeathType.

| Signature | Return Type |
| --- | --- |
| `(deathType: DeathType, playerDeathTypes: Player Death Types)` | Boolean |

##### EventWeaponCompare

Returns a Boolean indicating if the given HardwareId is equivalent to the provided ability.

| Signature | Return Type |
| --- | --- |
| `(eventWeapon: WeaponUnlock, weapon: Weapons)` | Boolean |
| `(eventWeapon: WeaponUnlock, gadget: Gadgets)` | Boolean |

##### GetInventoryAmmo

Returns the target Player loaded ammo of the provided Inventory Slot.

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Inventory Slots)` | Number |

##### GetInventoryMagazineAmmo

Returns the target Player magazine ammo of the provided Inventory Slot.

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Inventory Slots)` | Number |

##### GetSoldierState

Returns the value of the target Player state.

| Signature | Return Type |
| --- | --- |
| `(player: Player, soldierStateNumber: Soldier State Number)` | Number |
| `(player: Player, soldierStateBool: Soldier State Bool)` | Boolean |
| `(player: Player, soldierStateVector: Soldier State Vector)` | Vector |

##### HasEquipment

Returns a boolean indicating if the provided player has the specified ability.

| Signature | Return Type |
| --- | --- |
| `(player: Player, weapon: Weapons)` | Boolean |
| `(player: Player, gadget: Gadgets)` | Boolean |

##### IsInventorySlotActive

Returns True whether or not the active inventory slot of the target Player is the provided Inventory Slot.

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Inventory Slots)` | Boolean |

##### IsSoldierClass

Returns true if the provided player is using the specified class.

| Signature | Return Type |
| --- | --- |
| `(player: Player, soldierClass: Soldier Class)` | Boolean |

### Transform

##### BackwardVector

Returns the backward directional Vector of (0, 0, 1).


##### DownVector

Returns the downward directional Vector of (0, -1, 0).


##### ForwardVector

Returns the forward directional Vector of (0, 0, -1).


##### GetObjectPosition

Returns the position vector of the provided object.

| Signature | Return Type |
| --- | --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` | Vector |

##### GetObjectRotation

Returns the rotation vector of the provided object.

| Signature | Return Type |
| --- | --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` | Vector |

##### GetObjectTransform

Returns the transform vector of the provided object.

| Signature | Return Type |
| --- | --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` | Transform |

##### GetTransformPosition

Returns the position of a Transform as a Vector.

| Signature | Return Type |
| --- | --- |
| `(transform: Transform)` | Vector |

##### GetTransformRotation

Returns the rotation of a Transform as a Vector

| Signature | Return Type |
| --- | --- |
| `(transform: Transform)` | Vector |

##### LeftVector

Returns the leftward directional Vector of (-1, 0, 0).


##### LocalPositionOf

Converts the provided world position to the corresponding position in local Player space.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### LocalVectorOf

Converts the provided world vector to the corresponding vector in local Player space.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### RightVector

Returns the rightward directional Vector of (1, 0, 0).


##### UpVector

Returns the upward directional Vector of (0, 1, 0).


##### VectorTowards

Returns the displacement Vector from a starting position to an ending position.

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### WorldPositionOf

Converts the provided local Player position to the corresponding position in the world space.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### WorldVectorOf

Converts the provided local Player vector to the corresponding vector in the world space.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### XComponentOf

Returns the 'X' component of a provided Vector.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Number |

##### YComponentOf

Returns the 'Y' component of a provided Vector.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Number |

##### ZComponentOf

Returns the 'Z' component of a provided Vector.

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Number |

### UI

##### GetWorldIcon

Returns the world icon object corresponding to the provided id.

| Signature | Return Type |
| --- | --- |
| `(worldIconNumber: Number)` | WorldIcon |

**Messages**

##### Message

Returns a constructed Message object which can be used with ShowEventGameModeMessage, ShowNotificationMessage, ShowHighlightedGameModeMessage, and DisplayCustomNotificationMessage. The Message object is created by providing a Number, Player, or format String (which can take up to 3 format items). 
A format String is a String that contains `{}` (called braces) within them, which can be substituted for parameters. For example, the String - `{} gained {} points!` - can be given a Player and Number parameter and could output as `John gained 2 points!`. See the example below for how this can be used with blocks. 

_Note: It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature | Return Type |
| --- | --- |
| `(msg: String \| Number \| Player, msgArg0: String \| Number \| Player, msgArg1: String \| Number \| Player, msgArg2: String \| Number \| Player)` | Message |
| `(msg: String \| Number \| Player, msgArg0: String \| Number \| Player, msgArg1: String \| Number \| Player)` | Message |
| `(msg: String \| Number \| Player, msgArg0: String \| Number \| Player)` | Message |
| `(msg: String \| Number \| Player)` | Message |

**UIWidgets**

##### FindUIWidgetWithName

Returns the UI Widget matching the specified name.

| Signature | Return Type |
| --- | --- |
| `(name: String, searchRoot: UIWidget)` | UIWidget |
| `(name: String)` | void |

##### GetUIButtonAlphaBase

Returns a number representing the button base alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaDisabled

Returns a number representing the button disabled alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaFocused

Returns a number representing the button focused alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaHover

Returns a number representing the button hover alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaPressed

Returns a number representing the button pressed alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonColorBase

Returns a vector representing the button base color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorDisabled

Returns a vector representing the button disabled color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorFocused

Returns a vector representing the button focused color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorHover

Returns a vector representing the button hover color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorPressed

Returns a vector representing the button pressed color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonEnabled

Returns a boolean indicating the button enabled status of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Boolean |

##### GetUIImageAlpha

Returns a number representing the image alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIImageColor

Returns a vector representing the image color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIImageType

Returns an enum value representing the image type of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UI Image Type |

##### GetUIRoot

Returns the UI Root as a UI Widget.


##### GetUITextAlpha

Returns a number representing the text alpha of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUITextAnchor

Returns an enum value representing the text anchor of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UI Anchor |

##### GetUITextColor

Returns a vector representing the text color of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUITextSize

Returns a number representing the text size of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIWidgetAnchor

Returns an enum value representing the anchor location of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UI Anchor |

##### GetUIWidgetBgAlpha

Returns the background alpha value of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIWidgetBgColor

Returns the background color vector of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIWidgetBgFill

Returns an enum value representing the background fill of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UI Bg Fill |

##### GetUIWidgetDepth

Returns an enum value representing the depth of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UI Depth |

##### GetUIWidgetName

Returns a string containing the name of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | String |

##### GetUIWidgetPadding

Returns a number representing the padding value of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIWidgetParent

Returns the Parent UI Widget of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UIWidget |

##### GetUIWidgetPosition

Returns the positional vector of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIWidgetSize

Returns the scale vector of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIWidgetVisible

Returns a boolean representing the visible state of the specified UI Widget.

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Boolean |

##### HasUIWidgetWithName

Returns a boolean indicating if the UI Widget exists.

| Signature | Return Type |
| --- | --- |
| `(name: String, searchRoot: UIWidget)` | Boolean |
| `(name: String)` | Boolean |

### Vehicles

##### AllVehicles

Returns an Array of all vehicles within a game.


##### CompareVehicleName

Returns a Boolean indicating if the target Vehicle has the same name as the provided Vehicle or if it is the same type as the provided Vehicle Type.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, vehicleList: Vehicle List)` | Boolean |

##### GetVehicleFromPlayer

Returns the Vehicle used by a Player.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Vehicle |

##### GetVehicleSeatCount

Returns the Number of seats in a Vehicle.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Number |

##### GetVehicleState

Returns the value of the target Vehicle state.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, vehicleStateVector: Vehicle State Vector)` | Vector |

##### GetVehicleTeam

Returns the team of the provided vehicle. Note: A vehicle that is not occupied will have a neutral team.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Team |

##### IsVehicleOccupied

Returns a Boolean indicating if the target Vehicle is a occupied by a player.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Boolean |

##### IsVehicleSeatOccupied

Returns a Boolean indicating if the target seat index Number of target Vehicle is a occupied by a player.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, number: Number)` | Boolean |

**Soldier**

##### GetAllPlayersInVehicle

Returns a Array of all players inside a provided Vehicle

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Array |

##### GetPlayerFromVehicleSeat

Returns the Player currently occupying the provided seat index Number of the provided Vehicle. 

_Note: If no players are in the vehicle seat when this block is called, the returned Player will be invalid._

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, number: Number)` | Player |

##### GetPlayerVehicleSeat

Returns the seat index Number for the target Player if they are in a vehicle, otherwise returns -1.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |

## Actions

Action blocks perform operations and do not return a value.

### AI

**Behaviour**

##### AIBattlefieldBehavior

Sets a Player to act independently. They will attempt to complete objectives, fire on enemy players, etc. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### AIDefendPositionBehavior

Sets a Player to defend an area around a location. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, defendPosition: Vector, minDistance: Number, maxDistance: Number)` |

##### AIIdleBehavior

Sets a Player's current position as idle point. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### AILOSMoveToBehavior

Sets a Player to move to a location with a line of sight to a specific position. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIMoveToBehavior

Sets a target Player a destination to move to. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIParachuteBehavior

Sets a Player to use parachute. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### AIValidatedMoveToBehavior

Sets a Player to move to a valid position on navmesh near a location. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIWaypointIdleBehavior

Sets a Player to patrol a waypoint. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, waypointPath: WaypointPath)` |

##### SetAiInput

Trigger AI bots input for the duration. Up to 3 simultaneous inputs (3 channels)

| Signature |
| --- |
| `(player: Player, input: Ai Input, duration: Number)` |

**Deploy**

##### AISetUnspawnOnDead

Use this on a spawner to determine if AI soldiers spawned will leave the game after they are killed.

| Signature |
| --- |
| `(spawner: Spawner, enableUnspawnOnDead: Boolean)` |

##### SetUnspawnDelayInSeconds

Sets the time (in seconds) it takes for AI soldiers from the provided Spawner to unspawn after death.

| Signature |
| --- |
| `(spawner: Spawner, delay: Number)` |

##### SpawnAIFromAISpawner

Spawn one AI soldier from a specific AI Spawner.

| Signature |
| --- |
| `(spawner: Spawner)` |
| `(spawner: Spawner, classToSpawn: Soldier Class, name: Message)` |
| `(spawner: Spawner, classToSpawn: Soldier Class)` |
| `(spawner: Spawner, name: Message)` |
| `(spawner: Spawner, team: Team)` |
| `(spawner: Spawner, classToSpawn: Soldier Class, name: Message, team: Team)` |
| `(spawner: Spawner, classToSpawn: Soldier Class, team: Team)` |
| `(spawner: Spawner, name: Message, team: Team)` |

##### UnspawnAllAIsFromAISpawner

Unspawns all AIs who were spawned by a specific AI Spawner.

| Signature |
| --- |
| `(spawner: Spawner)` |

##### AIEnableShooting

Enables or disables shooting for AI. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |
| `(player: Player, enable: Boolean)` |

##### AIEnableTargeting

Enables or disables targeting for AI. An AI unable to target cannot shoot, but will also not notice other soldiers (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |
| `(player: Player, enable: Boolean)` |

##### AIForceFire

Forces an AI player to fire or activate whatever weapon or gadget they are holding in their hands for a length of time.

| Signature |
| --- |
| `(player: Player, fireDuration: Number)` |

##### AIGadgetSettings

Tweak settings for a player's gadgets. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, applyUsageCriteria: Boolean, applyCoolDownAfterUse: Boolean, applyInaccuracy: Boolean)` |

##### AISetFocusPoint

Sets a player's focus point, possibly asking it to fire at it. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, point: Vector, isTarget: Boolean)` |

##### AISetMoveSpeed

Sets a Player's move speed for MoveTo Behaviors. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, moveSpeed: Move Speed)` |

##### AISetStance

Sets a Player's stance. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, stance: Stance)` |

##### AISetTarget

Sets a Player's current target. (Only works for AI players)

| Signature |
| --- |
| `(aiPlayer: Player, targetPlayer: Player)` |
| `(player: Player)` |

##### AIStartUsingGadget

Gives a player the instruction to use a specific gadget on a target location or player. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, gadget: Gadgets, targetPos: Vector)` |
| `(player: Player, gadget: Gadgets, targetPlayer: Player)` |

##### AIStopUsingGadget

Clears the player's gadget instructions. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### SetAIToHumanDamageModifier

Sets the damage multiplier from AI players to actualy players.

| Signature |
| --- |
| `(damageMultiplier: Number)` |

### Arrays

##### SetVariableAtIndex

Finds or initializes an Array on a provided Variable, and stores a provided value in that Array at the specified index. 

_Note: The first value in the array starts at an index of 0._

| Signature |
| --- |
| `(arrayVariable: Variable, arrayIndex: Number, any)` |

### Audio

##### PlaySound

Plays a sound using runtime spawner tech.

| Signature |
| --- |
| `(sound: SFX, amplitude: Number, team: Team)` |
| `(sound: SFX, amplitude: Number, squad: Squad)` |
| `(sound: SFX, amplitude: Number, player: Player)` |
| `(sound: SFX, amplitude: Number)` |
| `(sound: SFX, amplitude: Number, location: Vector, attenuationRange: Number, team: Team)` |
| `(sound: SFX, amplitude: Number, location: Vector, attenuationRange: Number, squad: Squad)` |
| `(sound: SFX, amplitude: Number, location: Vector, attenuationRange: Number, player: Player)` |
| `(sound: SFX, amplitude: Number, location: Vector, attenuationRange: Number)` |

##### PlayVO

Plays a voice-over event clip.

| Signature |
| --- |
| `(voiceOver: VO, event: Voice Over Events2 D, flag: Voice Over Flags)` |
| `(voiceOver: VO, event: Voice Over Events2 D, flag: Voice Over Flags, player: Player)` |
| `(voiceOver: VO, event: Voice Over Events2 D, flag: Voice Over Flags, squad: Squad)` |
| `(voiceOver: VO, event: Voice Over Events2 D, flag: Voice Over Flags, team: Team)` |

##### SetSoundAmplitude

Sets the amplitude of a given sound.

| Signature |
| --- |
| `(sound: SFX, amplitude: Number, team: Team)` |
| `(sound: SFX, amplitude: Number, squad: Squad)` |
| `(sound: SFX, amplitude: Number, player: Player)` |
| `(sound: SFX, amplitude: Number)` |

##### StopSound

Stops a given sound.

| Signature |
| --- |
| `(sound: SFX, team: Team)` |
| `(sound: SFX, squad: Squad)` |
| `(sound: SFX, player: Player)` |
| `(sound: SFX)` |

### Camera

##### SetCameraTypeForAll

Sets CameraType for all players.

| Signature |
| --- |
| `(cameraType: Cameras)` |
| `(cameraType: Cameras, cameraIndex: Number)` |

##### SetCameraTypeForPlayer

Sets CameraType for provided Player.

| Signature |
| --- |
| `(player: Player, cameraType: Cameras)` |
| `(player: Player, cameraType: Cameras, cameraIndex: Number)` |

##### SetSpectatingFiltersForAll

Sets the spectating filters. SpectatingGroup sets the selectable players in the spectating UI. ownSquadOnly and ownTeamOnly limit whether a player can spectate other squads/teams after currently spectated one is eliminated

| Signature |
| --- |
| `(group: Spectating Group, ownSquadOnly: Boolean, ownTeamOnly: Boolean)` |

##### SetSpectatingFiltersForPlayer

Sets the spectating filters. SpectatingGroup sets the selectable players in the spectating UI. ownSquadOnly and ownTeamOnly limit whether a player can spectate other squads/teams after currently spectated one is eliminated

| Signature |
| --- |
| `(player: Player, group: Spectating Group, ownSquadOnly: Boolean, ownTeamOnly: Boolean)` |

### Effects

**ScreenEffects**

##### EnableScreenEffect

Enables or disables a player-specific screen effect.

| Signature |
| --- |
| `(player: Player, screenEffect: Screen Effects, enable: Boolean)` |

**VFX**

##### EnableVFX

Enables of disables a visual effect.

| Signature |
| --- |
| `(vfx: VFX, enable: Boolean)` |

##### MoveVFX

Move a VFX to a new coordinate. May have become redundant with the creation of the universal MoveObject action.

| Signature |
| --- |
| `(vfxID: VFX, position: Vector, rotation: Vector)` |

##### SetVFXColor

Changes the color of a visual effect.

| Signature |
| --- |
| `(vfxID: VFX, color: Vector)` |

##### SetVFXScale

Changes the scale of a visual effect.

| Signature |
| --- |
| `(vfxID: VFX, scale: Number)` |

##### SetVFXSpeed

Changes the speed of a visual effect.

| Signature |
| --- |
| `(vfxID: VFX, speed: Number)` |

### Emplacements

##### ForceEmplacementSpawnerSpawn

Cause an emplacement spawner to spawn an emplacement of the type it is currently set to.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner)` |

##### SetEmplacementSpawnerAbandonVehicleOutOfCombatArea

Enables or disables the feature to destroy emplacement left outside of the combat area.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, enabled: Boolean)` |

##### SetEmplacementSpawnerApplyDamageToAbandonVehicle

Enables or disables the feature to destroy abandoned emplacements.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, enabled: Boolean)` |

##### SetEmplacementSpawnerAutoSpawn

Enables or Disables automatic emplacement respawning from the emplacement spawner.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, enabled: Boolean)` |

##### SetEmplacementSpawnerKeepAliveAbandonRadius

Sets the distance from the nearest player for an emplacement to consider itself abandoned.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, keepAliveAbandonedRadius: Number)` |

##### SetEmplacementSpawnerRespawnTime

Sets the delay after destruction before an emplacement automatically respawn, if the feature is activated.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, respawnTime: Number)` |

##### SetEmplacementSpawnerSpawnerRadius

Sets the distance its enplacement spawner for an emplacement to consider itself abandoned.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, keepAliveSpawnerRadius: Number)` |

##### SetEmplacementSpawnerTimeUntilAbandon

Sets the time left idle before an emplacement is considered abandoned.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, timeUntilAbandon: Number)` |

##### SetEmplacementSpawnerType

Sets the type of emplacement that will spawn from the emplacement spawner.

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, emplacementType: Stationary Emplacements)` |

### Gameplay

**Debug**

##### SendPortalLogToAdmin

Sends Portal Log to the admin client of the current session when hosting via "Host" (Dedicated Server). For "Host Locally," Portal Log is always available locally, so this will do nothing. Writes to PortalLog.txt on the admin's client. If admin doesn't exist, this will do nothing. Quota applies for valid log sends per session.


**Deploy**

##### DeployAllPlayers

Force spawns all players in the deploy screen.


##### EnableAllPlayerDeploy

Enables or disables spawning from the deploy screen for all players.

| Signature |
| --- |
| `(enablePlayerDeploy: Boolean)` |

##### EnablePlayerDeploy

Enables or disables the ability for a target Player to deploy.

| Signature |
| --- |
| `(player: Player, deployAllowed: Boolean)` |

##### SetRedeployTime

Overrides the time to redeploy for a target Player. 

_Note: The redeploy time must be set to a value between 0 and 60 seconds._

| Signature |
| --- |
| `(player: Player, redeployTime: Number)` |

##### UndeployAllPlayers

Undeploys all players that are alive on the battlefield back to the deploy screen.


##### UndeployPlayer

Undeploys a target Player that is alive on the battlefield back to the deploy screen.

| Signature |
| --- |
| `(player: Player)` |

**Gamemode**

##### EndGameMode

Ends the current gamemode and designates the provided Player or Team as the winner. The gamemode ends in draw if TeamId is set to 0.

| Signature |
| --- |
| `(player: Player)` |
| `(team: Team)` |

##### PauseGameModeTime

Pauses or unpauses the gamemode timer based on the provided Boolean input.

| Signature |
| --- |
| `(pauseTimer: Boolean)` |

##### ResetGameModeTime

Resets the gamemode time to its starting value.


##### RingOfFireStart

Signals the RingOfFire to start shrinking.

| Signature |
| --- |
| `(ringOfFire: RingOfFire)` |

##### SetFriendlyFire

Enables of disables friendly fire.

| Signature |
| --- |
| `(enableFriendlyFire: Boolean)` |

##### SetGameModeScore

Sets the gamemode score of the provided Player or Team.

| Signature |
| --- |
| `(team: Team, newScore: Number)` |
| `(player: Player, newScore: Number)` |

##### SetGameModeTargetScore

Sets the gamemode target score used to determine victory.

| Signature |
| --- |
| `(newScore: Number)` |

##### SetGameModeTimeLimit

Sets the duration of the game in seconds.

| Signature |
| --- |
| `(newTimeLimit: Number)` |

##### SetHQTeam

Sets a HQ to a specific Team.

| Signature |
| --- |
| `(hq: HQ, team: Team)` |

##### SetRingOfFireDamageAmount

Sets the damage dealt by the RingOfFire to players caught.

| Signature |
| --- |
| `(ringOfFireId: RingOfFire, ringOfFireDamageAmount: Number)` |

##### SetRingOfFireStableTime

Sets the duration the RingOfFire remains stable before Shrinking again.

| Signature |
| --- |
| `(ringOfFireId: RingOfFire, ringOfFireStableTime: Number)` |

##### AutoBalanceTeams

Balances Team1 and Team2 while maintaining squad compositions, requires matching team and squad capacities.


##### DisablePlayerJoin

Using this command prevents anyone from joining this server. There is no way to undo this at the time.


##### EnableAreaTrigger

Enables of disables an area trigger. This will prevent the specific Event from being fired.

| Signature |
| --- |
| `(areaTrigger: AreaTrigger, enable: Boolean)` |

##### EnableInteractPoint

Enables of disables an interact point.

| Signature |
| --- |
| `(interactPoint: InteractPoint, enable: Boolean)` |

##### GolmudTrainSendMoveCommand

Sends a move instruction to the Golmud Railway train.

| Signature |
| --- |
| `(moveCommand: Golmud Train Move Commands)` |

##### RayCast

Request the system to evaluate if a straight line between two points is interupted or not. Use [OnRayCastHit](#onraycasthit) and [OnRayCastMissed](#onraycastmissed) to read the result.

| Signature |
| --- |
| `(player: Player, start: Vector, stop: Vector)` |
| `(start: Vector, stop: Vector)` |

##### SetTeam

Sets the target Player team using the provided Team. This will force the Player back to the deploy screen. 

_Note: this block is not supported in Free-For-All._

| Signature |
| --- |
| `(player: Player, team: Team)` |

##### SetVL7CloudEffects

Enables or Disables any effect from a designated VL7Cloud object.

| Signature |
| --- |
| `(vl7Cloud: VL7Cloud, screenEffect: Boolean, soldierEffect: Boolean, visualEffect: Boolean)` |

##### SpawnLoot

Spawns a weapon or gadget at a LootSpawner.

| Signature |
| --- |
| `(lootSpawner: LootSpawner, ammo: Ammo Types)` |
| `(lootSpawner: LootSpawner, weapon: Weapons)` |
| `(lootSpawner: LootSpawner, gadget: Gadgets)` |
| `(lootSpawner: LootSpawner, armor: Armor Types)` |

##### SwitchTeams

Switches players on TeamA and TeamB. Both teams must have the same Human and Bot count.

| Signature |
| --- |
| `(teamA: Team, teamB: Team)` |

##### UnspawnAllLoot

Removes all existing loot from the world.


##### UnspawnObject

Unspawn an Object spawned using SpawnObject.

| Signature |
| --- |
| `(obj: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` |

**Health**

##### DealDamage

Deals a provided amount of damage to a target Player by a another Player.

| Signature |
| --- |
| `(player: Player, damageAmount: Number)` |
| `(player: Player, damageAmount: Number, damageGiver: Player)` |
| `(vehicle: Vehicle, damageAmount: Number)` |

##### ForceRevive

Revives a target Player who is in the mandown state.

| Signature |
| --- |
| `(player: Player)` |

##### Heal

Instantly adds a given amount of health to the target Player applied by a healer Player. 

_Note: When healing a player with a max health multiplier not equal to 1, the amount of health they receive will scale with their max health multiplier value._

| Signature |
| --- |
| `(player: Player, healAmount: Number)` |
| `(player: Player, healAmount: Number, giver: Player)` |
| `(vehicle: Vehicle, repairAmount: Number)` |

##### Kill

Kills a target Player (skips the Mandown state).

| Signature |
| --- |
| `(player: Player)` |
| `(vehicle: Vehicle)` |

**Soldier**

##### SetSoldierEffect

Applies an effect to a soldier based on a passed-in player.

| Signature |
| --- |
| `(player: Player, soldierEffects: Soldier Effects, isEnabled: Boolean)` |

##### SpotTarget

Spots a target Player for all players for a specified duration of time (in seconds).

| Signature |
| --- |
| `(targetplayer: Player, duration: Number, spotStatus: Spot Status)` |
| `(targetPlayer: Player, spotterPlayer: Player, duration: Number, spotStatus: Spot Status)` |
| `(targetplayer: Player, spotStatus: Spot Status)` |
| `(targetPlayer: Player, spotterPlayer: Player, duration: Number)` |
| `(targetplayer: Player, duration: Number)` |

### Logic

##### Abort

Stops the execution of a list of Actions in a Rule.


##### AbortIf

Stops the execution of a list of Actions in a Rule if the provided Boolean is True. Otherwise, the execution continues with the remaining Actions.

| Signature |
| --- |
| `(condition: Boolean)` |

##### ChaseVariableAtRate

Gradually modifies the value of a Variable at a specified rate (value/second) until it reaches the provided limit.

| Signature |
| --- |
| `(variable: Variable, limit: Number, deltaPerSecond: Number)` |

##### ChaseVariableOverTime

Gradually modifies the value of a Variable over time (in seconds). The variable's value will reach the limit at the end of the interval.

| Signature |
| --- |
| `(variable: Variable, limit: Number, durationSeconds: Number)` |

##### JsAction

Calls a javascript action function.

| Signature |
| --- |
| `(actionName: String, any, any)` |

##### Skip

Skips a provided number of Actions following this block within this Rule.

| Signature |
| --- |
| `(actionCount: Number)` |

##### SkipIf

Skips a provided number of Actions following this block within this Rule if the condition evaluates to True. If it does not, execution continues with the remaining Actions.

| Signature |
| --- |
| `(actionCount: Number, Boolean)` |

##### StopChasingVariable

Stops an in-progress tracking of a Variable from the ChaseVariableOverTime or ChaseVariableAtRate blocks, leaving it at its current value.

| Signature |
| --- |
| `(variable: Variable)` |

##### Wait

Pauses the execution of Actions in a Rule for a provided Number of seconds.

| Signature |
| --- |
| `(seconds: Number)` |

##### WaitUntil

Pauses the execution of Actions in a Rule for a provided Number of seconds or if the provided condition evaluates to True during that interval.

| Signature |
| --- |
| `(seconds: Number, condition: Boolean)` |

### Objectives

**CapturePoint**

##### EnableCapturePointDeploying

Enables or disables deploying on provided CapturePoint for the team that owns it.

| Signature |
| --- |
| `(capturePoint: CapturePoint, enableDeploying: Boolean)` |

##### SetCapturePointCapturingTime

Sets the capturing time for target CapturePoint to the provided Number.

| Signature |
| --- |
| `(capturePoint: CapturePoint, capturingTime: Number)` |

##### SetCapturePointNeutralizationTime

Sets the neutralization time for target CapturePoint to the provided Number.

| Signature |
| --- |
| `(capturePoint: CapturePoint, neutralizationTime: Number)` |

##### SetCapturePointOwner

Claims the provided CapturePoint for the specified Team.

| Signature |
| --- |
| `(capturePoint: CapturePoint, team: Team)` |

##### SetMaxCaptureMultiplier

Sets the capture time multiplier for target CapturePoint to the provided Number.

| Signature |
| --- |
| `(capturePoint: CapturePoint, multiplier: Number)` |

**Deploy**

##### EnableHQ

Enables or disables a headquarters.

| Signature |
| --- |
| `(hq: HQ, enable: Boolean)` |

##### EnableGameModeObjective

Enables or disables the provided Objective.

| Signature |
| --- |
| `(objective: CapturePoint \| HQ \| Sector \| MCOM, enable: Boolean)` |

##### SetMCOMFuseTime

Sets the fuse time (in seconds) for target MCOM to the provided Number

| Signature |
| --- |
| `(mCOM: MCOM, fuseTime: Number)` |

##### SetMCOMOwner

Sets the ownership of the MCOM, swapping teams will flip who can plant and defuse. Only allows for Neutral, Team1 and Team2.

| Signature |
| --- |
| `(mcom: MCOM, team: Team)` |

### Other

##### SetVariable

Sets the value of a Variable.

| Signature |
| --- |
| `(variable: Variable, any)` |

### Player

**Deploy**

##### DeployPlayer

Deploys a target Player onto the battlefield from the deploy screen.

| Signature |
| --- |
| `(player: Player)` |

##### SetSpawnMode

Determines if players are spawned automatically or not.

| Signature |
| --- |
| `(spawnModes: Spawn Modes)` |

##### SpawnPlayerFromSpawnPoint

Force Deploy a soldier from a specific spawn point.

| Signature |
| --- |
| `(player: Player, spawnPoint: SpawnPoint)` |

##### SetPlayerIncomingDamageFactor

Sets damage taken factor on player (Will be rounded to the nearest 5%). The value will be clamped between 0 - 200%.

| Signature |
| --- |
| `(player: Player, amount: Number)` |

##### Teleport

Teleports a target to a provided valid position facing a specified angle (in radians).

| Signature |
| --- |
| `(player: Player, destination: Vector, orientation: Number)` |
| `(vehicle: Vehicle, destination: Vector, orientation: Number)` |

**Inputs**

##### EnableAllInputRestrictions

Enables or disables all keyboard and mouse inputs - such as movement, firing, and turning - for a target Player.

| Signature |
| --- |
| `(player: Player, restrictInput: Boolean)` |

##### EnableInputRestriction

Enables or disables a specified Restricted Input on a target Player.

| Signature |
| --- |
| `(player: Player, inputRestriction: Restricted Inputs, restrictInput: Boolean)` |

**Inventory**

##### AddAttachmentToWeaponPackage

Adds an Attachment to a Weapon Package created through CreateWeaponPackage. Will replace existing Attachments of the same type

| Signature |
| --- |
| `(attachment: Weapon Attachments, weaponPackage: WeaponPackage)` |

##### AddEquipment

Adds a Weapon or Gadget to a Player's Loadout.

| Signature |
| --- |
| `(player: Player, weapon: Weapons)` |
| `(player: Player, gadget: Gadgets)` |
| `(player: Player, weapon: Weapons, weaponPackage: WeaponPackage)` |
| `(player: Player, Weapons, desiredInventorySlot: Inventory Slots)` |
| `(player: Player, gadget: Gadgets, desiredInventorySlot: Inventory Slots)` |
| `(player: Player, weapon: Weapons, weaponPackage: WeaponPackage, desiredInventorySlots: Inventory Slots)` |
| `(player: Player, armor: Armor Types)` |

##### ForceSwitchInventory

Forces the target Player to switch to the provided Inventory Slot.

| Signature |
| --- |
| `(player: Player, inventorySlot: Inventory Slots)` |

##### RemoveEquipment

Removes a Weapon or Gadget from a Player's Loadout.

| Signature |
| --- |
| `(player: Player, inventorySlot: Inventory Slots)` |
| `(Player, weapon: Weapons)` |
| `(Player, gadget: Gadgets)` |

##### SetInventoryAmmo

Sets the target Player loaded ammo for the provided Inventory Slot.

| Signature |
| --- |
| `(player: Player, inventorySlots: Inventory Slots, ammo: Number)` |

##### SetInventoryMagazineAmmo

Sets the target Player magazine ammo for the provided Inventory Slot.

| Signature |
| --- |
| `(player: Player, inventorySlots: Inventory Slots, magAmmo: Number)` |

**Soldier**

##### ForceManDown

Puts the target Player into the mandown state (unless mandown is disabled).

| Signature |
| --- |
| `(player: Player)` |

##### Resupply

Resupplies the target Player using a provided Resupply Type.

| Signature |
| --- |
| `(player: Player, ressuplyType: Resupply Types)` |

##### SetPlayerMaxHealth

Sets the max health of a target player from 1 to 500. The value will be multiplied by the target's max health multiplier.

| Signature |
| --- |
| `(player: Player, maxHealth: Number)` |

##### SetPlayerMovementSpeedMultiplier

Sets a player's movement speed multiplier.

| Signature |
| --- |
| `(player: Player, multiplier: Number)` |

##### SkipManDown

Sets the target Player to skip the mandown state and go directly to the deploy screen when killed.

| Signature |
| --- |
| `(player: Player, skipManDown: Boolean)` |

### Transform

##### MoveObject

Move the Object provided, Euler rotation optional

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, positionDelta: Vector)` |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, positionDelta: Vector, rotationDelta: Vector)` |

##### MoveObjectOverTime

Moves the Object by the delta position and rotation over the time provided. Options to loop indefinitely and reverse

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, positionDelta: Vector, rotationDelta: Vector, timeInSeconds: Number, shouldLoop: Boolean, shouldReverse: Boolean)` |

##### OrbitObjectOverTime

Orbits the Object around the provided transform over time. Optional orbitAxis otherwise transform's up vector is used

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, orbitTransform: Transform, timeInSeconds: Number, radius: Number, shouldLoop: Boolean, shouldReverse: Boolean, clockwise: Boolean)` |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, orbitTransform: Transform, timeInSeconds: Number, radius: Number, shouldLoop: Boolean, shouldReverse: Boolean, clockwise: Boolean, orbitAxis: Vector)` |

##### RotateObject

Rotate the Object provided using Euler angles

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, rotationDelta: Vector)` |

##### SetObjectTransform

Sets the transform of the Object provided

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, transform: Transform)` |

##### SetObjectTransformOverTime

Sets the transform of the Object provided over the time provided. Options to loop indefinitely and reverse

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, transform: Transform, timeInSeconds: Number, shouldLoop: Boolean, shouldReverse: Boolean)` |

##### StopActiveMovementForObject

Stops the Over Time movement for the provided Object if one is active

| Signature |
| --- |
| `(object: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` |

### UI

##### AddUIIcon

Attaches a new UI Icon Widget to an object.

| Signature |
| --- |
| `(parentObject: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, image: World Icon Images, verticalOffset: Number, iconColour: Vector, iconText: Message, visibility: Player \| Team)` |
| `(parentObject: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, image: World Icon Images, verticalOffset: Number, iconColour: Vector, iconText: Message)` |

##### EnableWorldIconImage

Enables or disables the image for a provided World Icons.

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableImage: Boolean)` |

##### EnableWorldIconText

Enables or disables the text for a provided World Icons. 

_Note: There is no default text, and will need to be set before or after this property is enabled to appear_.

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableText: Boolean)` |

##### RemoveUIIcon

Removes a UI Icon Widget from an object.

| Signature |
| --- |
| `(objectWithIcon: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon)` |
| `(objectWithIcon: Object \| Global \| AreaTrigger \| CapturePoint \| EmplacementSpawner \| FixedCamera \| HQ \| InteractPoint \| LootSpawner \| MapSpecificFeature \| MCOM \| Player \| RingOfFire \| Sector \| SFX \| SpatialObject \| Spawner \| SpawnPoint \| Team \| Vehicle \| VehicleSpawner \| VFX \| VL7Cloud \| VO \| WaypointPath \| WorldIcon, visibility: Player \| Team)` |

##### SetWorldIconColor

Sets the color property of a WorldIcon.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newColor: Vector)` |

##### SetWorldIconImage

Sets the image property of a WorldIcon to the selected World Icon Image.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newImage: World Icon Images)` |

##### SetWorldIconOwner

Restricts a world icon to be visible only to a specific Player or Team.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newTeamOwner: Team)` |
| `(worldIcon: WorldIcon, newPlayerOwner: Player)` |

##### SetWorldIconPosition

Sets the in-world position of a provided WorldIcon.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newPosition: Vector)` |

##### SetWorldIconText

Sets the text property for a provided WorldIcon.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newText: Message)` |

**Messages**

##### ClearAllCustomNotificationMessages

Clears all custom messages for a provided Player or Team. If no Player or Team is provided, it will clear all custom messages for everyone.

| Signature |
| --- |
| `(target: Player)` |

##### ClearCustomNotificationMessage

Clears text from the provided Custom Message for the provided Player or Team. If no Player or Team is given, it clears all players text at that Custom Message.

| Signature |
| --- |
| `(slot: Custom Notification Slots)` |
| `(slot: Custom Notification Slots, target: Player)` |
| `(slot: Custom Notification Slots, target: Team)` |

##### DisplayCustomNotificationMessage

Display a Message on-screen.

_Note: It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature |
| --- |
| `(msg: Message, slot: Custom Notification Slots, duration: Number)` |
| `(msg: Message, slot: Custom Notification Slots, duration: Number, target: Player)` |
| `(msg: Message, slot: Custom Notification Slots, duration: Number, target: Team)` |

##### DisplayHighlightedWorldLogMessage

Displays a Message on the world log above the minimap for 6 seconds. If no target is provided, it will display the Message to everyone. 

_Note: This will only appear to players that are deployed on the map. It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature |
| --- |
| `(message: Message)` |
| `(message: Message, player: Player)` |
| `(message: Message, team: Team)` |

##### DisplayNotificationMessage

Displays a notification-type Message on the top-right of the screen for 6 seconds. If no target is provided, it will display the Message to everyone. 

_Note: It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature |
| --- |
| `(message: Message)` |
| `(message: Message, player: Player)` |
| `(message: Message, team: Team)` |

##### SendErrorReport

Displays a provided Message as an error in the Admin menu.

| Signature |
| --- |
| `(message: Message)` |

**Scoreboard**

##### SetScoreboardColumnNames

Sets the name displayed at the top of score of each column. Only works for custom scoreboards.

| Signature |
| --- |
| `(column1Name: Message, column2Name: Message, column3Name: Message, column4Name: Message, column5Name: Message)` |
| `(column1Name: Message, column2Name: Message, column3Name: Message, column4Name: Message)` |
| `(column1Name: Message, column2Name: Message, column3Name: Message)` |
| `(column1Name: Message, column2Name: Message)` |
| `(column1Name: Message)` |

##### SetScoreboardColumnWidths

Sets the relative width of each column. Only works for custom scoreboards.

| Signature |
| --- |
| `(column1Width: Number, column2Width: Number, column3Width: Number, column4Width: Number, column5Width: Number)` |
| `(column1Width: Number, column2Width: Number, column3Width: Number, column4Width: Number)` |
| `(column1Width: Number, column2Width: Number, column3Width: Number)` |
| `(column1Width: Number, column2Width: Number)` |
| `(column1Width: Number)` |

##### SetScoreboardHeader

Sets the name that appears in the top-left corner of the scoreboard

| Signature |
| --- |
| `(team1Name: Message, team2Name: Message)` |
| `(headerName: Message)` |

##### SetScoreboardPlayerValues

Sets the score in up to five distinct scores for the player. Only works for custom scoreboards.

| Signature |
| --- |
| `(player: Player, column1Value: Number, column2Value: Number, column3Value: Number, column4Value: Number, column5Value: Number)` |
| `(player: Player, column1Value: Number, column2Value: Number, column3Value: Number, column4Value: Number)` |
| `(player: Player, column1Value: Number, column2Value: Number, column3Value: Number)` |
| `(player: Player, column1Value: Number, column2Value: Number)` |
| `(player: Player, column1Value: Number)` |

##### SetScoreboardSorting

Sets which column the scoreboard is sorted on. Only works for custom scoreboards.

| Signature |
| --- |
| `(sortingColumn: Number, reverseSorting: Boolean)` |
| `(sortingColumn: Number)` |

##### SetScoreboardType

Allows you to change the type of Scoreboard you want.

| Signature |
| --- |
| `(scoreboardType: Scoreboard Type)` |

**UIWidgets**

##### AddUIButton

Creates a UI Button Widget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, depth: UI Depth)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, depth: UI Depth, receiver: Player \| Team)` |

##### AddUIContainer

Creates a new UI Container Widget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, depth: UI Depth)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, depth: UI Depth, receiver: Player \| Team)` |

##### AddUIGadgetImage

Creates a new UI Image Widget based on a Gadget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, gadget: Gadgets, parent: UIWidget)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, gadget: Gadgets, parent: UIWidget, visibility: Player \| Team)` |

##### AddUIImage

Creates a new UI Image Widget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, imageType: UI Image Type)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, imageType: UI Image Type, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, imageType: UI Image Type, imageColor: Vector, imageAlpha: Number)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, imageType: UI Image Type, imageColor: Vector, imageAlpha: Number, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, imageType: UI Image Type, imageColor: Vector, imageAlpha: Number, depth: UI Depth)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, imageType: UI Image Type, imageColor: Vector, imageAlpha: Number, depth: UI Depth, receiver: Player \| Team)` |

##### AddUIText

Creates a new UI Text Widget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, message: Message)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, message: Message, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: UI Anchor)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: UI Anchor, receiver: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: UI Anchor, depth: UI Depth)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: UI Bg Fill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: UI Anchor, depth: UI Depth, receiver: Player \| Team)` |

##### AddUIWeaponImage

Creates a new UI Image Widget based on a Weapon and loadout.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, weapon: Weapons, parent: UIWidget)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, weapon: Weapons, parent: UIWidget, weaponPackage: WeaponPackage)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, weapon: Weapons, parent: UIWidget, visibility: Player \| Team)` |
| `(name: String, position: Vector, size: Vector, anchor: UI Anchor, weapon: Weapons, parent: UIWidget, weaponPackage: WeaponPackage, visibility: Player \| Team)` |

##### DeleteAllUIWidgets

Deletes all UI Widgets.


##### DeleteUIWidget

Deletes a particular UI Widget.

| Signature |
| --- |
| `(widget: UIWidget)` |

##### EnableUIButtonEvent

Determines if UI Button Widgets can send events.

| Signature |
| --- |
| `(widget: UIWidget, buttonEvent: UI Button Event, enabled: Boolean)` |

##### EnableUIInputMode

Determines if UI Buttons can be interacted with.

| Signature |
| --- |
| `(enabled: Boolean)` |
| `(enabled: Boolean, receiver: Player \| Team)` |

##### SetUIButtonAlphaBase

Changes the base alpha (transparency) of an UI Button Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaDisabled

Changes the alpha (transparency) of an UI Button Widget when it is disabled.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaFocused

Changes the alpha (transparency) of an UI Button Widget when it is focused.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaHover

Changes the alpha (transparency) of an UI Button Widget when it is hovered.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaPressed

Changes the alpha (transparency) of an UI Button Widget when it is pressed.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonColorBase

Changes the base color of an UI Button Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorDisabled

Changes the color of an UI Button Widget when it is disabled.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorFocused

Changes the color of an UI Button Widget when it is focused.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorHover

Changes the color of an UI Button Widget when it is hovered.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorPressed

Changes the color of an UI Button Widget when it is pressed.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonEnabled

Determines if a specific UI Button Widget is enabled.

| Signature |
| --- |
| `(widget: UIWidget, enabled: Boolean)` |

##### SetUIImageAlpha

Changes the alpha (transparency) of the image of an UI Image Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIImageColor

Changes the color of the image of an UI Image Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIImageType

Changes the image of an UI Image Widget.

| Signature |
| --- |
| `(widget: UIWidget, imageType: UI Image Type)` |

##### SetUITextAlpha

Changes the alpha (transparency) of the text of an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUITextAnchor

Changes the anchor of the text in an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, anchor: UI Anchor)` |

##### SetUITextColor

Changes the font color of an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUITextLabel

Changes the message displayed by an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, message: Message)` |

##### SetUITextSize

Changes the font size of an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIWidgetAnchor

Changes the anchor of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, anchor: UI Anchor)` |

##### SetUIWidgetBgAlpha

Changes the alpha (transparency) of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIWidgetBgColor

Changes the background color of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIWidgetBgFill

Changes the way the UI Widget's background is rendered.

| Signature |
| --- |
| `(widget: UIWidget, bgFill: UI Bg Fill)` |

##### SetUIWidgetDepth

Changes the draw order of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, depth: UI Depth)` |

##### SetUIWidgetName

Changes the name of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, name: String)` |

##### SetUIWidgetPadding

Changes the padding of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIWidgetParent

Changes the parent of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, parent: UIWidget)` |

##### SetUIWidgetPosition

Changes the position of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIWidgetSize

Changes the size of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIWidgetVisible

Determines if an UI Widget is visible or not.

| Signature |
| --- |
| `(widget: UIWidget, visible: Boolean)` |

### Vehicles

##### ForceVehicleSpawnerSpawn

Cause a vehicle spawner to spawn one vehicle of the type it is currently set to.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner)` |

##### SetAllVehiclesAllowedInSurroundingArea

Sets whether all vehicles are allowed in the Surrounding Area

| Signature |
| --- |
| `(allowed: Boolean)` |

##### SetMaxVehicleHeightLimitScale

Scales the maximum flight height at which vehicle engines stop providing lift.

| Signature |
| --- |
| `(heightScale: Number)` |

##### SetVehicleAllowedInSurroundingArea

Sets whether a vehicle is allowed in the Surrounding Area

| Signature |
| --- |
| `(vehicle: Vehicle List, allowed: Boolean)` |

##### SetVehicleCategoryAllowedInSurroundingArea

Sets whether a vehicle category is allowed in the Surrounding Area

| Signature |
| --- |
| `(vehicleCategory: Vehicle Categories, allowed: Boolean)` |

##### SetVehicleSpawnerAbandonVehiclesOutOfCombatArea

Enables or disables the feature to destroy vehicles left outside of the combat area.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, enabled: Boolean)` |

##### SetVehicleSpawnerApplyDamageToAbandonVehicle

Enables or disables the feature to destroy abandoned vehicles.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, enabled: Boolean)` |

##### SetVehicleSpawnerAutoSpawn

Enables or Disables automatic vehicle respawning from the vehicle spawner.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, enabled: Boolean)` |

##### SetVehicleSpawnerKeepAliveAbandonRadius

Sets the distance from the nearest player for a vehicle to consider itself abandoned.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, keepAliveAbandonedRadius: Number)` |

##### SetVehicleSpawnerKeepAliveSpawnerRadius

Sets the distance its vehicle spawner for a vehicle to consider itself abandoned.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, keepAliveSpawnerRadius: Number)` |

##### SetVehicleSpawnerRespawnTime

Sets the delay after destruction before a vehicle automatically respawn, if the feature is activated.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, respawnTime: Number)` |

##### SetVehicleSpawnerTimeUntilAbandon

Sets the time left idle before a vehicle is considered abandoned.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, timeUntilAbandon: Number)` |

##### SetVehicleSpawnerVehicleType

Sets the type of vehicle that will spawn from the vehicle spawner.

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, vehicleType: Vehicle List)` |

**Health**

##### SetVehicleMaxHealthMultiplier

Multiplies the maximum health of target Vehicle by the provided Number greater than 0 and less than or equal to 4. 

_Note: The health of a Vehicle is displayed in-game as a percentage._

| Signature |
| --- |
| `(vehicle: Vehicle, maxHealthMultiplier: Number)` |

**Soldier**

##### ForcePlayerExitVehicle

Forces the specified Player to exit the target Vehicle.

| Signature |
| --- |
| `(player: Player, vehicle: Vehicle)` |
| `(vehicle: Vehicle)` |
| `(player: Player)` |

##### ForcePlayerToSeat

Forces the specified Player into the target Vehicle at the provided seat Number. 

_Note: If the provided index is -1, that Player will be forced into the first available seat._

| Signature |
| --- |
| `(player: Player, vehicle: Vehicle, seatNumber: Number)` |

## Objects

Object blocks represent game entities and can be used as inputs to other blocks.

| Object | Type |
| --- | --- |
| `Global` | `Global` |
| `AreaTrigger` | `AreaTrigger` |
| `CapturePoint` | `CapturePoint` |
| `EmplacementSpawner` | `EmplacementSpawner` |
| `FixedCamera` | `FixedCamera` |
| `HQ` | `HQ` |
| `InteractPoint` | `InteractPoint` |
| `LootSpawner` | `LootSpawner` |
| `MapSpecificFeature` | `MapSpecificFeature` |
| `MCOM` | `MCOM` |
| `Player` | `Player` |
| `RingOfFire` | `RingOfFire` |
| `Sector` | `Sector` |
| `SFX` | `SFX` |
| `SpatialObject` | `SpatialObject` |
| `Spawner` | `Spawner` |
| `SpawnPoint` | `SpawnPoint` |
| `Team` | `Team` |
| `Vehicle` | `Vehicle` |
| `VehicleSpawner` | `VehicleSpawner` |
| `VFX` | `VFX` |
| `VL7Cloud` | `VL7Cloud` |
| `VO` | `VO` |
| `WaypointPath` | `WaypointPath` |
| `WorldIcon` | `WorldIcon` |

## Selection Lists

Selection lists are enum-like values used for dropdown parameters.

### AiInput

List type: `AiInput`
Values: **13**

| Value |
| --- |
| `Crouch` |
| `FireWeapon` |
| `Interact` |
| `Jump` |
| `Prone` |
| `Reload` |
| `SelectCharacterGadget` |
| `SelectOpenGadget` |
| `SelectPrimary` |
| `SelectSecondary` |
| `SelectThrowable` |
| `Sprint` |
| `Strafe` |

### AmmoTypes

List type: `AmmoTypes`
Values: **6**

| Value |
| --- |
| `AR_Carbine_Ammo` |
| `Armor_Plate` |
| `LMG_Ammo` |
| `Pistol_SMG_Ammo` |
| `Shotgun_Ammo` |
| `Sniper_DMR_Ammo` |

### ArmorType

List type: `ArmorTypes`
Values: **3**

| Value |
| --- |
| `CeramicArmor` |
| `NoArmor` |
| `SoftArmor` |

### Cameras

List type: `Cameras`
Values: **4**

| Value |
| --- |
| `FirstPerson` |
| `Fixed` |
| `Free` |
| `ThirdPerson` |

### CustomNotificationSlots

List type: `CustomNotificationSlots`
Values: **5**

| Value |
| --- |
| `HeaderText` |
| `MessageText1` |
| `MessageText2` |
| `MessageText3` |
| `MessageText4` |

### Factions

List type: `Factions`
Values: **2**

| Value |
| --- |
| `NATO` |
| `PaxArmata` |

### Gadgets

List type: `Gadgets`
Values: **61**

| Value |
| --- |
| `CallIn_Air_Strike` |
| `CallIn_Ammo_Drop` |
| `CallIn_Anti_Vehicle_Drop` |
| `CallIn_Artillery_Strike` |
| `CallIn_Mobile_Redeploy` |
| `CallIn_Smoke_Screen` |
| `CallIn_UAV_Overwatch` |
| `CallIn_Weapon_Drop` |
| `Class_Adrenaline_Injector` |
| `Class_Motion_Sensor` |
| `Class_Repair_Tool` |
| `Class_Supply_Bag` |
| `Deployable_Cover` |
| `Deployable_Deploy_Beacon` |
| `Deployable_EOD_Bot` |
| `Deployable_Grenade_Intercept_System` |
| `Deployable_Missile_Intercept_System` |
| `Deployable_Portable_Mortar` |
| `Deployable_Recon_Drone` |
| `Deployable_Vehicle_Supply_Crate` |
| `Launcher_Aim_Guided` |
| `Launcher_Air_Defense` |
| `Launcher_Auto_Guided` |
| `Launcher_Breaching_Projectile` |
| `Launcher_High_Explosive` |
| `Launcher_IGLA` |
| `Launcher_Incendiary_Airburst` |
| `Launcher_Long_Range` |
| `Launcher_Smoke_Grenade` |
| `Launcher_Thermobaric_Grenade` |
| `Launcher_Unguided_Rocket` |
| `Mask_Gas` |
| `Mask_NVG` |
| `Melee_Combat_Knife` |
| `Melee_Hunting_Knife` |
| `Melee_Ice_Axe` |
| `Melee_Serrated_Blade` |
| `Melee_Sledgehammer` |
| `Misc_Acoustic_Sensor_AV_Mine` |
| `Misc_Anti_Personnel_Mine` |
| `Misc_Anti_Vehicle_Mine` |
| `Misc_Assault_Ladder` |
| `Misc_Defibrillator` |
| `Misc_Demolition_Charge` |
| `Misc_Incendiary_Round_Shotgun` |
| `Misc_Laser_Designator` |
| `Misc_PortalGadget` |
| `Misc_Sniper_Decoy` |
| `Misc_Supply_Pouch` |
| `Misc_Suppression` |
| `Misc_Tracer_Dart` |
| `Misc_Tripwire_Sensor_AV_Mine` |
| `Throwable_Anti_Vehicle_Grenade` |
| `Throwable_Flash_Grenade` |
| `Throwable_Fragmentation_Grenade` |
| `Throwable_Incendiary_Grenade` |
| `Throwable_Mini_Frag_Grenade` |
| `Throwable_Proximity_Detector` |
| `Throwable_Smoke_Grenade` |
| `Throwable_Stun_Grenade` |
| `Throwable_Throwing_Knife` |

### GolmudTrainMoveCommands

List type: `GolmudTrainMoveCommands`
Values: **3**

| Value |
| --- |
| `MoveEast` |
| `MoveWest` |
| `Stop` |

### GolmudTrainStopReason

List type: `GolmudTrainStopReason`
Values: **3**

| Value |
| --- |
| `ReachedEastTerminal` |
| `ReachedWestTerminal` |
| `StoppedInTransit` |

### GolmudTrainVariants

List type: `GolmudTrainVariants`
Values: **4**

| Value |
| --- |
| `MovingTrain` |
| `None` |
| `StaticTrain_Breakthrough` |
| `StaticTrain_Rush` |

### InventorySlots

List type: `InventorySlots`
Values: **9**

| Value |
| --- |
| `Callins` |
| `ClassGadget` |
| `GadgetOne` |
| `GadgetTwo` |
| `MeleeWeapon` |
| `MiscGadget` |
| `PrimaryWeapon` |
| `SecondaryWeapon` |
| `Throwable` |

### Maps

List type: `Maps`
Values: **22**

| Value |
| --- |
| `Abbasid` |
| `Aftermath` |
| `Badlands` |
| `Battery` |
| `Capstone` |
| `Contaminated` |
| `Dumbo` |
| `Eastwood` |
| `Firestorm` |
| `GolmudRailway` |
| `Granite_ClubHouse` |
| `Granite_MainStreet` |
| `Granite_Marina` |
| `Granite_MilitaryRnD` |
| `Granite_MilitaryStorage` |
| `Granite_TechCampus` |
| `Granite_Underground` |
| `Limestone` |
| `Outskirts` |
| `Sand` |
| `Subsurface` |
| `Tungsten` |

### MoveSpeed

List type: `MoveSpeed`
Values: **7**

| Value |
| --- |
| `InvestigateRun` |
| `InvestigateSlowWalk` |
| `InvestigateWalk` |
| `Patrol` |
| `Run` |
| `Sprint` |
| `Walk` |

### MusicEvents

List type: `MusicEvents`
Values: **46**

| Value |
| --- |
| `BR_InsertionCinematic_Dropzone_Loop` |
| `BR_InsertionCinematic_Loop` |
| `BR_InsertionJump` |
| `BR_InsertionLanding` |
| `BR_LastTwoSquads` |
| `BR_Loss_Early_Loop` |
| `BR_Loss_EndOfRound_Loop` |
| `BR_Loss_SecondPlace_Loop` |
| `BR_Pause` |
| `BR_RespawnSecondChance` |
| `BR_RespawnTower` |
| `BR_Stop` |
| `BR_Unpause` |
| `BR_WonRound_Loop` |
| `BRGauntlet_LobbyFilled` |
| `BRGauntlet_WaitingForPlayers_Loop` |
| `Core_Deploy_Loop` |
| `Core_EndOfRound_Loop` |
| `Core_LastPhaseBegin` |
| `Core_Overtime_Loop` |
| `Core_PauseMenu_Loop` |
| `Core_PhaseBegin` |
| `Core_PhaseEnded` |
| `Core_Stinger_Negative` |
| `Core_Stinger_Positive` |
| `Core_Stinger_RankUp` |
| `Core_Stop` |
| `Gauntlet_Deploy` |
| `Gauntlet_Loss_FinalMission_Loop` |
| `Gauntlet_Loss_Loop` |
| `Gauntlet_MissionBriefing_Final` |
| `Gauntlet_MissionBriefing_One` |
| `Gauntlet_MissionBriefing_Three` |
| `Gauntlet_MissionBriefing_Two` |
| `Gauntlet_Pause` |
| `Gauntlet_Qualified_Loop` |
| `Gauntlet_Qualified_Outro` |
| `Gauntlet_Stop` |
| `Gauntlet_Unpause` |
| `Gauntlet_Urgency` |
| `Gauntlet_Urgency_FinalMission` |
| `Gauntlet_WonOperation_Loop` |
| `Radio_ClearQueue` |
| `Radio_NextQueuedTrack` |
| `Radio_Play` |
| `Radio_Stop` |

### MusicPackages

List type: `MusicPackages`
Values: **4**

| Value |
| --- |
| `BR` |
| `Core` |
| `Gauntlet` |
| `Radio` |

### MusicParams

List type: `MusicParams`
Values: **14**

| Value |
| --- |
| `BR_Amplitude` |
| `BRGauntlet_LobbyTimerRemaining` |
| `Core_Amplitude` |
| `Core_IsWinning` |
| `Core_PhaseUrgency` |
| `Core_Sector` |
| `Core_Urgency` |
| `Gauntlet_Amplitude` |
| `Radio_Amplitude` |
| `Radio_Biome` |
| `Radio_Channel` |
| `Radio_ContinueQueueOnTrackEnd` |
| `Radio_LoopQueuedTracks` |
| `Radio_QueueTrackNumber` |

### PlayerDamageTypes

List type: `PlayerDamageTypes`
Values: **6**

| Value |
| --- |
| `Default` |
| `Explosion` |
| `Fall` |
| `Fire` |
| `Headshot` |
| `Melee` |

### PlayerDeathTypes

List type: `PlayerDeathTypes`
Values: **11**

| Value |
| --- |
| `Deserting` |
| `Drowning` |
| `Explosion` |
| `Fall` |
| `Fire` |
| `Headshot` |
| `Melee` |
| `Penetration` |
| `Redeploy` |
| `Roadkill` |
| `Weapon` |

### PlayerFilterTypes

List type: `PlayerFilterTypes`
Values: **4**

| Value |
| --- |
| `None` |
| `Player` |
| `Squad` |
| `TeamId` |

### RestrictedInputs

List type: `RestrictedInputs`
Values: **20**

| Value |
| --- |
| `CameraPitch` |
| `CameraYaw` |
| `Crouch` |
| `CycleFire` |
| `CyclePrimary` |
| `FireWeapon` |
| `Interact` |
| `Jump` |
| `MoveForwardBack` |
| `MoveLeftRight` |
| `Prone` |
| `Reload` |
| `SelectCharacterGadget` |
| `SelectMelee` |
| `SelectOpenGadget` |
| `SelectPrimary` |
| `SelectSecondary` |
| `SelectThrowable` |
| `Sprint` |
| `Zoom` |

### ResupplyTypes

List type: `ResupplyTypes`
Values: **3**

| Value |
| --- |
| `AmmoBox` |
| `AmmoCrate` |
| `SupplyBag` |

### RuntimeSpawn_Abbasid

List type: `RuntimeSpawn_Abbasid`
Values: **1346**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-abbasid) for the full combined map-aware reference.

### RuntimeSpawn_Aftermath

List type: `RuntimeSpawn_Aftermath`
Values: **1496**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-aftermath) for the full combined map-aware reference.

### RuntimeSpawn_Badlands

List type: `RuntimeSpawn_Badlands`
Values: **891**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-badlands) for the full combined map-aware reference.

### RuntimeSpawn_Battery

List type: `RuntimeSpawn_Battery`
Values: **1232**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-battery) for the full combined map-aware reference.

### RuntimeSpawn_Capstone

List type: `RuntimeSpawn_Capstone`
Values: **610**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-capstone) for the full combined map-aware reference.

### RuntimeSpawn_Common

List type: `RuntimeSpawn_Common`
Values: **1471**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-common) for the full combined map-aware reference.

### RuntimeSpawn_Contaminated

List type: `RuntimeSpawn_Contaminated`
Values: **1346**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-contaminated) for the full combined map-aware reference.

### RuntimeSpawn_Dumbo

List type: `RuntimeSpawn_Dumbo`
Values: **1499**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-dumbo) for the full combined map-aware reference.

### RuntimeSpawn_Eastwood

List type: `RuntimeSpawn_Eastwood`
Values: **944**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-eastwood) for the full combined map-aware reference.

### RuntimeSpawn_FireStorm

List type: `RuntimeSpawn_FireStorm`
Values: **746**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-firestorm) for the full combined map-aware reference.

### RuntimeSpawn_GolmudRailway

List type: `RuntimeSpawn_GolmudRailway`
Values: **1189**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-golmudrailway) for the full combined map-aware reference.

### RuntimeSpawn_Granite_Downtown

List type: `RuntimeSpawn_Granite_Downtown`
Values: **1456**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-downtown) for the full combined map-aware reference.

### RuntimeSpawn_Granite_Marina

List type: `RuntimeSpawn_Granite_Marina`
Values: **1417**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-marina) for the full combined map-aware reference.

### RuntimeSpawn_Granite_MilitaryRnD

List type: `RuntimeSpawn_Granite_MilitaryRnD`
Values: **1064**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-militaryrnd) for the full combined map-aware reference.

### RuntimeSpawn_Granite_MilitaryStorage

List type: `RuntimeSpawn_Granite_MilitaryStorage`
Values: **1128**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-militarystorage) for the full combined map-aware reference.

### RuntimeSpawn_Granite_ResidentialNorth

List type: `RuntimeSpawn_Granite_ResidentialNorth`
Values: **909**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-residentialnorth) for the full combined map-aware reference.

### RuntimeSpawn_Granite_TechCenter

List type: `RuntimeSpawn_Granite_TechCenter`
Values: **834**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-techcenter) for the full combined map-aware reference.

### RuntimeSpawn_Granite_Underground

List type: `RuntimeSpawn_Granite_Underground`
Values: **1430**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-underground) for the full combined map-aware reference.

### RuntimeSpawn_Limestone

List type: `RuntimeSpawn_Limestone`
Values: **927**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-limestone) for the full combined map-aware reference.

### RuntimeSpawn_Outskirts

List type: `RuntimeSpawn_Outskirts`
Values: **842**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-outskirts) for the full combined map-aware reference.

### RuntimeSpawn_Sand

List type: `RuntimeSpawn_Sand`
Values: **1346**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-sand) for the full combined map-aware reference.

### RuntimeSpawn_Subsurface

List type: `RuntimeSpawn_Subsurface`
Values: **980**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-subsurface) for the full combined map-aware reference.

### RuntimeSpawn_Tungsten

List type: `RuntimeSpawn_Tungsten`
Values: **877**

This is a map-based spatial object list. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-tungsten) for the full combined map-aware reference.

### ScoreboardType

List type: `ScoreboardType`
Values: **5**

| Value |
| --- |
| `CustomFFA` |
| `CustomTwoTeams` |
| `DefaultFFA` |
| `NotSet` |
| `Off` |

### ScreenEffects

List type: `ScreenEffects`
Values: **4**

| Value |
| --- |
| `Night` |
| `Saturated` |
| `Stealth` |
| `VL7` |

### SoldierClass

List type: `SoldierClass`
Values: **4**

| Value |
| --- |
| `Assault` |
| `Engineer` |
| `Recon` |
| `Support` |

### SoldierEffects

List type: `SoldierEffects`
Values: **3**

| Value |
| --- |
| `FreezeStatusEffect` |
| `HeatStatusEffect` |
| `VL7Effect` |

### SoldierStateBool

List type: `SoldierStateBool`
Values: **21**

| Value |
| --- |
| `IsAISoldier` |
| `IsAlive` |
| `IsBeingRevived` |
| `IsCrouching` |
| `IsDead` |
| `IsFiring` |
| `IsInAir` |
| `IsInteracting` |
| `IsInVehicle` |
| `IsInWater` |
| `IsJumping` |
| `IsManDown` |
| `IsOnGround` |
| `IsParachuting` |
| `IsProne` |
| `IsReloading` |
| `IsReviving` |
| `IsSprinting` |
| `IsStanding` |
| `IsVaulting` |
| `IsZooming` |

### SoldierStateNumber

List type: `SoldierStateNumber`
Values: **6**

| Value |
| --- |
| `CurrentHealth` |
| `CurrentWeaponAmmo` |
| `CurrentWeaponMagazineAmmo` |
| `MaxHealth` |
| `NormalizedHealth` |
| `Speed` |

### SoldierStateVector

List type: `SoldierStateVector`
Values: **4**

| Value |
| --- |
| `EyePosition` |
| `GetFacingDirection` |
| `GetLinearVelocity` |
| `GetPosition` |

### SpawnModes

List type: `SpawnModes`
Values: **3**

| Value |
| --- |
| `AutoSpawn` |
| `Deploy` |
| `Spectating` |

### SpectatingGroup

List type: `SpectatingGroup`
Values: **3**

| Value |
| --- |
| `All` |
| `Squad` |
| `Team` |

### SpotStatus

List type: `SpotStatus`
Values: **4**

| Value |
| --- |
| `SpotInBoth` |
| `SpotInMinimap` |
| `SpotInWorld` |
| `Unspot` |

### Stance

List type: `Stance`
Values: **3**

| Value |
| --- |
| `Crouch` |
| `Prone` |
| `Stand` |

### StationaryEmplacementsList

List type: `StationaryEmplacements`
Values: **3**

| Value |
| --- |
| `BGM71TOW` |
| `GDF009` |
| `M2MG` |

### Types

List type: `Types`
Values: **112**

| Value |
| --- |
| `AreaTrigger` |
| `Array` |
| `Boolean` |
| `CapturePoint` |
| `DamageType` |
| `DeathType` |
| `EmplacementSpawner` |
| `Enum_AiInput` |
| `Enum_AmmoTypes` |
| `Enum_Cameras` |
| `Enum_CustomNotificationSlots` |
| `Enum_Factions` |
| `Enum_Gadgets` |
| `Enum_GolmudTrainMoveCommands` |
| `Enum_GolmudTrainStopReason` |
| `Enum_GolmudTrainVariants` |
| `Enum_InventorySlots` |
| `Enum_Maps` |
| `Enum_MoveSpeed` |
| `Enum_MusicEvents` |
| `Enum_MusicPackages` |
| `Enum_MusicParams` |
| `Enum_PlayerDamageTypes` |
| `Enum_PlayerDeathTypes` |
| `Enum_PlayerFilterTypes` |
| `Enum_RestrictedInputs` |
| `Enum_ResupplyTypes` |
| `Enum_RuntimeSpawn_Abbasid` |
| `Enum_RuntimeSpawn_Aftermath` |
| `Enum_RuntimeSpawn_Badlands` |
| `Enum_RuntimeSpawn_Battery` |
| `Enum_RuntimeSpawn_Capstone` |
| `Enum_RuntimeSpawn_Common` |
| `Enum_RuntimeSpawn_Contaminated` |
| `Enum_RuntimeSpawn_Dumbo` |
| `Enum_RuntimeSpawn_Eastwood` |
| `Enum_RuntimeSpawn_FireStorm` |
| `Enum_RuntimeSpawn_GolmudRailway` |
| `Enum_RuntimeSpawn_Granite_Downtown` |
| `Enum_RuntimeSpawn_Granite_Marina` |
| `Enum_RuntimeSpawn_Granite_MilitaryRnD` |
| `Enum_RuntimeSpawn_Granite_MilitaryStorage` |
| `Enum_RuntimeSpawn_Granite_ResidentialNorth` |
| `Enum_RuntimeSpawn_Granite_TechCenter` |
| `Enum_RuntimeSpawn_Granite_Underground` |
| `Enum_RuntimeSpawn_Limestone` |
| `Enum_RuntimeSpawn_Outskirts` |
| `Enum_RuntimeSpawn_Sand` |
| `Enum_RuntimeSpawn_Subsurface` |
| `Enum_RuntimeSpawn_Tungsten` |
| `Enum_ScoreboardType` |
| `Enum_ScreenEffects` |
| `Enum_SoldierClass` |
| `Enum_SoldierEffects` |
| `Enum_SoldierStateBool` |
| `Enum_SoldierStateNumber` |
| `Enum_SoldierStateVector` |
| `Enum_SpawnModes` |
| `Enum_SpectatingGroup` |
| `Enum_SpotStatus` |
| `Enum_Stance` |
| `Enum_StationaryEmplacements` |
| `Enum_Types` |
| `Enum_UIAnchor` |
| `Enum_UIBgFill` |
| `Enum_UIButtonEvent` |
| `Enum_UIDepth` |
| `Enum_UIImageType` |
| `Enum_VehicleCategories` |
| `Enum_VehicleList` |
| `Enum_VehicleStateVector` |
| `Enum_VoiceOverEvents2D` |
| `Enum_VoiceOverFlags` |
| `Enum_WeaponAttachments` |
| `Enum_Weapons` |
| `Enum_WorldIconImages` |
| `FixedCamera` |
| `HQ` |
| `InteractPoint` |
| `LootMissionObjectManager` |
| `LootSpawner` |
| `MapSpecificFeature` |
| `MCOM` |
| `Message` |
| `Number` |
| `Object` |
| `Player` |
| `PortalEnum` |
| `RingOfFire` |
| `ScoreboardType` |
| `ScreenEffect` |
| `Sector` |
| `SFX` |
| `SpatialObject` |
| `Spawner` |
| `SpawnPoint` |
| `Squad` |
| `String` |
| `Team` |
| `Transform` |
| `UIWidget` |
| `Variable` |
| `Vector` |
| `Vehicle` |
| `VehicleSpawner` |
| `VFX` |
| `VL7Cloud` |
| `VO` |
| `WaypointPath` |
| `WeaponPackage` |
| `WeaponUnlock` |
| `WorldIcon` |

### UIAnchor

List type: `UIAnchor`
Values: **9**

| Value |
| --- |
| `BottomCenter` |
| `BottomLeft` |
| `BottomRight` |
| `Center` |
| `CenterLeft` |
| `CenterRight` |
| `TopCenter` |
| `TopLeft` |
| `TopRight` |

### UIBgFill

List type: `UIBgFill`
Values: **9**

| Value |
| --- |
| `Blur` |
| `GradientBottom` |
| `GradientLeft` |
| `GradientRight` |
| `GradientTop` |
| `None` |
| `OutlineThick` |
| `OutlineThin` |
| `Solid` |

### UIButtonEvent

List type: `UIButtonEvent`
Values: **6**

| Value |
| --- |
| `ButtonDown` |
| `ButtonUp` |
| `FocusIn` |
| `FocusOut` |
| `HoverIn` |
| `HoverOut` |

### UIDepth

List type: `UIDepth`
Values: **2**

| Value |
| --- |
| `AboveGameUI` |
| `BelowGameUI` |

### UIImageType

List type: `UIImageType`
Values: **8**

| Value |
| --- |
| `CrownOutline` |
| `CrownSolid` |
| `None` |
| `QuestionMark` |
| `RifleAmmo` |
| `SelfHeal` |
| `SpawnBeacon` |
| `TEMP_PortalIcon` |

### VehicleCategories

List type: `VehicleCategories`
Values: **7**

| Value |
| --- |
| `Air_All` |
| `Air_Heli` |
| `Air_Plane` |
| `Ground_All` |
| `Ground_Combat` |
| `Ground_Transport` |
| `Naval_All` |

### VehicleList

List type: `VehicleList`
Values: **26**

| Value |
| --- |
| `Abrams` |
| `AH64` |
| `AH6M` |
| `AH6M_Pax` |
| `Cheetah` |
| `Couch` |
| `CV90` |
| `DirtBike` |
| `DirtBike_Pax` |
| `Eurocopter` |
| `F16` |
| `F22` |
| `Flyer60` |
| `Gepard` |
| `GolfCart` |
| `JAS39` |
| `Leopard` |
| `M2Bradley` |
| `Marauder` |
| `Marauder_Pax` |
| `Quadbike` |
| `RHIB` |
| `SU57` |
| `UH60` |
| `UH60_Pax` |
| `Vector` |

### VehicleStateVector

List type: `VehicleStateVector`
Values: **3**

| Value |
| --- |
| `FacingDirection` |
| `LinearVelocity` |
| `VehiclePosition` |

### VoiceOverEvents2D

List type: `VoiceOverEvents2D`
Values: **61**

| Value |
| --- |
| `CheckPointEnemy` |
| `CheckPointEnemyAnother` |
| `CheckPointFriendly` |
| `CheckPointFriendlyAnother` |
| `CheckPointMovingToLastEnemy` |
| `CheckPointMovingToLastFriendly` |
| `FirstSpawn` |
| `FirstSpawnDefender` |
| `GlobalAircraftAvailable` |
| `GlobalAirstrikeWarning` |
| `GlobalEOMDefeat` |
| `GlobalEOMVictory` |
| `GlobalOutOfBounds` |
| `MComArmEnemy` |
| `MComArmFriendly` |
| `MComDefuseEnemy` |
| `MComDefuseFriendly` |
| `MComDestroyedEnemy` |
| `MComDestroyedFriendly` |
| `MComDestroyedOneLeftEnemy` |
| `MComDestroyedOneLeftFriendly` |
| `ObjectiveCaptured` |
| `ObjectiveCapturedEnemy` |
| `ObjectiveCapturedEnemyGeneric` |
| `ObjectiveCapturedGeneric` |
| `ObjectiveCapturing` |
| `ObjectiveContested` |
| `ObjectiveLocated` |
| `ObjectiveLockdownEnemy` |
| `ObjectiveLockdownFriendly` |
| `ObjectiveLost` |
| `ObjectiveNeutralised` |
| `ObjectiveTerritoryLost` |
| `ObjectiveTerritoryLostGeneric` |
| `ObjectiveTerritoryTaken` |
| `ObjectiveTerritoryTakenGeneric` |
| `PlayerCountEnemyLow` |
| `PlayerCountFriendlyLow` |
| `ProgressEarlyLosing` |
| `ProgressEarlyWinning` |
| `ProgressLateLosing` |
| `ProgressLateWinning` |
| `ProgressMidLosing` |
| `ProgressMidWinning` |
| `RoundEndEnemyCapture` |
| `RoundEndEnemyKills` |
| `RoundEndFriendlyCapture` |
| `RoundEndFriendlyKills` |
| `RoundLastRound` |
| `RoundStartGeneric` |
| `RoundSuddenDeath` |
| `RoundSwitchSides` |
| `SectorTakenAttacker` |
| `SectorTakenDefender` |
| `Time120Left` |
| `Time30Left` |
| `Time60Left` |
| `TimeLow` |
| `TimeOvertime` |
| `VehicleArmoredSpawn` |
| `VehicleTankSpawn` |

### VoiceOverFlags

List type: `VoiceOverFlags`
Values: **9**

| Value |
| --- |
| `Alpha` |
| `Bravo` |
| `Charlie` |
| `Delta` |
| `Echo` |
| `Foxtrot` |
| `Golf` |
| `Hotel` |
| `India` |

### WeaponAttachments

List type: `WeaponAttachments`
Values: **329**

| Value |
| --- |
| `Ammo_Buckshot` |
| `Ammo_Flechette` |
| `Ammo_FMJ` |
| `Ammo_Frangible` |
| `Ammo_Hollow_Point` |
| `Ammo_Match_Grade` |
| `Ammo_Polymer_Case` |
| `Ammo_Slugs` |
| `Ammo_Synthetic_Tip` |
| `Ammo_Tungsten_Core` |
| `Barrel_10_Factory` |
| `Barrel_10_Full` |
| `Barrel_102mm_Compact` |
| `Barrel_105_Custom` |
| `Barrel_105_Factory` |
| `Barrel_11_Extended` |
| `Barrel_11_Heavy` |
| `Barrel_114mm_Factory` |
| `Barrel_114mm_Pencil` |
| `Barrel_115_Commando` |
| `Barrel_12_Assaulter` |
| `Barrel_12_SBR` |
| `Barrel_122mm_Factory` |
| `Barrel_122mm_Pencil` |
| `Barrel_125_Fluted` |
| `Barrel_125_Mid` |
| `Barrel_13_Factory` |
| `Barrel_13_Fluted` |
| `Barrel_13_Prototype` |
| `Barrel_13_Standard` |
| `Barrel_135mm_Long` |
| `Barrel_145_Alt` |
| `Barrel_145_Carbine` |
| `Barrel_145_Common` |
| `Barrel_145_Factory` |
| `Barrel_145_Standard` |
| `Barrel_16_Custom` |
| `Barrel_16_Factory` |
| `Barrel_16_Pencil` |
| `Barrel_16_Rifle` |
| `Barrel_16_Short` |
| `Barrel_16_US` |
| `Barrel_165_Basic` |
| `Barrel_165_Fluted` |
| `Barrel_165_LSW` |
| `Barrel_165_Rifle` |
| `Barrel_17_Cut` |
| `Barrel_17_Factory` |
| `Barrel_17_Fluted` |
| `Barrel_18_Custom` |
| `Barrel_18_EBR` |
| `Barrel_18_Extended` |
| `Barrel_18_US_LB` |
| `Barrel_180mm_Prototype` |
| `Barrel_180mm_Standard` |
| `Barrel_185_Factory` |
| `Barrel_189_Factory` |
| `Barrel_189_Prototype` |
| `Barrel_20_Factory` |
| `Barrel_20_LE` |
| `Barrel_20_Lima` |
| `Barrel_20_Long` |
| `Barrel_20_OH` |
| `Barrel_20_SDM_R` |
| `Barrel_200mm_Custom` |
| `Barrel_200mm_Custom_H` |
| `Barrel_200mm_Factory` |
| `Barrel_200mm_Fluted` |
| `Barrel_215_Factory` |
| `Barrel_215_Fluted` |
| `Barrel_22_E3_Long` |
| `Barrel_22_Factory` |
| `Barrel_225mm_Factory` |
| `Barrel_24_Bravo` |
| `Barrel_24_Extended` |
| `Barrel_24_Fluted` |
| `Barrel_24_Full` |
| `Barrel_240mm_Fluted` |
| `Barrel_240mm_SB` |
| `Barrel_245mm_Custom` |
| `Barrel_26_Carbon` |
| `Barrel_26_Factory` |
| `Barrel_264mm_Factory` |
| `Barrel_264mm_Fluted` |
| `Barrel_264mm_Prototype` |
| `Barrel_27_MK22` |
| `Barrel_303mm_LB` |
| `Barrel_305mm_Custom` |
| `Barrel_305mm_Custom_H` |
| `Barrel_314mm_Factory` |
| `Barrel_314mm_Fluted` |
| `Barrel_314mm_Prototype` |
| `Barrel_330mm_Mk3` |
| `Barrel_349mm_Fluted` |
| `Barrel_349mm_SB` |
| `Barrel_370mm_Compact` |
| `Barrel_39_Factory` |
| `Barrel_39_Pencil` |
| `Barrel_391mm_CQB` |
| `Barrel_406mm_Standard` |
| `Barrel_407mm_Civ_S` |
| `Barrel_409mm_Cut` |
| `Barrel_409mm_Factory` |
| `Barrel_409mm_Fluted` |
| `Barrel_409mm_US` |
| `Barrel_415mm_Factory` |
| `Barrel_415mm_Fluted` |
| `Barrel_415mm_Prototype` |
| `Barrel_419mm_Boar_F` |
| `Barrel_430mm_Cut` |
| `Barrel_430mm_Factory` |
| `Barrel_442_mm_CQB` |
| `Barrel_45_Compact` |
| `Barrel_450mm_Factory` |
| `Barrel_450mm_Standard` |
| `Barrel_457mm_Mk9` |
| `Barrel_457mm_Urban` |
| `Barrel_458mm_Custom` |
| `Barrel_465mm_LB` |
| `Barrel_480mm_Factory` |
| `Barrel_480mm_Fluted` |
| `Barrel_480mm_MG` |
| `Barrel_5_Factory` |
| `Barrel_5_Pencil` |
| `Barrel_508mm_Mk8` |
| `Barrel_510mm_DMR` |
| `Barrel_510mm_Fluted` |
| `Barrel_512_Compact` |
| `Barrel_514mm_Carbine` |
| `Barrel_518mm_Factory` |
| `Barrel_518mm_Fluted` |
| `Barrel_521mm_Boar` |
| `Barrel_521mm_Boar_F` |
| `Barrel_55_Factory` |
| `Barrel_55_Fluted` |
| `Barrel_550mm_Factory` |
| `Barrel_556mm_Prototype` |
| `Barrel_560mm_Cut` |
| `Barrel_560mm_Factory` |
| `Barrel_565mm_Fluted` |
| `Barrel_565mm_Para` |
| `Barrel_590mm_Factory` |
| `Barrel_6_Fluted` |
| `Barrel_6_Standard` |
| `Barrel_600mm_Cut` |
| `Barrel_600mm_DMR` |
| `Barrel_600mm_Fluted` |
| `Barrel_600mm_Tabuk` |
| `Barrel_612mm_VMW` |
| `Barrel_620mm_Classic` |
| `Barrel_646mm_Cut` |
| `Barrel_646mm_Fluted` |
| `Barrel_646mm_LSW` |
| `Barrel_65_Extended` |
| `Barrel_650mm_Factory` |
| `Barrel_650mm_Fluted` |
| `Barrel_675_Factory` |
| `Barrel_68_Factory` |
| `Barrel_68_Fluted` |
| `Barrel_730mm_3LR` |
| `Barrel_75_Compact` |
| `Barrel_8_Extended` |
| `Barrel_837_Long` |
| `Barrel_9_Factory` |
| `Barrel_9_Fluted` |
| `Barrel_9_Heavy` |
| `Barrel_IAR_Heavy` |
| `Bottom_5_mW_Green` |
| `Bottom_5_mW_Red` |
| `Bottom_50_mW_Green` |
| `Bottom_6H64_Vertical` |
| `Bottom_Adjustable_Angled` |
| `Bottom_Alloy_Vertical` |
| `Bottom_Bipod` |
| `Bottom_Canted_Stubby` |
| `Bottom_Classic_Grip_Pod` |
| `Bottom_Classic_Vertical` |
| `Bottom_Compact_Handstop` |
| `Bottom_Factory_Angled` |
| `Bottom_Flashlight` |
| `Bottom_Folding_Stubby` |
| `Bottom_Folding_Vertical` |
| `Bottom_Full_Angled` |
| `Bottom_Laser_Light_Combo_Green` |
| `Bottom_Laser_Light_Combo_Red` |
| `Bottom_Low_Profile_Stubby` |
| `Bottom_PTT_Grip_Pod` |
| `Bottom_QD_Grip_Pod` |
| `Bottom_Ribbed_Stubby` |
| `Bottom_Ribbed_Vertical` |
| `Bottom_Slim_Angled` |
| `Bottom_Slim_Handstop` |
| `Bottom_Stippled_Stubby` |
| `Bottom_Underslung_Mount` |
| `Bottom_VIS_IR_Light` |
| `Ergonomic_DLC_Bolt` |
| `Ergonomic_Improved_Mag_Catch` |
| `Ergonomic_Magwell_Flare` |
| `Ergonomic_Match_Trigger` |
| `Ergonomic_Rail_Cover` |
| `Left_120_mW_Blue` |
| `Left_5_mW_Green` |
| `Left_5_mW_Red` |
| `Left_50_mW_Blue` |
| `Left_50_mW_Green` |
| `Left_Flashlight` |
| `Left_Range_Finder` |
| `Left_VIS_IR_Light` |
| `Magazine_100rnd_Belt_Box` |
| `Magazine_100rnd_Belt_Pouch` |
| `Magazine_100rnd_Drum_Mag` |
| `Magazine_10rnd_Fast_Mag` |
| `Magazine_10rnd_Magazine` |
| `Magazine_11rnd_Magazine` |
| `Magazine_15rnd_Fast_Mag` |
| `Magazine_15rnd_Magazine` |
| `Magazine_17rnd_Fast_Mag` |
| `Magazine_17rnd_Magazine` |
| `Magazine_200rnd_Belt_Box` |
| `Magazine_20rnd_Fast_Mag` |
| `Magazine_20rnd_Magazine` |
| `Magazine_21rnd_Magazine` |
| `Magazine_22rnd_Magazine` |
| `Magazine_23rnd_Magazine` |
| `Magazine_25rnd_Fast_Mag` |
| `Magazine_25rnd_Magazine` |
| `Magazine_27rnd_Magazine` |
| `Magazine_30rnd_Fast_Mag` |
| `Magazine_30rnd_Magazine` |
| `Magazine_36rnd_Magazine` |
| `Magazine_4_Shell_Tube` |
| `Magazine_40rnd_Fast_Mag` |
| `Magazine_40rnd_Magazine` |
| `Magazine_41rnd_Magazine` |
| `Magazine_45rnd_Fast_Mag` |
| `Magazine_45rnd_Magazine` |
| `Magazine_4rnd_Fast_Mag` |
| `Magazine_4rnd_Magazine` |
| `Magazine_5_Shell_Tube` |
| `Magazine_50rnd_Belt_Pouch` |
| `Magazine_50rnd_Loose_Belt` |
| `Magazine_50rnd_Magazine` |
| `Magazine_5rnd_Fast_Mag` |
| `Magazine_5rnd_Magazine` |
| `Magazine_6_Shell_Tube` |
| `Magazine_60rnd_Drum_Mag` |
| `Magazine_60rnd_Magazine` |
| `Magazine_6rnd_Speedloader` |
| `Magazine_7_Shell_Dual_Tubes` |
| `Magazine_7_Shell_Tube` |
| `Magazine_75rnd_Belt_Box` |
| `Magazine_75rnd_Drum` |
| `Magazine_7rnd_Magazine` |
| `Magazine_8rnd_Fast_Mag` |
| `Magazine_8rnd_Magazine` |
| `Magazine_8rnd_Moon_Clip` |
| `Magazine_8rnd_Speedloader` |
| `Muzzle_Compensated_Brake` |
| `Muzzle_CQB_Suppressor` |
| `Muzzle_Double_port_Brake` |
| `Muzzle_Flash_Hider` |
| `Muzzle_Lightened_Suppressor` |
| `Muzzle_Linear_Comp` |
| `Muzzle_Long_Suppressor` |
| `Muzzle_Single_port_Brake` |
| `Muzzle_Slant_Brake` |
| `Muzzle_Standard_Suppressor` |
| `Muzzle_Thread_Protector` |
| `Muzzle_Triple_port_Brake` |
| `Right_120_mW_Blue` |
| `Right_5_mW_Green` |
| `Right_5_mW_Red` |
| `Right_50_mW_Blue` |
| `Right_50_mW_Green` |
| `Right_Flashlight` |
| `Right_Laser_Light_Combo_Green` |
| `Right_Laser_Light_Combo_Red` |
| `Right_Range_Finder` |
| `Right_VIS_IR_Light` |
| `Scope_1p87_150x` |
| `Scope_1p88_Variable` |
| `Scope_2Pro_125x` |
| `Scope_3VZR_175x` |
| `Scope_A_P2_175x` |
| `Scope_Adjustable_Magnification_200x` |
| `Scope_Adjustable_Magnification_300x` |
| `Scope_Adjustable_Magnification_400x` |
| `Scope_Anti_Glare_Coating` |
| `Scope_Aperture_Sight` |
| `Scope_Baker_300x` |
| `Scope_BF_2M_250x` |
| `Scope_Canted_Iron_Sights` |
| `Scope_CCO_200x` |
| `Scope_CQ_RDS_125x` |
| `Scope_CQB_Sights` |
| `Scope_DVO_LPVO` |
| `Scope_GRIM_150x` |
| `Scope_Iron_Sights` |
| `Scope_LDS_450x` |
| `Scope_LERT_800x` |
| `Scope_Mars_F_LPVO` |
| `Scope_MC_CO_LPVO` |
| `Scope_Mini_Flex_100x` |
| `Scope_NFX_800x` |
| `Scope_NGFC_LPVO` |
| `Scope_Osa_7_100x` |
| `Scope_PAS_35_300x` |
| `Scope_Piggyback_Reflex` |
| `Scope_PVQ_31_400x` |
| `Scope_R_MR_100x` |
| `Scope_R_VPS_1000x` |
| `Scope_R4T_200x` |
| `Scope_RO_M_175x` |
| `Scope_RO_S_125x` |
| `Scope_ROX_150x` |
| `Scope_S_VPS_600x` |
| `Scope_SDO_350x` |
| `Scope_SF_G2_500x` |
| `Scope_SM_Rifle_Variable` |
| `Scope_SSDS_600x` |
| `Scope_ST_Prism_500x` |
| `Scope_SU_123_150x` |
| `Scope_SU_230_LPVO` |
| `Scope_TS_HD_600x` |
| `Top_120_mW_Blue` |
| `Top_5_mW_Green` |
| `Top_5_mW_Red` |
| `Top_50_mW_Blue` |
| `Top_50_mW_Green` |

### Weapons

List type: `Weapons`
Values: **57**

| Value |
| --- |
| `AssaultRifle_AK4D` |
| `AssaultRifle_B36A4` |
| `AssaultRifle_KORD_6P67` |
| `AssaultRifle_L85A3` |
| `AssaultRifle_M433` |
| `AssaultRifle_NVO_228E` |
| `AssaultRifle_SOR_556_Mk2` |
| `AssaultRifle_TR_7` |
| `AssaultRifle_VCR_2` |
| `BattlePickup_MP_RMG` |
| `BattlePickup_Rorsch_Mk_2_SMRW` |
| `Carbine_AK_205` |
| `Carbine_GRT_BC` |
| `Carbine_M277` |
| `Carbine_M417_A2` |
| `Carbine_M4A1` |
| `Carbine_QBZ_192` |
| `Carbine_SG_553R` |
| `Carbine_SOR_300SC` |
| `DMR_GRT_CPS` |
| `DMR_LMR27` |
| `DMR_M39_EMR` |
| `DMR_SVDM` |
| `DMR_SVK_86` |
| `LMG_DRS_IAR` |
| `LMG_KTS100_MK8` |
| `LMG_L110` |
| `LMG_M_60` |
| `LMG_M121_A2` |
| `LMG_M123K` |
| `LMG_M240L` |
| `LMG_M250` |
| `LMG_RPKM` |
| `Shotgun__185KS_K` |
| `Shotgun_DB_12` |
| `Shotgun_M1014` |
| `Shotgun_M87A1` |
| `Sidearm_ES_57` |
| `Sidearm_GGH_22` |
| `Sidearm_M357_Trait` |
| `Sidearm_M44` |
| `Sidearm_M45A1` |
| `Sidearm_P18` |
| `Sidearm_VZ_61` |
| `SMG_CZ3A1` |
| `SMG_KV9` |
| `SMG_PW5A3` |
| `SMG_PW7A2` |
| `SMG_SCW_10` |
| `SMG_SGX` |
| `SMG_SL9` |
| `SMG_UMG_40` |
| `SMG_USG_90` |
| `Sniper_M2010_ESR` |
| `Sniper_Mini_Scout` |
| `Sniper_PSR` |
| `Sniper_SV_98` |

### WorldIconImages

List type: `WorldIconImages`
Values: **16**

| Value |
| --- |
| `Alert` |
| `Assist` |
| `Bomb` |
| `BombArmed` |
| `Cross` |
| `DangerPing` |
| `Diffuse` |
| `EMP` |
| `Explosion` |
| `Eye` |
| `FilledPing` |
| `Flag` |
| `Hazard` |
| `Skull` |
| `SquadPing` |
| `Triangle` |

## Types

| Type | Category |
| --- | --- |
| `SFX` | Audio/Visual |
| `VFX` | Audio/Visual |
| `VO` | Audio/Visual |
| `Enum_AiInput` | Enumeration — Ai Input |
| `Enum_AmmoTypes` | Enumeration — Ammo Types |
| `Enum_ArmorTypes` | Enumeration — Armor Types |
| `Enum_Cameras` | Enumeration — Cameras |
| `Enum_CustomNotificationSlots` | Enumeration — Custom Notification Slots |
| `Enum_Factions` | Enumeration — Factions |
| `Enum_Gadgets` | Enumeration — Gadgets |
| `Enum_GolmudTrainMoveCommands` | Enumeration — Golmud Train Move Commands |
| `Enum_GolmudTrainStopReason` | Enumeration — Golmud Train Stop Reason |
| `Enum_GolmudTrainVariants` | Enumeration — Golmud Train Variants |
| `Enum_InventorySlots` | Enumeration — Inventory Slots |
| `Enum_Maps` | Enumeration — Maps |
| `Enum_MoveSpeed` | Enumeration — Move Speed |
| `Enum_MusicEvents` | Enumeration — Music Events |
| `Enum_MusicPackages` | Enumeration — Music Packages |
| `Enum_MusicParams` | Enumeration — Music Params |
| `Enum_PlayerDamageTypes` | Enumeration — Player Damage Types |
| `Enum_PlayerDeathTypes` | Enumeration — Player Death Types |
| `Enum_PlayerFilterTypes` | Enumeration — Player Filter Types |
| `Enum_RestrictedInputs` | Enumeration — Restricted Inputs |
| `Enum_ResupplyTypes` | Enumeration — Resupply Types |
| `Enum_RuntimeSpawn_Abbasid` | Enumeration — Runtime Spawn Abbasid |
| `Enum_RuntimeSpawn_Aftermath` | Enumeration — Runtime Spawn Aftermath |
| `Enum_RuntimeSpawn_Badlands` | Enumeration — Runtime Spawn Badlands |
| `Enum_RuntimeSpawn_Battery` | Enumeration — Runtime Spawn Battery |
| `Enum_RuntimeSpawn_Capstone` | Enumeration — Runtime Spawn Capstone |
| `Enum_RuntimeSpawn_Common` | Enumeration — Runtime Spawn Common |
| `Enum_RuntimeSpawn_Contaminated` | Enumeration — Runtime Spawn Contaminated |
| `Enum_RuntimeSpawn_Dumbo` | Enumeration — Runtime Spawn Dumbo |
| `Enum_RuntimeSpawn_Eastwood` | Enumeration — Runtime Spawn Eastwood |
| `Enum_RuntimeSpawn_FireStorm` | Enumeration — Runtime Spawn Fire Storm |
| `Enum_RuntimeSpawn_GolmudRailway` | Enumeration — Runtime Spawn Golmud Railway |
| `Enum_RuntimeSpawn_Granite_Downtown` | Enumeration — Runtime Spawn Granite Downtown |
| `Enum_RuntimeSpawn_Granite_Marina` | Enumeration — Runtime Spawn Granite Marina |
| `Enum_RuntimeSpawn_Granite_MilitaryRnD` | Enumeration — Runtime Spawn Granite Military Rn D |
| `Enum_RuntimeSpawn_Granite_MilitaryStorage` | Enumeration — Runtime Spawn Granite Military Storage |
| `Enum_RuntimeSpawn_Granite_ResidentialNorth` | Enumeration — Runtime Spawn Granite Residential North |
| `Enum_RuntimeSpawn_Granite_TechCenter` | Enumeration — Runtime Spawn Granite Tech Center |
| `Enum_RuntimeSpawn_Granite_Underground` | Enumeration — Runtime Spawn Granite Underground |
| `Enum_RuntimeSpawn_Limestone` | Enumeration — Runtime Spawn Limestone |
| `Enum_RuntimeSpawn_Outskirts` | Enumeration — Runtime Spawn Outskirts |
| `Enum_RuntimeSpawn_Sand` | Enumeration — Runtime Spawn Sand |
| `Enum_RuntimeSpawn_Subsurface` | Enumeration — Runtime Spawn Subsurface |
| `Enum_RuntimeSpawn_Tungsten` | Enumeration — Runtime Spawn Tungsten |
| `Enum_ScoreboardType` | Enumeration — Scoreboard Type |
| `Enum_ScreenEffects` | Enumeration — Screen Effects |
| `Enum_SoldierClass` | Enumeration — Soldier Class |
| `Enum_SoldierEffects` | Enumeration — Soldier Effects |
| `Enum_SoldierStateBool` | Enumeration — Soldier State Bool |
| `Enum_SoldierStateNumber` | Enumeration — Soldier State Number |
| `Enum_SoldierStateVector` | Enumeration — Soldier State Vector |
| `Enum_SpawnModes` | Enumeration — Spawn Modes |
| `Enum_SpectatingGroup` | Enumeration — Spectating Group |
| `Enum_SpotStatus` | Enumeration — Spot Status |
| `Enum_Stance` | Enumeration — Stance |
| `Enum_StationaryEmplacements` | Enumeration — Stationary Emplacements |
| `Enum_Types` | Enumeration — Types |
| `Enum_UIAnchor` | Enumeration — UI Anchor |
| `Enum_UIBgFill` | Enumeration — UI Bg Fill |
| `Enum_UIButtonEvent` | Enumeration — UI Button Event |
| `Enum_UIDepth` | Enumeration — UI Depth |
| `Enum_UIImageType` | Enumeration — UI Image Type |
| `Enum_VehicleCategories` | Enumeration — Vehicle Categories |
| `Enum_VehicleList` | Enumeration — Vehicle List |
| `Enum_VehicleStateVector` | Enumeration — Vehicle State Vector |
| `Enum_VoiceOverEvents2D` | Enumeration — Voice Over Events2 D |
| `Enum_VoiceOverFlags` | Enumeration — Voice Over Flags |
| `Enum_WeaponAttachments` | Enumeration — Weapon Attachments |
| `Enum_Weapons` | Enumeration — Weapons |
| `Enum_WorldIconImages` | Enumeration — World Icon Images |
| `PortalEnum` | Enumeration |
| `AreaTrigger` | Game Entity |
| `CapturePoint` | Game Entity |
| `DamageType` | Game Entity |
| `DeathType` | Game Entity |
| `EmplacementSpawner` | Game Entity |
| `FixedCamera` | Game Entity |
| `HQ` | Game Entity |
| `InteractPoint` | Game Entity |
| `LootSpawner` | Game Entity |
| `MCOM` | Game Entity |
| `MapSpecificFeature` | Game Entity |
| `Message` | Game Entity |
| `Player` | Game Entity |
| `RingOfFire` | Game Entity |
| `Sector` | Game Entity |
| `SpatialObject` | Game Entity |
| `SpawnPoint` | Game Entity |
| `Spawner` | Game Entity |
| `Squad` | Game Entity |
| `Team` | Game Entity |
| `UIWidget` | Game Entity |
| `VL7Cloud` | Game Entity |
| `Vehicle` | Game Entity |
| `VehicleSpawner` | Game Entity |
| `WaypointPath` | Game Entity |
| `WeaponPackage` | Game Entity |
| `WeaponUnlock` | Game Entity |
| `WorldIcon` | Game Entity |
| `Array` | Primitive |
| `Boolean` | Primitive |
| `Global` | Primitive |
| `Number` | Primitive |
| `Object` | Primitive |
| `String` | Primitive |
| `Transform` | Primitive |
| `Vector` | Primitive |
