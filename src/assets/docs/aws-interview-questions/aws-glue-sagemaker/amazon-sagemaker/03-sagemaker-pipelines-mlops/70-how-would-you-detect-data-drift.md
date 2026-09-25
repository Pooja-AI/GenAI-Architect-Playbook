## How would you detect data drift?

I compare **production input data** with the **training/baseline data**.

```text
Training Data
     ↓
Create baseline statistics
     ↓
Production Data
     ↓
Compare distributions
     ↓
Drift detected?
   ↓ Yes
Alert → Investigate → Retrain
```

### What I monitor

* **Numerical features:** mean, median, variance, distribution
* **Categorical features:** category frequency changes
* **Missing values:** sudden increase
* **New/unexpected values**
* **Statistical tests:** PSI, KS test, distribution comparison

Example:

```text
Training age distribution: 20–50
Production age distribution: 40–80
                    ↓
             Data drift detected
```

### AWS approach

Use **SageMaker Model Monitor** to establish a baseline and continuously compare production data against it. Send violations/metrics to **CloudWatch** and trigger an alert or retraining workflow when thresholds are exceeded.

### Interview answer

> “I detect data drift by comparing production feature distributions against the training baseline. I monitor statistics such as distribution, missing values, categorical frequencies, and use metrics like PSI or KS test. With SageMaker Model Monitor and CloudWatch, I can automatically detect threshold violations and trigger an investigation or retraining pipeline.”

**Memory:** `Baseline → Production → Compare → Threshold → Alert → Retrain`
