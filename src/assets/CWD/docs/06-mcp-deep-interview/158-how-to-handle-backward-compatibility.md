In your **CWD MCP architecture**, backward compatibility means:

> **An existing Worker should continue working even when the MCP Server or tool is upgraded.**

### 1. Basic strategy

```text
Old Worker
    ↓
get_customer_v1
    ↓
MCP Server
    ↓
Salesforce

New Worker
    ↓
get_customer_v2
    ↓
MCP Server
    ↓
Salesforce
```

We don't immediately break `v1` when introducing `v2`.

---

### 2. Avoid breaking existing schemas

Suppose v1 expects:

```json
{
  "customer_id": "C123"
}
```

If we need a new optional field:

```json
{
  "customer_id": "C123",
  "include_contacts": true
}
```

we can maintain compatibility because old Workers can still send:

```json
{
  "customer_id": "C123"
}
```

The server applies a default:

```python
include_contacts = request.include_contacts or False
```

---

### 3. For breaking changes, create a new version

Suppose the old tool is:

```text
get_customer(customer_id)
```

and the new contract requires a completely different structure.

Don't change v1 silently.

Use:

```text
get_customer_v1
get_customer_v2
```

Then:

```text
Old Worker → v1
New Worker → v2
```

This allows gradual migration.

---

### 4. Maintain an adapter when useful

Sometimes the backend changes but you don't want every Worker to change.

```text
Worker
  ↓
get_customer_v1
  ↓
MCP compatibility adapter
  ↓
New backend API
```

For example:

```python
def get_customer_v1(customer_id):
    response = backend.get_customer(
        id=customer_id,
        include_contacts=False
    )

    return transform_to_v1_response(response)
```

The old Worker continues receiving the response format it understands.

---

### 5. Don't remove old versions immediately

I would use:

```text
v1 Current
   ↓
v2 Released
   ↓
Migrate Workers
   ↓
Monitor v1 usage
   ↓
v1 Deprecated
   ↓
Final removal
```

Before removing v1, verify:

```text
Are any Workers still using v1?
Are there active workflows using v1?
Are tests passing with v2?
Are downstream systems compatible?
```

---

### 6. Version output contracts too

Backward compatibility isn't only about input parameters.

Suppose v1 returns:

```json
{
  "customer_id": "C123",
  "name": "ABC Corp"
}
```

Don't suddenly change it to:

```json
{
  "id": "C123",
  "customer": {
    "name": "ABC Corp"
  }
}
```

An old Worker may break.

Instead:

```text
v1 → old response contract
v2 → new response contract
```

---

### 7. Use contract testing

For every MCP tool, I would maintain tests such as:

```text
get_customer_v1
 ├── input schema
 ├── output schema
 ├── error behavior
 ├── authorization
 └── backward compatibility

get_customer_v2
 ├── input schema
 ├── output schema
 ├── error behavior
 └── authorization
```

This catches accidental breaking changes before production.

---

### 8. CWD example

Suppose your **Customer Worker** currently uses:

```text
get_customer_v1
```

and the new Customer Briefing requirement needs contacts and opportunities.

Instead of breaking the existing Worker:

```text
                    MCP Server
                   /           \
                  /             \
Customer Worker              New Customer Worker
     ↓                              ↓
get_customer_v1                get_customer_v2
     ↓                              ↓
     └──────── Salesforce backend ───┘
```

You migrate the Worker when it's ready.

---

## Strong interview answer

> **“For backward compatibility, I treat MCP tool schemas as stable contracts. I avoid breaking changes whenever possible, especially to existing input and output fields. For backward-compatible additions, I use optional parameters and defaults. For breaking changes, I introduce a new tool version such as `v2` and keep `v1` available during migration. If necessary, I use a compatibility adapter to translate the old contract to the new backend. I also use contract tests, monitor v1 usage, and only deprecate the old version after all dependent Workers and workflows have migrated.”**

### Easy memory trick

**Backward compatibility =**

**Don't break → Version → Adapt → Migrate → Test → Deprecate**

The key interview phrase:

> **“The MCP Server can evolve without forcing all existing Workers to upgrade at the same time.”**
