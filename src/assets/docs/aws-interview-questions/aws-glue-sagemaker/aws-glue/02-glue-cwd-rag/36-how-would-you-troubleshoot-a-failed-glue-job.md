# How would you troubleshoot a failed Glue job?

## Short answer
Troubleshoot a failed job from the logs, then the Spark UI, then the likely causes.

## Key points
- Permissions or KMS access; network and connection settings (VPC, security groups, endpoints).
- Out-of-memory from skew or large partitions; schema mismatches and bad records.
- Source API limits; bookmark issues; small-file explosions; timeouts.

## CWD context
Fix the cause, then rerun idempotently.
