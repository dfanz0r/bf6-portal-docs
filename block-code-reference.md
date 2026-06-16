---
outline: [2, 3]
---

# Block Code Reference

This page documents all available Blocky scripting blocks in Battlefield Portal.

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
- Global
- Player
- Team
- Vehicle
- CapturePoint
Within the Player and Team contexts, payload value blocks, such as EventPlayer and EventTeam, can be used to refer to the specific Player or Team within the Event. **Note:** In FFA, Ongoing Team will not execute at all.

### Player

#### OnPlayerDamaged

This will trigger when a Player takes damage.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Damaged Player |
| `EventOtherPlayer` | OtherPlayer | Damager Player |
| `EventDamageType` | DamageType | Damage Type |
| `EventWeapon` | WeaponUnlock | Damager Weapon |

#### OnPlayerDeployed

This will trigger whenever a Player deploys.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Deployed Player |

#### OnPlayerDied

This will trigger whenever a Player dies.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Victim |
| `EventOtherPlayer` | OtherPlayer | Killer |
| `EventDeathType` | DeathType | Victim Death Type |
| `EventWeapon` | WeaponUnlock | Killing Weapon |

#### OnPlayerEarnedKill

This will trigger when a Player earns a kill against another Player.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Killer |
| `EventOtherPlayer` | OtherPlayer | Victim |
| `EventDeathType` | DeathType | Victim Death Type |
| `EventWeapon` | WeaponUnlock | Killing Weapon |

#### OnPlayerEarnedKillAssist

This will trigger when a Player earns a kill assist.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Assist Player |
| `EventOtherPlayer` | OtherPlayer | Victim |

#### OnPlayerEnterAreaTrigger

This will trigger when a Player enters a AreaTrigger

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventAreaTrigger` | AreaTrigger |  |

#### OnPlayerEnterCapturePoint

This will trigger when a Player enters a CapturePoint capturing area.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Player Entering Capture Area |
| `EventCapturePoint` | CapturePoint | Capture Point Being Entered |

#### OnPlayerEnterVehicle

This will trigger when a Player enters a Vehicle.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Player Who Enters |
| `EventVehicle` | Vehicle | Vehicle |

#### OnPlayerEnterVehicleSeat

This will trigger when a Player enters a Vehicle seat.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Player Who Enters Seat |
| `EventVehicle` | Vehicle | Vehicle |
| `EventSeat` | Seat | Seat Index |

#### OnPlayerEnterVL7Cloud

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventVL7Cloud` | VL7Cloud |  |

#### OnPlayerExitAreaTrigger

This will trigger when a Player exits a AreaTrigger

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventAreaTrigger` | AreaTrigger |  |

#### OnPlayerExitCapturePoint

This will trigger when a Player exits a CapturePoint capturing area.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Player Exiting Capture Area |
| `EventCapturePoint` | CapturePoint | Capture Point Being Exited |

#### OnPlayerExitVehicle

This will trigger when a Player exits a Vehicle.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Player Who Exits |
| `EventVehicle` | Vehicle | Vehicle |

#### OnPlayerExitVehicleSeat

This will trigger when a Player exits a Vehicle seat.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Player Who Exits Seat |
| `EventVehicle` | Vehicle | Vehicle |
| `EventSeat` | Seat | Seat Index |

#### OnPlayerExitVL7Cloud

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventVL7Cloud` | VL7Cloud |  |

#### OnPlayerInteract

This will trigger when a Player starts interacting with an interaction point.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventInteractPoint` | InteractPoint |  |

#### OnPlayerJoinGame

This will trigger when a Player joins the game.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Joined Player |

#### OnPlayerLeaveGame

This will trigger when any player leaves the game.

| Payload | Type | Description |
| --- | --- | --- |
| `EventNumber` | Number |  |

#### OnPlayerSwitchTeam

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventTeam` | Team |  |

#### OnPlayerUIButtonEvent

This will trigger when a Player interacts with an UI button.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventUIWidget` | UIWidget |  |
| `EventUIButtonEvent` | UIButtonEvent |  |

#### OnPlayerUndeploy

This will trigger when the Player dies and returns to the deploy screen.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Dead Player |

### Capture Point

#### OnCapturePointCaptured

This will trigger when a team takes control of a CapturePoint.

| Payload | Type | Description |
| --- | --- | --- |
| `EventCapturePoint` | CapturePoint | Captured Capture Point |

#### OnCapturePointCapturing

This will trigger when a team begins capturing a CapturePoint.

| Payload | Type | Description |
| --- | --- | --- |
| `EventCapturePoint` | CapturePoint | Capture Point Being Captured |

#### OnCapturePointLost

This will trigger when a team loses control of a CapturePoint.

| Payload | Type | Description |
| --- | --- | --- |
| `EventCapturePoint` | CapturePoint | Lost Capture Point |

### Vehicle

#### OnVehicleDestroyed

This will trigger when a Vehicle is destroyed.

| Payload | Type | Description |
| --- | --- | --- |
| `EventVehicle` | Vehicle | Destroyed Vehicle |

#### OnVehicleSpawned

This will trigger when a Vehicle is called into the map.

| Payload | Type | Description |
| --- | --- | --- |
| `EventVehicle` | Vehicle | Spawned Vehicle |

### MCOM

#### OnMCOMArmed

This will trigger when a MCOM is armed.

| Payload | Type | Description |
| --- | --- | --- |
| `EventMCOM` | MCOM |  |

#### OnMCOMDefused

This will trigger when a MCOM is defused.

| Payload | Type | Description |
| --- | --- | --- |
| `EventMCOM` | MCOM |  |

#### OnMCOMDestroyed

This will trigger when a MCOM is destroyed.

| Payload | Type | Description |
| --- | --- | --- |
| `EventMCOM` | MCOM |  |

### AI

#### OnAIMoveToFailed

This will trigger when an AI action to move failed.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIMoveToRunning

This will trigger when an AI action to move is still running.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIMoveToSucceeded

This will trigger when an AI action to move succeeded.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIParachuteRunning

This will trigger when an AI parachute action is running.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIParachuteSucceeded

This will trigger when an AI parachute action has succeeded.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIWaypointIdleFailed

This will trigger when following a waypoint failed.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIWaypointIdleRunning

This will trigger when following a waypoint is still running.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnAIWaypointIdleSucceeded

This will trigger when following a waypoint succeeded.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

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

| Payload | Type | Description |
| --- | --- | --- |
| `EventGolmudTrainStopReason` | GolmudTrainStopReason |  |

#### OnMandown

This will trigger when a Player is forced into the mandown state.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Downed Player |
| `EventOtherPlayer` | OtherPlayer |  |

#### OnPortalGadgetAimStart

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnPortalGadgetAimStop

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnPortalGadgetFireStart

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnPortalGadgetFireStop

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnPortalGadgetLaserToggle

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventBoolean` | Boolean |  |

#### OnRayCastHit

This will trigger when a Raycast hits a target.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventPoint` | Point |  |
| `EventNormal` | Normal |  |

#### OnRayCastMissed

This will trigger when a Raycast misses.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |

#### OnRevived

This will trigger when a Player is revived by another Player.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player | Revived Player |
| `EventOtherPlayer` | OtherPlayer | Reviver Player |

#### OnRingOfFireZoneSizeChange

This will trigger when a RingOfFire changes size.

| Payload | Type | Description |
| --- | --- | --- |
| `EventRingOfFire` | RingOfFire |  |
| `EventNumber` | Number |  |

#### OnSpawnerSpawned

This will trigger when a spawner is spawned in.

| Payload | Type | Description |
| --- | --- | --- |
| `EventPlayer` | Player |  |
| `EventSpawner` | Spawner |  |

## Values

Value blocks return a value and can be used as inputs to other blocks.

### AI

**Behaviour**

##### AiInputItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_AiInput |

##### GetWaypointPath

| Signature | Return Type |
| --- | --- |
| `(waypointPathNumber: Number)` | WaypointPath |

### Arrays

##### AppendToArray

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Array |

##### ArraySlice

| Signature | Return Type |
| --- | --- |
| `(array: Array, startIndex: Number, endIndex: Number)` | Array |

##### CountOf

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | Number |

##### CurrentArrayElement

| Signature | Return Type |
| --- | --- |
| `()` | void |

##### EmptyArray

| Signature | Return Type |
| --- | --- |
| `()` | Array |

##### FilteredArray

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Array |

##### FirstOf

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | void |

##### IndexOfFirstTrue

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Number |

##### IsTrueForAll

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Boolean |

##### IsTrueForAny

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Boolean |

##### LastOf

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | void |

##### MappedArray

| Signature | Return Type |
| --- | --- |
| `(array: Array, any)` | Array |

##### RandomizedArray

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | Array |

##### RandomValueInArray

| Signature | Return Type |
| --- | --- |
| `(array: Array)` | void |

##### SortedArray

| Signature | Return Type |
| --- | --- |
| `(array: Array, index: Number)` | Array |

##### ValueInArray

| Signature | Return Type |
| --- | --- |
| `(array: Array, index: Number)` | void |

### Audio

##### GetSFX

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | SFX |

##### GetVO

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | VO |

### Camera

##### GetFixedCamera

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | FixedCamera |

### Effects

**VFX**

##### GetVFX

| Signature | Return Type |
| --- | --- |
| `(vfxNumber: Number)` | VFX |

### Event Payloads

##### EventAreaTrigger

| Signature | Return Type |
| --- | --- |
| `()` | AreaTrigger |

##### EventBoolean

| Signature | Return Type |
| --- | --- |
| `()` | Boolean |

##### EventCapturePoint

| Signature | Return Type |
| --- | --- |
| `()` | CapturePoint |

##### EventDamageType

| Signature | Return Type |
| --- | --- |
| `()` | DamageType |

##### EventDeathType

| Signature | Return Type |
| --- | --- |
| `()` | DeathType |

##### EventEmplacementSpawner

| Signature | Return Type |
| --- | --- |
| `()` | EmplacementSpawner |

##### EventFixedCamera

| Signature | Return Type |
| --- | --- |
| `()` | FixedCamera |

##### EventGolmudTrainStopReason

| Signature | Return Type |
| --- | --- |
| `()` | PortalEnum |

##### EventHQ

| Signature | Return Type |
| --- | --- |
| `()` | HQ |

##### EventInteractPoint

| Signature | Return Type |
| --- | --- |
| `()` | InteractPoint |

##### EventMCOM

| Signature | Return Type |
| --- | --- |
| `()` | MCOM |

##### EventNormal

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### EventNumber

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### EventOtherPlayer

| Signature | Return Type |
| --- | --- |
| `()` | Player |

##### EventPlayer

| Signature | Return Type |
| --- | --- |
| `()` | Player |

##### EventPoint

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### EventRingOfFire

| Signature | Return Type |
| --- | --- |
| `()` | RingOfFire |

##### EventSeat

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### EventSector

| Signature | Return Type |
| --- | --- |
| `()` | Sector |

##### EventSpawner

| Signature | Return Type |
| --- | --- |
| `()` | Spawner |

##### EventSpawnPoint

| Signature | Return Type |
| --- | --- |
| `()` | SpawnPoint |

##### EventTeam

| Signature | Return Type |
| --- | --- |
| `()` | Team |

##### EventUIButtonEvent

| Signature | Return Type |
| --- | --- |
| `()` | PortalEnum |

##### EventUIWidget

| Signature | Return Type |
| --- | --- |
| `()` | UIWidget |

##### EventVehicle

| Signature | Return Type |
| --- | --- |
| `()` | Vehicle |

##### EventVehicleSpawner

| Signature | Return Type |
| --- | --- |
| `()` | VehicleSpawner |

##### EventVL7Cloud

| Signature | Return Type |
| --- | --- |
| `()` | VL7Cloud |

##### EventWaypointPath

| Signature | Return Type |
| --- | --- |
| `()` | WaypointPath |

##### EventWeapon

| Signature | Return Type |
| --- | --- |
| `()` | WeaponUnlock |

##### EventWorldIcon

| Signature | Return Type |
| --- | --- |
| `()` | WorldIcon |

### Gameplay

**Deploy**

##### GetSpawnPoint

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | SpawnPoint |

**Gamemode**

##### GetGameModeScore

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |
| `(team: Team)` | Number |

##### GetMatchTimeElapsed

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### GetMatchTimeRemaining

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### GetRingOfFire

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | RingOfFire |

##### GetRoundTime

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### GetTargetScore

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### IsFaction

| Signature | Return Type |
| --- | --- |
| `(team: Team, factions: Enum_Factions)` | Boolean |

##### GetAreaTrigger

| Signature | Return Type |
| --- | --- |
| `(areaTriggerNumber: Number)` | AreaTrigger |

##### GetEmplacementSpawner

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | EmplacementSpawner |

##### GetGolmudTrainLocation

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### GetInteractPoint

| Signature | Return Type |
| --- | --- |
| `(interactPointNumber: Number)` | InteractPoint |

##### GetLootSpawner

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | LootSpawner |

##### GetObjId

| Signature | Return Type |
| --- | --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` | Number |

##### GetSpatialObject

| Signature | Return Type |
| --- | --- |
| `(spatialObjectNumber: Number)` | SpatialObject |

##### GetSpawner

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Spawner |

##### GetVehicleSpawner

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | VehicleSpawner |

##### GetVL7Cloud

| Signature | Return Type |
| --- | --- |
| `(vl7CloudId: Number)` | VL7Cloud |

##### IsCurrentMap

| Signature | Return Type |
| --- | --- |
| `(maps: Enum_Maps)` | Boolean |

##### SpawnObject

| Signature | Return Type |
| --- | --- |
| `(prefabEnum: Enum_RuntimeSpawn_Common | Enum_RuntimeSpawn_Abbasid | Enum_RuntimeSpawn_Aftermath | Enum_RuntimeSpawn_Badlands | Enum_RuntimeSpawn_Battery | Enum_RuntimeSpawn_Capstone | Enum_RuntimeSpawn_Contaminated | Enum_RuntimeSpawn_Dumbo | Enum_RuntimeSpawn_Eastwood | Enum_RuntimeSpawn_FireStorm | Enum_RuntimeSpawn_Limestone | Enum_RuntimeSpawn_Outskirts | Enum_RuntimeSpawn_Subsurface | Enum_RuntimeSpawn_Tungsten | Enum_RuntimeSpawn_Granite_Downtown | Enum_RuntimeSpawn_Granite_Marina | Enum_RuntimeSpawn_Granite_MilitaryRnD | Enum_RuntimeSpawn_Granite_MilitaryStorage | Enum_RuntimeSpawn_Granite_ResidentialNorth | Enum_RuntimeSpawn_Granite_TechCenter | Enum_RuntimeSpawn_Granite_Underground | Enum_RuntimeSpawn_Sand | Enum_RuntimeSpawn_GolmudRailway, position: Vector, rotation: Vector, scale: Vector)` | void |
| `(prefabEnum: Enum_RuntimeSpawn_Common | Enum_RuntimeSpawn_Abbasid | Enum_RuntimeSpawn_Aftermath | Enum_RuntimeSpawn_Badlands | Enum_RuntimeSpawn_Battery | Enum_RuntimeSpawn_Capstone | Enum_RuntimeSpawn_Contaminated | Enum_RuntimeSpawn_Dumbo | Enum_RuntimeSpawn_Eastwood | Enum_RuntimeSpawn_FireStorm | Enum_RuntimeSpawn_Limestone | Enum_RuntimeSpawn_Outskirts | Enum_RuntimeSpawn_Subsurface | Enum_RuntimeSpawn_Tungsten | Enum_RuntimeSpawn_Granite_Downtown | Enum_RuntimeSpawn_Granite_Marina | Enum_RuntimeSpawn_Granite_MilitaryRnD | Enum_RuntimeSpawn_Granite_MilitaryStorage | Enum_RuntimeSpawn_Granite_ResidentialNorth | Enum_RuntimeSpawn_Granite_TechCenter | Enum_RuntimeSpawn_Granite_Underground | Enum_RuntimeSpawn_Sand | Enum_RuntimeSpawn_GolmudRailway, position: Vector, rotation: Vector)` | void |

### Logic

##### And

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

##### Equals

| Signature | Return Type |
| --- | --- |
| `(any, any)` | Boolean |

##### GreaterThan

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Boolean |

##### GreaterThanEqualTo

| Signature | Return Type |
| --- | --- |
| `(left: Number, right: Number)` | Boolean |

##### IfThenElse

*ID_ARRIVAL_BLOCK_IFTHENELSE*

| Signature | Return Type |
| --- | --- |
| `(condition: Boolean, any, any)` | void |

##### IsType

| Signature | Return Type |
| --- | --- |
| `(any, type: Enum_Types)` | Boolean |

##### JsValue

| Signature | Return Type |
| --- | --- |
| `(valueName: String, any, any)` | void |

##### LessThan

| Signature | Return Type |
| --- | --- |
| `(left: Number, right: Number)` | Boolean |

##### LessThanEqualTo

| Signature | Return Type |
| --- | --- |
| `(left: Number, right: Number)` | Boolean |

##### Not

| Signature | Return Type |
| --- | --- |
| `(boolean: Boolean)` | Boolean |

##### NotEqualTo

| Signature | Return Type |
| --- | --- |
| `(any, any)` | Boolean |

##### Or

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

##### Xor

| Signature | Return Type |
| --- | --- |
| `(boolean0: Boolean, boolean1: Boolean)` | Boolean |

**Messages**

##### Concat

| Signature | Return Type |
| --- | --- |
| `(string0: String, string1: String)` | String |

### Math

##### AbsoluteValue

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Add

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### AngleBetweenVectors

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Number |

##### AngleDifference

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### ArccosineInDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArccosineInRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArcsineInDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArcsineInRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArctangentInDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### ArctangentInRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Ceiling

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### CosineFromDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### CosineFromRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### CreateTransform

| Signature | Return Type |
| --- | --- |
| `(position: Vector, rotation: Vector)` | Transform |

##### CreateVector

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number, number2: Number)` | Vector |

##### CrossProduct

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### DegreesToRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### DirectionFromAngles

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Vector |

##### DirectionTowards

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### DistanceBetween

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Number |

##### Divide

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector: Vector, number: Number)` | Vector |

##### DotProduct

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Number |

##### Floor

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Max

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### Modulo

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### Multiply

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector: Vector, number: Number)` | Vector |

##### Normalize

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Vector |

##### Pi

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### RadiansToDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### RaiseToPower

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### RandomReal

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |

##### RoundToInteger

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### SineFromDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### SineFromRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### SquareRoot

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### Subtract

| Signature | Return Type |
| --- | --- |
| `(number0: Number, number1: Number)` | Number |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### TangentFromDegrees

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

##### TangentFromRadians

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Number |

### Objectives

**CapturePoint**

##### AllCapturePoints

| Signature | Return Type |
| --- | --- |
| `()` | Array |

##### GetCapturePoint

| Signature | Return Type |
| --- | --- |
| `(id: Number)` | CapturePoint |

##### GetCaptureProgress

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Number |

##### GetCurrentOwnerTeam

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

##### GetOwnerProgressTeam

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

##### GetPlayersOnPoint

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Array |

##### GetPreviousOwnerTeam

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

**Deploy**

##### GetHQ

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | HQ |

**Gamemode**

##### GetMCOM

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | MCOM |

##### GetSector

| Signature | Return Type |
| --- | --- |
| `(number: Number)` | Sector |

### Other

##### AmmoTypesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_AmmoTypes |

##### ArmorTypesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_ArmorTypes |

##### CamerasItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Cameras |

##### CustomNotificationSlotsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_CustomNotificationSlots |

##### FactionsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Factions |

##### GadgetsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Gadgets |

##### GetArgument

| Signature | Return Type |
| --- | --- |
| `(subroutineArgIndex: Number)` | void |

##### GetVariable

*ID_ARRIVAL_BLOCK_GETVARIABLE*

| Signature | Return Type |
| --- | --- |
| `(variable: Variable)` | void |

##### GolmudTrainMoveCommandsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_GolmudTrainMoveCommands |

##### GolmudTrainStopReasonItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_GolmudTrainStopReason |

##### GolmudTrainVariantsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_GolmudTrainVariants |

##### InventorySlotsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_InventorySlots |

##### MapsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Maps |

##### MoveSpeedItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_MoveSpeed |

##### MusicEventsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_MusicEvents |

##### MusicPackagesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_MusicPackages |

##### MusicParamsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_MusicParams |

##### PlayerDamageTypesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_PlayerDamageTypes |

##### PlayerDeathTypesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_PlayerDeathTypes |

##### RestrictedInputsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RestrictedInputs |

##### ResupplyTypesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_ResupplyTypes |

##### RuntimeSpawn_AbbasidItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Abbasid |

##### RuntimeSpawn_AftermathItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Aftermath |

##### RuntimeSpawn_BadlandsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Badlands |

##### RuntimeSpawn_BatteryItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Battery |

##### RuntimeSpawn_CapstoneItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Capstone |

##### RuntimeSpawn_CommonItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Common |

##### RuntimeSpawn_ContaminatedItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Contaminated |

##### RuntimeSpawn_DumboItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Dumbo |

##### RuntimeSpawn_EastwoodItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Eastwood |

##### RuntimeSpawn_FireStormItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_FireStorm |

##### RuntimeSpawn_GolmudRailwayItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_GolmudRailway |

##### RuntimeSpawn_Granite_DowntownItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Granite_Downtown |

##### RuntimeSpawn_Granite_MarinaItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Granite_Marina |

##### RuntimeSpawn_Granite_ResidentialNorthItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Granite_ResidentialNorth |

##### RuntimeSpawn_Granite_TechCenterItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Granite_TechCenter |

##### RuntimeSpawn_Granite_UndergroundItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Granite_Underground |

##### RuntimeSpawn_LimestoneItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Limestone |

##### RuntimeSpawn_OutskirtsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Outskirts |

##### RuntimeSpawn_SandItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Sand |

##### RuntimeSpawn_SubsurfaceItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Subsurface |

##### RuntimeSpawn_TungstenItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RuntimeSpawn_Tungsten |

##### ScoreboardTypeItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_ScoreboardType |

##### ScreenEffectsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_ScreenEffects |

##### SoldierClassItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierClass |

##### SoldierEffectsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierEffects |

##### SoldierStateBoolItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierStateBool |

##### SoldierStateNumberItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierStateNumber |

##### SoldierStateVectorItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierStateVector |

##### SpawnModesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SpawnModes |

##### SpectatingGroupItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SpectatingGroup |

##### SpotStatusItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SpotStatus |

##### StanceItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Stance |

##### StationaryEmplacementsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_StationaryEmplacements |

##### TypesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Types |

##### UIAnchorItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_UIAnchor |

##### UIBgFillItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_UIBgFill |

##### UIButtonEventItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_UIButtonEvent |

##### UIDepthItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_UIDepth |

##### UIImageTypeItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_UIImageType |

##### VehicleCategoriesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_VehicleCategories |

##### VehicleListItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_VehicleList |

##### VehicleStateVectorItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_VehicleStateVector |

##### VoiceOverEvents2DItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_VoiceOverEvents2D |

##### VoiceOverFlagsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_VoiceOverFlags |

##### WeaponAttachmentsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_WeaponAttachments |

##### WeaponsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Weapons |

##### WorldIconImagesItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_WorldIconImages |

### Player

##### AllPlayers

| Signature | Return Type |
| --- | --- |
| `()` | Array |

##### ClosestPlayerTo

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Player |
| `(vector: Vector, team: Team)` | Player |

##### FarthestPlayerFrom

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Player |
| `(vector: Vector, team: Team)` | Player |

##### GetPlayerDeaths

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |

##### GetPlayerKills

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |

##### GetSquad

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Squad |
| `(teamIdNumber: Number, squadIdNumber: Number)` | Squad |

##### GetSquadName

| Signature | Return Type |
| --- | --- |
| `(Squad)` | String |

##### GetTeam

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Team |
| `(teamId: Number)` | Team |

##### IsPlayerValid

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Boolean |

##### IsSquadLeader

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Boolean |

**Inventory**

##### CreateNewWeaponPackage

| Signature | Return Type |
| --- | --- |
| `()` | WeaponPackage |

**Soldier**

##### EventDamageTypeCompare

| Signature | Return Type |
| --- | --- |
| `(damageType: DamageType, playerDamageTypes: Enum_PlayerDamageTypes)` | Boolean |

##### EventDeathTypeCompare

| Signature | Return Type |
| --- | --- |
| `(deathType: DeathType, playerDeathTypes: Enum_PlayerDeathTypes)` | Boolean |

##### EventWeaponCompare

| Signature | Return Type |
| --- | --- |
| `(eventWeapon: WeaponUnlock, weapon: Enum_Weapons)` | Boolean |
| `(eventWeapon: WeaponUnlock, gadget: Enum_Gadgets)` | Boolean |

##### GetInventoryAmmo

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Enum_InventorySlots)` | Number |

##### GetInventoryMagazineAmmo

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Enum_InventorySlots)` | Number |

##### GetSoldierState

| Signature | Return Type |
| --- | --- |
| `(player: Player, soldierStateNumber: Enum_SoldierStateNumber)` | Number |
| `(player: Player, soldierStateBool: Enum_SoldierStateBool)` | Boolean |
| `(player: Player, soldierStateVector: Enum_SoldierStateVector)` | Vector |

##### HasEquipment

| Signature | Return Type |
| --- | --- |
| `(player: Player, weapon: Enum_Weapons)` | Boolean |
| `(player: Player, gadget: Enum_Gadgets)` | Boolean |

##### IsInventorySlotActive

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Enum_InventorySlots)` | Boolean |

##### IsSoldierClass

| Signature | Return Type |
| --- | --- |
| `(player: Player, soldierClass: Enum_SoldierClass)` | Boolean |

### Transform

##### BackwardVector

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### DownVector

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### ForwardVector

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### GetObjectPosition

| Signature | Return Type |
| --- | --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` | Vector |

##### GetObjectRotation

| Signature | Return Type |
| --- | --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` | Vector |

##### GetObjectTransform

| Signature | Return Type |
| --- | --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` | Transform |

##### GetTransformPosition

| Signature | Return Type |
| --- | --- |
| `(transform: Transform)` | Vector |

##### GetTransformRotation

| Signature | Return Type |
| --- | --- |
| `(transform: Transform)` | Vector |

##### LeftVector

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### LocalPositionOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### LocalVectorOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### RightVector

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### UpVector

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### VectorTowards

| Signature | Return Type |
| --- | --- |
| `(vector0: Vector, vector1: Vector)` | Vector |

##### WorldPositionOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### WorldVectorOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector, player: Player)` | Vector |

##### XComponentOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Number |

##### YComponentOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Number |

##### ZComponentOf

| Signature | Return Type |
| --- | --- |
| `(vector: Vector)` | Number |

### UI

##### GetWorldIcon

| Signature | Return Type |
| --- | --- |
| `(worldIconNumber: Number)` | WorldIcon |

**Messages**

##### Message

| Signature | Return Type |
| --- | --- |
| `(msg: String | Number | Player, msgArg0: String | Number | Player, msgArg1: String | Number | Player, msgArg2: String | Number | Player)` | Message |
| `(msg: String | Number | Player, msgArg0: String | Number | Player, msgArg1: String | Number | Player)` | Message |
| `(msg: String | Number | Player, msgArg0: String | Number | Player)` | Message |
| `(msg: String | Number | Player)` | Message |

**UIWidgets**

##### FindUIWidgetWithName

| Signature | Return Type |
| --- | --- |
| `(name: String, searchRoot: UIWidget)` | UIWidget |
| `(name: String)` | void |

##### GetUIButtonAlphaBase

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaDisabled

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaFocused

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaHover

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonAlphaPressed

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIButtonColorBase

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorDisabled

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorFocused

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorHover

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonColorPressed

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIButtonEnabled

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Boolean |

##### GetUIImageAlpha

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIImageColor

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIImageType

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Enum_UIImageType |

##### GetUIRoot

| Signature | Return Type |
| --- | --- |
| `()` | UIWidget |

##### GetUITextAlpha

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUITextAnchor

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Enum_UIAnchor |

##### GetUITextColor

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUITextSize

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIWidgetAnchor

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Enum_UIAnchor |

##### GetUIWidgetBgAlpha

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIWidgetBgColor

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIWidgetBgFill

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Enum_UIBgFill |

##### GetUIWidgetDepth

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Enum_UIDepth |

##### GetUIWidgetName

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | String |

##### GetUIWidgetPadding

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Number |

##### GetUIWidgetParent

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | UIWidget |

##### GetUIWidgetPosition

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIWidgetSize

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Vector |

##### GetUIWidgetVisible

| Signature | Return Type |
| --- | --- |
| `(widget: UIWidget)` | Boolean |

##### HasUIWidgetWithName

| Signature | Return Type |
| --- | --- |
| `(name: String, searchRoot: UIWidget)` | Boolean |
| `(name: String)` | Boolean |

### Vehicles

##### AllVehicles

| Signature | Return Type |
| --- | --- |
| `()` | Array |

##### CompareVehicleName

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, vehicleList: Enum_VehicleList)` | Boolean |

##### GetVehicleFromPlayer

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Vehicle |

##### GetVehicleSeatCount

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Number |

##### GetVehicleState

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, vehicleStateVector: Enum_VehicleStateVector)` | Vector |

##### GetVehicleTeam

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Team |

##### IsVehicleOccupied

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Boolean |

##### IsVehicleSeatOccupied

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, number: Number)` | Boolean |

**Soldier**

##### GetAllPlayersInVehicle

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle)` | Array |

##### GetPlayerFromVehicleSeat

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, number: Number)` | Player |

##### GetPlayerVehicleSeat

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |

## Actions

Action blocks perform operations and do not return a value.

### AI

**Behaviour**

##### AIBattlefieldBehavior

| Signature |
| --- |
| `(player: Player)` |

##### AIDefendPositionBehavior

| Signature |
| --- |
| `(player: Player, defendPosition: Vector, minDistance: Number, maxDistance: Number)` |

##### AIIdleBehavior

| Signature |
| --- |
| `(player: Player)` |

##### AILOSMoveToBehavior

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIMoveToBehavior

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIParachuteBehavior

| Signature |
| --- |
| `(player: Player)` |

##### AIValidatedMoveToBehavior

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIWaypointIdleBehavior

| Signature |
| --- |
| `(player: Player, waypointPath: WaypointPath)` |

##### SetAiInput

| Signature |
| --- |
| `(player: Player, input: Enum_AiInput, duration: Number)` |

**Deploy**

##### AISetUnspawnOnDead

| Signature |
| --- |
| `(spawner: Spawner, enableUnspawnOnDead: Boolean)` |

##### SetUnspawnDelayInSeconds

| Signature |
| --- |
| `(spawner: Spawner, delay: Number)` |

##### SpawnAIFromAISpawner

| Signature |
| --- |
| `(spawner: Spawner)` |
| `(spawner: Spawner, classToSpawn: Enum_SoldierClass, name: Message)` |
| `(spawner: Spawner, classToSpawn: Enum_SoldierClass)` |
| `(spawner: Spawner, name: Message)` |
| `(spawner: Spawner, team: Team)` |
| `(spawner: Spawner, classToSpawn: Enum_SoldierClass, name: Message, team: Team)` |
| `(spawner: Spawner, classToSpawn: Enum_SoldierClass, team: Team)` |
| `(spawner: Spawner, name: Message, team: Team)` |

##### UnspawnAllAIsFromAISpawner

| Signature |
| --- |
| `(spawner: Spawner)` |

##### AIEnableShooting

| Signature |
| --- |
| `(player: Player)` |
| `(player: Player, enable: Boolean)` |

##### AIEnableTargeting

| Signature |
| --- |
| `(player: Player)` |
| `(player: Player, enable: Boolean)` |

##### AIForceFire

| Signature |
| --- |
| `(player: Player, fireDuration: Number)` |

##### AIGadgetSettings

| Signature |
| --- |
| `(player: Player, applyUsageCriteria: Boolean, applyCoolDownAfterUse: Boolean, applyInaccuracy: Boolean)` |

##### AISetFocusPoint

| Signature |
| --- |
| `(player: Player, point: Vector, isTarget: Boolean)` |

##### AISetMoveSpeed

| Signature |
| --- |
| `(player: Player, moveSpeed: Enum_MoveSpeed)` |

##### AISetStance

| Signature |
| --- |
| `(player: Player, stance: Enum_Stance)` |

##### AISetTarget

| Signature |
| --- |
| `(aiPlayer: Player, targetPlayer: Player)` |
| `(player: Player)` |

##### AIStartUsingGadget

| Signature |
| --- |
| `(player: Player, gadget: Enum_Gadgets, targetPos: Vector)` |
| `(player: Player, gadget: Enum_Gadgets, targetPlayer: Player)` |

##### AIStopUsingGadget

| Signature |
| --- |
| `(player: Player)` |

##### SetAIToHumanDamageModifier

| Signature |
| --- |
| `(damageMultiplier: Number)` |

### Arrays

##### SetVariableAtIndex

| Signature |
| --- |
| `(arrayVariable: Variable, arrayIndex: Number, any)` |

### Audio

##### PlaySound

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

| Signature |
| --- |
| `(voiceOver: VO, event: Enum_VoiceOverEvents2D, flag: Enum_VoiceOverFlags)` |
| `(voiceOver: VO, event: Enum_VoiceOverEvents2D, flag: Enum_VoiceOverFlags, player: Player)` |
| `(voiceOver: VO, event: Enum_VoiceOverEvents2D, flag: Enum_VoiceOverFlags, squad: Squad)` |
| `(voiceOver: VO, event: Enum_VoiceOverEvents2D, flag: Enum_VoiceOverFlags, team: Team)` |

##### SetSoundAmplitude

| Signature |
| --- |
| `(sound: SFX, amplitude: Number, team: Team)` |
| `(sound: SFX, amplitude: Number, squad: Squad)` |
| `(sound: SFX, amplitude: Number, player: Player)` |
| `(sound: SFX, amplitude: Number)` |

##### StopSound

| Signature |
| --- |
| `(sound: SFX, team: Team)` |
| `(sound: SFX, squad: Squad)` |
| `(sound: SFX, player: Player)` |
| `(sound: SFX)` |

### Camera

##### SetCameraTypeForAll

| Signature |
| --- |
| `(cameraType: Enum_Cameras)` |
| `(cameraType: Enum_Cameras, cameraIndex: Number)` |

##### SetCameraTypeForPlayer

| Signature |
| --- |
| `(player: Player, cameraType: Enum_Cameras)` |
| `(player: Player, cameraType: Enum_Cameras, cameraIndex: Number)` |

##### SetSpectatingFiltersForAll

| Signature |
| --- |
| `(group: Enum_SpectatingGroup, ownSquadOnly: Boolean, ownTeamOnly: Boolean)` |

##### SetSpectatingFiltersForPlayer

| Signature |
| --- |
| `(player: Player, group: Enum_SpectatingGroup, ownSquadOnly: Boolean, ownTeamOnly: Boolean)` |

### Effects

**ScreenEffects**

##### EnableScreenEffect

| Signature |
| --- |
| `(player: Player, screenEffect: Enum_ScreenEffects, enable: Boolean)` |

**VFX**

##### EnableVFX

| Signature |
| --- |
| `(vfx: VFX, enable: Boolean)` |

##### MoveVFX

| Signature |
| --- |
| `(vfxID: VFX, position: Vector, rotation: Vector)` |

##### SetVFXColor

| Signature |
| --- |
| `(vfxID: VFX, color: Vector)` |

##### SetVFXScale

| Signature |
| --- |
| `(vfxID: VFX, scale: Number)` |

##### SetVFXSpeed

| Signature |
| --- |
| `(vfxID: VFX, speed: Number)` |

### Emplacements

##### ForceEmplacementSpawnerSpawn

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner)` |

##### SetEmplacementSpawnerAbandonVehicleOutOfCombatArea

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, enabled: Boolean)` |

##### SetEmplacementSpawnerApplyDamageToAbandonVehicle

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, enabled: Boolean)` |

##### SetEmplacementSpawnerAutoSpawn

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, enabled: Boolean)` |

##### SetEmplacementSpawnerKeepAliveAbandonRadius

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, keepAliveAbandonedRadius: Number)` |

##### SetEmplacementSpawnerRespawnTime

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, respawnTime: Number)` |

##### SetEmplacementSpawnerSpawnerRadius

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, keepAliveSpawnerRadius: Number)` |

##### SetEmplacementSpawnerTimeUntilAbandon

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, timeUntilAbandon: Number)` |

##### SetEmplacementSpawnerType

| Signature |
| --- |
| `(emplacementSpawner: EmplacementSpawner, emplacementType: Enum_StationaryEmplacements)` |

### Gameplay

**Debug**

##### SendPortalLogToAdmin

| Signature |
| --- |
| `()` |

**Deploy**

##### DeployAllPlayers

| Signature |
| --- |
| `()` |

##### EnableAllPlayerDeploy

| Signature |
| --- |
| `(enablePlayerDeploy: Boolean)` |

##### EnablePlayerDeploy

| Signature |
| --- |
| `(player: Player, deployAllowed: Boolean)` |

##### SetRedeployTime

| Signature |
| --- |
| `(player: Player, redeployTime: Number)` |

##### UndeployAllPlayers

| Signature |
| --- |
| `()` |

##### UndeployPlayer

| Signature |
| --- |
| `(player: Player)` |

**Gamemode**

##### EndGameMode

| Signature |
| --- |
| `(player: Player)` |
| `(team: Team)` |

##### PauseGameModeTime

| Signature |
| --- |
| `(pauseTimer: Boolean)` |

##### ResetGameModeTime

| Signature |
| --- |
| `()` |

##### RingOfFireStart

| Signature |
| --- |
| `(ringOfFire: RingOfFire)` |

##### SetFriendlyFire

| Signature |
| --- |
| `(enableFriendlyFire: Boolean)` |

##### SetGameModeScore

| Signature |
| --- |
| `(team: Team, newScore: Number)` |
| `(player: Player, newScore: Number)` |

##### SetGameModeTargetScore

| Signature |
| --- |
| `(newScore: Number)` |

##### SetGameModeTimeLimit

| Signature |
| --- |
| `(newTimeLimit: Number)` |

##### SetHQTeam

| Signature |
| --- |
| `(hq: HQ, team: Team)` |

##### SetRingOfFireDamageAmount

| Signature |
| --- |
| `(ringOfFireId: RingOfFire, ringOfFireDamageAmount: Number)` |

##### SetRingOfFireStableTime

| Signature |
| --- |
| `(ringOfFireId: RingOfFire, ringOfFireStableTime: Number)` |

##### AutoBalanceTeams

| Signature |
| --- |
| `()` |

##### DisablePlayerJoin

| Signature |
| --- |
| `()` |

##### EnableAreaTrigger

| Signature |
| --- |
| `(areaTrigger: AreaTrigger, enable: Boolean)` |

##### EnableInteractPoint

| Signature |
| --- |
| `(interactPoint: InteractPoint, enable: Boolean)` |

##### GolmudTrainSendMoveCommand

| Signature |
| --- |
| `(moveCommand: Enum_GolmudTrainMoveCommands)` |

##### RayCast

| Signature |
| --- |
| `(player: Player, start: Vector, stop: Vector)` |
| `(start: Vector, stop: Vector)` |

##### SetTeam

| Signature |
| --- |
| `(player: Player, team: Team)` |

##### SetVL7CloudEffects

| Signature |
| --- |
| `(vl7Cloud: VL7Cloud, screenEffect: Boolean, soldierEffect: Boolean, visualEffect: Boolean)` |

##### SpawnLoot

| Signature |
| --- |
| `(lootSpawner: LootSpawner, ammo: Enum_AmmoTypes)` |
| `(lootSpawner: LootSpawner, weapon: Enum_Weapons)` |
| `(lootSpawner: LootSpawner, gadget: Enum_Gadgets)` |
| `(lootSpawner: LootSpawner, armor: Enum_ArmorTypes)` |

##### SwitchTeams

| Signature |
| --- |
| `(teamA: Team, teamB: Team)` |

##### UnspawnAllLoot

| Signature |
| --- |
| `()` |

##### UnspawnObject

| Signature |
| --- |
| `(obj: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` |

**Health**

##### DealDamage

| Signature |
| --- |
| `(player: Player, damageAmount: Number)` |
| `(player: Player, damageAmount: Number, damageGiver: Player)` |
| `(vehicle: Vehicle, damageAmount: Number)` |

##### ForceRevive

| Signature |
| --- |
| `(player: Player)` |

##### Heal

| Signature |
| --- |
| `(player: Player, healAmount: Number)` |
| `(player: Player, healAmount: Number, giver: Player)` |
| `(vehicle: Vehicle, repairAmount: Number)` |

##### Kill

| Signature |
| --- |
| `(player: Player)` |
| `(vehicle: Vehicle)` |

**Soldier**

##### SetSoldierEffect

| Signature |
| --- |
| `(player: Player, soldierEffects: Enum_SoldierEffects, isEnabled: Boolean)` |

##### SpotTarget

| Signature |
| --- |
| `(targetplayer: Player, duration: Number, spotStatus: Enum_SpotStatus)` |
| `(targetPlayer: Player, spotterPlayer: Player, duration: Number, spotStatus: Enum_SpotStatus)` |
| `(targetplayer: Player, spotStatus: Enum_SpotStatus)` |
| `(targetPlayer: Player, spotterPlayer: Player, duration: Number)` |
| `(targetplayer: Player, duration: Number)` |

### Logic

##### Abort

| Signature |
| --- |
| `()` |

##### AbortIf

| Signature |
| --- |
| `(condition: Boolean)` |

##### ChaseVariableAtRate

| Signature |
| --- |
| `(variable: Variable, limit: Number, deltaPerSecond: Number)` |

##### ChaseVariableOverTime

| Signature |
| --- |
| `(variable: Variable, limit: Number, durationSeconds: Number)` |

##### JsAction

| Signature |
| --- |
| `(actionName: String, any, any)` |

##### Skip

| Signature |
| --- |
| `(actionCount: Number)` |

##### SkipIf

| Signature |
| --- |
| `(actionCount: Number, Boolean)` |

##### StopChasingVariable

| Signature |
| --- |
| `(variable: Variable)` |

##### Wait

| Signature |
| --- |
| `(seconds: Number)` |

##### WaitUntil

| Signature |
| --- |
| `(seconds: Number, condition: Boolean)` |

### Objectives

**CapturePoint**

##### EnableCapturePointDeploying

| Signature |
| --- |
| `(capturePoint: CapturePoint, enableDeploying: Boolean)` |

##### SetCapturePointCapturingTime

| Signature |
| --- |
| `(capturePoint: CapturePoint, capturingTime: Number)` |

##### SetCapturePointNeutralizationTime

| Signature |
| --- |
| `(capturePoint: CapturePoint, neutralizationTime: Number)` |

##### SetCapturePointOwner

| Signature |
| --- |
| `(capturePoint: CapturePoint, team: Team)` |

##### SetMaxCaptureMultiplier

| Signature |
| --- |
| `(capturePoint: CapturePoint, multiplier: Number)` |

**Deploy**

##### EnableHQ

| Signature |
| --- |
| `(hq: HQ, enable: Boolean)` |

##### EnableGameModeObjective

| Signature |
| --- |
| `(objective: CapturePoint | HQ | Sector | MCOM, enable: Boolean)` |

##### SetMCOMFuseTime

| Signature |
| --- |
| `(mCOM: MCOM, fuseTime: Number)` |

##### SetMCOMOwner

| Signature |
| --- |
| `(mcom: MCOM, team: Team)` |

### Other

##### SetVariable

| Signature |
| --- |
| `(variable: Variable, any)` |

### Player

**Deploy**

##### DeployPlayer

| Signature |
| --- |
| `(player: Player)` |

##### SetSpawnMode

| Signature |
| --- |
| `(spawnModes: Enum_SpawnModes)` |

##### SpawnPlayerFromSpawnPoint

| Signature |
| --- |
| `(player: Player, spawnPoint: SpawnPoint)` |

##### SetPlayerIncomingDamageFactor

| Signature |
| --- |
| `(player: Player, amount: Number)` |

##### Teleport

| Signature |
| --- |
| `(player: Player, destination: Vector, orientation: Number)` |
| `(vehicle: Vehicle, destination: Vector, orientation: Number)` |

**Inputs**

##### EnableAllInputRestrictions

| Signature |
| --- |
| `(player: Player, restrictInput: Boolean)` |

##### EnableInputRestriction

| Signature |
| --- |
| `(player: Player, inputRestriction: Enum_RestrictedInputs, restrictInput: Boolean)` |

**Inventory**

##### AddAttachmentToWeaponPackage

| Signature |
| --- |
| `(attachment: Enum_WeaponAttachments, weaponPackage: WeaponPackage)` |

##### AddEquipment

| Signature |
| --- |
| `(player: Player, weapon: Enum_Weapons)` |
| `(player: Player, gadget: Enum_Gadgets)` |
| `(player: Player, weapon: Enum_Weapons, weaponPackage: WeaponPackage)` |
| `(player: Player, Enum_Weapons, desiredInventorySlot: Enum_InventorySlots)` |
| `(player: Player, gadget: Enum_Gadgets, desiredInventorySlot: Enum_InventorySlots)` |
| `(player: Player, weapon: Enum_Weapons, weaponPackage: WeaponPackage, desiredInventorySlots: Enum_InventorySlots)` |
| `(player: Player, armor: Enum_ArmorTypes)` |

##### ForceSwitchInventory

| Signature |
| --- |
| `(player: Player, inventorySlot: Enum_InventorySlots)` |

##### RemoveEquipment

| Signature |
| --- |
| `(player: Player, inventorySlot: Enum_InventorySlots)` |
| `(Player, weapon: Enum_Weapons)` |
| `(Player, gadget: Enum_Gadgets)` |

##### SetInventoryAmmo

| Signature |
| --- |
| `(player: Player, inventorySlots: Enum_InventorySlots, ammo: Number)` |

##### SetInventoryMagazineAmmo

| Signature |
| --- |
| `(player: Player, inventorySlots: Enum_InventorySlots, magAmmo: Number)` |

**Soldier**

##### ForceManDown

| Signature |
| --- |
| `(player: Player)` |

##### Resupply

| Signature |
| --- |
| `(player: Player, ressuplyType: Enum_ResupplyTypes)` |

##### SetPlayerMaxHealth

| Signature |
| --- |
| `(player: Player, maxHealth: Number)` |

##### SetPlayerMovementSpeedMultiplier

| Signature |
| --- |
| `(player: Player, multiplier: Number)` |

##### SkipManDown

| Signature |
| --- |
| `(player: Player, skipManDown: Boolean)` |

### Transform

##### MoveObject

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, positionDelta: Vector)` |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, positionDelta: Vector, rotationDelta: Vector)` |

##### MoveObjectOverTime

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, positionDelta: Vector, rotationDelta: Vector, timeInSeconds: Number, shouldLoop: Boolean, shouldReverse: Boolean)` |

##### OrbitObjectOverTime

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, orbitTransform: Transform, timeInSeconds: Number, radius: Number, shouldLoop: Boolean, shouldReverse: Boolean, clockwise: Boolean)` |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, orbitTransform: Transform, timeInSeconds: Number, radius: Number, shouldLoop: Boolean, shouldReverse: Boolean, clockwise: Boolean, orbitAxis: Vector)` |

##### RotateObject

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, rotationDelta: Vector)` |

##### SetObjectTransform

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, transform: Transform)` |

##### SetObjectTransformOverTime

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, transform: Transform, timeInSeconds: Number, shouldLoop: Boolean, shouldReverse: Boolean)` |

##### StopActiveMovementForObject

| Signature |
| --- |
| `(object: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` |

### UI

##### AddUIIcon

| Signature |
| --- |
| `(parentObject: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, image: Enum_WorldIconImages, verticalOffset: Number, iconColour: Vector, iconText: Message, visibility: Player | Team)` |
| `(parentObject: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, image: Enum_WorldIconImages, verticalOffset: Number, iconColour: Vector, iconText: Message)` |

##### EnableWorldIconImage

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableImage: Boolean)` |

##### EnableWorldIconText

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableText: Boolean)` |

##### RemoveUIIcon

| Signature |
| --- |
| `(objectWithIcon: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` |
| `(objectWithIcon: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, visibility: Player | Team)` |

##### SetWorldIconColor

| Signature |
| --- |
| `(worldIcon: WorldIcon, newColor: Vector)` |

##### SetWorldIconImage

| Signature |
| --- |
| `(worldIcon: WorldIcon, newImage: Enum_WorldIconImages)` |

##### SetWorldIconOwner

| Signature |
| --- |
| `(worldIcon: WorldIcon, newTeamOwner: Team)` |
| `(worldIcon: WorldIcon, newPlayerOwner: Player)` |

##### SetWorldIconPosition

| Signature |
| --- |
| `(worldIcon: WorldIcon, newPosition: Vector)` |

##### SetWorldIconText

| Signature |
| --- |
| `(worldIcon: WorldIcon, newText: Message)` |

**Messages**

##### ClearAllCustomNotificationMessages

| Signature |
| --- |
| `(target: Player)` |

##### ClearCustomNotificationMessage

| Signature |
| --- |
| `(slot: Enum_CustomNotificationSlots)` |
| `(slot: Enum_CustomNotificationSlots, target: Player)` |
| `(slot: Enum_CustomNotificationSlots, target: Team)` |

##### DisplayCustomNotificationMessage

| Signature |
| --- |
| `(msg: Message, slot: Enum_CustomNotificationSlots, duration: Number)` |
| `(msg: Message, slot: Enum_CustomNotificationSlots, duration: Number, target: Player)` |
| `(msg: Message, slot: Enum_CustomNotificationSlots, duration: Number, target: Team)` |

##### DisplayHighlightedWorldLogMessage

| Signature |
| --- |
| `(message: Message)` |
| `(message: Message, player: Player)` |
| `(message: Message, team: Team)` |

##### DisplayNotificationMessage

| Signature |
| --- |
| `(message: Message)` |
| `(message: Message, player: Player)` |
| `(message: Message, team: Team)` |

##### SendErrorReport

| Signature |
| --- |
| `(message: Message)` |

**Scoreboard**

##### SetScoreboardColumnNames

| Signature |
| --- |
| `(column1Name: Message, column2Name: Message, column3Name: Message, column4Name: Message, column5Name: Message)` |
| `(column1Name: Message, column2Name: Message, column3Name: Message, column4Name: Message)` |
| `(column1Name: Message, column2Name: Message, column3Name: Message)` |
| `(column1Name: Message, column2Name: Message)` |
| `(column1Name: Message)` |

##### SetScoreboardColumnWidths

| Signature |
| --- |
| `(column1Width: Number, column2Width: Number, column3Width: Number, column4Width: Number, column5Width: Number)` |
| `(column1Width: Number, column2Width: Number, column3Width: Number, column4Width: Number)` |
| `(column1Width: Number, column2Width: Number, column3Width: Number)` |
| `(column1Width: Number, column2Width: Number)` |
| `(column1Width: Number)` |

##### SetScoreboardHeader

| Signature |
| --- |
| `(team1Name: Message, team2Name: Message)` |
| `(headerName: Message)` |

##### SetScoreboardPlayerValues

| Signature |
| --- |
| `(player: Player, column1Value: Number, column2Value: Number, column3Value: Number, column4Value: Number, column5Value: Number)` |
| `(player: Player, column1Value: Number, column2Value: Number, column3Value: Number, column4Value: Number)` |
| `(player: Player, column1Value: Number, column2Value: Number, column3Value: Number)` |
| `(player: Player, column1Value: Number, column2Value: Number)` |
| `(player: Player, column1Value: Number)` |

##### SetScoreboardSorting

| Signature |
| --- |
| `(sortingColumn: Number, reverseSorting: Boolean)` |
| `(sortingColumn: Number)` |

##### SetScoreboardType

| Signature |
| --- |
| `(scoreboardType: Enum_ScoreboardType)` |

**UIWidgets**

##### AddUIButton

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, depth: Enum_UIDepth)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, depth: Enum_UIDepth, receiver: Player | Team)` |

##### AddUIContainer

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, depth: Enum_UIDepth)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, depth: Enum_UIDepth, receiver: Player | Team)` |

##### AddUIGadgetImage

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, gadget: Enum_Gadgets, parent: UIWidget)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, gadget: Enum_Gadgets, parent: UIWidget, visibility: Player | Team)` |

##### AddUIImage

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, imageType: Enum_UIImageType)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, imageType: Enum_UIImageType, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number, depth: Enum_UIDepth)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number, depth: Enum_UIDepth, receiver: Player | Team)` |

##### AddUIText

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, message: Message)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, message: Message, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: Enum_UIAnchor)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: Enum_UIAnchor, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: Enum_UIAnchor, depth: Enum_UIDepth)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, message: Message, textSize: Number, textColor: Vector, textAlpha: Number, textAnchor: Enum_UIAnchor, depth: Enum_UIDepth, receiver: Player | Team)` |

##### AddUIWeaponImage

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, weapon: Enum_Weapons, parent: UIWidget)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, weapon: Enum_Weapons, parent: UIWidget, weaponPackage: WeaponPackage)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, weapon: Enum_Weapons, parent: UIWidget, visibility: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, weapon: Enum_Weapons, parent: UIWidget, weaponPackage: WeaponPackage, visibility: Player | Team)` |

##### DeleteAllUIWidgets

| Signature |
| --- |
| `()` |

##### DeleteUIWidget

| Signature |
| --- |
| `(widget: UIWidget)` |

##### EnableUIButtonEvent

| Signature |
| --- |
| `(widget: UIWidget, buttonEvent: Enum_UIButtonEvent, enabled: Boolean)` |

##### EnableUIInputMode

| Signature |
| --- |
| `(enabled: Boolean)` |
| `(enabled: Boolean, receiver: Player | Team)` |

##### SetUIButtonAlphaBase

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaDisabled

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaFocused

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaHover

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonAlphaPressed

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIButtonColorBase

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorDisabled

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorFocused

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorHover

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonColorPressed

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIButtonEnabled

| Signature |
| --- |
| `(widget: UIWidget, enabled: Boolean)` |

##### SetUIImageAlpha

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIImageColor

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIImageType

| Signature |
| --- |
| `(widget: UIWidget, imageType: Enum_UIImageType)` |

##### SetUITextAlpha

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUITextAnchor

| Signature |
| --- |
| `(widget: UIWidget, anchor: Enum_UIAnchor)` |

##### SetUITextColor

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUITextLabel

| Signature |
| --- |
| `(widget: UIWidget, message: Message)` |

##### SetUITextSize

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIWidgetAnchor

| Signature |
| --- |
| `(widget: UIWidget, anchor: Enum_UIAnchor)` |

##### SetUIWidgetBgAlpha

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIWidgetBgColor

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIWidgetBgFill

| Signature |
| --- |
| `(widget: UIWidget, bgFill: Enum_UIBgFill)` |

##### SetUIWidgetDepth

| Signature |
| --- |
| `(widget: UIWidget, depth: Enum_UIDepth)` |

##### SetUIWidgetName

| Signature |
| --- |
| `(widget: UIWidget, name: String)` |

##### SetUIWidgetPadding

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUIWidgetParent

| Signature |
| --- |
| `(widget: UIWidget, parent: UIWidget)` |

##### SetUIWidgetPosition

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIWidgetSize

| Signature |
| --- |
| `(widget: UIWidget, value: Vector)` |

##### SetUIWidgetVisible

| Signature |
| --- |
| `(widget: UIWidget, visible: Boolean)` |

### Vehicles

##### ForceVehicleSpawnerSpawn

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner)` |

##### SetAllVehiclesAllowedInSurroundingArea

| Signature |
| --- |
| `(allowed: Boolean)` |

##### SetMaxVehicleHeightLimitScale

| Signature |
| --- |
| `(heightScale: Number)` |

##### SetVehicleAllowedInSurroundingArea

| Signature |
| --- |
| `(vehicle: Enum_VehicleList, allowed: Boolean)` |

##### SetVehicleCategoryAllowedInSurroundingArea

| Signature |
| --- |
| `(vehicleCategory: Enum_VehicleCategories, allowed: Boolean)` |

##### SetVehicleSpawnerAbandonVehiclesOutOfCombatArea

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, enabled: Boolean)` |

##### SetVehicleSpawnerApplyDamageToAbandonVehicle

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, enabled: Boolean)` |

##### SetVehicleSpawnerAutoSpawn

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, enabled: Boolean)` |

##### SetVehicleSpawnerKeepAliveAbandonRadius

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, keepAliveAbandonedRadius: Number)` |

##### SetVehicleSpawnerKeepAliveSpawnerRadius

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, keepAliveSpawnerRadius: Number)` |

##### SetVehicleSpawnerRespawnTime

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, respawnTime: Number)` |

##### SetVehicleSpawnerTimeUntilAbandon

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, timeUntilAbandon: Number)` |

##### SetVehicleSpawnerVehicleType

| Signature |
| --- |
| `(vehicleSpawner: VehicleSpawner, vehicleType: Enum_VehicleList)` |

**Health**

##### SetVehicleMaxHealthMultiplier

| Signature |
| --- |
| `(vehicle: Vehicle, maxHealthMultiplier: Number)` |

**Soldier**

##### ForcePlayerExitVehicle

| Signature |
| --- |
| `(player: Player, vehicle: Vehicle)` |
| `(vehicle: Vehicle)` |
| `(player: Player)` |

##### ForcePlayerToSeat

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

| Type | Description |
| --- | --- |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
| `undefined` | undefined |
