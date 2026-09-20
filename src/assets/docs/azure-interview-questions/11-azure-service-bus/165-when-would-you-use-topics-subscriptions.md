# When would you use topics/subscriptions?

## Short answer
Use topics and subscriptions when many consumers care about the same event.

## Key points
- Example: DocumentUpdated notifies the indexer, the cache invalidator and the audit logger.
- Filters route by properties such as agent type or tenant.
- Status updates can be published to interested consumers.

## CWD context
Adding a new consumer requires no change to the publisher.
