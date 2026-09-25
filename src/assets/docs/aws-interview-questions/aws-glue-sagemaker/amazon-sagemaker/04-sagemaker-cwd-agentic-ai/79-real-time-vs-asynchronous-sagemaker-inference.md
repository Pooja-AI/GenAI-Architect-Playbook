## Real-time vs asynchronous SageMaker inference

The main difference is **how quickly the caller needs the prediction**.

|          | Real-time inference       | Asynchronous inference          |
| -------- | ------------------------- | ------------------------------- |
| Response | Immediate                 | Later                           |
| Use case | Low-latency prediction    | Large/long-running requests     |
| Caller   | Waits for response        | Doesn't wait                    |
| Example  | CWD intent classification | Large document/image processing |

### Real-time

```text
Worker → SageMaker Endpoint → Prediction → Worker
          (synchronous)
```

Use when CWD needs an immediate result, such as **intent classification**.

### Asynchronous

```text
Worker → S3 → Async SageMaker
                  ↓
              Processing
                  ↓
              S3 Output
                  ↓
              Notification
```

Use when requests are **large or take longer to process** and the caller doesn't need to wait.

### Interview answer

> “For low-latency use cases such as CWD intent classification, I would use real-time SageMaker inference because the Worker needs the prediction immediately. For large payloads or long-running inference where an immediate response isn't required, I would use asynchronous inference with S3 for input/output and notification when processing completes.”

**Memory:**
**Real-time = Wait for result**
**Async = Submit and continue**
