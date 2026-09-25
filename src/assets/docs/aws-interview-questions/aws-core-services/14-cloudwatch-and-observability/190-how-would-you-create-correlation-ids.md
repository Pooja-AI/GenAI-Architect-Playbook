### How to create a correlation ID

Generate it **once at the API entry point** and pass the same ID through the entire CWD request.

```text
User Request
     ↓
API Gateway
     ↓
Generate correlation_id
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
MCP / AWS Services
```

For example:

```text
correlation_id = UUID
```

A typical value:

```text
550e8400-e29b-41d4-a716-446655440000
```

In FastAPI, you can generate it with Python's `uuid`:

```python
import uuid

correlation_id = str(uuid.uuid4())
```

Then propagate it in the request context/header:

```text
X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
```

Every service logs the same ID.

### Interview answer

> “I generate a unique UUID correlation ID at the API entry point, usually in the FastAPI middleware. I propagate it through HTTP headers and the execution context to the Coordinator, Delegators, Workers, MCP calls, and downstream services. Every structured log and trace span contains that ID, so I can trace one request end-to-end.”

**Important:** Don't generate a new correlation ID at every service. Generate **one per request** and propagate it.
