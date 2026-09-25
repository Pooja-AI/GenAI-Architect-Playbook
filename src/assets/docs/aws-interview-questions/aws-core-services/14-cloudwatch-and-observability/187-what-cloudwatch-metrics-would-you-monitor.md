### CloudWatch Metrics for CWD

I would monitor metrics at **API, ECS, queues, AWS services, and AI layer**.

| Area                  | Key metrics                                                   |
| --------------------- | ------------------------------------------------------------- |
| **API Gateway / ALB** | Request count, 4xx/5xx, P50/P95/P99 latency                   |
| **ECS/Fargate**       | CPU, memory, running tasks, task restarts                     |
| **SQS**               | Queue depth, message age, DLQ messages                        |
| **Lambda**            | Errors, duration, throttles, invocations                      |
| **DynamoDB**          | Throttled requests, latency, consumed capacity                |
| **OpenSearch**        | Search latency, indexing errors, throttling                   |
| **Bedrock**           | Invocation errors, throttling/429s, latency, token usage/cost |
| **CWD application**   | Worker failures, workflow duration, tool-call failures        |

**Interview answer:**

> “I would monitor CWD using CloudWatch across infrastructure and application layers. The key metrics are request rate, 4xx/5xx errors, P95/P99 latency, ECS CPU and memory, SQS backlog and DLQ messages, DynamoDB throttling, OpenSearch search latency, and Bedrock errors, throttling and latency. I would create alarms and dashboards around these metrics and correlate them using `correlation_id` for end-to-end troubleshooting.”

**Memory:**
**Traffic → Errors → Latency → Resources → Queue → AI → Business workflow**
