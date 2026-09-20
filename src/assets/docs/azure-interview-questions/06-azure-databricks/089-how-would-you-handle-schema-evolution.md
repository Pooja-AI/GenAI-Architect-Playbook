# How would you handle schema evolution?

## Short answer
Handle schema evolution by allowing additive changes and blocking surprises.

## Key points
- Delta mergeSchema for new columns; enforcement rejects unexpected changes.
- Auto Loader schema-evolution modes and rescued-data column.
- Contract tests and review of breaking changes; versioned schemas.

## CWD context
Additive is automatic; breaking changes need a human decision.
