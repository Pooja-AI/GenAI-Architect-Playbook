# How do you handle cold starts?

## Short answer
Reduce cold starts by keeping instances warm and initialisation light.

## Key points
- Flex Consumption always-ready instances or Premium plan pre-warmed instances; minimum replicas on Container Apps.
- Small deployment packages, lazy imports and connection reuse.
- Keep cold-start-sensitive calls off the user path.

## CWD context
Warm instances cost money; apply only where latency justifies it.
