# How would you deploy Lambda versions?

## Short answer
Deploy Lambda through immutable versions and aliases, with traffic shifting.

## Key points
- Publish a version per release; aliases such as dev and prod point at versions.
- CodeDeploy canary or linear shifting with pre- and post-traffic test hooks.
- Automatic rollback on CloudWatch alarms; event sources reference the alias.

## CWD context
Rollback is moving the alias back.
