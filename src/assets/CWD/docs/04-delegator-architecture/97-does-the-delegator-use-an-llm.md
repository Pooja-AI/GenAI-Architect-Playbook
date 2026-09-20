## Does the Delegator use an LLM?

**Yes, it can use an LLM, but the Delegator should not depend entirely on the LLM.**

In CWD, the LLM is mainly used for **semantic decisions**, while deterministic code and policies control the actual execution.

### Step-by-step

```text id="m0y9k2"
Coordinator
     ↓
Sales Delegator
     ↓
LLM understands domain request
     ↓
Identify required capabilities
     ↓
Worker Registry
     ↓
Deterministic validation
     ↓
Select Workers
     ↓
LangGraph executes
```

### 1. What does the LLM do?

Suppose the Delegator receives:

> "Get the customer's profile and tell me about any recent issues."

The LLM can understand that this requires:

```text id="bq7xk2"
customer_profile
support_history
```

It converts natural language into structured requirements.

For example:

```python id="j7k4p2"
{
    "required_capabilities": [
        "customer_profile",
        "support_history"
    ]
}
```

### 2. What does the LLM NOT do?

The LLM should **not** decide blindly:

```text
"Call CustomerProfileWorker"
"Call SomeWorkerXYZ"
"Retry 10 times"
"Ignore authorization"
```

Those decisions should be controlled by:

* Worker Registry
* Authorization policies
* Workflow policies
* Worker configuration
* LangGraph workflow

### 3. Example

```text id="lq5p8c"
User Request
     ↓
Sales Delegator
     ↓
LLM
     ↓
Required capabilities:
  customer_profile
  contract
     ↓
Worker Registry
     ↓
CustomerProfileWorker
ContractWorker
     ↓
Policy validation
     ↓
LangGraph
     ↓
Execute
```

### 4. Why use an LLM at the Delegator level?

Because domain requests can be expressed in many ways.

For example:

> "Show me everything we know about this customer."

The LLM can understand that this may require:

```text
Customer Profile
+
Contract
+
Sales History
```

A simple hard-coded rule may struggle with these variations.

### 5. But deterministic rules remain important

A good architecture is:

```text
LLM
 ↓
"These capabilities appear necessary"
 ↓
Registry
 ↓
"Do these Workers actually exist?"
 ↓
Policy
 ↓
"Is this Worker allowed?"
 ↓
LangGraph
 ↓
"Execute according to workflow"
```

So the **LLM proposes; deterministic systems validate and control**.

### In your CWD architecture

The responsibilities are:

| Component           | Responsibility                                                           |
| ------------------- | ------------------------------------------------------------------------ |
| **Coordinator LLM** | Understand overall business intent                                       |
| **Delegator LLM**   | Understand domain-level requirements / identify capabilities when needed |
| **Worker Registry** | Source of truth for available Workers                                    |
| **Delegator**       | Select and orchestrate Workers                                           |
| **LangGraph**       | Execute workflow/state transitions                                       |
| **Worker**          | Perform specific capability                                              |
| **MCP**             | Connect Worker to enterprise tools                                       |

### Short interview answer

> **"Yes, a Delegator can use an LLM for domain-level semantic understanding, such as identifying the capabilities required from a request. However, we don't let the LLM directly control execution. The Worker Registry, authorization policies, and workflow policies validate the proposed Workers, and LangGraph handles the actual execution."**

**One line to remember:**

> **"LLM understands and proposes; Registry and policies validate; Delegator orchestrates; LangGraph executes."**
