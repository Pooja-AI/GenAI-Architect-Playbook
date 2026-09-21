# AWS-managed key vs customer-managed key?

## Short answer
Customer-managed keys give you control and audit; AWS-managed keys are convenient but limited.

## Key points
- AWS-owned: invisible and free. AWS-managed: created per service, automatic rotation, fixed policy.
- Customer-managed: your key policy, rotation setting, grants, cross-account use, disable and deletion, with per-key and per-request cost.

## CWD context
Use customer-managed keys for sensitive data.
