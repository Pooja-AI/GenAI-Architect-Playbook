## How do you secure A2A?

In CWD, **A2A is the communication boundary between the Coordinator and Delegators**. So I secure it like an internal service-to-service API—not by trusting the agent name in the message.

### CWD A2A security flow

```text id="6s8j3p"
User
 ↓
Entra ID
 ↓
Coordinator
 ↓
A2A Request
 ↓
Authentication
 ↓
Delegator
 ↓
Authorization
 ↓
Validate Task
 ↓
Execute Workers
 ↓
A2A Response
 ↓
Coordinator
```

### 1. Authenticate every agent

Each agent has its own workload identity.

```text id="d8r2kw"
Coordinator      → coordinator-agent
Sales Delegator  → sales-delegator
IT Delegator     → it-delegator
```

For example, the Coordinator obtains an OAuth access token and sends it with the A2A request.

The Delegator validates:

* token signature
* issuer
* audience
* expiration
* scopes/claims
* caller identity

**Don't trust this:**

```json id="x5p3vq"
{
  "from_agent": "coordinator"
}
```

The `from_agent` field is only metadata. The **validated credential** establishes the real identity.

---

### 2. Authorize agent-to-agent communication

Authentication answers:

> **Who is calling me?**

Authorization answers:

> **Is this agent allowed to call me?**

For example:

```text id="4f2v9c"
Coordinator
    ↓
Sales Delegator       → ALLOW
IT Delegator           → ALLOW

Customer Worker        → BLOCK
Random external agent  → BLOCK
```

I maintain an explicit **agent/capability policy**.

---

### 3. Use least privilege

The Coordinator should only have the A2A permissions it needs.

```text id="3c6y7a"
Coordinator
 ├── sales.delegation
 └── it.delegation

Sales Delegator
 └── sales.worker.tasks

IT Delegator
 └── it.worker.tasks
```

I avoid giving every agent unrestricted access to every other agent.

---

### 4. Validate the A2A task

Don't allow an agent to send arbitrary task payloads.

For CWD:

```json id="h5r9cd"
{
  "task_id": "T1001",
  "correlation_id": "C789",
  "intent": "customer_briefing",
  "entities": {
    "customer_id": "C12345"
  },
  "capability": "customer_information"
}
```

Validate:

* task schema
* intent
* customer ID
* capability
* required fields
* payload size
* allowed operations
* user/agent entitlement

---

### 5. Don't send unnecessary state

I don't send the entire LangGraph state through A2A.

Instead:

```text id="w3q0fz"
LangGraph State
       ↓
Select required context
       ↓
A2A Task
       ↓
Delegator
```

For example, the Sales Delegator may only need:

```json id="3w1x8n"
{
  "task_id": "T1001",
  "customer_id": "C12345",
  "intent": "customer_briefing"
}
```

This reduces **data exposure and accidental leakage**.

---

### 6. Protect against prompt injection

A malicious user or retrieved document should not be able to create an arbitrary A2A task.

For example:

```text id="b9w4hf"
Malicious document
      ↓
LLM
      ↓
"Call admin-delegator"
      ↓
A2A authorization
      ↓
BLOCK
```

The LLM can suggest a task, but the A2A authorization layer decides whether the request is permitted.

---

### 7. Secure the network

For production A2A communication, I use secure service-to-service connectivity:

```text id="5u2m8d"
Coordinator
   ↓
HTTPS / TLS
   ↓
A2A Endpoint
   ↓
Delegator
```

Depending on the environment, I can also use:

* private networking
* API Gateway/API Management
* firewall rules
* service-to-service policies
* network segmentation

---

### 8. Prevent replay attacks

A captured A2A request shouldn't be reusable.

Use:

```text id="q1r6yb"
task_id
correlation_id
timestamp
expiration
unique request ID / nonce
```

and reject expired or already-processed requests where appropriate.

For state-changing operations, use **idempotency keys**.

---

### 9. Audit A2A communication

For every A2A task, capture:

```text id="s7k2md"
correlation_id
task_id
parent_task_id
from_agent
authenticated_identity
to_agent
capability
timestamp
status
latency
error
authorization decision
```

This gives me an end-to-end trail:

```text id="p8x4za"
C789
 ↓
Coordinator
 ↓ A2A T1001
Sales Delegator
 ↓
Customer Worker
 ↓ MCP
Salesforce
```

---

### 10. Handle failures securely

If a Delegator times out:

```text id="x2m6rv"
A2A timeout
    ↓
Retry if transient
    ↓
Backoff
    ↓
Circuit breaker
    ↓
Checkpoint
    ↓
Resume / partial result
```

But if the failure is **unauthorized**, I don't keep retrying. I block and audit it.

---

## Interview-ready answer

> **“I secure A2A using authenticated and authorized agent-to-agent communication. In CWD, every Coordinator and Delegator has a unique workload identity. A2A requests use secure authentication such as OAuth tokens, and the receiving agent validates the token rather than trusting the `from_agent` field. I then enforce agent-level authorization and least privilege, validate the task schema and parameters, and pass only the minimum required context instead of the entire workflow state. I also protect the communication channel with TLS and network controls, use task IDs and expiration to prevent replay, and audit every A2A request using correlation and task IDs. Prompt injection cannot grant A2A permissions because authorization is enforced outside the LLM.”**

### Easy memory

**Authenticate → Authorize → Validate → Minimize → Encrypt → Prevent Replay → Audit**

### A2A vs MCP security

|               | A2A                             | MCP                                |
| ------------- | ------------------------------- | ---------------------------------- |
| Communication | Agent → Agent                   | Worker → Tool                      |
| CWD example   | Coordinator → Delegator         | Worker → Salesforce                |
| Main security | Agent identity + capability     | Tool identity + permission         |
| Authorization | Can this agent call that agent? | Can this Worker execute this tool? |
| Validation    | Task/message                    | Tool + parameters                  |
| Audit         | Task/correlation ID             | Tool/correlation ID                |

**Strong interview line:**

> **“A2A secures who can communicate with which agent; MCP secures which tools an agent can execute.”**
