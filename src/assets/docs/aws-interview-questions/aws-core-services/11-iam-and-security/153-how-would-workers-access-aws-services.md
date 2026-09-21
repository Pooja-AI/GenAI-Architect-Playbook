# How would Workers access AWS services?

## Short answer
Each Worker type gets its own task role with only the permissions it needs.

## Key points
- Receive from its own queue, write to its own table items, read its own secrets.
- IAM condition keys (for example leading keys on DynamoDB) support tenant isolation.
- Enterprise-system credentials stay with the MCP servers, not the Workers.

## CWD context
Blast radius equals one Worker type.
