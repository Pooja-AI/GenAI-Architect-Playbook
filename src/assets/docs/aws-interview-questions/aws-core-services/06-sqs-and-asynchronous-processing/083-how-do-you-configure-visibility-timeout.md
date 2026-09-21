# How do you configure visibility timeout?

## Short answer
Set the visibility timeout above the maximum processing time, and extend it for long jobs.

## Key points
- For Lambda consumers use several times the function timeout.
- Use ChangeMessageVisibility as a heartbeat for long tasks.
- Too short causes duplicates; too long slows recovery after a crash.

## CWD context
Measure real processing times before choosing.
