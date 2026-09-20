# How do you handle message failures?

## Short answer
Handle message failures with peek-lock settlement and clear rules for transient versus permanent errors.

## Key points
- Transient failure: abandon so it is redelivered.
- Permanent failure: dead-letter with a reason.
- Renew locks for long tasks; limit delivery attempts.

## CWD context
Alert on any DLQ growth.
