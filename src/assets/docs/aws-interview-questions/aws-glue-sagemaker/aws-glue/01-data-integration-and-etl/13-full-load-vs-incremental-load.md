# Full load vs incremental load?

## Short answer
A full load re-reads everything; an incremental load reads only changes.

## Key points
- Full: simple, handles deletes easily, slow and costly.
- Incremental: cheap and fast but needs a reliable change signal and delete handling.
- Common pattern: initial full, then incremental, with periodic reconciliation.

## CWD context
Choose per source based on volume and change signals.
