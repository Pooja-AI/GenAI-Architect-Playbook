## How would you perform continuous training?

I would automatically retrain the model when **new data arrives, drift is detected, or a scheduled retraining window occurs**.

```text
New Data / Drift
       ↓
     Glue
       ↓
      S3
       ↓
SageMaker Pipeline
       ↓
   Train Model
       ↓
    Evaluate
       ↓
Quality Gate
   ↓       ↓
Fail     Pass
 ↓         ↓
Stop   Model Registry
             ↓
          Approval
             ↓
          Deploy
             ↓
          Monitor
             ↓
        Drift detected
             ↓
          Retrain
```

### Practical implementation

* **EventBridge** → triggers training on schedule or new-data event.
* **Glue** → cleans and prepares new training data.
* **S3** → stores versioned datasets.
* **SageMaker Pipeline** → trains and evaluates.
* **Model Registry** → versions the new model.
* **Quality gate** → deploy only if metrics meet thresholds.
* **CloudWatch/Model Monitor** → detects drift and can trigger retraining.

### Interview answer

> “I implement continuous training using a SageMaker Pipeline. New data or drift detection triggers the pipeline, Glue prepares the data, SageMaker trains and evaluates a new model, and the model is registered with its metrics and dataset version. If it passes the quality gate, it is deployed; otherwise, the existing production model remains unchanged.”

**Memory:** `New Data → Prepare → Train → Evaluate → Approve → Deploy → Monitor → Retrain`
