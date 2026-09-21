## How do you implement fallback?

**Fallback means using an approved alternative when the primary dependency or capability is unavailable.**

In CWD, fallback should be **controlled and business-approved**. We should never let the LLM invent a fallback.

### CWD example: ServiceNow unavailable

Normally:

```text id="f3j8k1"
Incident Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
ServiceNow ✅
```

If ServiceNow is unavailable:

```text id="2r6x9m"
Incident Worker
      ↓
MCP
      ↓
ServiceNow ❌
      ↓
Fallback
      ↓
Approved Cache / Secondary Source
```

---

## 1. Define the fallback strategy

Before production, decide what is safe for each capability.

Example:

| Primary         | Failure     | Fallback                   |
| --------------- | ----------- | -------------------------- |
| ServiceNow read | unavailable | Approved cache             |
| Salesforce read | unavailable | Approved cache             |
| Azure AI Search | unavailable | Secondary approved index   |
| LLM             | timeout     | Approved backup model      |
| Optional Worker | unavailable | Partial result             |
| Critical write  | unavailable | Queue for later processing |

Not every dependency should have a fallback.

---

## 2. Use circuit breaker before fallback

For example:

```text id="j5w0v3"
Worker
  ↓
MCP
  ↓
ServiceNow
  ↓
Repeated failures
  ↓
Circuit OPEN
  ↓
Fallback
```

This prevents repeatedly calling a known-unhealthy dependency.

---

## 3. Use cache carefully

For a read-only Customer Briefing:

```text id="s8h2k4"
Salesforce
    ↓
Unavailable
    ↓
Redis / approved cache
    ↓
Customer information
```

But I would include metadata such as:

```text id="n2p7x9"
source = "cache"
cached_at = "..."
freshness = "5 minutes old"
```

The user should not be given stale data as though it were live.

---

## 4. Use a backup model for LLM failures

For example:

```text id="c4y6w8"
Azure OpenAI primary
       ↓
     Timeout
       ↓
Retry + Backoff
       ↓
Still failing
       ↓
Approved backup model
       ↓
Continue
```

But the backup model should meet the required:

* Security requirements
* Quality requirements
* Context window requirements
* Cost limits
* Data/privacy requirements

---

## 5. Queue writes instead of using unsafe fallback

This is very important.

Suppose CWD needs to create a ServiceNow ticket:

```text id="q6s9ea"
Incident Worker
      ↓
ServiceNow ❌
```

I would **not** create the ticket in some random cache.

Instead:

```text id="0x5k7p"
ServiceNow unavailable
       ↓
Durable Queue
       ↓
DLQ if repeated failures
       ↓
ServiceNow recovers
       ↓
Replay
       ↓
Create ticket
```

Use an **idempotency key** so replay doesn't create duplicates.

---

## 6. Partial-result fallback

If Incident Worker is optional:

```text id="k3j8m1"
Customer Worker      → ✅
Opportunity Worker   → ✅
Incident Worker      → ❌
                         ↓
                    No safe fallback
                         ↓
                   Partial Result
```

The Coordinator can return:

```text id="y9f2q4"
Customer information      ✅
Opportunity information   ✅
Incident information      ⚠️ unavailable
```

**Never fabricate the incident information.**

---

## CWD fallback decision

```text id="w2e7qk"
Primary dependency fails
        ↓
Is failure transient?
   ↓ Yes
Retry + Backoff
        ↓
Still failing?
        ↓
Circuit Breaker
        ↓
Is approved fallback available?
      ↙                 ↘
    YES                  NO
     ↓                    ↓
Fallback             Partial result /
     ↓                Queue / HITL / Fail
Validate
     ↓
Return result
```

### Important interview point

**Fallback is not simply "try another system."**

The fallback must be:

* Predefined
* Authorized
* Safe
* Validated
* Observable
* Appropriate for the business operation

### Interview-ready answer

> **“I implement fallback at the dependency or capability boundary. For example, if ServiceNow is unavailable, the Incident Worker can use an approved cached source for read-only information, if freshness requirements allow it. For LLM failures, I can use an approved backup model. For critical writes, I prefer a durable queue and later replay rather than an unsafe alternative. If no safe fallback exists, I return a controlled partial result or escalate to HITL. All fallback paths are explicitly defined, authorized, monitored, and validated.”**

### Strong interview line

> **“A fallback should preserve correctness, not just availability.”**

### Easy memory

**Primary fails → Retry → Circuit Breaker → Approved fallback → Validate → Return / Queue / HITL.**
