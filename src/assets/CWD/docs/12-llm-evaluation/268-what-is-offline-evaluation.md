## What is Offline Evaluation?

**Offline evaluation means testing the CWD system before deploying it to production, using a fixed set of historical or synthetic test cases called a golden dataset.**

You run the same test cases against your Coordinator, Delegators, Workers, RAG, prompts, and LLM and measure the results **without involving real users in production**.

### CWD example

Suppose you create 1,000 test cases:

```text
Input:
"Give me a customer briefing for C12345"

Expected:
Intent        = Customer Briefing
Delegators    = Sales + IT
Workers       = Customer Worker + Incident Worker
Sources       = Salesforce + ServiceNow
Expected facts = predefined ground-truth data
```

Then run:

```text
Golden Dataset
      ↓
   CWD System
      ↓
Coordinator
      ↓
Delegators
      ↓
Workers
      ↓
RAG / MCP
      ↓
LLM Response
      ↓
Evaluation
      ↓
Metrics
```

### What do I measure?

| CWD Layer   | Offline metrics                        |
| ----------- | -------------------------------------- |
| Coordinator | Intent accuracy, entity accuracy       |
| Delegator   | Routing accuracy                       |
| Worker      | Worker-selection accuracy              |
| RAG         | Recall@K, precision@K, relevance       |
| MCP         | Tool-selection and parameter accuracy  |
| LLM         | Faithfulness, groundedness, relevance  |
| Output      | Factual accuracy, citation correctness |
| Workflow    | Task completion, failure recovery      |
| Cost        | Tokens and estimated cost              |
| Performance | Latency                                |

### Example

You have **1,000 golden test cases**.

```text
Coordinator routing:
950 correct / 1000
= 95% routing accuracy

RAG:
920 cases retrieved the correct evidence
= 92% Recall@K

Final answers:
970 were grounded
= 97% groundedness
```

You can compare two versions:

```text
              Version A    Version B
Routing          95%          97%
RAG Recall       92%          95%
Groundedness     94%          97%
Latency           4.2s         3.1s
Cost              $0.08        $0.05
```

This helps you determine whether a **new prompt, model, retrieval strategy, or workflow change actually improves the system before production deployment.**

### Where does the golden dataset come from?

For CWD, I can build it from:

* Historical user queries
* Previously validated production cases
* Synthetic scenarios
* Failure cases
* Edge cases
* Security test cases
* Different customer/incident combinations

Each case should ideally contain **expected behavior or ground truth**, not just the input.

### Offline vs Online Evaluation

```text
OFFLINE
Golden Dataset
     ↓
CWD
     ↓
Metrics
     ↓
Release decision


ONLINE
Real Users
     ↓
Production CWD
     ↓
Telemetry + Feedback
     ↓
Production Metrics
```

**Offline = “Will this version work?”**

**Online = “How is the deployed version actually performing?”**

### Interview-ready answer

> **“Offline evaluation is testing CWD before production using a fixed golden dataset of historical, synthetic, and edge-case scenarios. I run the dataset through the entire workflow and measure intent accuracy, Delegator and Worker routing, retrieval quality, tool selection, groundedness, factual accuracy, latency, and cost. I use this for regression testing and compare new prompts, models, or architecture changes against the previous version before deployment.”**

### Easy memory

**Offline evaluation = Golden Dataset → Run CWD → Measure → Compare → Deploy.**
