## How would you implement model validation?

I would validate the model **before allowing it into production**.

```text id="7bqv4h"
Trained Model
     ↓
Validation Dataset
     ↓
Metrics
     ↓
Quality Threshold?
   ↙          ↘
 PASS         FAIL
  ↓             ↓
Registry      Stop + Alert
  ↓
Deploy
```

### What I validate

* **Accuracy / Precision / Recall / F1** for classification
* **False positives / false negatives**
* **Data quality**
* **Regression against previous model**
* **Inference latency**
* **Model size/resource usage**
* **Bias/fairness**, when applicable

### CWD example

For an intent classifier:

```text
New Model
   ↓
Test Dataset
   ↓
F1 = 0.94
Previous F1 = 0.91
Required F1 ≥ 0.90
   ↓
PASS
   ↓
Model Registry → Deploy
```

If F1 is below the threshold, **the pipeline stops**.

### Interview answer

> “I would implement model validation as a quality gate in the SageMaker pipeline. The new model would be evaluated against a fixed validation or test dataset, and I would check task-specific metrics, regression against the current model, data quality, latency, and other required controls. Only if the model meets predefined thresholds would I register and deploy it.”

**Memory:**
**Test → Metrics → Compare → Threshold → Approve/Reject**
