## How would you deploy a custom model to SageMaker?

The simple flow is:

```text
Train Model
    ↓
Save Model Artifact
    ↓
S3
    ↓
SageMaker Model
    ↓
Endpoint Configuration
    ↓
SageMaker Endpoint
    ↓
CWD Coordinator / Worker
```

### Practical steps

1. **Train** the model using SageMaker training or your own environment.
2. **Package the model artifact** and store it in **S3**.
3. Create a **SageMaker Model** with the model artifact + inference container.
4. Create an **endpoint configuration** with instance type/count.
5. Deploy a **SageMaker real-time endpoint**.
6. CWD calls the endpoint using the **SageMaker Runtime API**.
7. Monitor latency, errors, throughput, and model quality.

### Interview answer

> “I would package the trained model and store the artifact in S3, create a SageMaker model with the appropriate inference container, configure the endpoint, and deploy it as a real-time endpoint. The CWD Coordinator or Worker can then invoke the endpoint for predictions. I would also enable monitoring and use versioned models so we can roll back safely.”
