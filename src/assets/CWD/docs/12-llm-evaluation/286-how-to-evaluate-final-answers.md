## How do you evaluate final answers?

**Final-answer evaluation measures whether the response returned to the user is correct, relevant, complete, grounded, safe, and actually satisfies the user's request.**

In simple terms:

> **“Did CWD give the user the right answer based on trusted enterprise data?”**

### CWD example

User asks:

> **“Give me a customer briefing for C12345.”**

CWD gathers:

```text id="r7k2mp"
Salesforce
→ Customer information
→ Opportunities

ServiceNow
→ Open incidents

        ↓
Coordinator
        ↓
Validate + Aggregate
        ↓
Final Answer
```

I evaluate the **final answer**, not just whether the workflow completed.

---

## What do I check?

### 1. Factual accuracy

Are the facts actually correct?

If ServiceNow says:

```text
INC1001 → Open
INC1002 → Resolved
```

The answer should not say:

> “C12345 has two open incidents.”

❌ Incorrect.

---

### 2. Faithfulness / groundedness

Are the claims supported by the evidence retrieved from Salesforce, ServiceNow, RAG, etc.?

```text id="q3v8nc"
Evidence:
INC1001 = Open

Answer:
"INC1001 is currently open." ✅
```

But:

```text
"INC1001 was caused by a database failure." ❌
```

if that information wasn't present in the evidence.

---

### 3. Answer relevance

Did the response answer **the user's actual question**?

User:

> “What are the open incidents?”

Good:

> “C12345 has one open incident: INC1001, High priority.”

Bad:

> “C12345 has three sales opportunities...”

Even if the sales information is correct, it doesn't answer the question.

---

### 4. Completeness

Did the answer include all required information?

For example, if Customer Briefing requires:

```text
Customer information
Sales opportunities
Open incidents
```

and the final response only contains customer information:

❌ Incomplete.

---

### 5. Citation correctness

If CWD provides citations, I verify that the citation actually supports the claim.

```text id="m8q4wp"
Claim:
"INC1001 is open."

Citation:
ServiceNow INC1001

→ Supports claim ✅
```

I don't let the LLM invent URLs or source references. The application maintains the source metadata.

---

### 6. Abstention correctness

If there isn't enough evidence, the system should **not invent an answer**.

For example:

```text
User:
"What caused INC1001?"

Retrieved evidence:
No RCA information found.
```

Expected:

> “I couldn't find sufficient RCA information for INC1001.”

Not:

> “The incident was caused by a network configuration issue.”

---

### 7. Business-rule validation

Some answers contain structured facts that can be checked deterministically.

For example:

```text
Customer ID = C12345
Incident count = 2
Priority = High
Status = Open
```

I can compare those fields directly against the source systems.

---

# How do I evaluate it?

I use a **golden dataset**.

Example:

```json id="z6p2rk"
{
  "test_id": "CWD-001",
  "input": "What are the open incidents for C12345?",
  "expected": {
    "customer_id": "C12345",
    "incident_ids": ["INC1001"],
    "status": "Open"
  },
  "requires_grounding": true,
  "requires_citations": true
}
```

CWD produces:

```text id="j5n8vx"
Actual:
"Customer C12345 has one open incident, INC1001."
```

Then I evaluate:

```text
Factual accuracy      ✅
Groundedness          ✅
Relevance             ✅
Completeness          ✅
Citation correctness  ✅
```

---

# What metrics do I track?

| Metric                   | Question                                         |
| ------------------------ | ------------------------------------------------ |
| **Factual accuracy**     | Are the facts correct?                           |
| **Faithfulness**         | Are claims supported by evidence?                |
| **Groundedness**         | Is the answer anchored in trusted evidence?      |
| **Answer relevance**     | Did it answer the user's question?               |
| **Completeness**         | Did it include required information?             |
| **Citation correctness** | Do citations support the claims?                 |
| **Abstention accuracy**  | Does it refuse when evidence is insufficient?    |
| **Task completion**      | Did the response satisfy the business task?      |
| **Safety**               | Did it avoid unauthorized/sensitive information? |

---

## LLM-as-a-Judge

For subjective qualities such as:

* relevance
* clarity
* completeness
* helpfulness

I can use an **LLM evaluator** with a structured rubric.

For example:

```text id="p4w7ks"
Evaluate response:

1. Is it relevant?       0–1
2. Is it grounded?       0–1
3. Is it complete?       0–1
4. Is it factually correct? 0–1
5. Are citations valid?  0–1
```

But I don't rely only on an LLM judge.

For critical enterprise facts, I prefer:

```text id="n2c8mq"
Deterministic validation
        +
Source-of-truth comparison
        +
Golden datasets
        +
RAG/grounding evaluation
        +
LLM-as-a-Judge
```

---

## Important distinction

### Final-answer evaluation

> **“Is the answer good?”**

### Trajectory evaluation

> **“Did the agent take the right path to produce it?”**

For example:

```text id="w9k3fa"
Wrong tool used
      ↓
Correct-looking answer
```

Final answer might look correct, but trajectory evaluation could still identify a serious problem.

---

## Interview-ready answer

> **“I evaluate final answers across factual accuracy, faithfulness, groundedness, relevance, completeness, citation correctness, abstention behavior, and safety. In CWD, I compare the generated response against trusted evidence from Salesforce, ServiceNow, and RAG sources, and for critical structured facts I validate directly against the system of record. I use golden datasets for regression testing and LLM-as-a-Judge for qualities such as relevance and completeness, while deterministic validation handles things like customer IDs, incident status, counts, and citations. I also verify that when evidence is insufficient, the system abstains rather than hallucinating.”**

### Easy memory

**Final Answer = Correct + Grounded + Relevant + Complete + Safe.**
