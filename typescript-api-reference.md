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

SDK version: **1.3.2.0**

This page is generated from the SDK's `code/types/mod/index.d.ts` and `code/modlib/index.ts` files.

<div class="api-filter">
  <label for="api-filter-input">Filter API</label>
  <input id="api-filter-input" v-model="apiFilter" type="search" placeholder="Search functions, types, comments, signatures..." />
</div>

## Summary

| Category | Count |
| --- | ---: |
| event handlers | 70 |
| mod functions | 390 |
| mod function overloads | 523 |
| mod types | 39 |
| mod enums | 70 |
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

Returns the world icon object corresponding to the provided id.

```ts
GetWorldIcon(worldIconNumber: number): WorldIcon
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

Changes the location of a world icon.

```ts
SetWorldIconPosition(worldIcon: WorldIcon, newPosition: Vector): void
```

#### SetWorldIconText

Changes the text appearing above a world icon.

```ts
SetWorldIconText(worldIcon: WorldIcon, newText: Message): void
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

Returns the seat index number for the target player if they are in a vehicle, otherwise returns -1.

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

Returns the emplacement spawner object corresponding to the provided id.

```ts
GetEmplacementSpawner(number: number): EmplacementSpawner
```

#### GetPlayerFromVehicleSeat

Returns the player currently occupying the provided seat index number of the provided vehicle. Note: If no players are in the vehicle seat when this block is called, the returned player will be invalid.

```ts
GetPlayerFromVehicleSeat(vehicle: Vehicle, number: number): Player
```

#### GetVehicleSeatCount

Returns the number of seats in a vehicle.

```ts
GetVehicleSeatCount(vehicle: Vehicle): number
```

#### GetVehicleSpawner

Returns the vehicle spawner object corresponding to the provided id.

```ts
GetVehicleSpawner(number: number): VehicleSpawner
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

#### MoveObject

Move the Object provided, Euler rotation optional

```ts
MoveObject(object: mod.Object, positionDelta: Vector): void
```

```ts
MoveObject(object: mod.Object, positionDelta: Vector, rotationDelta: Vector): void
```

#### MoveObjectOverTime

Moves the Object by the delta position and rotation over the time provided. Options to loop indefinitely and reverse

```ts
MoveObjectOverTime(
  object: mod.Object,
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
  object: mod.Object,
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
  object: mod.Object,
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

#### RotateObject

Rotate the Object provided using Euler angles

```ts
RotateObject(object: mod.Object, rotationDelta: Vector): void
```

#### SetObjectTransform

Sets the transform of the Object provided

```ts
SetObjectTransform(object: mod.Object, transform: Transform): void
```

#### SetObjectTransformOverTime

Sets the transform of the Object provided over the time provided. Options to loop indefinitely and reverse

```ts
SetObjectTransformOverTime(
  object: mod.Object,
  transform: Transform,
  timeInSeconds: number,
  shouldLoop: boolean,
  shouldReverse: boolean
): void
```

#### StopActiveMovementForObject

Stops the Over Time movement for the provided Object if one is active

```ts
StopActiveMovementForObject(object: mod.Object): void
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

Returns the area trigger object corresponding to the provided id.

```ts
GetAreaTrigger(areaTriggerNumber: number): AreaTrigger
```

#### GetCapturePoint

Returns the capture point corresponding to the provided id.

```ts
GetCapturePoint(id: number): CapturePoint
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

Returns the HQ object corresponding to the provided id.

```ts
GetHQ(number: number): HQ
```

#### GetInteractPoint

Returns the interact point object corresponding to the provided id.

```ts
GetInteractPoint(interactPointNumber: number): InteractPoint
```

#### GetLootSpawner

Returns the loot spawner object corresponding to the provided id.

```ts
GetLootSpawner(number: number): LootSpawner
```

#### GetMCOM

Returns the MCOM object corresponding to the provided id.

```ts
GetMCOM(number: number): MCOM
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

Returns the ring of fire object corresponding to the provided id.

```ts
GetRingOfFire(number: number): RingOfFire
```

#### GetSector

Returns the sector object corresponding to the provided id.

```ts
GetSector(number: number): Sector
```

#### GetVL7Cloud

Returns the VL7Cloud object corresponding to the provided id.

```ts
GetVL7Cloud(vl7CloudId: number): VL7Cloud
```

#### GetWaypointPath

Returns the waypoint path object corresponding to the provided id.

```ts
GetWaypointPath(waypointPathNumber: number): WaypointPath
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

#### GetSpawner

Returns the spawner object corresponding to the provided id.

```ts
GetSpawner(number: number): Spawner
```

#### GetSpawnPoint

Returns the spawn point object corresponding to the provided id.

```ts
GetSpawnPoint(number: number): SpawnPoint
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
  prefabEnum: | RuntimeSpawn_Common | RuntimeSpawn_Abbasid | RuntimeSpawn_Aftermath | RuntimeSpawn_Badlands | RuntimeSpawn_Battery | RuntimeSpawn_Capstone | RuntimeSpawn_Contaminated | RuntimeSpawn_Dumbo | RuntimeSpawn_Eastwood | RuntimeSpawn_FireStorm | RuntimeSpawn_Limestone | RuntimeSpawn_Outskirts | RuntimeSpawn_Subsurface | RuntimeSpawn_Tungsten | RuntimeSpawn_Granite_Downtown | RuntimeSpawn_Granite_Marina | RuntimeSpawn_Granite_MilitaryRnD | RuntimeSpawn_Granite_MilitaryStorage | RuntimeSpawn_Granite_ResidentialNorth | RuntimeSpawn_Granite_TechCenter | RuntimeSpawn_Granite_Underground | RuntimeSpawn_Sand | RuntimeSpawn_GolmudRailway,
  position: Vector,
  rotation: Vector,
  scale: Vector
): Any
```

```ts
SpawnObject(
  prefabEnum: | RuntimeSpawn_Common | RuntimeSpawn_Abbasid | RuntimeSpawn_Aftermath | RuntimeSpawn_Badlands | RuntimeSpawn_Battery | RuntimeSpawn_Capstone | RuntimeSpawn_Contaminated | RuntimeSpawn_Dumbo | RuntimeSpawn_Eastwood | RuntimeSpawn_FireStorm | RuntimeSpawn_Limestone | RuntimeSpawn_Outskirts | RuntimeSpawn_Subsurface | RuntimeSpawn_Tungsten | RuntimeSpawn_Granite_Downtown | RuntimeSpawn_Granite_Marina | RuntimeSpawn_Granite_MilitaryRnD | RuntimeSpawn_Granite_MilitaryStorage | RuntimeSpawn_Granite_ResidentialNorth | RuntimeSpawn_Granite_TechCenter | RuntimeSpawn_Granite_Underground | RuntimeSpawn_Sand | RuntimeSpawn_GolmudRailway,
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

Returns the SFX object corresponding to the provided id.

```ts
GetSFX(number: number): SFX
```

#### GetVFX

Returns the VFX object corresponding to the provided id.

```ts
GetVFX(vfxNumber: number): VFX
```

#### GetVO

Returns the VO object corresponding to the provided id.

```ts
GetVO(number: number): VO
```

#### LoadMusic

Loads a music package to then be triggered with the PlayMusic action.

```ts
LoadMusic(musicPackage: MusicPackages): void
```

#### MoveVFX

Move a VFX to a new coordinate. May have become redundant with the creation of the universal MoveObject action.

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

#### GetArgument

Get argument of subroutine at given index.

```ts
GetArgument(subroutineArgIndex: number): Any
```

#### GetFixedCamera

Returns a Fixed Camera.

```ts
GetFixedCamera(number: number): FixedCamera
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
<summary><strong>Gadgets</strong> (61 values)</summary>

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
<summary><strong>Maps</strong> (22 values)</summary>

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
  Sand,
  Subsurface,
  Tungsten,
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

```ts
enum RuntimeSpawn_Abbasid {
  ACModule_01,
  ACModule_02,
  ACModule_03,
  ACModule_03_animated,
  ACModule_03_Running,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_cover,
  ACUnit_03_Running,
  ACUnit_04,
  ACUnit_04_cover,
  ACUnitWindow_01_B,
  AftermathDebrisPileConcrete_Skew_210_B,
  AftermathDebrisPileConcrete_Skew_210_D,
  AirConClusterBuildingSide_01,
  AirConClusterBuildingSide_02,
  AirConClusterBuildingSide_03,
  AirConClusterBuildingSide_04,
  AirConClusterBuildingSide_05,
  AirConClusterBuildingSide_06,
  Anemometer_01,
  AntennaMast_01_BD,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AntennaRooftop_01,
  AntennaSmall_01_A,
  AntennaSmall_01_B,
  Apple_01,
  AppleCluster_01,
  AppleCluster_02,
  ArabicCoffeePlate_01,
  ArabicCoffeeTable_01_A,
  ArabicCoffeeTable_01_B,
  ArchwayFoundation_01,
  ArrabicCoffeeTable_01,
  Artichoke_01,
  ArtichokeCluster_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  Awning_02_C,
  AwningCommercial_02,
  AwningLamps_02,
  AwningLamps_03,
  AwningLargeFlat_01,
  AwningPlastic_01_256,
  AwningPlastic_01_512,
  AwningPlastic_01_512_B,
  AwningPlasticSheet_01,
  AwningWoodO01_128,
  AwningWoodO02_256,
  BalconyBayWindow_01,
  BalconyWood_03,
  BalconyWood_04,
  Banana_01,
  BananaCluster_01,
  BananaPlant_01_S_A,
  BananaPlant_01_S_B,
  BananaPotted_01_S_A,
  BananaPotted_01_S_B,
  BananaPotted_01_S_C,
  BananaPotted_02_S_A,
  BananaWi01_M,
  BananaWildPotted_01_M_A_Oriental,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarricadeboardsWood_01_A,
  BarricadeboardsWood_01_B,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierConcreteWall_01_Row3,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_128x240_DDPF,
  BarrierJersey_01_256x124_B,
  BarrierJersey_03_256x80,
  BarrierJerseyEnd_03_256x80,
  BasketCluster_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Aftermath</strong> (1496 values)</summary>

```ts
enum RuntimeSpawn_Aftermath {
  ACModule_01,
  ACModule_02,
  ACModule_03,
  ACModule_04,
  ACUnit_01,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_Running,
  ACUnit_04,
  ACUnit_04_cover,
  ACUnitInterior_01,
  ACUnitWindow_01_A,
  ACUnitWindow_01_C,
  ACUnitWindow_logo_01,
  Aftermath_DebrisPileConcrete_Skew_210_A_1,
  AftermathDebrisPileBrickPlaster_120_01,
  AftermathDebrisPileBrickPlaster_120_A_1,
  AftermathDebrisPileBrickPlaster_210_01,
  AftermathDebrisPileBrickPlaster_210_A_1,
  AftermathDebrisPileConcrete_Skew_210_D,
  AftermathDebrisPileRedBrick_01_A,
  AftermathDebrisPileRedBrick_01_B,
  AirDuct_02_A_256,
  AirDuct_02_A_512,
  AirDuct_02_A_Corner,
  AirDuct_02_A_End,
  AirDuct_1024_A,
  AirDuct_1024_B,
  AirDuct_256,
  AirDuct_512_A,
  AirDuct_512_B,
  AirDuct_768,
  AirDuct_End_Vent,
  AirDuctPipe_1024_01,
  AirDuctPipe_512_01,
  AirfieldBlastBarrier_01,
  AlleyTrash_02,
  AlleyTrash_02_WinterEvent,
  AntennaRooftop_01,
  Area_01_MechanicalRoom_01,
  Area02_Structure_01,
  Area06_Building_01_A,
  Area06_Building_02_A,
  Area06_Building_03_A,
  Area06_Building_05_A,
  Area07_Building_01,
  Area07_Building_03_A,
  Area07_Building_04,
  Area08_Building_01_A,
  Area08_Building_02,
  Area08_Building_05,
  Area08_Building_06,
  Area08_Building_07,
  Area08_Building_07_PropsA,
  Area08_Building_08,
  Area08_Building_08_PropsA,
  Area08_Building_09_PropsDressingA,
  Area08_Building_10_Destroyed,
  Area08_Building_11,
  Area10_Building_01_OOB,
  Area10_Building_02_OoB,
  AsphaltBroken_01_512x256,
  AsphaltBroken_01_512x512,
  AsphaltBrokenThick_01_512x512,
  AsphaltChunks_01_Snow,
  AsphaltChunks_02,
  AsphaltChunks_03,
  AwningCommercial_02,
  Backpack_01,
  BackroomStorageShe01,
  BannerPole_01,
  BannerWall_01,
  BarCounter_02,
  BarebulbPendant_01,
  BarrelLabratory_01_115,
  BarrelOil_01_C,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_06,
  BarrelOil_03,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Badlands</strong> (891 values)</summary>

```ts
enum RuntimeSpawn_Badlands {
  Abra01_Chassis,
  Abra01_Tracks,
  Abra01_Turret,
  AbraCoveredTarp,
  AcaciaUrban_01_S,
  ACUnit_04,
  ACUnit_04_Off,
  ACUnitWindow_01_A,
  ACUnitWindow_01_C,
  ACUnitWindow_logo_01,
  AftermathDebrisPileConcrete_Center_120,
  AftermathDebrisPileConcrete_Center_120_B,
  AftermathDebrisPileConcrete_Center_60,
  AftermathDebrisPileConcrete_Center_60_B,
  AftermathDebrisPileConcrete_Skew_120,
  AftermathDebrisPileConcrete_Skew_120_B,
  AftermathDebrisPileConcrete_Skew_210_C,
  AftermathDebrisPileConcrete_Skew_210_E,
  AftermathDebrisPileDrywall_Center_120_01,
  AftermathDebrisPileDrywall_Center_120_01_B,
  AftermathDebrisPileDrywall_Center_60_01,
  AftermathDebrisPileDrywall_Center_60_01_B,
  AftermathDebrisPileDrywall_Ramp_210_01,
  AftermathDebrisPileDrywall_Ramp_210_01_B,
  AirfieldBlastBarrier_01,
  AlleyTrash_01,
  AlleyTrash_02,
  AntennaMast_01,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AntennaSmall_01_A,
  AshTray_01_B,
  AsphaltChunks_01,
  AsphaltChunks_02,
  Backpack_01_B,
  Backpack_02,
  Backpack_03,
  Badlands_Flankbus,
  BagTarp_01,
  Barrack_01_A,
  Barrack_01_A_Props,
  Barrack_01_A_Props_B,
  Barrack_01_A_Props_C,
  Barrack_01_A_Props_D,
  Barrack_01_A_Props_E,
  Barrack_02_B_01_MP_Badlands,
  Barrack_02_B_02_MP_Badlands,
  Barrack_02_B_03_MP_Badlands,
  Barrack_02_B_04_MP_Badlands,
  Barrack_02_B_05_MP_Badlands,
  Barrack_02_B_06_MP_Badlands,
  Barrack_02_B_Props,
  Barrack_02_B_Props_B,
  Barrack_02_B_Props_C,
  Barrack_02_B_Props_D,
  Barrack_02_B_Props_E,
  Barrack_02_B_Props_F,
  BarrackCylindrical_AirStrip_01_Props,
  BarrackCylindrical_AirStrip_01_Props_B_MP,
  BarrackStair_01,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_03,
  BarrelOilExplosive_01_DDPF_B,
  BarrierBlockConcrete_01_256x120,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierBlockConcrete_03_128_120,
  BarrierBlockConcreteRound_01,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierConstruction_01_256_120_B,
  BarrierConstruction_01_256_120_DDPF,
  BarrierJersey_01_256x124,
  BarrierJersey_01_256x124_B,
  BeachTrailStairs_01,
  BenchWood_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Battery</strong> (1232 values)</summary>

```ts
enum RuntimeSpawn_Battery {
  AAGun_01,
  ACModule_01,
  ACModule_02,
  ACModule_03,
  ACModule_04,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_Running,
  ACUnit_04,
  AftermathDebrisPileBrickPlaster_120,
  AftermathDebrisPileBrickPlaster_120_01,
  AftermathDebrisPileBrickPlaster_210,
  AftermathDebrisPileBrickPlaster_210_01,
  AgaveAmericana_01_S_A,
  AgaveAmericana_01_S_B,
  AgaveAmericanaPotted_01_S_B,
  AirControlTower_02,
  AirportTerminalLarge_01,
  AirportTerminalStorage_01,
  Anemometer_01,
  AntennaRooftop_01,
  AntennaSmall_01_A,
  AntennaSmall_01_B,
  Architecture_01_A,
  Architecture_01_B,
  Architecture_01_C,
  Architecture_01_D,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  AwningPlastic_01_256,
  AwningPlastic_01_256_MP_Battery,
  AwningPlastic_01_512,
  AwningPlastic_01_512_MP_Battery,
  BackdropMeshes,
  BananaPlant_01_S_A,
  BananaPlant_01_S_B,
  BananaPotted_01_S_A,
  BananaPotted_01_S_B,
  BananaPotted_01_S_C,
  BananaPotted_02_S_A,
  BananaPotted_02_S_B,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_06,
  BarrelOil_03,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierBlockConcrete_03_128_120,
  BarrierConcreteWall_01_160x385,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x240,
  BarrierPlastic_01,
  BasketballNet_01,
  Bench_01,
  Bicycle_01_C,
  BikeURack_01,
  BlackLocust_01_M_A,
  BlackLocust_01_M_B,
  BlackLocust_01_S,
  BlockClusterConcrete_01_B,
  Bollard_01_C,
  Bollard_03_B,
  Bollard_04,
  Books_01_D,
  Bookshe01,
  BooksPile_01_A,
  BooksPile_01_C,
  Bottle_02,
  BottleKetchup_01,
  Bougainvillea_01_L_B,
  Bougainvillea_01_M,
  BougainvilleaPotted_01_M,
  BoxCardboard_01_A,
  BoxCardboard_01_B,
  BoxCardboard_01_C,
  BoxCardboard_01_D,
  BoxCardboard_01_E,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Capstone</strong> (610 values)</summary>

```ts
enum RuntimeSpawn_Capstone {
  ACModule_03,
  ACUnit_03,
  ACUnit_04,
  ACUnit_04_Support,
  AftermathDebrisPileVillage_120_01,
  AntennaRooftop_01,
  AntennaSmall_01_A,
  AntennaTall_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  Awning_02_A,
  Awning_02_B,
  Awning_02_C,
  Awning_02_D,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarrelOil_01_group_05,
  BarrelOilExplosive_01_DDPF_B,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierBlockConcrete_03_128_120,
  BarrierConcreteRoadSide_01_A,
  BarrierConcreteRoadSide_01_A_DDPF,
  BarrierConcreteRoadSide_01_B,
  BarrierConcreteRoadSide_01_B_DDPF,
  BarrierConcreteRoadSide_02_A,
  BarrierConcreteRoadSide_02_B,
  BarrierConcreteWall_01_192x320,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x240,
  BarrierHesco_01_256x240,
  BarrierHesco_01_64x60,
  BarrierJersey_01_256x124_B,
  BarrierJersey_02_256_120,
  BasketballNet_01,
  BenchRural_01,
  BenchWood_01,
  Bicycle_01_C,
  BooksPile_01_A,
  BooksPile_01_C,
  BorderFence_01_2048,
  BorderFence_01_512,
  BorderFenceDoor_01,
  BorderFenceDoorFrame_01,
  Bottle_01_B,
  Bottle_02,
  BoxCardboard_01_A,
  BoxCardboard_01_C,
  BoxCardboard_01_D,
  BoxCardboard_01_E,
  BoxCardboardStackSmall_01,
  BoxesCardboardStack_01_D,
  BrokenAsphaltRidge_01,
  BrokenAsphaltRidge_02_B,
  BrokenAsphaltRidge_03_B,
  Broom_01,
  Bucket_01,
  Bucket_02,
  BucketMetal_01,
  BunkerCollapse_01,
  BunkerCollapse_01_B,
  BunkerCollapseHesco_01,
  CardboardPaper_02,
  Carpet_01_D,
  Carpet_02_Folded,
  Carpet_02_Pile,
  CarSedan_02,
  CarSedan_02_Door_FrontLeft,
  CarSedan_02_Door_FrontRight,
  CarSedan_02_Door_RearLeft,
  CarSedan_02_Door_RearRight,
  CarSedan_02_Hood,
  CarSedan_02_Trunk,
  CarSedan_03,
  CarSedan_03_Door_FrontLeft,
  CarSedan_03_Door_FrontRight,
  CarSedan_03_Door_RearLeft,
  CarSedan_03_Door_RearRight,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Common</strong> (1471 values)</summary>

```ts
enum RuntimeSpawn_Common {
  AI_Spawner,
  AI_WaypointPath,
  AmmoChest_Small_01,
  AmmoChest_Small_Ext_01,
  AmmoChest_Small_Int_01,
  AmmoChest_Small_Lid_01,
  AreaTrigger,
  BallGo01,
  BarbedWire_01_B,
  BarrelOil_01_A,
  BarrelOilExplosive_01,
  BarrelOilFire_01,
  BarriersPedestrian_01_B,
  BarrierStoneBlock_01_A,
  BarrierStoneBlock_01_B,
  BarrierStoneBlock_01_C,
  BarrierStoneBlock_01_D,
  BarrierStoneBlock_01_E,
  BarrierStoneBlock_01_F,
  BarrierStoneBlock_01_G,
  BarrierStoneBlock_01_H,
  Basketball_01,
  BeverageFridge_01_B,
  BroadleafUrban_01_L_A,
  BroadleafUrban_01_M_B,
  CameraSurveillance_01_B,
  CapturePoint,
  CautionSticker_01,
  CCTVSign_01,
  ChairPlastic_01_A,
  ChairPlastic_01_B,
  CinderblockStack_01_A_120,
  CinderblockStack_01_A_180,
  CinderblockStack_01_A_60,
  CinderblockStack_01_B_120,
  CinderblockStack_01_B_180,
  CinderblockStack_01_B_60,
  CinderblockStack_01_C_120,
  CinderblockStack_01_C_180,
  CommandPost_01_A,
  CommandPost_01_DoorFront,
  CommandPost_01_DoorRear,
  CommandPost_01_Drone_Props,
  CommandPost_01_PropsA,
  CommandPost_01_PropsB,
  CommandPost_01_PropsC,
  ConcretePipe_01_512x160,
  ConcretePipe_01_512x256,
  ConstructionSetDoorwayConcrete_01_256x512x64,
  ConstructionSetPillar_01_C_96x512x96,
  ConstructionSetPillar01_A_128x512x128,
  ConstructionSetPillarChip_01_B_128x512x128,
  ConstructionSetRebar_01_A_96x512x32,
  ConstructionSetRebar_01_A_96x512x32_Destructible,
  ConstructionSetRebar_01_B_96x128x32,
  ConstructionSetStairs_01_A_320x288x384,
  ContainerStandard_01_1280,
  Crate_01_A,
  Crate_03_B,
  CrateAmmo_01,
  CrateAmmo_01_StackA,
  CrateAmmo_01_StackB,
  CrateAmmo_01_StackC,
  CrateAmmo_01_StackD,
  CrateAmmo_02,
  CrateAmmo_03,
  CrateMetal_01_B,
  CrateWeapon_01,
  CypressItalian_01_M_A,
  DecalStrip_01_1024,
  DecalStrip_01_2048,
  DecalStrip_01_512,
  DeployCam,
  ElectricalOutletDimmer_01,
  ElectricalOutletSockets_01,
  ElectricalOutletSwitch_01,
  EnvironmentDecalVolume_Winter_Event,
  FireAlarmButton_01,
  FiringRange_CableTray_01,
  FiringRange_Ceiling_01_A,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Contaminated</strong> (1346 values)</summary>

```ts
enum RuntimeSpawn_Contaminated {
  ACUnit_03,
  ACUnit_04_Support,
  AftermathDebrisPileMetal_210_01,
  AftermathDebrisRocks_310,
  AftermathDebrisRocks_310_B,
  AircraftWreckage_Jas39_01_Body,
  AirDuct_02_A_256,
  AirDuct_02_A_512,
  AirDuct_02_A_Corner,
  AirDuct_02_A_End,
  AirDuct_02_A_Joint,
  AirDuctPipe_01,
  AirDuctPipe_01_C90,
  AirDuctPipe_1024_01,
  AirDuctPipe_256_01,
  AirDuctPipe_256_C90_01,
  AirDuctPipe_512_01,
  AirDuctPipeCap_01,
  AirplaneJAS39_01,
  AirplaneJAS39_01_B,
  AirplaneJAS39_01_C,
  AirplaneJAS39_Repair_01,
  AirplaneJAS39Body,
  AirplaneJAS39Cab_01_Contaminated,
  AirplaneJAS39Cloth_01,
  AirplaneJAS39Cockpit_01,
  AirplaneJAS39EnginePlugsBack_01,
  AirplaneJAS39EnginePlugsLeft_01,
  AirplaneJAS39EnginePlugsRight_01,
  AirplaneJAS39Frame_01,
  AirplaneJAS39Frame_01_Contaminated,
  AirplaneJAS39Frame_02,
  AirplaneJAS39FuelTank_01,
  AirplaneJAS39LeftWing,
  AlleyTrash_02,
  AlleyTrash_06,
  AlleyTrash_08,
  AluminumBench_01,
  Antenna_01,
  Antenna_01_B,
  Antenna_02_B,
  AntennaRooftop_01,
  AntennaSmall_01_A,
  AntennaSmall_01_B,
  AntennaTall_01,
  AshTray_01_B,
  AsphaltChunks_01,
  AsphaltChunks_01_Snow,
  AsphaltChunks_02,
  AsphaltChunks_03,
  Backpack_01_B,
  Backpack_02,
  Backpack_03,
  BackroomStorageShe01,
  BagTarp_01,
  BannerFlag_01_Static_OnlyDamageProcess,
  BannerFlag_02_Static_OnlyDamageProcess,
  Barrack_01_A_1_Var_01,
  Barrack_02,
  Barrack_02_B,
  Barrack_02_B_03_MP_Contaminated,
  Barrack_02_B_Props_C,
  Barrack_02_B_Props_E,
  Barrack_02_E,
  Barrack_02_F,
  BarrackStair_01,
  BarrackStair_01_B,
  BarrelBurned_01,
  BarrelLabratory_01_115,
  BarrelLabratory_01_115_DDPF,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_01_group_06,
  BarrelOil_03,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierBlockConcrete_03_128_120,
  BarrierBlockConcreteRound_01,
  BarrierConcreteWall_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Dumbo</strong> (1499 values)</summary>

```ts
enum RuntimeSpawn_Dumbo {
  ACModule_01_VFX,
  ACModule_02,
  ACModule_02_VFX,
  ACModule_03,
  ACModule_04,
  ACUnit_03_animated,
  ACUnit_03_cover,
  ACUnit_03_Running,
  ACUnit_04,
  ACUnit_04_cover,
  ACUnitWindow_01_D,
  Aftermath_DebrisPileConcrete_Skew_210_A_1,
  AftermathDebrisPileBrickPlaster_120,
  AftermathDebrisPileBrickPlaster_120_01,
  AftermathDebrisPileBrickPlaster_120_A_1,
  AftermathDebrisPileBrickPlaster_210,
  AftermathDebrisPileBrickPlaster_210_01,
  AftermathDebrisPileBrickPlaster_210_A_1,
  AftermathDebrisPileConcrete_Skew_210_A,
  AftermathDebrisPileConcrete_Skew_210_B,
  AftermathDebrisPileConcrete_Skew_210_D,
  AftermathDebrisPileRedBrick_01_A,
  AftermathDebrisPileRedBrick_01_B,
  AgaveAmericana_01_S_A,
  AgaveAmericanaPotted_01_S_A,
  Ailanthis_01_S,
  Ailanthis_01_S_B,
  Ailanthis_01_S_C,
  Ailanthis_01_S_D,
  Ailanthis_01_S_E,
  AirDuct_1024_B,
  AirDuct_512_B,
  AirDuct_End_Bend_Up_A_Dull,
  AirDuct_End_Vent,
  AirDuctPipe_256_01,
  AirDuctPipe_256_C90_01,
  AirDuctPipe_512_01,
  AirfieldBlastBarrier_01,
  AlleyTrash_01,
  AlleyTrash_02,
  Antenna_01,
  AntennaRooftop_01,
  AntennaSmall_01_B,
  Area02_Office_01,
  Area02_Restroom_01,
  Area03_Building_01,
  Area03_Building_04,
  Area03_Building_06,
  Area03_GarbageRoom_01,
  Area03_Restroom_01,
  Area03_Restroom_02,
  Area04_Building_01,
  Area04_Building_02,
  Area04_Building_03,
  Area04_Building_04,
  Area04_Building_06,
  Area04_Building_08,
  Area04_Building_09,
  Area04_Scaffolding_01,
  Area04_Scaffolding_02,
  Area04_Tenement_01_1920x1728_C90_A_01,
  Area05_Tenement_01_1920x1728_C90_A_01,
  Area05_Tenement_01_1920x1728_C90_A_02,
  Area05_Tenement_01_832x1728_A_02,
  Area05_TenementHouse_01_832x1344_A_02,
  Area05_TenementHouse_01_832x1344_A_03,
  Area06_Building_01_B,
  Area06_Building_02_B,
  Area06_Building_03_B,
  Area06_Building_04_B,
  Area06_Building_05_B,
  Area06_Building_06_B,
  Area06_Tenement_01_1920x1728_C90_A_01,
  Area06_Tenement_01_1920x1728_C90_A_02,
  Area06_TenementHouse_01_832x1344_A_01,
  Area06_TenementHouse_01_832x1344_A_02,
  Area07_BlockBuilding_01,
  Area07_Building_01_B,
  Area07_Building_02_B,
  Area07_Building_03_B,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Eastwood</strong> (944 values)</summary>

```ts
enum RuntimeSpawn_Eastwood {
  AcaciaUrban_01_S,
  ACModule_01,
  ACModule_03_animated,
  AdirondackChair_01,
  AftermathDebrisPileDrywall_Center_120_01,
  AftermathDebrisPileDrywall_Center_120_01_B,
  AftermathDebrisPileDrywall_Center_60_01,
  AftermathDebrisPileDrywall_Center_60_01_B,
  AftermathDebrisPileDrywall_Ramp_210_01,
  AftermathDebrisPileDrywall_Ramp_210_01_B,
  AgaveAmericana_01_S_A,
  AgaveAmericana_01_S_B,
  AgaveAmericanaPotted_01_S_A,
  AntennaMast_01,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AshTray_01_B,
  AshTray_01_VFX,
  AshTrayCigarettes_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  BackroomStorageShe01,
  BagTarp_01,
  BananaPlant_01_S_A,
  BananaPlant_01_S_B,
  BananaPotted_01_S_B,
  BananaWi01_M,
  BananaWildPotted_01_M,
  BananaWildPotted_01_M_A_Oriental,
  BarCounter_01_128,
  BarCounterCabinet_01_B,
  BarCounterCorner_01,
  BarCounterEndLeft_01,
  BarCounterEndRight_01,
  BarCounterFridge_01,
  BarCounterGlassFridge_01,
  BarGantry_01,
  BarrelBurned_01,
  BarrelLabratory_01_115,
  BarrelLabratory_01_115_DDPF,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarrelOilExplosive_01_DDPF_B,
  BarrierConcreteWall_01_192x320,
  BarrierHesco_01_64x60,
  BarrierJersey_01_256x124_B,
  BarTableLong_01,
  BasketballNet_01,
  BathroomKit_01A,
  BathroomSink_02,
  BeachLoungeChair_01,
  BeachRock_01,
  BedSetSleepmat_01,
  BeerTap_01,
  Bicycle_01_B,
  Bicycle_01_C,
  Billboard_01,
  Billboard_01_Ads_Food,
  Billboard_Sign,
  Bin_01,
  Binoculars_01,
  BirdsOfParadise_01_M_A,
  BirdsOfParadise_01_M_B,
  Bollard_01_256,
  Bollard_01_512,
  Bollard_01_D,
  Bollard_04,
  Bookcase_02,
  Books_01_A,
  Books_01_B,
  Books_01_D,
  BooksPile_01_A,
  BooksPile_01_B,
  BooksPile_01_C,
  BooksPile_01_D,
  Bottle_01_A,
  Bottle_01_B,
  Bottle_01_C,
  Bottle_02,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_FireStorm</strong> (746 values)</summary>

```ts
enum RuntimeSpawn_FireStorm {
  AcaciaUrban_01_S,
  ACUnit_04,
  AftermathDebrisPileConcrete_Center_120,
  AftermathDebrisPileConcrete_Center_120_B,
  AftermathDebrisPileConcrete_Skew_120,
  AftermathDebrisPileConcrete_Skew_120_B,
  AftermathDebrisPileConcrete_Skew_210_C,
  AftermathDebrisPileConcrete_Skew_210_E,
  AirDuct_02_A_256,
  AirDuct_02_A_512,
  AirDuct_02_A_End,
  Antenna_01,
  AntennaTall_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  AviationLight_01,
  Barrack_01_A_Firestorm,
  BarrelBurned_01,
  BarrelOil_03,
  BarricadeboardsWood_01_B,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_03_128_120,
  BarrierConcreteWall_01_160x385,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierConcreteWall_01_Row2,
  BarrierConcreteWall_01_Row3,
  BarrierConcreteWall_01_Row4,
  BarrierConstruction_01_256_120,
  BarrierConstruction_01_256_120_B,
  BarrierConstruction_01_256_120_DDPF,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_128x240_DDPF,
  BarrierHesco_01_256x240,
  BarrierHesco_01_64x60,
  BarrierHesco_01_64x60_DDPF,
  BarrierHesco_01_Row01b,
  BarrierHesco_01_Row03,
  BarrierHesco_01_Row06,
  BarrierJersey_01_256x124_B,
  BarrierPlastic_01,
  BeamRefinery_01_A_32x32x256,
  BeamRefinery_01_A_32x32x320,
  BeamRefinery_01_A_32x32x768,
  BeamRefinery_01_B_32x32x256,
  BeamRefinery_01_B_32x32x512,
  BeamRefinery_01_F_32x512,
  BeamRefinery_01_F_CV90_128x128,
  BeamRefinery_01_F_CV90_192x192,
  BeamRefineryConnector_01_CV180_48x64,
  BeamRefineryConnector_01_CV90_48x48,
  BeamRefineryFoundation_01_1024x1024x320,
  BeamRefineryFoundation_01_1152x128x320,
  BeamRefineryFoundation_01_128x128x320,
  BeamRefineryFoundation_01_144x144x320,
  BeamRefineryFoundation_01_1536x128x320,
  BeamRefineryFoundation_01_512x128x320,
  BeamRefineryFoundation_01_80x80x320,
  BedMilitary_01_B,
  BenchRural_01,
  Billboard_04_A,
  Billboard_04_B,
  Billboard_04_C,
  Billboard_04_Sign,
  BoxCardboard_01_C,
  BoxCardboard_01_D,
  BoxCardboard_01_E,
  BoxCardboardStackSmall_01,
  BoxesCardboardStack_03_A,
  BoxesPallet_01_sand,
  BoxesPallet_02,
  BoxesPallet_03,
  BR_StorageRoof_01_A_1024x512,
  BR_StorageRoof_01_A_512,
  BreachingSledgeHammer_01,
  Brick_01,
  BrickPile_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_GolmudRailway</strong> (1189 values)</summary>

```ts
enum RuntimeSpawn_GolmudRailway {
  ACModule_01,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_Running,
  ACUnit_04_Support,
  ACUnitInterior_01,
  AftermathDebrisPileBrickPlaster_120,
  AftermathDebrisPileConcrete_Skew_120,
  AftermathDebrisPileConcrete_Skew_120_B,
  AftermathDebrisPileConcrete_Skew_210_A,
  AftermathDebrisPileVillage_120_01,
  AgaveAmericanaPotted_01_S_A,
  AgaveAmericanaPotted_01_S_B,
  AirConClusterBuildingSide_01,
  AirplaneJAS39_Repair_01,
  AlleyTrash_01,
  AlleyTrash_02,
  AlleyTrash_03,
  AlleyTrash_04,
  AlleyTrash_05,
  AlleyTrash_06,
  AlleyTrash_07,
  AlleyTrash_08,
  AluminumBench_01,
  AmmoStack_01,
  AnimalDungLarge_01,
  Antenna_01,
  Antenna_01_B,
  Antenna_02,
  AntennaMast_01,
  AntennaMastMetal_01,
  AntennaRooftop_01,
  AntennaTall_01,
  Apple_01,
  AppleCluster_01,
  ArabicCoffeeTable_01_B,
  ArchwayFoundation_01,
  Area_01_Base,
  Area_01_MechanicalRoom_01,
  Area_02_Base,
  Area_02_SetDressing,
  Area_03_base,
  Area02_Scaffolding_01,
  Area02_Structure_01,
  AshTray_01,
  AshTrayCigarettes_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  AttackerHQAll_01,
  Awning_02_A,
  Awning_02_C,
  AwningPlastic_01_512,
  BackdropMountains_01,
  Badlands_Flankbus,
  BananaPlant_01_S_A,
  BananaPotted_01_S_B,
  BananaPotted_02_S_B,
  BannerFlag_01_Static,
  BannerFlag_02_Static_OnlyDamageProcess,
  Barn_01,
  Barn_01_Mirrored,
  Barn_01_Props,
  Barn_01_Props_Mirrored,
  Barrack_01_A_Props_A_Golmud,
  Barrack_01_Props_B_Golmud,
  Barrack_02_B_Props,
  Barrack_02_E,
  Barrack_02_F,
  BarrackCylindrical_Airstrip_01_Props_B,
  BarrelOil_01,
  BarrelOil_01_B,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_03,
  BarrelOilExplosive_01_DDPF_B,
  Barrels_01,
  BarricadeboardsWood_01_A,
  BarricadeboardsWood_01_B,
  BarrierBlockConcrete_01_256x120,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_Downtown</strong> (1456 values)</summary>

```ts
enum RuntimeSpawn_Granite_Downtown {
  _3DSignChavel1883_01,
  _3DSignChavelNoir_01,
  _3DSignDoubleDipDonuts_01,
  _3DSignDoubleDipDonuts_02,
  _3DSignFleurDeForet_01,
  _3DSignImperia_01,
  _3DSignKoada_01,
  _3DSignLAtelier_01,
  _3DSignLussore_01,
  _3DSignSantoVernne_01,
  _3DSignVisteria_01,
  AcaciaUrban_01_S,
  ACModule_01,
  ACModule_02,
  ACModule_03,
  ACModule_04,
  AgaveAmericana_01_S_A,
  AgaveAmericana_01_S_B,
  AirDuct_02_A_256,
  AirDuct_02_A_512,
  AirDuct_02_A_Corner,
  AirDuct_02_A_End,
  AirDuct_1024_A,
  AirDuct_256,
  AirDuct_512_A,
  AirDuct_768,
  AirDuct_Bend_90_128,
  AirDuct_Bend_90_128_B,
  AirDuct_End,
  AirDuct_End_Bend_Up,
  AlleyTrash_01,
  AlleyTrash_02,
  AluminumGangway_01_1024,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AntennaSmall_01_A,
  AshTray_01_B,
  AshTrayCigarettes_01,
  AsphaltBrokenSmall_01,
  AsphaltBrokenThick_01_512x512,
  AsphaltChunks_01,
  AsphaltChunks_02,
  ATMMachine_01,
  AutoCapture_Terrain,
  Backpack_01,
  Backpack_03,
  BackroomStorageShe01,
  BackroomStorageShe01_B,
  BagTarp_01,
  BananaPlant_01_S_A,
  BananaPlant_01_S_B,
  BananaPotted_01_S_C,
  BananaPotted_02_S_B,
  BannerPole_01,
  BarCounter_01_128,
  BarCounter_01_256,
  BarCounterCabinet_03_128,
  BarCounterCabinet_03_256,
  BarCounterCorner_01,
  BarCounterCorner_03,
  BarCounterDivider_03_128,
  BarCounterDivider_03_256,
  BarCounterEndLeft_01,
  BarricadeboardsWood_01_A,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_03_128_120,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_128x240_DDPF,
  BarrierHesco_01_256x240,
  BarrierJersey_01_256x124_B,
  BarrierPlastic_01,
  BarriersPedestrian_01_A,
  BasketballNet_01,
  BasketWicker_01,
  BeachBall_01_B,
  Beachfront_OutdoorDining_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_Marina</strong> (1417 values)</summary>

```ts
enum RuntimeSpawn_Granite_Marina {
  _3DSignDoubleDipDonuts_01,
  _3DSignDoubleDipDonuts_02,
  _3DSignLussore_01,
  _3DSignSantoVernne_01,
  _3DSignVisteria_01,
  AcaciaUrban_01_S,
  ACModule_01,
  ACModule_02,
  ACModule_04,
  AdirondackChair_01,
  AgaveAmericana_01_S_A,
  AgaveAmericana_01_S_B,
  Airconditioner_01_B,
  AirDuct_1024_A,
  AirDuct_256,
  AirDuct_512_A,
  AirDuct_768,
  AirDuct_Bend_90_128,
  AirDuct_Bend_90_128_B,
  AirDuct_End,
  AirDuct_End_Bend_Up,
  AlleyTrash_01,
  AlleyTrash_02,
  AlleyTrash_03,
  AlleyTrash_04,
  AlleyTrash_05,
  AlleyTrash_07,
  AlleyTrash_08,
  AluminumGangway_01_1024,
  AntennaRooftop_01,
  AsphaltBrokenThick_01_512x512_CullSonner,
  ATMMachine_01,
  AutoCapture_Terrain,
  Backpack_01,
  BackroomStorageShe01,
  BackroomStorageShe01_B,
  BananaPlant_01_S_B,
  BananaPotted_02_S_A,
  BannerPole_01,
  BarCounter_01_256,
  BarCounter_01_256_B,
  BarCounter_01_512,
  BarCounterCorner_01,
  BarCounterCorner_03,
  BarCounterDivider_03_128,
  BarCounterDivider_03_256,
  BarCounterDrywall_01_A_Bottom_192x16x16,
  BarCounterEndLeft_01,
  BarCounterGlassFridge_01,
  BarGantry_01,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierPlastic_01,
  BarriersPedestrian_01_A,
  BarShelves_01,
  BarStool_01,
  BarStool_01_B,
  BarTableLong_01,
  BasketballNet_01,
  BathroomKit_01A,
  BathroomSink_02,
  Beach_TennisCourts_02,
  BeachLoungeChair_01,
  BeachRock_01,
  BeachRock_03,
  BeachSign_01,
  BeachSteps_L_01,
  Bed_01,
  Bed_02,
  BedFrame_02,
  BedMattress_02,
  BedWornFrame_01,
  BedWornMattress_01,
  BeerBoxStack_01_A,
  BeerBoxStack_01_B,
  BeerTap_01,
  BenchWaterfront_01,
  BenchWood_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_MilitaryRnD</strong> (1064 values)</summary>

```ts
enum RuntimeSpawn_Granite_MilitaryRnD {
  AcaciaUrban_01_S,
  ACModule_01,
  ACModule_02,
  ACModule_04,
  ACUnit_04,
  ACUnitInterior_01,
  Airconditioner_01,
  Airconditioner_01_B,
  AirDuct_1024_A,
  AirDuct_256,
  AirDuct_512_A,
  AirDuct_512_B,
  AirDuct_Bend_90_128,
  AirDuct_Bend_90_128_B,
  AirDuct_Bend_T_90_128,
  AirDuct_End,
  AirDuct_End_Bend_Up,
  AirDuct_TShape,
  AirDuct_Vent,
  AirfieldBlastBarrier_01,
  AluminumBench_01,
  AluminumGangway_01_1024,
  Antenna_02,
  AntennaMast_01,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AntennaRooftop_01,
  AntennaSmall_01_B,
  AntennaTall_01,
  AsphaltBrokenThick_01_512x512,
  AsphaltChunks_02,
  AutoCapture_Terrain,
  BackroomStorageShe01,
  BarbedWire_01_A,
  BarbedWire_01_C,
  BarCounterCabinet_01_A,
  BarCounterFridge_01,
  Barrack_02_B,
  Barrack_02_C,
  Barrack_02_D,
  BarrackCylindrical_Airstrip_01_LightingProps,
  BarrackCylindrical_Airstrip_01_Props_B,
  BarrackCylindricalDoorSmall_01,
  BarrackCylindricalDoorSmallFrame_01,
  BarrackStair_01,
  BarrelLabratory_01_115,
  BarrelLabratory_01_115_DDPF,
  BarrelLabratory_01_cluster_A_2x3,
  BarrelLabratory_01_cluster_A_2x3_DDPF,
  BarrelLabratory_01_cluster_B_2x3x2,
  BarrelLabratory_01_cluster_B_2x3x2_DDPF,
  BarrelOil_01_B,
  BarrelOil_01_C,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_01_group_06,
  BarrelOil_03,
  BarrelOilExplosive_01_cluster,
  BarrelOilExplosive_01_cluster_A_DDPF,
  BarrelOilExplosive_01_cluster_B,
  BarrelOilExplosive_01_cluster_B_DDPF,
  BarrelOilExplosive_01_DDPF_B,
  BarricadeboardsWood_01_B,
  BarrierBlockConcrete_03_128_120,
  BarrierBlockConcreteRound_01,
  BarrierConcreteWall_01_160x385,
  BarrierConcreteWall_01_192x320,
  BarrierConstruction_01_256_120_B,
  BarrierConstructionFenceMetal_01_256_300,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_256x240,
  BarrierHesco_01_Row03,
  BarrierJersey_01_256x124_B,
  BarrierJersey_02_256_120,
  BathroomCabinet_01,
  BathroomCabinet_01_B,
  BathroomSink_02,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_MilitaryStorage</strong> (1128 values)</summary>

```ts
enum RuntimeSpawn_Granite_MilitaryStorage {
  Abra01_Chassis,
  Abra01_Chassis_B,
  Abra01_Tracks,
  Abra01_Turret,
  Abra01_Turret_B,
  AbraCoveredTarp,
  AcaciaUrban_01_S,
  ACModule_01,
  ACModule_02,
  AluminumBench_01,
  AmmoStack_01,
  AntennaMast_01,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AntennaSmall_01_B,
  AntennaTall_01,
  AsphaltRubblePile_01,
  AutoCapture_Terrain,
  BackroomStorageShe01,
  Barrack_01_A_Props_F,
  Barrack_02_A_Props,
  Barrack_02_A_SecurityCheckPoint,
  Barrack_02_C,
  Barrack_02_D,
  Barrack_02_LightingProps,
  BarrackStair_01,
  BarrackStair_01_B,
  BarrelLabratory_01_115,
  BarrelLabratory_01_115_DDPF,
  BarrelLabratory_01_cluster_A_2x3,
  BarrelLabratory_01_cluster_A_2x3_DDPF,
  BarrelOil_01_B,
  BarrelOil_01_C,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_01_group_06,
  BarrelOil_03,
  BarrelOilExplosive_01_cluster,
  BarrelOilExplosive_01_cluster_A_DDPF,
  BarrelOilExplosive_01_cluster_B,
  BarrelOilExplosive_01_cluster_B_DDPF,
  BarrelOilExplosive_01_DDPF_B,
  BarrierBlockConcrete_01_256x120,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierBlockConcrete_03_128_120,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierConstruction_01_256_120_B,
  BarrierConstruction_01_256_120_DDPF,
  BarrierConstructionFenceMetal_01_256_300,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_128x240_DDPF,
  BarrierHesco_01_256x240,
  BarrierHesco_01_64x60,
  BarrierHesco_01_Row04b,
  BarrierJersey_01_256x124_B,
  BarrierPlastic_01,
  BeamRefinery_01_A_32x32x320,
  BeamRefinery_01_A_32x32x416,
  BeamRefinery_01_B_32x32x256,
  BeamRefinery_01_F_32x256,
  BeamRefinery_01_F_CV90_128x128,
  BeamRefineryConnector_01_CV180_48x64,
  BeamRefineryConnector_01_CV90_48x48,
  BeamRefineryFoundation_01_1024x1024x320,
  BeamRefineryFoundation_01_144x144x320,
  BeamRefineryFoundation_01_512x128x320,
  BeamRefineryFoundation_01_80x80x320,
  BeerBoxStack_01_B,
  Billboard_01,
  Billboard_01_Ads_FireEvac,
  Billboard_Sign,
  Bin_01,
  BlockClusterConcrete_01_A,
  Bollard_01_256,
  Bollard_01_512,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_ResidentialNorth</strong> (909 values)</summary>

```ts
enum RuntimeSpawn_Granite_ResidentialNorth {
  AcaciaUrban_01_S,
  ACModule_04,
  ACUnit_03,
  AgaveAmericana_01_S_A,
  AgaveAmericana_01_S_B,
  AlleyTrash_02,
  AsphaltBrokenThick_01_512x512,
  AsphaltBrokenThick_01_512x512_CullSonner,
  AsphaltChunks_01,
  AutoCapture_Terrain,
  BackroomStorageShe01,
  BackroomStorageShe01_B,
  BananaPlant_01_S_A,
  BananaWi01_M,
  BananaWildPotted_01_M,
  BarCounter_01_128,
  BarCounter_01_128_B,
  BarCounter_01_256,
  BarCounter_01_256_B,
  BarCounter_01_512,
  BarCounter_01_512_B,
  BarCounterCabinet_01_A,
  BarCounterCabinet_01_B,
  BarCounterCabinet_03_128,
  BarCounterCabinet_03_256,
  BarCounterCorner_01,
  BarCounterCorner_01_B,
  BarCounterCorner_03,
  BarCounterDrywall_01_A_Bottom_192x16x16,
  BarCounterDrywall_01_A_Side_128x32x16,
  BarCounterDrywall_01_A_Side_64x32x16,
  BarCounterEndLeft_01,
  BarCounterGlassFridge_01,
  BarCounterWorkStation_01,
  BarGantry_01,
  Barrack_01_A,
  BarrelLabratory_01_115,
  BarrelLabratory_01_115_DDPF,
  BarrierPlastic_01,
  BarShelves_01,
  BarShelves_02,
  BarShelvesColumns_01,
  BarShelvesColumns_02,
  BarSign_01,
  BarSoffit_01,
  BarSoffit_01_A_128x183_C90,
  BarSoffit_01_A_128x33,
  BarSoffit_01_A_128x522,
  BarSoffit_01_A_128x588,
  BarStool_01_B,
  BathroomKit_01A,
  BathroomSink_02,
  BeachLoungeChair_01,
  BeachTrailStairs_01,
  Bed_01,
  Bed_02,
  BedFrame_02,
  BedMattress_02,
  BedWornMattress_01,
  BenchWooden_01_B,
  Billboard_01,
  Billboard_01_Ads_RealEstate_B,
  Billboard_03,
  Billboard_Sign,
  Bin_01,
  BirdsOfParadise_01_M_A,
  BirdsOfParadise_01_M_B,
  Bollard_01_A,
  Bookcase_02,
  Books_01_D,
  Bougainvillea_01_L_A,
  Bougainvillea_01_L_B,
  BoxCardboard_01_A,
  BoxCardboard_01_C,
  BoxCardboard_01_D,
  BoxCardboard_01_E,
  BoxCardboardStackSmall_01,
  BoxesCardboardStack_01_A,
  BoxesCardboardStack_02_A,
  BoxesCardboardStack_02_B,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_TechCenter</strong> (834 values)</summary>

```ts
enum RuntimeSpawn_Granite_TechCenter {
  AcaciaUrban_01_S,
  AluminumBench_01,
  AP_Planter_Grass_02,
  AP_Planter_PurpleFlowers_01,
  AP_PolyPlane_01,
  ArtExhibitBase_128x128x128_01,
  AsphaltBrokenThick_01_512x512,
  AsphaltChunks_01,
  AsphaltChunks_03,
  AutoCapture_Terrain,
  BackroomStorageShe01,
  BananaWi01_M,
  BarbedWire_01_A,
  BarbedWire_01_C,
  BarGantry_01,
  BarrelOil_01_C,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_01_group_06,
  BarrelOil_03,
  BarrelOilExplosive_01_DDPF_B,
  BarrierConstruction_01_256_120_B,
  BarrierConstruction_01_256_120_DDPF,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_Row03,
  BarrierJersey_01_256x124_B,
  BarrierJerseyFence_01_ENKARE_Blue,
  BarrierJerseyFence_01_ENKARE_Blue_B,
  BarrierJerseyFence_01_ENKARE_Yellow,
  BarrierJerseyFence_01_ENKARE_Yellow_B,
  BarrierPlastic_01,
  BarTableLong_01,
  BathroomCabinet_01_B,
  BathroomSink_02,
  BeachTrailStairs_01,
  BeerTap_01,
  BeverageFridge_01_A,
  BikeRackLong_01,
  Billboard_01,
  Billboard_01_Ads_FireEvac,
  Billboard_02,
  Billboard_04_Sign,
  Billboard_04_Sign_NY_Ad_RealEstate_B,
  Billboard_Sign,
  Bin_01,
  BirdsOfParadise_01_M_B,
  Bollard_01_A,
  Bollard_01_D,
  Bookcase_02,
  BoxCardboard_01_C,
  BoxCardboard_01_D,
  BoxCardboard_01_E,
  BoxesCardboardStack_01_A,
  BoxesCardboardStack_01_D,
  BoxesCardboardStack_02_A,
  BoxesCardboardStack_02_B,
  BoxesCardboardStack_02_C,
  BoxesCardboardStack_03_B,
  Boxwood_01_L,
  Boxwood_01_M,
  Boxwood_01_S,
  BoxwoodWall_01_1024x120,
  BoxwoodWall_01_1024x220,
  BoxwoodWall_01_256x120,
  BoxwoodWall_01_256x220,
  BoxwoodWall_01_256x60,
  BoxwoodWall_01_512x120,
  BoxwoodWall_01_512x220,
  BR_PlasterWall_02_B_C22,
  BrickConcretePile_01,
  Bridge_Expansion_Joints_01,
  Bridge_ExpansionJoint_01,
  Bridge_rest,
  BroadleafUrban_01_L_B,
  BroadleafUrban_01_M_A,
  BrokenRoad_02,
  Broom_01,
  BusStop_01_A,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Granite_Underground</strong> (1430 values)</summary>

```ts
enum RuntimeSpawn_Granite_Underground {
  AcaciaUrban_01_S,
  ACModule_01,
  ACModule_02,
  ACModule_03,
  ACModule_04,
  AirDuct_01_A_1024,
  AirDuct_01_C135,
  AirDuct_02_A_256,
  AirDuct_02_A_512,
  AirDuct_02_A_512_NBRK,
  AirDuct_02_A_Corner_NBRK,
  AirDuct_02_A_End,
  AirDuct_02_A_End_NBRK,
  AirDuct_02_A_Joint,
  AirDuct_1024_A,
  AirDuct_1024_B,
  AirDuct_256,
  AirDuct_512_A,
  AirDuct_512_B,
  AirDuct_768,
  AirDuct_Bend_90_128,
  AirDuct_Bend_90_128_B,
  AirDuct_Bend_T_90_128,
  AirDuct_End,
  AirDuct_End_Bend_Up,
  AirDuct_End_Vent,
  AirDuct_TShape,
  AirDuct_Vent,
  AirDuctDamaged_B_1024,
  AirDuctPipe_01,
  AirDuctPipe_01_C90,
  AirDuctPipe_1024_01,
  AirDuctPipe_256_01,
  AirDuctPipe_256_02,
  AirDuctPipe_256_C90_01,
  AirDuctPipe_512_01,
  AirDuctPipeBrace_01,
  AirDuctPipeCap_01,
  AlleyTrash_01,
  AlleyTrash_03,
  AntennaMast_01,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  Area_01_Base,
  Area_02_Base,
  Area_02_SetDressing,
  Area_03_base,
  Area_04_Base,
  AsphaltDebris_02,
  AsphaltDebris_03,
  AsphaltRubblePile_01,
  AutoCapture_Terrain,
  BackroomStorageShe01,
  BarbedWire_01_A,
  BarbedWire_01_C,
  BarCounterFridge_01,
  BarCounterGlassFridge_01,
  Barrack_02_LightingProps,
  BarrelLabratory_01_115,
  BarrelLabratory_01_115_DDPF,
  BarrelLabratory_01_64,
  BarrelLabratory_01_cluster_A_2x3,
  BarrelLabratory_01_cluster_A_2x3_DDPF,
  BarrelLabratory_01_cluster_B_2x3x2,
  BarrelLabratory_01_cluster_B_2x3x2_DDPF,
  BarrelOil_01_B,
  BarrelOil_01_C,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_01_group_06,
  BarrelOil_03,
  BarrelOilExplosive_01_cluster,
  BarrelOilExplosive_01_cluster_A_DDPF,
  BarrelOilExplosive_01_cluster_B,
  BarrelOilExplosive_01_cluster_B_DDPF,
  BarrelOilExplosive_01_DDPF_B,
  BarrelWater_01,
  BarricadeboardsWood_01_B,
  BarrierBlockConcrete_01_256x60,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Limestone</strong> (927 values)</summary>

```ts
enum RuntimeSpawn_Limestone {
  ACModule_02,
  ACModule_03,
  ACModule_04,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_Running,
  ACUnit_04,
  ACUnit_04_Off,
  AftermathDebrisPileBrickPlaster_120,
  AftermathDebrisPileBrickPlaster_120_01,
  AftermathDebrisPileConcrete_Skew_210_A,
  AftermathDebrisPileConcrete_Skew_210_D,
  AgaveAmericana_01_S_A,
  AgaveAmericana_01_S_B,
  AgaveAmericanaPotted_01_S_A,
  AirControlTower_02,
  AirportTerminalStorage_01,
  Anemometer_01,
  AntennaRooftop_01,
  AntennaSmall_01_A,
  AntennaSmall_01_B,
  Apple_01,
  AppleCluster_01,
  AppleCluster_02,
  Architecture_01_A,
  Architecture_01_B,
  Architecture_01_C,
  Architecture_01_D,
  Architecture_01_E,
  Architecture_01_F,
  Architecture_01_G,
  Architecture_01_H,
  Architecture_01_I,
  Architecture_01_J,
  Architecture_01_K,
  Architecture_01_L,
  Architecture_01_M,
  Architecture_01_N,
  Architecture_01_O,
  Architecture_01_P,
  Architecture_01_Q,
  Artichoke_01,
  AwningPlastic_01_512,
  AwningPlastic_01_512_MP_Battery,
  AwningPlasticSheet_01,
  AwningSmallShort_01,
  Backdrop_01,
  BackdropMeshes,
  Banana_01,
  BananaCluster_01,
  BananaPlant_01_S_B,
  BananaPotted_02_S_A,
  BannerFlag_01_Static,
  BarricadeboardsWood_01_A,
  BarrierPlastic_01,
  Basketball_01_B,
  Bench_01,
  Bicycle_01_C,
  BikeURack_01,
  Bollard_01_C,
  Bollard_04,
  Books_01_A,
  Books_01_C,
  Books_01_D,
  Bookshe01,
  BooksPile_01_A,
  Bottle_02,
  BottleKetchup_01,
  Bougainvillea_01_L_A,
  Bougainvillea_01_L_B,
  Bougainvillea_01_M,
  BougainvilleaPotted_01_M,
  BoxCardboard_01_A,
  BoxCardboard_01_C,
  BoxCardboard_01_E,
  BoxesCardboardStack_01_A,
  BoxesCardboardStack_02_A,
  BoxShoe_01,
  Boxwood_01_L,
  BR_Archway_03,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Outskirts</strong> (842 values)</summary>

```ts
enum RuntimeSpawn_Outskirts {
  ACModule_03,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_Running,
  AftermathDebrisPileConcrete_Skew_210_A,
  AftermathDebrisPileConcrete_Skew_210_D,
  Airconditioner_01,
  AlleyTrash_02,
  AntennaRooftop_01,
  Apple_01,
  AppleCluster_01,
  AppleCluster_02,
  Area02_Scaffolding_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  Awning_02_B,
  Awning_02_C,
  AwningPlastic_01_256,
  AwningPlastic_01_512,
  Barrack_01_A_Outskirts,
  Barrack_01_B,
  Barrack_01_B_Outskirts,
  BarrackFoundation_01,
  BarrackStair_01,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_C,
  BarrelOil_01_D,
  BarrelOil_01_group_04,
  BarrelOil_01_group_05,
  BarrelOil_03,
  BarrelWater_01,
  BarricadeboardsWood_01_A,
  BarricadeboardsWood_01_B,
  BarrierConcreteWall_01_160x385,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_128x240_DDPF,
  BarrierHesco_01_256x240,
  BarrierHesco_01_64x60,
  BarrierHesco_01_Row02,
  BarrierHesco_Pile,
  BarrierPlastic_01,
  BasketWicker_01,
  Bedding_Set_01_Sheet,
  Bedding_Set_02_A_02,
  Bedding_Set_02_B,
  BeddingRural_01_A,
  BeddingRural_01_D,
  BedWornMattress_01,
  BeerBoxStack_01_A,
  BenchWood_01,
  Billboard_01,
  Billboard_02,
  Billboard_04_C,
  Billboard_Sign,
  Billboard_Sign_03,
  Billboard_Sign_04,
  BillboardBuilding_01_A,
  BillboardBuilding_01_B,
  BillboardBuilding_02,
  BooksPile_01_A,
  Bottle_01_A,
  Bottle_01_B,
  BoxCardboard_01_A,
  BoxCardboard_01_B,
  BoxCardboard_01_D,
  BoxesCardboardStack_01_A,
  BoxesCardboardStack_02_A,
  BoxesCardboardStack_03_B,
  BR_OutskirtsHouseMediumGround_01,
  BR_OutskirtsHouseMediumIntermediate_01,
  Brick_01_B,
  Brick_01_C,
  Brick_01_D,
  Brick_01_E,
  Brick_01_F,
  BrickConcretePile_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Sand</strong> (1346 values)</summary>

```ts
enum RuntimeSpawn_Sand {
  ACModule_01,
  ACModule_02,
  ACModule_03,
  ACModule_03_animated,
  ACModule_03_Running,
  ACUnit_03,
  ACUnit_03_animated,
  ACUnit_03_cover,
  ACUnit_03_Running,
  ACUnit_04,
  ACUnit_04_cover,
  ACUnitWindow_01_B,
  AftermathDebrisPileConcrete_Skew_210_B,
  AftermathDebrisPileConcrete_Skew_210_D,
  AirConClusterBuildingSide_01,
  AirConClusterBuildingSide_02,
  AirConClusterBuildingSide_03,
  AirConClusterBuildingSide_04,
  AirConClusterBuildingSide_05,
  AirConClusterBuildingSide_06,
  Anemometer_01,
  AntennaMast_01_BD,
  AntennaMastMetal_01,
  AntennareciverMetal_01,
  AntennaRooftop_01,
  AntennaSmall_01_A,
  AntennaSmall_01_B,
  Apple_01,
  AppleCluster_01,
  AppleCluster_02,
  ArabicCoffeePlate_01,
  ArabicCoffeeTable_01_A,
  ArabicCoffeeTable_01_B,
  ArchwayFoundation_01,
  ArrabicCoffeeTable_01,
  Artichoke_01,
  ArtichokeCluster_01,
  AsphaltChunks_01,
  AsphaltChunks_02,
  AsphaltChunks_03,
  Awning_02_C,
  AwningCommercial_02,
  AwningLamps_02,
  AwningLamps_03,
  AwningLargeFlat_01,
  AwningPlastic_01_256,
  AwningPlastic_01_512,
  AwningPlastic_01_512_B,
  AwningPlasticSheet_01,
  AwningWoodO01_128,
  AwningWoodO02_256,
  BalconyBayWindow_01,
  BalconyWood_03,
  BalconyWood_04,
  Banana_01,
  BananaCluster_01,
  BananaPlant_01_S_A,
  BananaPlant_01_S_B,
  BananaPotted_01_S_A,
  BananaPotted_01_S_B,
  BananaPotted_01_S_C,
  BananaPotted_02_S_A,
  BananaWi01_M,
  BananaWildPotted_01_M_A_Oriental,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarricadeboardsWood_01_A,
  BarricadeboardsWood_01_B,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierConcreteWall_01_Row3,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x120_DDPF,
  BarrierHesco_01_128x240,
  BarrierHesco_01_128x240_DDPF,
  BarrierJersey_01_256x124_B,
  BarrierJersey_03_256x80,
  BarrierJerseyEnd_03_256x80,
  BasketCluster_01,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Subsurface</strong> (980 values)</summary>

```ts
enum RuntimeSpawn_Subsurface {
  ACModule_01,
  ACModule_02,
  ACUnit_03_animated,
  ACUnit_03_Running,
  ACUnit_04_Support,
  AftermathDebrisPileConcrete_Center_120,
  AftermathDebrisPileConcrete_Skew_120_C,
  AftermathDebrisRocks_210,
  AftermathJet_Skew_210,
  AircraftWreckage_Jas39_01_Body,
  AirDuct_01_C135,
  AirDuct_02_A_256,
  AirDuct_02_A_256_B,
  AirDuct_02_A_Corner,
  AirDuct_02_A_End,
  AirDuct_02_A_Joint,
  AirDuct_02_C135,
  AirDuct_1024_A,
  AirDuct_1024_B,
  AirDuct_1024_C,
  AirDuct_256,
  AirDuct_256_B,
  AirDuct_512_A,
  AirDuct_512_B,
  AirDuct_768,
  AirDuct_Bend_90_128,
  AirDuct_Bend_90_128_B,
  AirDuct_Bend_T_90_128,
  AirDuct_End,
  AirDuct_End_Bend_Up,
  AirDuct_End_Vent,
  AirDuct_TShape,
  AirDuctDamaged_B_1024,
  AirDuctPipe_01,
  AirDuctPipe_01_C90,
  AirDuctPipe_1024_01,
  AirDuctPipe_256_01,
  AirDuctPipe_256_02,
  AirDuctPipe_256_C90_01,
  AirDuctPipe_512_01,
  AirDuctPipeCap_01,
  AirplaneJAS39_01,
  AirplaneJAS39Body,
  AirplaneJAS39Body_B,
  AirplaneJAS39Cab,
  AirplaneJAS39Cockpit_01,
  AirplaneJAS39Cover,
  AirplaneJAS39Frame_01,
  AirplaneJAS39Frame_01_B,
  AirplaneJAS39Frame_02,
  AirplaneJAS39FuelTank_01,
  AirplaneJAS39Nose,
  AirplaneJAS39Panel,
  AirplaneJAS39PanelFrame_01,
  AirplaneJAS39PanelFrame_01_B,
  AirplaneJAS39TailWing,
  AshTray_01_B,
  AshTrayCigarettes_01,
  AsphaltChunks_01,
  AsphaltChunks_01_B,
  AsphaltChunks_02,
  AsphaltChunks_02_B,
  AsphaltChunks_03,
  AsphaltChunks_03_B,
  AttackerHQAll_01,
  Backpack_01_B,
  Backpack_02,
  Backpack_03,
  BagTarp_01,
  Banana_01,
  BannerFlag_01_Static,
  BarrelBurned_01,
  BarrelOil_03,
  BarrelWater_01,
  BarrierBlockConcrete_01_256x60,
  BarrierBlockConcrete_02_128_60,
  BarrierBlockConcrete_03_128_120,
  BarrierConcreteWall_01_192x320,
  BarrierConcreteWall_01_192x320_A_DDPF,
  BarrierHesco_01_128x120,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>RuntimeSpawn_Tungsten</strong> (877 values)</summary>

```ts
enum RuntimeSpawn_Tungsten {
  ACUnit_04,
  AftermathDebrisPileConcrete_Center_120,
  AftermathDebrisPileConcrete_Center_60,
  AftermathDebrisPileConcrete_Skew_120,
  AftermathDebrisPileConcrete_Skew_210_C,
  AftermathDebrisPileConstruction_Ramp_512_01,
  AftermathDebrisPileConstruction_Ramp_512_01_B,
  AftermathDebrisPileVillage_120_01,
  AntennaRooftop_01,
  Apple_01,
  AppleCluster_02,
  Awning_02_B,
  Awning_02_C,
  Barrack_01_A_Tungsten_1,
  Barrack_01_Props_B,
  Barrack_01_Props_C,
  BarrelBurned_01,
  BarrelOil_01_B,
  BarrelOil_01_D,
  BarrelOil_03,
  BarrelOilExplosive_01_DDPF_B,
  BarrelTools_01,
  BarrelWater_01,
  BarrierHesco_01_128x120,
  BarrierHesco_01_128x240,
  BarrierJersey_01_256x124_B,
  Bedding_Set_01_Sheet,
  Bedding_Set_02,
  Bedding_Set_02_A_02,
  Bedding_Set_02_B,
  Bedding_Set_02_B_02,
  BeddingRural_01_A,
  BedMilitary_01_B,
  BenchRural_01,
  BenchWood_01,
  Bicycle_01_C,
  Birch_01_L,
  Birch_01_L_B,
  Birch_01_L_C,
  Birch_01_M_D,
  Books_01_A,
  Books_01_B,
  Books_01_D,
  Bookshe01,
  BooksPile_01_A,
  BooksPile_01_C,
  Bottle_01_A,
  Bottle_01_B,
  Bottle_01_C,
  BoxCardboard_01_D,
  BoxesCardboardStack_02_A,
  BoxesCardboardStack_03_B,
  BR_VillageShackWall_01,
  BrickConcretePile_01,
  BrickPileLarge_01,
  BrickPileSmall_01,
  Broom_01,
  Bucket_01,
  Bucket_02,
  Bucket_02_Apples,
  BucketMetal_01,
  Buckets_01_A,
  Buckets_01_B,
  BulkBag_01,
  CabinetRural_01,
  CableFloor_02,
  CableFloor_03,
  CableReel_01,
  CableRoll_01,
  Campfire_01,
  CardboardBoxes_01_B,
  CardboardPaper_01,
  CardboardPaper_02,
  CardboardTrashPile_01_A,
  Carpet_01_A,
  Carpet_01_B,
  Carpet_01_C,
  Carpet_01_D,
  Carpet_01_E,
  Carpet_01_F,
  // Only the first 80 values are shown.
}
```

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
<summary><strong>SoldierStateBool</strong> (21 values)</summary>

```ts
enum SoldierStateBool {
  IsAISoldier,
  IsAlive,
  IsBeingRevived,
  IsCrouching,
  IsDead,
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
<summary><strong>Types</strong> (112 values)</summary>

```ts
enum Types {
  AreaTrigger,
  Array,
  Boolean,
  CapturePoint,
  DamageType,
  DeathType,
  EmplacementSpawner,
  Enum_AiInput,
  Enum_AmmoTypes,
  Enum_Cameras,
  Enum_CustomNotificationSlots,
  Enum_Factions,
  Enum_Gadgets,
  Enum_GolmudTrainMoveCommands,
  Enum_GolmudTrainStopReason,
  Enum_GolmudTrainVariants,
  Enum_InventorySlots,
  Enum_Maps,
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
  Enum_RuntimeSpawn_Sand,
  Enum_RuntimeSpawn_Subsurface,
  Enum_RuntimeSpawn_Tungsten,
  Enum_ScoreboardType,
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
  // Only the first 80 values are shown.
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
<summary><strong>WeaponAttachments</strong> (329 values)</summary>

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
  Barrel_18_Custom,
  Barrel_18_EBR,
  Barrel_18_Extended,
  Barrel_18_US_LB,
  Barrel_180mm_Prototype,
  Barrel_180mm_Standard,
  Barrel_185_Factory,
  Barrel_189_Factory,
  Barrel_189_Prototype,
  Barrel_20_Factory,
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
  Barrel_24_Bravo,
  Barrel_24_Extended,
  Barrel_24_Fluted,
  Barrel_24_Full,
  Barrel_240mm_Fluted,
  Barrel_240mm_SB,
  Barrel_245mm_Custom,
  // Only the first 80 values are shown.
}
```

</details>

<details>
<summary><strong>Weapons</strong> (57 values)</summary>

```ts
enum Weapons {
  AssaultRifle_AK4D,
  AssaultRifle_B36A4,
  AssaultRifle_KORD_6P67,
  AssaultRifle_L85A3,
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
  SMG_PW5A3,
  SMG_PW7A2,
  SMG_SCW_10,
  SMG_SGX,
  SMG_SL9,
  SMG_UMG_40,
  SMG_USG_90,
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

