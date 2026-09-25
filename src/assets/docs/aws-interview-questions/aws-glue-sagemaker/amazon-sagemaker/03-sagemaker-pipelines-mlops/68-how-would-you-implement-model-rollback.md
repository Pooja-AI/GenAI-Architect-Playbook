## How would you implement model rollback?

I would keep **every approved model version immutable** in the SageMaker Model Registry.

```text
Model v1 ──→ Production
              ↓
        Deploy Model v2
              ↓
       Monitor metrics
              ↓
        Problem detected
              ↓
       Roll back to v1
```

### Practical steps

1. Register each model version in **SageMaker Model Registry**.
2. Deploy the new model using **blue-green or canary deployment**.
3. Monitor:

   * Error rate
   * P95/P99 latency
   * Accuracy/F1
   * Data/model drift
4. If the new model fails the threshold, **stop traffic to v2**.
5. Route traffic back to the **previous approved model v1**.
6. Investigate v2 and fix the issue before redeployment.

### Interview answer

> “I implement rollback by keeping immutable model versions in SageMaker Model Registry. I deploy the new model using canary or blue-green deployment and monitor latency, errors, and model-quality metrics. If the new version violates our thresholds, I immediately shift traffic back to the previous approved model version. This gives us a fast and safe production rollback without retraining the model.”

**Memory:** `Immutable Version → Deploy → Monitor → Detect → Shift Back → Investigate`
