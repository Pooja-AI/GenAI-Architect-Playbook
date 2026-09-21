# What is your disaster-recovery strategy?

## Short answer
Choose the DR pattern from RTO and RPO: backup and restore, pilot light, warm standby or active-active.

## Key points
- For CWD: warm standby in a second region is a sensible target.
- State through global tables, documents through cross-region replication, index rebuilt from S3 or kept warm.
- IaC to recreate; Route 53 failover; AWS Backup; regular DR drills and restore tests.

## CWD context
Untested DR plans usually fail on first use.
