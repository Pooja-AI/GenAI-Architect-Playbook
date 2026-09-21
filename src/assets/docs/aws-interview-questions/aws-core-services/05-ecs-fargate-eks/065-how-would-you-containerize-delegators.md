# How would you containerize Delegators?

## Short answer
Run each Delegator as its own ECS service, per domain.

## Key points
- Own task role with least privilege; internal load balancer or Service Connect.
- Registered in the Agent Registry with capabilities and endpoint.
- Scale on requests or CPU.

## CWD context
A fault in one domain must not stop the others.
