# Token-Usage Consumption in CWD

**Core principle:**

> **Token-usage consumption measures how much model input and output capacity an agent consumes during execution, and how that consumption affects quality, latency, context-window usage, and cost.**

For CWD, token usage should be measured at **LLM call → step → Worker → Delegator → Coordinator → task → workflow → user request** levels.

---

## 1. What Is a Token?

An LLM does not process text directly as words. Text is converted into **tokens**, which are smaller units used by the model.

For example:

```text
Text
 ↓
Tokenizer
 ↓
Tokens
 ↓
LLM
```

A sentence such as:

```text
"Why is shipment SHIP123 delayed?"
```

might be represented by several tokens. The exact number depends on the tokenizer and model.

Therefore:

```text
Tokens ≠ words ≠ characters
```

---

# 2. Input vs Output Tokens

Every LLM invocation generally has two major token categories:

```text
LLM Call
   │
   ├── Input Tokens
   │     ├── System instructions
   │     ├── User request
   │     ├── Conversation context
   │     ├── Memory
   │     ├── RAG context
   │     └── Tool results
   │
   └── Output Tokens
         └── Generated response
```

So:

$$
TotalTokens = InputTokens + OutputTokens
$$

Example:

```text
Input  = 4,000 tokens
Output =   800 tokens
--------------------
Total  = 4,800 tokens
```

---

# 3. What Consumes Tokens in an Agent?

This is particularly important for CWD because an agent may construct a large context.

```text
Agent LLM Request
│
├── System Prompt
├── Developer Instructions
├── User Message
├── Conversation History
├── Short-Term Memory
├── Persistent Memory
├── RAG Results
├── Tool/MCP Results
├── Previous Agent Results
└── Output Format Instructions
```

Everything sent to the model contributes to the input-token count.

Therefore:

> **A large context can become more expensive and slower even when the user's actual question is very small.**

---

# 4. Token Consumption in CWD

Consider:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
RAG
 ↓
MCP
 ↓
LLM
```

There may be multiple LLM calls.

For example:

```text
Coordinator
   └── LLM call = 2,000 tokens

Delegator
   └── LLM call = 3,000 tokens

Worker
   ├── LLM call = 5,000 tokens
   └── LLM call = 4,000 tokens

Final Coordinator
   └── LLM call = 2,500 tokens
```

Total:

$$
2,000 + 3,000 + 5,000 + 4,000 + 2,500
= 16,500
$$

The user's single request consumed **16,500 tokens across the workflow**.

---

# 5. Agent-Level Token Usage

For each agent:

$$
AgentTokens =
\sum InputTokens +
\sum OutputTokens
$$

Example:

```json
{
  "agent_id": "shipping-agent",
  "llm_calls": 3,
  "input_tokens": 8500,
  "output_tokens": 1800,
  "total_tokens": 10300
}
```

This allows you to compare agents.

| Agent              |      Input |    Output |      Total |
| ------------------ | ---------: | --------: | ---------: |
| Coordinator        |      4,000 |       800 |      4,800 |
| Shipping Delegator |      3,000 |       600 |      3,600 |
| Tracking Worker    |      5,000 |     1,000 |      6,000 |
| **Workflow**       | **12,000** | **2,400** | **14,400** |

---

# 6. Step-Level Token Usage

Token consumption should also be associated with individual execution steps.

```text
Workflow
   │
   ├── Step 1: Intent Classification
   │      → 500 tokens
   │
   ├── Step 2: Planning
   │      → 1,500 tokens
   │
   ├── Step 3: Retrieval
   │      → 0 LLM tokens
   │
   ├── Step 4: Tool Execution
   │      → 0 LLM tokens
   │
   ├── Step 5: Analysis
   │      → 4,000 tokens
   │
   └── Step 6: Response
          → 1,500 tokens
```

This helps answer:

> **Which execution step is consuming most of the model budget?**

---

# 7. Token Usage vs Context Window

Every model has a maximum context capacity.

Conceptually:

$$
InputTokens + OutputTokens \le ContextWindow
$$

Example:

```text
Model context capacity = 32K

Input context          = 27K
Maximum output budget  = 5K
--------------------------------
Total                  = 32K
```

If CWD keeps adding:

```text
Conversation history
+
Memory
+
RAG
+
Tool results
+
Agent results
```

the context can grow rapidly.

---

# 8. Context Growth in Multi-Agent Systems

This is a major CWD concern.

Poor design:

```text
Coordinator
    ↓
Entire context
    ↓
Delegator
    ↓
Entire context
    ↓
Worker
    ↓
Entire context
    ↓
Another Worker
```

You may repeatedly send unnecessary information.

Better design:

```text
Coordinator
    ↓
Task-specific context
    ↓
Delegator
    ↓
Domain-specific context
    ↓
Worker
    ↓
Minimum required context
```

This is called **controlled context propagation**.

---

# 9. Context Propagation and Token Consumption

Instead of:

```json
{
  "conversation_history": "entire 50-turn conversation",
  "all_memory": "...",
  "all_rag_results": "...",
  "all_previous_agent_results": "..."
}
```

send:

```json
{
  "task": "Analyze shipment delay",
  "shipment_id": "SHIP123",
  "relevant_context": {
    "latest_tracking_events": "...",
    "carrier_status": "...",
    "route_constraints": "..."
  }
}
```

The second approach reduces:

* token consumption
* latency
* model distraction
* context-window pressure
* cost

while improving task focus.

---

# 10. RAG Token Consumption

RAG can become a major source of token consumption.

Consider:

```text
User Query
   ↓
Retrieve 20 chunks
   ↓
Each chunk ≈ 500 tokens
   ↓
10,000 tokens
   ↓
LLM
```

You have already added approximately:

$$
20 \times 500 = 10,000
$$

tokens before considering:

* system prompt
* user request
* conversation
* memory
* tool results
* output.

Therefore:

> **Retrieval quality matters more than simply retrieving more documents.**

---

# 11. RAG Context Optimization

Instead of:

```text
Top 20 chunks
 ↓
10,000 tokens
 ↓
LLM
```

use:

```text
Retrieve
 ↓
Security filter
 ↓
Rank
 ↓
Deduplicate
 ↓
Select relevant evidence
 ↓
Context budget
 ↓
LLM
```

For example:

```text
20 candidates
      ↓
12 authorized
      ↓
8 relevant
      ↓
5 non-redundant
      ↓
3,000-token context
      ↓
LLM
```

This reduces token consumption while preserving evidence quality.

---

# 12. Tool/MCP Token Consumption

Tool calls can also indirectly increase tokens.

Example:

```text
LLM
 ↓
Tool call
 ↓
Enterprise API
 ↓
10,000-row result
 ↓
LLM
```

If the entire result is inserted into the next prompt:

```text
10,000 rows
     ↓
Huge token consumption
```

Better:

```text
Enterprise API
     ↓
Worker
     ↓
Filter / aggregate / summarize
     ↓
Relevant result
     ↓
LLM
```

For example:

```json
{
  "shipment_id": "SHIP123",
  "status": "delayed",
  "root_cause": "carrier_capacity",
  "last_event": "Dallas hub",
  "event_count": 3
}
```

rather than sending hundreds of raw events.

---

# 13. Conversation History Token Consumption

Suppose:

```text
Turn 1 = 500 tokens
Turn 2 = 700
Turn 3 = 900
Turn 4 = 1,000
Turn 5 = 1,200
```

If the full conversation is repeatedly sent:

```text
Turn 5 input
≈ 4,300 historical tokens
```

After 50 turns, this can become extremely expensive.

Use:

```text
Recent turns
+
Conversation summary
+
Relevant historical turns
```

rather than:

```text
Entire conversation
```

---

# 14. Short-Term Memory and Tokens

Short-term memory should not mean:

> "Send everything currently stored in Redis."

Instead:

```text
Redis
 ↓
Memory Retrieval
 ↓
Relevance filtering
 ↓
Authorization
 ↓
Task scope
 ↓
Token budget
 ↓
LLM
```

The goal is:

$$
UsableContext =
Relevant \cap Authorized \cap Valid \cap TaskScoped \cap TokenBudget
$$

---

# 15. Persistent Memory and Tokens

Persistent memory may contain hundreds or thousands of records.

Do **not** send all of them.

Instead:

```text
Persistent Memory
       ↓
Semantic Retrieval
       ↓
Metadata Filtering
       ↓
Authorization
       ↓
Ranking
       ↓
Top Relevant Memories
       ↓
LLM
```

For example:

```text
10,000 memories
      ↓
20 candidates
      ↓
5 relevant memories
      ↓
Context
      ↓
LLM
```

---

# 16. Token Consumption and Cost

Token usage directly influences LLM cost.

Conceptually:

$$
Cost =
InputTokens \times InputTokenPrice
+
OutputTokens \times OutputTokenPrice
$$

For a workflow:

$$
WorkflowCost_{LLM}
=
\sum_{i=1}^{n}
(InputTokens_i \times P_{input})
+
(OutputTokens_i \times P_{output})
$$

Actual pricing depends on the selected model/provider.

---

# 17. Cost Per Successful Workflow

A particularly useful enterprise metric is:

$$
CostPerSuccessfulWorkflow =
\frac{TotalWorkflowCost}{SuccessfulWorkflows}
$$

Suppose:

```text
1,000 workflows
900 successful
Total LLM cost = $180
```

Then:

$$
CostPerSuccessfulWorkflow =
180/900 = \$0.20
$$

This is more meaningful than just tracking total token usage.

---

# 18. Token Efficiency

Token efficiency asks:

> **How much useful business outcome did we obtain for the tokens consumed?**

Conceptually:

$$
TokenEfficiency =
\frac{UsefulOutput}{TotalTokens}
$$

For production evaluation, useful output should preferably be tied to a measurable business outcome rather than simply counting output words.

For example:

```text
Agent A
10,000 tokens → successful task

Agent B
25,000 tokens → successful task
```

If quality is equivalent:

> Agent A is more token-efficient.

---

# 19. Token Waste

Typical sources of waste:

```text
Token Waste
│
├── Repeated conversation history
├── Excessive RAG chunks
├── Duplicate chunks
├── Large tool responses
├── Repeated LLM calls
├── Verbose prompts
├── Redundant agent reasoning
├── Unnecessary summarization
├── Passing irrelevant memory
└── Sending full workflow state
```

A production CWD platform should actively measure these.

---

# 20. Token Consumption Across CWD

A useful hierarchy is:

```text
User Request
    │
    ▼
Session
    │
    ▼
Conversation Turn
    │
    ▼
Workflow
    │
    ├── Coordinator
    │      └── LLM calls
    │
    ├── Delegator
    │      └── LLM calls
    │
    └── Workers
           ├── RAG
           ├── MCP
           └── LLM calls
```

Each LLM call should record:

```text
model
model_version
input_tokens
output_tokens
total_tokens
latency
cost
prompt_id
prompt_version
workflow_id
task_id
run_id
step_id
```

---

# 21. Token Usage Telemetry

Example:

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-005",

  "agent_id": "tracking-worker",

  "model": "approved-model",
  "model_version": "v4",

  "prompt_id": "shipment-delay-analysis",
  "prompt_version": "2.2.0",

  "input_tokens": 4200,
  "output_tokens": 850,
  "total_tokens": 5050,

  "latency_ms": 2100,

  "status": "completed"
}
```

This connects token consumption with the state hierarchy you've been defining.

---

# 22. Token Usage Per Task

Suppose:

```text
Task WT-1001
```

has three LLM calls:

```text
Call 1 → 3,000 tokens
Call 2 → 5,000 tokens
Call 3 → 2,000 tokens
```

Then:

$$
TaskTokens = 3000 + 5000 + 2000 = 10,000
$$

This can be persisted as part of task/run execution metadata.

---

# 23. Token Usage Per Workflow

Suppose:

```text
Coordinator = 4K
Delegator   = 6K
Worker A    = 8K
Worker B    = 5K
Final Agent = 3K
```

Then:

$$
WorkflowTokens = 4+6+8+5+3 = 26K
$$

This is the number that matters when comparing alternative architectures.

---

# 24. Token Consumption and Agent Design

Consider two designs.

### Architecture A

```text
Coordinator
 → Delegator
 → Worker
 → LLM
```

Token usage:

```text
10K
```

### Architecture B

```text
Coordinator
 → Planner LLM
 → Delegator
 → Worker
 → Analyzer LLM
 → Reviewer LLM
 → Final LLM
```

Token usage:

```text
30K
```

If Architecture B does not materially improve:

* accuracy
* reliability
* safety
* business outcome

then the additional token consumption may not be justified.

---

# 25. Token Usage and Latency

Token consumption and latency are often correlated:

```text
More input tokens
      ↓
More model processing
      ↓
Higher latency
```

and:

```text
More output tokens
      ↓
More generation
      ↓
Higher latency
```

Therefore:

```text
Token Optimization
       ↓
Potentially lower
Latency + Cost
```

But this is not universally linear; model/provider behavior varies.

---

# 26. Token Usage and Accuracy

Reducing tokens blindly is dangerous.

Example:

```text
Before:
10 relevant RAG chunks
→ high accuracy

After:
2 chunks
→ lower accuracy
```

Therefore the objective is:

> **Minimum sufficient context, not minimum context.**

This is an important architectural principle.

---

# 27. Token Budgeting

CWD can establish token budgets.

Example:

```text
Workflow Token Budget = 30,000
```

Possible allocation:

```text
Coordinator       4,000
Delegator         5,000
Worker pool      15,000
Final synthesis   4,000
Reserve            2,000
-----------------------
Total             30,000
```

When the budget is approaching the limit, CWD could:

```text
reduce context
      ↓
summarize
      ↓
reduce retrieval
      ↓
use cheaper/smaller model
      ↓
skip non-essential step
      ↓
request human intervention
```

These decisions should be governed by policy rather than letting the LLM arbitrarily change system controls.

---

# 28. Token Budget at Step Level

For example:

```json
{
  "step_type": "retrieval_analysis",
  "token_budget": 6000,
  "input_budget": 4500,
  "output_budget": 1500
}
```

This prevents one step from consuming the entire workflow budget.

---

# 29. Token Consumption Evaluation

Your golden dataset can measure:

```text
Expected Quality
Expected Token Budget
Expected Latency
Expected Cost
```

Example:

```json
{
  "test_id": "TC-SHIP-001",

  "expected": {
    "business_outcome": "carrier_capacity",
    "max_tokens": 12000,
    "max_latency_ms": 5000
  },

  "actual": {
    "business_outcome": "carrier_capacity",
    "total_tokens": 8500,
    "latency_ms": 4200
  },

  "evaluation": {
    "quality": "PASS",
    "token_budget": "PASS",
    "latency": "PASS"
  }
}
```

---

# 30. Token Consumption Metrics

A production dashboard should include:

| Metric                     | Purpose                  |
| -------------------------- | ------------------------ |
| Input tokens               | Context consumption      |
| Output tokens              | Generation consumption   |
| Total tokens               | Overall model usage      |
| Tokens/request             | Average consumption      |
| Tokens/workflow            | Multi-agent efficiency   |
| Tokens/task                | Task efficiency          |
| Tokens/agent               | Agent efficiency         |
| Tokens/step                | Step bottlenecks         |
| Tokens/successful workflow | Business efficiency      |
| Cost/workflow              | Financial efficiency     |
| Context size               | Context management       |
| RAG tokens                 | Retrieval efficiency     |
| Tool-result tokens         | Tool efficiency          |
| Retry tokens               | Failure overhead         |
| P50/P95/P99 tokens         | Consumption distribution |

---

# 31. Token Regression

Suppose version 1:

```text
Average = 8,000 tokens
Accuracy = 92%
```

Version 2:

```text
Average = 15,000 tokens
Accuracy = 93%
```

You should ask:

> Is the 1% accuracy improvement worth almost doubling token consumption?

This is why token usage belongs in **agent/workflow evaluation and regression testing**.

---

# 32. Token Consumption and Prompt Registry

Because you already have a Prompt Registry in CWD, prompt versions should be connected to token metrics.

```text
Prompt v1
   ↓
8K tokens
92% accuracy

Prompt v2
   ↓
11K tokens
94% accuracy

Prompt v3
   ↓
18K tokens
94.2% accuracy
```

This allows you to determine whether prompt changes improve the system efficiently.

---

# 33. Token Consumption and Model Selection

Suppose:

```text
Model A
→ 10K tokens
→ quality 92%

Model B
→ 10K tokens
→ quality 95%
```

Or:

```text
Model A
→ 8K tokens
→ quality 94%

Model B
→ 15K tokens
→ quality 95%
```

Model selection should consider:

```text
Quality
+
Latency
+
Token consumption
+
Cost
+
Reliability
+
Safety
```

—not token count alone.

---

# 34. Token Optimization Architecture

A good CWD pattern is:

```text
                    USER REQUEST
                         │
                         ▼
                    COORDINATOR
                         │
                ┌────────┴────────┐
                │ Context Policy  │
                └────────┬────────┘
                         ▼
                Relevant Context
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
      Memory            RAG              Tasks
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                 Context Selection
                         │
                         ▼
                  Token Budget
                         │
                         ▼
                       LLM
```

The **Context Policy + Context Selection + Token Budget** layers prevent uncontrolled context growth.

---

# 35. Token Consumption Lifecycle

```text
User Request
     ↓
Context Collection
     ↓
Memory Retrieval
     ↓
RAG Retrieval
     ↓
Tool Results
     ↓
Context Filtering
     ↓
Deduplication
     ↓
Context Compression
     ↓
Token Budget Check
     ↓
LLM Invocation
     ↓
Capture Input/Output Tokens
     ↓
Calculate Cost
     ↓
Evaluate Quality/Latency/Cost
     ↓
Monitor / Optimize
```

---

# 36. Key Anti-Patterns

### ❌ Send entire conversation every time

```text
50 turns → LLM
```

### ❌ Send every memory

```text
10,000 memories → LLM
```

### ❌ Send every RAG chunk

```text
Top 100 chunks → LLM
```

### ❌ Send raw tool responses

```text
10 MB API response → LLM
```

### ❌ Duplicate context across agents

```text
Coordinator context
   ↓ full copy
Delegator
   ↓ full copy
Worker
```

### ❌ Ignore retry token consumption

```text
Failed LLM call
 ↓
Retry
 ↓
Retry
 ↓
Retry
```

Every call can consume tokens.

---

# 37. Better CWD Pattern

```text
             Full Available Information
                       │
                       ▼
                Authorization
                       │
                       ▼
                 Task Relevance
                       │
                       ▼
                  Validation
                       │
                       ▼
                 Deduplication
                       │
                       ▼
                  Ranking
                       │
                       ▼
                 Compression
                       │
                       ▼
                 Token Budget
                       │
                       ▼
                    LLM
```

The LLM should receive:

> **the smallest sufficient, authorized, relevant context needed to perform the task.**

---

# 38. Token Usage vs Accuracy vs Latency vs Cost

These four dimensions should be evaluated together:

```text
                 Agent Evaluation
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
    Quality          Latency           Cost
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                 Token Usage
```

A good production agent aims for:

```text
High Quality
+
Low/Controlled Latency
+
Low/Controlled Cost
+
Efficient Token Usage
```

subject to mandatory security and safety requirements.

---

# 39. Enterprise Token-Usage Formula

### Per LLM call

$$
T_{call}=T_{input}+T_{output}
$$

### Per agent

$$
T_{agent}=\sum_{calls}T_{call}
$$

### Per task

$$
T_{task}=\sum_{agent\ calls}T_{call}
$$

### Per workflow

$$
T_{workflow}=\sum_{all\ LLM\ calls}T_{call}
$$

### Cost

$$
Cost_{workflow}
=
\sum_i
(InputTokens_i \times InputPrice_i
+
OutputTokens_i \times OutputPrice_i)
$$

---

# 40. Final Definition

> **Token-usage consumption in CWD is the systematic measurement and governance of the input and output tokens consumed by LLM invocations across Coordinator, Delegator, and Worker agents. It includes tokens contributed by prompts, user messages, conversation context, short-term and persistent memory, RAG evidence, tool/MCP results, intermediate agent outputs, and generated responses. CWD measures token usage at call, step, agent, task, run, and workflow levels, correlates it with latency, accuracy, reliability, and cost, and controls consumption through relevance filtering, authorization, deduplication, context compression, selective context propagation, token budgets, and model/prompt optimization.**

### Interview-ready answer

> **“In CWD, token usage is measured at the LLM-call, step, agent, task, and workflow levels. We separately capture input and output tokens and correlate them with prompt version, model version, RAG context, memory, tool results, latency, cost, and business outcome. We control consumption by propagating only task-relevant authorized context, filtering and deduplicating RAG results, summarizing long conversations, bounding tool outputs, and enforcing token budgets. We then evaluate tokens per successful workflow alongside accuracy, latency, reliability, and cost. The goal is not minimum tokens, but minimum sufficient context that achieves the required business quality safely and efficiently.”**
