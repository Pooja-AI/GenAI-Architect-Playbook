For your **CWD Coordinator**, I would create LangGraph nodes around the **business orchestration lifecycle**. The Coordinator should understand the request, validate it, create the execution plan, route to the Delegator, and finally validate/aggregate the results.

### Recommended Coordinator graph

```text
START
  │
  ▼
receive_request
  │
  ▼
classify_intent
  │
  ▼
extract_entities
  │
  ▼
validate_intent
  │
  ├── ambiguous ──► clarification
  │
  ▼
check_authorization
  │
  ▼
select_delegator
  │
  ▼
validate_delegator
  │
  ├── invalid ──► routing_failure
  │
  ▼
create_execution_plan
  │
  ▼
dispatch_to_delegator
  │
  ▼
wait_for_results
  │
  ▼
validate_results
  │
  ▼
aggregate_results
  │
  ▼
generate_final_response
  │
  ▼
END
```

## What each node does

| Node                      | Responsibility                                         |
| ------------------------- | ------------------------------------------------------ |
| `receive_request`         | Accept user request and initialize `request_id/run_id` |
| `classify_intent`         | LLM identifies business intent                         |
| `extract_entities`        | Extract `customer_id`, incident ID, etc.               |
| `validate_intent`         | Verify intent is supported                             |
| `clarification`           | Ask user for missing/ambiguous information             |
| `check_authorization`     | Validate user access                                   |
| `select_delegator`        | Map intent/capabilities to candidate Delegator         |
| `validate_delegator`      | Registry + policy + capability + health validation     |
| `create_execution_plan`   | Build the validated workflow                           |
| `dispatch_to_delegator`   | Send plan/request to appropriate Delegator             |
| `wait_for_results`        | Wait for synchronous/asynchronous execution            |
| `validate_results`        | Check Worker results, schema, completeness, errors     |
| `aggregate_results`       | Combine results from Delegator/Workers                 |
| `generate_final_response` | Convert validated results into business response       |

### Important: don't make every node an LLM node

For example:

```text
LLM-based:
    classify_intent
    extract_entities
    possibly create_execution_plan
    generate_final_response

Deterministic:
    validate_intent
    check_authorization
    validate_delegator
    policy validation
    result/schema validation
    aggregation rules
```

This follows your CWD principle:

> **LLM provides intelligence; deterministic logic provides control.**

---

# Example with Customer Briefing

User:

> "Prepare a customer briefing for C123 with CRM information and recent support issues."

### Step 1 — `classify_intent`

```json
{
  "intent": "CustomerBriefing"
}
```

### Step 2 — `extract_entities`

```json
{
  "customer_id": "C123"
}
```

### Step 3 — `validate_intent`

```text
CustomerBriefing
      ↓
Intent Registry
      ↓
SUPPORTED ✓
```

### Step 4 — `check_authorization`

```text
User
 ↓
Entra ID
 ↓
Authorization Policy
 ↓
customer.read
 ↓
ALLOWED ✓
```

### Step 5 — `select_delegator`

```text
CustomerBriefing
       ↓
Delegator Registry
       ↓
SalesDelegator
```

### Step 6 — `validate_delegator`

Check:

```text
SalesDelegator registered?       ✓
Supports CustomerBriefing?      ✓
Supports required capabilities? ✓
User authorized?                ✓
Healthy?                        ✓
Policy allows routing?          ✓
```

### Step 7 — `create_execution_plan`

The Coordinator creates something like:

```python
execution_plan = {
    "intent": "CustomerBriefing",
    "customer_id": "C123",
    "delegator": "SalesDelegator",

    "workers": [
        {
            "name": "CustomerProfileWorker",
            "mandatory": True
        },
        {
            "name": "SupportHistoryWorker",
            "mandatory": False
        }
    ]
}
```

### Step 8 — `dispatch_to_delegator`

Now the **Delegator layer is invoked**:

```text
Coordinator
      ↓
SalesDelegator
      ↓
 ┌────┴─────────┐
 ↓              ↓
Customer      Support
Profile       History
Worker        Worker
 ↓              ↓
Salesforce    ServiceNow
```

The Delegator—not the Coordinator—determines the detailed Worker execution.

---

# Where failure handling fits

You don't necessarily need a separate Coordinator node for every failure.

LangGraph conditional edges can handle it:

```text
validate_delegator
       │
       ├── valid ───────► create_plan
       │
       └── invalid ────► routing_failure
```

And:

```text
validate_results
       │
       ├── complete ───────► aggregate_results
       │
       ├── partial ────────► aggregate_partial_results
       │
       └── invalid ────────► recovery
```

For Worker failures, the **Delegator handles Worker-level retry/recovery**, while the Coordinator handles the overall workflow outcome.

---

# How I would implement the graph

Conceptually:

```python
workflow = StateGraph(CoordinatorState)

workflow.add_node("receive_request", receive_request)
workflow.add_node("classify_intent", classify_intent)
workflow.add_node("extract_entities", extract_entities)
workflow.add_node("validate_intent", validate_intent)
workflow.add_node("check_authorization", check_authorization)
workflow.add_node("select_delegator", select_delegator)
workflow.add_node("validate_delegator", validate_delegator)
workflow.add_node("create_execution_plan", create_execution_plan)
workflow.add_node("dispatch_to_delegator", dispatch_to_delegator)
workflow.add_node("validate_results", validate_results)
workflow.add_node("aggregate_results", aggregate_results)
workflow.add_node("generate_final_response", generate_final_response)
```

Then conditional routing:

```python
workflow.add_conditional_edges(
    "validate_intent",
    route_after_intent_validation
)

workflow.add_conditional_edges(
    "validate_delegator",
    route_after_delegator_validation
)

workflow.add_conditional_edges(
    "validate_results",
    route_after_result_validation
)
```

And finally:

```text
START
 ↓
receive_request
 ↓
classify_intent
 ↓
extract_entities
 ↓
validate_intent
 ↓
check_authorization
 ↓
select_delegator
 ↓
validate_delegator
 ↓
create_execution_plan
 ↓
dispatch_to_delegator
 ↓
validate_results
 ↓
aggregate_results
 ↓
generate_final_response
 ↓
END
```

### 🎯 Interview answer

> **“For the CWD Coordinator, I would create LangGraph nodes for request intake, intent classification, entity extraction, intent validation, authorization, Delegator selection, Delegator validation, execution-plan creation, Delegator dispatch, result validation, aggregation, and final response generation. I would use conditional edges for clarification, routing failures, partial failures, and recovery. The Coordinator operates at the business orchestration level, while the Delegator manages its Worker-level execution. LangGraph provides the stateful workflow, checkpointing, conditional routing, retries, and resume capability.”**

**One line to memorize:**

> **“Coordinator nodes are: understand → validate → authorize → route → plan → dispatch → validate results → aggregate → respond.”**
