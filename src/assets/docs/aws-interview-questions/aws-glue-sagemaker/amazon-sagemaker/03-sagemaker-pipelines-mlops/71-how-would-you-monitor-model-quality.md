## How would you monitor model quality?

I monitor **actual model performance in production**, not just infrastructure metrics.

```text
Production Requests
        ↓
Model Predictions
        ↓
Collect Actual Labels
        ↓
Calculate Quality Metrics
        ↓
Compare with Threshold
        ↓
Alert / Retrain / Rollback
```

### What I monitor

For a classification model:

* **Accuracy**
* **Precision**
* **Recall**
* **F1 score**
* **False positives / false negatives**
* **Confusion matrix**

Also monitor:

* Prediction distribution
* Data drift
* Model latency
* Error rate
* Performance by important segments

Example:

```text
Baseline F1       = 0.93
Production F1     = 0.91  → OK
Production F1     = 0.78  → Alert
```

### AWS implementation

**SageMaker Model Monitor + CloudWatch** can track production model metrics and trigger alerts. When ground-truth labels arrive later, calculate the actual quality metrics and compare them with the approved baseline.

### Interview answer

> “I monitor model quality by collecting production predictions and, when ground truth becomes available, calculating metrics such as precision, recall, F1, and false-positive rate. I compare them against predefined thresholds and the previous production model. If quality degrades significantly, I trigger an investigation, retraining, or rollback.”

**Memory:** `Predict → Get Labels → Measure → Compare → Alert → Retrain/Rollback`
