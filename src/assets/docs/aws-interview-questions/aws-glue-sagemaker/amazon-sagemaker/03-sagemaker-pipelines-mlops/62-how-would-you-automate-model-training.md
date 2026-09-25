## How would you automate model training?

I would trigger training through an **MLOps pipeline** instead of manually starting SageMaker jobs.

```text
Code / Data Change
       ↓
Event / Schedule
       ↓
CI/CD / SageMaker Pipeline
       ↓
Glue → S3
       ↓
SageMaker Training
       ↓
Evaluate
       ↓
Model Registry
       ↓
Approval
       ↓
Deploy
```

### Practical approach

1. **Trigger** on a schedule or significant new data arrival.
2. **Glue** prepares the latest training dataset.
3. **SageMaker Pipeline** starts the training job.
4. **Evaluate** the new model against quality thresholds.
5. If it passes → **Model Registry** → approval → deployment.
6. If it fails → stop the pipeline and alert.
7. Track every run in **SageMaker Experiments/MLflow**.

### CWD example

```text
New training data
      ↓
EventBridge / Schedule
      ↓
SageMaker Pipeline
      ↓
Glue → S3 → Training
      ↓
Evaluation
   ↙       ↘
Pass       Fail
 ↓           ↓
Registry    Alert
 ↓
Deploy
```

### Interview answer

> “I would automate training using SageMaker Pipelines triggered by a schedule or new data event. The pipeline would prepare data with Glue, run SageMaker training, evaluate the model against predefined thresholds, register the approved model, and deploy it through CI/CD. Failed evaluations would stop deployment and trigger an alert.”

**Memory:**
**Trigger → Prepare → Train → Evaluate → Register → Deploy**
