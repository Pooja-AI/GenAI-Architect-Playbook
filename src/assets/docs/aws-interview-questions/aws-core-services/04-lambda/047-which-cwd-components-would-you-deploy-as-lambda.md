# Which CWD components would you deploy as Lambda?

## Short answer
Deploy short, event-triggered components as Lambda functions.

## Key points
- API Gateway authoriser and small status or health endpoints.
- S3-triggered ingestion steps and EventBridge-scheduled maintenance such as reconciliation and cache warm-up.
- SQS consumers for short Workers, webhook receivers, DLQ redrive and replay tools.
- Task steps inside Step Functions workflows.

## CWD context
The Coordinator's agent loop does not run on Lambda.
