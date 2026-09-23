### Interview answer

> **I would not remove the Coordinator–Delegator–Worker pattern because that separation is valuable for enterprise scale. Instead, I would remove unnecessary complexity around it.**
>
> **First, I would remove synchronous orchestration where it isn't required.** Independent Workers such as Salesforce and ServiceNow should execute asynchronously rather than forcing the Coordinator to wait on every operation.
>
> **Second, I would remove duplicated business logic from the Coordinator and Delegators.** The Coordinator should plan and route; Delegators should select and coordinate Workers; Workers should execute. Validation, authorization, and business logic shouldn't be repeated across multiple layers.
>
> **Third, I would remove direct dependencies between Workers.** Workers should communicate through workflow state or events rather than calling each other directly. This keeps them independently deployable and testable.
>
> **Fourth, I would remove unnecessary LLM involvement.** I wouldn't use an LLM for deterministic tasks such as routing based on explicit rules, parameter validation, authorization, retries, or aggregation. Those should use deterministic code or policy engines.
>
> **Finally, I would remove redundant state and observability systems.** If multiple components independently maintain workflow state or duplicate traces, that creates inconsistency and operational complexity. I would establish clear ownership for durable state and end-to-end tracing.

### What I would keep vs remove

| CWD component                 | Decision                                                      | Reason                                           |
| ----------------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| Coordinator                   | **Keep, simplify**                                            | Enterprise-level planning/routing                |
| Delegators                    | **Keep**                                                      | Domain-level coordination                        |
| Workers                       | **Keep**                                                      | Isolated business capabilities                   |
| MCP                           | **Keep**                                                      | Standardized tool access                         |
| A2A                           | **Keep where agents truly need agent-to-agent communication** | Avoid unnecessary agent coupling                 |
| LangGraph                     | **Keep**                                                      | Stateful workflow/orchestration                  |
| LLM everywhere                | **Remove unnecessary usage**                                  | Deterministic logic is cheaper and more reliable |
| Synchronous calls everywhere  | **Remove**                                                    | Introduce async execution where appropriate      |
| Worker-to-Worker direct calls | **Remove**                                                    | Creates tight coupling                           |
| Duplicate state stores        | **Remove**                                                    | Establish one clear source of workflow truth     |
| Duplicate validation          | **Remove**                                                    | Centralize common validation/policy              |
| Excessive agent layers        | **Remove where unnecessary**                                  | Avoid agent proliferation                        |

### Strongest interview response

> **“I would remove complexity, not capability. Specifically, I would remove unnecessary synchronous orchestration, direct Worker-to-Worker dependencies, duplicated validation and state management, and unnecessary LLM calls. I would keep the Coordinator, Delegator, Worker, MCP, and LangGraph concepts because they provide useful separation of concerns. My goal would be a thinner Coordinator, autonomous Workers, deterministic controls wherever possible, and event-driven execution for long-running work.”**
