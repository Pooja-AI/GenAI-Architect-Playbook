# How do you handle stale embeddings?

## Short answer
Stale embeddings come from changed content or a changed embedding model and need detection and refresh.

## Key points
- Content hash detects changed chunks; re-embed those.
- For a model change, build a new index (blue-green), validate, then switch an alias.
- Track freshness with an age metric and alert when it exceeds a threshold.

## CWD context
Never mix embeddings from two models in one vector field.
