# How do you handle Bedrock timeout?

## Short answer
Handle Bedrock timeouts with explicit client timeouts, streaming and a fallback.

## Key points
- Raise the SDK read timeout above the default for long generations.
- Stream responses so users see progress; measure time to first token.
- Retry transient failures once, then use another region or a smaller model.
- Remember API Gateway's 29-second limit; long work goes async.

## CWD context
Return a partial or degraded answer with a clear message rather than hanging.
