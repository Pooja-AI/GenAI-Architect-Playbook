# LangGraph Production Deployment

## Overview
Deploying a LangGraph application to production on AWS involves choosing an appropriate compute platform, wiring up durable checkpointing, integrating with Bedrock for model invocation, and layering in the observability and security practices expected of any production system.

## Compute Platform Choice
See lambda-vs-eks.md for the general framework; for LangGraph specifically:
- **Lambda**: suitable for graphs with bounded execution time (within Lambda's timeout limits) and no need for long-lived in-process state between invocations — each invocation loads relevant state from the checkpoint store, executes to the next pause/completion point, and returns
- **ECS/EKS**: better suited for long-running graph executions, graphs requiring persistent connections (e.g., streaming responses over an extended session), or high-throughput scenarios where container-based scaling and resource control are preferable to Lambda's per-invocation model
- **LangGraph Platform/Cloud** (if using LangChain's managed deployment offering): provides managed hosting specifically built for LangGraph applications, handling scaling and checkpointing infrastructure

## Checkpoint Store Selection
For production durability, use a persistent checkpoint backend rather than in-memory storage:
- **DynamoDB**: a common choice for its serverless scaling and low-latency key-value access pattern, well-suited to checkpoint storage keyed by thread/task ID
- **Aurora/RDS**: appropriate if you need relational queries over checkpoint history or want to co-locate checkpoint data with other relational application data

## Integrating with Bedrock
LangGraph nodes wrapping LLM calls should use Bedrock's Converse API (directly or via LangChain's Bedrock integration), with the retry/backoff and fallback patterns described in bedrock-retries-throttling.md and bedrock-model-fallback.md applied within the node implementation, so transient Bedrock issues don't cause spurious node-level failures in the graph.

## Security Considerations
- Apply IAM least-privilege roles to the compute environment (Lambda execution role or ECS task role) invoking Bedrock and accessing the checkpoint store
- Ensure checkpoint data (which may contain sensitive conversation content or intermediate reasoning) is encrypted at rest and access-controlled appropriately, consistent with the broader data security practices described in genai-security.md
- Apply Bedrock Guardrails within relevant nodes, particularly any node producing user-facing output

## Observability Integration
- Instrument each node with CloudWatch/X-Ray tracing tags including the thread/task ID, enabling correlation between LangGraph's own execution history and broader AWS observability tooling (see multi-agent-observability.md and agent-tracing.md)
- Log node-level inputs/outputs and routing decisions, not just the final graph result, to support the debugging practices enabled by checkpointing

## Scaling Considerations
- For Lambda deployments, ensure adequate reserved concurrency for predictable-load graph endpoints, and account for the added latency of checkpoint read/write on every node transition
- For high-volume production graphs, benchmark checkpoint store read/write latency under load, since this becomes a per-step overhead that compounds across a graph with many nodes

## CI/CD for Graph Definitions
Treat graph definitions (node logic, edge/routing logic, state schemas) as versioned application code subject to the same testing and deployment discipline as any other production system — including the regression testing practices described in llm-regression-testing.md, applied to both individual node behavior and full end-to-end graph execution paths.

## Summary
Production LangGraph deployment requires selecting an appropriate compute platform matched to execution duration and throughput needs, a durable checkpoint backend, careful Bedrock integration with resilience patterns, and the same security, observability, and CI/CD discipline expected of any production AWS system.
