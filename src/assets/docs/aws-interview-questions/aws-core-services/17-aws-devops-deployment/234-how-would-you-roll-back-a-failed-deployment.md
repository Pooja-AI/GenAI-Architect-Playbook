# How would you roll back a failed deployment?

## Short answer
Roll back by returning traffic or configuration to the last known good version.

## Key points
- CodeDeploy automatic rollback on alarms or failed hooks.
- Manual: previous ECS task set or task definition, Lambda alias to the prior version, AppConfig rollback, IaC revert.
- Expand-and-contract database changes keep old versions working.

## CWD context
Rehearse rollback so it is quick and calm.
