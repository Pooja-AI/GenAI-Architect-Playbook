# How would you resume a workflow?

## Short answer
Resume by using Standard workflow durability and redrive.

## Key points
- Redrive restarts a failed execution from the failed state, reusing successful steps.
- Callback tasks resume when SendTaskSuccess arrives with the task token.
- Otherwise start a new execution using an idempotency key and stored progress.

## CWD context
Redrive works only within its time limit, so operate promptly.
