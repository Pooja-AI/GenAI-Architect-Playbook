# Which CWD components would you implement using Functions?

## Short answer
Use Functions for short, event-triggered tasks around the main agent runtime.

## Key points
- Ingestion triggers: blob or event notifications starting pipelines.
- Service Bus consumers for lightweight jobs.
- Webhook receivers for Salesforce or ServiceNow events.
- Scheduled maintenance: reconciliation, cache warm-up, DLQ replay tools.

## CWD context
The LangGraph Coordinator does not run on Functions.
