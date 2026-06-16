# Optimization

This page tracks performance notes and optimization discoveries for Portal.

## What to watch

- Too many placed objects
- Expensive logic running too often
- Large or tangled block graphs
- Repeated script work that could be cached
- Unnecessary updates, listeners, or events

## Main areas

### Map creation

- Object count
- Visibility and clutter
- Spawn density
- Large connected spaces versus segmented spaces

### Block code

- Event spam
- Deep chains of logic
- Duplicate logic paths
- Excessive state checks

### TypeScript

- Update frequency
- Expensive loops
- Repeated allocations
- Recomputing values that could be stored

## Testing approach

1. Make a baseline version.
2. Change one thing at a time.
3. Test in the same conditions.
4. Compare before and after.
5. Record what actually helped.

## Notes to capture

- Safe limits and bottlenecks
- Things that look expensive but are fine
- Cases where a simpler solution is better
