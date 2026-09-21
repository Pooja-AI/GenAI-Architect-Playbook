## How do you handle inconsistent enterprise data?

In CWD, enterprise systems can contain **different or conflicting representations of the same business data**. I handle this through **validation, normalization, source-of-truth rules, conflict detection, and explicit confidence/status handling**.

### CWD flow

```text
Salesforce ───────┐
ServiceNow ───────┤
Snowflake ────────┤
Oracle ───────────┤
SharePoint ───────┘
        ↓
   MCP Integration
        ↓
 Validation + Normalization
        ↓
 Conflict Detection
        ↓
 Common Response
        ↓
     Workers
        ↓
   Coordinator
        ↓
 Final validated result
```

### Example: Customer Briefing

Suppose the systems return:

```text
Salesforce:
Customer Name = "ABC Corporation"

Snowflake:
Customer Name = "ABC Corp"

ServiceNow:
Customer Name = "ABC Corp."
```

I don't let the LLM randomly decide which one is correct.

I define **system-of-record ownership**:

```text
Customer profile       → Salesforce
Sales/revenue metrics  → Snowflake
Incidents/tickets      → ServiceNow
Documents              → SharePoint
Orders/inventory       → Oracle
```

So the Coordinator knows which source should be authoritative for each field.

---

### 1. Normalize different formats

For example:

```text
"ABC Corporation"
"ABC Corp"
"ABC Corp."
```

can be normalized for comparison:

```python
def normalize_name(name: str):
    return (
        name.lower()
            .replace(".", "")
            .strip()
    )
```

But I **don't overwrite the authoritative source** just because normalized values match.

---

### 2. Detect conflicts

Suppose:

```text
Salesforce → Industry = Semiconductor
Oracle     → Industry = Electronics
```

The system detects:

```json
{
  "field": "industry",
  "values": {
    "salesforce": "Semiconductor",
    "oracle": "Electronics"
  },
  "status": "CONFLICT"
}
```

Then I apply the predefined ownership rule.

```text
Industry owner → Salesforce
```

Therefore Salesforce is used for the final customer profile.

---

### 3. Use source priority

I maintain rules such as:

```text
Customer master information → Salesforce
Financial metrics             → Snowflake
IT incidents                  → ServiceNow
Documents                     → SharePoint
Inventory/orders              → Oracle
```

This is **business-defined**, not something the LLM decides dynamically.

---

### 4. Handle stale data

Sometimes the values aren't actually contradictory—the systems were updated at different times.

For example:

```text
Salesforce → Revenue = $50M, updated 10:00 AM
Snowflake  → Revenue = $48M, updated yesterday
```

I compare:

* `updated_at`
* source system
* freshness requirements
* data version
* effective date

For real-time customer information, I may prefer the fresher authorized source. For financial reporting, I may use the governed Snowflake dataset.

---

### 5. Don't silently merge conflicting values

This is important for GenAI.

If the conflict cannot be resolved deterministically:

```text
Salesforce → Status = Active
Oracle     → Status = Suspended
```

I don't ask the LLM to "guess."

Instead:

```json
{
  "status": "CONFLICT",
  "field": "customer_status",
  "sources": [
    "salesforce",
    "oracle"
  ],
  "resolution": "REQUIRES_REVIEW"
}
```

The Coordinator can then:

```text
Resolve automatically
        OR
Return conflict to user
        OR
Trigger HITL
```

---

### 6. Preserve provenance

Every important value should have traceability.

For example:

```json
{
  "customer_name": {
    "value": "ABC Corporation",
    "source": "salesforce",
    "record_id": "C12345",
    "retrieved_at": "2026-09-21T10:30:00Z"
  }
}
```

This allows us to answer:

> "Where did this information come from?"

That is especially important for enterprise AI.

---

### 7. Don't use the LLM as the reconciliation engine

The LLM can **summarize already-resolved information**, but deterministic code should handle:

```text
Validation
Normalization
Source priority
Freshness
Conflict detection
Authorization
```

Then the LLM receives trusted, structured data.

### Customer Briefing example

```text
Salesforce
  Customer Profile ✓
       ↓
ServiceNow
  Open Incidents ✓
       ↓
Snowflake
  Revenue Metrics ✓
       ↓
Conflict Detection
       ↓
Source-of-Truth Rules
       ↓
Common Customer Briefing Data
       ↓
Coordinator
       ↓
LLM Summary
```

### Interview-ready answer

> **“Enterprise data is often inconsistent across systems, so I don't let the LLM resolve conflicts by guessing. At the MCP and data-normalization layer, I validate schemas, normalize formats, detect conflicting values, and apply business-defined source-of-truth and freshness rules. For example, Salesforce can be authoritative for customer master data, Snowflake for governed financial metrics, and ServiceNow for incidents. If a conflict cannot be deterministically resolved, I preserve both values with provenance and return a conflict or trigger human review. The LLM only summarizes the validated result.”**

### Easy memory

**Validate → Normalize → Detect conflict → Source of truth → Freshness → Provenance → Resolve/HITL**

**Strong interview line:**

> **“I never hide data conflicts from the LLM or the user; I resolve them deterministically when possible and preserve provenance when they cannot be resolved.”**
