# How do you audit IAM activity?

## Short answer
Audit IAM with CloudTrail, Access Analyzer and alerting on sensitive changes.

## Key points
- Organisation trail to an immutable S3 bucket with log file validation.
- Access Analyzer for external and unused access; credential reports and last-used data.
- EventBridge alerts on CreateAccessKey, AttachRolePolicy and similar; GuardDuty findings.

## CWD context
Review findings on a schedule, not only after incidents.
