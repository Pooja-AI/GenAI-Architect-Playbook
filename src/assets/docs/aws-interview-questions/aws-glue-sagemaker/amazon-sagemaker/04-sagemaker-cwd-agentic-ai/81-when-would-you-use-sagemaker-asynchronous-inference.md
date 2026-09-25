## When would you use SageMaker Asynchronous Inference?

Use it when the **request is large or inference takes longer**, and the caller does **not need an immediate response**.

```text
Worker
  ↓
S3 / Async Endpoint
  ↓
SageMaker Model
  ↓
Long Processing
  ↓
S3 Output
  ↓
Notification
```

### Good use cases

* Large payloads
* Long-running inference
* Large image/video/document processing
* Spiky or intermittent workloads
* Batch-like requests that still need near-real-time processing

### CWD example

If a Worker needs to process a **large set of manufacturing images** using a custom SageMaker model, I could use asynchronous inference instead of making the Worker wait synchronously.

### Interview answer

> “I use SageMaker Asynchronous Inference when requests are large or inference takes longer and the caller doesn't require an immediate response. The input can be stored in S3, SageMaker processes it asynchronously, and the output is written to S3 with a notification when processing completes.”

**Memory:** **Large/Long request → Async → Process → S3 output → Notify**
