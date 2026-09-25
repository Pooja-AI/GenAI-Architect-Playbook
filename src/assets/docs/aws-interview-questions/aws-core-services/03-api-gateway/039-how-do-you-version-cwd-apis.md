# How do you version CWD APIs?

## Short answer

I use **URI-based major versioning** for CWD APIs, for example:

```text
/api/v1/customer-briefing
/api/v2/customer-briefing
```

I create a new major version only for **breaking changes**. Backward-compatible changes stay within the same major version.

## Key points

1. **Major version for breaking changes**
2. **Backward-compatible changes don't require a new major version**
3. Keep old and new versions running during migration
4. Use API Gateway stages/routes to manage versions
5. Test each version independently
6. Monitor usage of each version
7. Deprecate old versions gradually
8. Never suddenly break existing clients

### CWD flow

```text
Client
   ↓
API Gateway
   ↓
/api/v1/customer-briefing
        OR
/api/v2/customer-briefing
   ↓
CWD API
   ↓
Coordinator
   ↓
Delegator
   ↓
Workers
```

---

## 1. Version using the API URL

For example, V1:

```text
POST /api/v1/customer-briefing
```

Later, suppose we introduce a breaking request structure:

```text
POST /api/v2/customer-briefing
```

Both can temporarily coexist:

```text
             API Gateway
                 ↓
       ┌─────────┴─────────┐
       ↓                   ↓
     V1 API              V2 API
       ↓                   ↓
 CWD V1 Contract      CWD V2 Contract
```

---

## 2. What is a breaking change?

For example, V1 accepts:

```json
{
  "customer_id": "C12345"
}
```

Suppose V2 changes it to:

```json
{
  "customer": {
    "id": "C12345"
  }
}
```

Existing clients using V1 would break.

That's a reason for:

```text
v1 → v2
```

---

## 3. What doesn't require a new major version?

Suppose V1 already accepts:

```json
{
  "customer_id": "C12345"
}
```

You add an optional field:

```json
{
  "customer_id": "C12345",
  "include_incidents": true
}
```

If existing clients continue working, this can remain:

```text
/api/v1/customer-briefing
```

The important rule is:

> **Don't create a new API version for every small change.**

---

## 4. Keep versions backward compatible

Suppose:

```text
V1 → 60% of traffic
V2 → 40% of traffic
```

I can monitor:

* Request volume
* Error rate
* 4xx/5xx
* P95/P99 latency
* Worker failures
* MCP failures
* Bedrock errors
* Cost

Then gradually migrate clients from V1 to V2.

---

## 5. Deprecate old versions

I wouldn't immediately remove V1.

Instead:

```text
V1
 ↓
Announce deprecation
 ↓
Monitor remaining clients
 ↓
Migrate clients
 ↓
Reduce traffic
 ↓
Disable V1
```

For example:

```text
V1 → Deprecated
V2 → Current
```

API Gateway can help route and manage the different API versions, while application code maintains the corresponding contracts.

---

## 6. Version more than the API

For CWD, API versioning is only one part.

I would separately version:

```text
API contract
Prompt
Model configuration
Agent configuration
Tool/MCP schema
RAG configuration
```

For example:

```text
CWD Run R123
 ├── API: v2
 ├── Prompt: p15
 ├── Model Config: v4
 ├── Agent Config: v7
 └── RAG Config: v5
```

This is very useful when troubleshooting production issues.

---

## 🎯 Strong interview answer

> **“I version CWD APIs using major URI versions such as `/api/v1` and `/api/v2`. I create a new major version only for breaking contract changes; backward-compatible changes remain in the existing version. During migration, I run both versions, route traffic appropriately through API Gateway, monitor usage, errors and latency, and gradually migrate clients. I also separately version prompts, model configuration, agent configuration and MCP contracts so every CWD run is reproducible.”**

## Easy memory trick

**V → B → R → M → D**

* **V**ersion
* **B**reaking change → new major version
* **R**un old + new
* **M**igrate
* **D**eprecate

### Key distinction

**API version ≠ model version ≠ prompt version ≠ MCP/tool version**

For CWD:

```text
API v2
   +
Prompt v15
   +
Model Config v4
   +
MCP Contract v3
```

Together, these give you **traceability and safe evolution** of the AI platform.
