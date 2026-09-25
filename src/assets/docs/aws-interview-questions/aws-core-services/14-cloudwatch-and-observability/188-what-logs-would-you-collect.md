### Logs I would collect for CWD

I would use **structured JSON logs** so every request can be traced end-to-end.

| Area                   | What to log                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| **API**                | Request ID, endpoint, status code, latency                        |
| **Coordinator**        | Intent, plan, selected Delegator, workflow status                 |
| **Delegator**          | Selected Workers, fan-out/fan-in, success/failure                 |
| **Worker**             | Worker ID, operation, status, latency, errors                     |
| **MCP**                | Tool called, tool status, latency, authorization result           |
| **RAG**                | Query, retrieval count, search latency, document/chunk IDs        |
| **Bedrock/LLM**        | Model, latency, token usage, errors/throttling                    |
| **AWS infrastructure** | ECS task failures, Lambda errors, SQS/DLQ events                  |
| **Security**           | Authentication, authorization, denied access, suspicious activity |

Every log should contain common fields:

```text
correlation_id
request_id
session_id
run_id
worker_id
service
timestamp
status
latency
error_code
```

**Important:** Never log passwords, API keys, access tokens, or sensitive customer data.

### Interview answer

> “I would collect structured JSON logs from API Gateway, Coordinator, Delegators, Workers, MCP services, RAG, and AWS components. Every log would contain a correlation ID, run ID, service, status, latency, and error information so I can trace one request across the entire CWD workflow. I would also apply log redaction to prevent secrets or sensitive data from being exposed.”
