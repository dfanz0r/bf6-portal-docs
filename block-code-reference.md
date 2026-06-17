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

Returns if the provided condition is for every element in the provided Array.

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Boolean |

##### IsTrueForAny

Returns if the provided condition is for at least one element in the provided Array.

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

Returns the PlayerDamateTypesItem payload from the [OnPlayerDamaged](#onplayerdamaged) Event context.


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

Returns if the provided Team is using soldiers from the specified .

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

Returns if the provided is the name of the current map.

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

Returns a Boolean value based on whether both of the provided inputs return .

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

Returns the 1st provided value if the condition is , otherwise, returns the 2nd provided value.

| Signature | Return Type |
| --- | --- |
| `(condition: Boolean, any, any)` | void |

##### IsType

Returns if the provided value is equal to the specified .

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

Returns a Boolean based on whether either of the two inputs are .

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

##### Xor

Returns if the provided Boolean inputs return different values.

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

Returns the CapturePoint or MCOM corresponding to the provided or respectively.

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

Returns the value of the argument that is passed into the . The list of available parameters will populate once this block is placed inside the .

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

Returns if the provided Player is valid.

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

Returns a Boolean indicating if the victim was damaged by the provided .

| Signature | Return Type |
| --- | --- |
| `(damageType: DamageType, playerDamageTypes: Player Damage Types)` | Boolean |

##### EventDeathTypeCompare

Returns a Boolean indicating if the victim died by the provided .

| Signature | Return Type |
| --- | --- |
| `(deathType: DeathType, playerDeathTypes: Player Death Types)` | Boolean |

##### EventWeaponCompare

Returns a Boolean indicating if the given is equivalent to the provided ability.

| Signature | Return Type |
| --- | --- |
| `(eventWeapon: WeaponUnlock, weapon: Weapons)` | Boolean |
| `(eventWeapon: WeaponUnlock, gadget: Gadgets)` | Boolean |

##### GetInventoryAmmo

Returns the target Player loaded ammo of the provided .

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Inventory Slots)` | Number |

##### GetInventoryMagazineAmmo

Returns the target Player magazine ammo of the provided .

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

Returns whether or not the active inventory slot of the target Player is the provided .

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

Returns a constructed object which can be used with Showeventgamemodemessage, Shownotificationmessage, Showhighlightedgamemodemessage, and Displaycustomnotificationmessage. The object is created by providing a Number, Player, or format String (which can take up to 3 format items). 
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

Returns a Boolean indicating if the target Vehicle has the same name as the provided or if it is the same type as the provided .

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

Sets a **Player** to defend an area around a location. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, defendPosition: Vector, minDistance: Number, maxDistance: Number)` |

##### AIIdleBehavior

Sets a Player's current position as idle point. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### AILOSMoveToBehavior

Sets a **Player** to move to a location with a line of sight to a specific position. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIMoveToBehavior

Sets a target Player a destination to move to. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIParachuteBehavior

Sets a **Player** to use parachute. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### AIValidatedMoveToBehavior

Sets a **Player** to move to a valid position on navmesh near a location. (Only works for AI players)

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

Stops the execution of a list of in a .


##### AbortIf

Stops the execution of a list of in a if the provided Boolean is . Otherwise, the execution continues with the remaining .

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

Skips a provided number of following this block within this .

| Signature |
| --- |
| `(actionCount: Number)` |

##### SkipIf

Skips a provided number of following this block within this if the condition evaluates to . If it does not, execution continues with the remaining .

| Signature |
| --- |
| `(actionCount: Number, Boolean)` |

##### StopChasingVariable

Stops an in-progress tracking of a Variable from the ChaseVariableOverTime or ChaseVariableAtRate blocks, leaving it at its current value.

| Signature |
| --- |
| `(variable: Variable)` |

##### Wait

Pauses the execution of in a for a provided Number of seconds.

| Signature |
| --- |
| `(seconds: Number)` |

##### WaitUntil

Pauses the execution of in a for a provided Number of seconds or if the provided condition evaluates to during that interval.

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

Enables or disables a specified on a target Player.

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

Forces the target Player to switch to the provided .

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

Sets the target Player loaded ammo for the provided .

| Signature |
| --- |
| `(player: Player, inventorySlots: Inventory Slots, ammo: Number)` |

##### SetInventoryMagazineAmmo

Sets the target Player magazine ammo for the provided .

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

Resupplies the target Player using a provided .

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

Enables or disables the image for a provided .

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableImage: Boolean)` |

##### EnableWorldIconText

Enables or disables the text for a provided . 

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

Sets the color property of a .

| Signature |
| --- |
| `(worldIcon: WorldIcon, newColor: Vector)` |

##### SetWorldIconImage

Sets the image property of a to the selected .

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

Sets the in-world position of a provided .

| Signature |
| --- |
| `(worldIcon: WorldIcon, newPosition: Vector)` |

##### SetWorldIconText

Sets the text property for a provided .

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

Clears text from the provided for the provided Player or Team. If no Player or Team is given, it clears all players text at that .

| Signature |
| --- |
| `(slot: Custom Notification Slots)` |
| `(slot: Custom Notification Slots, target: Player)` |
| `(slot: Custom Notification Slots, target: Team)` |

##### DisplayCustomNotificationMessage

Display a on-screen.

_Note: It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature |
| --- |
| `(msg: Message, slot: Custom Notification Slots, duration: Number)` |
| `(msg: Message, slot: Custom Notification Slots, duration: Number, target: Player)` |
| `(msg: Message, slot: Custom Notification Slots, duration: Number, target: Team)` |

##### DisplayHighlightedWorldLogMessage

Displays a on the world log above the minimap for 6 seconds. If no target is provided, it will display the to everyone. 

_Note: This will only appear to players that are deployed on the map. It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature |
| --- |
| `(message: Message)` |
| `(message: Message, player: Player)` |
| `(message: Message, team: Team)` |

##### DisplayNotificationMessage

Displays a notification-type on the top-right of the screen for 6 seconds. If no target is provided, it will display the to everyone. 

_Note: It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

| Signature |
| --- |
| `(message: Message)` |
| `(message: Message, player: Player)` |
| `(message: Message, team: Team)` |

##### SendErrorReport

Displays a provided as an error in the Admin menu.

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

| Value | |
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

| Value | |
| --- |
| `AR_Carbine_Ammo` |
| `Armor_Plate` |
| `LMG_Ammo` |
| `Pistol_SMG_Ammo` |
| `Shotgun_Ammo` |
| `Sniper_DMR_Ammo` |

### ArmorType

List type: `ArmorTypes`

| Value | |
| --- |
| `CeramicArmor` |
| `NoArmor` |
| `SoftArmor` |

### Cameras

List type: `Cameras`

| Value | |
| --- |
| `FirstPerson` |
| `Fixed` |
| `Free` |
| `ThirdPerson` |

### CustomNotificationSlots

List type: `CustomNotificationSlots`

| Value | |
| --- |
| `HeaderText` |
| `MessageText1` |
| `MessageText2` |
| `MessageText3` |
| `MessageText4` |

### Factions

List type: `Factions`

| Value | |
| --- |
| `NATO` |
| `PaxArmata` |

### Gadgets

List type: `Gadgets`

| Value | |
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
| *... and 31 more* |

### GolmudTrainMoveCommands

List type: `GolmudTrainMoveCommands`

| Value | |
| --- |
| `MoveEast` |
| `MoveWest` |
| `Stop` |

### GolmudTrainStopReason

List type: `GolmudTrainStopReason`

| Value | |
| --- |
| `ReachedEastTerminal` |
| `ReachedWestTerminal` |
| `StoppedInTransit` |

### GolmudTrainVariants

List type: `GolmudTrainVariants`

| Value | |
| --- |
| `MovingTrain` |
| `None` |
| `StaticTrain_Breakthrough` |
| `StaticTrain_Rush` |

### InventorySlots

List type: `InventorySlots`

| Value | |
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

| Value | |
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

| Value | |
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

| Value | |
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
| *... and 16 more* |

### MusicPackages

List type: `MusicPackages`

| Value | |
| --- |
| `BR` |
| `Core` |
| `Gauntlet` |
| `Radio` |

### MusicParams

List type: `MusicParams`

| Value | |
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

| Value | |
| --- |
| `Default` |
| `Explosion` |
| `Fall` |
| `Fire` |
| `Headshot` |
| `Melee` |

### PlayerDeathTypes

List type: `PlayerDeathTypes`

| Value | |
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

| Value | |
| --- |
| `None` |
| `Player` |
| `Squad` |
| `TeamId` |

### RestrictedInputs

List type: `RestrictedInputs`

| Value | |
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

| Value | |
| --- |
| `AmmoBox` |
| `AmmoCrate` |
| `SupplyBag` |

### RuntimeSpawn_Abbasid

List type: `RuntimeSpawn_Abbasid`

| Value | |
| --- |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_03_animated` |
| `ACModule_03_Running` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_cover` |
| `ACUnit_03_Running` |
| `ACUnit_04` |
| `ACUnit_04_cover` |
| `ACUnitWindow_01_B` |
| `AftermathDebrisPileConcrete_Skew_210_B` |
| `AftermathDebrisPileConcrete_Skew_210_D` |
| `AirConClusterBuildingSide_01` |
| `AirConClusterBuildingSide_02` |
| `AirConClusterBuildingSide_03` |
| `AirConClusterBuildingSide_04` |
| `AirConClusterBuildingSide_05` |
| `AirConClusterBuildingSide_06` |
| `Anemometer_01` |
| `AntennaMast_01_BD` |
| `AntennaMastMetal_01` |
| `AntennareciverMetal_01` |
| `AntennaRooftop_01` |
| `AntennaSmall_01_A` |
| `AntennaSmall_01_B` |
| `Apple_01` |
| `AppleCluster_01` |
| `AppleCluster_02` |
| *... and 1316 more* |

### RuntimeSpawn_Aftermath

List type: `RuntimeSpawn_Aftermath`

| Value | |
| --- |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_04` |
| `ACUnit_01` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_Running` |
| `ACUnit_04` |
| `ACUnit_04_cover` |
| `ACUnitInterior_01` |
| `ACUnitWindow_01_A` |
| `ACUnitWindow_01_C` |
| `ACUnitWindow_logo_01` |
| `Aftermath_DebrisPileConcrete_Skew_210_A_1` |
| `AftermathDebrisPileBrickPlaster_120_01` |
| `AftermathDebrisPileBrickPlaster_120_A_1` |
| `AftermathDebrisPileBrickPlaster_210_01` |
| `AftermathDebrisPileBrickPlaster_210_A_1` |
| `AftermathDebrisPileConcrete_Skew_210_D` |
| `AftermathDebrisPileRedBrick_01_A` |
| `AftermathDebrisPileRedBrick_01_B` |
| `AirDuct_02_A_256` |
| `AirDuct_02_A_512` |
| `AirDuct_02_A_Corner` |
| `AirDuct_02_A_End` |
| `AirDuct_1024_A` |
| `AirDuct_1024_B` |
| `AirDuct_256` |
| `AirDuct_512_A` |
| *... and 1466 more* |

### RuntimeSpawn_Badlands

List type: `RuntimeSpawn_Badlands`

| Value | |
| --- |
| `Abra01_Chassis` |
| `Abra01_Tracks` |
| `Abra01_Turret` |
| `AbraCoveredTarp` |
| `AcaciaUrban_01_S` |
| `ACUnit_04` |
| `ACUnit_04_Off` |
| `ACUnitWindow_01_A` |
| `ACUnitWindow_01_C` |
| `ACUnitWindow_logo_01` |
| `AftermathDebrisPileConcrete_Center_120` |
| `AftermathDebrisPileConcrete_Center_120_B` |
| `AftermathDebrisPileConcrete_Center_60` |
| `AftermathDebrisPileConcrete_Center_60_B` |
| `AftermathDebrisPileConcrete_Skew_120` |
| `AftermathDebrisPileConcrete_Skew_120_B` |
| `AftermathDebrisPileConcrete_Skew_210_C` |
| `AftermathDebrisPileConcrete_Skew_210_E` |
| `AftermathDebrisPileDrywall_Center_120_01` |
| `AftermathDebrisPileDrywall_Center_120_01_B` |
| `AftermathDebrisPileDrywall_Center_60_01` |
| `AftermathDebrisPileDrywall_Center_60_01_B` |
| `AftermathDebrisPileDrywall_Ramp_210_01` |
| `AftermathDebrisPileDrywall_Ramp_210_01_B` |
| `AirfieldBlastBarrier_01` |
| `AlleyTrash_01` |
| `AlleyTrash_02` |
| `AntennaMast_01` |
| `AntennaMastMetal_01` |
| `AntennareciverMetal_01` |
| *... and 861 more* |

### RuntimeSpawn_Battery

List type: `RuntimeSpawn_Battery`

| Value | |
| --- |
| `AAGun_01` |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_04` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_Running` |
| `ACUnit_04` |
| `AftermathDebrisPileBrickPlaster_120` |
| `AftermathDebrisPileBrickPlaster_120_01` |
| `AftermathDebrisPileBrickPlaster_210` |
| `AftermathDebrisPileBrickPlaster_210_01` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericana_01_S_B` |
| `AgaveAmericanaPotted_01_S_B` |
| `AirControlTower_02` |
| `AirportTerminalLarge_01` |
| `AirportTerminalStorage_01` |
| `Anemometer_01` |
| `AntennaRooftop_01` |
| `AntennaSmall_01_A` |
| `AntennaSmall_01_B` |
| `Architecture_01_A` |
| `Architecture_01_B` |
| `Architecture_01_C` |
| `Architecture_01_D` |
| `AsphaltChunks_01` |
| `AsphaltChunks_02` |
| `AsphaltChunks_03` |
| *... and 1202 more* |

### RuntimeSpawn_Capstone

List type: `RuntimeSpawn_Capstone`

| Value | |
| --- |
| `ACModule_03` |
| `ACUnit_03` |
| `ACUnit_04` |
| `ACUnit_04_Support` |
| `AftermathDebrisPileVillage_120_01` |
| `AntennaRooftop_01` |
| `AntennaSmall_01_A` |
| `AntennaTall_01` |
| `AsphaltChunks_01` |
| `AsphaltChunks_02` |
| `AsphaltChunks_03` |
| `Awning_02_A` |
| `Awning_02_B` |
| `Awning_02_C` |
| `Awning_02_D` |
| `BarrelBurned_01` |
| `BarrelOil_01_B` |
| `BarrelOil_01_D` |
| `BarrelOil_01_group_05` |
| `BarrelOilExplosive_01_DDPF_B` |
| `BarrierBlockConcrete_01_256x60` |
| `BarrierBlockConcrete_02_128_60` |
| `BarrierBlockConcrete_03_128_120` |
| `BarrierConcreteRoadSide_01_A` |
| `BarrierConcreteRoadSide_01_A_DDPF` |
| `BarrierConcreteRoadSide_01_B` |
| `BarrierConcreteRoadSide_01_B_DDPF` |
| `BarrierConcreteRoadSide_02_A` |
| `BarrierConcreteRoadSide_02_B` |
| `BarrierConcreteWall_01_192x320` |
| *... and 580 more* |

### RuntimeSpawn_Common

List type: `RuntimeSpawn_Common`

| Value | |
| --- |
| `AI_Spawner` |
| `AI_WaypointPath` |
| `AmmoChest_Small_01` |
| `AmmoChest_Small_Ext_01` |
| `AmmoChest_Small_Int_01` |
| `AmmoChest_Small_Lid_01` |
| `AreaTrigger` |
| `BallGo01` |
| `BarbedWire_01_B` |
| `BarrelOil_01_A` |
| `BarrelOilExplosive_01` |
| `BarrelOilFire_01` |
| `BarriersPedestrian_01_B` |
| `BarrierStoneBlock_01_A` |
| `BarrierStoneBlock_01_B` |
| `BarrierStoneBlock_01_C` |
| `BarrierStoneBlock_01_D` |
| `BarrierStoneBlock_01_E` |
| `BarrierStoneBlock_01_F` |
| `BarrierStoneBlock_01_G` |
| `BarrierStoneBlock_01_H` |
| `Basketball_01` |
| `BeverageFridge_01_B` |
| `BroadleafUrban_01_L_A` |
| `BroadleafUrban_01_M_B` |
| `CameraSurveillance_01_B` |
| `CapturePoint` |
| `CautionSticker_01` |
| `CCTVSign_01` |
| `ChairPlastic_01_A` |
| *... and 1441 more* |

### RuntimeSpawn_Contaminated

List type: `RuntimeSpawn_Contaminated`

| Value | |
| --- |
| `ACUnit_03` |
| `ACUnit_04_Support` |
| `AftermathDebrisPileMetal_210_01` |
| `AftermathDebrisRocks_310` |
| `AftermathDebrisRocks_310_B` |
| `AircraftWreckage_Jas39_01_Body` |
| `AirDuct_02_A_256` |
| `AirDuct_02_A_512` |
| `AirDuct_02_A_Corner` |
| `AirDuct_02_A_End` |
| `AirDuct_02_A_Joint` |
| `AirDuctPipe_01` |
| `AirDuctPipe_01_C90` |
| `AirDuctPipe_1024_01` |
| `AirDuctPipe_256_01` |
| `AirDuctPipe_256_C90_01` |
| `AirDuctPipe_512_01` |
| `AirDuctPipeCap_01` |
| `AirplaneJAS39_01` |
| `AirplaneJAS39_01_B` |
| `AirplaneJAS39_01_C` |
| `AirplaneJAS39_Repair_01` |
| `AirplaneJAS39Body` |
| `AirplaneJAS39Cab_01_Contaminated` |
| `AirplaneJAS39Cloth_01` |
| `AirplaneJAS39Cockpit_01` |
| `AirplaneJAS39EnginePlugsBack_01` |
| `AirplaneJAS39EnginePlugsLeft_01` |
| `AirplaneJAS39EnginePlugsRight_01` |
| `AirplaneJAS39Frame_01` |
| *... and 1316 more* |

### RuntimeSpawn_Dumbo

List type: `RuntimeSpawn_Dumbo`

| Value | |
| --- |
| `ACModule_01_VFX` |
| `ACModule_02` |
| `ACModule_02_VFX` |
| `ACModule_03` |
| `ACModule_04` |
| `ACUnit_03_animated` |
| `ACUnit_03_cover` |
| `ACUnit_03_Running` |
| `ACUnit_04` |
| `ACUnit_04_cover` |
| `ACUnitWindow_01_D` |
| `Aftermath_DebrisPileConcrete_Skew_210_A_1` |
| `AftermathDebrisPileBrickPlaster_120` |
| `AftermathDebrisPileBrickPlaster_120_01` |
| `AftermathDebrisPileBrickPlaster_120_A_1` |
| `AftermathDebrisPileBrickPlaster_210` |
| `AftermathDebrisPileBrickPlaster_210_01` |
| `AftermathDebrisPileBrickPlaster_210_A_1` |
| `AftermathDebrisPileConcrete_Skew_210_A` |
| `AftermathDebrisPileConcrete_Skew_210_B` |
| `AftermathDebrisPileConcrete_Skew_210_D` |
| `AftermathDebrisPileRedBrick_01_A` |
| `AftermathDebrisPileRedBrick_01_B` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericanaPotted_01_S_A` |
| `Ailanthis_01_S` |
| `Ailanthis_01_S_B` |
| `Ailanthis_01_S_C` |
| `Ailanthis_01_S_D` |
| `Ailanthis_01_S_E` |
| *... and 1469 more* |

### RuntimeSpawn_Eastwood

List type: `RuntimeSpawn_Eastwood`

| Value | |
| --- |
| `AcaciaUrban_01_S` |
| `ACModule_01` |
| `ACModule_03_animated` |
| `AdirondackChair_01` |
| `AftermathDebrisPileDrywall_Center_120_01` |
| `AftermathDebrisPileDrywall_Center_120_01_B` |
| `AftermathDebrisPileDrywall_Center_60_01` |
| `AftermathDebrisPileDrywall_Center_60_01_B` |
| `AftermathDebrisPileDrywall_Ramp_210_01` |
| `AftermathDebrisPileDrywall_Ramp_210_01_B` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericana_01_S_B` |
| `AgaveAmericanaPotted_01_S_A` |
| `AntennaMast_01` |
| `AntennaMastMetal_01` |
| `AntennareciverMetal_01` |
| `AshTray_01_B` |
| `AshTray_01_VFX` |
| `AshTrayCigarettes_01` |
| `AsphaltChunks_01` |
| `AsphaltChunks_02` |
| `AsphaltChunks_03` |
| `BackroomStorageShe01` |
| `BagTarp_01` |
| `BananaPlant_01_S_A` |
| `BananaPlant_01_S_B` |
| `BananaPotted_01_S_B` |
| `BananaWi01_M` |
| `BananaWildPotted_01_M` |
| `BananaWildPotted_01_M_A_Oriental` |
| *... and 914 more* |

### RuntimeSpawn_FireStorm

List type: `RuntimeSpawn_FireStorm`

| Value | |
| --- |
| `AcaciaUrban_01_S` |
| `ACUnit_04` |
| `AftermathDebrisPileConcrete_Center_120` |
| `AftermathDebrisPileConcrete_Center_120_B` |
| `AftermathDebrisPileConcrete_Skew_120` |
| `AftermathDebrisPileConcrete_Skew_120_B` |
| `AftermathDebrisPileConcrete_Skew_210_C` |
| `AftermathDebrisPileConcrete_Skew_210_E` |
| `AirDuct_02_A_256` |
| `AirDuct_02_A_512` |
| `AirDuct_02_A_End` |
| `Antenna_01` |
| `AntennaTall_01` |
| `AsphaltChunks_01` |
| `AsphaltChunks_02` |
| `AsphaltChunks_03` |
| `AviationLight_01` |
| `Barrack_01_A_Firestorm` |
| `BarrelBurned_01` |
| `BarrelOil_03` |
| `BarricadeboardsWood_01_B` |
| `BarrierBlockConcrete_01_256x60` |
| `BarrierBlockConcrete_03_128_120` |
| `BarrierConcreteWall_01_160x385` |
| `BarrierConcreteWall_01_192x320` |
| `BarrierConcreteWall_01_192x320_A_DDPF` |
| `BarrierConcreteWall_01_Row2` |
| `BarrierConcreteWall_01_Row3` |
| `BarrierConcreteWall_01_Row4` |
| `BarrierConstruction_01_256_120` |
| *... and 716 more* |

### RuntimeSpawn_GolmudRailway

List type: `RuntimeSpawn_GolmudRailway`

| Value | |
| --- |
| `ACModule_01` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_Running` |
| `ACUnit_04_Support` |
| `ACUnitInterior_01` |
| `AftermathDebrisPileBrickPlaster_120` |
| `AftermathDebrisPileConcrete_Skew_120` |
| `AftermathDebrisPileConcrete_Skew_120_B` |
| `AftermathDebrisPileConcrete_Skew_210_A` |
| `AftermathDebrisPileVillage_120_01` |
| `AgaveAmericanaPotted_01_S_A` |
| `AgaveAmericanaPotted_01_S_B` |
| `AirConClusterBuildingSide_01` |
| `AirplaneJAS39_Repair_01` |
| `AlleyTrash_01` |
| `AlleyTrash_02` |
| `AlleyTrash_03` |
| `AlleyTrash_04` |
| `AlleyTrash_05` |
| `AlleyTrash_06` |
| `AlleyTrash_07` |
| `AlleyTrash_08` |
| `AluminumBench_01` |
| `AmmoStack_01` |
| `AnimalDungLarge_01` |
| `Antenna_01` |
| `Antenna_01_B` |
| `Antenna_02` |
| `AntennaMast_01` |
| *... and 1159 more* |

### RuntimeSpawn_Granite_Downtown

List type: `RuntimeSpawn_Granite_Downtown`

| Value | |
| --- |
| `_3DSignChavel1883_01` |
| `_3DSignChavelNoir_01` |
| `_3DSignDoubleDipDonuts_01` |
| `_3DSignDoubleDipDonuts_02` |
| `_3DSignFleurDeForet_01` |
| `_3DSignImperia_01` |
| `_3DSignKoada_01` |
| `_3DSignLAtelier_01` |
| `_3DSignLussore_01` |
| `_3DSignSantoVernne_01` |
| `_3DSignVisteria_01` |
| `AcaciaUrban_01_S` |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_04` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericana_01_S_B` |
| `AirDuct_02_A_256` |
| `AirDuct_02_A_512` |
| `AirDuct_02_A_Corner` |
| `AirDuct_02_A_End` |
| `AirDuct_1024_A` |
| `AirDuct_256` |
| `AirDuct_512_A` |
| `AirDuct_768` |
| `AirDuct_Bend_90_128` |
| `AirDuct_Bend_90_128_B` |
| `AirDuct_End` |
| `AirDuct_End_Bend_Up` |
| *... and 1426 more* |

### RuntimeSpawn_Granite_Marina

List type: `RuntimeSpawn_Granite_Marina`

| Value | |
| --- |
| `_3DSignDoubleDipDonuts_01` |
| `_3DSignDoubleDipDonuts_02` |
| `_3DSignLussore_01` |
| `_3DSignSantoVernne_01` |
| `_3DSignVisteria_01` |
| `AcaciaUrban_01_S` |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_04` |
| `AdirondackChair_01` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericana_01_S_B` |
| `Airconditioner_01_B` |
| `AirDuct_1024_A` |
| `AirDuct_256` |
| `AirDuct_512_A` |
| `AirDuct_768` |
| `AirDuct_Bend_90_128` |
| `AirDuct_Bend_90_128_B` |
| `AirDuct_End` |
| `AirDuct_End_Bend_Up` |
| `AlleyTrash_01` |
| `AlleyTrash_02` |
| `AlleyTrash_03` |
| `AlleyTrash_04` |
| `AlleyTrash_05` |
| `AlleyTrash_07` |
| `AlleyTrash_08` |
| `AluminumGangway_01_1024` |
| `AntennaRooftop_01` |
| *... and 1387 more* |

### RuntimeSpawn_Granite_MilitaryRnD

List type: `RuntimeSpawn_Granite_MilitaryRnD`

| Value | |
| --- |
| `AcaciaUrban_01_S` |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_04` |
| `ACUnit_04` |
| `ACUnitInterior_01` |
| `Airconditioner_01` |
| `Airconditioner_01_B` |
| `AirDuct_1024_A` |
| `AirDuct_256` |
| `AirDuct_512_A` |
| `AirDuct_512_B` |
| `AirDuct_Bend_90_128` |
| `AirDuct_Bend_90_128_B` |
| `AirDuct_Bend_T_90_128` |
| `AirDuct_End` |
| `AirDuct_End_Bend_Up` |
| `AirDuct_TShape` |
| `AirDuct_Vent` |
| `AirfieldBlastBarrier_01` |
| `AluminumBench_01` |
| `AluminumGangway_01_1024` |
| `Antenna_02` |
| `AntennaMast_01` |
| `AntennaMastMetal_01` |
| `AntennareciverMetal_01` |
| `AntennaRooftop_01` |
| `AntennaSmall_01_B` |
| `AntennaTall_01` |
| `AsphaltBrokenThick_01_512x512` |
| *... and 1034 more* |

### RuntimeSpawn_Granite_MilitaryStorage

List type: `RuntimeSpawn_Granite_MilitaryStorage`

| Value | |
| --- |
| `Abra01_Chassis` |
| `Abra01_Chassis_B` |
| `Abra01_Tracks` |
| `Abra01_Turret` |
| `Abra01_Turret_B` |
| `AbraCoveredTarp` |
| `AcaciaUrban_01_S` |
| `ACModule_01` |
| `ACModule_02` |
| `AluminumBench_01` |
| `AmmoStack_01` |
| `AntennaMast_01` |
| `AntennaMastMetal_01` |
| `AntennareciverMetal_01` |
| `AntennaSmall_01_B` |
| `AntennaTall_01` |
| `AsphaltRubblePile_01` |
| `AutoCapture_Terrain` |
| `BackroomStorageShe01` |
| `Barrack_01_A_Props_F` |
| `Barrack_02_A_Props` |
| `Barrack_02_A_SecurityCheckPoint` |
| `Barrack_02_C` |
| `Barrack_02_D` |
| `Barrack_02_LightingProps` |
| `BarrackStair_01` |
| `BarrackStair_01_B` |
| `BarrelLabratory_01_115` |
| `BarrelLabratory_01_115_DDPF` |
| `BarrelLabratory_01_cluster_A_2x3` |
| *... and 1098 more* |

### RuntimeSpawn_Granite_ResidentialNorth

List type: `RuntimeSpawn_Granite_ResidentialNorth`

| Value | |
| --- |
| `AcaciaUrban_01_S` |
| `ACModule_04` |
| `ACUnit_03` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericana_01_S_B` |
| `AlleyTrash_02` |
| `AsphaltBrokenThick_01_512x512` |
| `AsphaltBrokenThick_01_512x512_CullSonner` |
| `AsphaltChunks_01` |
| `AutoCapture_Terrain` |
| `BackroomStorageShe01` |
| `BackroomStorageShe01_B` |
| `BananaPlant_01_S_A` |
| `BananaWi01_M` |
| `BananaWildPotted_01_M` |
| `BarCounter_01_128` |
| `BarCounter_01_128_B` |
| `BarCounter_01_256` |
| `BarCounter_01_256_B` |
| `BarCounter_01_512` |
| `BarCounter_01_512_B` |
| `BarCounterCabinet_01_A` |
| `BarCounterCabinet_01_B` |
| `BarCounterCabinet_03_128` |
| `BarCounterCabinet_03_256` |
| `BarCounterCorner_01` |
| `BarCounterCorner_01_B` |
| `BarCounterCorner_03` |
| `BarCounterDrywall_01_A_Bottom_192x16x16` |
| `BarCounterDrywall_01_A_Side_128x32x16` |
| *... and 879 more* |

### RuntimeSpawn_Granite_TechCenter

List type: `RuntimeSpawn_Granite_TechCenter`

| Value | |
| --- |
| `AcaciaUrban_01_S` |
| `AluminumBench_01` |
| `AP_Planter_Grass_02` |
| `AP_Planter_PurpleFlowers_01` |
| `AP_PolyPlane_01` |
| `ArtExhibitBase_128x128x128_01` |
| `AsphaltBrokenThick_01_512x512` |
| `AsphaltChunks_01` |
| `AsphaltChunks_03` |
| `AutoCapture_Terrain` |
| `BackroomStorageShe01` |
| `BananaWi01_M` |
| `BarbedWire_01_A` |
| `BarbedWire_01_C` |
| `BarGantry_01` |
| `BarrelOil_01_C` |
| `BarrelOil_01_D` |
| `BarrelOil_01_group_04` |
| `BarrelOil_01_group_05` |
| `BarrelOil_01_group_06` |
| `BarrelOil_03` |
| `BarrelOilExplosive_01_DDPF_B` |
| `BarrierConstruction_01_256_120_B` |
| `BarrierConstruction_01_256_120_DDPF` |
| `BarrierHesco_01_128x120` |
| `BarrierHesco_01_128x120_DDPF` |
| `BarrierHesco_01_Row03` |
| `BarrierJersey_01_256x124_B` |
| `BarrierJerseyFence_01_ENKARE_Blue` |
| `BarrierJerseyFence_01_ENKARE_Blue_B` |
| *... and 804 more* |

### RuntimeSpawn_Granite_Underground

List type: `RuntimeSpawn_Granite_Underground`

| Value | |
| --- |
| `AcaciaUrban_01_S` |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_04` |
| `AirDuct_01_A_1024` |
| `AirDuct_01_C135` |
| `AirDuct_02_A_256` |
| `AirDuct_02_A_512` |
| `AirDuct_02_A_512_NBRK` |
| `AirDuct_02_A_Corner_NBRK` |
| `AirDuct_02_A_End` |
| `AirDuct_02_A_End_NBRK` |
| `AirDuct_02_A_Joint` |
| `AirDuct_1024_A` |
| `AirDuct_1024_B` |
| `AirDuct_256` |
| `AirDuct_512_A` |
| `AirDuct_512_B` |
| `AirDuct_768` |
| `AirDuct_Bend_90_128` |
| `AirDuct_Bend_90_128_B` |
| `AirDuct_Bend_T_90_128` |
| `AirDuct_End` |
| `AirDuct_End_Bend_Up` |
| `AirDuct_End_Vent` |
| `AirDuct_TShape` |
| `AirDuct_Vent` |
| `AirDuctDamaged_B_1024` |
| `AirDuctPipe_01` |
| *... and 1400 more* |

### RuntimeSpawn_Limestone

List type: `RuntimeSpawn_Limestone`

| Value | |
| --- |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_04` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_Running` |
| `ACUnit_04` |
| `ACUnit_04_Off` |
| `AftermathDebrisPileBrickPlaster_120` |
| `AftermathDebrisPileBrickPlaster_120_01` |
| `AftermathDebrisPileConcrete_Skew_210_A` |
| `AftermathDebrisPileConcrete_Skew_210_D` |
| `AgaveAmericana_01_S_A` |
| `AgaveAmericana_01_S_B` |
| `AgaveAmericanaPotted_01_S_A` |
| `AirControlTower_02` |
| `AirportTerminalStorage_01` |
| `Anemometer_01` |
| `AntennaRooftop_01` |
| `AntennaSmall_01_A` |
| `AntennaSmall_01_B` |
| `Apple_01` |
| `AppleCluster_01` |
| `AppleCluster_02` |
| `Architecture_01_A` |
| `Architecture_01_B` |
| `Architecture_01_C` |
| `Architecture_01_D` |
| `Architecture_01_E` |
| `Architecture_01_F` |
| *... and 897 more* |

### RuntimeSpawn_Outskirts

List type: `RuntimeSpawn_Outskirts`

| Value | |
| --- |
| `ACModule_03` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_Running` |
| `AftermathDebrisPileConcrete_Skew_210_A` |
| `AftermathDebrisPileConcrete_Skew_210_D` |
| `Airconditioner_01` |
| `AlleyTrash_02` |
| `AntennaRooftop_01` |
| `Apple_01` |
| `AppleCluster_01` |
| `AppleCluster_02` |
| `Area02_Scaffolding_01` |
| `AsphaltChunks_01` |
| `AsphaltChunks_02` |
| `AsphaltChunks_03` |
| `Awning_02_B` |
| `Awning_02_C` |
| `AwningPlastic_01_256` |
| `AwningPlastic_01_512` |
| `Barrack_01_A_Outskirts` |
| `Barrack_01_B` |
| `Barrack_01_B_Outskirts` |
| `BarrackFoundation_01` |
| `BarrackStair_01` |
| `BarrelBurned_01` |
| `BarrelOil_01_B` |
| `BarrelOil_01_C` |
| `BarrelOil_01_D` |
| `BarrelOil_01_group_04` |
| *... and 812 more* |

### RuntimeSpawn_Sand

List type: `RuntimeSpawn_Sand`

| Value | |
| --- |
| `ACModule_01` |
| `ACModule_02` |
| `ACModule_03` |
| `ACModule_03_animated` |
| `ACModule_03_Running` |
| `ACUnit_03` |
| `ACUnit_03_animated` |
| `ACUnit_03_cover` |
| `ACUnit_03_Running` |
| `ACUnit_04` |
| `ACUnit_04_cover` |
| `ACUnitWindow_01_B` |
| `AftermathDebrisPileConcrete_Skew_210_B` |
| `AftermathDebrisPileConcrete_Skew_210_D` |
| `AirConClusterBuildingSide_01` |
| `AirConClusterBuildingSide_02` |
| `AirConClusterBuildingSide_03` |
| `AirConClusterBuildingSide_04` |
| `AirConClusterBuildingSide_05` |
| `AirConClusterBuildingSide_06` |
| `Anemometer_01` |
| `AntennaMast_01_BD` |
| `AntennaMastMetal_01` |
| `AntennareciverMetal_01` |
| `AntennaRooftop_01` |
| `AntennaSmall_01_A` |
| `AntennaSmall_01_B` |
| `Apple_01` |
| `AppleCluster_01` |
| `AppleCluster_02` |
| *... and 1316 more* |

### RuntimeSpawn_Subsurface

List type: `RuntimeSpawn_Subsurface`

| Value | |
| --- |
| `ACModule_01` |
| `ACModule_02` |
| `ACUnit_03_animated` |
| `ACUnit_03_Running` |
| `ACUnit_04_Support` |
| `AftermathDebrisPileConcrete_Center_120` |
| `AftermathDebrisPileConcrete_Skew_120_C` |
| `AftermathDebrisRocks_210` |
| `AftermathJet_Skew_210` |
| `AircraftWreckage_Jas39_01_Body` |
| `AirDuct_01_C135` |
| `AirDuct_02_A_256` |
| `AirDuct_02_A_256_B` |
| `AirDuct_02_A_Corner` |
| `AirDuct_02_A_End` |
| `AirDuct_02_A_Joint` |
| `AirDuct_02_C135` |
| `AirDuct_1024_A` |
| `AirDuct_1024_B` |
| `AirDuct_1024_C` |
| `AirDuct_256` |
| `AirDuct_256_B` |
| `AirDuct_512_A` |
| `AirDuct_512_B` |
| `AirDuct_768` |
| `AirDuct_Bend_90_128` |
| `AirDuct_Bend_90_128_B` |
| `AirDuct_Bend_T_90_128` |
| `AirDuct_End` |
| `AirDuct_End_Bend_Up` |
| *... and 950 more* |

### RuntimeSpawn_Tungsten

List type: `RuntimeSpawn_Tungsten`

| Value | |
| --- |
| `ACUnit_04` |
| `AftermathDebrisPileConcrete_Center_120` |
| `AftermathDebrisPileConcrete_Center_60` |
| `AftermathDebrisPileConcrete_Skew_120` |
| `AftermathDebrisPileConcrete_Skew_210_C` |
| `AftermathDebrisPileConstruction_Ramp_512_01` |
| `AftermathDebrisPileConstruction_Ramp_512_01_B` |
| `AftermathDebrisPileVillage_120_01` |
| `AntennaRooftop_01` |
| `Apple_01` |
| `AppleCluster_02` |
| `Awning_02_B` |
| `Awning_02_C` |
| `Barrack_01_A_Tungsten_1` |
| `Barrack_01_Props_B` |
| `Barrack_01_Props_C` |
| `BarrelBurned_01` |
| `BarrelOil_01_B` |
| `BarrelOil_01_D` |
| `BarrelOil_03` |
| `BarrelOilExplosive_01_DDPF_B` |
| `BarrelTools_01` |
| `BarrelWater_01` |
| `BarrierHesco_01_128x120` |
| `BarrierHesco_01_128x240` |
| `BarrierJersey_01_256x124_B` |
| `Bedding_Set_01_Sheet` |
| `Bedding_Set_02` |
| `Bedding_Set_02_A_02` |
| `Bedding_Set_02_B` |
| *... and 847 more* |

### ScoreboardType

List type: `ScoreboardType`

| Value | |
| --- |
| `CustomFFA` |
| `CustomTwoTeams` |
| `DefaultFFA` |
| `NotSet` |
| `Off` |

### ScreenEffects

List type: `ScreenEffects`

| Value | |
| --- |
| `Night` |
| `Saturated` |
| `Stealth` |
| `VL7` |

### SoldierClass

List type: `SoldierClass`

| Value | |
| --- |
| `Assault` |
| `Engineer` |
| `Recon` |
| `Support` |

### SoldierEffects

List type: `SoldierEffects`

| Value | |
| --- |
| `FreezeStatusEffect` |
| `HeatStatusEffect` |
| `VL7Effect` |

### SoldierStateBool

List type: `SoldierStateBool`

| Value | |
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

| Value | |
| --- |
| `CurrentHealth` |
| `CurrentWeaponAmmo` |
| `CurrentWeaponMagazineAmmo` |
| `MaxHealth` |
| `NormalizedHealth` |
| `Speed` |

### SoldierStateVector

List type: `SoldierStateVector`

| Value | |
| --- |
| `EyePosition` |
| `GetFacingDirection` |
| `GetLinearVelocity` |
| `GetPosition` |

### SpawnModes

List type: `SpawnModes`

| Value | |
| --- |
| `AutoSpawn` |
| `Deploy` |
| `Spectating` |

### SpectatingGroup

List type: `SpectatingGroup`

| Value | |
| --- |
| `All` |
| `Squad` |
| `Team` |

### SpotStatus

List type: `SpotStatus`

| Value | |
| --- |
| `SpotInBoth` |
| `SpotInMinimap` |
| `SpotInWorld` |
| `Unspot` |

### Stance

List type: `Stance`

| Value | |
| --- |
| `Crouch` |
| `Prone` |
| `Stand` |

### StationaryEmplacementsList

List type: `StationaryEmplacements`

| Value | |
| --- |
| `BGM71TOW` |
| `GDF009` |
| `M2MG` |

### Types

List type: `Types`

| Value | |
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
| *... and 82 more* |

### UIAnchor

List type: `UIAnchor`

| Value | |
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

| Value | |
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

| Value | |
| --- |
| `ButtonDown` |
| `ButtonUp` |
| `FocusIn` |
| `FocusOut` |
| `HoverIn` |
| `HoverOut` |

### UIDepth

List type: `UIDepth`

| Value | |
| --- |
| `AboveGameUI` |
| `BelowGameUI` |

### UIImageType

List type: `UIImageType`

| Value | |
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

| Value | |
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

| Value | |
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

| Value | |
| --- |
| `FacingDirection` |
| `LinearVelocity` |
| `VehiclePosition` |

### VoiceOverEvents2D

List type: `VoiceOverEvents2D`

| Value | |
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
| *... and 31 more* |

### VoiceOverFlags

List type: `VoiceOverFlags`

| Value | |
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

| Value | |
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
| *... and 299 more* |

### Weapons

List type: `Weapons`

| Value | |
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
| *... and 27 more* |

### WorldIconImages

List type: `WorldIconImages`

| Value | |
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
