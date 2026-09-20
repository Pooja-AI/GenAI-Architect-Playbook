# How would you trigger Functions from Service Bus?

## Short answer
Trigger from Service Bus with the trigger binding using an identity-based connection.

## Key points
- Connect with the namespace name and managed identity.
- Tune maximum concurrent calls and prefetch.
- Use sessions if ordering is required; handle dead-lettering.

## CWD context
Scale follows queue depth automatically.
