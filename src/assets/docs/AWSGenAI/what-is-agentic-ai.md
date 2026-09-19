# What Is Agentic AI?

## Overview
Agentic AI refers to systems where an LLM doesn't just generate a single response, but autonomously plans, takes actions (via tools), observes results, and iterates toward a goal — with limited or no human intervention at each step. Instead of "one prompt in, one answer out," an agent operates in a loop: reason, act, observe, repeat.

## Key Characteristics of an Agent
1. **Goal-directed**: given a high-level objective, not a single fixed instruction
2. **Tool use**: can call external functions/APIs (search, code execution, database queries, other services) to gather information or take action
3. **Multi-step reasoning**: breaks a complex task into a sequence of smaller steps
4. **Autonomy**: decides *which* actions to take and in *what order*, rather than following a fixed predetermined script
5. **Adaptivity**: can adjust its plan based on the results of previous actions (e.g., retry with a different approach if a tool call fails)

## The Basic Agent Loop
```
1. Receive goal/task
2. Reason about what to do next (the model decides)
3. Select and invoke a tool (or produce a final answer)
4. Observe the tool's result
5. Update internal reasoning with the new information
6. Repeat from step 2 until the goal is achieved or a stopping condition is met
```
This is often called the ReAct pattern (Reason + Act), though many variations exist (see ai-reasoning-loop.md).

## Agentic AI vs. Simple LLM Calls
| | Simple LLM Call | Agentic AI |
|---|---|---|
| Interaction | Single request/response | Multi-step loop |
| Tool use | None or single fixed call | Dynamic, model-chosen tool calls |
| Planning | None (or done externally) | Model plans and adapts |
| Use case fit | Straightforward Q&A, summarization | Complex multi-step tasks, research, automation |

## Agentic AI vs. RAG
RAG augments a *single* generation step with retrieved context. Agentic AI can *include* RAG as one of its available tools, but goes further by allowing the model to decide when and how many times to retrieve, what other actions to take, and how to synthesize multiple steps into a final result. Agentic systems are strictly more capable but also more complex, slower, and more expensive than a single RAG call.

## Common Applications
- Research assistants that search, read, and synthesize across many sources
- Customer support agents that look up account data, check policies, and take corrective actions (e.g., issue a refund) within defined guardrails
- Code assistants that write, run, test, and iteratively fix code
- Business process automation (e.g., processing an invoice: extract data, validate against a PO, route for approval)

## Why Agentic AI Requires More Engineering Discipline
Because agents take multiple autonomous steps, small errors can compound, and unconstrained agents can loop indefinitely, take unintended actions, or run up significant cost. Production agentic systems require explicit guardrails, human-in-the-loop checkpoints for high-stakes actions, loop-prevention mechanisms, and strong observability (see agent-guardrails.md, preventing-agent-loops.md, human-in-the-loop.md).

## Building Blocks Covered in This Knowledge Base
- The reasoning loop pattern (ai-reasoning-loop.md)
- Planning strategies (autonomous-planning.md)
- Tool integration (function-calling-tool-use.md, structured-tool-inputs.md)
- Safety mechanisms (agent-guardrails.md, human-in-the-loop.md, preventing-agent-loops.md)
- State and memory management (agent-state.md, agent-memory.md)
- Recovering from failure (agent-failure-recovery.md)
- Scaling to multiple cooperating agents (see the Multi-Agent Systems section)

## Summary
Agentic AI extends LLMs from single-turn generators into autonomous, tool-using problem solvers capable of multi-step tasks. This power comes with added engineering responsibility around safety, cost control, and reliability that simple RAG or chat applications don't require to the same degree.
