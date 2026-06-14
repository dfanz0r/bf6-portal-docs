# TypeScript

This page covers TypeScript-specific notes for Portal.

For the general scripting overview, see [Scripting](/scripting).

## What TypeScript is for

- Complex custom gameplay rules
- Shared utilities and helpers
- Script collaboration for multiple programmers
- Data-driven setup
- Match flow, scoring, and state management
- Logic that needs to stay maintainable

## Core topics to document

- Project setup
- File and folder structure
- How scripts are loaded
- Runtime APIs we rely on
- Debugging and logging
- Safe patterns for reuse

## Suggested patterns

- Keep one system per module
- Keep helpers small and focused
- Store configuration in data, not hardcoded logic
- Keep clear boundaries between TypeScript and block code
- Build from the smallest working example

## Things to discover

- Which APIs are stable
- Which APIs are missing or limited
- How state should be stored
- What causes bugs or desync
- Where TypeScript becomes too expensive for the job