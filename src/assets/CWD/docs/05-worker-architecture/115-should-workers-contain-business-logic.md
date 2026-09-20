## Should Workers contain business logic?

**Yes, but only business logic related to their specific capability.** They should **not contain workflow-orchestration logic**.

### Example: `CustomerProfileWorker`

The Worker can contain logic such as:

* Validate `customer_id`
* Call Salesforce through MCP
* Map Salesforce fields into a standard customer profile
* Apply capability-specific validation
* Return structured customer data

```text id="j7w3fz"
CustomerProfileWorker
   ↓
Validate customer_id
   ↓
MCP → Salesforce
   ↓
Transform/validate customer data
   ↓
Return CustomerProfile
```

### What should NOT be inside the Worker?

The Worker should not decide:

* Which Worker runs next
* Whether ContractWorker should run
* Overall workflow sequence
* Retry strategy for other Workers
* Cross-domain orchestration
* Which Delegator should be selected

Those belong to the **Delegator/Coordinator**.

### Simple rule

> **Worker = capability-specific business logic.**
> **Delegator = workflow/orchestration logic.**
> **Coordinator = enterprise-level orchestration.**

**Interview-ready:**

> “Yes, Workers can contain business logic specific to their capability, such as validation and data transformation. However, workflow and orchestration logic should remain in the Delegator, so Workers stay focused, reusable, and loosely coupled.”
