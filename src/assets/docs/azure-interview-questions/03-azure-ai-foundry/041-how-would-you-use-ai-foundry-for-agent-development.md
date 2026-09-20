# How would you use AI Foundry for agent development?

## Short answer
Use Foundry for model access, tracing and evaluation, and keep orchestration in LangGraph for control.

## Key points
- Prototype prompts and tools in the playground.
- LangGraph agents call models through Foundry-managed deployments.
- Tools exposed through MCP.
- Managed Agent Service is an option for simpler agents.

## CWD context
Owning the orchestration keeps portability and fine-grained control.
