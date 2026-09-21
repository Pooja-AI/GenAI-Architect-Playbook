# How would you encrypt DynamoDB?

## Short answer
DynamoDB always encrypts at rest; you choose who owns the key.

## Key points
- AWS-owned (default), AWS-managed or customer-managed.
- Customer-managed gives audit and control; backups and exports follow.

## CWD context
Choose customer-managed for tables holding tenant or personal data.
