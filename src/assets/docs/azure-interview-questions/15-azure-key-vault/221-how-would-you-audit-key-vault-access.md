# How would you audit Key Vault access?

## Short answer
Audit access with diagnostic logs and alerting.

## Key points
- AuditEvent logs to Log Analytics: who, what, when and caller IP.
- Alerts for unusual reads, failures and secret deletion; Sentinel for correlation.
- Regular access reviews; retention aligned to compliance.

## CWD context
Know which identity read which secret and when.
