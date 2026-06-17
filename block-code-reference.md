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

| Signature | Return Type |
| --- | --- |
| `()` | void |

##### EmptyArray

Returns an initialized empty Array.

| Signature | Return Type |
| --- | --- |
| `()` | Array |

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

Returns the AreaTrigger payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | AreaTrigger |

##### EventBoolean

Returns the Boolean value from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Boolean |

##### EventCapturePoint

Returns the CapturePoint payload from the Rule Event context.

| Signature | Return Type |
| --- | --- |
| `()` | CapturePoint |

##### EventDamageType

Returns the DamageType of the victim from the OnPlayerDamaged Event context.

| Signature | Return Type |
| --- | --- |
| `()` | DamageType |

##### EventDeathType

Returns the DeathType of the victim from the OnPlayerDied or OnPlayerEarnedKill Event context.

| Signature | Return Type |
| --- | --- |
| `()` | DeathType |

##### EventEmplacementSpawner

Returns the EmplacementSpawner payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | EmplacementSpawner |

##### EventFixedCamera

Returns the FixedCamera payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | FixedCamera |

##### EventGolmudTrainStopReason

Returns the PortalEnum value from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | PortalEnum |

##### EventHQ

Returns the HQ payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | HQ |

##### EventInteractPoint

Returns the InteractPoint payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | InteractPoint |

##### EventMCOM

Returns a MCOM payload from the Rule Event context.

| Signature | Return Type |
| --- | --- |
| `()` | MCOM |

##### EventNormal

Returns the Vector value from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### EventNumber

Returns the Number value from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### EventOtherPlayer

Returns the 2nd Player payload from the Rule Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Player |

##### EventPlayer

Returns the 1st Player payload from the Rule Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Player |

##### EventPoint

Returns the Vector value from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### EventRingOfFire

Returns the RingOfFire payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | RingOfFire |

##### EventSeat

Returns the Number seat index payload of a Vehicle from the Rule Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### EventSector

Returns the Sector payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Sector |

##### EventSpawner

Returns the Spawner payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Spawner |

##### EventSpawnPoint

Returns the SpawnPoint payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | SpawnPoint |

##### EventTeam

Returns the Team payload from the Ongoing Team Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Team |

##### EventUIButtonEvent

Returns the PortalEnum value from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | PortalEnum |

##### EventUIWidget

Returns the UIWidget payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | UIWidget |

##### EventVehicle

Returns the Vehicle payload from the Rule Event context.

| Signature | Return Type |
| --- | --- |
| `()` | Vehicle |

##### EventVehicleSpawner

Returns the VehicleSpawner payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | VehicleSpawner |

##### EventVL7Cloud

Returns the VL7Cloud payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | VL7Cloud |

##### EventWaypointPath

Returns the WaypointPath payload from the Event context.

| Signature | Return Type |
| --- | --- |
| `()` | WaypointPath |

##### EventWeapon

Returns the WeaponUnlock of the weapon used to kill the victim from the OnPlayerDied or OnPlayerEarnedKill Event context.

| Signature | Return Type |
| --- | --- |
| `()` | WeaponUnlock |

##### EventWorldIcon

Returns the WorldIcon payload from the Event context.

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

Returns the current gamemode score of the provided Player or Team.

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Number |
| `(team: Team)` | Number |

##### GetMatchTimeElapsed

Returns the amount of time left (seconds) in the current gamemode.

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

Returns the time limit set for the gamemode (in seconds).

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### GetTargetScore

Returns the gamemode target score needed for victory.

| Signature | Return Type |
| --- | --- |
| `()` | Number |

##### IsFaction

Returns True if the provided Team is using soldiers from the specified Factions.

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

Returns True if the provided Maps is the name of the current map.

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

Returns True if the provided value is equal to the specified Types.

| Signature | Return Type |
| --- | --- |
| `(any, type: Enum_Types)` | Boolean |

##### JsValue

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

| Signature | Return Type |
| --- | --- |
| `()` | Number |

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

| Signature | Return Type |
| --- | --- |
| `()` | Array |

##### GetCapturePoint

Returns the CapturePoint or MCOM corresponding to the provided CapturePoints or MCOMs respectively.

| Signature | Return Type |
| --- | --- |
| `(id: Number)` | CapturePoint |

##### GetCaptureProgress

Returns a Number from zero to one corresponding to the capture progress of the provided CapturePoint.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Number |

##### GetCurrentOwnerTeam

Returns the current owner Team corresponding to the provided CapturePoint.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

##### GetOwnerProgressTeam

Returns the Team of the team currently capturing the provided CapturePoint.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Team |

##### GetPlayersOnPoint

Returns a Array of all players within the boundaries of a provided CapturePoint.

| Signature | Return Type |
| --- | --- |
| `(capturePoint: CapturePoint)` | Array |

##### GetPreviousOwnerTeam

Returns the previous owner Team corresponding to the provided CapturePoint.

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

Returns a Factions from the collection of all available factions.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Factions |

##### GadgetsItem

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_Gadgets |

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

Returns a InventorySlots from the collection of all available player inventory slots.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_InventorySlots |

##### MapsItem

Returns a Maps from the collection of all maps.

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

Returns a PlayerDamageTypes from the collection of all possible damage types.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_PlayerDamageTypes |

##### PlayerDeathTypesItem

Returns a PlayerDeathTypes from the collection of all possible death types.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_PlayerDeathTypes |

##### RestrictedInputsItem

Returns a RestrictedInputs from the collection of all inputs which can be restricted with EnableInputRestriction.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_RestrictedInputs |

##### ResupplyTypesItem

Returns a ResupplyTypes from the collection of resupply types which can be used with Resupply.

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

Returns the SoldierStateBool of the selected Boolean-based player property.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierStateBool |

##### SoldierStateNumberItem

Returns the SoldierStateNumber of the selected Number-based player property.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_SoldierStateNumber |

##### SoldierStateVectorItem

Returns the SoldierStateVector of the selected Vector-based player property.

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

Returns a Types from the collection of all object types.

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

Returns the VehicleStateVector of the selected Vector-based vehicle property.

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

Returns a WorldIconImages from the collection of world icon images.

| Signature | Return Type |
| --- | --- |
| `(String, String)` | Enum_WorldIconImages |

### Player

##### AllPlayers

Returns an Array of all players within a game.

| Signature | Return Type |
| --- | --- |
| `()` | Array |

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

| Signature | Return Type |
| --- | --- |
| `(player: Player)` | Squad |
| `(teamIdNumber: Number, squadIdNumber: Number)` | Squad |

##### GetSquadName

| Signature | Return Type |
| --- | --- |
| `(Squad)` | String |

##### GetTeam

Returns the Team value of the specified Player OR the corresponding Team of the provided Number.

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

Returns a Boolean indicating if the victim was damaged by the provided DamageType.

| Signature | Return Type |
| --- | --- |
| `(damageType: DamageType, playerDamageTypes: Enum_PlayerDamageTypes)` | Boolean |

##### EventDeathTypeCompare

Returns a Boolean indicating if the victim died by the provided DeathType.

| Signature | Return Type |
| --- | --- |
| `(deathType: DeathType, playerDeathTypes: Enum_PlayerDeathTypes)` | Boolean |

##### EventWeaponCompare

Returns a Boolean indicating if the given WeaponUnlock is equivalent to the provided ability.

| Signature | Return Type |
| --- | --- |
| `(eventWeapon: WeaponUnlock, weapon: Enum_Weapons)` | Boolean |
| `(eventWeapon: WeaponUnlock, gadget: Enum_Gadgets)` | Boolean |

##### GetInventoryAmmo

Returns the target Player loaded ammo of the provided InventorySlots.

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Enum_InventorySlots)` | Number |

##### GetInventoryMagazineAmmo

Returns the target Player magazine ammo of the provided InventorySlots.

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Enum_InventorySlots)` | Number |

##### GetSoldierState

Returns the value of the target Player state.

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

Returns True whether or not the active inventory slot of the target Player is the provided InventorySlots.

| Signature | Return Type |
| --- | --- |
| `(player: Player, inventorySlots: Enum_InventorySlots)` | Boolean |

##### IsSoldierClass

| Signature | Return Type |
| --- | --- |
| `(player: Player, soldierClass: Enum_SoldierClass)` | Boolean |

### Transform

##### BackwardVector

Returns the backward directional Vector of (0, 0, 1).

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### DownVector

Returns the downward directional Vector of (0, -1, 0).

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### ForwardVector

Returns the forward directional Vector of (0, 0, -1).

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

Returns the leftward directional Vector of (-1, 0, 0).

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

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

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

##### UpVector

Returns the upward directional Vector of (0, 1, 0).

| Signature | Return Type |
| --- | --- |
| `()` | Vector |

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

| Signature | Return Type |
| --- | --- |
| `(worldIconNumber: Number)` | WorldIcon |

**Messages**

##### Message

Returns a constructed Message object which can be used with ShowGameModeMessage, ShowNotificationMessage, ShowHighlightedMessage, and DisplayCustomNotificationMessage. The Message object is created by providing a Number, Player, or format String (which can take up to 3 format items).
A format String is a String that contains `{}` (called braces) within them, which can be substituted for parameters. For example, the String - `{} gained {} points!` - can be given a Player and Number parameter and could output as `John gained 2 points!`. See the example below for how this can be used with blocks.
_Note: It's your responsibility to ensure a safe and fair experience for others, violating the EA User Agreement by using offensive or inappropriate text may result in account bans._

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

Returns an Array of all vehicles within a game.

| Signature | Return Type |
| --- | --- |
| `()` | Array |

##### CompareVehicleName

Returns a Boolean indicating if the target Vehicle has the same name as the provided Vehicles or if it is the same type as the provided VehicleTypes.

| Signature | Return Type |
| --- | --- |
| `(vehicle: Vehicle, vehicleList: Enum_VehicleList)` | Boolean |

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
| `(vehicle: Vehicle, vehicleStateVector: Enum_VehicleStateVector)` | Vector |

##### GetVehicleTeam

Returns the Team of the provided Vehicle.
_Note: A Vehicle that is not occupied will have a neutral Team._

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

| Signature |
| --- |
| `(player: Player, defendPosition: Vector, minDistance: Number, maxDistance: Number)` |

##### AIIdleBehavior

Sets a Player's current position as idle point. (Only works for AI players)

| Signature |
| --- |
| `(player: Player)` |

##### AILOSMoveToBehavior

| Signature |
| --- |
| `(player: Player, position: Vector)` |

##### AIMoveToBehavior

Sets a target Player a destination to move to. (Only works for AI players)

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

Sets a Player to patrol a waypoint. (Only works for AI players)

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

Sets a Player's move speed for MoveTo Behaviors. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, moveSpeed: Enum_MoveSpeed)` |

##### AISetStance

Sets a Player's stance. (Only works for AI players)

| Signature |
| --- |
| `(player: Player, stance: Enum_Stance)` |

##### AISetTarget

Sets a Player's current target. (Only works for AI players)

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

Finds or initializes an Array on a provided Variable, and stores a provided value in that Array at the specified index.
_Note: The first value in the array starts at an index of 0._

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

Enables of disables a player-specific screen effect.

| Signature |
| --- |
| `(player: Player, screenEffect: Enum_ScreenEffects, enable: Boolean)` |

**VFX**

##### EnableVFX

Enables of disables a visual effect.

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

Overrides the time to redeploy for a target Player.
_Note: The redeploy time must be set to a value between 0 and 60 seconds._

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

Sets the gamemode score of the provided Player or Team.

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

| Signature |
| --- |
| `(moveCommand: Enum_GolmudTrainMoveCommands)` |

##### RayCast

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

Revives a target Player who is in the mandown state.

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

Kills a target Player (skips the Mandown state).

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

Spots a target Player for all players for a specified duration of time (in seconds).

| Signature |
| --- |
| `(targetplayer: Player, duration: Number, spotStatus: Enum_SpotStatus)` |
| `(targetPlayer: Player, spotterPlayer: Player, duration: Number, spotStatus: Enum_SpotStatus)` |
| `(targetplayer: Player, spotStatus: Enum_SpotStatus)` |
| `(targetPlayer: Player, spotterPlayer: Player, duration: Number)` |
| `(targetplayer: Player, duration: Number)` |

### Logic

##### Abort

Stops the execution of a list of Actions in a Rule.

| Signature |
| --- |
| `()` |

##### AbortIf

Stops the execution of a list of Actions in a Rule if the provided Boolean is True. Otherwise, the execution continues with the remaining Actions.

| Signature |
| --- |
| `(condition: Boolean)` |

##### ChaseVariableAtRate

Gradually modifies the value of a Variable at a specified rate (value/second) until it reaches the provided limit.
_Note: If the limit is changed later, the Variable will continue to be updated from its previous value. To spot modifying the Variable, use StopChasingVariable._

| Signature |
| --- |
| `(variable: Variable, limit: Number, deltaPerSecond: Number)` |

##### ChaseVariableOverTime

Gradually modifies the value of a Variable over time (in seconds). The variable's value will reach the limit at the end of the interval.
_Note: If the limit is changed later, the Variable will continue to be updated from its previous value. To spot modifying the Variable, use StopChasingVariable._

| Signature |
| --- |
| `(variable: Variable, limit: Number, durationSeconds: Number)` |

##### JsAction

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

| Signature |
| --- |
| `(objective: CapturePoint | HQ | Sector | MCOM, enable: Boolean)` |

##### SetMCOMFuseTime

Sets the fuse time (in seconds) for target MCOM to the provided Number

| Signature |
| --- |
| `(mCOM: MCOM, fuseTime: Number)` |

##### SetMCOMOwner

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

Enables or disables a specified RestrictedInputs on a target Player.

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

Forces the target Player to switch to the provided InventorySlots.

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

Sets the target Player loaded ammo for the provided InventorySlots.

| Signature |
| --- |
| `(player: Player, inventorySlots: Enum_InventorySlots, ammo: Number)` |

##### SetInventoryMagazineAmmo

Sets the target Player magazine ammo for the provided InventorySlots.

| Signature |
| --- |
| `(player: Player, inventorySlots: Enum_InventorySlots, magAmmo: Number)` |

**Soldier**

##### ForceManDown

Puts the target Player into the mandown state (unless mandown is disabled).

| Signature |
| --- |
| `(player: Player)` |

##### Resupply

Resupplies the target Player using a provided ResupplyTypes.

| Signature |
| --- |
| `(player: Player, ressuplyType: Enum_ResupplyTypes)` |

##### SetPlayerMaxHealth

Sets the max health of a target Player from 0 to 1000.
_Note: The value will be multiplied by the max health multiplier of the that target._

| Signature |
| --- |
| `(player: Player, maxHealth: Number)` |

##### SetPlayerMovementSpeedMultiplier

| Signature |
| --- |
| `(player: Player, multiplier: Number)` |

##### SkipManDown

Sets the target Player to skip the mandown state and go directly to the deploy screen when killed.
_Note: By default, SkipMandown is disabled._

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

Creates a new UI Icon Widget.

| Signature |
| --- |
| `(parentObject: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, image: Enum_WorldIconImages, verticalOffset: Number, iconColour: Vector, iconText: Message, visibility: Player | Team)` |
| `(parentObject: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, image: Enum_WorldIconImages, verticalOffset: Number, iconColour: Vector, iconText: Message)` |

##### EnableWorldIconImage

Enables or disables the image for a provided WorldIcons.

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableImage: Boolean)` |

##### EnableWorldIconText

Enables or disables the text for a provided WorldIcons.
_Note: There is no default text, and will need to be set before or after this property is enabled to appear_.

| Signature |
| --- |
| `(worldIcon: WorldIcon, enableText: Boolean)` |

##### RemoveUIIcon

| Signature |
| --- |
| `(objectWithIcon: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon)` |
| `(objectWithIcon: Object | Global | AreaTrigger | CapturePoint | EmplacementSpawner | FixedCamera | HQ | InteractPoint | LootSpawner | MapSpecificFeature | MCOM | Player | RingOfFire | Sector | SFX | SpatialObject | Spawner | SpawnPoint | Team | Vehicle | VehicleSpawner | VFX | VL7Cloud | VO | WaypointPath | WorldIcon, visibility: Player | Team)` |

##### SetWorldIconColor

Sets the color property of a WorldIcon.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newColor: Vector)` |

##### SetWorldIconImage

Sets the image property of a WorldIcon to the selected WorldIconImages.

| Signature |
| --- |
| `(worldIcon: WorldIcon, newImage: Enum_WorldIconImages)` |

##### SetWorldIconOwner

Sets the owner Team of the provided WorldIcon.

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

Displays a provided Message as an error in the Admin menu.

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

Creates a UI Button Widget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, depth: Enum_UIDepth)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, buttonEnabled: Boolean, baseColor: Vector, baseAlpha: Number, disabledColor: Vector, disabledAlpha: Number, pressedColor: Vector, pressedAlpha: Number, hoverColor: Vector, hoverAlpha: Number, focusedColor: Vector, focusedAlpha: Number, depth: Enum_UIDepth, receiver: Player | Team)` |

##### AddUIContainer

Creates a new UI Container Widget.

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

Creates a new UI Image Widget.

| Signature |
| --- |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, imageType: Enum_UIImageType)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, imageType: Enum_UIImageType, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number, receiver: Player | Team)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number, depth: Enum_UIDepth)` |
| `(name: String, position: Vector, size: Vector, anchor: Enum_UIAnchor, parent: UIWidget, visible: Boolean, padding: Number, bgColor: Vector, bgAlpha: Number, bgFill: Enum_UIBgFill, imageType: Enum_UIImageType, imageColor: Vector, imageAlpha: Number, depth: Enum_UIDepth, receiver: Player | Team)` |

##### AddUIText

Creates a new UI Text Widget.

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

Deletes all UI Widgets.

| Signature |
| --- |
| `()` |

##### DeleteUIWidget

Deletes a particular UI Widget.

| Signature |
| --- |
| `(widget: UIWidget)` |

##### EnableUIButtonEvent

Determines if UI Button Widgets can send events.

| Signature |
| --- |
| `(widget: UIWidget, buttonEvent: Enum_UIButtonEvent, enabled: Boolean)` |

##### EnableUIInputMode

Determines if UI Buttons can be interacted with.

| Signature |
| --- |
| `(enabled: Boolean)` |
| `(enabled: Boolean, receiver: Player | Team)` |

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
| `(widget: UIWidget, imageType: Enum_UIImageType)` |

##### SetUITextAlpha

Changes the alpha (transparency) of the text of an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, value: Number)` |

##### SetUITextAnchor

Changes the anchor of the text in an UI Text Widget.

| Signature |
| --- |
| `(widget: UIWidget, anchor: Enum_UIAnchor)` |

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
| `(widget: UIWidget, anchor: Enum_UIAnchor)` |

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
| `(widget: UIWidget, bgFill: Enum_UIBgFill)` |

##### SetUIWidgetDepth

Changes the draw order of an UI Widget.

| Signature |
| --- |
| `(widget: UIWidget, depth: Enum_UIDepth)` |

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

## Control Actions

Control action blocks manage the flow of execution in a rule.

### Break

Breaks and exits the execution of a looping block, such as While or ForVariable.

| Signature |
| --- |
| `()` |

### Continue

Forces the execution of a looping block (such as While or ForVariable) to the start of the next iteration of that block.

| Signature |
| --- |
| `()` |

### ForVariable

The start of a series of Actions that will execute in a loop, modifying the control variable on each iteration. If the control Variable reaches or passes the range end value, the loop exits, and execution continues through the remaining Actions in the Rule.

| Signature |
| --- |
| `(variable: Variable, start: Number, end: Number, stepSize: Number)` |

### If

A special block which evaluates conditions to control the flow of Actions in the If, Else If, and Else branches.

| Signature |
| --- |
| `(condition: Boolean)` |

### While

A block of Actions that will execute in a loop as long as the provided condition is True.
_Note: You must utilize a Wait block at the beginning or the end of the iteration._

| Signature |
| --- |
| `(condition: Boolean)` |

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
