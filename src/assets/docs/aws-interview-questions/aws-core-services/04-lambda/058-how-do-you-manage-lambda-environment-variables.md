# How do you monitor Lambda?

## Short answer

I would use **CloudWatch Metrics + CloudWatch Logs + X-Ray/OpenTelemetry + alarms** to monitor Lambda.

For CWD, I would monitor not only Lambda itself, but also its **downstream dependencies and business impact**.

## Key points

### 1. CloudWatch Metrics

Monitor the main Lambda metrics:

| Metric                                | What it tells me                      |
| ------------------------------------- | ------------------------------------- |
| **Invocations**                       | How many times Lambda runs            |
| **Errors**                            | How many executions failed            |
| **Duration**                          | How long execution takes              |
| **Throttles**                         | Lambda couldn't accept execution      |
| **ConcurrentExecutions**              | Current concurrency                   |
| **ProvisionedConcurrencyUtilization** | Usage of provisioned capacity         |
| **IteratorAge**                       | Useful for stream-based event sources |

For CWD, I would especially watch:

**Errors + Duration + Throttles + Concurrency**

---

## 2. Monitor P50/P95/P99 latency

Don't look only at average latency.

For example:

```text id="v9g4k2"
Lambda Duration

P50  = 150 ms
P95  = 500 ms
P99  = 2 sec
```

If P99 suddenly increases, a small percentage of requests are experiencing significant delays.

---

## 3. CloudWatch Logs

Lambda automatically integrates with CloudWatch Logs.

I would log structured information such as:

```text id="8y2k4m"
correlation_id
request_id
run_id
worker_id
status
duration
downstream_service
error_type
retry_count
```

Example:

```json id="j1p5x7"
{
  "run_id": "RUN123",
  "worker": "CustomerWorker",
  "status": "FAILED",
  "downstream": "Salesforce",
  "retry_count": 2
}
```

But I would **not log secrets, tokens, passwords, or unnecessary sensitive customer data**.

---

## 4. Distributed tracing

For CWD, I want to trace:

```text id="2a8k7p"
API Gateway
    ↓
ECS/Fargate
    ↓
Coordinator
    ↓
Delegator
    ↓
Lambda Worker
    ↓
MCP
    ↓
Salesforce
```

I can use **AWS X-Ray** and/or **OpenTelemetry** to understand where latency or failures occur.

Example:

```text id="g6h2v9"
API Gateway       100 ms
Coordinator       150 ms
Delegator          50 ms
Lambda             80 ms
MCP                90 ms
Salesforce       2,500 ms  ← bottleneck
```

Now I know the Lambda itself isn't necessarily the problem.

---

## 5. Set CloudWatch alarms

I would create alarms for things such as:

```text id="w7f3q1"
Errors ↑
Throttles ↑
P95/P99 latency ↑
Concurrency ↑
SQS queue depth ↑
DLQ messages ↑
```

Example:

```text id="c5n8m2"
Lambda Throttles > threshold
        ↓
CloudWatch Alarm
        ↓
SNS / notification
        ↓
Engineering team
```

---

## 6. Monitor Lambda concurrency

Because CWD can fan out:

```text id="p3x6v8"
1 User
 ↓
Coordinator
 ↓
Delegator
 ↓
10 Workers
 ↓
10 Lambda executions
```

I monitor:

* Concurrent executions
* Reserved concurrency
* Throttles
* Account concurrency
* Provisioned concurrency utilization

This helps detect concurrency exhaustion before it becomes a larger outage.

---

## 7. Monitor retries and DLQ

For asynchronous Lambda processing:

```text id="f9r2k5"
SQS
 ↓
Lambda
 ↓
Failure
 ↓
Retry
 ↓
Retry
 ↓
DLQ
```

I monitor:

* Retry count
* SQS queue depth
* Message age
* DLQ message count

A sudden increase in DLQ messages is an important reliability signal.

---

## 8. Monitor downstream dependencies

Lambda might be healthy while Salesforce is failing.

So I also monitor:

```text id="x8k3m6"
Lambda
  ↓
MCP
  ↓
Salesforce
```

Metrics:

* Downstream latency
* 4xx/5xx
* 429/throttling
* Timeout rate
* Connection failures

This is particularly important for CWD Workers.

---

# CWD monitoring flow

```text id="q2m7v4"
                    CWD
                     │
                Coordinator
                     │
                  Worker
                     │
                  Lambda
                     │
             ┌───────┴───────┐
             ↓               ↓
        CloudWatch         X-Ray/Otel
        Metrics/Logs       Distributed Trace
             │               │
             └───────┬───────┘
                     ↓
                  Alarms
                     ↓
               Engineering Team
```

## 🎯 Strong interview answer

> **“I monitor Lambda using CloudWatch metrics and logs, distributed tracing with X-Ray or OpenTelemetry, and CloudWatch alarms. I track invocations, errors, duration, P50/P95/P99 latency, throttles, concurrency and provisioned-concurrency utilization. For asynchronous CWD Workers, I also monitor SQS queue depth, retries and DLQ messages. I propagate correlation IDs such as session, run and Worker IDs so I can trace a request from API Gateway through the Coordinator, Delegator, Lambda, MCP and downstream systems. I also monitor downstream latency and errors because a Lambda can be healthy while the dependency it calls is failing.”**

## Easy memory trick

**M → L → T → A → D**

* **M** = Metrics
* **L** = Logs
* **T** = Tracing
* **A** = Alarms
* **D** = Dependencies

> **CloudWatch tells me that Lambda has a problem; tracing helps me find where the problem is.**
# How do you manage Lambda environment variables?

## Short answer

I use **environment variables for non-sensitive configuration** and **AWS Secrets Manager / Systems Manager Parameter Store for sensitive values**.

I also manage them separately by environment:

```text
Development → Dev configuration
QA          → QA configuration
Production  → Prod configuration
```

## Key points

### 1. Non-sensitive configuration → Environment variables

Examples:

```text
ENVIRONMENT=prod
AWS_REGION=us-east-1
LOG_LEVEL=INFO
OPENSEARCH_INDEX=customer-docs
MODEL_ID=approved-model
TIMEOUT_SECONDS=30
```

Lambda reads them at runtime:

```python
import os

environment = os.environ["ENVIRONMENT"]
model_id = os.environ["MODEL_ID"]
```

This avoids hardcoding configuration in the code.

---

### 2. Secrets → Secrets Manager

I would **not** put passwords, API keys, tokens, or database credentials directly into Lambda environment variables.

Instead:

```text
Lambda
   ↓
Secrets Manager
   ↓
Secret
```

Example:

```text
Lambda
  ↓
Get secret
  ↓
Salesforce API credential
```

Use IAM permissions so the Lambda role can access only the required secret.

---

### 3. Parameter Store for configuration

For centralized configuration, I can use **SSM Parameter Store**.

```text
Lambda
   ↓
Parameter Store
   ↓
/cwd/prod/model-id
/cwd/prod/timeout
/cwd/prod/opensearch-index
```

This is useful when configuration needs to be centrally managed.

---

## 4. Separate configuration by environment

I don't hardcode:

```text
PROD_INDEX
PROD_MODEL
```

inside the application.

Instead:

```text
Dev
 ↓
/cwd/dev/...

QA
 ↓
/cwd/qa/...

Prod
 ↓
/cwd/prod/...
```

The deployment pipeline injects the appropriate configuration.

---

## 5. Don't put configuration in source code

Bad:

```python
MODEL_ID = "some-production-model"
TIMEOUT = 30
```

Better:

```python
MODEL_ID = os.environ["MODEL_ID"]
TIMEOUT = int(os.environ["TIMEOUT"])
```

This allows the same Lambda artifact to be promoted across environments with different configuration.

---

## 6. Use IAM for access control

For example:

```text
Lambda Execution Role
       ↓
   IAM Policy
       ↓
Secrets Manager
       ↓
Only required secret
```

I follow **least privilege**.

A Customer Worker shouldn't automatically have permission to access every CWD secret.

---

# CWD example

Suppose a Lambda Worker calls an MCP server:

```text
CWD Worker
    ↓
Lambda
    ↓
MCP Server
    ↓
Salesforce
```

Configuration might be:

```text
MCP_ENDPOINT
MCP_TIMEOUT
ENVIRONMENT
LOG_LEVEL
```

Sensitive credentials would be:

```text
Secrets Manager
    ↓
MCP authentication secret
```

The Lambda gets permission to read only that secret.

---

# Deployment flow

```text
Git
 ↓
CI/CD
 ↓
Build Lambda
 ↓
Deploy Dev
 ↓
Dev configuration
 ↓
Test
 ↓
Deploy QA
 ↓
QA configuration
 ↓
Test
 ↓
Deploy Production
 ↓
Prod configuration
```

The **code artifact stays the same**, while environment-specific configuration changes.

## 🎯 Strong interview answer

> **“I separate application code from configuration. For non-sensitive values such as environment, model configuration, timeouts and index names, I use Lambda environment variables or centralized Parameter Store configuration. I never hardcode secrets in the code or source repository; credentials and API keys are stored in Secrets Manager and accessed through the Lambda execution role using least-privilege IAM. I maintain separate configuration for dev, QA and production through the CI/CD pipeline, so the same code artifact can move across environments safely.”**

## Easy memory trick

**Config → Environment variables / Parameter Store**

**Secrets → Secrets Manager**

**Access → IAM**

**Deployment → CI/CD**

### Key distinction

> **Environment variables are for configuration, not a replacement for a secrets-management system.**
