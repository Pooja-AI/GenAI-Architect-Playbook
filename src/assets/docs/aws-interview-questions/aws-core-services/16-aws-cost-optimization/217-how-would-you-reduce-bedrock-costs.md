# How would you reduce Bedrock costs?

## Short answer
Reduce Bedrock cost by sending fewer, smaller and cheaper calls.

## Key points
- Model tiering and routing; prompt caching; response and semantic caching.
- Batch inference for offline work; Provisioned Throughput only for steady heavy load.
- Shorter prompts, fewer and better chunks, capped output tokens; distillation for narrow tasks.
- Application inference profiles for cost attribution.

## CWD context
Model routing is usually the biggest single lever.
