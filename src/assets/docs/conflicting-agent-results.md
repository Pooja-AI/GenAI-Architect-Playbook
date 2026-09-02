# What Happens If Two Agents Return Conflicting Answers?

## Interview Question

**“What happens if two agents return conflicting answers in your multi-agent architecture?”**

---

## Strong Interview Answer

I don't allow the system to blindly select one agent's answer when agents disagree.

I treat conflicting responses as a **consistency and validation problem**.

When two agents return different answers, the orchestration layer first evaluates the responses based on **confidence, evidence, source reliability, business rules, and agent capabilities**.

If the conflict can be resolved deterministically, I resolve it using predefined business rules or authoritative data sources.

If the conflict cannot be resolved automatically, I can either:

* invoke another validation agent,
* retrieve additional evidence,
* ask the user for clarification,
* or escalate to a human for high-risk scenarios.

The important principle is that **LLM confidence alone should not determine the final answer**. The system should use evidence, validation, and deterministic enterprise policies wherever possible.

---

# Functional Flow

```text
                    User Request
                         |
                         v
                   Coordinator
                         |
                 +-------+-------+
                 |               |
                 v               v
             Agent A          Agent B
                 |               |
                 |               |
             Answer A         Answer B
                 |               |
                 +-------+-------+
                         |
                         v
                Conflict Detection
                         |
              +----------+----------+
              |                     |
          No Conflict           Conflict
              |                     |
              v                     v
        Return Result        Evidence Validation
                                    |
                         +----------+----------+
                         |          |           |
                         v          v           v
                    Rule Based   Re-query   Validation
                    Resolution   Evidence     Agent
                         |          |           |
                         +----------+-----------+
                                    |
                                    v
                              Final Decision
                                    |
                         +----------+----------+
                         |                     |
                         v                     v
                     Resolved              Unresolved
                         |                     |
                         v                     v
                  Final Response       HITL / Clarification
```

---

# Technical Approach

## 1. Detect the Conflict

The orchestration layer compares the structured outputs from the agents.

For example:

```json
{
  "agent": "AgentA",
  "answer": "Defect is caused by overheating",
  "confidence": 0.91,
  "evidence": [
    "Temperature exceeded threshold",
    "Historical defects show same pattern"
  ]
}
```

Agent B:

```json
{
  "agent": "AgentB",
  "answer": "Defect is caused by vibration",
  "confidence": 0.84,
  "evidence": [
    "Machine vibration increased",
    "Similar failure observed previously"
  ]
}
```

The orchestration layer identifies that the conclusions are different.

---

## 2. Validate the Evidence

I don't simply choose the agent with the highest confidence.

I evaluate:

* Evidence quality
* Evidence freshness
* Source reliability
* Data completeness
* Confidence
* Agent specialization
* Business rules
* Authoritative enterprise data

For example:

```text
Agent A → Temperature data → IoT system
Agent B → Vibration data → IoT system
```

The system may retrieve additional telemetry and determine which hypothesis has stronger supporting evidence.

---

# 3. Use Agent Specialization

Agent expertise can also influence the decision.

For example:

```text
Vision Agent
    → visual defect evidence

Sensor Analytics Agent
    → temperature/vibration evidence

RCA Agent
    → correlates all evidence
```

The RCA Agent can receive the outputs from both agents:

```text
Vision Result
      +
Sensor Result
      +
Historical Data
      |
      v
RCA Agent
      |
      v
Final Hypothesis
```

This is often better than allowing the Coordinator to arbitrarily choose Agent A or Agent B.

---

# 4. Apply Deterministic Business Rules

For enterprise systems, I prefer deterministic rules for critical decisions.

For example:

```text
IF temperature > threshold
AND vibration is normal
THEN overheating is preferred

IF vibration > threshold
AND temperature is normal
THEN vibration is preferred

IF both exceed thresholds
THEN mark as ambiguous
AND perform additional analysis
```

This prevents the LLM from making an uncontrolled business decision.

---

# 5. Use a Validation Agent When Necessary

If the conflict is complex, I can invoke a specialized validation or adjudication agent.

```text
Agent A → Answer A
Agent B → Answer B
        ↓
Conflict
        ↓
Validation / Adjudication Agent
        ↓
Evidence comparison
        ↓
Final decision
```

The validation agent should receive the **evidence and reasoning metadata**, not just:

```text
Agent A says X
Agent B says Y
```

Instead:

```json
{
  "candidate_answers": [
    {
      "answer": "Overheating",
      "evidence": ["temperature data", "historical defects"],
      "confidence": 0.91
    },
    {
      "answer": "Vibration",
      "evidence": ["vibration data"],
      "confidence": 0.84
    }
  ]
}
```

---

# 6. Handle Unresolved Conflicts

Sometimes the system cannot confidently resolve the disagreement.

In that case, **don't hallucinate a final answer**.

Depending on the business criticality:

```text
Low Risk
    → Return qualified answer

Medium Risk
    → Retrieve additional evidence

High Risk
    → Human-in-the-loop

Critical
    → Block automated decision
```

For example:

> "The available evidence is inconclusive. Both overheating and vibration are possible causes. Additional sensor analysis is required."

This is much safer than pretending one agent is definitely correct.

---

# Where Does LangGraph Fit?

In my architecture, **LangGraph controls the conflict-resolution workflow**.

For example:

```text
Coordinator
    ↓
Agent A ─────┐
             ├──> Conflict Detection
Agent B ─────┘
                    |
              +-----+-----+
              |           |
           Consistent   Conflict
              |           |
              v           v
           Continue    Validate
                          |
                    +-----+-----+
                    |           |
                 Resolved   Unresolved
                    |           |
                    v           v
                 Continue     HITL
```

LangGraph can manage:

* State
* Conditional routing
* Parallel agent execution
* Conflict detection
* Validation
* Retry
* Checkpointing
* Human-in-the-loop
* Final response generation

---

# Where Does A2A Fit?

If the agents are independently deployed, **A2A handles the communication between them**.

For example:

```text
Coordinator
    |
   A2A
    |
Agent A

Coordinator
    |
   A2A
    |
Agent B
```

A2A is responsible for **agent-to-agent communication**.

It does not decide which answer is correct.

The orchestration/validation layer handles conflict resolution.

---

# Important Architectural Principle

### Don't use LLM confidence as the only source of truth.

A response with:

```text
confidence = 0.95
```

is not automatically more correct than:

```text
confidence = 0.80
```

The system should consider:

```text
Correctness
   ↓
Evidence
   ↓
Source Reliability
   ↓
Business Rules
   ↓
Agent Expertise
   ↓
Confidence
```

For critical enterprise decisions, authoritative data and deterministic rules should have higher priority than model confidence.

---

# Example From an Enterprise Scenario

Suppose two agents analyze a manufacturing defect.

### Vision Agent

```text
Finding:
Crack appears to originate from thermal stress.

Confidence: 91%
```

### Sensor Analytics Agent

```text
Finding:
Abnormal vibration preceded the failure.

Confidence: 87%
```

Instead of choosing the 91% answer:

```text
Vision Agent → 91% → SELECT ❌
```

I would do:

```text
Vision Evidence
      +
Sensor Evidence
      +
Historical Failure Data
      +
Machine Telemetry
      |
      v
RCA / Validation
      |
      v
Final Root Cause
```

The final decision is based on **correlated evidence**, not simply agent confidence.

---

# Failure / Conflict Handling Strategy

| Situation            | Action                                 |
| -------------------- | -------------------------------------- |
| Agents agree         | Continue                               |
| Minor disagreement   | Evidence validation                    |
| Different confidence | Evaluate evidence, not just confidence |
| Conflicting evidence | Retrieve additional data               |
| Complex conflict     | Validation/adjudication agent          |
| Low-risk unresolved  | Return qualified answer                |
| High-risk unresolved | Human-in-the-loop                      |
| Repeated conflicts   | Monitor and improve agents/routing     |

---

# Architect-Level Answer

> **“When two agents return conflicting answers, I treat that as an explicit conflict-resolution state rather than allowing the Coordinator to arbitrarily select one response. I compare their structured outputs, evidence, confidence, source reliability, agent specialization, and applicable business rules. If the conflict can be resolved deterministically, I use enterprise rules or authoritative data. For more complex conflicts, I can invoke a validation or adjudication agent with the evidence from both agents. If the system still cannot establish sufficient confidence, I return an uncertainty response or escalate to human-in-the-loop depending on the business risk. LangGraph manages the conflict-resolution workflow and state, while A2A is used for communication between independently deployed agents. The key principle is that the final answer should be evidence-driven and policy-controlled, not simply based on which LLM sounds more confident.”**

---

## 30-Second Interview Version

> **“I don't blindly trust one agent when two agents disagree. I treat the disagreement as a conflict state. I compare evidence, source reliability, confidence, agent specialization, and business rules. If possible, I resolve it using authoritative enterprise data or deterministic rules. Otherwise, I can invoke a validation agent, retrieve additional evidence, or escalate to human review for high-risk scenarios. LangGraph manages the conflict-resolution workflow, while A2A handles agent communication. So the final decision is evidence-driven rather than simply selecting the agent with the highest confidence.”**

---

## Memory Trick

### **C-E-V-H**

**C — Conflict Detection**
**E — Evidence Validation**
**V — Validation / Reconciliation**
**H — Human Escalation**

> **Conflict → Evidence → Validate → Human if unresolved**
