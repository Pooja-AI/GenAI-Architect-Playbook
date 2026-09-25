### Trace one request across AWS services

Use a **correlation ID + distributed tracing**.

```text
User
 ↓
API Gateway
 ↓ correlation_id
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Bedrock / S3 / DynamoDB / OpenSearch
```

At the entry point, generate a `correlation_id` and propagate it through every service.

Example:

```text
correlation_id = CWD-12345
```

Each service logs:

```text
correlation_id
service_name
timestamp
status
latency
error
```

For technical tracing, use **AWS X-Ray / OpenTelemetry** to create trace segments and spans across services.

### Interview answer

> “I would generate a correlation ID at the API entry point and propagate it through the Coordinator, Delegators, Workers, MCP services, and AWS services. I would use structured CloudWatch logs combined with X-Ray or OpenTelemetry distributed tracing. This allows me to follow one request end-to-end and quickly identify where latency or failures occurred.”

**Memory:**
**Correlation ID → Propagate → Log → Trace → Troubleshoot**
