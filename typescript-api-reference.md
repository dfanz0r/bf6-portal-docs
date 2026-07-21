---
outline: [2, 3]
---

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

const apiFilter = ref('')
const categoryNames = ['UI', 'World Icons', 'AI', 'Notifications', 'Scoreboard', 'Messages', 'Players', 'Vehicles', 'Objects & Spatial', 'Objectives & Map Features', 'Spawning', 'Audio & Effects', 'Teams & Squads', 'Game Flow', 'Arrays', 'Variables', 'Input', 'Math & Logic', 'Other']

function isCodeBlock (node) {
  return [...node.classList].some((className) => className.startsWith('language-'))
}

function collectEntryNodes (heading) {
  const nodes = [heading]
  let current = heading.nextElementSibling

  while (current && !['H2', 'H3', 'H4'].includes(current.tagName)) {
    nodes.push(current)
    current = current.nextElementSibling
  }

  return nodes
}

function applyApiFilter () {
  const query = apiFilter.value.trim().toLowerCase()
  const root = document.querySelector('.vp-doc')
  if (!root) return

  const entryHeadings = [...root.querySelectorAll('h4, h3')].filter((heading) => {
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

  const enumDetails = [...root.querySelectorAll('details')].filter((details) => {
    return !details.classList.contains('custom-block')
  })

  for (const details of enumDetails) {
    const text = (details.textContent ?? '').toLowerCase()
    const visible = !query || text.includes(query)
    details.classList.toggle('api-filter-hidden', !visible)
    if (query && visible) details.open = true
  }

  const categoryHeadings = [...root.querySelectorAll('h3')].filter((heading) => {
    return categoryNames.includes(heading.textContent?.trim() ?? '')
  })

  for (const heading of categoryHeadings) {
    const category = heading.closest('details.custom-block.details')
    const searchRoot = category ?? heading.parentElement
    const hasVisibleEntry = !!searchRoot?.querySelector('h4:not(.api-filter-hidden)')

    if (category) {
      category.classList.toggle('api-filter-hidden', query && !hasVisibleEntry)
      heading.classList.toggle('api-filter-hidden', query && !hasVisibleEntry)
      if (query && hasVisibleEntry) category.open = true
    } else {
      const siblingCategory = heading.nextElementSibling?.matches?.('details.custom-block.details') ? heading.nextElementSibling : null
      const siblingHasVisibleEntry = !!siblingCategory?.querySelector('h4:not(.api-filter-hidden)')

      heading.classList.toggle('api-filter-hidden', query && !siblingHasVisibleEntry)
      siblingCategory?.classList.toggle('api-filter-hidden', query && !siblingHasVisibleEntry)
      if (query && siblingHasVisibleEntry) siblingCategory.open = true
    }
  }
}

function closedDetailsHeight (details, summary) {
  const styles = window.getComputedStyle(details)
  return summary.offsetHeight +
    parseFloat(styles.paddingTop) +
    parseFloat(styles.paddingBottom) +
    parseFloat(styles.borderTopWidth) +
    parseFloat(styles.borderBottomWidth)
}

function animateDetailsOpen (details, summary) {
  details.classList.add('api-animating')
  details.open = true

  const startHeight = closedDetailsHeight(details, summary)
  const endHeight = details.scrollHeight

  const animation = details.animate([
    { height: startHeight + 'px' },
    { height: endHeight + 'px' }
  ], {
    duration: 220,
    easing: 'ease'
  })

  animation.onfinish = () => {
    details.classList.remove('api-animating')
    details.style.height = ''
  }
}

function animateDetailsClose (details, summary) {
  details.classList.add('api-animating')

  const startHeight = details.offsetHeight
  const endHeight = closedDetailsHeight(details, summary)

  const animation = details.animate([
    { height: startHeight + 'px' },
    { height: endHeight + 'px' }
  ], {
    duration: 220,
    easing: 'ease'
  })

  animation.onfinish = () => {
    details.open = false
    details.classList.remove('api-animating')
    details.style.height = ''
  }
}

function setupDetailsAnimations () {
  const detailsBlocks = [...document.querySelectorAll('details.custom-block.details')]

  for (const details of detailsBlocks) {
    const summary = details.querySelector('summary')
    if (!summary || details.dataset.animationReady) continue

    details.dataset.animationReady = 'true'
    details.open = true

    summary.addEventListener('click', (event) => {
      event.preventDefault()
      if (details.classList.contains('api-animating')) return

      if (details.open) {
        animateDetailsClose(details, summary)
      } else {
        animateDetailsOpen(details, summary)
      }
    })
  }
}

onMounted(() => nextTick(() => {
  setupDetailsAnimations()
  applyApiFilter()
}))
watch(apiFilter, () => nextTick(applyApiFilter))
</script>

# TypeScript API Reference

SDK version: **1.4.1.0**

This page is generated from the SDK's `code/types/mod/index.d.ts` and `code/modlib/index.ts` files.

<div class="api-filter">
  <label for="api-filter-input">Filter API</label>
  <input id="api-filter-input" v-model="apiFilter" type="search" placeholder="Search functions, types, comments, signatures..." />
</div>

## Summary

| Category | Count |
| --- | ---: |
| event handlers | 74 |
| mod functions | 415 |
| mod function overloads | 549 |
| mod types | 40 |
| mod enums | 75 |
| modlib functions | 31 |
| modlib classes | 2 |

## mod Functions

### UI

::: details Toggle

#### AddUIButton

Creates a UI Button Widget.

```ts
AddUIButton(name: string, position: Vector, size: Vector, anchor: UIAnchor): void
```

```ts
AddUIButton(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  receiver: Player | Team
): void
```

```ts
AddUIButton(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  buttonEnabled: boolean,
  baseColor: Vector,
  baseAlpha: number,
  disabledColor: Vector,
  disabledAlpha: number,
  pressedColor: Vector,
  pressedAlpha: number,
  hoverColor: Vector,
  hoverAlpha: number,
  focusedColor: Vector,
  focusedAlpha: number
): void
```

```ts
AddUIButton(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  buttonEnabled: boolean,
  baseColor: Vector,
  baseAlpha: number,
  disabledColor: Vector,
  disabledAlpha: number,
  pressedColor: Vector,
  pressedAlpha: number,
  hoverColor: Vector,
  hoverAlpha: number,
  focusedColor: Vector,
  focusedAlpha: number,
  receiver: Player | Team
): void
```

```ts
AddUIButton(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  buttonEnabled: boolean,
  baseColor: Vector,
  baseAlpha: number,
  disabledColor: Vector,
  disabledAlpha: number,
  pressedColor: Vector,
  pressedAlpha: number,
  hoverColor: Vector,
  hoverAlpha: number,
  focusedColor: Vector,
  focusedAlpha: number,
  depth: UIDepth
): void
```

```ts
AddUIButton(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  buttonEnabled: boolean,
  baseColor: Vector,
  baseAlpha: number,
  disabledColor: Vector,
  disabledAlpha: number,
  pressedColor: Vector,
  pressedAlpha: number,
  hoverColor: Vector,
  hoverAlpha: number,
  focusedColor: Vector,
  focusedAlpha: number,
  depth: UIDepth,
  receiver: Player | Team
): void
```

#### AddUIContainer

Creates a new UI Container Widget.

```ts
AddUIContainer(name: string, position: Vector, size: Vector, anchor: UIAnchor): void
```

```ts
AddUIContainer(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  receiver: Player | Team
): void
```

```ts
AddUIContainer(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill
): void
```

```ts
AddUIContainer(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  receiver: Player | Team
): void
```

```ts
AddUIContainer(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  depth: UIDepth
): void
```

```ts
AddUIContainer(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  depth: UIDepth,
  receiver: Player | Team
): void
```

#### AddUIGadgetImage

Creates a new UI Image Widget based on a Gadget.

```ts
AddUIGadgetImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  gadget: Gadgets,
  parent: UIWidget
): void
```

```ts
AddUIGadgetImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  gadget: Gadgets,
  parent: UIWidget,
  visibility: Player | Team
): void
```

#### AddUIIcon

Attaches a new UI Icon Widget to an object.

```ts
AddUIIcon(
  parentObject: mod.Object,
  image: WorldIconImages,
  verticalOffset: number,
  iconColour: Vector,
  iconText: Message,
  visibility: Player | Team
): void
```

```ts
AddUIIcon(
  parentObject: mod.Object,
  image: WorldIconImages,
  verticalOffset: number,
  iconColour: Vector,
  iconText: Message
): void
```

#### AddUIImage

Creates a new UI Image Widget.

```ts
AddUIImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  imageType: UIImageType
): void
```

```ts
AddUIImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  imageType: UIImageType,
  receiver: Player | Team
): void
```

```ts
AddUIImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  imageType: UIImageType,
  imageColor: Vector,
  imageAlpha: number
): void
```

```ts
AddUIImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  imageType: UIImageType,
  imageColor: Vector,
  imageAlpha: number,
  receiver: Player | Team
): void
```

```ts
AddUIImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  imageType: UIImageType,
  imageColor: Vector,
  imageAlpha: number,
  depth: UIDepth
): void
```

```ts
AddUIImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  imageType: UIImageType,
  imageColor: Vector,
  imageAlpha: number,
  depth: UIDepth,
  receiver: Player | Team
): void
```

#### AddUIText

Creates a new UI Text Widget.

```ts
AddUIText(name: string, position: Vector, size: Vector, anchor: UIAnchor, message: Message): void
```

```ts
AddUIText(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  message: Message,
  receiver: Player | Team
): void
```

```ts
AddUIText(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  message: Message,
  textSize: number,
  textColor: Vector,
  textAlpha: number,
  textAnchor: UIAnchor
): void
```

```ts
AddUIText(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  message: Message,
  textSize: number,
  textColor: Vector,
  textAlpha: number,
  textAnchor: UIAnchor,
  receiver: Player | Team
): void
```

```ts
AddUIText(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  message: Message,
  textSize: number,
  textColor: Vector,
  textAlpha: number,
  textAnchor: UIAnchor,
  depth: UIDepth
): void
```

```ts
AddUIText(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  parent: UIWidget,
  visible: boolean,
  padding: number,
  bgColor: Vector,
  bgAlpha: number,
  bgFill: UIBgFill,
  message: Message,
  textSize: number,
  textColor: Vector,
  textAlpha: number,
  textAnchor: UIAnchor,
  depth: UIDepth,
  receiver: Player | Team
): void
```

#### AddUIWeaponImage

Creates a new UI Image Widget based on a Weapon and loadout.

```ts
AddUIWeaponImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  weapon: Weapons,
  parent: UIWidget
): void
```

```ts
AddUIWeaponImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  weapon: Weapons,
  parent: UIWidget,
  weaponPackage: WeaponPackage
): void
```

```ts
AddUIWeaponImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  weapon: Weapons,
  parent: UIWidget,
  visibility: Player | Team
): void
```

```ts
AddUIWeaponImage(
  name: string,
  position: Vector,
  size: Vector,
  anchor: UIAnchor,
  weapon: Weapons,
  parent: UIWidget,
  weaponPackage: WeaponPackage,
  visibility: Player | Team
): void
```

#### DeleteAllUIWidgets

Deletes all UI Widgets.

```ts
DeleteAllUIWidgets(): void
```

#### DeleteUIWidget

Deletes a particular UI Widget.

```ts
DeleteUIWidget(widget: UIWidget): void
```

#### EnableUIButtonEvent

Determines if UI Button Widgets can send events.

```ts
EnableUIButtonEvent(widget: UIWidget, buttonEvent: UIButtonEvent, enabled: boolean): void
```

#### EnableUIInputMode

Determines if UI Buttons can be interacted with.

```ts
EnableUIInputMode(enabled: boolean): void
```

```ts
EnableUIInputMode(enabled: boolean, receiver: Player | Team): void
```

#### FindUIWidgetWithName

Returns the UI Widget matching the specified name.

```ts
FindUIWidgetWithName(name: string, searchRoot: UIWidget): UIWidget
```

```ts
FindUIWidgetWithName(name: string): Any
```

#### GetUIButtonAlphaBase

Returns a number representing the button base alpha of the specified UI Widget.

```ts
GetUIButtonAlphaBase(widget: UIWidget): number
```

#### GetUIButtonAlphaDisabled

Returns a number representing the button disabled alpha of the specified UI Widget.

```ts
GetUIButtonAlphaDisabled(widget: UIWidget): number
```

#### GetUIButtonAlphaFocused

Returns a number representing the button focused alpha of the specified UI Widget.

```ts
GetUIButtonAlphaFocused(widget: UIWidget): number
```

#### GetUIButtonAlphaHover

Returns a number representing the button hover alpha of the specified UI Widget.

```ts
GetUIButtonAlphaHover(widget: UIWidget): number
```

#### GetUIButtonAlphaPressed

Returns a number representing the button pressed alpha of the specified UI Widget.

```ts
GetUIButtonAlphaPressed(widget: UIWidget): number
```

#### GetUIButtonColorBase

Returns a vector representing the button base color of the specified UI Widget.

```ts
GetUIButtonColorBase(widget: UIWidget): Vector
```

#### GetUIButtonColorDisabled

Returns a vector representing the button disabled color of the specified UI Widget.

```ts
GetUIButtonColorDisabled(widget: UIWidget): Vector
```

#### GetUIButtonColorFocused

Returns a vector representing the button focused color of the specified UI Widget.

```ts
GetUIButtonColorFocused(widget: UIWidget): Vector
```

#### GetUIButtonColorHover

Returns a vector representing the button hover color of the specified UI Widget.

```ts
GetUIButtonColorHover(widget: UIWidget): Vector
```

#### GetUIButtonColorPressed

Returns a vector representing the button pressed color of the specified UI Widget.

```ts
GetUIButtonColorPressed(widget: UIWidget): Vector
```

#### GetUIButtonEnabled

Returns a boolean indicating the button enabled status of the specified UI Widget.

```ts
GetUIButtonEnabled(widget: UIWidget): boolean
```

#### GetUIImageAlpha

Returns a number representing the image alpha of the specified UI Widget.

```ts
GetUIImageAlpha(widget: UIWidget): number
```

#### GetUIImageColor

Returns a vector representing the image color of the specified UI Widget.

```ts
GetUIImageColor(widget: UIWidget): Vector
```

#### GetUIImageType

Returns an enum value representing the image type of the specified UI Widget.

```ts
GetUIImageType(widget: UIWidget): UIImageType
```

#### GetUIRoot

Returns the UI Root as a UI Widget.

```ts
GetUIRoot(): UIWidget
```

#### GetUITextAlpha

Returns a number representing the text alpha of the specified UI Widget.

```ts
GetUITextAlpha(widget: UIWidget): number
```

#### GetUITextAnchor

Returns an enum value representing the text anchor of the specified UI Widget.

```ts
GetUITextAnchor(widget: UIWidget): UIAnchor
```

#### GetUITextColor

Returns a vector representing the text color of the specified UI Widget.

```ts
GetUITextColor(widget: UIWidget): Vector
```

#### GetUITextSize

Returns a number representing the text size of the specified UI Widget.

```ts
GetUITextSize(widget: UIWidget): number
```

#### GetUIWidgetAnchor

Returns an enum value representing the anchor location of the specified UI Widget.

```ts
GetUIWidgetAnchor(widget: UIWidget): UIAnchor
```

#### GetUIWidgetBgAlpha

Returns the background alpha value of the specified UI Widget.

```ts
GetUIWidgetBgAlpha(widget: UIWidget): number
```

#### GetUIWidgetBgColor

Returns the background color vector of the specified UI Widget.

```ts
GetUIWidgetBgColor(widget: UIWidget): Vector
```

#### GetUIWidgetBgFill

Returns an enum value representing the background fill of the specified UI Widget.

```ts
GetUIWidgetBgFill(widget: UIWidget): UIBgFill
```

#### GetUIWidgetDepth

Returns an enum value representing the depth of the specified UI Widget.

```ts
GetUIWidgetDepth(widget: UIWidget): UIDepth
```

#### GetUIWidgetName

Returns a string containing the name of the specified UI Widget.

```ts
GetUIWidgetName(widget: UIWidget): string
```

#### GetUIWidgetPadding

Returns a number representing the padding value of the specified UI Widget.

```ts
GetUIWidgetPadding(widget: UIWidget): number
```

#### GetUIWidgetParent

Returns the Parent UI Widget of the specified UI Widget.

```ts
GetUIWidgetParent(widget: UIWidget): UIWidget
```

#### GetUIWidgetPosition

Returns the positional vector of the specified UI Widget.

```ts
GetUIWidgetPosition(widget: UIWidget): Vector
```

#### GetUIWidgetSize

Returns the scale vector of the specified UI Widget.

```ts
GetUIWidgetSize(widget: UIWidget): Vector
```

#### GetUIWidgetVisible

Returns a boolean representing the visible state of the specified UI Widget.

```ts
GetUIWidgetVisible(widget: UIWidget): boolean
```

#### HasUIWidgetWithName

Returns a boolean indicating if the UI Widget exists.

```ts
HasUIWidgetWithName(name: string, searchRoot: UIWidget): boolean
```

#### RemoveUIIcon

Removes a UI Icon Widget from an object.

```ts
RemoveUIIcon(objectWithIcon: mod.Object): void
```

```ts
RemoveUIIcon(objectWithIcon: mod.Object, visibility: Player | Team): void
```

#### SetUIButtonAlphaBase

Changes the base alpha (transparency) of an UI Button Widget.

```ts
SetUIButtonAlphaBase(widget: UIWidget, value: number): void
```

#### SetUIButtonAlphaDisabled

Changes the alpha (transparency) of an UI Button Widget when it is disabled.

```ts
SetUIButtonAlphaDisabled(widget: UIWidget, value: number): void
```

#### SetUIButtonAlphaFocused

Changes the alpha (transparency) of an UI Button Widget when it is focused.

```ts
SetUIButtonAlphaFocused(widget: UIWidget, value: number): void
```

#### SetUIButtonAlphaHover

Changes the alpha (transparency) of an UI Button Widget when it is hovered.

```ts
SetUIButtonAlphaHover(widget: UIWidget, value: number): void
```

#### SetUIButtonAlphaPressed

Changes the alpha (transparency) of an UI Button Widget when it is pressed.

```ts
SetUIButtonAlphaPressed(widget: UIWidget, value: number): void
```

#### SetUIButtonColorBase

Changes the base color of an UI Button Widget.

```ts
SetUIButtonColorBase(widget: UIWidget, value: Vector): void
```

#### SetUIButtonColorDisabled

Changes the color of an UI Button Widget when it is disabled.

```ts
SetUIButtonColorDisabled(widget: UIWidget, value: Vector): void
```

#### SetUIButtonColorFocused

Changes the color of an UI Button Widget when it is focused.

```ts
SetUIButtonColorFocused(widget: UIWidget, value: Vector): void
```

#### SetUIButtonColorHover

Changes the color of an UI Button Widget when it is hovered.

```ts
SetUIButtonColorHover(widget: UIWidget, value: Vector): void
```

#### SetUIButtonColorPressed

Changes the color of an UI Button Widget when it is pressed.

```ts
SetUIButtonColorPressed(widget: UIWidget, value: Vector): void
```

#### SetUIButtonEnabled

Determines if a specific UI Button Widget is enabled.

```ts
SetUIButtonEnabled(widget: UIWidget, enabled: boolean): void
```

#### SetUIImageAlpha

Changes the alpha (transparency) of the image of an UI Image Widget.

```ts
SetUIImageAlpha(widget: UIWidget, value: number): void
```

#### SetUIImageColor

Changes the color of the image of an UI Image Widget.

```ts
SetUIImageColor(widget: UIWidget, value: Vector): void
```

#### SetUIImageType

Changes the image of an UI Image Widget.

```ts
SetUIImageType(widget: UIWidget, imageType: UIImageType): void
```

#### SetUITextAlpha

Changes the alpha (transparency) of the text of an UI Text Widget.

```ts
SetUITextAlpha(widget: UIWidget, value: number): void
```

#### SetUITextAnchor

Changes the anchor of the text in an UI Text Widget.

```ts
SetUITextAnchor(widget: UIWidget, anchor: UIAnchor): void
```

#### SetUITextColor

Changes the font color of an UI Text Widget.

```ts
SetUITextColor(widget: UIWidget, value: Vector): void
```

#### SetUITextLabel

Changes the message displayed by an UI Text Widget.

```ts
SetUITextLabel(widget: UIWidget, message: Message): void
```

#### SetUITextSize

Changes the font size of an UI Text Widget.

```ts
SetUITextSize(widget: UIWidget, value: number): void
```

#### SetUIWidgetAnchor

Changes the anchor of an UI Widget.

```ts
SetUIWidgetAnchor(widget: UIWidget, anchor: UIAnchor): void
```

#### SetUIWidgetBgAlpha

Changes the alpha (transparency) of an UI Widget.

```ts
SetUIWidgetBgAlpha(widget: UIWidget, value: number): void
```

#### SetUIWidgetBgColor

Changes the background color of an UI Widget.

```ts
SetUIWidgetBgColor(widget: UIWidget, value: Vector): void
```

#### SetUIWidgetBgFill

Changes the way the UI Widget's background is rendered.

```ts
SetUIWidgetBgFill(widget: UIWidget, bgFill: UIBgFill): void
```

#### SetUIWidgetDepth

Changes the draw order of an UI Widget.

```ts
SetUIWidgetDepth(widget: UIWidget, depth: UIDepth): void
```

#### SetUIWidgetName

Changes the name of an UI Widget.

```ts
SetUIWidgetName(widget: UIWidget, name: string): void
```

#### SetUIWidgetPadding

Changes the padding of an UI Widget.

```ts
SetUIWidgetPadding(widget: UIWidget, value: number): void
```

#### SetUIWidgetParent

Changes the parent of an UI Widget.

```ts
SetUIWidgetParent(widget: UIWidget, parent: UIWidget): void
```

#### SetUIWidgetPosition

Changes the position of an UI Widget.

```ts
SetUIWidgetPosition(widget: UIWidget, value: Vector): void
```

#### SetUIWidgetSize

Changes the size of an UI Widget.

```ts
SetUIWidgetSize(widget: UIWidget, value: Vector): void
```

#### SetUIWidgetVisible

Determines if an UI Widget is visible or not.

```ts
SetUIWidgetVisible(widget: UIWidget, visible: boolean): void
```

:::

### World Icons

::: details Toggle

#### EnableWorldIconImage

Enables or disables showing the image of a world icon.

```ts
EnableWorldIconImage(worldIcon: WorldIcon, enableImage: boolean): void
```

#### EnableWorldIconText

Enables or disables showing the text appearing above a world icon.

```ts
EnableWorldIconText(worldIcon: WorldIcon, enableText: boolean): void
```

#### GetWorldIcon

Returns the WorldIcon corresponding to the provided id.

```ts
GetWorldIcon(objId: number): WorldIcon
```

#### MoveObject

Move the Object provided, Euler rotation optional

```ts
MoveObject(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  positionDelta: Vector
): void
```

```ts
MoveObject(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  positionDelta: Vector,
  rotationDelta: Vector
): void
```

#### RotateObject

Rotate the Object provided using Euler angles

```ts
RotateObject(
  arg0: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  rotationDelta: Vector
): void
```

#### SetBombWorldIconGlobalVisibility

Sets the world Icon global visibility, if set to enabled all teams can see the bomb carrier Icon, if set to disabled only the attacking team can.

```ts
SetBombWorldIconGlobalVisibility(bomb: Bomb, Enabled: boolean): void
```

#### SetObjectTransform

Sets the transform of the Object provided

```ts
SetObjectTransform(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  transform: Transform
): void
```

#### SetObjectTransformOverTime

Sets the transform of the Object provided over the time provided. Options to loop indefinitely and reverse

```ts
SetObjectTransformOverTime(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  transform: Transform,
  timeInSeconds: number,
  shouldLoop: boolean,
  shouldReverse: boolean
): void
```

#### SetWorldIconColor

Changes the color of a world icon.

```ts
SetWorldIconColor(worldIcon: WorldIcon, newColor: Vector): void
```

#### SetWorldIconImage

Changes the image of a world icon.

```ts
SetWorldIconImage(worldIcon: WorldIcon, newImage: WorldIconImages): void
```

#### SetWorldIconOwner

Restricts a world icon to be visible only to a specific Player or Team.

```ts
SetWorldIconOwner(worldIcon: WorldIcon, newTeamOwner: Team): void
```

```ts
SetWorldIconOwner(worldIcon: WorldIcon, newPlayerOwner: Player): void
```

#### SetWorldIconPosition

@deprecated The method should not be used

```ts
SetWorldIconPosition(worldIcon: WorldIcon, newPosition: Vector): void
```

#### SetWorldIconText

Changes the text appearing above a world icon.

```ts
SetWorldIconText(worldIcon: WorldIcon, newText: Message): void
```

#### StopActiveMovementForObject

Stops the Over Time movement for the provided Object if one is active

```ts
StopActiveMovementForObject( object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon ): void
```

:::

### AI

::: details Toggle

#### AIBattlefieldBehavior

Sets a player to act independently. They will attempt to complete objectives, fire on enemy players, etc. (Only works for AI players)

```ts
AIBattlefieldBehavior(player: Player): void
```

#### AIDefendPositionBehavior

Sets a player to defend an area around a location. (Only works for AI players)

```ts
AIDefendPositionBehavior(
  player: Player,
  defendPosition: Vector,
  minDistance: number,
  maxDistance: number
): void
```

#### AIEnableShooting

Enables or disables shooting for AI. (Only works for AI players)

```ts
AIEnableShooting(player: Player): void
```

```ts
AIEnableShooting(player: Player, enable: boolean): void
```

#### AIEnableTargeting

Enables or disables targeting for AI. An AI unable to target cannot shoot, but will also not notice other soldiers (Only works for AI players)

```ts
AIEnableTargeting(player: Player): void
```

```ts
AIEnableTargeting(player: Player, enable: boolean): void
```

#### AIForceFire

Forces an AI player to fire or activate whatever weapon or gadget they are holding in their hands for a length of time.

```ts
AIForceFire(player: Player, fireDuration: number): void
```

#### AIGadgetSettings

Tweak settings for a player's gadgets. (Only works for AI players)

```ts
AIGadgetSettings(
  player: Player,
  applyUsageCriteria: boolean,
  applyCoolDownAfterUse: boolean,
  applyInaccuracy: boolean
): void
```

#### AIIdleBehavior

Sets a player's current position as idle point. (Only works for AI players)

```ts
AIIdleBehavior(player: Player): void
```

#### AILOSMoveToBehavior

Sets a player to move to a location with a line of sight to a specific position. (Only works for AI players)

```ts
AILOSMoveToBehavior(player: Player, position: Vector): void
```

#### AIMoveToBehavior

Sets a player a destination to move to. (Only works for AI players)

```ts
AIMoveToBehavior(player: Player, position: Vector): void
```

#### AIParachuteBehavior

Sets a player to use parachute. (Only works for AI players)

```ts
AIParachuteBehavior(player: Player): void
```

#### AISetFocusPoint

Sets a player's focus point, possibly asking it to fire at it. (Only works for AI players)

```ts
AISetFocusPoint(player: Player, point: Vector, isTarget: boolean): void
```

#### AISetMoveSpeed

Sets a player's move speed for MoveTo Behaviors. (Only works for AI players)

```ts
AISetMoveSpeed(player: Player, moveSpeed: MoveSpeed): void
```

#### AISetStance

Sets a player's stance. (Only works for AI players)

```ts
AISetStance(player: Player, stance: Stance): void
```

#### AISetTarget

Sets player's current target. (Only works for AI players)

```ts
AISetTarget(aiPlayer: Player, targetPlayer: Player): void
```

```ts
AISetTarget(player: Player): void
```

#### AISetUnspawnOnDead

Use this on a spawner to determine if AI soldiers spawned will leave the game after they are killed.

```ts
AISetUnspawnOnDead(spawner: Spawner, enableUnspawnOnDead: boolean): void
```

#### AIStartUsingGadget

Gives a player the instruction to use a specific gadget on a target location or player. (Only works for AI players)

```ts
AIStartUsingGadget(player: Player, gadget: Gadgets, targetPos: Vector): void
```

```ts
AIStartUsingGadget(player: Player, gadget: Gadgets, targetPlayer: Player): void
```

#### AIStopUsingGadget

Clears the player's gadget instructions. (Only works for AI players)

```ts
AIStopUsingGadget(player: Player): void
```

#### AIValidatedMoveToBehavior

Sets a player to move to a valid position on navmesh near a location. (Only works for AI players)

```ts
AIValidatedMoveToBehavior(player: Player, position: Vector): void
```

#### AIWaypointIdleBehavior

Sets a player to patrol a waypoint. (Only works for AI players)

```ts
AIWaypointIdleBehavior(player: Player, waypointPath: WaypointPath): void
```

#### SetAiInput

Trigger AI bots input for the duration. Up to 3 simultaneous inputs (3 channels)

```ts
SetAiInput(player: Player, input: AiInput, duration: number): void
```

#### SetAIToHumanDamageModifier

Sets the damage multiplier from AI players to actualy players.

```ts
SetAIToHumanDamageModifier(damageMultiplier: number): void
```

#### SpawnAIFromAISpawner

Spawn one AI soldier from a specific AI Spawner.

```ts
SpawnAIFromAISpawner(spawner: Spawner): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, classToSpawn: SoldierClass, name: Message): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, classToSpawn: SoldierClass): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, name: Message): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, team: Team): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, classToSpawn: SoldierClass, name: Message, team: Team): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, classToSpawn: SoldierClass, team: Team): void
```

```ts
SpawnAIFromAISpawner(spawner: Spawner, name: Message, team: Team): void
```

#### UnspawnAllAIsFromAISpawner

Unspawns all AIs who were spawned by a specific AI Spawner.

```ts
UnspawnAllAIsFromAISpawner(spawner: Spawner): void
```

:::

### Notifications

::: details Toggle

#### ClearAllCustomNotificationMessages

Clears all custom notification slots for the given player.

```ts
ClearAllCustomNotificationMessages(target: Player): void
```

#### ClearCustomNotificationMessage

Clears the custom notification slot associated with the given slots for the specified team or player.

```ts
ClearCustomNotificationMessage(slot: CustomNotificationSlots): void
```

```ts
ClearCustomNotificationMessage(slot: CustomNotificationSlots, target: Player): void
```

```ts
ClearCustomNotificationMessage(slot: CustomNotificationSlots, target: Team): void
```

#### DisplayCustomNotificationMessage

Display a custom notification in one of the slots for the specified team or player.

```ts
DisplayCustomNotificationMessage(
  msg: Message,
  slot: CustomNotificationSlots,
  duration: number
): void
```

```ts
DisplayCustomNotificationMessage(
  msg: Message,
  slot: CustomNotificationSlots,
  duration: number,
  target: Player
): void
```

```ts
DisplayCustomNotificationMessage(
  msg: Message,
  slot: CustomNotificationSlots,
  duration: number,
  target: Team
): void
```

#### DisplayNotificationMessage

Displays a notification-type Message on the top-right of the screen for 6 seconds.

```ts
DisplayNotificationMessage(message: Message): void
```

```ts
DisplayNotificationMessage(message: Message, player: Player): void
```

```ts
DisplayNotificationMessage(message: Message, team: Team): void
```

:::

### Scoreboard

::: details Toggle

#### SetScoreboardColumnNames

Sets the name displayed at the top of score of each column. Only works for custom scoreboards.

```ts
SetScoreboardColumnNames(
  column1Name: Message,
  column2Name: Message,
  column3Name: Message,
  column4Name: Message,
  column5Name: Message
): void
```

```ts
SetScoreboardColumnNames(
  column1Name: Message,
  column2Name: Message,
  column3Name: Message,
  column4Name: Message
): void
```

```ts
SetScoreboardColumnNames(column1Name: Message, column2Name: Message, column3Name: Message): void
```

```ts
SetScoreboardColumnNames(column1Name: Message, column2Name: Message): void
```

```ts
SetScoreboardColumnNames(column1Name: Message): void
```

#### SetScoreboardColumnWidths

Sets the relative width of each column. Only works for custom scoreboards.

```ts
SetScoreboardColumnWidths(
  column1Width: number,
  column2Width: number,
  column3Width: number,
  column4Width: number,
  column5Width: number
): void
```

```ts
SetScoreboardColumnWidths(
  column1Width: number,
  column2Width: number,
  column3Width: number,
  column4Width: number
): void
```

```ts
SetScoreboardColumnWidths(column1Width: number, column2Width: number, column3Width: number): void
```

```ts
SetScoreboardColumnWidths(column1Width: number, column2Width: number): void
```

```ts
SetScoreboardColumnWidths(column1Width: number): void
```

#### SetScoreboardHeader

Sets the name that appears in the top-left corner of the scoreboard

```ts
SetScoreboardHeader(team1Name: Message, team2Name: Message): void
```

```ts
SetScoreboardHeader(headerName: Message): void
```

#### SetScoreboardPlayerValues

Sets the score in up to five distinct scores for the player. Only works for custom scoreboards.

```ts
SetScoreboardPlayerValues(
  player: Player,
  column1Value: number,
  column2Value: number,
  column3Value: number,
  column4Value: number,
  column5Value: number
): void
```

```ts
SetScoreboardPlayerValues(
  player: Player,
  column1Value: number,
  column2Value: number,
  column3Value: number,
  column4Value: number
): void
```

```ts
SetScoreboardPlayerValues(
  player: Player,
  column1Value: number,
  column2Value: number,
  column3Value: number
): void
```

```ts
SetScoreboardPlayerValues(player: Player, column1Value: number, column2Value: number): void
```

```ts
SetScoreboardPlayerValues(player: Player, column1Value: number): void
```

#### SetScoreboardSorting

Sets which column the scoreboard is sorted on. Only works for custom scoreboards.

```ts
SetScoreboardSorting(sortingColumn: number, reverseSorting: boolean): void
```

```ts
SetScoreboardSorting(sortingColumn: number): void
```

#### SetScoreboardType

Allows you to change the type of Scoreboard you want.

```ts
SetScoreboardType(scoreboardType: ScoreboardType): void
```

:::

### Messages

::: details Toggle

#### DisplayHighlightedWorldLogMessage

Displays a message on the world log above the minimap for 6 seconds. If no target is provided, it will display the message to everyone.

```ts
DisplayHighlightedWorldLogMessage(message: Message): void
```

```ts
DisplayHighlightedWorldLogMessage(message: Message, player: Player): void
```

```ts
DisplayHighlightedWorldLogMessage(message: Message, team: Team): void
```

#### Message

Returns a constructed message object which can be used with event game mode message, notification message, highlighted game mode message, and custom notification message. The message object is created by providing a number, player, or format string (which can take up to 3 format items).

```ts
Message(
  msg: string | number | Player,
  msgArg0: string | number | Player,
  msgArg1: string | number | Player,
  msgArg2: string | number | Player
): Message
```

```ts
Message(
  msg: string | number | Player,
  msgArg0: string | number | Player,
  msgArg1: string | number | Player
): Message
```

```ts
Message(msg: string | number | Player, msgArg0: string | number | Player): Message
```

```ts
Message(msg: string | number | Player): Message
```

#### SendErrorReport

Displays a provided message as an error in the Admin menu.

```ts
SendErrorReport(message: Message): void
```

:::

### Players

::: details Toggle

#### AddAttachmentToWeaponPackage

Adds an Attachment to a Weapon Package created through CreateWeaponPackage. Will replace existing Attachments of the same type

```ts
AddAttachmentToWeaponPackage(attachment: WeaponAttachments, weaponPackage: WeaponPackage): void
```

#### AddEquipment

Adds a Weapon or Gadget to a Soldier's loadout.

```ts
AddEquipment(player: Player, weapon: Weapons): void
```

```ts
AddEquipment(player: Player, gadget: Gadgets): void
```

```ts
AddEquipment(player: Player, weapon: Weapons, weaponPackage: WeaponPackage): void
```

```ts
AddEquipment(player: Player, arg1: Weapons, desiredInventorySlot: InventorySlots): void
```

```ts
AddEquipment(player: Player, gadget: Gadgets, desiredInventorySlot: InventorySlots): void
```

```ts
AddEquipment(
  player: Player,
  weapon: Weapons,
  weaponPackage: WeaponPackage,
  desiredInventorySlots: InventorySlots
): void
```

```ts
AddEquipment(player: Player, armor: ArmorTypes): void
```

#### AllPlayers

Returns an array of all players within a game.

```ts
AllPlayers(): Array
```

#### ClosestPlayerTo

Returns the closest alive player to a provided position. Can be filtered using a team. Note: If no players are alive when this block is called, the returned player will be invalid.

```ts
ClosestPlayerTo(vector: Vector): Player
```

#### CreateNewWeaponPackage

Creates and returns a new weapon package.

```ts
CreateNewWeaponPackage(): WeaponPackage
```

#### DealDamage

Deals a provided amount of damage to a target player. Can optionally specify damage giver..

```ts
DealDamage(player: Player, damageAmount: number): void
```

```ts
DealDamage(player: Player, damageAmount: number, damageGiver: Player): void
```

#### DeployAllPlayers

Force spawns all players in the deploy screen.

```ts
DeployAllPlayers(): void
```

#### DeployPlayer

Force a specific to deploy.

```ts
DeployPlayer(player: Player): void
```

#### DisablePlayerJoin

Using this command prevents anyone from joining this server. There is no way to undo this at the time.

```ts
DisablePlayerJoin(): void
```

#### EnableAllInputRestrictions

Enables or disables all keyboard and mouse inputs - such as movement, firing, and turning - for a target player.

```ts
EnableAllInputRestrictions(player: Player, restrictInput: boolean): void
```

#### EnableAllPlayerDeploy

Enables or disables spawning from the deploy screen for all players.

```ts
EnableAllPlayerDeploy(enablePlayerDeploy: boolean): void
```

#### EnableInputRestriction

Enables or disables a specified Input on a target player.

```ts
EnableInputRestriction(
  player: Player,
  inputRestriction: RestrictedInputs,
  restrictInput: boolean
): void
```

#### EnablePlayerDeploy

Enables or disables the ability for a target player to deploy.

```ts
EnablePlayerDeploy(player: Player, deployAllowed: boolean): void
```

#### EndGameMode

Ends the current gamemode and designates the provided Player or Team as the winner. The gamemode ends in draw if Team is set to 0.

```ts
EndGameMode(player: Player): void
```

#### EventDamageTypeCompare

Returns a boolean indicating if the victim was damaged by the provided damage type.

```ts
EventDamageTypeCompare(damageType: DamageType, playerDamageTypes: PlayerDamageTypes): boolean
```

#### EventDeathTypeCompare

Returns a boolean indicating if the victim died by the provided death type.

```ts
EventDeathTypeCompare(deathType: DeathType, playerDeathTypes: PlayerDeathTypes): boolean
```

#### EventWeaponCompare

Returns a boolean indicating if the given weapon unlock is equivalent to the provided ability.

```ts
EventWeaponCompare(eventWeapon: WeaponUnlock, weapon: Weapons): boolean
```

```ts
EventWeaponCompare(eventWeapon: WeaponUnlock, gadget: Gadgets): boolean
```

#### FarthestPlayerFrom

Returns the farthest alive player from a provided position. Can be filtered using a team. Note: If no players are alive when this block is called, the returned player will be invalid.

```ts
FarthestPlayerFrom(vector: Vector): Player
```

```ts
FarthestPlayerFrom(vector: Vector, team: Team): Player
```

#### ForceManDown

Puts the target player into the mandown state (unless mandown is disabled).

```ts
ForceManDown(player: Player): void
```

#### ForceRevive

Revives a target player who is in the mandown state.

```ts
ForceRevive(player: Player): void
```

#### ForceSwitchInventory

Forces the target player to switch to the provided inventory slot.

```ts
ForceSwitchInventory(player: Player, inventorySlot: InventorySlots): void
```

#### GetGameModeScore

Returns the current gamemode score of the provided player or team.

```ts
GetGameModeScore(player: Player): number
```

#### GetInventoryAmmo

Returns the target player loaded ammo of the provided inventory slots.

```ts
GetInventoryAmmo(player: Player, inventorySlots: InventorySlots): number
```

#### GetInventoryMagazineAmmo

Returns the target player magazine ammo of the provided inventory slots.

```ts
GetInventoryMagazineAmmo(player: Player, inventorySlots: InventorySlots): number
```

#### GetPlayer

Returns the Player corresponding to the provided id.

```ts
GetPlayer(objId: number): Player
```

#### GetPlayerDeaths

Returns the total amount of deaths for the target player.

```ts
GetPlayerDeaths(player: Player): number
```

#### GetPlayerKills

Returns the total amount of kills for the target player.

```ts
GetPlayerKills(player: Player): number
```

#### GetPlayerVehicleSeat

Returns the seat index number for the target player if they are in a vehicle.

```ts
GetPlayerVehicleSeat(player: Player): number
```

#### GetSoldierState

Returns the value of the target player state.

```ts
GetSoldierState(player: Player, soldierStateNumber: SoldierStateNumber): number
```

```ts
GetSoldierState(player: Player, soldierStateBool: SoldierStateBool): boolean
```

```ts
GetSoldierState(player: Player, soldierStateVector: SoldierStateVector): Vector
```

#### GetVehicleFromPlayer

Returns the vehicle used by a player.

```ts
GetVehicleFromPlayer(player: Player): Vehicle
```

#### GiveBombToPlayer

Gives the Bomb to the chosen Player.

```ts
GiveBombToPlayer(player: Player, bomb: Bomb): void
```

#### HasEquipment

Returns a boolean indicating if the provided player has the specified ability.

```ts
HasEquipment(player: Player, weapon: Weapons): boolean
```

```ts
HasEquipment(player: Player, gadget: Gadgets): boolean
```

#### Heal

Instantly adds a given amount of health to the target player. Can optionally specify healing player.

```ts
Heal(player: Player, healAmount: number): void
```

```ts
Heal(player: Player, healAmount: number, giver: Player): void
```

#### IsInventorySlotActive

Returns true whether or not the active inventory slot of the target player is the provided inventory slots.

```ts
IsInventorySlotActive(player: Player, inventorySlots: InventorySlots): boolean
```

#### IsPlayerValid

Returns true if the provided player is valid.

```ts
IsPlayerValid(player: Player): boolean
```

#### IsSoldierClass

Returns true if the provided player is using the specified class.

```ts
IsSoldierClass(player: Player, soldierClass: SoldierClass): boolean
```

#### IsSquadLeader

Returns a boolean checking to see if provided player is the leader of their squad.

```ts
IsSquadLeader(player: Player): boolean
```

#### Kill

Kills a target player (skips the Mandown state).

```ts
Kill(player: Player): void
```

#### LocalPositionOf

Converts the provided world position to the corresponding position in local player space.

```ts
LocalPositionOf(vector: Vector, player: Player): Vector
```

#### LocalVectorOf

Converts the provided world vector to the corresponding vector in local player space.

```ts
LocalVectorOf(vector: Vector, player: Player): Vector
```

#### RayCast

Request the system to evaluate if a straight line between two points is interupted or not. Use OnRayCastHit and OnRayCastMissed to read the result.

```ts
RayCast(player: Player, start: Vector, stop: Vector): void
```

#### RemoveEquipment

Removes a Weapon or Gadget from a Soldier's loadout.

```ts
RemoveEquipment(player: Player, inventorySlot: InventorySlots): void
```

```ts
RemoveEquipment(arg0: Player, weapon: Weapons): void
```

```ts
RemoveEquipment(arg0: Player, gadget: Gadgets): void
```

#### Resupply

Resupplies the target player using a provided ResupplyType.

```ts
Resupply(player: Player, ressuplyType: ResupplyTypes): void
```

#### SetCameraTypeForAll

Sets CameraType for all players. CameraIndex optional.

```ts
SetCameraTypeForAll(cameraType: Cameras): void
```

```ts
SetCameraTypeForAll(cameraType: Cameras, cameraIndex: number): void
```

#### SetCameraTypeForPlayer

Sets CameraType for provided Player. CameraIndex optional.

```ts
SetCameraTypeForPlayer(player: Player, cameraType: Cameras): void
```

```ts
SetCameraTypeForPlayer(player: Player, cameraType: Cameras, cameraIndex: number): void
```

#### SetFreeCameraCollisionForPlayer

Set whether collision is enabled for the Free Camera. (Default true)

```ts
SetFreeCameraCollisionForPlayer(player: Player, enabled: boolean): void
```

#### SetGameModeScore

Sets the gamemode score of the provided Player or Team.

```ts
SetGameModeScore(player: Player, newScore: number): void
```

#### SetInventoryAmmo

Sets the target player loaded ammo for the provided inventory slot.

```ts
SetInventoryAmmo(player: Player, inventorySlots: InventorySlots, ammo: number): void
```

#### SetInventoryMagazineAmmo

Sets the target player magazine ammo for the provided inventory slot.

```ts
SetInventoryMagazineAmmo(player: Player, inventorySlots: InventorySlots, magAmmo: number): void
```

#### SetPlayerIncomingDamageFactor

Sets damage taken factor on player (Will be rounded to the nearest 5%). The value will be clamped between 0 - 200%.

```ts
SetPlayerIncomingDamageFactor(player: Player, amount: number): void
```

#### SetPlayerMaxHealth

Sets the max health of a target player from 1 to 500.  The value will be multiplied by the target's max health multiplier.

```ts
SetPlayerMaxHealth(player: Player, maxHealth: number): void
```

#### SetPlayerMovementSpeedMultiplier

Sets a player's movement speed multiplier.

```ts
SetPlayerMovementSpeedMultiplier(player: Player, multiplier: number): void
```

#### SetRedeployTime

Overrides the time to redeploy for a target player. The redeploy time must be set to a value between 0 and 60 seconds.

```ts
SetRedeployTime(player: Player, redeployTime: number): void
```

#### SetSpectatingFiltersForPlayer

Sets the spectating filters. SpectatingGroup sets the selectable players in the spectating UI. ownSquadOnly and ownTeamOnly limit whether a player can spectate other squads/teams after currently spectated one is eliminated

```ts
SetSpectatingFiltersForPlayer(
  player: Player,
  group: SpectatingGroup,
  ownSquadOnly: boolean,
  ownTeamOnly: boolean
): void
```

#### SetThirdPersonCameraPositionForPlayer

Set the FollowDistance, FollowHeight, and ShoulderOffset for the Third Person Camera. (Default 2.5, 0.2, 0.6)

```ts
SetThirdPersonCameraPositionForPlayer(
  player: Player,
  followDistance: number,
  followHeight: number,
  shoulderOffset: number
): void
```

#### SkipManDown

Sets the target player to skip the mandown state and go directly to the deploy screen when killed.

```ts
SkipManDown(player: Player, skipManDown: boolean): void
```

#### SpawnPlayerFromSpawnPoint

Force Deploy a soldier from a specific spawn point.

```ts
SpawnPlayerFromSpawnPoint(player: Player, spawnPointId: number): void
```

```ts
SpawnPlayerFromSpawnPoint(player: Player, spawnPoint: SpawnPoint): void
```

#### SpotTarget

Spots a target Player for all players for a specified duration of time (in seconds).

```ts
SpotTarget(targetplayer: Player, duration: number, spotStatus: SpotStatus): void
```

```ts
SpotTarget(
  targetPlayer: Player,
  spotterPlayer: Player,
  duration: number,
  spotStatus: SpotStatus
): void
```

```ts
SpotTarget(targetplayer: Player, spotStatus: SpotStatus): void
```

```ts
SpotTarget(targetPlayer: Player, spotterPlayer: Player, duration: number): void
```

```ts
SpotTarget(targetplayer: Player, duration: number): void
```

#### Teleport

Teleports a target to a provided valid position facing a specified angle (in radians).

```ts
Teleport(player: Player, destination: Vector, orientation: number): void
```

#### UndeployAllPlayers

Undeploys all players that are alive on the battlefield back to the deploy screen.

```ts
UndeployAllPlayers(): void
```

#### UndeployPlayer

Undeploys a target player that is alive on the battlefield back to the deploy screen.

```ts
UndeployPlayer(player: Player): void
```

#### WorldPositionOf

Converts the provided local player position to the corresponding position in the world space.

```ts
WorldPositionOf(vector: Vector, player: Player): Vector
```

#### WorldVectorOf

Converts the provided local player vector to the corresponding vector in the world space.

```ts
WorldVectorOf(vector: Vector, player: Player): Vector
```

:::

### Vehicles

::: details Toggle

#### AllVehicles

Returns an array of all vehicles within a game.

```ts
AllVehicles(): Array
```

#### ApplyImpulse

Apply impulse  with given world position, direction and magnitude

```ts
ApplyImpulse(vehicle: Vehicle, worldPosition: Vector, direction: Vector, magnitude: number): void
```

#### CompareVehicleName

Returns a boolean indicating if the target vehicle has the same name as the provided vehicle or if it is the same type as the provided vehicle type.

```ts
CompareVehicleName(vehicle: Vehicle, vehicleList: VehicleList): boolean
```

#### DealDamage

Deals a provided amount of damage to a target player. Can optionally specify damage giver..

```ts
DealDamage(vehicle: Vehicle, damageAmount: number): void
```

#### ForceEmplacementSpawnerSpawn

Cause an emplacement spawner to spawn an emplacement of the type it is currently set to.

```ts
ForceEmplacementSpawnerSpawn(emplacementSpawner: EmplacementSpawner): void
```

#### ForcePlayerExitVehicle

Forces the specified player to exit the target vehicle.

```ts
ForcePlayerExitVehicle(player: Player, vehicle: Vehicle): void
```

```ts
ForcePlayerExitVehicle(vehicle: Vehicle): void
```

```ts
ForcePlayerExitVehicle(player: Player): void
```

#### ForcePlayerToSeat

Forces the specified player into the target vehicle at the provided seat number.  If the provided seat is -1, that player will be forced into the first available seat.

```ts
ForcePlayerToSeat(player: Player, vehicle: Vehicle, seatNumber: number): void
```

#### ForceVehicleSpawnerSpawn

Cause a vehicle spawner to spawn one vehicle of the type it is currently set to.

```ts
ForceVehicleSpawnerSpawn(vehicleSpawner: VehicleSpawner): void
```

#### GetAllPlayersInVehicle

Returns a array of all players inside a provided vehicle

```ts
GetAllPlayersInVehicle(vehicle: Vehicle): Array
```

#### GetEmplacementSpawner

Returns the EmplacementSpawner corresponding to the provided id.

```ts
GetEmplacementSpawner(objId: number): EmplacementSpawner
```

#### GetPlayerFromVehicleSeat

Returns the player currently occupying the provided seat index number of the provided vehicle. Note: If no players are in the vehicle seat when this block is called, the returned player will be invalid.

```ts
GetPlayerFromVehicleSeat(vehicle: Vehicle, number: number): Player
```

#### GetVehicle

Returns the Vehicle corresponding to the provided id.

```ts
GetVehicle(objId: number): Vehicle
```

#### GetVehicleSeatCount

Returns the number of seats in a vehicle.

```ts
GetVehicleSeatCount(vehicle: Vehicle): number
```

#### GetVehicleSpawner

Returns the VehicleSpawner corresponding to the provided id.

```ts
GetVehicleSpawner(objId: number): VehicleSpawner
```

#### GetVehicleState

Returns the value of the target vehicle state.

```ts
GetVehicleState(vehicle: Vehicle, vehicleStateVector: VehicleStateVector): Vector
```

#### GetVehicleTeam

Returns the team of the provided vehicle. Note: A vehicle that is not occupied will have a neutral team.

```ts
GetVehicleTeam(vehicle: Vehicle): Team
```

#### Heal

Instantly adds a given amount of health to the target player. Can optionally specify healing player.

```ts
Heal(vehicle: Vehicle, repairAmount: number): void
```

#### IsVehicleOccupied

Returns a boolean indicating if the target vehicle is a occupied by a player.

```ts
IsVehicleOccupied(vehicle: Vehicle): boolean
```

#### IsVehicleSeatOccupied

Returns a boolean indicating if the target seat index number of target vehicle is a occupied by a player.

```ts
IsVehicleSeatOccupied(vehicle: Vehicle, number: number): boolean
```

#### Kill

Kills a target player (skips the Mandown state).

```ts
Kill(vehicle: Vehicle): void
```

#### SetAllVehiclesAllowedInSurroundingArea

Sets whether all vehicles are allowed in the Surrounding Area

```ts
SetAllVehiclesAllowedInSurroundingArea(allowed: boolean): void
```

#### SetEmplacementSpawnerAbandonVehicleOutOfCombatArea

Enables or disables the feature to destroy emplacement left outside of the combat area.

```ts
SetEmplacementSpawnerAbandonVehicleOutOfCombatArea(
  emplacementSpawner: EmplacementSpawner,
  enabled: boolean
): void
```

#### SetEmplacementSpawnerApplyDamageToAbandonVehicle

Enables or disables the feature to destroy abandoned emplacements.

```ts
SetEmplacementSpawnerApplyDamageToAbandonVehicle(
  emplacementSpawner: EmplacementSpawner,
  enabled: boolean
): void
```

#### SetEmplacementSpawnerAutoSpawn

Enables or Disables automatic emplacement respawning from the emplacement spawner.

```ts
SetEmplacementSpawnerAutoSpawn(emplacementSpawner: EmplacementSpawner, enabled: boolean): void
```

#### SetEmplacementSpawnerKeepAliveAbandonRadius

Sets the distance from the nearest player for an emplacement to consider itself abandoned.

```ts
SetEmplacementSpawnerKeepAliveAbandonRadius(
  emplacementSpawner: EmplacementSpawner,
  keepAliveAbandonedRadius: number
): void
```

#### SetEmplacementSpawnerRespawnTime

Sets the delay after destruction before an emplacement automatically respawn, if the feature is activated.

```ts
SetEmplacementSpawnerRespawnTime(emplacementSpawner: EmplacementSpawner, respawnTime: number): void
```

#### SetEmplacementSpawnerSpawnerRadius

Sets the distance its enplacement spawner for an emplacement to consider itself abandoned.

```ts
SetEmplacementSpawnerSpawnerRadius(
  emplacementSpawner: EmplacementSpawner,
  keepAliveSpawnerRadius: number
): void
```

#### SetEmplacementSpawnerTimeUntilAbandon

Sets the time left idle before an emplacement is considered abandoned.

```ts
SetEmplacementSpawnerTimeUntilAbandon(
  emplacementSpawner: EmplacementSpawner,
  timeUntilAbandon: number
): void
```

#### SetEmplacementSpawnerType

Sets the type of emplacement that will spawn from the emplacement spawner.

```ts
SetEmplacementSpawnerType(
  emplacementSpawner: EmplacementSpawner,
  emplacementType: StationaryEmplacements
): void
```

#### SetMaxVehicleHeightLimitScale

Sets a multiplier on the normal map value of how high vehicles can go before their engines stop applying an upwards force.

```ts
SetMaxVehicleHeightLimitScale(heightScale: number): void
```

#### SetVehicleAllowedInSurroundingArea

Sets whether a vehicle is allowed in the Surrounding Area

```ts
SetVehicleAllowedInSurroundingArea(vehicle: VehicleList, allowed: boolean): void
```

#### SetVehicleCategoryAllowedInSurroundingArea

Sets whether a vehicle category is allowed in the Surrounding Area

```ts
SetVehicleCategoryAllowedInSurroundingArea(
  vehicleCategory: VehicleCategories,
  allowed: boolean
): void
```

#### SetVehicleMaxHealthMultiplier

Multiplies the maximum health of target vehicle by the provided number greater than 0 and less than or equal to 4.

```ts
SetVehicleMaxHealthMultiplier(vehicle: Vehicle, maxHealthMultiplier: number): void
```

#### SetVehicleSpawnerAbandonVehiclesOutOfCombatArea

Enables or disables the feature to destroy vehicles left outside of the combat area.

```ts
SetVehicleSpawnerAbandonVehiclesOutOfCombatArea(
  vehicleSpawner: VehicleSpawner,
  enabled: boolean
): void
```

#### SetVehicleSpawnerApplyDamageToAbandonVehicle

Enables or disables the feature to destroy abandoned vehicles.

```ts
SetVehicleSpawnerApplyDamageToAbandonVehicle(
  vehicleSpawner: VehicleSpawner,
  enabled: boolean
): void
```

#### SetVehicleSpawnerAutoSpawn

Enables or Disables automatic vehicle respawning from the vehicle spawner.

```ts
SetVehicleSpawnerAutoSpawn(vehicleSpawner: VehicleSpawner, enabled: boolean): void
```

#### SetVehicleSpawnerKeepAliveAbandonRadius

Sets the distance from the nearest player for a vehicle to consider itself abandoned.

```ts
SetVehicleSpawnerKeepAliveAbandonRadius(
  vehicleSpawner: VehicleSpawner,
  keepAliveAbandonedRadius: number
): void
```

#### SetVehicleSpawnerKeepAliveSpawnerRadius

Sets the distance its vehicle spawner for a vehicle to consider itself abandoned.

```ts
SetVehicleSpawnerKeepAliveSpawnerRadius(
  vehicleSpawner: VehicleSpawner,
  keepAliveSpawnerRadius: number
): void
```

#### SetVehicleSpawnerRespawnTime

Sets the delay after destruction before a vehicle automatically respawn, if the feature is activated.

```ts
SetVehicleSpawnerRespawnTime(vehicleSpawner: VehicleSpawner, respawnTime: number): void
```

#### SetVehicleSpawnerTimeUntilAbandon

Sets the time left idle before a vehicle is considered abandoned.

```ts
SetVehicleSpawnerTimeUntilAbandon(vehicleSpawner: VehicleSpawner, timeUntilAbandon: number): void
```

#### SetVehicleSpawnerVehicleType

Sets the type of vehicle that will spawn from the vehicle spawner.

```ts
SetVehicleSpawnerVehicleType(vehicleSpawner: VehicleSpawner, vehicleType: VehicleList): void
```

#### Teleport

Teleports a target to a provided valid position facing a specified angle (in radians).

```ts
Teleport(vehicle: Vehicle, destination: Vector, orientation: number): void
```

:::

### Objects & Spatial

::: details Toggle

#### ApplyAreaImpulseAndDamage

Apply impulse and damage to objects within set radius of given point. Impulse direction from center point, unless specified with ImpulseDirection

```ts
ApplyAreaImpulseAndDamage(
  center: Vector,
  radius: number,
  impulseStrength: number,
  damageAmount: number
): void
```

```ts
ApplyAreaImpulseAndDamage(
  center: Vector,
  radius: number,
  impulseStrength: number,
  damageAmount: number,
  impulseDirection: Vector
): void
```

#### GetGolmudTrainLocation

Returns the World Position of the Golmud Moving Train. (Only on Golmud Railway map)

```ts
GetGolmudTrainLocation(): Vector
```

#### GetObjectPosition

Returns the position vector of the provided object.

```ts
GetObjectPosition(object: mod.Object): Vector
```

#### GetObjectRotation

Returns the rotation vector of the provided object.

```ts
GetObjectRotation(object: mod.Object): Vector
```

#### GetObjectTransform

Returns the transform vector of the provided object.

```ts
GetObjectTransform(object: mod.Object): Transform
```

#### GetObjId

Returns the id corresponding to the provided object.

```ts
GetObjId(object: mod.Object): number
```

#### GetSpatialObject

Returns the spatial object corresponding to the provided id.

```ts
GetSpatialObject(spatialObjectNumber: number): SpatialObject
```

#### MoveObjectOverTime

Moves the Object by the delta position and rotation over the time provided. Options to loop indefinitely and reverse

```ts
MoveObjectOverTime(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  positionDelta: Vector,
  rotationDelta: Vector,
  timeInSeconds: number,
  shouldLoop: boolean,
  shouldReverse: boolean
): void
```

#### OrbitObjectOverTime

Orbits the Object around the provided transform over time. Optional orbitAxis otherwise transform's up vector is used

```ts
OrbitObjectOverTime(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  orbitTransform: Transform,
  timeInSeconds: number,
  radius: number,
  shouldLoop: boolean,
  shouldReverse: boolean,
  clockwise: boolean
): void
```

```ts
OrbitObjectOverTime(
  object: | Bomb | EmplacementSpawner | FixedCamera | InteractPoint | LootSpawner | MCOM | SFX | SpatialObject | Spawner | VehicleSpawner | VL7Cloud | VO | WorldIcon,
  orbitTransform: Transform,
  timeInSeconds: number,
  radius: number,
  shouldLoop: boolean,
  shouldReverse: boolean,
  clockwise: boolean,
  orbitAxis: Vector
): void
```

#### RayCast

Request the system to evaluate if a straight line between two points is interupted or not. Use OnRayCastHit and OnRayCastMissed to read the result.

```ts
RayCast(start: Vector, stop: Vector): void
```

#### SetThirdPersonCameraPositionForAll

Set the FollowDistance, FollowHeight, and ShoulderOffset for the Third Person Camera. (Default 2.5, 0.2, 0.6)

```ts
SetThirdPersonCameraPositionForAll(
  followDistance: number,
  followHeight: number,
  shoulderOffset: number
): void
```

:::

### Objectives & Map Features

::: details Toggle

#### AllCapturePoints

Returns an array of all capture points within a game.

```ts
AllCapturePoints(): Array
```

#### EnableAreaTrigger

Enables or disables an area trigger. This will prevent the specific Event from being fired.

```ts
EnableAreaTrigger(areaTrigger: AreaTrigger, enable: boolean): void
```

#### EnableCapturePointDeploying

Enables or disables deploying on provided capture point for the team that owns it.

```ts
EnableCapturePointDeploying(capturePoint: CapturePoint, enableDeploying: boolean): void
```

#### EnableGameModeObjective

Enables or disables the provided objective.

```ts
EnableGameModeObjective(objective: CapturePoint | HQ | Sector | MCOM, enable: boolean): void
```

#### EnableHQ

Enables or disables a headquater.

```ts
EnableHQ(hq: HQ, enable: boolean): void
```

#### EnableInteractPoint

Enables or disables an interact point.

```ts
EnableInteractPoint(interactPoint: InteractPoint, enable: boolean): void
```

#### GetAreaTrigger

Returns the AreaTrigger corresponding to the provided id.

```ts
GetAreaTrigger(objId: number): AreaTrigger
```

#### GetCapturePoint

Returns the CapturePoint corresponding to the provided id.

```ts
GetCapturePoint(objId: number): CapturePoint
```

#### GetCaptureProgress

Returns a number from zero to one corresponding to the capture progress of the provided capture point.

```ts
GetCaptureProgress(capturePoint: CapturePoint): number
```

#### GetCurrentOwnerTeam

Returns the current owner team corresponding to the provided capture point.

```ts
GetCurrentOwnerTeam(capturePoint: CapturePoint): Team
```

#### GetHQ

Returns the HQ corresponding to the provided id.

```ts
GetHQ(objId: number): HQ
```

#### GetInteractPoint

Returns the InteractPoint corresponding to the provided id.

```ts
GetInteractPoint(objId: number): InteractPoint
```

#### GetLootSpawner

Returns the LootSpawner corresponding to the provided id.

```ts
GetLootSpawner(objId: number): LootSpawner
```

#### GetMCOM

Returns the MCOM corresponding to the provided id.

```ts
GetMCOM(objId: number): MCOM
```

#### GetOwnerProgressTeam

Returns the team of the team currently capturing the provided capture point.

```ts
GetOwnerProgressTeam(capturePoint: CapturePoint): Team
```

#### GetPlayersOnPoint

Returns a array of all players within the boundaries of a provided capture point.

```ts
GetPlayersOnPoint(capturePoint: CapturePoint): Array
```

#### GetPreviousOwnerTeam

Returns the previous owner team corresponding to the provided capture point.

```ts
GetPreviousOwnerTeam(capturePoint: CapturePoint): Team
```

#### GetRingOfFire

Returns the RingOfFire corresponding to the provided id.

```ts
GetRingOfFire(objId: number): RingOfFire
```

#### GetSector

Returns the Sector corresponding to the provided id.

```ts
GetSector(objId: number): Sector
```

#### GetVL7Cloud

Returns the VL7Cloud corresponding to the provided id.

```ts
GetVL7Cloud(objId: number): VL7Cloud
```

#### GetWaypointPath

Returns the WaypointPath corresponding to the provided id.

```ts
GetWaypointPath(objId: number): WaypointPath
```

#### GolmudTrainSendMoveCommand

Sends a move instruction to the Golmud Railway train.

```ts
GolmudTrainSendMoveCommand(moveCommand: GolmudTrainMoveCommands): void
```

#### RingOfFireStart

Signals the RingOfFire to start shrinking.

```ts
RingOfFireStart(ringOfFire: RingOfFire): void
```

#### SetCapturePointCapturingTime

Sets the capturing time for target capture point to the provided number.

```ts
SetCapturePointCapturingTime(capturePoint: CapturePoint, capturingTime: number): void
```

#### SetCapturePointNeutralizationTime

Sets the neutralization time for target capture point  to the provided number.

```ts
SetCapturePointNeutralizationTime(capturePoint: CapturePoint, neutralizationTime: number): void
```

#### SetCapturePointOwner

Change the team controling a capture point.

```ts
SetCapturePointOwner(capturePoint: CapturePoint, team: Team): void
```

#### SetHQTeam

Sets a HQ to a specific Team.

```ts
SetHQTeam(hq: HQ, team: Team): void
```

#### SetMaxCaptureMultiplier

Sets the capture time multiplier for target capture point to the provided number.

```ts
SetMaxCaptureMultiplier(capturePoint: CapturePoint, multiplier: number): void
```

#### SetMCOMArmType

Sets the MCOM arm type, if set to default anyone on the opposing team can arm it, otherwise only the bomb carrier can.

```ts
SetMCOMArmType(mcom: MCOM, mcomarmtype: MCOMArmType): void
```

#### SetMCOMFuseTime

Determines the time needed by MCOM.

```ts
SetMCOMFuseTime(mCOM: MCOM, fuseTime: number): void
```

#### SetMCOMOwner

Sets the ownership of the MCOM, swapping teams will flip who can plant and defuse. Only allows for Neutral, Team1 and Team2.

```ts
SetMCOMOwner(mcom: MCOM, team: Team): void
```

#### SetRingOfFireDamageAmount

Sets the damage dealt by the RingOfFire to players caught.

```ts
SetRingOfFireDamageAmount(ringOfFireId: RingOfFire, ringOfFireDamageAmount: number): void
```

#### SetRingOfFireStableTime

Sets the duration the RingOfFire remains stable before Shrinking again.

```ts
SetRingOfFireStableTime(ringOfFireId: RingOfFire, ringOfFireStableTime: number): void
```

#### SetVL7CloudEffects

Enables or Disables any effect from a designated VL7Cloud object.

```ts
SetVL7CloudEffects(
  vl7Cloud: VL7Cloud,
  screenEffect: boolean,
  soldierEffect: boolean,
  visualEffect: boolean
): void
```

#### SpawnLoot

Spawns a weapon or gadget at a LootSpawner.

```ts
SpawnLoot(lootSpawner: LootSpawner, ammo: AmmoTypes): void
```

```ts
SpawnLoot(lootSpawner: LootSpawner, weapon: Weapons): void
```

```ts
SpawnLoot(lootSpawner: LootSpawner, gadget: Gadgets): void
```

```ts
SpawnLoot(lootSpawner: LootSpawner, armor: ArmorTypes): void
```

:::

### Spawning

::: details Toggle

#### ForceBombSpawn

Forces the bomb to spawn at the original location.

```ts
ForceBombSpawn(bomb: Bomb): void
```

#### ForceBombUnspawn

Forces the bomb to unspawn.

```ts
ForceBombUnspawn(bomb: Bomb): void
```

#### GetSpawner

Returns the Spawner corresponding to the provided id.

```ts
GetSpawner(objId: number): Spawner
```

#### GetSpawnPoint

Returns the SpawnPoint corresponding to the provided id.

```ts
GetSpawnPoint(objId: number): SpawnPoint
```

#### SetSpawnMode

Determines if players are spawned automatically or not.

```ts
SetSpawnMode(spawnModes: SpawnModes): void
```

#### SetUnspawnDelayInSeconds

Sets the time (in seconds) it takes for AI soldiers from the provided Spawner to unspawn after death.

```ts
SetUnspawnDelayInSeconds(spawner: Spawner, delay: number): void
```

#### SpawnObject

Spawns an object at runtime. Returns an object id if the object supports it, otherwise -1

```ts
SpawnObject(
  prefabEnum: | RuntimeSpawn_Common | RuntimeSpawn_Abbasid | RuntimeSpawn_Aftermath | RuntimeSpawn_Badlands | RuntimeSpawn_Battery | RuntimeSpawn_Capstone | RuntimeSpawn_Contaminated | RuntimeSpawn_Dumbo | RuntimeSpawn_Eastwood | RuntimeSpawn_FireStorm | RuntimeSpawn_Limestone | RuntimeSpawn_Outskirts | RuntimeSpawn_Subsurface | RuntimeSpawn_Tungsten | RuntimeSpawn_Granite_Downtown | RuntimeSpawn_Granite_Marina | RuntimeSpawn_Granite_MilitaryRnD | RuntimeSpawn_Granite_MilitaryStorage | RuntimeSpawn_Granite_ResidentialNorth | RuntimeSpawn_Granite_TechCenter | RuntimeSpawn_Granite_Underground | RuntimeSpawn_Sand | RuntimeSpawn_GolmudRailway | RuntimeSpawn_Plaza,
  position: Vector,
  rotation: Vector,
  scale: Vector
): Any
```

```ts
SpawnObject(
  prefabEnum: | RuntimeSpawn_Common | RuntimeSpawn_Abbasid | RuntimeSpawn_Aftermath | RuntimeSpawn_Badlands | RuntimeSpawn_Battery | RuntimeSpawn_Capstone | RuntimeSpawn_Contaminated | RuntimeSpawn_Dumbo | RuntimeSpawn_Eastwood | RuntimeSpawn_FireStorm | RuntimeSpawn_Limestone | RuntimeSpawn_Outskirts | RuntimeSpawn_Subsurface | RuntimeSpawn_Tungsten | RuntimeSpawn_Granite_Downtown | RuntimeSpawn_Granite_Marina | RuntimeSpawn_Granite_MilitaryRnD | RuntimeSpawn_Granite_MilitaryStorage | RuntimeSpawn_Granite_ResidentialNorth | RuntimeSpawn_Granite_TechCenter | RuntimeSpawn_Granite_Underground | RuntimeSpawn_Sand | RuntimeSpawn_GolmudRailway | RuntimeSpawn_Plaza,
  position: Vector,
  rotation: Vector
): Any
```

#### UnspawnAllLoot

Removes all existing loot from the world.

```ts
UnspawnAllLoot(): void
```

#### UnspawnObject

Unspawn an Object spawned using SpawnObject.

```ts
UnspawnObject(obj: mod.Object): void
```

:::

### Audio & Effects

::: details Toggle

#### EnableScreenEffect

Enables or disables a player-specific screen effect.

```ts
EnableScreenEffect(player: Player, screenEffect: ScreenEffects, enable: boolean): void
```

#### EnableVFX

Enables or disables a visual effect.

```ts
EnableVFX(vfx: VFX, enable: boolean): void
```

#### GetSFX

Returns the SFX corresponding to the provided id.

```ts
GetSFX(objId: number): SFX
```

#### GetVFX

Returns the VFX corresponding to the provided id.

```ts
GetVFX(objId: number): VFX
```

#### GetVO

Returns the VO corresponding to the provided id.

```ts
GetVO(objId: number): VO
```

#### LoadMusic

Loads a music package to then be triggered with the PlayMusic action.

```ts
LoadMusic(musicPackage: MusicPackages): void
```

#### MoveVFX

Move a VFX to a new coordinate.

```ts
MoveVFX(vfxID: VFX, position: Vector, rotation: Vector): void
```

#### PlayMusic

Triggers a music event.

```ts
PlayMusic(musicEvent: MusicEvents): void
```

```ts
PlayMusic(musicEvent: MusicEvents, team: Team): void
```

```ts
PlayMusic(musicEvent: MusicEvents, squad: Squad): void
```

```ts
PlayMusic(musicEvent: MusicEvents, player: Player): void
```

#### PlaySound

Plays a sound using runtime spawner tech.

```ts
PlaySound(sound: SFX, amplitude: number, team: Team): void
```

```ts
PlaySound(sound: SFX, amplitude: number, squad: Squad): void
```

```ts
PlaySound(sound: SFX, amplitude: number, player: Player): void
```

```ts
PlaySound(sound: SFX, amplitude: number): void
```

```ts
PlaySound(
  sound: SFX,
  amplitude: number,
  location: Vector,
  attenuationRange: number,
  team: Team
): void
```

```ts
PlaySound(
  sound: SFX,
  amplitude: number,
  location: Vector,
  attenuationRange: number,
  squad: Squad
): void
```

```ts
PlaySound(
  sound: SFX,
  amplitude: number,
  location: Vector,
  attenuationRange: number,
  player: Player
): void
```

```ts
PlaySound(sound: SFX, amplitude: number, location: Vector, attenuationRange: number): void
```

#### PlayVO

Plays a voice-over event clip. VO flags Hotel and India only support a few select VO events.

```ts
PlayVO(voiceOver: VO, event: VoiceOverEvents2D, flag: VoiceOverFlags): void
```

```ts
PlayVO(voiceOver: VO, event: VoiceOverEvents2D, flag: VoiceOverFlags, player: Player): void
```

```ts
PlayVO(voiceOver: VO, event: VoiceOverEvents2D, flag: VoiceOverFlags, squad: Squad): void
```

```ts
PlayVO(voiceOver: VO, event: VoiceOverEvents2D, flag: VoiceOverFlags, team: Team): void
```

#### SetMusicParam

Updates any parameters that a music package might have.

```ts
SetMusicParam(musicParam: MusicParams, paramValue: number): void
```

```ts
SetMusicParam(musicParam: MusicParams, paramValue: number, team: Team): void
```

```ts
SetMusicParam(musicParam: MusicParams, paramValue: number, squad: Squad): void
```

```ts
SetMusicParam(musicParam: MusicParams, paramValue: number, player: Player): void
```

#### SetSoldierEffect

Applies an effect to a soldier based on a passed-in player.

```ts
SetSoldierEffect(player: Player, soldierEffects: SoldierEffects, isEnabled: boolean): void
```

#### SetSoundAmplitude

Sets the amplitude of a given sound.

```ts
SetSoundAmplitude(sound: SFX, amplitude: number, team: Team): void
```

```ts
SetSoundAmplitude(sound: SFX, amplitude: number, squad: Squad): void
```

```ts
SetSoundAmplitude(sound: SFX, amplitude: number, player: Player): void
```

```ts
SetSoundAmplitude(sound: SFX, amplitude: number): void
```

#### SetVFXColor

Changes the color of a visual effect.

```ts
SetVFXColor(vfxID: VFX, color: Vector): void
```

#### SetVFXScale

Changes the scale of a visual effect.

```ts
SetVFXScale(vfxID: VFX, scale: number): void
```

#### SetVFXSpeed

Changes the speed of a visual effect.

```ts
SetVFXSpeed(vfxID: VFX, speed: number): void
```

#### StopSound

Stops a given sound.

```ts
StopSound(sound: SFX, team: Team): void
```

```ts
StopSound(sound: SFX, squad: Squad): void
```

```ts
StopSound(sound: SFX, player: Player): void
```

```ts
StopSound(sound: SFX): void
```

#### UnloadMusic

Unloads a music package that is already loaded.

```ts
UnloadMusic(musicPackage: MusicPackages): void
```

:::

### Teams & Squads

::: details Toggle

#### ClosestPlayerTo

Returns the closest alive player to a provided position. Can be filtered using a team. Note: If no players are alive when this block is called, the returned player will be invalid.

```ts
ClosestPlayerTo(vector: Vector, team: Team): Player
```

#### EndGameMode

Ends the current gamemode and designates the provided Player or Team as the winner. The gamemode ends in draw if Team is set to 0.

```ts
EndGameMode(team: Team): void
```

#### GetGameModeScore

Returns the current gamemode score of the provided player or team.

```ts
GetGameModeScore(team: Team): number
```

#### GetSquad

Returns the squad object corresponding to the provided player, or team/squad id.

```ts
GetSquad(player: Player): Squad
```

```ts
GetSquad(teamIdNumber: number, squadIdNumber: number): Squad
```

#### GetSquadName

Returns a string of the name of the provided squad.

```ts
GetSquadName(arg0: Squad): string
```

#### GetTeam

Returns the team value of the specified player OR the corresponding team of the provided number.

```ts
GetTeam(player: Player): Team
```

```ts
GetTeam(teamId: number): Team
```

#### IsFaction

Returns true if the provided team is using soldiers from the specified faction.

```ts
IsFaction(team: Team, factions: Factions): boolean
```

#### SetBombTeam

Changes the Team that can pick-up the bomb.

```ts
SetBombTeam(bomb: Bomb, team: Team): void
```

#### SetGameModeInitialScore

Sets the Initial Score for teams.

```ts
SetGameModeInitialScore(team: Team, initialscore: number): void
```

#### SetGameModeScore

Sets the gamemode score of the provided Player or Team.

```ts
SetGameModeScore(team: Team, newScore: number): void
```

#### SetTeam

Sets the target player's team.

```ts
SetTeam(player: Player, team: Team): void
```

#### SwitchTeams

Switches players on TeamA and TeamB. Both teams must have the same Human and Bot count.

```ts
SwitchTeams(teamA: Team, teamB: Team): void
```

:::

### Game Flow

::: details Toggle

#### GetMatchTimeElapsed

Returns the amount of time elapsed (seconds) in the current gamemode.

```ts
GetMatchTimeElapsed(): number
```

#### GetMatchTimeRemaining

Returns the amount of time left (in seconds) in the current gamemode.

```ts
GetMatchTimeRemaining(): number
```

#### GetRoundTime

Returns the time limit set for the gamemode (in seconds).

```ts
GetRoundTime(): number
```

#### PauseGameModeTime

Pauses or unpauses the gamemode timer based on the provided boolean input.

```ts
PauseGameModeTime(pauseTimer: boolean): void
```

#### ResetGameModeTime

Resets the gamemode time to its starting value.

```ts
ResetGameModeTime(): void
```

#### SetFriendlyFire

Enables of disables friendly fire.

```ts
SetFriendlyFire(enableFriendlyFire: boolean): void
```

#### SetGameModeCriteria

Sets the type of criteria used to check the score for winning teams.

```ts
SetGameModeCriteria(criteria: ScoreCriteria): void
```

#### SetGameModeTargetScore

Sets the gamemode target score used to determine victory.

```ts
SetGameModeTargetScore(newScore: number): void
```

#### SetGameModeTimeLimit

Sets the duration of the game in seconds.

```ts
SetGameModeTimeLimit(newTimeLimit: number): void
```

#### SetHUDTicker

Sets the type of HUD ticker to use.

```ts
SetHUDTicker(ticker: GameModeTicker): void
```

#### SetSpectatingFiltersForAll

Sets the spectating filters. SpectatingGroup sets the selectable players in the spectating UI. ownSquadOnly and ownTeamOnly limit whether a player can spectate other squads/teams after currently spectated one is eliminated

```ts
SetSpectatingFiltersForAll(
  group: SpectatingGroup,
  ownSquadOnly: boolean,
  ownTeamOnly: boolean
): void
```

:::

### Arrays

::: details Toggle

#### AppendToArray

Returns a copy of an array with the provided value appended to the end.  Note: It is not possible for an array to contain arrays. Attempting to append an array to an array will concatenate them instead.

```ts
AppendToArray(array: Array, value: Any): Array
```

#### ArraySlice

Returns a copy of the specified array containing only values from a specified index range.

```ts
ArraySlice(array: Array, startIndex: number, endIndex: number): Array
```

#### CountOf

Returns the number of elements in the specified array.

```ts
CountOf(array: Array): number
```

#### EmptyArray

Returns an initialized empty Array.

```ts
EmptyArray(): Array
```

#### FirstOf

Returns the first value of the specified Array.

```ts
FirstOf(array: Array): Any
```

#### LastOf

Returns the value at the end of the specified Array.

```ts
LastOf(array: Array): Any
```

#### RandomizedArray

Returns a copy of the specified Array with the values in a random order.

```ts
RandomizedArray(array: Array): Array
```

#### RandomValueInArray

Returns a random value from the specified Array.

```ts
RandomValueInArray(array: Array): Any
```

#### SortedArray

Returns a sorted version of the specified Array given a Number value to sort by (ascending). CurrentArrayElement can be utilized to represent each value in the Array. In the following example, CurrentArrayElement is used to represent each Player in AllPlayers. GetGameModeScore is used with CurrentArrayElement to return the score, used as a rank, to sort the Array in ascending order.

```ts
SortedArray(array: Array, index: number): Array
```

#### ValueInArray

Returns the value found at a provided index of an array.

```ts
ValueInArray(array: Array, index: number): Any
```

:::

### Variables

::: details Toggle

#### ChaseVariableAtRate

Gradually modifies the value of a Variable at a specified rate (value/second) until it reaches the provided limit.

```ts
ChaseVariableAtRate(variable: Variable, limit: number, deltaPerSecond: number): void
```

#### ChaseVariableOverTime

Gradually modifies the value of a Variable over time (in seconds). The variable's value will reach the limit at the end of the interval.

```ts
ChaseVariableOverTime(variable: Variable, limit: number, durationSeconds: number): void
```

#### GetVariable

Returns the value of a variable.

```ts
GetVariable(variable: Variable): Any
```

#### GlobalVariable

Returns the variable specified by a number.

```ts
GlobalVariable(variableIndex: number): Variable
```

#### ObjectVariable

Returns the variable specified by an object.

```ts
ObjectVariable(ownerObject: mod.Object, variableIndex: number): Variable
```

#### SetVariable

Sets the value of a Variable.

```ts
SetVariable(variable: Variable, value: Any): void
```

#### SetVariableAtIndex

Finds or initializes an Array on a provided Variable, and stores a provided value in that Array at the specified index.

```ts
SetVariableAtIndex(arrayVariable: Variable, arrayIndex: number, value: Any): void
```

#### StopChasingVariable

Stops an in-progress tracking of a Variable from the ChaseVariableOverTime or ChaseVariableAtRate blocks, leaving it at its current value.

```ts
StopChasingVariable(variable: Variable): void
```

:::

### Math & Logic

::: details Toggle

#### AbsoluteValue

Returns the unsigned value of the provided number input.

```ts
AbsoluteValue(number: number): number
```

#### Add

Returns the sum of two numbers or two vector values.

```ts
Add(number0: number, number1: number): number
```

```ts
Add(vector0: Vector, vector1: Vector): Vector
```

#### And

Returns a boolean value based on whether both of the provided inputs return true.

```ts
And(boolean0: boolean, boolean1: boolean): boolean
```

#### AngleBetweenVectors

Returns the angle (in degrees) between two provided vector values.

```ts
AngleBetweenVectors(vector0: Vector, vector1: Vector): number
```

#### AngleDifference

Returns the difference between two angles (in degrees).

```ts
AngleDifference(number0: number, number1: number): number
```

#### ArccosineInDegrees

Returns the inverse cosine of a provided number value in degrees.

```ts
ArccosineInDegrees(number: number): number
```

#### ArccosineInRadians

Returns the inverse cosine of a provided number value in radians.

```ts
ArccosineInRadians(number: number): number
```

#### ArcsineInDegrees

Returns the inverse sine of a provided number value in degrees.

```ts
ArcsineInDegrees(number: number): number
```

#### ArcsineInRadians

Returns the inverse sine of a provided number value in radians.

```ts
ArcsineInRadians(number: number): number
```

#### ArctangentInDegrees

Returns the inverse tangent of a provided number value in degrees.

```ts
ArctangentInDegrees(number: number): number
```

#### ArctangentInRadians

Returns the inverse tangent of a provided number value in radians.

```ts
ArctangentInRadians(number: number): number
```

#### BackwardVector

Returns the backward directional vector of (0, 0, 1).

```ts
BackwardVector(): Vector
```

#### Ceiling

Returns the value rounded up to the nearest integer.

```ts
Ceiling(number: number): number
```

#### CosineFromDegrees

Returns the cosine value of a specified angle in degrees.

```ts
CosineFromDegrees(number: number): number
```

#### CosineFromRadians

Returns the cosine value of a specified angle in radians.

```ts
CosineFromRadians(number: number): number
```

#### CreateTransform

Creates a Transform from Position and Rotation Vectors

```ts
CreateTransform(position: Vector, rotation: Vector): Transform
```

#### CreateVector

Returns a vector composed of three provided 'X' (left), 'Y' (up), and 'Z' (forward) values.

```ts
CreateVector(number0: number, number1: number, number2: number): Vector
```

#### CrossProduct

Returns the cross product between two vector values. If the two vector inputs are parallel, the result will be zero.

```ts
CrossProduct(vector0: Vector, vector1: Vector): Vector
```

#### DegreesToRadians

Returns a value in radians from a specified value in degrees.

```ts
DegreesToRadians(number: number): number
```

#### DirectionFromAngles

Returns a directional vector from the provided horizontal (yaw) and vertical (pitch) angles (in degrees).

```ts
DirectionFromAngles(number0: number, number1: number): Vector
```

#### DirectionTowards

Returns the direction, or normalized vector, from a starting position and ending position.

```ts
DirectionTowards(vector0: Vector, vector1: Vector): Vector
```

#### DistanceBetween

Returns the distance between a starting position and ending position.

```ts
DistanceBetween(vector0: Vector, vector1: Vector): number
```

#### Divide

Returns the ratio between two number values or a vector and number value. A vector divided by a number will yield a scaled vector.

```ts
Divide(number0: number, number1: number): number
```

```ts
Divide(vector: Vector, number: number): Vector
```

#### DotProduct

Returns the dot product between two vector values. If the two values are orthogonal to each other, the result will be zero.

```ts
DotProduct(vector0: Vector, vector1: Vector): number
```

#### DownVector

Returns the downward directional vector of (0, -1, 0).

```ts
DownVector(): Vector
```

#### Equals

Returns a boolean indicating if two values are equal to each other.

```ts
Equals(left: Any, right: Any): boolean
```

#### Floor

Returns the value rounded down to the nearest integer.

```ts
Floor(number: number): number
```

#### ForwardVector

Returns the forward directional vector of (0, 0, -1).

```ts
ForwardVector(): Vector
```

#### GetTransformPosition

Returns the position of a Transform as a Vector

```ts
GetTransformPosition(transform: Transform): Vector
```

#### GetTransformRotation

Returns the rotation of a Transform as a Vector

```ts
GetTransformRotation(transform: Transform): Vector
```

#### GreaterThan

Returns a boolean indicating if the 1st provided value is greater than the 2nd provided value.

```ts
GreaterThan(number0: number, number1: number): boolean
```

#### GreaterThanEqualTo

Returns a boolean indicating if the 1st provided value is greater than the 2nd provided value.

```ts
GreaterThanEqualTo(left: number, right: number): boolean
```

#### IfThenElse

Tertiary operator. If condition is true, return the first value. Otherwise return the second value.

```ts
IfThenElse(condition: boolean, trueValue: Any, falseValue: Any): Any
```

#### LeftVector

Returns the leftward directional vector of (-1, 0, 0).

```ts
LeftVector(): Vector
```

#### LessThan

Returns a boolean indicating if the 1st provided value is less than the 2nd provided value.

```ts
LessThan(left: number, right: number): boolean
```

#### LessThanEqualTo

Returns a boolean indicating if the 1st provided value is less than or equal to the 2nd provided value.

```ts
LessThanEqualTo(left: number, right: number): boolean
```

#### Max

Returns the greater of the two number values provided.

```ts
Max(number0: number, number1: number): number
```

#### Modulo

Returns the remainder of the 1st provided value divided by the 2nd provided value.

```ts
Modulo(number0: number, number1: number): number
```

#### Multiply

Returns the product of two number values or the product of a vector and number value.

```ts
Multiply(number0: number, number1: number): number
```

```ts
Multiply(vector: Vector, number: number): Vector
```

#### Normalize

Returns a unit-length normalization of a vector.

```ts
Normalize(vector: Vector): Vector
```

#### Not

Return a boolean of the opposite value of the boolean input.

```ts
Not(boolean: boolean): boolean
```

#### NotEqualTo

Returns a boolean indicating if two values are not equal to each other.

```ts
NotEqualTo(left: Any, right: Any): boolean
```

#### Or

Returns a boolean based on whether either of the two inputs are true.

```ts
Or(boolean0: boolean, boolean1: boolean): boolean
```

#### Pi

Returns the constant value 3.14159

```ts
Pi(): number
```

#### RadiansToDegrees

Returns a value in degrees from a specified value in radians.

```ts
RadiansToDegrees(number: number): number
```

#### RaiseToPower

Returns the 1st provided value raised to the power of the 2nd provided value.

```ts
RaiseToPower(number0: number, number1: number): number
```

#### RandomReal

Returns a random number between a specified minimum and maximum value (inclusive).

```ts
RandomReal(number0: number, number1: number): number
```

#### RightVector

Returns the rightward directional vector of (1, 0, 0).

```ts
RightVector(): Vector
```

#### RoundToInteger

Returns a whole number rounded from the input value. The value rounds up if the decimal of the number is greater than or equal to 0.5, and rounds down if it is less than 0.5.

```ts
RoundToInteger(number: number): number
```

#### SineFromDegrees

Returns the sine value of a specified angle in degrees.

```ts
SineFromDegrees(number: number): number
```

#### SineFromRadians

Returns the sine value of a specified angle in radians.

```ts
SineFromRadians(number: number): number
```

#### SquareRoot

Returns the square root of a provided number value.

```ts
SquareRoot(number: number): number
```

#### Subtract

Returns the difference between two number values or two vector values.

```ts
Subtract(number0: number, number1: number): number
```

```ts
Subtract(vector0: Vector, vector1: Vector): Vector
```

#### TangentFromDegrees

Returns the tangent value of a specified angle in degrees.

```ts
TangentFromDegrees(number: number): number
```

#### TangentFromRadians

Returns the tangent value of a specified angle in radians.

```ts
TangentFromRadians(number: number): number
```

#### UpVector

Returns the upward directional vector of (0, 1, 0).

```ts
UpVector(): Vector
```

#### VectorTowards

Returns the displacement vector from a starting position to an ending position.

```ts
VectorTowards(vector0: Vector, vector1: Vector): Vector
```

#### XComponentOf

Returns the 'X' component of a provided vector.

```ts
XComponentOf(vector: Vector): number
```

#### Xor

Returns true if the provided boolean inputs return different values.

```ts
Xor(boolean0: boolean, boolean1: boolean): boolean
```

#### YComponentOf

Returns the 'Y' component of a provided vector.

```ts
YComponentOf(vector: Vector): number
```

#### ZComponentOf

Returns the 'Z' component of a provided vector.

```ts
ZComponentOf(vector: Vector): number
```

:::

### Other

::: details Toggle

#### AutoBalanceTeams

Balances Team1 and Team2 while maintaining squad compositions, requires matching team and squad capacities.

```ts
AutoBalanceTeams(): void
```

#### Concat

Returns a string containing the concatenation of two strings.

```ts
Concat(string0: string, string1: string): string
```

#### ForceBombDrop

Forces the bomb drop to be dropped from its carrier.

```ts
ForceBombDrop(bomb: Bomb): void
```

#### ForceBombReset

Force resets the bomb to its initial location.

```ts
ForceBombReset(bomb: Bomb): void
```

#### GetArgument

Get argument of subroutine at given index.

```ts
GetArgument(subroutineArgIndex: number): Any
```

#### GetBomb

Returns the Bomb corresponding to the provided id.

```ts
GetBomb(objId: number): Bomb
```

#### GetFixedCamera

Returns the FixedCamera corresponding to the provided id.

```ts
GetFixedCamera(objId: number): FixedCamera
```

#### GetPortalAverageFrameTime

Return the average  Portal processing frame time

```ts
GetPortalAverageFrameTime(): number
```

#### GetServerAverageFrameTime

Return average Server side frame time

```ts
GetServerAverageFrameTime(): number
```

#### GetTargetScore

Returns the gamemode target score needed for victory.

```ts
GetTargetScore(): number
```

#### HasUIWidgetWithName

Returns a boolean indicating if the UI Widget exists.

```ts
HasUIWidgetWithName(name: string): boolean
```

#### IsCurrentMap

Returns true if the provided map is the name of the current map.

```ts
IsCurrentMap(maps: Maps): boolean
```

#### IsType

Returns true if the provided value is equal to the specified type.

```ts
IsType(value: Any, type: Types): boolean
```

#### IsUndefined

Returns whether a value is undefined, such as when a function cannot return a valid value.

```ts
IsUndefined(value: Any): boolean
```

#### IsValid

Returns whether a value is defined and if object reference is valid for object values.

```ts
IsValid(value: Any): boolean
```

#### JsAction

Calls a javascript action function.

```ts
JsAction(actionName: string, actionArg0: Any, actionArg1: Any): void
```

#### JsValue

Calls a javascript value function.

```ts
JsValue(valueName: string, valueArg0: Any, valueArg1: Any): Any
```

#### SendPortalLogToAdmin

Sends Portal Log to the admin client of the current session when hosting via "Host" (Dedicated Server). For "Host Locally," Portal Log is always available locally, so this will do nothing. Writes to PortalLog.txt on the admin's client. If admin doesn't exist, this will do nothing. Quota applies for valid log sends per session.

```ts
SendPortalLogToAdmin(): void
```

#### SetBombDropFuseTime

Sets the fuse time for when the bomb is dropped to the ground before it blows up.

```ts
SetBombDropFuseTime(bomb: Bomb, dropfusetime: number): void
```

#### SetFreeCameraCollisionForAll

Set whether collision is enabled for the Free Camera. (Default true)

```ts
SetFreeCameraCollisionForAll(enabled: boolean): void
```

#### Wait

```ts
Wait(n: number): Promise<void>
```

:::

## Event Handlers

#### OnAIMoveToFailed

This will trigger when an AI Soldier stops trying to reach a destination.

```ts
OnAIMoveToFailed(eventPlayer: mod.Player): void
```

#### OnAIMoveToRunning

This will trigger when an AI Soldier starts moving to a target location.

```ts
OnAIMoveToRunning(eventPlayer: mod.Player): void
```

#### OnAIMoveToSucceeded

This will trigger when an AI Soldier reaches target location.

```ts
OnAIMoveToSucceeded(eventPlayer: mod.Player): void
```

#### OnAIParachuteRunning

This will trigger when an AI Soldier parachute action is running.

```ts
OnAIParachuteRunning(eventPlayer: mod.Player): void
```

#### OnAIParachuteSucceeded

This will trigger when an AI Soldier parachute action has succeeded.

```ts
OnAIParachuteSucceeded(eventPlayer: mod.Player): void
```

#### OnAIWaypointIdleFailed

This will trigger when an AI Soldier stops following a waypoint.

```ts
OnAIWaypointIdleFailed(eventPlayer: mod.Player): void
```

#### OnAIWaypointIdleRunning

This will trigger when an AI Soldier starts following a waypoint.

```ts
OnAIWaypointIdleRunning(eventPlayer: mod.Player): void
```

#### OnAIWaypointIdleSucceeded

This will trigger when an AI Soldier finishes following a waypoint.

```ts
OnAIWaypointIdleSucceeded(eventPlayer: mod.Player): void
```

#### OnBombDropped

This will trigger when a player drops the bomb.

```ts
OnBombDropped(eventBomb: mod.Bomb, eventPlayer: mod.Player): void
```

#### OnBombPickedUp

This will trigger when a player picks up a bomb.

```ts
OnBombPickedUp(eventBomb: mod.Bomb, eventPlayer: mod.Player): void
```

#### OnBombStateChanged

This will trigger when a bomb changes state.

```ts
OnBombStateChanged(eventBomb: mod.Bomb, eventBombState: mod.BombState): void
```

#### OnCapturePointCaptured

This will trigger when a team takes control of a CapturePoint.

```ts
OnCapturePointCaptured(eventCapturePoint: mod.CapturePoint): void
```

#### OnCapturePointCapturing

This will trigger when a team begins capturing a CapturePoint.

```ts
OnCapturePointCapturing(eventCapturePoint: mod.CapturePoint): void
```

#### OnCapturePointLost

This will trigger when a team loses control of a CapturePoint.

```ts
OnCapturePointLost(eventCapturePoint: mod.CapturePoint): void
```

#### OnGameModeEnding

This will trigger when the gamemode ends.

```ts
OnGameModeEnding(): void
```

#### OnGameModeStarted

This will trigger at the start of the gamemode.

```ts
OnGameModeStarted(): void
```

#### OngoingAreaTrigger

```ts
OngoingAreaTrigger(eventAreaTrigger: mod.AreaTrigger): void
```

#### OngoingBomb

```ts
OngoingBomb(eventBomb: mod.Bomb): void
```

#### OngoingCapturePoint

```ts
OngoingCapturePoint(eventCapturePoint: mod.CapturePoint): void
```

#### OngoingEmplacementSpawner

```ts
OngoingEmplacementSpawner(eventEmplacementSpawner: mod.EmplacementSpawner): void
```

#### OngoingGlobal

```ts
OngoingGlobal(): void
```

#### OngoingHQ

```ts
OngoingHQ(eventHQ: mod.HQ): void
```

#### OngoingInteractPoint

```ts
OngoingInteractPoint(eventInteractPoint: mod.InteractPoint): void
```

#### OngoingLootSpawner

```ts
OngoingLootSpawner(eventLootSpawner: mod.LootSpawner): void
```

#### OngoingMCOM

```ts
OngoingMCOM(eventMCOM: mod.MCOM): void
```

#### OngoingPlayer

```ts
OngoingPlayer(eventPlayer: mod.Player): void
```

#### OngoingRingOfFire

```ts
OngoingRingOfFire(eventRingOfFire: mod.RingOfFire): void
```

#### OngoingSector

```ts
OngoingSector(eventSector: mod.Sector): void
```

#### OngoingSpawner

```ts
OngoingSpawner(eventSpawner: mod.Spawner): void
```

#### OngoingSpawnPoint

```ts
OngoingSpawnPoint(eventSpawnPoint: mod.SpawnPoint): void
```

#### OngoingTeam

```ts
OngoingTeam(eventTeam: mod.Team): void
```

#### OngoingVehicle

```ts
OngoingVehicle(eventVehicle: mod.Vehicle): void
```

#### OngoingVehicleSpawner

```ts
OngoingVehicleSpawner(eventVehicleSpawner: mod.VehicleSpawner): void
```

#### OngoingWaypointPath

```ts
OngoingWaypointPath(eventWaypointPath: mod.WaypointPath): void
```

#### OngoingWorldIcon

```ts
OngoingWorldIcon(eventWorldIcon: mod.WorldIcon): void
```

#### OnGolmudTrainStopped

This will trigger when the Golmud train stops.

```ts
OnGolmudTrainStopped(eventGolmudTrainStopReason: mod.GolmudTrainStopReason): void
```

#### OnMandown

This will trigger when a Player is forced into the mandown state.

```ts
OnMandown(eventPlayer: mod.Player, eventOtherPlayer: mod.Player): void
```

#### OnMCOMArmed

This will trigger when a MCOM is armed.

```ts
OnMCOMArmed(eventMCOM: mod.MCOM): void
```

#### OnMCOMDefused

This will trigger when a MCOM is defused.

```ts
OnMCOMDefused(eventMCOM: mod.MCOM): void
```

#### OnMCOMDestroyed

This will trigger when a MCOM detonates.

```ts
OnMCOMDestroyed(eventMCOM: mod.MCOM): void
```

#### OnPlayerDamaged

This will trigger when a Player takes damage.

```ts
OnPlayerDamaged(
  eventPlayer: mod.Player,
  eventOtherPlayer: mod.Player,
  eventDamageType: mod.DamageType,
  eventWeaponUnlock: mod.WeaponUnlock
): void
```

#### OnPlayerDeployed

This will trigger whenever a Player deploys.

```ts
OnPlayerDeployed(eventPlayer: mod.Player): void
```

#### OnPlayerDied

This will trigger whenever a Player dies.

```ts
OnPlayerDied(
  eventPlayer: mod.Player,
  eventOtherPlayer: mod.Player,
  eventDeathType: mod.DeathType,
  eventWeaponUnlock: mod.WeaponUnlock
): void
```

#### OnPlayerEarnedKill

This will trigger when a Player earns a kill against another Player.

```ts
OnPlayerEarnedKill(
  eventPlayer: mod.Player,
  eventOtherPlayer: mod.Player,
  eventDeathType: mod.DeathType,
  eventWeaponUnlock: mod.WeaponUnlock
): void
```

#### OnPlayerEarnedKillAssist

This will trigger when a Player earns a kill assist.

```ts
OnPlayerEarnedKillAssist(eventPlayer: mod.Player, eventOtherPlayer: mod.Player): void
```

#### OnPlayerEnterAreaTrigger

This will trigger when a Player enters an AreaTrigger.

```ts
OnPlayerEnterAreaTrigger(eventPlayer: mod.Player, eventAreaTrigger: mod.AreaTrigger): void
```

#### OnPlayerEnterCapturePoint

This will trigger when a Player enters a CapturePoint capturing area.

```ts
OnPlayerEnterCapturePoint(eventPlayer: mod.Player, eventCapturePoint: mod.CapturePoint): void
```

#### OnPlayerEnterVehicle

This will trigger when a Player enters a Vehicle seat.

```ts
OnPlayerEnterVehicle(eventPlayer: mod.Player, eventVehicle: mod.Vehicle): void
```

#### OnPlayerEnterVehicleSeat

This will trigger when a Player enters a Vehicle seat.

```ts
OnPlayerEnterVehicleSeat(
  eventPlayer: mod.Player,
  eventVehicle: mod.Vehicle,
  eventSeat: mod.Object
): void
```

#### OnPlayerEnterVL7Cloud

This will trigger when a Player enters a VL7Cloud volume.

```ts
OnPlayerEnterVL7Cloud(eventPlayer: mod.Player, eventVL7Cloud: mod.VL7Cloud): void
```

#### OnPlayerExitAreaTrigger

This will trigger when a Player exits an AreaTrigger.

```ts
OnPlayerExitAreaTrigger(eventPlayer: mod.Player, eventAreaTrigger: mod.AreaTrigger): void
```

#### OnPlayerExitCapturePoint

This will trigger when a Player exits a CapturePoint capturing area.

```ts
OnPlayerExitCapturePoint(eventPlayer: mod.Player, eventCapturePoint: mod.CapturePoint): void
```

#### OnPlayerExitVehicle

This will trigger when a Player exits a Vehicle.

```ts
OnPlayerExitVehicle(eventPlayer: mod.Player, eventVehicle: mod.Vehicle): void
```

#### OnPlayerExitVehicleSeat

This will trigger when a Player exits a Vehicle seat.

```ts
OnPlayerExitVehicleSeat(
  eventPlayer: mod.Player,
  eventVehicle: mod.Vehicle,
  eventSeat: mod.Object
): void
```

#### OnPlayerExitVL7Cloud

This will trigger when a Player exits a VL7Cloud volume.

```ts
OnPlayerExitVL7Cloud(eventPlayer: mod.Player, eventVL7Cloud: mod.VL7Cloud): void
```

#### OnPlayerInteract

This will trigger when a Player interacts with InteractPoint.

```ts
OnPlayerInteract(eventPlayer: mod.Player, eventInteractPoint: mod.InteractPoint): void
```

#### OnPlayerJoinGame

This will trigger when a Player joins the game.

```ts
OnPlayerJoinGame(eventPlayer: mod.Player): void
```

#### OnPlayerLeaveGame

This will trigger when any player leaves the game.

```ts
OnPlayerLeaveGame(eventNumber: number): void
```

#### OnPlayerSwitchTeam

This will trigger when a Player changes team.

```ts
OnPlayerSwitchTeam(eventPlayer: mod.Player, eventTeam: mod.Team): void
```

#### OnPlayerUIButtonEvent

This will trigger when a Player interacts with an UI button.

```ts
OnPlayerUIButtonEvent(
  eventPlayer: mod.Player,
  eventUIWidget: mod.UIWidget,
  eventUIButtonEvent: mod.UIButtonEvent
): void
```

#### OnPlayerUndeploy

This will trigger when the Player dies and returns to the deploy screen.

```ts
OnPlayerUndeploy(eventPlayer: mod.Player): void
```

#### OnPortalGadgetAimStart

This will trigger when a Player presses the Zoom button.

```ts
OnPortalGadgetAimStart(eventPlayer: mod.Player): void
```

#### OnPortalGadgetAimStop

This will trigger when a Player releases the Zoom button.

```ts
OnPortalGadgetAimStop(eventPlayer: mod.Player): void
```

#### OnPortalGadgetFireStart

This will trigger when a Player presses the Fire button.

```ts
OnPortalGadgetFireStart(eventPlayer: mod.Player): void
```

#### OnPortalGadgetFireStop

This will trigger when a Player releases the Fire button.

```ts
OnPortalGadgetFireStop(eventPlayer: mod.Player): void
```

#### OnPortalGadgetLaserToggle

This will trigger when a Player presses the Tactical Device button.

```ts
OnPortalGadgetLaserToggle(eventPlayer: mod.Player, eventBoolean: boolean): void
```

#### OnRayCastHit

This will trigger when a Raycast hits a target.

```ts
OnRayCastHit(eventPlayer: mod.Player, eventPoint: mod.Vector, eventNormal: mod.Vector): void
```

#### OnRayCastMissed

This will trigger when a Raycast is called and doesn't hit any target.

```ts
OnRayCastMissed(eventPlayer: mod.Player): void
```

#### OnRevived

This will trigger when a Player is revived by another Player.

```ts
OnRevived(eventPlayer: mod.Player, eventOtherPlayer: mod.Player): void
```

#### OnRingOfFireZoneSizeChange

This will trigger when a RingOfFire changes size.

```ts
OnRingOfFireZoneSizeChange(eventRingOfFire: mod.RingOfFire, eventNumber: number): void
```

#### OnSpawnerSpawned

This will trigger when an AISpawner spawns an AI Soldier.

```ts
OnSpawnerSpawned(eventPlayer: mod.Player, eventSpawner: mod.Spawner): void
```

#### OnTimeLimitReached

This will trigger when the gamemode time limit has been reached.

```ts
OnTimeLimitReached(): void
```

#### OnVehicleDestroyed

This will trigger when a Vehicle is destroyed.

```ts
OnVehicleDestroyed(eventVehicle: mod.Vehicle): void
```

#### OnVehicleSpawned

This will trigger when a Vehicle is called into the map.

```ts
OnVehicleSpawned(eventVehicle: mod.Vehicle): void
```


## Types

### SDK Object Types

These are opaque SDK handles. You generally only need the type name when reading function signatures.

- `AreaTrigger`
- `Array`
- `Bomb`
- `CapturePoint`
- `DamageType`
- `DeathType`
- `EmplacementSpawner`
- `FixedCamera`
- `HQ`
- `InteractPoint`
- `LootSpawner`
- `MapSpecificFeature`
- `MCOM`
- `Message`
- `Player`
- `PortalEnum`
- `RingOfFire`
- `Sector`
- `SFX`
- `SpatialObject`
- `Spawner`
- `SpawnPoint`
- `Squad`
- `Team`
- `Transform`
- `UIWidget`
- `Variable`
- `Vector`
- `Vehicle`
- `VehicleSpawner`
- `VFX`
- `VL7Cloud`
- `VO`
- `WaypointPath`
- `WeaponPackage`
- `WeaponUnlock`
- `WorldIcon`

### Type Aliases

#### Object

`Object` is a generic SDK object handle. It can refer to any of these Portal object types:

- `AreaTrigger`
- `Bomb`
- `CapturePoint`
- `EmplacementSpawner`
- `FixedCamera`
- `HQ`
- `InteractPoint`
- `LootSpawner`
- `MapSpecificFeature`
- `MCOM`
- `Player`
- `RingOfFire`
- `Sector`
- `SFX`
- `SpatialObject`
- `Spawner`
- `SpawnPoint`
- `Team`
- `Vehicle`
- `VehicleSpawner`
- `VFX`
- `VL7Cloud`
- `VO`
- `WaypointPath`
- `WorldIcon`


## Enums

<details>
<summary><strong>AiInput</strong> (13 values)</summary>

```ts
enum AiInput {
  Crouch,
  FireWeapon,
  Interact,
  Jump,
  Prone,
  Reload,
  SelectCharacterGadget,
  SelectOpenGadget,
  SelectPrimary,
  SelectSecondary,
  SelectThrowable,
  Sprint,
  Strafe,
}
```

</details>

<details>
<summary><strong>AmmoTypes</strong> (6 values)</summary>

```ts
enum AmmoTypes {
  AR_Carbine_Ammo,
  Armor_Plate,
  LMG_Ammo,
  Pistol_SMG_Ammo,
  Shotgun_Ammo,
  Sniper_DMR_Ammo,
}
```

</details>

<details>
<summary><strong>ArmorTypes</strong> (3 values)</summary>

```ts
enum ArmorTypes {
  CeramicArmor,
  NoArmor,
  SoftArmor,
}
```

</details>

<details>
<summary><strong>BombState</strong> (10 values)</summary>

```ts
enum BombState {
  Carried,
  Defusing,
  Dropped,
  Inactive,
  ObjectiveCompleted,
  Planted,
  Planting,
  Resetting,
  Spawned,
  Unspawned,
}
```

</details>

<details>
<summary><strong>Cameras</strong> (4 values)</summary>

```ts
enum Cameras {
  FirstPerson,
  Fixed,
  Free,
  ThirdPerson,
}
```

</details>

<details>
<summary><strong>CustomNotificationSlots</strong> (5 values)</summary>

```ts
enum CustomNotificationSlots {
  HeaderText,
  MessageText1,
  MessageText2,
  MessageText3,
  MessageText4,
}
```

</details>

<details>
<summary><strong>Factions</strong> (2 values)</summary>

```ts
enum Factions {
  NATO,
  PaxArmata,
}
```

</details>

<details>
<summary><strong>Gadgets</strong> (62 values)</summary>

```ts
enum Gadgets {
  CallIn_Air_Strike,
  CallIn_Ammo_Drop,
  CallIn_Anti_Vehicle_Drop,
  CallIn_Artillery_Strike,
  CallIn_Mobile_Redeploy,
  CallIn_Smoke_Screen,
  CallIn_UAV_Overwatch,
  CallIn_Weapon_Drop,
  Class_Adrenaline_Injector,
  Class_Handheld_Jammer,
  Class_Motion_Sensor,
  Class_Repair_Tool,
  Class_Supply_Bag,
  Deployable_Cover,
  Deployable_Deploy_Beacon,
  Deployable_EOD_Bot,
  Deployable_Grenade_Intercept_System,
  Deployable_Missile_Intercept_System,
  Deployable_Portable_Mortar,
  Deployable_Recon_Drone,
  Deployable_Vehicle_Supply_Crate,
  Launcher_Aim_Guided,
  Launcher_Air_Defense,
  Launcher_Auto_Guided,
  Launcher_Breaching_Projectile,
  Launcher_High_Explosive,
  Launcher_IGLA,
  Launcher_Incendiary_Airburst,
  Launcher_Long_Range,
  Launcher_Smoke_Grenade,
  Launcher_Thermobaric_Grenade,
  Launcher_Unguided_Rocket,
  Mask_Gas,
  Mask_NVG,
  Melee_Combat_Knife,
  Melee_Hunting_Knife,
  Melee_Ice_Axe,
  Melee_Serrated_Blade,
  Melee_Sledgehammer,
  Misc_Acoustic_Sensor_AV_Mine,
  Misc_Anti_Personnel_Mine,
  Misc_Anti_Vehicle_Mine,
  Misc_Assault_Ladder,
  Misc_Defibrillator,
  Misc_Demolition_Charge,
  Misc_Incendiary_Round_Shotgun,
  Misc_Laser_Designator,
  Misc_PortalGadget,
  Misc_Sniper_Decoy,
  Misc_Supply_Pouch,
  Misc_Suppression,
  Misc_Tracer_Dart,
  Misc_Tripwire_Sensor_AV_Mine,
  Throwable_Anti_Vehicle_Grenade,
  Throwable_Flash_Grenade,
  Throwable_Fragmentation_Grenade,
  Throwable_Incendiary_Grenade,
  Throwable_Mini_Frag_Grenade,
  Throwable_Proximity_Detector,
  Throwable_Smoke_Grenade,
  Throwable_Stun_Grenade,
  Throwable_Throwing_Knife,
}
```

</details>

<details>
<summary><strong>GameModeTicker</strong> (2 values)</summary>

```ts
enum GameModeTicker {
  None,
  Ticker_Conquest,
}
```

</details>

<details>
<summary><strong>GolmudTrainMoveCommands</strong> (3 values)</summary>

```ts
enum GolmudTrainMoveCommands {
  MoveEast,
  MoveWest,
  Stop,
}
```

</details>

<details>
<summary><strong>GolmudTrainStopReason</strong> (3 values)</summary>

```ts
enum GolmudTrainStopReason {
  ReachedEastTerminal,
  ReachedWestTerminal,
  StoppedInTransit,
}
```

</details>

<details>
<summary><strong>GolmudTrainVariants</strong> (4 values)</summary>

```ts
enum GolmudTrainVariants {
  MovingTrain,
  None,
  StaticTrain_Breakthrough,
  StaticTrain_Rush,
}
```

</details>

<details>
<summary><strong>InventorySlots</strong> (9 values)</summary>

```ts
enum InventorySlots {
  Callins,
  ClassGadget,
  GadgetOne,
  GadgetTwo,
  MeleeWeapon,
  MiscGadget,
  PrimaryWeapon,
  SecondaryWeapon,
  Throwable,
}
```

</details>

<details>
<summary><strong>Maps</strong> (23 values)</summary>

```ts
enum Maps {
  Abbasid,
  Aftermath,
  Badlands,
  Battery,
  Capstone,
  Contaminated,
  Dumbo,
  Eastwood,
  Firestorm,
  GolmudRailway,
  Granite_ClubHouse,
  Granite_MainStreet,
  Granite_Marina,
  Granite_MilitaryRnD,
  Granite_MilitaryStorage,
  Granite_TechCampus,
  Granite_Underground,
  Limestone,
  Outskirts,
  Plaza,
  Sand,
  Subsurface,
  Tungsten,
}
```

</details>

<details>
<summary><strong>MCOMArmType</strong> (2 values)</summary>

```ts
enum MCOMArmType {
  Bomb,
  Default,
}
```

</details>

<details>
<summary><strong>MoveSpeed</strong> (7 values)</summary>

```ts
enum MoveSpeed {
  InvestigateRun,
  InvestigateSlowWalk,
  InvestigateWalk,
  Patrol,
  Run,
  Sprint,
  Walk,
}
```

</details>

<details>
<summary><strong>MusicEvents</strong> (46 values)</summary>

```ts
enum MusicEvents {
  BR_InsertionCinematic_Dropzone_Loop,
  BR_InsertionCinematic_Loop,
  BR_InsertionJump,
  BR_InsertionLanding,
  BR_LastTwoSquads,
  BR_Loss_Early_Loop,
  BR_Loss_EndOfRound_Loop,
  BR_Loss_SecondPlace_Loop,
  BR_Pause,
  BR_RespawnSecondChance,
  BR_RespawnTower,
  BR_Stop,
  BR_Unpause,
  BR_WonRound_Loop,
  BRGauntlet_LobbyFilled,
  BRGauntlet_WaitingForPlayers_Loop,
  Core_Deploy_Loop,
  Core_EndOfRound_Loop,
  Core_LastPhaseBegin,
  Core_Overtime_Loop,
  Core_PauseMenu_Loop,
  Core_PhaseBegin,
  Core_PhaseEnded,
  Core_Stinger_Negative,
  Core_Stinger_Positive,
  Core_Stinger_RankUp,
  Core_Stop,
  Gauntlet_Deploy,
  Gauntlet_Loss_FinalMission_Loop,
  Gauntlet_Loss_Loop,
  Gauntlet_MissionBriefing_Final,
  Gauntlet_MissionBriefing_One,
  Gauntlet_MissionBriefing_Three,
  Gauntlet_MissionBriefing_Two,
  Gauntlet_Pause,
  Gauntlet_Qualified_Loop,
  Gauntlet_Qualified_Outro,
  Gauntlet_Stop,
  Gauntlet_Unpause,
  Gauntlet_Urgency,
  Gauntlet_Urgency_FinalMission,
  Gauntlet_WonOperation_Loop,
  Radio_ClearQueue,
  Radio_NextQueuedTrack,
  Radio_Play,
  Radio_Stop,
}
```

</details>

<details>
<summary><strong>MusicPackages</strong> (4 values)</summary>

```ts
enum MusicPackages {
  BR,
  Core,
  Gauntlet,
  Radio,
}
```

</details>

<details>
<summary><strong>MusicParams</strong> (14 values)</summary>

```ts
enum MusicParams {
  BR_Amplitude,
  BRGauntlet_LobbyTimerRemaining,
  Core_Amplitude,
  Core_IsWinning,
  Core_PhaseUrgency,
  Core_Sector,
  Core_Urgency,
  Gauntlet_Amplitude,
  Radio_Amplitude,
  Radio_Biome,
  Radio_Channel,
  Radio_ContinueQueueOnTrackEnd,
  Radio_LoopQueuedTracks,
  Radio_QueueTrackNumber,
}
```

</details>

<details>
<summary><strong>PlayerDamageTypes</strong> (6 values)</summary>

```ts
enum PlayerDamageTypes {
  Default,
  Explosion,
  Fall,
  Fire,
  Headshot,
  Melee,
}
```

</details>

<details>
<summary><strong>PlayerDeathTypes</strong> (11 values)</summary>

```ts
enum PlayerDeathTypes {
  Deserting,
  Drowning,
  Explosion,
  Fall,
  Fire,
  Headshot,
  Melee,
  Penetration,
  Redeploy,
  Roadkill,
  Weapon,
}
```

</details>

<details>
<summary><strong>PlayerFilterTypes</strong> (4 values)</summary>

```ts
enum PlayerFilterTypes {
  None,
  Player,
  Squad,
  TeamId,
}
```

</details>

<details>
<summary><strong>RestrictedInputs</strong> (20 values)</summary>

```ts
enum RestrictedInputs {
  CameraPitch,
  CameraYaw,
  Crouch,
  CycleFire,
  CyclePrimary,
  FireWeapon,
  Interact,
  Jump,
  MoveForwardBack,
  MoveLeftRight,
  Prone,
  Reload,
  SelectCharacterGadget,
  SelectMelee,
  SelectOpenGadget,
  SelectPrimary,
  SelectSecondary,
  SelectThrowable,
  Sprint,
  Zoom,
}
```

</details>

<details>
<summary><strong>ResupplyTypes</strong> (3 values)</summary>

```ts
enum ResupplyTypes {
  AmmoBox,
  AmmoCrate,
  SupplyBag,
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Abbasid</strong> (1346 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-abbasid) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Aftermath</strong> (1496 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-aftermath) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Badlands</strong> (891 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-badlands) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Battery</strong> (1232 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-battery) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Capstone</strong> (610 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-capstone) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Common</strong> (1473 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-common) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Contaminated</strong> (1346 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-contaminated) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Dumbo</strong> (1499 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-dumbo) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Eastwood</strong> (944 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-eastwood) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_FireStorm</strong> (746 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-firestorm) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_GolmudRailway</strong> (1189 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-golmudrailway) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_Downtown</strong> (1456 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-downtown) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_Marina</strong> (1417 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-marina) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_MilitaryRnD</strong> (1064 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-militaryrnd) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_MilitaryStorage</strong> (1128 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-militarystorage) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_ResidentialNorth</strong> (909 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-residentialnorth) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_TechCenter</strong> (834 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-techcenter) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_Underground</strong> (1430 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-granite-underground) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Limestone</strong> (927 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-limestone) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Outskirts</strong> (842 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-outskirts) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Plaza</strong> (1376 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-plaza) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Sand</strong> (1346 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-sand) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Subsurface</strong> (980 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-subsurface) for the full combined map-aware reference.

</details>

<details>
<summary><strong>RuntimeSpawn_Tungsten</strong> (877 values)</summary>

This is a map-based spatial object enum. See [Spatial Object Reference](/spatial-object-reference#spatial-runtimespawn-tungsten) for the full combined map-aware reference.

</details>

<details>
<summary><strong>ScoreboardType</strong> (5 values)</summary>

```ts
enum ScoreboardType {
  CustomFFA,
  CustomTwoTeams,
  DefaultFFA,
  NotSet,
  Off,
}
```

</details>

<details>
<summary><strong>ScoreCriteria</strong> (2 values)</summary>

```ts
enum ScoreCriteria {
  HighestProgress,
  LowestProgress,
}
```

</details>

<details>
<summary><strong>ScreenEffects</strong> (4 values)</summary>

```ts
enum ScreenEffects {
  Night,
  Saturated,
  Stealth,
  VL7,
}
```

</details>

<details>
<summary><strong>SoldierClass</strong> (4 values)</summary>

```ts
enum SoldierClass {
  Assault,
  Engineer,
  Recon,
  Support,
}
```

</details>

<details>
<summary><strong>SoldierEffects</strong> (3 values)</summary>

```ts
enum SoldierEffects {
  FreezeStatusEffect,
  HeatStatusEffect,
  VL7Effect,
}
```

</details>

<details>
<summary><strong>SoldierStateBool</strong> (23 values)</summary>

```ts
enum SoldierStateBool {
  HasBomb,
  IsAISoldier,
  IsAlive,
  IsBeingRevived,
  IsCrouching,
  IsDead,
  IsDiving,
  IsFiring,
  IsInAir,
  IsInteracting,
  IsInVehicle,
  IsInWater,
  IsJumping,
  IsManDown,
  IsOnGround,
  IsParachuting,
  IsProne,
  IsReloading,
  IsReviving,
  IsSprinting,
  IsStanding,
  IsVaulting,
  IsZooming,
}
```

</details>

<details>
<summary><strong>SoldierStateNumber</strong> (6 values)</summary>

```ts
enum SoldierStateNumber {
  CurrentHealth,
  CurrentWeaponAmmo,
  CurrentWeaponMagazineAmmo,
  MaxHealth,
  NormalizedHealth,
  Speed,
}
```

</details>

<details>
<summary><strong>SoldierStateVector</strong> (4 values)</summary>

```ts
enum SoldierStateVector {
  EyePosition,
  GetFacingDirection,
  GetLinearVelocity,
  GetPosition,
}
```

</details>

<details>
<summary><strong>SpawnModes</strong> (3 values)</summary>

```ts
enum SpawnModes {
  AutoSpawn,
  Deploy,
  Spectating,
}
```

</details>

<details>
<summary><strong>SpectatingGroup</strong> (3 values)</summary>

```ts
enum SpectatingGroup {
  All,
  Squad,
  Team,
}
```

</details>

<details>
<summary><strong>SpotStatus</strong> (4 values)</summary>

```ts
enum SpotStatus {
  SpotInBoth,
  SpotInMinimap,
  SpotInWorld,
  Unspot,
}
```

</details>

<details>
<summary><strong>Stance</strong> (3 values)</summary>

```ts
enum Stance {
  Crouch,
  Prone,
  Stand,
}
```

</details>

<details>
<summary><strong>StationaryEmplacements</strong> (3 values)</summary>

```ts
enum StationaryEmplacements {
  BGM71TOW,
  GDF009,
  M2MG,
}
```

</details>

<details>
<summary><strong>Types</strong> (118 values)</summary>

```ts
enum Types {
  AreaTrigger,
  Array,
  Bomb,
  Boolean,
  CapturePoint,
  DamageType,
  DeathType,
  EmplacementSpawner,
  Enum_AiInput,
  Enum_AmmoTypes,
  Enum_BombState,
  Enum_Cameras,
  Enum_CustomNotificationSlots,
  Enum_Factions,
  Enum_Gadgets,
  Enum_GameModeTicker,
  Enum_GolmudTrainMoveCommands,
  Enum_GolmudTrainStopReason,
  Enum_GolmudTrainVariants,
  Enum_InventorySlots,
  Enum_Maps,
  Enum_MCOMArmType,
  Enum_MoveSpeed,
  Enum_MusicEvents,
  Enum_MusicPackages,
  Enum_MusicParams,
  Enum_PlayerDamageTypes,
  Enum_PlayerDeathTypes,
  Enum_PlayerFilterTypes,
  Enum_RestrictedInputs,
  Enum_ResupplyTypes,
  Enum_RuntimeSpawn_Abbasid,
  Enum_RuntimeSpawn_Aftermath,
  Enum_RuntimeSpawn_Badlands,
  Enum_RuntimeSpawn_Battery,
  Enum_RuntimeSpawn_Capstone,
  Enum_RuntimeSpawn_Common,
  Enum_RuntimeSpawn_Contaminated,
  Enum_RuntimeSpawn_Dumbo,
  Enum_RuntimeSpawn_Eastwood,
  Enum_RuntimeSpawn_FireStorm,
  Enum_RuntimeSpawn_GolmudRailway,
  Enum_RuntimeSpawn_Granite_Downtown,
  Enum_RuntimeSpawn_Granite_Marina,
  Enum_RuntimeSpawn_Granite_MilitaryRnD,
  Enum_RuntimeSpawn_Granite_MilitaryStorage,
  Enum_RuntimeSpawn_Granite_ResidentialNorth,
  Enum_RuntimeSpawn_Granite_TechCenter,
  Enum_RuntimeSpawn_Granite_Underground,
  Enum_RuntimeSpawn_Limestone,
  Enum_RuntimeSpawn_Outskirts,
  Enum_RuntimeSpawn_Plaza,
  Enum_RuntimeSpawn_Sand,
  Enum_RuntimeSpawn_Subsurface,
  Enum_RuntimeSpawn_Tungsten,
  Enum_ScoreboardType,
  Enum_ScoreCriteria,
  Enum_ScreenEffects,
  Enum_SoldierClass,
  Enum_SoldierEffects,
  Enum_SoldierStateBool,
  Enum_SoldierStateNumber,
  Enum_SoldierStateVector,
  Enum_SpawnModes,
  Enum_SpectatingGroup,
  Enum_SpotStatus,
  Enum_Stance,
  Enum_StationaryEmplacements,
  Enum_Types,
  Enum_UIAnchor,
  Enum_UIBgFill,
  Enum_UIButtonEvent,
  Enum_UIDepth,
  Enum_UIImageType,
  Enum_VehicleCategories,
  Enum_VehicleList,
  Enum_VehicleStateVector,
  Enum_VoiceOverEvents2D,
  Enum_VoiceOverFlags,
  Enum_WeaponAttachments,
  Enum_Weapons,
  Enum_WorldIconImages,
  FixedCamera,
  HQ,
  InteractPoint,
  LootMissionObjectManager,
  LootSpawner,
  MapSpecificFeature,
  MCOM,
  Message,
  Number,
  Object,
  Player,
  PortalEnum,
  RingOfFire,
  ScoreboardType,
  ScreenEffect,
  Sector,
  SFX,
  SpatialObject,
  Spawner,
  SpawnPoint,
  Squad,
  String,
  Team,
  Transform,
  UIWidget,
  Variable,
  Vector,
  Vehicle,
  VehicleSpawner,
  VFX,
  VL7Cloud,
  VO,
  WaypointPath,
  WeaponPackage,
  WeaponUnlock,
  WorldIcon,
}
```

</details>

<details>
<summary><strong>UIAnchor</strong> (9 values)</summary>

```ts
enum UIAnchor {
  BottomCenter,
  BottomLeft,
  BottomRight,
  Center,
  CenterLeft,
  CenterRight,
  TopCenter,
  TopLeft,
  TopRight,
}
```

</details>

<details>
<summary><strong>UIBgFill</strong> (9 values)</summary>

```ts
enum UIBgFill {
  Blur,
  GradientBottom,
  GradientLeft,
  GradientRight,
  GradientTop,
  None,
  OutlineThick,
  OutlineThin,
  Solid,
}
```

</details>

<details>
<summary><strong>UIButtonEvent</strong> (6 values)</summary>

```ts
enum UIButtonEvent {
  ButtonDown,
  ButtonUp,
  FocusIn,
  FocusOut,
  HoverIn,
  HoverOut,
}
```

</details>

<details>
<summary><strong>UIDepth</strong> (2 values)</summary>

```ts
enum UIDepth {
  AboveGameUI,
  BelowGameUI,
}
```

</details>

<details>
<summary><strong>UIImageType</strong> (8 values)</summary>

```ts
enum UIImageType {
  CrownOutline,
  CrownSolid,
  None,
  QuestionMark,
  RifleAmmo,
  SelfHeal,
  SpawnBeacon,
  TEMP_PortalIcon,
}
```

</details>

<details>
<summary><strong>VehicleCategories</strong> (7 values)</summary>

```ts
enum VehicleCategories {
  Air_All,
  Air_Heli,
  Air_Plane,
  Ground_All,
  Ground_Combat,
  Ground_Transport,
  Naval_All,
}
```

</details>

<details>
<summary><strong>VehicleList</strong> (26 values)</summary>

```ts
enum VehicleList {
  Abrams,
  AH64,
  AH6M,
  AH6M_Pax,
  Cheetah,
  Couch,
  CV90,
  DirtBike,
  DirtBike_Pax,
  Eurocopter,
  F16,
  F22,
  Flyer60,
  Gepard,
  GolfCart,
  JAS39,
  Leopard,
  M2Bradley,
  Marauder,
  Marauder_Pax,
  Quadbike,
  RHIB,
  SU57,
  UH60,
  UH60_Pax,
  Vector,
}
```

</details>

<details>
<summary><strong>VehicleStateVector</strong> (3 values)</summary>

```ts
enum VehicleStateVector {
  FacingDirection,
  LinearVelocity,
  VehiclePosition,
}
```

</details>

<details>
<summary><strong>VoiceOverEvents2D</strong> (61 values)</summary>

```ts
enum VoiceOverEvents2D {
  CheckPointEnemy,
  CheckPointEnemyAnother,
  CheckPointFriendly,
  CheckPointFriendlyAnother,
  CheckPointMovingToLastEnemy,
  CheckPointMovingToLastFriendly,
  FirstSpawn,
  FirstSpawnDefender,
  GlobalAircraftAvailable,
  GlobalAirstrikeWarning,
  GlobalEOMDefeat,
  GlobalEOMVictory,
  GlobalOutOfBounds,
  MComArmEnemy,
  MComArmFriendly,
  MComDefuseEnemy,
  MComDefuseFriendly,
  MComDestroyedEnemy,
  MComDestroyedFriendly,
  MComDestroyedOneLeftEnemy,
  MComDestroyedOneLeftFriendly,
  ObjectiveCaptured,
  ObjectiveCapturedEnemy,
  ObjectiveCapturedEnemyGeneric,
  ObjectiveCapturedGeneric,
  ObjectiveCapturing,
  ObjectiveContested,
  ObjectiveLocated,
  ObjectiveLockdownEnemy,
  ObjectiveLockdownFriendly,
  ObjectiveLost,
  ObjectiveNeutralised,
  ObjectiveTerritoryLost,
  ObjectiveTerritoryLostGeneric,
  ObjectiveTerritoryTaken,
  ObjectiveTerritoryTakenGeneric,
  PlayerCountEnemyLow,
  PlayerCountFriendlyLow,
  ProgressEarlyLosing,
  ProgressEarlyWinning,
  ProgressLateLosing,
  ProgressLateWinning,
  ProgressMidLosing,
  ProgressMidWinning,
  RoundEndEnemyCapture,
  RoundEndEnemyKills,
  RoundEndFriendlyCapture,
  RoundEndFriendlyKills,
  RoundLastRound,
  RoundStartGeneric,
  RoundSuddenDeath,
  RoundSwitchSides,
  SectorTakenAttacker,
  SectorTakenDefender,
  Time120Left,
  Time30Left,
  Time60Left,
  TimeLow,
  TimeOvertime,
  VehicleArmoredSpawn,
  VehicleTankSpawn,
}
```

</details>

<details>
<summary><strong>VoiceOverFlags</strong> (9 values)</summary>

```ts
enum VoiceOverFlags {
  Alpha,
  Bravo,
  Charlie,
  Delta,
  Echo,
  Foxtrot,
  Golf,
  Hotel,
  India,
}
```

</details>

<details>
<summary><strong>WeaponAttachments</strong> (371 values)</summary>

```ts
enum WeaponAttachments {
  Ammo_Buckshot,
  Ammo_Flechette,
  Ammo_FMJ,
  Ammo_Frangible,
  Ammo_Hollow_Point,
  Ammo_Match_Grade,
  Ammo_Polymer_Case,
  Ammo_Slugs,
  Ammo_Subsonic,
  Ammo_Subsonic_Frangible,
  Ammo_Subsonic_HP,
  Ammo_Synthetic_Tip,
  Ammo_Tungsten_Core,
  Barrel_10_Factory,
  Barrel_10_Full,
  Barrel_102mm_Compact,
  Barrel_105_Custom,
  Barrel_105_Factory,
  Barrel_11_Extended,
  Barrel_11_Heavy,
  Barrel_114mm_Factory,
  Barrel_114mm_Pencil,
  Barrel_115_Commando,
  Barrel_12_Assaulter,
  Barrel_12_SBR,
  Barrel_122mm_Factory,
  Barrel_122mm_Pencil,
  Barrel_125_Fluted,
  Barrel_125_Mid,
  Barrel_13_Factory,
  Barrel_13_Fluted,
  Barrel_13_Prototype,
  Barrel_13_Standard,
  Barrel_135mm_Long,
  Barrel_145_Alt,
  Barrel_145_Carbine,
  Barrel_145_Common,
  Barrel_145_Factory,
  Barrel_145_Standard,
  Barrel_16_Custom,
  Barrel_16_Dissipator,
  Barrel_16_Factory,
  Barrel_16_Pencil,
  Barrel_16_Rifle,
  Barrel_16_Short,
  Barrel_16_US,
  Barrel_165_Basic,
  Barrel_165_Fluted,
  Barrel_165_LSW,
  Barrel_165_Rifle,
  Barrel_17_Cut,
  Barrel_17_Factory,
  Barrel_17_Fluted,
  Barrel_18_Cryogenic,
  Barrel_18_Custom,
  Barrel_18_EBR,
  Barrel_18_Extended,
  Barrel_18_Govt,
  Barrel_18_Pencil,
  Barrel_18_SPR,
  Barrel_18_US_LB,
  Barrel_180mm_Prototype,
  Barrel_180mm_Standard,
  Barrel_185_Factory,
  Barrel_189_Factory,
  Barrel_189_Prototype,
  Barrel_20_Custom_Covert,
  Barrel_20_Factory,
  Barrel_20_HBAR,
  Barrel_20_LE,
  Barrel_20_Lima,
  Barrel_20_Long,
  Barrel_20_OH,
  Barrel_20_SDM_R,
  Barrel_200mm_Custom,
  Barrel_200mm_Custom_H,
  Barrel_200mm_Factory,
  Barrel_200mm_Fluted,
  Barrel_215_Factory,
  Barrel_215_Fluted,
  Barrel_22_E3_Long,
  Barrel_22_Factory,
  Barrel_225mm_Factory,
  Barrel_238mm_Cryogenic,
  Barrel_238mm_Factory,
  Barrel_238mm_Pencil,
  Barrel_24_Bravo,
  Barrel_24_Extended,
  Barrel_24_Fluted,
  Barrel_24_Full,
  Barrel_240mm_Fluted,
  Barrel_240mm_SB,
  Barrel_245mm_Custom,
  Barrel_26_Carbon,
  Barrel_26_Factory,
  Barrel_264mm_Factory,
  Barrel_264mm_Fluted,
  Barrel_264mm_Prototype,
  Barrel_27_Factory,
  Barrel_27_Full,
  Barrel_27_MK22,
  Barrel_303mm_LB,
  Barrel_305mm_Custom,
  Barrel_305mm_Custom_H,
  Barrel_314mm_Factory,
  Barrel_314mm_Fluted,
  Barrel_314mm_Prototype,
  Barrel_32_Custom,
  Barrel_330mm_Mk3,
  Barrel_349mm_Fluted,
  Barrel_349mm_SB,
  Barrel_367mm_Civ,
  Barrel_370mm_Compact,
  Barrel_39_Factory,
  Barrel_39_Pencil,
  Barrel_391mm_CQB,
  Barrel_406mm_Standard,
  Barrel_407mm_Civ_S,
  Barrel_409mm_Cut,
  Barrel_409mm_Factory,
  Barrel_409mm_Fluted,
  Barrel_409mm_US,
  Barrel_415mm_Factory,
  Barrel_415mm_Fluted,
  Barrel_415mm_Prototype,
  Barrel_419mm_Boar_F,
  Barrel_430mm_Cut,
  Barrel_430mm_Factory,
  Barrel_442_mm_CQB,
  Barrel_45_Compact,
  Barrel_450mm_Factory,
  Barrel_450mm_Standard,
  Barrel_457mm_Mk9,
  Barrel_457mm_Urban,
  Barrel_458mm_Custom,
  Barrel_465mm_LB,
  Barrel_480mm_Factory,
  Barrel_480mm_Fluted,
  Barrel_480mm_MG,
  Barrel_5_Factory,
  Barrel_5_Pencil,
  Barrel_508mm_Mk8,
  Barrel_510mm_DMR,
  Barrel_510mm_Fluted,
  Barrel_512_Compact,
  Barrel_514mm_Carbine,
  Barrel_518mm_Factory,
  Barrel_518mm_Fluted,
  Barrel_521mm_Boar,
  Barrel_521mm_Boar_F,
  Barrel_55_Factory,
  Barrel_55_Fluted,
  Barrel_550mm_Factory,
  Barrel_556mm_Prototype,
  Barrel_560mm_Cut,
  Barrel_560mm_Factory,
  Barrel_565mm_Fluted,
  Barrel_565mm_Para,
  Barrel_590mm_Factory,
  Barrel_6_Fluted,
  Barrel_6_Standard,
  Barrel_600mm_Cut,
  Barrel_600mm_DMR,
  Barrel_600mm_Fluted,
  Barrel_600mm_Tabuk,
  Barrel_612mm_VMW,
  Barrel_620mm_Classic,
  Barrel_646mm_Cut,
  Barrel_646mm_Fluted,
  Barrel_646mm_LSW,
  Barrel_65_Extended,
  Barrel_650mm_Factory,
  Barrel_650mm_Fluted,
  Barrel_675_Factory,
  Barrel_68_Factory,
  Barrel_68_Fluted,
  Barrel_730mm_3LR,
  Barrel_75_Compact,
  Barrel_8_Extended,
  Barrel_837_Long,
  Barrel_9_Factory,
  Barrel_9_Fluted,
  Barrel_9_Heavy,
  Barrel_IAR_Heavy,
  Bottom_5_mW_Green,
  Bottom_5_mW_Red,
  Bottom_50_mW_Green,
  Bottom_6H64_Vertical,
  Bottom_Adjustable_Angled,
  Bottom_Alloy_Vertical,
  Bottom_Bipod,
  Bottom_Canted_Stubby,
  Bottom_Canted_Vertical,
  Bottom_Classic_Grip_Pod,
  Bottom_Classic_Vertical,
  Bottom_Compact_Handstop,
  Bottom_Factory_Angled,
  Bottom_Flashlight,
  Bottom_Folding_Stubby,
  Bottom_Folding_Vertical,
  Bottom_Full_Angled,
  Bottom_Laser_Light_Combo_Green,
  Bottom_Laser_Light_Combo_Red,
  Bottom_Low_Profile_Stubby,
  Bottom_PTT_Grip_Pod,
  Bottom_QD_Grip_Pod,
  Bottom_Ribbed_Stubby,
  Bottom_Ribbed_Vertical,
  Bottom_Slim_Angled,
  Bottom_Slim_Handstop,
  Bottom_Stippled_Stubby,
  Bottom_Underslung_Mount,
  Bottom_VIS_IR_Light,
  Ergonomic_A3_Receiver,
  Ergonomic_Aftermarket_Buffer,
  Ergonomic_DLC_Bolt,
  Ergonomic_Improved_Mag_Catch,
  Ergonomic_Magwell_Flare,
  Ergonomic_Match_Trigger,
  Ergonomic_Rail_Cover,
  Left_120_mW_Blue,
  Left_5_mW_Green,
  Left_5_mW_Red,
  Left_50_mW_Blue,
  Left_50_mW_Green,
  Left_Flashlight,
  Left_Range_Finder,
  Left_Taclight__Aimed,
  Left_VIS_IR_Light,
  Magazine_100rnd_Belt_Box,
  Magazine_100rnd_Belt_Pouch,
  Magazine_100rnd_Drum_Mag,
  Magazine_10rnd_Fast_Mag,
  Magazine_10rnd_Magazine,
  Magazine_11rnd_Magazine,
  Magazine_15rnd_Fast_Mag,
  Magazine_15rnd_Magazine,
  Magazine_17rnd_Fast_Mag,
  Magazine_17rnd_Magazine,
  Magazine_200rnd_Belt_Box,
  Magazine_20rnd_Fast_Mag,
  Magazine_20rnd_Magazine,
  Magazine_21rnd_Magazine,
  Magazine_22rnd_Magazine,
  Magazine_23rnd_Magazine,
  Magazine_25rnd_Fast_Mag,
  Magazine_25rnd_Magazine,
  Magazine_27rnd_Magazine,
  Magazine_30rnd_Fast_Mag,
  Magazine_30rnd_Magazine,
  Magazine_35rnd_Magazine,
  Magazine_36rnd_Magazine,
  Magazine_4_Shell_Tube,
  Magazine_40rnd_Fast_Mag,
  Magazine_40rnd_Magazine,
  Magazine_41rnd_Magazine,
  Magazine_45rnd_Fast_Mag,
  Magazine_45rnd_Magazine,
  Magazine_4rnd_Fast_Mag,
  Magazine_4rnd_Magazine,
  Magazine_5_Shell_Tube,
  Magazine_50rnd_Belt_Pouch,
  Magazine_50rnd_Loose_Belt,
  Magazine_50rnd_Magazine,
  Magazine_53rnd_Drum,
  Magazine_5rnd_Fast_Mag,
  Magazine_5rnd_Magazine,
  Magazine_6_Shell_Tube,
  Magazine_60rnd_Drum_Mag,
  Magazine_60rnd_Magazine,
  Magazine_6rnd_Speedloader,
  Magazine_7_Shell_Dual_Tubes,
  Magazine_7_Shell_Tube,
  Magazine_75rnd_Belt_Box,
  Magazine_75rnd_Drum,
  Magazine_7rnd_Fast_Mag,
  Magazine_7rnd_Magazine,
  Magazine_8rnd_Fast_Mag,
  Magazine_8rnd_Magazine,
  Magazine_8rnd_Moon_Clip,
  Magazine_8rnd_Speedloader,
  Magazine_95rnd_Drum,
  Muzzle_Compensated_Brake,
  Muzzle_Compensator,
  Muzzle_CQB_Suppressor,
  Muzzle_Double_port_Brake,
  Muzzle_Double_Port_Brake,
  Muzzle_Flash_Comp,
  Muzzle_Flash_Hider,
  Muzzle_Hybrid_Suppressor_K,
  Muzzle_Hybrid_Suppressor_L,
  Muzzle_Hybrid_Suppressor_S,
  Muzzle_Lightened_Suppressor,
  Muzzle_Linear_Comp,
  Muzzle_Long_Suppressor,
  Muzzle_Single_port_Brake,
  Muzzle_Slant_Brake,
  Muzzle_Standard_Suppressor,
  Muzzle_Thread_Protector,
  Muzzle_Triple_port_Brake,
  Right_120_mW_Blue,
  Right_5_mW_Green,
  Right_5_mW_Red,
  Right_50_mW_Blue,
  Right_50_mW_Green,
  Right_50_MW_Violet,
  Right_Flashlight,
  Right_Laser_Light_Combo_Green,
  Right_Laser_Light_Combo_Red,
  Right_Range_Finder,
  Right_Taclight__Aimed,
  Right_VIS_IR_Light,
  Scope_1P86_LPVO,
  Scope_1p87_150x,
  Scope_1p88_Variable,
  Scope_2Pro_125x,
  Scope_3VZR_175x,
  Scope_A_P2_175x,
  Scope_Adjustable_Magnification_200x,
  Scope_Adjustable_Magnification_300x,
  Scope_Adjustable_Magnification_400x,
  Scope_Anti_Glare_Coating,
  Scope_Aperture_Sight,
  Scope_Baker_300x,
  Scope_BF_2M_250x,
  Scope_Canted_Iron_Sights,
  Scope_Canted_Reflex,
  Scope_Carry_Handle_Irons,
  Scope_CCO_200x,
  Scope_CQ_RDS_125x,
  Scope_CQB_Sights,
  Scope_DVO_LPVO,
  Scope_Flip_Up_Irons,
  Scope_GRIM_150x,
  Scope_Iron_Sights,
  Scope_LDS_450x,
  Scope_LERT_800x,
  Scope_M145_MGO_350x,
  Scope_Magnifier,
  Scope_Mars_F_LPVO,
  Scope_MC_CO_LPVO,
  Scope_Mini_Flex_100x,
  Scope_NFX_800x,
  Scope_NGFC_LPVO,
  Scope_Osa_7_100x,
  Scope_PAS_35_300x,
  Scope_Piggyback_Reflex,
  Scope_PVQ_31_400x,
  Scope_QMK_171A_300x,
  Scope_R_MR_100x,
  Scope_R_VPS_1000x,
  Scope_R4T_200x,
  Scope_RO_M_175x,
  Scope_RO_S_125x,
  Scope_ROX_150x,
  Scope_S_VPS_600x,
  Scope_SDO_350x,
  Scope_SF_G2_500x,
  Scope_SM_Rifle_Variable,
  Scope_SSDS_600x,
  Scope_ST_Prism_500x,
  Scope_SU_123_150x,
  Scope_SU_230_LPVO,
  Scope_TH_RDS_100x,
  Scope_TS_HD_600x,
  Top_120_mW_Blue,
  Top_5_mW_Green,
  Top_5_mW_Red,
  Top_50_mW_Blue,
  Top_50_mW_Green,
  Top_50_MW_Violet,
}
```

</details>

<details>
<summary><strong>Weapons</strong> (61 values)</summary>

```ts
enum Weapons {
  AssaultRifle_AK4D,
  AssaultRifle_B36A4,
  AssaultRifle_KORD_6P67,
  AssaultRifle_L85A3,
  AssaultRifle_M16A4,
  AssaultRifle_M433,
  AssaultRifle_NVO_228E,
  AssaultRifle_SOR_556_Mk2,
  AssaultRifle_TR_7,
  AssaultRifle_VCR_2,
  BattlePickup_MP_RMG,
  BattlePickup_Rorsch_Mk_2_SMRW,
  Carbine_AK_205,
  Carbine_GRT_BC,
  Carbine_M277,
  Carbine_M417_A2,
  Carbine_M4A1,
  Carbine_QBZ_192,
  Carbine_SG_553R,
  Carbine_SOR_300SC,
  DMR_GRT_CPS,
  DMR_LMR27,
  DMR_M39_EMR,
  DMR_SVDM,
  DMR_SVK_86,
  LMG_DRS_IAR,
  LMG_KTS100_MK8,
  LMG_L110,
  LMG_M_60,
  LMG_M121_A2,
  LMG_M123K,
  LMG_M240L,
  LMG_M250,
  LMG_RPK_74M,
  LMG_RPKM,
  Shotgun__185KS_K,
  Shotgun_DB_12,
  Shotgun_M1014,
  Shotgun_M87A1,
  Sidearm_ES_57,
  Sidearm_GGH_22,
  Sidearm_M357_Trait,
  Sidearm_M44,
  Sidearm_M45A1,
  Sidearm_P18,
  Sidearm_VZ_61,
  SMG_CZ3A1,
  SMG_KV9,
  SMG_PP_19,
  SMG_PW5A3,
  SMG_PW7A2,
  SMG_SCW_10,
  SMG_SGX,
  SMG_SL9,
  SMG_UMG_40,
  SMG_USG_90,
  Sniper_L115,
  Sniper_M2010_ESR,
  Sniper_Mini_Scout,
  Sniper_PSR,
  Sniper_SV_98,
}
```

</details>

<details>
<summary><strong>WorldIconImages</strong> (16 values)</summary>

```ts
enum WorldIconImages {
  Alert,
  Assist,
  Bomb,
  BombArmed,
  Cross,
  DangerPing,
  Diffuse,
  EMP,
  Explosion,
  Eye,
  FilledPing,
  Flag,
  Hazard,
  Skull,
  SquadPing,
  Triangle,
}
```

</details>


## Modlib Functions

#### And

```ts
And(...rest: boolean[]): boolean
```

#### AndFn

```ts
AndFn(...rest: ConditionFunction[]): boolean
```


**ConditionFunction**

```ts
type ConditionFunction = () => boolean
```
#### ClearAllCustomNotificationMessages

```ts
ClearAllCustomNotificationMessages(target: mod.Player)
```

#### ClearCustomNotificationMessage

```ts
ClearCustomNotificationMessage(custom: mod.CustomNotificationSlots, target?: mod.Player | mod.Team)
```

#### Concat

export * from './store';

```ts
Concat(s1: string, s2: string)
```

#### ConvertArray

```ts
ConvertArray(array: mod.Array): any[]
```

#### DisplayCustomNotificationMessage

```ts
DisplayCustomNotificationMessage(
  msg: mod.Message,
  custom: mod.CustomNotificationSlots,
  duration: number,
  target?: mod.Player | mod.Team
)
```

#### Equals

```ts
Equals(a: any, b: any)
```

#### FilteredArray

```ts
FilteredArray(array: mod.Array, cond: (currentElement: any) => boolean): mod.Array
```

#### getCapturePointCondition

```ts
getCapturePointCondition(obj: mod.CapturePoint, n: number)
```

#### getGlobalCondition

```ts
getGlobalCondition(n: number)
```

#### getHQCondition

```ts
getHQCondition(obj: mod.HQ, n: number)
```

#### getMCOMCondition

```ts
getMCOMCondition(obj: mod.MCOM, n: number)
```

#### getPlayerCondition

```ts
getPlayerCondition(obj: mod.Player, n: number)
```

#### getPlayerId

```ts
getPlayerId(player: mod.Player): number
```

#### getPlayersInTeam

```ts
getPlayersInTeam(teamObj: mod.Team)
```

#### getSectorCondition

```ts
getSectorCondition(obj: mod.Sector, n: number)
```

#### getSimpleCondition

```ts
getSimpleCondition()
```

#### getTeamCondition

```ts
getTeamCondition(team: mod.Team, n: number)
```

#### getTeamId

```ts
getTeamId(team: mod.Team): number
```

#### getVehicleCondition

```ts
getVehicleCondition(obj: mod.Vehicle, n: number)
```

#### getVehicleSpawnerCondition

```ts
getVehicleSpawnerCondition(obj: mod.VehicleSpawner, n: number)
```

#### IndexOfFirstTrue

```ts
IndexOfFirstTrue(
  array: mod.Array,
  cond: (element: any, arg: any) => boolean, arg: any = null
): number
```

#### IsTrueForAll

```ts
IsTrueForAll(array: mod.Array, condition: (element: any, arg: any) => boolean, arg: any = null)
```

#### IsTrueForAny

```ts
IsTrueForAny(array: mod.Array, condition: (element: any, arg: any) => boolean, arg: any = null)
```

#### ParseUI

```ts
ParseUI(...params: any[])
```


**UIParams**

```ts
interface UIParams {
    name: string;
    type: string;
    position: any;
    size: any;
    anchor: mod.UIAnchor;
    parent: mod.UIWidget;
    visible: boolean;
    textLabel: string;
    textColor: UIVector;
    textAlpha: number;
    textSize: number;
    textAnchor: mod.UIAnchor;
    padding: number;
    bgColor: UIVector;
    bgAlpha: number;
    bgFill: mod.UIBgFill;
    imageType: mod.UIImageType;
    imageColor: UIVector;
    imageAlpha: number;
    teamId?: mod.Team;
    playerId?: mod.Player;
    children?: any[];
    buttonEnabled: boolean;
    buttonColorBase: UIVector;
    buttonAlphaBase: number;
    buttonColorDisabled: UIVector;
    buttonAlphaDisabled: number;
    buttonColorPressed: UIVector;
    buttonAlphaPressed: number;
    buttonColorHover: UIVector;
    buttonAlphaHover: number;
    buttonColorFocused: UIVector;
    buttonAlphaFocused: number
}
```
#### ShowEventGameModeMessage

```ts
ShowEventGameModeMessage(event: mod.Message, target?: mod.Player | mod.Team)
```

#### ShowHighlightedGameModeMessage

```ts
ShowHighlightedGameModeMessage(event: mod.Message, target?: mod.Player | mod.Team)
```

#### ShowNotificationMessage

```ts
ShowNotificationMessage(msg: mod.Message, target?: mod.Player | mod.Team)
```

#### SortedArray

```ts
SortedArray(array: any[], compare: (a: any, b: any) => number)
```

#### WaitUntil

Waits for a provided number of seconds or if the provided condition evaluates to true during that interval.

```ts
async WaitUntil(delay: number, cond: () => boolean)
```


## Modlib Classes

#### ConditionState

```ts
class ConditionState {
    lastState: boolean;
    constructor();
    update(newState: boolean): boolean;
}
```

Source: `code/modlib/index.ts`

#### SimpleConditionState

```ts
class SimpleConditionState {
    update(newState: boolean): boolean;
}
```

Source: `code/modlib/index.ts`

