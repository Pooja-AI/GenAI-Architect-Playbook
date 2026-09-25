## How would you detect model drift?

I would monitor **two types of drift**:

```text
Production Data
      ↓
Compare with baseline
      ↓
┌──────────────────────┐
│ Data Drift            │ → Input distribution changed
│ Model/Prediction Drift│ → Prediction behavior changed
└──────────────────────┘
      ↓
Quality degradation?
      ↓
Alert → Investigate → Retrain
```

### 1. Data drift

Compare production inputs with the training/baseline data.

Examples:

* Feature distribution changed
* Missing values increased
* New categories appeared
* Statistical distribution changed

Metrics/techniques: **PSI, KS test, distribution comparison**.

### 2. Model performance drift

When actual labels become available, monitor:

* Accuracy
* Precision
* Recall
* F1
* False-positive/false-negative rate

For example:

```text
Training F1 = 0.93
Production F1 = 0.78
              ↓
        Possible drift
```

### AWS implementation

**SageMaker Model Monitor + CloudWatch** can monitor production data/predictions, generate violations/metrics, and trigger alerts or retraining workflows.

### Interview answer

> “I detect drift by comparing production input distributions against the training baseline and, when labels are available, comparing production model performance against the baseline. I monitor these metrics through SageMaker Model Monitor and CloudWatch. If drift crosses a predefined threshold, I alert the team and trigger investigation or retraining.”

**Memory:** `Input Changed → Prediction Changed → Performance Dropped → Alert → Retrain`
