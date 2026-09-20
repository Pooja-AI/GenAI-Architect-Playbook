# Service Bus vs Event Hubs?

## Short answer
Use Event Hubs for high-volume streaming and Service Bus for transactional messaging.

## Key points
- Event Hubs: partitioned log, replay, very high throughput, telemetry.
- Service Bus: per-message settlement, DLQ, sessions.

## CWD context
Telemetry and log streams go to Event Hubs; workflow commands to Service Bus.
