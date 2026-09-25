## How would you version models?

I would use **SageMaker Model Registry** and maintain immutable model versions.

```text
Training
   ↓
Model v1
   ↓
Evaluation
   ↓
Model Registry
   ↓
Model v2
   ↓
Evaluation
   ↓
Approved Version
   ↓
Production Endpoint
```

### What I would track

* Model version: `intent-classifier-v1`, `v2`
* Dataset version
* Code/Git commit
* Training parameters
* Evaluation metrics
* Model artifact in S3
* Approval status
* Deployment environment

### CWD example

```text
Intent Classifier
   ├── v1 → F1 0.89
   ├── v2 → F1 0.93
   └── v3 → F1 0.95  ← Production
```

If **v3** has a production issue, I can route traffic back to **v2**.

### Interview answer

> “I would version models through SageMaker Model Registry, with each version linked to its dataset, code, parameters, metrics, and S3 model artifact. Only an evaluated and approved version would be promoted to production. This also gives us a clean rollback path to the previous model version.”

**Memory:**
**Train → Version → Evaluate → Approve → Deploy → Rollback**
