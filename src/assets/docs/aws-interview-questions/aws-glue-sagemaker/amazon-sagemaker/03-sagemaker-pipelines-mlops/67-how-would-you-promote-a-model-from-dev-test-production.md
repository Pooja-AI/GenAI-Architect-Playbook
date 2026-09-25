## How would you promote a model from Dev → Test → Production?

I would promote the **same approved model artifact** through environments rather than retraining it separately in each environment.

```text
SageMaker Training
       ↓
 Model Registry
       ↓
      DEV
       ↓
 Automated Evaluation
       ↓
      TEST
       ↓
 Integration + Performance Tests
       ↓
 Approval Gate
       ↓
   PRODUCTION
       ↓
 Canary / Blue-Green
```

### Practical flow

1. **Dev**

   * Train and register model.
   * Run unit and basic model evaluation.

2. **Test**

   * Promote the **same model version**.
   * Run integration, accuracy, regression, security, and performance tests.

3. **Production**

   * Require approval.
   * Deploy using **canary or blue-green**.
   * Monitor latency, errors, and model quality.
   * Roll back if problems occur.

### CWD example

```text
Intent Model v8
     ↓
DEV → TEST → PROD
          ↓
      Canary 10%
          ↓
       Monitor
          ↓
      100% Traffic
```

### Interview answer

> “I would register the model in SageMaker Model Registry and promote the same immutable model version from Dev to Test and then Production. Each environment would have its own validation gates. After Test passes, production approval is required, followed by a canary or blue-green deployment. I would monitor the production metrics and roll back to the previous approved version if necessary.”

**Memory:**
**Same Artifact → Dev → Test → Approve → Canary → Production → Monitor → Rollback**
