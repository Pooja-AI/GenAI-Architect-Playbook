# How do you handle model-specific context limits?

## Short answer
Treat context limits as per-model configuration and enforce them before the call.

## Key points
- Store context window and maximum output per model.
- Count tokens; summarise or truncate by priority; map-reduce for very long documents.
- Choose a long-context model for large inputs; catch validation errors and fall back.

## CWD context
Switching models can silently change limits, so test them.
