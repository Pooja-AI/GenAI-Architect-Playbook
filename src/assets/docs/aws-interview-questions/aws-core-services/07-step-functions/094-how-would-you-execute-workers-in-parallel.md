# How would you execute Workers in parallel?

## Short answer
Run Workers in parallel with a Parallel state (fixed branches) or a Map state (dynamic items).

## Key points
- Each branch calls SQS, Lambda or ECS; the state waits for all branches.
- MaxConcurrency limits load; Distributed Map handles very large fan-outs.
- ToleratedFailure supports partial success.

## CWD context
Cap concurrency so downstream MCP servers and Bedrock are not overwhelmed.
