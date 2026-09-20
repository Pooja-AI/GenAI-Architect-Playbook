# Service Bus vs Event Grid?

## Short answer
Use Service Bus for work that must be processed reliably; use Event Grid for lightweight notifications.

## Key points
- Service Bus: commands, DLQ, ordering, settlement control.
- Event Grid: discrete reactive events, push delivery, wide fan-out, serverless.

## CWD context
Event Grid says "something happened"; Service Bus says "please do this".
