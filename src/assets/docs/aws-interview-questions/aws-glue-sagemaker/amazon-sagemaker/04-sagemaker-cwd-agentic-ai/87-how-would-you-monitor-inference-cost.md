# How would you monitor inference cost?

## Short answer
Monitor inference cost by usage type, utilisation and cost per prediction.

## Key points
- Cost Explorer by SageMaker usage type and tags; endpoint hours usually dominate.
- Idle endpoints show as low invocations or utilisation; cost per prediction = endpoint cost ÷ invocations.
- Savings Plans, budgets and anomaly alerts.

## CWD context
Delete or scale down unused endpoints quickly.
