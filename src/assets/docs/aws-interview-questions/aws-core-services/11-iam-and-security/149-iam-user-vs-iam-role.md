# IAM user vs IAM role?

## Short answer
An IAM user has long-term credentials; an IAM role provides temporary credentials to whoever assumes it.

## Key points
- Users: avoid for workloads and people.
- Roles: assumed by services, federated users or other accounts through STS; trust policy controls who can assume.

## CWD context
Use roles everywhere.
