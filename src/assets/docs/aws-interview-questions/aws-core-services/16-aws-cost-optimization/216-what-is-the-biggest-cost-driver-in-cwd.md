# What is the biggest cost driver in CWD?

## Short answer
The biggest cost driver is usually Bedrock token usage, followed by fixed-capacity services.

## Key points
- Bedrock: model choice × tokens per request × volume.
- Then OpenSearch OCU baseline, running Fargate tasks, NAT gateway data processing, CloudWatch Logs ingestion and data transfer.
- Confirm with Cost Explorer grouped by service and usage type.

## CWD context
Measure before optimising; do not assume.
