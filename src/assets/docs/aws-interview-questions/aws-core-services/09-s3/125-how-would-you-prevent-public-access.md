# How would you prevent public access?

## Short answer
Prevent public access with account-level and bucket-level controls plus detection.

## Key points
- S3 Block Public Access on all four settings; disable ACLs with bucket-owner-enforced ownership.
- SCP to prevent disabling it; Access Analyzer and Config rules for detection.
- Serve public content only through CloudFront with origin access control.

## CWD context
Enforce at the account level so one bucket cannot opt out.
