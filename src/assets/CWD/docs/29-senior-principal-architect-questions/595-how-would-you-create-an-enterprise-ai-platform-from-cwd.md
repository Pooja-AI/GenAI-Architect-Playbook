### How would you create an enterprise AI platform from CWD?

I would evolve CWD from a **single application into a reusable platform** by separating **common capabilities** from **business-specific agents**.

```text
                Enterprise AI Platform
                       ↓
        ┌──────────────────────────────┐
        │ API + Identity + AI Gateway  │
        ├──────────────────────────────┤
        │ Coordinator / Agent Runtime  │
        ├──────────────────────────────┤
        │ Agent / Model / Prompt       │
        │ Tool Registries              │
        ├──────────────────────────────┤
        │ MCP + A2A                    │
        ├──────────────────────────────┤
        │ RAG / Knowledge Platform     │
        ├──────────────────────────────┤
        │ Guardrails + Evaluation      │
        ├──────────────────────────────┤
        │ Observability + Governance   │
        └──────────────────────────────┘
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     Sales AI       IT AI          HR AI
```

### Key steps

1. **Extract reusable components** from CWD — authentication, orchestration, MCP, RAG, observability, evaluation.
2. **Create platform registries** — Agent, Model, Prompt, Tool.
3. **Build common AI services** — model routing, RAG, guardrails, evaluation, tracing.
4. **Standardize interfaces** — A2A for agents and MCP for tools.
5. **Create golden paths** — templates for new agents, APIs, deployments, monitoring, and CI/CD.
6. **Add governance** — security, RBAC, approvals, audit, data policies.
7. **Keep business logic application-specific** — Sales, IT, HR, Manufacturing, etc.
8. **Provide self-service onboarding** so teams can build and deploy new agents using the platform.

**Interview answer:**

> “I would evolve CWD into an enterprise AI platform by extracting its reusable capabilities—agent orchestration, MCP, RAG, model and prompt management, security, observability, and evaluation—and making them shared platform services. I would standardize A2A and MCP interfaces, provide golden-path templates and centralized governance, while keeping business-specific agents and workflows separate. This allows different teams to build Sales, IT, HR, or manufacturing AI solutions on the same governed platform instead of rebuilding the infrastructure each time.”
