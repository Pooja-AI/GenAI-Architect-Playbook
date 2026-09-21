# How would you handle schema changes?

## Short answer
Handle schema changes by landing raw data untouched and evolving curated schemas deliberately.

## Key points
- Crawler schema-change policy; Iceberg, Hudi or Delta tables for additive column evolution.
- ResolveChoice for ambiguous types; Schema Registry for streaming.
- Alerts and review for breaking changes.

## CWD context
Additive changes flow through; breaking changes need a human decision.
