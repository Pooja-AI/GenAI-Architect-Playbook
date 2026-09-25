## How would you roll back a failed deployment?

Main idea: **quickly route traffic back to the last known-good version.**

```text id="k6m4pz"
New Version
     ↓
Deployment
     ↓
Monitor
     ↓
Failure
     ↓
Rollback
     ↓
Previous Version
```

### For CWD on ECS/Fargate

If we use **blue-green**:

```text id="3q8r1x"
ALB
 ↓
Green v2 ❌
 ↓
Rollback
 ↓
Blue v1 ✅
```

* Stop routing traffic to the failed version.
* Shift traffic back to the previous ECS task set.
* Keep the previous Docker image in **ECR**.
* Check CloudWatch/X-Ray/Langfuse to identify the failure.
* Fix the issue and redeploy.

### For Lambda

If using **versions + aliases**:

```text
prod → v12 ❌
        ↓
prod → v11 ✅
```

Simply move the `prod` alias back to the previous version.

### Automatic rollback

Configure deployment alarms for:

* 5xx/error rate
* P95/P99 latency
* ECS task health
* Bedrock errors/throttling
* MCP/tool failures
* Important CWD/LLM quality metrics

If an alarm breaches the threshold, **automatically stop the deployment and restore the previous version**.

### Interview answer

> “I implement rollback using immutable versions and keep the previous known-good version available. For ECS blue-green deployment, I shift ALB traffic back to the previous task set. For Lambda, I move the production alias back to the previous version. I also configure CloudWatch deployment alarms so failed deployments can automatically trigger rollback.”

**Memory:**
**Detect → Stop → Route Back → Verify → Fix → Redeploy**
