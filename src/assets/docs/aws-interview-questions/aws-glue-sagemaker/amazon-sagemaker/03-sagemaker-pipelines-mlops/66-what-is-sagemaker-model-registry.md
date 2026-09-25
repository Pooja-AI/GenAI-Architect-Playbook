## What is SageMaker Model Registry?

**SageMaker Model Registry** is a central place to **store, version, approve, and manage ML models** throughout their lifecycle.

```text id="lq7l1r"
Training
   ↓
Model v1
   ↓
Evaluation
   ↓
Model Registry
   ├── Version
   ├── Metrics
   ├── Metadata
   └── Approval Status
          ↓
       Deploy
```

### What it tracks

* Model versions
* Model artifacts
* Evaluation metrics
* Training metadata
* Dataset/model lineage
* Approval status
* Deployment information

### CWD example

```text id="n4f8ab"
Intent Classifier
 ├── v1 → F1 0.89 → Rejected
 ├── v2 → F1 0.93 → Approved
 └── v3 → F1 0.95 → Approved → Production
```

If **v3 fails in production**, we can roll back to **v2**.

### Interview answer

> “SageMaker Model Registry provides centralized model versioning and lifecycle management. I use it to register trained models, track their metrics and metadata, manage approval status, and control which model versions can be deployed to production.”

**Memory:**
**Register → Version → Evaluate → Approve → Deploy → Rollback**
