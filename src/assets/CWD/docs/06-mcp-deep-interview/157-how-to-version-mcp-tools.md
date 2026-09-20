In your **CWD architecture**, I would version MCP tools so that Workers don't suddenly break when the MCP Server changes its tool contract.

The key principle is:

> **Treat an MCP tool schema like an API contract. Breaking changes require a new version.**

### 1. Example

Suppose we initially have:

```text
get_customer(customer_id)
```

Version 1:

```text
get_customer_v1
```

Later, we need additional parameters:

```text
get_customer(customer_id, include_contacts, include_opportunities)
```

Instead of silently changing the existing contract, expose:

```text
get_customer_v2
```

```text
Worker
  ↓
MCP Client
  ↓
get_customer_v2
  ↓
MCP Server
  ↓
Salesforce
```

---

### 2. What should be versioned?

I would version more than just the function name:

| Component            | Version                  |
| -------------------- | ------------------------ |
| Tool name/contract   | `v1`, `v2`               |
| Input schema         | Versioned                |
| Output schema        | Versioned                |
| Business behavior    | Versioned when necessary |
| Authorization policy | Versioned                |
| MCP Server release   | Versioned                |

For example:

```text
get_customer
    ↓
Input Schema v2
Output Schema v2
Policy v3
```

---

### 3. Backward compatibility

If the change is backward compatible, I don't necessarily need a new tool version.

For example, adding an **optional** field:

```json
{
  "customer_id": "C123",
  "include_contacts": true
}
```

can potentially remain compatible with the existing contract if old callers continue to work.

But if I change:

```text
customer_id → customer
```

or change the meaning/type of an existing field, that's a breaking change.

Then:

```text
get_customer_v1
get_customer_v2
```

is safer.

---

### 4. Tool discovery helps

When the Worker connects to the MCP Server, it discovers the available tools and their schemas.

For example:

```json
{
  "name": "get_customer_v2",
  "description": "Retrieve customer profile",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string"
      },
      "include_contacts": {
        "type": "boolean"
      }
    },
    "required": ["customer_id"]
  }
}
```

The Worker can therefore understand the current contract instead of assuming the schema.

---

### 5. Don't break all Workers at once

Suppose CWD has:

```text
Customer Worker
Opportunity Worker
Incident Worker
```

If all three depend on `get_customer_v1`, I wouldn't immediately remove v1.

Instead:

```text
                  MCP Server
                 /          \
                /            \
get_customer_v1            get_customer_v2
      ↑                          ↑
Old Workers                 New Workers
```

Then migrate Workers gradually.

---

### 6. Deprecation strategy

A typical lifecycle:

```text
v1
 ↓
v1 + v2 available
 ↓
Workers migrate to v2
 ↓
Monitor v1 usage
 ↓
Deprecation notice
 ↓
Disable v1
```

For example:

```text
v1 → Deprecated
v2 → Current
```

Before removing v1, check whether any Worker still calls it.

---

### 7. Test compatibility

Before releasing `v2`, I would test:

```text
Schema validation
Authorization
Expected output
Error handling
Performance
Security
Backward compatibility
```

For CWD, I'd include the MCP tool in the **golden test/evaluation suite** so a tool contract change doesn't silently break the agent workflow.

---

## Strong interview answer

> **“I treat MCP tools as versioned contracts between Workers and MCP Servers. For backward-compatible changes, such as adding optional fields, we can maintain the existing contract. For breaking changes to inputs, outputs, or behavior, we introduce a new tool version such as `get_customer_v2` rather than silently changing v1. We keep v1 and v2 available during migration, monitor v1 usage, migrate Workers gradually, and then deprecate v1. We also version and test the input/output schemas and authorization policies so a tool upgrade doesn't unexpectedly break the CWD workflow.”**

### Easy memory trick

**MCP versioning =**

**Contract → Compatibility → New version → Migrate → Deprecate**

And the interview line to remember:

> **“Never make a breaking change to an MCP tool contract silently.”**
