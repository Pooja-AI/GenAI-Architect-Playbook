# How would you implement model rollback?

## Short answer
Roll back by returning the endpoint to the previous configuration or version.

## Key points
- Deployment guardrails can roll back automatically on CloudWatch alarms.
- Manual: update the endpoint to the previous endpoint configuration.
- Old versions stay in the registry; verify metrics afterwards.

## CWD context
Keep the previous configuration available until the new one is proven.
