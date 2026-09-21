# Step Functions vs Lambda orchestration?

## Short answer
Step Functions is better than Lambda calling Lambda for orchestration.

## Key points
- Lambda orchestration couples functions, hits the 15-minute limit and pays for waiting.
- Step Functions manages state, retries and waits and gives a visual trace.
- Keep Lambdas for business logic only.

## CWD context
Avoid custom retry and state code in functions.
