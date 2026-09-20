# How would you move an agent from development to production?

## Short answer
Promote by configuration through separate environments, with gates, not by copying things by hand.

## Key points
- Separate dev, test and prod projects or subscriptions, all defined in IaC.
- Versioned prompts, agent configs and models.
- Evaluation and security gates, then approval.
- Canary release, monitoring and a rollback plan.

## CWD context
The same artifact moves through environments; only configuration changes.
