### How do you implement model approval?

Use a **Model Registry + evaluation gate + approval workflow**.

1. **Register the model**

   * Model name/version
   * Owner
   * Intended use case
   * Approved agents/environments

2. **Evaluate**

   * Accuracy / groundedness
   * Hallucination
   * Safety
   * Latency
   * Cost
   * Token usage

3. **Security review**

   * Data/privacy requirements
   * Access permissions
   * Known risks

4. **Approval gate**

   * Only if evaluation and security criteria pass, an authorized reviewer approves the model for production.

5. **Controlled deployment**

   ```text
   Development
       ↓
   Evaluation
       ↓
   Security Review
       ↓
   Approval
       ↓
   Staging
       ↓
   Canary
       ↓
   Production
   ```

6. **Monitor & rollback**

   * Monitor production quality, latency, errors, and cost.
   * Roll back if the approved model later shows regression.

### Interview answer

> **"I implement model approval through a centralized Model Registry and an evaluation gate. Every model version is evaluated for quality, safety, latency, and cost, followed by security and data-access review. An authorized reviewer approves the model before production. I then deploy it through staging and canary rollout, with continuous monitoring and rollback capability."**
