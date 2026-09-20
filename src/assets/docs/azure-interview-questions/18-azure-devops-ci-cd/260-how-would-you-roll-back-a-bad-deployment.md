# How would you roll back a bad deployment?

## Short answer
Roll back by returning traffic or configuration to the last known good version.

## Key points
- Previous revision or deployment restored in seconds; prompt, config and model routing reverted through configuration.
- Expand-and-contract database changes keep old versions working.
- Verify, pause further releases, then investigate.

## CWD context
Rehearse rollback; it should be one command.
