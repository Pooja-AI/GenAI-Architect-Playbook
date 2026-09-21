# When would you use SageMaker Asynchronous Inference?

## Short answer
Asynchronous inference suits large payloads, long processing and bursty traffic.

## Key points
- Workers submit an input in S3 and receive results by notification or polling.
- Can scale to zero when idle.
- Good for document processing and heavy scoring.

## CWD context
Not suitable when the user waits for an immediate answer.
