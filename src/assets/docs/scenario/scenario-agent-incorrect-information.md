# Agent A gives incorrect information to Agent B. How do you detect and prevent this?

### 🎯 Strong Interview Answer

> **“I don't assume that information coming from one agent is correct just because it came through A2A. I treat inter-agent communication as an untrusted information boundary. I validate the output from Agent A before Agent B consumes it using schema validation, source grounding, confidence checks, business-rule validation, and, for critical decisions, an independent verification step. I also maintain provenance and traceability so I can identify which agent, tool, and source produced each piece of information.”**

---

## 1. Validate the A2A response schema

First, Agent A should return a **structured response**, not just free-form text.

```json
{
  "task_id": "CWD-123",
  "status": "success",
  "result": {
    "incident_id": "INC-456",
    "root_cause": "Database connection timeout"
  },
  "sources": [
    "incident_db"
  ],
  "confidence": 0.91
}
```

Agent B validates:

```text
Is required field present?
        ↓
Is data type correct?
        ↓
Is confidence acceptable?
        ↓
Are sources available?
        ↓
Business validation
```

If validation fails, Agent B should **not blindly use the result**.

---

# 2. Ground the agent's response

This is particularly important for RAG-based agents.

Instead of:

```text
Agent A → "The root cause was network failure."
```

I want:

```text
Agent A
   ↓
Root Cause: Network failure
   ↓
Evidence:
   ├── Incident ID: INC-456
   ├── Log timestamp
   └── Knowledge document
```

Agent B can then verify whether the answer is actually supported by the underlying enterprise data.

---

# 3. Use provenance

Every important piece of information should carry its origin.

```text
Agent A
  ↓
Claim
  ↓
Source
  ↓
Tool
  ↓
Document / Database / API
```

For example:

```json
{
  "claim": "Database timeout caused the incident",
  "source": {
    "type": "incident_log",
    "id": "INC-456"
  },
  "agent": "AnalyticsAgent",
  "timestamp": "2026-09-02T10:30:00Z"
}
```

This allows us to answer:

> **“Where did Agent A get this information?”**

---

# 4. Independent verification for critical information

For high-impact decisions, I wouldn't allow Agent B to trust Agent A alone.

For example:

```text
Agent A
   ↓
"Incident caused by DB failure"
   ↓
Agent B
   ↓
Verify against Incident DB
   ↓
Verification Agent / Tool
   ↓
Confirmed?
```

If the information doesn't match:

```text
Agent A → DB Failure
Database → Network Failure
             ↓
          Conflict
             ↓
       Escalate / Re-evaluate
```

This is essentially a **trust-but-verify** pattern.

---

# 5. Confidence thresholds

I can require Agent A to provide confidence.

```text
Confidence >= 0.85
       ↓
Accept

0.60 – 0.85
       ↓
Verify

< 0.60
       ↓
Reject / Re-plan
```

However, an important interview point is:

> **LLM confidence scores alone are not sufficient for factual verification.**

A model saying `"confidence": 0.95` doesn't prove that the information is correct.

I use confidence as **one signal**, together with evidence and validation.

---

# 6. Business-rule validation

Some information can be validated deterministically.

For example:

```text
Agent A:
"Employee has 45 days remaining."

System:
Start date = Jan 1
Current date = Feb 10
Actual remaining = 20 days
```

The business rule catches the error.

```text
Agent Output
     ↓
Business Rules
     ↓
Valid? ─── No ──→ Reject / Correct
  │
 Yes
  ↓
Agent B
```

This is much stronger than asking another LLM:

> "Is Agent A correct?"

---

# 7. Prevent propagation of bad information

This is extremely important in multi-agent systems.

If Agent A gives incorrect information:

```text
Agent A
   ↓
Wrong result
   ↓
Agent B
   ↓
Agent C
   ↓
Final Answer
```

The error can propagate across the entire agent graph.

So I would establish **validation boundaries**:

```text
Agent A
   ↓
Validation Layer
   ↓
Agent B
   ↓
Validation Layer
   ↓
Agent C
```

Every critical handoff becomes a controlled boundary.

---

# 8. Human-in-the-loop for high-risk decisions

For critical enterprise operations:

```text
Agent A
   ↓
Agent B
   ↓
Risk Assessment
   ↓
High Risk?
   ↓ YES
Human Approval
   ↓
Execute
```

For example:

* Financial transactions
* Production changes
* Security actions
* Employee-impacting decisions
* Regulatory decisions

The agent should recommend rather than autonomously execute when the risk is high.

---

# 9. Observability and audit trail

I would capture the complete A2A chain:

```text
Trace ID: CWD-123

User
 ↓
Coordinator
 ↓
Agent A
 ↓
Tool
 ↓
Source
 ↓
Agent A Result
 ↓
Agent B
 ↓
Validation
 ↓
Final Answer
```

This allows us to determine:

> **Was the error introduced by Agent A, its tool, the source data, Agent B's interpretation, or the final synthesis?**

---

# 10. CWD Example

Suppose the user asks:

> **“Why did this CWD incident happen?”**

The flow could be:

```text
Coordinator
      ↓
A2A
      ↓
Analytics Agent
      ↓
"Root cause = Database timeout"
      ↓
Validation
      ↓
Incident DB + Logs
      ↓
Database says:
"Network connectivity failure"
      ↓
CONFLICT DETECTED
      ↓
Re-query / Verification Agent
      ↓
Resolve discrepancy
      ↓
Coordinator
      ↓
Final Answer with evidence
```

Instead of hiding the disagreement, the system should be able to say:

> **“The initial analysis identified a database timeout, but log evidence indicates the underlying cause was network connectivity. The result was revalidated against the incident logs.”**

That is much safer than blindly propagating Agent A's answer.

---

# Enterprise Architecture

```text
                 Agent A
                    │
                    │ A2A
                    ↓
          ┌────────────────────┐
          │ Validation Layer   │
          │                    │
          │ Schema Validation  │
          │ Provenance         │
          │ Grounding          │
          │ Business Rules     │
          │ Confidence         │
          └─────────┬──────────┘
                    │
              Validated?
               /        \
             NO          YES
             ↓            ↓
       Re-plan /       Agent B
       Verify             │
                          ↓
                     Processing
                          │
                          ↓
                  Final Validation
                          │
                          ↓
                       Output
```

## ⭐ 45-Second Interview Version

> **“I treat an agent's output as untrusted information until it is validated. When Agent A communicates with Agent B through A2A, I use structured schemas, provenance, source grounding, confidence signals, and deterministic business-rule validation. For critical information, Agent B independently verifies the result against the source system or a verification agent. I also maintain validation boundaries between agents so incorrect information doesn't propagate through the agent graph. Finally, I use distributed tracing and audit logs to identify where incorrect information originated. For high-risk actions, I introduce human approval. So the principle is: A2A provides communication, but validation and governance provide trust.”**

### 🔥 Excellent follow-up answer

If the interviewer asks **“Would you use another LLM to verify Agent A?”**, say:

> **“I can use a second model as an additional signal, but I wouldn't consider LLM-to-LLM agreement as proof of correctness. For enterprise systems, I prefer deterministic validation and verification against authoritative data sources wherever possible. Another LLM can help evaluate reasoning or detect inconsistencies, but the source of truth should remain the enterprise system or validated evidence.”**
