## What exactly is a Worker?

A **Worker is a specialized agent/component that performs one specific business task** in the CWD architecture.

### Simple definition

> **Worker = Executes one specific capability using enterprise tools or APIs.**

The Worker **does not decide the overall workflow**. The **Delegator decides which Workers to run**.

### CWD flow

```text
Coordinator
     ↓
Sales Delegator
     ↓
CustomerProfile Worker
     ↓
MCP → Salesforce
     ↓
Customer Data
```

### Example

For a **Customer Briefing** request:

```text
Sales Delegator
   ├── CustomerProfileWorker → gets customer details from Salesforce
   ├── ContractWorker        → gets contract information
   └── SalesHistoryWorker   → gets sales history
```

Each Worker has **one clear responsibility**.

### What does a Worker do?

1. Receives structured input from the Delegator.
2. Validates the required input.
3. Calls the required enterprise tool/API, often through **MCP**.
4. Processes the returned data.
5. Returns a structured result to the Delegator.
6. Reports success or failure.

### Important distinction

| Component       | Responsibility                           |
| --------------- | ---------------------------------------- |
| **Coordinator** | Overall enterprise workflow              |
| **Delegator**   | Decides which Workers to execute         |
| **Worker**      | Performs the actual business capability  |
| **MCP**         | Connects Worker to enterprise tools/APIs |

**Interview-ready answer:**

> “A Worker is the execution-level component in CWD. It performs one specific business capability, such as retrieving customer data from Salesforce or incidents from ServiceNow. The Delegator decides which Workers to execute, while the Worker uses MCP or APIs to perform the actual operation and returns a structured result.”
