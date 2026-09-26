# Block Code

This page is a rough outline for visual scripting in Portal.

For the broader scripting overview, see [Scripting](/scripting).

## What block code is good for

- Simple triggers and reactions
- States, timers, and counters
- Wiring gameplay events together
- Fast iteration without writing code

## Common patterns

- Door open/close logic
- Objective enable/disable flow
- Round start and round end handling
- Spawn or reset sequences

## What to document

- Best practices for keeping graphs readable
- Common node combinations
- Naming and grouping conventions
- How to debug broken logic

## Mixing with TypeScript

Block code and TypeScript can be used in the same experience. Block rules run first in every stage, then
TypeScript, and blocks can call exported TypeScript functions with `JsAction` and `JsValue`. See
[Block code and TypeScript together](/event-loop#block-code-and-typescript-together) for the order and the rules for
calling between them.

## Rules of thumb

- Keep graphs small when possible
- Split repeated logic into reusable patterns
- Prefer clear event flow over tangled chains
- Use TypeScript when the block graph gets too complex
