# What CWD data would you store in Cosmos DB?

## Short answer
Store operational, document-shaped data that must be durable and quickly retrievable.

## Key points
- Sessions, turns, steps, runs and workflow state / checkpoints.
- Agent Registry and Prompt Registry metadata.
- Idempotency keys, tenant configuration and quotas, audit metadata, evaluation result summaries.
- Not: large files (ADLS), vectors (AI Search), raw logs (Log Analytics).

## CWD context
Keep documents small and store big payloads in storage with pointers.
