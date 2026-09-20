# How do you handle token-limit errors?

## Short answer
Token-limit errors (context length exceeded) are prevented by budgeting tokens before the call, not handled after.

## Key points
- Count tokens in advance (for example with tiktoken) and enforce a budget per prompt section.
- Summarise older conversation turns; trim retrieved chunks using rerank score and a threshold.
- Set max output tokens explicitly.
- Fall back to a larger-context model or map-reduce for very large inputs.

## CWD context
The LangGraph state keeps a rolling summary so history never grows unbounded.
