In **CWD**, the **Coordinator validates Worker responses before aggregating and returning the final answer**.

### Simple flow

```text
Worker
  ↓
Returns result
  ↓
Coordinator validates
  ↓
Valid? ── No → Retry / Reject / Flag
  ↓ Yes
Aggregate results
  ↓
Final response
```

### What does the Coordinator validate?

1. **Completeness** – Did the Worker return all required fields?
2. **Correctness** – Does the response match the requested `customer_id` and task?
3. **Grounding** – Is the answer supported by Salesforce/ServiceNow data rather than hallucinated?
4. **Schema** – Does the response follow the expected structured format?
5. **Consistency** – Does it conflict with results from other Workers?

### CWD example

For **Customer Briefing**:

```text
Salesforce Worker → Customer details
ServiceNow Worker → Open incidents
        ↓
Coordinator
        ↓
Validate both results
        ↓
Aggregate
        ↓
Customer Briefing
```

**Interview answer:**

> “The Coordinator validates each Worker response for schema, completeness, correctness, and grounding. If validation passes, it aggregates the results. If validation fails, it can retry the Worker, reject the result, or flag it for further handling.”
