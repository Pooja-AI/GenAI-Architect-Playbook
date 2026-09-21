# How would you store session/task/run information?

## Short answer
Model a session and its runs, turns and steps as items in one item collection.

## Key points
- PK = SESSION#id; SK = META, RUN#r, RUN#r#TURN#t, RUN#r#STEP#n, CKPT#…
- Attributes: status, version, updatedAt, ttl; pointers to S3 for large payloads.
- GSI on tenant and updatedAt for listing.

## CWD context
Add TTL on ephemeral items to control storage.
