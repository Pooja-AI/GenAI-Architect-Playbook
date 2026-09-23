### Interview answer

> **If I were redesigning CWD, I would add the capabilities needed to make it production-grade at enterprise scale: stronger resilience, centralized governance, better observability, continuous evaluation, and cost-aware model routing.**
>
> **First, I would add a durable workflow engine and event-driven execution.** This would allow long-running Workers to execute asynchronously and resume from checkpoints instead of restarting the entire workflow.
>
> **Second, I would add a centralized AI policy and guardrail layer.** Every request and tool call would be checked for identity, authorization, data classification, PII/DLP, allowed tools, and high-risk actions before execution.
>
> **Third, I would add an enterprise agent gateway.** Instead of every Worker independently implementing security, throttling, auditing, and tool access, the gateway would provide common controls around MCP/A2A communication.
>
> **Fourth, I would add end-to-end observability.** I would trace:
>
> `User → Coordinator → Delegator → Worker → MCP → Enterprise System`
>
> using correlation IDs and capture latency, failures, token usage, cost, tool success rate, retrieval quality, and model behavior.
>
> **Fifth, I would add an LLM evaluation platform integrated with CI/CD.** Prompts, models, RAG changes, and agent workflows would be evaluated against golden datasets before production deployment.
>
> **Sixth, I would add intelligent model routing.** Simple classification or extraction could use a smaller model, while complex reasoning could use a more capable model. Routing would consider quality, latency, and cost.
>
> **Finally, I would add stronger recovery mechanisms:** idempotency keys, circuit breakers, exponential backoff, DLQs, replay, compensation actions, and human approval for high-risk operations.

### What I would add

```text
                    User
                      |
                      v
             +----------------+
             | API / Identity |
             +----------------+
                      |
                      v
             +----------------+
             | Policy &       |
             | Guardrails     |
             +----------------+
                      |
                      v
             +----------------+
             |  Coordinator   |
             +----------------+
                      |
          +-----------+-----------+
          |                       |
          v                       v
   Sales Delegator          IT Delegator
          |                       |
      Workers                  Workers
          |                       |
          +-----------+-----------+
                      |
                      v
                MCP Gateway
                      |
              Enterprise APIs
```

And around the whole architecture:

```text
+-------------------------------------------------------------+
| Observability | Evaluation | Security | Cost Management    |
|               |            |           |                   |
| Tracing       | Golden     | RBAC      | Token tracking    |
| Metrics       | datasets   | DLP       | Model routing    |
| Logs          | LLM eval   | Policies  | Budgets          |
+-------------------------------------------------------------+

        Durable State + Event Bus + DLQ + Replay
```

### The 7 additions I'd emphasize in an interview

| Add                              | Why                                                 |
| -------------------------------- | --------------------------------------------------- |
| **Durable workflow/state**       | Resume failed workflows                             |
| **Event bus/queues**             | Decouple long-running operations                    |
| **Policy & guardrail layer**     | Centralized security/governance                     |
| **MCP/Agent Gateway**            | Standardize tool/agent access                       |
| **End-to-end observability**     | Troubleshoot production agents                      |
| **LLM evaluation + CI/CD gates** | Prevent bad prompts/models from reaching production |
| **Cost-aware model routing**     | Control latency and LLM cost                        |

### One-line answer to memorize

> **“I would add durable event-driven orchestration, centralized policy and guardrails, an MCP/agent gateway, end-to-end LLM observability, continuous evaluation gates, intelligent model routing, and stronger recovery mechanisms such as idempotency, circuit breakers, DLQs, replay, and HITL.”**
