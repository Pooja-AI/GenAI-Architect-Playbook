## How does a Delegator pass context to Workers?

The Delegator passes context through the **Worker input/request payload**, usually as a **structured object**, not as an uncontrolled conversation history.

In CWD, the flow is:

```text
Coordinator
     ↓
Delegator
     ↓
Build Worker Context
     ↓
Worker
     ↓
MCP Tool / Enterprise System
```

### 1. What context does the Delegator have?

For example, the Coordinator sends the Sales Delegator:

```python
{
    "request_id": "REQ-123",
    "intent": "CustomerBriefing",
    "customer_id": "C123",
    "user_id": "U456",
    "required_capabilities": [
        "customer_profile",
        "contract_information"
    ]
}
```

The Delegator uses this information to build the input for each Worker.

---

### 2. Delegator creates Worker-specific context

For `CustomerProfileWorker`:

```python
{
    "request_id": "REQ-123",
    "customer_id": "C123",
    "operation": "get_customer_profile"
}
```

For `ContractWorker`:

```python
{
    "request_id": "REQ-123",
    "customer_id": "C123",
    "operation": "get_contract"
}
```

So the Delegator **doesn't send everything to every Worker**.

It sends only the context required by that Worker.

---

### 3. Context can come from previous Workers

Suppose:

```text
CustomerProfileWorker
        ↓
customer profile
        ↓
RiskAnalysisWorker
```

The Delegator can take the first Worker result and construct the next Worker's input:

```python
{
    "request_id": "REQ-123",
    "customer_id": "C123",
    "customer_profile": {
        "industry": "Semiconductor",
        "region": "US"
    }
}
```

So the Delegator manages the dependency:

```text
Worker A result
      ↓
Delegator
      ↓
Build context for Worker B
      ↓
Worker B
```

Workers don't need to directly call or know about each other.

---

### 4. What about LangGraph state?

This is where **LangGraph state** becomes important.

The Delegator can maintain state such as:

```python
state = {
    "request_id": "REQ-123",
    "customer_id": "C123",
    "worker_results": {
        "CustomerProfileWorker": {...},
        "ContractWorker": {...}
    },
    "current_step": "RiskAnalysisWorker"
}
```

The Worker receives only the relevant portion:

```text
LangGraph State
       ↓
Delegator
       ↓
Worker-specific input
```

So:

> **LangGraph stores/manages workflow state; the Delegator prepares the context passed to each Worker.**

---

### 5. Don't pass the entire conversation

This is important in production.

Avoid:

```text
Worker
  ↓
Entire chat history
  ↓
Huge token usage
```

Instead:

```text
Worker
  ↓
Only required context
  ↓
customer_id
request_id
required data
relevant previous result
authorization context
```

This improves:

* Security
* Token efficiency
* Latency
* Reliability
* Maintainability

---

### 6. What about security context?

The Delegator can also propagate security-related context such as:

```text
user identity
tenant
roles/claims
correlation ID
data-access scope
```

But **the Worker should not blindly trust values supplied in the payload**.

Authorization should still be verified through the identity/token and policy layer.

For example:

```text
User Identity
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
Authorization
```

---

### 7. Example with Salesforce

Suppose the Worker needs to retrieve Salesforce data.

The Delegator sends:

```python
worker_context = {
    "request_id": "REQ-123",
    "customer_id": "C123",
    "operation": "get_customer_profile"
}
```

The Worker then uses its MCP tool:

```text
Delegator
    ↓
CustomerProfileWorker
    ↓
MCP Client
    ↓
get_customer_profile(customer_id="C123")
    ↓
Salesforce
```

The Worker doesn't need to know that the request originally came from the user's sentence.

It just receives the structured context it needs.

---

## Complete flow

```text
User
 ↓
"Prepare customer briefing for C123"
 ↓
Coordinator
 ↓
Intent + customer_id
 ↓
Sales Delegator
 ↓
Build Worker Context
 ├───────────────┐
 ↓               ↓
ProfileWorker   ContractWorker
 ↓               ↓
customer_id     customer_id
 ↓               ↓
Salesforce      Contract System
 └───────────────┘
        ↓
Worker Results
        ↓
Delegator
        ↓
Coordinator
```


> **"In CWD, the Delegator passes context to Workers through structured, Worker-specific input. The context can include request ID, customer ID, required operation, authorization scope, and relevant results from previous Workers. LangGraph maintains the overall workflow state, while the Delegator extracts and prepares only the context each Worker needs. Workers remain independent and don't need to know about other Workers."**

**One line to remember:**

> **"Delegator owns the workflow context, LangGraph persists the state, and each Worker receives only the structured context it needs."**
