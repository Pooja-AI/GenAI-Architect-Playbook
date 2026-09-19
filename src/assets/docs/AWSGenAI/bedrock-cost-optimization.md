# Bedrock Cost Optimization

## Overview
Generative AI costs scale primarily with token volume (input + output) and model choice, and can grow quickly and unpredictably as usage scales. Cost optimization on Bedrock spans model selection, prompt/context efficiency, caching, and capacity planning.

## Major Cost Drivers
1. **Input tokens** — dominates cost in RAG systems where retrieved context is sent on every request
2. **Output tokens** — typically priced higher per token than input; verbose responses cost more
3. **Model tier** — larger, more capable models cost significantly more per token than smaller ones
4. **Retry/fallback overhead** — failed and retried requests still consume some cost, and fallback to a different model can shift cost profile

## Optimization Techniques

### Right-Size the Model
Use the smallest/cheapest model that meets quality requirements for each specific task; route only genuinely complex requests to premium models (see bedrock-model-selection.md and multi-agent routing patterns).

### Trim Context Aggressively
Improve retrieval precision so fewer, more relevant chunks are needed per RAG request (see rag-retrieval-optimization.md and context-window-optimization.md) — this is often the single largest cost lever in RAG-heavy applications since input context is repeated on every call.

### Prompt Caching
For static or repeated prompt prefixes (system instructions, stable reference documents), use prompt caching where supported to avoid reprocessing the same tokens repeatedly — can substantially reduce cost for high-repeat-prefix workloads.

### Semantic Caching
Cache full responses for semantically similar repeat queries to avoid redundant model invocations entirely (see semantic-caching.md).

### Limit Output Length
Set explicit max-token limits and prompt for concise responses where verbosity isn't needed — output tokens are typically the more expensive half of the cost equation.

### Batch Processing for Non-Real-Time Work
For workloads without strict latency requirements (bulk summarization, classification jobs), batch inference APIs are typically priced lower than on-demand real-time invocation.

### Provisioned Throughput vs. On-Demand
Provisioned Throughput offers a flat-rate pricing model for guaranteed capacity — cost-effective at sustained high volume, but wasteful if utilization is low or bursty. Model the break-even point using your actual expected volume before committing.

## Monitoring and Attribution
- Use CloudWatch and cost allocation tags to break down Bedrock spend by application, team, or feature
- Track cost-per-request and cost-per-successful-outcome (not just raw token spend) to understand true unit economics
- Set budget alerts to catch runaway cost from bugs (e.g., infinite agent loops, retry storms) before they become a large bill

## Common Cost Pitfalls
- Using a large model for simple classification/extraction tasks that a small model handles equally well
- Retrieving far more RAG context than actually improves answer quality
- Uncontrolled agent loops that make many unnecessary tool/model calls (see preventing-agent-loops.md)
- No caching layer for a workload with significant query repetition

## Cost vs. Quality Trade-off Framework
Cost optimization should never be pursued in isolation from quality evaluation — always validate that a cost-reduction change (smaller model, less context, tighter caching threshold) doesn't degrade answer quality below an acceptable bar, using the same evaluation framework used for other quality work (see rag-evaluation.md, llm-evaluation.md).

## Summary
Bedrock cost optimization is primarily about token efficiency — right-sizing models, trimming unnecessary context, and caching aggressively — combined with deliberate capacity planning (Provisioned Throughput vs. on-demand) validated against actual usage patterns and quality requirements.
