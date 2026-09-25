## How would you monitor AWS cost per request?

Main idea: **assign every request a correlation ID and track the cost-producing operations under that request.**

```text
User Request
    ↓
Correlation ID
    ↓
Coordinator
    ↓
Delegator → Worker
    ↓
Bedrock / Lambda / ECS / OpenSearch
    ↓
Cost Calculation
```

### What I track

For each request:

* `correlation_id`
* Bedrock model + input/output tokens
* Lambda invocations/duration
* ECS compute usage
* OpenSearch operations
* S3 usage where relevant
* Total estimated cost

Store/aggregate this by:

```text
Tenant → Workflow → Worker → Request
```

### Practical implementation

Use **CloudWatch + AWS Cost Explorer/Cost and Usage Report + application telemetry**.

For Bedrock, calculate:

> `input tokens × input price + output tokens × output price`

Then associate that with the `correlation_id`.

### Interview answer

> “I would propagate a correlation ID through the entire CWD request and record cost-related metrics for each service. For Bedrock, I would capture input and output tokens and calculate model cost. I would combine application telemetry with AWS cost data and aggregate cost by tenant, workflow, Worker, and request to identify expensive workflows.”

**Memory:**
**Correlation ID → Track Usage → Calculate Cost → Aggregate → Optimize**
