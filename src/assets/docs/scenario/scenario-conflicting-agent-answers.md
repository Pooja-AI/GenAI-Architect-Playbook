## Strong Interview Answer

> **“The coordinator should not simply choose the answer from the agent with the highest confidence. It should resolve the conflict based on source authority, evidence quality, freshness, confidence, and business rules. If the conflict cannot be reliably resolved, the coordinator should escalate or return an uncertainty response rather than hallucinating a decision.”**

### Enterprise Conflict-Resolution Flow

```text
             User Query
                 |
                 v
           Coordinator
             /      \
            v        v
       Agent A      Agent B
          |            |
       Answer A      Answer B
          |            |
          └─────┬──────┘
                v
        Conflict Detector
                |
                v
       Evidence Evaluation
                |
      ┌─────────┼──────────┐
      ↓         ↓          ↓
   Authority  Freshness  Confidence
      |         |          |
      └─────────┼──────────┘
                ↓
        Policy / Resolver
                |
       ┌────────┴────────┐
       ↓                 ↓
  Resolved Answer     Escalate
```

### 1. Compare the evidence, not just the answers

Suppose:

```text
Agent A:
"Product X costs $100."

Agent B:
"Product X costs $120."
```

I would ask:

```text
Which source did each agent use?
When was the source updated?
What is the source authority?
Does the evidence directly support the answer?
```

If Agent A uses the **official pricing database** and Agent B uses an old document:

```text
Official DB → $100 → SELECT
Old document → $120 → REJECT
```

---

### 2. Define source hierarchy

Before deployment, I would establish an authority hierarchy.

For example:

```text
Tier 1 → Transactional/authoritative system
Tier 2 → Official enterprise database
Tier 3 → Approved knowledge base
Tier 4 → External sources
Tier 5 → LLM-generated reasoning
```

The coordinator follows the hierarchy.

> **Evidence should outrank model confidence.**

---

### 3. Check freshness

For dynamic information:

```text
Agent A → Policy updated yesterday
Agent B → Policy from 2024
```

Agent A should normally win.

This is especially important for:

* HR policies
* Pricing
* Inventory
* Financial information
* Compliance rules
* Production incidents

---

### 4. Use confidence carefully

Each agent can return structured output:

```json
{
  "answer": "...",
  "confidence": 0.92,
  "sources": ["policy-2026.pdf"],
  "evidence": "...",
  "timestamp": "2026-09-03T10:00:00"
}
```

The coordinator can evaluate:

```text
Score =
  source_authority
+ evidence_quality
+ freshness
+ agent_confidence
```

But I would **never use confidence alone**.

An LLM saying `"confidence": 0.99` doesn't prove the answer is correct.

---

### 5. Ask agents to provide evidence

Instead of:

```text
Agent A → Answer
Agent B → Answer
```

I prefer:

```text
Agent A →
  Answer
  Evidence
  Sources
  Confidence

Agent B →
  Answer
  Evidence
  Sources
  Confidence
```

Then the coordinator performs evidence-based resolution.

---

### 6. For critical decisions, use a verifier

For high-impact decisions:

```text
Agent A ──┐
          ├──→ Verification Agent
Agent B ──┘           |
                      v
                Evidence Check
                      |
                 Final Decision
```

For example:

```text
Medical / Financial / HR / Security
        ↓
Conflicting answers
        ↓
Independent verification
        ↓
Human approval if required
```

The verifier should ideally evaluate the **evidence**, not simply ask another LLM which answer sounds better.

---

### 7. If the conflict cannot be resolved, don't guess

This is one of the most important points.

Bad:

> "Agent A is probably correct."

Good:

> **“The available sources provide conflicting information. I cannot reliably determine the correct answer without additional verification.”**

For a business-critical workflow:

```text
Conflict
   ↓
Unable to resolve
   ↓
Human escalation
   ↓
Decision
   ↓
Audit
```

---

# Example: CWD Multi-Agent Assistant

Imagine your CWD system has:

```text
Knowledge Agent
      ↓
"Incident was resolved."

Incident Agent
      ↓
"Incident is still active."
```

Coordinator shouldn't randomly select one.

It checks:

```text
Incident Agent
→ Live incident-management system
→ Updated 30 seconds ago

Knowledge Agent
→ Cached knowledge article
→ Updated 2 hours ago
```

Therefore:

```text
Live operational source
          ↓
      Agent B wins
```

And the coordinator can explain:

> “The incident is still active according to the current incident-management system.”

---

## ⭐ 30-Second Interview Answer

> **“I wouldn't choose based purely on agent confidence. The coordinator should compare the evidence behind each answer—source authority, freshness, relevance, and confidence—and apply predefined business policies. Authoritative transactional systems should generally outrank static knowledge bases, and evidence should outrank an LLM's self-reported confidence. For high-risk conflicts, I would use an independent verification step or human approval. If the conflict cannot be resolved reliably, the coordinator should explicitly report uncertainty rather than choosing or hallucinating an answer.”**

### Key line to remember

> **“The coordinator should be an evidence-based decision maker, not a vote counter.”**
