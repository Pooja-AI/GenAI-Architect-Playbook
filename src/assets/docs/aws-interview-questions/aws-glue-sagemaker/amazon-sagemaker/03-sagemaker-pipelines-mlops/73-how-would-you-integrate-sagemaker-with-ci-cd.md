## How would you integrate SageMaker with CI/CD?

I would automate the **train → evaluate → approve → deploy** lifecycle.

```text
Git Push
   ↓
CI/CD Pipeline
   ↓
Test + Build
   ↓
Glue → S3
   ↓
SageMaker Training
   ↓
Evaluate Model
   ↓
Model Registry
   ↓
Approval Gate
   ↓
Deploy to SageMaker Endpoint
   ↓
Monitor → Rollback if needed
```

### Practical implementation

* **CodePipeline/GitHub Actions** → trigger pipeline
* **CodeBuild** → unit tests, validation, Docker build
* **Glue** → prepare training data
* **SageMaker Training** → train model
* **SageMaker Model Registry** → version and approve model
* **SageMaker Endpoint** → deploy approved model
* **CloudWatch** → monitor quality and infrastructure
* **Rollback** → previous approved model if deployment fails

### Interview answer

> “I integrate SageMaker into CI/CD by triggering a SageMaker Pipeline from source-code or data changes. The pipeline prepares data, trains and evaluates the model, registers the model, and applies an approval gate. Only an approved model is deployed to the SageMaker endpoint. After deployment, CloudWatch monitors the endpoint and model quality, and we can automatically roll back to the previous approved version if thresholds are violated.”

**Memory:** `Code → Data → Train → Evaluate → Register → Approve → Deploy → Monitor → Rollback`
