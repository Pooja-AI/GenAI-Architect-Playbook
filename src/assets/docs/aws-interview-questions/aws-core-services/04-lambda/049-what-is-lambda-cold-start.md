# What is Lambda cold start?

## Short answer
A cold start is the extra latency when Lambda creates a new execution environment.

## Key points
- Lambda downloads the code, starts the runtime and runs your initialisation before the handler.
- Happens on the first invocation and when scaling out; warm environments are reused.
- Impact grows with large packages, heavy imports and VPC setup.

## CWD context
Cold starts matter on user-facing paths and hardly at all in background jobs.
