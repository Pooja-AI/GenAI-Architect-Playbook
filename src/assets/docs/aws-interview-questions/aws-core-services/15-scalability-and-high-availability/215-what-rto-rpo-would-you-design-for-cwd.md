# What RTO/RPO would you design for CWD?

## Short answer
RTO is how long recovery may take; RPO is how much data loss is acceptable; set them from business impact.

## Key points
- Example targets: RTO one hour or less for user-facing service; RPO of seconds to minutes for workflow state.
- Documents and the index: RPO minutes to an hour; the index can be rebuilt from S3.
- Audit logs: near-zero RPO.
- Tighter targets cost more, so justify each one.

## CWD context
Different data classes can have different targets.
