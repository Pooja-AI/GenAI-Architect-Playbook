## Responsibility of a Worker

The main responsibility of a **Worker is to execute one specific business capability** and return the result to the Delegator.

### Step-by-step

1. **Receive input** from the Delegator
   Example: `customer_id = C123`

2. **Validate the input**
   Check that required information is available.

3. **Execute the task**
   Use **MCP/API** to call the required enterprise system.

4. **Process the response**
   Convert the raw response into a structured business result.

5. **Return the result** to the Delegator.

6. **Report failures**
   If Salesforce or ServiceNow fails, the Worker returns a structured error; the **Delegator handles retry/recovery**.

### CWD example

```text
Sales Delegator
      ↓
CustomerProfileWorker
      ↓
MCP
      ↓
Salesforce
      ↓
Customer Profile
      ↓
Sales Delegator
```

### Important

A Worker **does not**:

* Decide which Worker should run
* Manage the overall workflow
* Coordinate other Workers
* Decide enterprise-level routing

Those responsibilities belong to the **Delegator and Coordinator**.

**Interview-ready:**

> “A Worker is responsible for executing one specific business capability, using MCP or APIs to interact with enterprise systems, processing the response, and returning a structured result or failure to the Delegator.”

**One-line memory:**
**Worker = Execute one capability → use tools/APIs → return result.**
