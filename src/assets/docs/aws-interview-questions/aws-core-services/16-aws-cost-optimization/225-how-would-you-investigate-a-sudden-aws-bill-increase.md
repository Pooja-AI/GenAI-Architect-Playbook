## How would you investigate a sudden AWS bill increase?

Main idea: **find which service and workload caused the increase, then correlate it with traffic and deployments.**

```text
AWS Bill Spike
     ↓
Cost Explorer
     ↓
Which Service?
     ↓
Which Resource / Region?
     ↓
Compare Usage vs Baseline
     ↓
Check CWD Metrics + Recent Changes
     ↓
Root Cause
     ↓
Fix / Alert
```

### Practical steps

1. **Check Cost Explorer** → identify the service with the biggest increase.
2. **Check region/account/resource** → find where the cost occurred.
3. **Compare usage** → requests, tokens, ECS tasks, S3 storage, OpenSearch capacity, etc.
4. **Check CloudWatch** → traffic, CPU, task count, Lambda invocations, Bedrock usage.
5. **Check recent deployments/config changes** → new model, prompt, autoscaling, retry loop, etc.
6. **Check CWD workflow cost** → identify expensive Worker or workflow using correlation IDs.
7. **Check AWS Cost Anomaly Detection/Budgets** → determine when the spike started.
8. **Fix the root cause** → reduce calls, scale correctly, fix retry loops, change model routing, or remove unused resources.

### Example

If **Bedrock cost suddenly increases**:

```text
Bedrock Cost ↑
    ↓
Token Usage ↑ ?
    ↓
LLM Calls ↑ ?
    ↓
Retry Loop / Traffic Spike / New Workflow
    ↓
Fix
```

### Interview answer

> “I would start with Cost Explorer to identify which AWS service and region caused the increase. Then I would compare usage against the normal baseline and correlate it with CloudWatch metrics and recent deployments. In CWD, I would trace the cost back to the workflow or Worker using correlation IDs. For example, if Bedrock cost increased, I would check token usage, invocation volume, model selection, and retry behavior before applying the fix.”

**Memory:**
**Cost → Service → Usage → Change → Workflow → Root Cause → Fix**
