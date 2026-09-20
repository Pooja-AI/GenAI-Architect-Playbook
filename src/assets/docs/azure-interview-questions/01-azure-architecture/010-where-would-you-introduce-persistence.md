# Where would you introduce persistence?

## Short answer
Persist anything that must survive restarts, be audited or be replayed; Redis is never the source of truth.

## Key points
- Cosmos DB: sessions, workflow state and checkpoints, registries, audit metadata.
- ADLS Gen2: raw and curated documents, golden datasets, evaluation results.
- AI Search: the retrieval index (rebuildable from ADLS).
- Log Analytics: logs and traces; Key Vault: secrets and keys.
- Git and ACR: prompts, code, container images.

## CWD context
Persist workflow state after each node so a failed run can resume rather than restart.
