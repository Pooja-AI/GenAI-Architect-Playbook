# Supervisor-Worker Pattern

## Overview
The supervisor-worker (also called orchestrator-worker or manager-worker) pattern is the most common multi-agent architecture: a central supervisor agent receives the overall task, decomposes it into sub-tasks, delegates each sub-task to specialized worker agents, and synthesizes their results into a final response.

## Architecture
```
                     User Request
                          ↓
                  Supervisor Agent
              (plans, delegates, synthesizes)
                 /       |        \
        Worker A     Worker B    Worker C
       (research)    (analysis) (writing)
                 \       |        /
                  Supervisor Agent
                  (aggregates results)
                          ↓
                    Final Response
```

## Supervisor Responsibilities
- Interpret the overall goal and decompose it into well-defined sub-tasks
- Select which worker agent(s) should handle each sub-task
- Pass appropriate, scoped context to each worker (not the entire conversation history — just what's relevant to that worker's job)
- Monitor worker progress and handle failures (retry, reassign, or escalate)
- Synthesize individual worker outputs into a coherent final result
- Decide when the overall task is complete versus requiring further delegation rounds

## Worker Responsibilities
- Execute a narrowly scoped sub-task using its specialized tools/prompt/model
- Return a well-structured result to the supervisor (not necessarily a free-form response — structured output makes supervisor synthesis more reliable)
- Report failures or blockers clearly rather than silently producing a low-confidence result

## Advantages
- **Simplicity of coordination**: a single point of control (the supervisor) makes the overall flow easier to reason about and debug than fully decentralized coordination
- **Clear accountability**: it's straightforward to trace which agent was responsible for which part of a result
- **Easy to extend**: adding a new worker capability typically just means adding a new specialized agent and updating the supervisor's delegation logic

## Disadvantages
- **Supervisor bottleneck**: all coordination flows through one agent, which can become a single point of failure or a latency bottleneck for complex tasks
- **Supervisor complexity growth**: as the number of worker types grows, the supervisor's delegation logic (deciding which worker to use, when) becomes increasingly complex
- **Limited worker autonomy**: workers typically can't communicate directly with each other, which can be inefficient for tasks requiring tight worker-to-worker collaboration

## Implementation Considerations
- Give the supervisor a clear, structured way to invoke workers — often modeled as the supervisor treating each worker as a "tool" it can call, using standard function-calling patterns
- Define explicit worker output schemas so the supervisor can reliably parse and synthesize results
- Set delegation guardrails so the supervisor can't delegate outside a worker's intended scope
- Implement failure handling at the supervisor level — if a worker fails or times out, the supervisor should have a defined fallback (retry, reassign to a different worker, or escalate)

## When This Pattern Fits Best
- Tasks with a natural top-down decomposition (a clear "manager" role makes sense)
- Systems where centralized oversight, auditability, and clear accountability matter (common in regulated or enterprise settings)
- Moderate numbers of distinct worker roles (beyond a certain complexity, consider whether a more decentralized or hierarchical multi-level supervisor structure is warranted)

## Summary
Supervisor-worker is the default, most widely applicable multi-agent pattern due to its coordination simplicity and clear accountability. It trades off some efficiency and worker autonomy for a much easier-to-build, debug, and govern architecture compared to fully decentralized alternatives.
