# How would you create CloudWatch alarms?

## Short answer
Create alarms that page on symptoms and explain causes, with noise control.

## Key points
- Static and anomaly-detection thresholds; metric math for rates; percentile statistics.
- Composite alarms to reduce noise; correct handling of missing data.
- Actions to SNS, Chatbot, on-call tools or auto-remediation Lambdas; defined in IaC.
- Symptoms: latency, error rate, SLO burn. Causes: DLQ, throttling, capacity.

## CWD context
Every alarm links to a runbook and an owner.
