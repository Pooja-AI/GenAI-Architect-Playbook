## What should NOT be cached in CWD?

The main rule is:

> **Don't cache data when stale, unauthorized, duplicated, or incorrect data could cause a business or security problem.**

### 1. Critical workflow state — don't use cache as source of truth

For example:

```text
Coordinator
   ↓
LangGraph Checkpoint
   ↓
Cosmos DB / durable storage
```

Don't depend on Redis alone for:

* Workflow checkpoints
* Completed/pending Worker status
* Critical task state
* Recovery state

Redis can be used for fast access, but **durable storage should be the source of truth**.

---

### 2. Financial or transactional operations

Don't cache results of operations such as:

```text
❌ Create order
❌ Update payment
❌ Approve transaction
❌ Transfer money
❌ Create critical record
```

You don't want:

```text
Worker → Cache → "Transaction successful"
```

when the actual transaction status has changed.

For writes, call the authoritative system and use **idempotency keys** to prevent duplicate transactions.

---

### 3. Create / Update / Delete results

For CWD:

```text
Create ServiceNow incident
Update Salesforce opportunity
Delete enterprise record
```

These should normally be obtained from the authoritative system rather than trusting an old cached result.

For example:

```text
Worker
  ↓
MCP
  ↓
ServiceNow
  ↓
Actual result
```

---

### 4. Security authorization decisions

Don't cache authorization decisions for too long or use a cache as the only security control.

For example:

```text
User → "Can I access customer C12345?"
```

The authorization layer should enforce access based on the current identity and policy.

**Important:**

> **Never let a cached result bypass authorization.**

Even when returning cached data:

```text
User
 ↓
Authenticate
 ↓
Authorize
 ↓
Check cache
 ↓
Return authorized data
```

---

### 5. Highly sensitive data

Be very careful caching:

```text
❌ Passwords
❌ API keys
❌ Access tokens/secrets
❌ Private keys
❌ Highly sensitive confidential records
```

Secrets belong in something like **Azure Key Vault**, not ordinary application caching.

---

### 6. Highly dynamic real-time data

If data changes frequently, caching can produce stale answers.

For example:

```text
Current stock/availability
Live transaction status
Real-time operational status
Current incident state
```

If freshness is critical, query the authoritative system.

---

### 7. User-specific data without isolation

This is a major multi-tenant risk.

Bad cache key:

```text
customer:C12345
```

Better:

```text
tenant:T001:user:U100:customer:C12345
```

Otherwise, one user's cached result could accidentally be returned to another user.

Even with a tenant-aware key, **authorization must still be enforced**.

---

### 8. Unvalidated LLM output

Don't blindly cache:

```text
LLM → hallucinated answer → Redis
```

because now the incorrect answer can be repeatedly served.

Instead:

```text
LLM
 ↓
Validation / grounding checks
 ↓
Approved result
 ↓
Cache
```

---

## CWD interview example

Suppose the user asks:

> "Give me the latest customer briefing for C12345."

Salesforce information may be cacheable for a short period.

But if the user asks:

> "Update the customer's opportunity."

I would **not use a cached opportunity object to assume the update succeeded**.

I would execute:

```text
Coordinator
    ↓
Sales Delegator
    ↓
Opportunity Worker
    ↓
MCP
    ↓
Salesforce
    ↓
Actual update result
    ↓
Validate
    ↓
Persist/audit
```

### 🎯 Interview-ready answer

> **“I don't use caching for critical workflow state, financial or transactional operations, create/update/delete operations, security authorization decisions, secrets, or highly dynamic data where stale information could cause incorrect business decisions. In CWD, Redis is primarily an optimization layer. The authoritative system or durable database remains the source of truth. Even when I return cached data, I still enforce authentication and authorization.”**

### Easy memory

**Don't cache:**

**Critical state → Critical writes → Security decisions → Secrets → Real-time data → Unvalidated results**

> **Cache for speed, not for correctness or security.**
