## Your agent keeps calling the same tool repeatedly. How would you fix it?

### 🎯 Strong Interview Answer

> **“I would treat repeated tool calls as an agent-loop problem. First, I would identify whether the loop is caused by poor tool descriptions, missing termination conditions, incorrect state management, or the LLM repeatedly deciding that the tool is necessary. Then I would add explicit loop controls such as maximum tool calls, state-based checks, duplicate-call detection, tool-result validation, and clear stop conditions. If the problem persists, I would improve the agent's prompt and tool schema and add observability to identify the exact cause.”**

---

## 1. First identify why the loop is happening

For example:

```text
Agent
  ↓
Call Search Tool
  ↓
Result
  ↓
LLM
  ↓
Call Search Tool again
  ↓
Result
  ↓
LLM
  ↓
Call Search Tool again
  ↓
...
```

Common causes are:

* Agent doesn't recognize that the task is complete
* Tool description is ambiguous
* Tool result doesn't contain enough information
* Agent state isn't updated
* No maximum iteration limit
* Same tool invocation produces the same result
* Prompt encourages excessive verification
* Tool errors are incorrectly interpreted as incomplete results

---

# 2. Add a maximum iteration limit

I would never allow an autonomous agent to execute indefinitely.

```text
max_iterations = 5
```

For example:

```text
Iteration 1 → Search
Iteration 2 → Search
Iteration 3 → Search
Iteration 4 → Search
Iteration 5 → Search
                   ↓
              STOP / FALLBACK
```

This protects against runaway execution, latency, and token cost.

---

# 3. Detect duplicate tool calls

I can maintain a history of tool invocations.

```text
tool = search_documents
query = "CWD incident procedure"
```

If the agent generates the exact same call again:

```text
search_documents("CWD incident procedure")
        ↓
Already executed
        ↓
Don't execute again
        ↓
Return previous result to agent
```

I can create a hash such as:

```text
hash(tool_name + arguments)
```

and compare it against previous calls.

---

# 4. Validate the tool result

Sometimes the problem isn't the agent.

The tool may be returning something like:

```json
{
  "status": "success",
  "results": []
}
```

The LLM interprets that as:

> "I need to search again."

Instead, I would explicitly classify the result:

```text
SUCCESS_WITH_DATA
SUCCESS_NO_DATA
RETRYABLE_ERROR
PERMANENT_ERROR
```

Then the agent knows what action to take.

---

# 5. Add explicit termination conditions

The agent needs to know **when it is done**.

For example:

```text
IF required_information_found:
       STOP

IF no_more_relevant_results:
       STOP

IF maximum_tool_calls_reached:
       STOP

IF same_tool + same_arguments repeated:
       STOP
```

This is especially important in agentic workflows.

---

# 6. Improve tool descriptions

Bad tool description:

```text
search(query)
Searches documents.
```

Better:

```text
search_documents(query)

Use this tool when enterprise documentation
is required.

Do not call this tool again if the previous
result already contains the requested information.

If the search returns no relevant documents,
do not repeat the same query.
Either reformulate the query once or
return that no information was found.
```

Good tool schemas and descriptions significantly reduce unnecessary calls.

---

# 7. Manage agent state

In a LangGraph-style workflow, I would explicitly track:

```python
state = {
    "tool_calls": [],
    "tool_results": [],
    "iteration": 0,
    "task_complete": False
}
```

Then the routing logic can decide:

```text
                    Agent
                      ↓
              Should continue?
                 /       \
               YES        NO
                ↓          ↓
             Tool       Final Answer
                ↓
             Update State
                ↓
              Agent
```

The important point is that **the state controls the workflow**, rather than allowing the LLM to loop freely.

---

# 8. Use a tool-call budget

For expensive tools, I would maintain a per-request budget.

For example:

```text
Request budget:

Search tool       → max 3 calls
Database tool     → max 2 calls
External API      → max 2 calls
Total tool calls  → max 8
```

If the budget is exceeded:

```text
Tool budget exceeded
        ↓
Stop execution
        ↓
Fallback / partial response
```

This is useful for controlling both **cost and reliability**.

---

# 9. Add observability

I would trace every tool invocation:

```text
Trace ID: CWD-123

Agent: KnowledgeAgent

1. search_documents("CWD procedure")
   → 10 results

2. search_documents("CWD procedure")
   → DUPLICATE

3. search_documents("CWD procedure")
   → BLOCKED
```

With Langfuse/OpenTelemetry, I can identify whether the problem is:

```text
Prompt
  ↓
LLM decision
  ↓
State
  ↓
Tool
  ↓
Tool response
```

---

# 10. Enterprise solution

My production architecture would look like:

```text
                    Agent
                      ↓
              ┌───────────────┐
              │ Guardrails    │
              └───────┬───────┘
                      ↓
              Check tool budget
                      ↓
              Check duplicate call
                      ↓
              Check iteration limit
                      ↓
              Execute tool
                      ↓
              Validate result
                      ↓
              Update state
                      ↓
              ┌───────────────┐
              │ Stop or       │
              │ Continue?     │
              └───────┬───────┘
                    /   \
                  STOP  CONTINUE
                   ↓       ↓
                Answer    Agent
```

---

## ⭐ 30-Second Interview Version

> **“If my agent repeatedly calls the same tool, I would first diagnose whether it's a state, prompt, tool-result, or routing problem. Then I would implement maximum iterations, per-tool call budgets, duplicate-call detection, explicit termination conditions, and tool-result validation. In a LangGraph workflow, I would track tool calls and execution state and use conditional routing to decide whether to continue or terminate. I would also improve the tool description and add Langfuse or OpenTelemetry tracing to identify the root cause. The goal is to make the loop impossible or bounded rather than relying only on the LLM to stop itself.”**

### 🔥 Follow-up they may ask

**“What if the agent needs to call the same tool multiple times with different parameters?”**

Answer:

> **“I wouldn't block the tool itself; I would block duplicate invocations with the same tool name and arguments. Different arguments can be valid. I would combine duplicate detection with a maximum call budget and task-level termination criteria.”**
