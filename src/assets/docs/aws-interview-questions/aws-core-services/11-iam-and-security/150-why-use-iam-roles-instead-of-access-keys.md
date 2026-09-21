# Why use IAM roles instead of access keys?

## Short answer
Use roles because they provide short-lived, automatically rotated credentials with nothing to leak.

## Key points
- No access keys in code, logs or repositories.
- Scoped by trust and permission policies; every assumption is logged in CloudTrail.
- Native for Lambda, ECS, EC2 and other compute.

## CWD context
Any long-lived access key is a finding.
