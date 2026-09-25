## How would a Worker call a SageMaker endpoint?

The Worker uses the **AWS SageMaker Runtime API** to invoke the deployed model endpoint.

```text
CWD Worker
    ↓
AWS SDK / Boto3
    ↓
SageMaker Runtime
    ↓
SageMaker Endpoint
    ↓
ML Model
    ↓
Prediction
    ↓
Worker
```

### Practical flow

1. Worker receives the request from the **Delegator**.
2. Worker prepares the model input.
3. Worker calls `InvokeEndpoint`.
4. SageMaker runs the model.
5. Prediction is returned to the Worker.
6. Worker validates the result and sends it back to the Delegator.

### Security

The Worker runs with an **IAM task role** containing only the required permission:

```text
sagemaker:InvokeEndpoint
```

No AWS access keys are stored in the application.

### Interview answer

> “The Worker calls the SageMaker Runtime API using the AWS SDK and invokes the specific SageMaker endpoint. The Worker’s IAM task role has least-privilege permission to invoke that endpoint. SageMaker performs the prediction and returns the result, which the Worker validates before passing it back to the Delegator.”

**Memory:** `Worker → Boto3 → InvokeEndpoint → SageMaker → Prediction → Worker`
