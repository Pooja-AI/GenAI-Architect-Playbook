## How do you test individual graph nodes?

I test each LangGraph node **independently**, by giving it a controlled input state and verifying the returned state update. I don't need to run the entire CWD workflow to test one node.

### 1. Example CWD node

Suppose I have a Coordinator node:

```python
def coordinator_node(state):
    return {
        "intent": "customer_briefing",
        "customer_id": "C12345",
        "delegators": ["sales", "it"]
    }
```

I can test it directly.

```python
def test_coordinator_node():
    state = {
        "user_request": "Give me a briefing for customer C12345"
    }

    result = coordinator_node(state)

    assert result["intent"] == "customer_briefing"
    assert result["customer_id"] == "C12345"
    assert "sales" in result["delegators"]
    assert "it" in result["delegators"]
```

Here I'm testing **only the Coordinator node**, not the entire graph.

---

## 2. Test different input scenarios

For each node, I test:

### Happy path

```text
Valid request
     ↓
Coordinator
     ↓
Correct intent + customer_id
```

### Invalid input

```text
Missing customer_id
     ↓
Coordinator
     ↓
Validation error
```

### Unexpected input

```text
Unknown intent
     ↓
Coordinator
     ↓
Fallback / error route
```

### Edge cases

For example:

```text
customer_id = None
customer_id = ""
customer_id = invalid format
very long request
unsupported intent
```

---

## 3. Test Delegator nodes

Suppose Sales Delegator receives:

```python
state = {
    "intent": "customer_briefing",
    "customer_id": "C12345"
}
```

I mock the Worker instead of calling Salesforce.

```python
def test_sales_delegator():
    state = {
        "intent": "customer_briefing",
        "customer_id": "C12345"
    }

    result = sales_delegator_node(state)

    assert result["status"] == "completed"
```

The important point is:

> **Unit tests should not depend on real Salesforce, ServiceNow, Azure OpenAI, or MCP servers.**

Those are tested separately through integration tests.

---

## 4. Mock external dependencies

For example:

```python
def sales_delegator_node(state, sales_worker):
    result = sales_worker.get_customer(
        state["customer_id"]
    )

    return {
        "worker_results": [result]
    }
```

Test:

```python
def test_sales_delegator():

    mock_worker = Mock()

    mock_worker.get_customer.return_value = {
        "customer_name": "ABC Corp",
        "revenue": 10000000
    }

    state = {
        "customer_id": "C12345"
    }

    result = sales_delegator_node(
        state,
        mock_worker
    )

    assert result["worker_results"][0]["customer_name"] == "ABC Corp"

    mock_worker.get_customer.assert_called_once_with(
        "C12345"
    )
```

Now the test doesn't need Salesforce.

---

## 5. Test conditional routing separately

For example:

```python
def route_delegators(state):

    if state["intent"] == "customer_briefing":
        return ["sales", "it"]

    if state["intent"] == "incident":
        return ["it"]

    return ["error"]
```

Test:

```python
def test_customer_briefing_routing():

    state = {
        "intent": "customer_briefing"
    }

    result = route_delegators(state)

    assert result == ["sales", "it"]
```

And:

```python
def test_incident_routing():

    state = {
        "intent": "incident"
    }

    result = route_delegators(state)

    assert result == ["it"]
```

This isolates routing bugs from node execution bugs.

---

## 6. Test failure handling

Suppose the Worker fails.

```python
def test_worker_failure():

    mock_worker = Mock()

    mock_worker.get_customer.side_effect = TimeoutError()

    state = {
        "customer_id": "C12345"
    }

    result = sales_delegator_node(
        state,
        mock_worker
    )

    assert result["status"] == "failed"
```

I would test:

* timeout
* 429
* 500
* invalid response
* authorization failure
* MCP unavailable
* malformed tool response

---

## 7. Test reducers and parallel results

For CWD:

```text
Coordinator
   ├── Sales Delegator → result A
   └── IT Delegator    → result B
                         ↓
                       reducer
                         ↓
                    worker_results
```

I verify that both results are preserved:

```python
assert len(state["worker_results"]) == 2
```

I specifically check that the Sales result isn't overwritten by the IT result.

---

## 8. Test aggregation separately

Suppose:

```python
def aggregate_node(state):

    return {
        "final_response": {
            "customer": state["worker_results"][0],
            "incidents": state["worker_results"][1]
        }
    }
```

Test it with fixed results:

```python
def test_aggregate_node():

    state = {
        "worker_results": [
            {"customer_name": "ABC Corp"},
            {"open_incidents": 3}
        ]
    }

    result = aggregate_node(state)

    assert result["final_response"]["customer"]["customer_name"] == "ABC Corp"
    assert result["final_response"]["incidents"]["open_incidents"] == 3
```

Again, no real APIs are required.

---

## 9. What I test at each node

| Test area           | Example                       |
| ------------------- | ----------------------------- |
| Input validation    | Is `customer_id` present?     |
| Business logic      | Correct intent?               |
| State update        | Correct fields returned?      |
| Routing             | Correct Delegator selected?   |
| Error handling      | Timeout handled?              |
| External dependency | Mock MCP/Worker               |
| Output schema       | Correct structure?            |
| Edge cases          | Missing/invalid data          |
| Security            | Unauthorized request rejected |
| Performance         | Node latency within limit     |

---

## 10. Unit test vs integration test

This distinction is important in interviews.

```text
Unit Test
Coordinator Node
    ↓
Mock Delegator


Integration Test
Coordinator
    ↓
Real/controlled Delegator
    ↓
Real MCP Server
    ↓
Test Salesforce/ServiceNow environment


End-to-End Test
User
 ↓
Coordinator
 ↓
Delegators
 ↓
Workers
 ↓
MCP
 ↓
Enterprise systems
```

I use **unit tests for individual nodes**, integration tests for component boundaries, and end-to-end tests for the complete CWD workflow.

### Interview-ready answer

> **“I test LangGraph nodes independently by passing a controlled state into the node and validating the state update it returns. I cover happy paths, invalid inputs, edge cases, routing decisions, failures, and output schemas. For external dependencies such as MCP, Salesforce, ServiceNow, or LLMs, I mock them during unit testing so the test is deterministic. I separately test conditional routing, reducers, aggregation, and failure handling. Then I use integration tests to validate actual node-to-node and MCP interactions, and end-to-end tests for the complete CWD workflow.”**

### Easy memory

**Node testing = Controlled State → Execute Node → Assert State Update → Mock External Calls → Test Errors & Edge Cases.**
