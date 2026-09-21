## How do you create golden test cases?

For CWD, I create golden test cases by taking **real business scenarios, defining the expected behavior and ground truth, validating them with domain experts, and then storing them as repeatable evaluation cases.**

### 1. Start with real CWD use cases

For example:

```text
Customer Briefing
Incident Investigation
Customer Information
Sales Opportunity
IT Support
Failure Recovery
```

Then create representative user requests.

```text
"Give me a customer briefing for C12345"
"Show me open incidents for C12345"
"Give me the latest sales opportunities for C12345"
```

---

### 2. Define the expected workflow

For each request, I don't only define the final answer.

I define **how CWD should behave**.

Example:

```json id="4qj9m3"
{
  "input": "Give me a customer briefing for C12345",

  "expected_intent": "customer_briefing",

  "expected_delegators": [
    "sales",
    "it"
  ],

  "expected_workers": [
    "customer_worker",
    "incident_worker"
  ],

  "expected_sources": [
    "Salesforce",
    "ServiceNow"
  ]
}
```

This allows me to test Coordinator → Delegator → Worker behavior.

---

### 3. Define the ground truth

For factual questions, I identify the **source of truth**.

For example:

```text id="e8zv6k"
Salesforce
Customer ID: C12345
Customer Name: ABC Corp

ServiceNow
Open Incidents: INC1001
Priority: High
```

The expected answer should be based on those authoritative records.

For critical fields, I define exact expected values:

```text
customer_id = C12345
incident_id = INC1001
status = Open
priority = High
```

---

### 4. Add positive and negative cases

I don't create only happy-path examples.

### Positive

```text
"Give me a briefing for C12345"
→ Sales + IT
```

### Negative

```text
"Give me a briefing for C99999"
→ Customer not found
```

### Insufficient evidence

```text
"Tell me the root cause of INC1001"
→ If RCA evidence doesn't exist:
   Abstain
```

### Unauthorized

```text
User requests another customer's data
→ Access denied
```

---

### 5. Add failure and recovery cases

Because CWD is an agentic workflow, I deliberately include failures:

```text id="2w4t4p"
Salesforce timeout
ServiceNow timeout
MCP server unavailable
Worker failure
Delegator failure
Invalid MCP response
LLM timeout
Rate limit
Malformed JSON
```

Expected behavior might be:

```text
Timeout
   ↓
Retry
   ↓
Still failing?
   ↓
Checkpoint
   ↓
Partial result / fallback / DLQ
```

This tests whether the architecture handles real production conditions.

---

### 6. Add adversarial and security cases

I also include:

* Prompt injection
* Unauthorized customer access
* Sensitive-data requests
* Malicious tool parameters
* Tool-selection manipulation
* Cross-tenant access attempts
* Requests attempting to bypass authorization

Expected behavior is explicitly defined.

```text
Unauthorized request
       ↓
Authorization check
       ↓
DENY
```

---

### 7. Add edge cases

Examples:

```text
Missing customer ID
Multiple customer IDs
Invalid customer ID
Ambiguous customer name
No incidents
100+ incidents
Conflicting documents
Stale document
No RAG results
Duplicate records
Very long request
```

These are extremely valuable because production failures often happen outside the happy path.

---

### 8. Validate the golden cases

I don't treat an LLM-generated answer as ground truth.

For business-critical cases, I validate expected results using:

```text
Domain Expert
     +
System of Record
     +
Business Rules
     ↓
Validated Golden Case
```

For example, the expected incident status comes directly from ServiceNow, not from an LLM.

---

### 9. Store the cases in a structured format

For example:

```json id="8v0j8b"
{
  "test_id": "CWD-001",

  "input": "Give me a customer briefing for C12345",

  "expected": {
    "intent": "customer_briefing",
    "delegators": ["sales", "it"],
    "workers": [
      "customer_worker",
      "incident_worker"
    ],
    "facts": {
      "customer_id": "C12345",
      "incident_status": "Open"
    }
  },

  "evaluation": {
    "requires_grounding": true,
    "requires_citations": true,
    "allow_abstention": false
  }
}
```

---

## 10. Continuously grow the dataset

Golden datasets should **evolve**.

When production finds a new failure:

```text
Production failure
       ↓
Root-cause analysis
       ↓
Create regression test
       ↓
Validate expected behavior
       ↓
Add to golden dataset
       ↓
Future releases must pass it
```

For example:

> If CWD once incorrectly reported an incident as "Resolved" when ServiceNow showed "Open", I add that scenario as a regression test so the same issue doesn't return after a future model/prompt change.

---

## How I organize the dataset

A practical CWD golden dataset might look like:

```text
CWD Golden Dataset
│
├── 30 Intent/Routing cases
├── 30 RAG/Grounding cases
├── 20 MCP/Tool cases
├── 20 Multi-Agent cases
├── 20 Failure/Recovery cases
├── 20 Security cases
├── 20 Edge cases
└── 10 Regression cases
```

The exact numbers depend on the application; the important thing is **coverage and verified expected behavior**, not the number itself.

---

## Interview-ready answer

> **“I create golden test cases starting from real CWD business scenarios. For each case, I define the user input, expected intent, expected Delegators and Workers, authoritative data sources, expected critical facts, and expected failure or abstention behavior. I include happy paths, edge cases, security cases, hallucination cases, MCP failures, and multi-agent recovery scenarios. For business-critical ground truth, I validate expected values against systems of record such as Salesforce and ServiceNow and review them with domain experts. When we discover a new production failure, we convert it into a regression test and add it to the golden dataset. This gives us a continuously growing benchmark for CWD.”**

### Easy memory

**Create Golden Cases = Real Scenario → Expected Behavior → Ground Truth → Edge/Failure Cases → Expert Validation → Regression Test.**
