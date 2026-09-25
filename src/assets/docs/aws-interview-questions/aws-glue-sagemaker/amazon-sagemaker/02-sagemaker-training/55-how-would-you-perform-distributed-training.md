## How would you perform distributed training?

With SageMaker, I would use **multiple training instances** so the model training workload is distributed across them.

```text id="jv0b8k"
             S3 Training Data
                    ↓
          SageMaker Training Job
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    Instance 1  Instance 2  Instance 3
        └───────────┼───────────┘
                    ↓
            Distributed Model
                    ↓
              S3 Artifact
```

### Practical approach

1. Store training data in **S3**.
2. Configure a SageMaker training job with **multiple instances**.
3. Use a distributed framework such as **PyTorch Distributed / TensorFlow distributed** when appropriate.
4. Split training work across GPUs/instances.
5. Synchronize model parameters/gradients between workers.
6. Save the final model artifact to S3.
7. Evaluate and register the model.

### CWD example

For a large custom model:

```text
S3
 ↓
SageMaker
 ↓
4 GPU Instances
 ↓
Distributed Training
 ↓
Model Artifact
 ↓
S3 / Model Registry
```

### Interview answer

> “For large models or datasets, I would configure a SageMaker training job with multiple compute instances and use a distributed training framework such as PyTorch Distributed. The workers process the training workload in parallel and synchronize model updates. After training, the final model artifact is stored in S3 and can be registered and deployed.”

**Memory:**
**S3 → Multiple Instances → Parallel Training → Synchronize → Model Artifact**
