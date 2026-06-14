# Scripting

This page is the overview for Portal scripting.

Portal has two main scripting paths:

- **Block code** — visual logic for quick iteration and simple event flow
- **TypeScript** — code-driven systems for reusable and complex gameplay

## When to use scripting

Portal custom experiences start as a blank slate. Unlike verified experiences, they do not inherit default gameplay or map behaviors.

Use scripting to explicitly build the rules, triggers, state, and interactions your experience needs. Spatial/game systems exposed through the `mod.*` APIs still have to be wired up in code or block logic before they do anything.

## Choose block code when

- The logic is simple
- You want fast iteration
- The flow is easy to express visually
- You need a low-friction setup for triggers and states

## Choose TypeScript when

- Block code starts getting awkward or too large and unwieldy
- You need reusable systems
- You are collaborating on logic with multiple programmers
- The logic needs to stay maintainable
- You are concerned about server performance or lag issues

## Mixed Block + TypeScript experiences

You can also combine block code and TypeScript in the same experience. There are tools for passing data and calling functions between the two, including `JsValue` and `JsAction` from blocks, plus shared state through `GlobalVariable` and `ObjectVariable`.

This is a good way to keep simple event flow in blocks while moving more complex or reusable logic into TypeScript.

## Related pages

- [Block Code](/block-code)
- [TypeScript](/typescript)
