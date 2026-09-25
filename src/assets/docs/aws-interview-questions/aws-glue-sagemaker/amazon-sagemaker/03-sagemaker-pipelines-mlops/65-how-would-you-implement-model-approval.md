## How would you implement model approval?

I would make **model approval a controlled gate between evaluation and production deployment**.

```text id="s7nq5x"
Train
  ↓
Evaluate
  ↓
Quality Gate
  ↓
Model Registry
  ↓
Approval?
 ┌──────┴──────┐
 ↓             ↓
Approved     Rejected
 ↓             ↓
Deploy       Stop + Alert
```

### Practical approach

1. **Evaluate model** against predefined metrics.
2. **Compare with production model** for regression.
3. If metrics pass → mark model **Approved** in SageMaker Model Registry.
4. If manual governance is required → request **human approval**.
5. CI/CD checks approval status before deployment.
6. Deploy only approved models using **canary/blue-green** deployment.
7. Keep the previous approved model for rollback.

### CWD example

```text
New Intent Model v8
       ↓
F1 = 0.94
Threshold = 0.90
       ↓
Evaluation PASS
       ↓
Model Registry
       ↓
Approved
       ↓
Production
```

If F1 = 0.85 → **Rejected → no production deployment**.

### Interview answer

> “I would implement model approval through SageMaker Model Registry. After automated evaluation, the pipeline checks predefined quality thresholds and regression criteria. A passing model can be marked approved, or routed for manual approval when required. CI/CD only deploys models with an approved status, while the previous production version remains available for rollback.”

**Memory:**
**Evaluate → Gate → Approve → Deploy → Rollback**
