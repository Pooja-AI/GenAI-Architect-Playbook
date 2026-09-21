# How would you reduce Lambda cold-start latency?

## Short answer
Reduce cold starts by keeping environments warm and initialisation light.

## Key points
- Provisioned concurrency for critical functions; SnapStart where supported.
- Small packages and layers; lazy or module-level initialisation of heavy clients.
- ARM/Graviton runtimes; avoid heavy imports.
- Keep cold-start-sensitive calls off the user path.

## CWD context
Warm capacity costs money, so apply it only where latency justifies it.
