# How would you rotate secrets?

## Short answer
Rotate with Secrets Manager rotation and a zero-downtime strategy.

## Key points
- Rotation Lambda steps: create, set, test, finish, using AWSPENDING and AWSCURRENT labels.
- Alternating-users strategy avoids downtime for databases.
- KMS key rotation is separate; alarm on rotation failure and test regularly.

## CWD context
Rehearse rotation before it becomes an emergency.
