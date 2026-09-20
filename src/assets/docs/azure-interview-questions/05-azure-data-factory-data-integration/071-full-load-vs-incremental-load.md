# Full load vs incremental load?

## Short answer
A full load re-reads everything; an incremental load reads only changes.

## Key points
- Full: simple and handles deletes easily but slow and costly.
- Incremental: fast and cheap but needs a reliable change signal and delete handling.
- Common pattern: initial full load, incremental afterwards, periodic full reconciliation.

## CWD context
Choose per source based on volume and available change signals.
