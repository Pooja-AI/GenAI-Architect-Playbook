### How do you evaluate agent trajectories?

An **agent trajectory** is the complete sequence of decisions and actions:

```text
User Request
 → Plan
 → Agent selection
 → Tool calls
 → Observations
 → Next decisions
 → Final answer
```

I evaluate both **the final outcome and the path taken**.

* **Task success** → Did the agent achieve the goal?
* **Tool selection accuracy** → Did it choose the correct tools?
* **Routing accuracy** → Correct Delegator/Worker?
* **Step efficiency** → Unnecessary steps or tool calls?
* **Correctness** → Were decisions supported by trusted data?
* **Safety** → Any unauthorized or risky actions?
* **Policy compliance** → Did it stay within boundaries?
* **Latency & cost** → Tokens, LLM calls, execution time.
* **Failure recovery** → Did it retry/recover correctly?

For production, I would capture each step with **trace IDs** using tools such as Langfuse/App Insights and evaluate trajectories against expected workflows or an evaluation dataset.

**Interview answer:**

> “I evaluate agent trajectories by capturing the complete execution trace and measuring both outcome and behavior. I look at task success, routing and tool-selection accuracy, unnecessary steps, policy compliance, safety, latency, token cost, and failure recovery. For important workflows, we compare the trajectory against expected or golden trajectories and use the results for regression testing before deploying new agent, prompt, or model versions.”
