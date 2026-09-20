# How do you implement retries?

## Short answer
Combine trigger-level redelivery with function retry policies, and keep handlers idempotent.

## Key points
- Service Bus trigger redelivers until MaxDeliveryCount, then dead-letters.
- Retry policies (fixed or exponential) for transient errors only.
- Poison-message handling through the DLQ.

## CWD context
Retrying without idempotency causes duplicate side effects.
