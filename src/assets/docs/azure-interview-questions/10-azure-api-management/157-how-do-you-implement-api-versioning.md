# How do you implement API versioning?

## Short answer
Use APIM versions for breaking changes and revisions for safe non-breaking changes.

## Key points
- Versioning scheme by path, header or query string.
- Revisions can be tested before being made current.
- Announce deprecation and sunset dates; support both versions during transition.

## CWD context
The contract is public; treat changes with care.
