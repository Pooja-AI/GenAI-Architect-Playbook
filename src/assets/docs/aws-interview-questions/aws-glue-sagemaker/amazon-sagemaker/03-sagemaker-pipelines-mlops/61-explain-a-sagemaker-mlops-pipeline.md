## SageMaker MLOps Pipeline

A SageMaker MLOps pipeline automates **data → training → evaluation → approval → deployment → monitoring**.

```text
Code / Data Change
       ↓
   CI/CD Pipeline
       ↓
     Glue
       ↓
      S3
       ↓
SageMaker Training
       ↓
   Evaluation
       ↓
 Model Registry
       ↓
 Approval Gate
       ↓
 Deploy Endpoint
       ↓
   Monitoring
       ↓
 Retrain if needed
```

### CWD example

For the **custom intent classifier**:

1. **Glue** prepares historical CWD requests.
2. **S3** stores versioned train/validation/test datasets.
3. **SageMaker Training** trains the classifier.
4. **Evaluation** checks accuracy/F1 and regression.
5. **Model Registry** stores the model version.
6. **Approval gate** checks whether quality meets the threshold.
7. **SageMaker Endpoint** deploys the approved model.
8. **CloudWatch/Model Monitor** tracks latency, errors, and drift.
9. If performance degrades, trigger **retraining**.

### Interview answer

> “I would build the SageMaker MLOps pipeline to automate the complete ML lifecycle. Glue prepares the data and stores versioned datasets in S3. SageMaker trains and evaluates the model, then registers the approved version in Model Registry. CI/CD promotes the approved model through environments to a SageMaker endpoint. CloudWatch and model monitoring track production performance and drift, and significant degradation can trigger retraining.”

**Memory:**
**Prepare → Train → Evaluate → Register → Approve → Deploy → Monitor → Retrain**
