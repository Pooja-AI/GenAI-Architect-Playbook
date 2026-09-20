# How would you perform model rollback?

## Short answer
Roll back by shifting traffic to the previous deployment, which is kept running.

## Key points
- Blue / green deployments under one endpoint.
- Registry retains old versions; rollback automated in the pipeline.
- Verify with monitoring and run a post-incident review.

## CWD context
Rollback should be one command and rehearsed.
