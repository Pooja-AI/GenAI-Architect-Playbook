## How do you handle schema changes?

In CWD, I handle schema changes using **versioned, backward-compatible contracts** between the **Coordinator → Delegator → Worker → MCP** layers.

The main principle is:

> **Don't change a shared production schema in a breaking way without versioning and migration.**

### 1. Example

Suppose the original Worker request is:

```json
{
  "customer_id": "C12345"
}
```

Later, we need additional information:

```json
{
  "customer_id": "C12345",
  "region": "US"
}
```

Adding an **optional** field is generally backward compatible.

But changing:

```text
customer_id
```

to:

```text
customerId
```

can break existing Workers.

So instead of immediately replacing the contract, I introduce a new version:

```text
CustomerBriefingRequest v1
CustomerBriefingRequest v2
```

---

### 2. Version the schema

For example:

```json
{
  "schema_version": "v2",
  "customer_id": "C12345",
  "region": "US"
}
```

The receiving component validates the schema before processing it.

```text
Coordinator
    ↓
schema v2
    ↓
Delegator
    ↓
Worker
    ↓
MCP
```

---

### 3. Backward compatibility

I prefer **additive changes** whenever possible.

For example:

```text
v1
{
  customer_id
}

v2
{
  customer_id
  region?        ← optional
}
```

Old Workers can continue processing `customer_id`.

For breaking changes, I support both versions temporarily:

```text
             Request
                ↓
        Schema Version
          /          \
        v1            v2
        ↓             ↓
   Old Worker     New Worker
```

Then migrate consumers gradually.

---

### 4. Validate at every boundary

In CWD, I don't assume the LLM will produce the correct schema.

For example:

```text
LLM
 ↓
Structured output
 ↓
Pydantic / JSON Schema validation
 ↓
Valid?
 ├── YES → Worker
 └── NO  → Retry / repair / fail safely
```

For A2A and MCP boundaries, I also validate request and response schemas.

Example:

```python
class CustomerRequest(BaseModel):
    schema_version: str
    customer_id: str
```

If the request doesn't conform, I reject it rather than allowing malformed data to propagate.

---

### 5. MCP schema changes

Suppose the MCP tool originally expects:

```json
{
  "customer_id": "C12345"
}
```

and a new version requires:

```json
{
  "customer_id": "C12345",
  "include_incidents": true
}
```

I version the tool contract or maintain backward compatibility.

```text
Worker
  ↓
MCP tool v1 / v2
  ↓
MCP Server
  ↓
ServiceNow
```

The Worker should know which tool/schema version it is compatible with.

---

### 6. Database schema changes

For persistent CWD state, I use an **expand-and-contract** approach.

Example:

```text
Step 1:
Add new field

Step 2:
Application supports old + new

Step 3:
Backfill/migrate data

Step 4:
Switch all consumers to new field

Step 5:
Remove old field
```

This prevents a database deployment from breaking currently running workflows.

---

### 7. Don't break running workflows

This is especially important for CWD because workflows can be long-running.

Suppose:

```text
WF-1001 → schema v1
WF-1002 → schema v2
```

I shouldn't force `WF-1001` to suddenly use v2 halfway through execution.

The workflow should retain its relevant contract/version information:

```json
{
  "workflow_id": "WF-1001",
  "schema_version": "v1",
  "agent_version": "v3",
  "prompt_version": "v5"
}
```

Then the workflow can safely resume after a restart or failure.

---

## 🎯 Interview-ready answer

> **“In CWD, I treat schemas as versioned contracts between the Coordinator, Delegators, Workers, A2A, and MCP layers. I prefer backward-compatible additive changes, such as adding optional fields. For breaking changes, I introduce a new schema version and temporarily support both versions while consumers are migrated. I validate requests and responses using JSON Schema or Pydantic before allowing them to continue through the workflow. For database changes, I use an expand-and-contract migration strategy. I also pin the relevant schema and Agent versions to long-running workflows so an existing workflow isn't unexpectedly broken by a new contract. After migration, I monitor validation failures and deprecate the old version gradually.”**

### Easy memory

**Detect → Version → Validate → Backward compatible → Migrate → Monitor → Deprecate**

> **Strong interview line:** **“A schema is a contract, so I never make a breaking change without a compatibility or versioning strategy.”**
