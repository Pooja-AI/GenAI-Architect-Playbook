# How would you version prompts?

## Short answer
Version prompts as immutable, reviewed artifacts with attached evaluation results.

## Key points
- Stored in Git or the Prompt Registry with semantic versions and metadata.
- Pull-request review; evaluation on every change.
- Runtime pins a version by configuration; canary or A/B between versions.
- Version recorded in traces; changelog kept.

## CWD context
Never edit a prompt in place in production.
