# How would you monitor Glue jobs?

## Short answer
Monitor Glue with CloudWatch, the Spark UI and event-based alerts.

## Key points
- Job status, duration, worker and memory metrics; continuous logs; job run insights.
- Data-quality results; EventBridge failure events to SNS.
- Alarms on duration and missing runs; cost by tags.

## CWD context
Alert when a scheduled job does not run, not only when it fails.
