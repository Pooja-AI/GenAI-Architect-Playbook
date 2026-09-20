# How would you deploy Delegators?

## Short answer
Deploy each Delegator as its own Container App per domain, with its own identity and scope.

## Key points
- Internal ingress; scale on HTTP load or queue depth.
- Least-privilege managed identity per domain.
- Registered in the Agent Registry with capabilities and endpoint (A2A).

## CWD context
Separate deployment means a fault in one domain does not stop others.
