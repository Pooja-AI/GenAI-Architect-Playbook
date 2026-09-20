# How does Functions scale?

## Short answer
Functions scale through a scale controller that watches the trigger source.

## Key points
- Queue length or HTTP concurrency drives instance count.
- Configure maximum instances and per-instance concurrency.
- Protect downstream systems from too much parallelism.

## CWD context
Cap concurrency so scaling does not overwhelm MCP servers or Azure OpenAI.
