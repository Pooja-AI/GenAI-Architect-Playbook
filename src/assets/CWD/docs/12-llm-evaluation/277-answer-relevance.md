## What is Answer Relevance?

**Answer relevance measures whether the final LLM response actually answers the user's question and stays focused on what they asked.**

In simple terms:

> **“Did I answer the user's question correctly and directly?”**

### CWD example

User asks:

> **“What are the open incidents for customer C12345?”**

CWD retrieves:

```text id="9a2k4m"
INC1001 → Open → High
INC1002 → Open → Medium
```

A relevant answer:

> **“C12345 has two open incidents: INC1001 (High) and INC1002 (Medium).”**

✅ Directly answers the question.

An irrelevant answer:

> **“C12345 is an important customer. They have several historical support interactions and multiple sales opportunities.”**

❌ It may contain true information, but it doesn't answer **which incidents are currently open**.

---

## How do I measure it?

I compare the user's question with the generated answer.

```text id="q8p3sd"
User Question
      ↓
LLM Answer
      ↓
Relevance Evaluator
      ↓
Relevant / Partially Relevant / Irrelevant
```

For a larger evaluation dataset, I can use a scoring approach such as:

```text id="1f6m8a"
100 test questions

90 answers directly address the question

Answer relevance ≈ 90%
```

More sophisticated evaluators can score relevance on a scale, for example **1–5**, using a defined rubric.

---

## Answer Relevance vs Faithfulness

Very important distinction:

### Answer relevance

> **Did the answer address the question?**

### Faithfulness

> **Are the claims in the answer supported by the evidence?**

Example:

User asks:

> “What are the open incidents for C12345?”

LLM answers:

> “C12345 has two open incidents, INC1001 and INC1002.”

But the evidence actually says:

```text
INC1001 → Open
INC1002 → Resolved
```

Then:

* **Answer relevance → ✅** It answered the right question.
* **Faithfulness → ❌** One claim isn't supported by the evidence.
* **Factual accuracy → ❌** The answer is factually wrong.

So a response can be **relevant but not faithful**.

---

## Answer Relevance vs Retrieval Relevance

These are also different:

```text id="q4n8ks"
User Question
      ↓
Retrieval
      ↓
"Did we retrieve the right information?"
      ↓
Retrieval Relevance

      ↓
LLM
      ↓
"Did we answer the question?"
      ↓
Answer Relevance
```

Example:

> User asks about open incidents.

If RAG retrieves the correct incident records → **good retrieval relevance**.

If the LLM then talks about sales opportunities instead → **poor answer relevance**.

---

## How I improve answer relevance in CWD

I use:

* Clear task-specific prompts
* Structured output
* Intent detection at the Coordinator
* Relevant evidence only
* Response schemas
* Claim validation
* Output-length controls
* Evaluation against golden test cases

For example:

```text id="9g3s7p"
Intent:
customer_incidents

Expected output:
incident_id
status
priority
summary

Reject:
unrelated sales information
```

---

## Interview-ready answer

> **“Answer relevance measures whether the final response directly and appropriately answers the user's question. In CWD, I evaluate it against our golden test cases and use an evaluator to check whether the response addresses the requested intent without unnecessary or unrelated information. For example, if the user asks for open incidents, the answer should focus on the open incidents rather than providing unrelated customer or sales information. I distinguish this from faithfulness: relevance asks whether we answered the right question, while faithfulness asks whether the answer is supported by the evidence.”**

### Easy memory

**Answer relevance = “Did I answer the right question?”**

**Faithfulness = “Did I stay true to the evidence?”**
