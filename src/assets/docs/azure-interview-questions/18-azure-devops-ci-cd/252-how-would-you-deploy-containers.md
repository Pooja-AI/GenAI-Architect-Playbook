# How would you deploy containers?

## Short answer
Build, scan and push an immutable image to ACR, then deploy it as a new revision.

## Key points
- Tag by commit SHA; never use latest.
- Deploy by Bicep or az containerapp update; health-check before traffic shift.
- ACR pull with managed identity; keep the previous revision.

## CWD context
Immutable tags make rollback and audit trivial.
