# How would you design the sort key?

## Short answer
Use the sort key to group related items and support range queries.

## Key points
- Example: RUN#{runId}#STEP#{sequence}, TURN#…, CKPT#…, META.
- Zero-padded sequences or ISO timestamps keep ordering; begins_with queries fetch a subset.
- GSIs provide alternate access such as tenant plus status or correlation ID.

## CWD context
One Query call can fetch a whole session.
