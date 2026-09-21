# Real-time vs asynchronous SageMaker inference?

## Short answer
Real-time endpoints serve low-latency requests; asynchronous endpoints queue large or slow requests.

## Key points
- Real-time: always-on, small payloads, short timeout.
- Asynchronous: payloads up to about 1 GB, processing up to an hour, results in S3, scale to zero.
- Batch transform for offline datasets.

## CWD context
Choose by latency need and payload size.
