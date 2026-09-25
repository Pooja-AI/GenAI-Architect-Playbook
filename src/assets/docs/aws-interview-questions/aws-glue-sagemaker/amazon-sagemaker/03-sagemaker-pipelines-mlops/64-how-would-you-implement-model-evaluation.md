## How would you implement model evaluation?

I would evaluate the model using a **separate test dataset** and compare it against predefined quality thresholds and the current production model.

```text id="8y2k7a"
Trained Model
     ↓
Test Dataset
     ↓
Generate Predictions
     ↓
Calculate Metrics
     ↓
Compare with Threshold / Baseline
     ↓
 ┌──────────┴──────────┐
 PASS                  FAIL
  ↓                      ↓
Register              Reject
  ↓
Deploy
```

### What I evaluate

For a **CWD intent classifier**:

* Accuracy
* Precision
* Recall
* F1-score
* Confusion matrix
* False-positive / false-negative rate
* Performance by important intent classes

Also:

* inference latency
* resource usage
* regression against previous model
* bias/fairness where applicable

### Example

```text
New Model F1       = 0.94
Production F1      = 0.91
Minimum threshold  = 0.90

        ↓
      PASS
        ↓
Model Registry
```

### Interview answer

> “I would evaluate the trained model on a held-out test dataset and calculate task-specific metrics such as precision, recall, and F1. I would compare the results against predefined thresholds and the current production model to detect regressions. Only models that pass the evaluation gate would move to the Model Registry and deployment.”

**Memory:**
**Test → Predict → Metrics → Compare → Threshold → Approve/Reject**
