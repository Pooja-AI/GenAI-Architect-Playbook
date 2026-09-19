# Lambda vs. EKS for GenAI Orchestration

## Overview
When orchestrating generative AI workloads on AWS — calling Bedrock, retrieving from a vector store, running multi-step agent logic — teams must choose a compute platform. AWS Lambda and Amazon EKS (Kubernetes) represent two ends of a spectrum from fully managed simplicity to full orchestration control.

## AWS Lambda
**Strengths:**
- Zero infrastructure management — scales automatically from zero to high concurrency
- Pay-per-invocation pricing, ideal for spiky or unpredictable traffic
- Fast to deploy and iterate for simple, stateless request/response patterns
- Native integration with API Gateway, Step Functions, EventBridge, and SQS

**Limitations:**
- Maximum execution timeout (15 minutes) constrains very long-running agentic workflows
- Cold starts can add latency, especially for larger deployment packages or VPC-attached functions
- Limited local compute/memory ceiling compared to a dedicated container
- Harder to manage complex, long-lived state or persistent connections (e.g., WebSocket streaming at scale, though API Gateway WebSocket + Lambda can work for many cases)

## Amazon EKS
**Strengths:**
- Full control over compute resources, networking, and long-running processes
- Well-suited for complex multi-agent systems with long-lived state, persistent connections, or GPU-based custom model hosting
- Mature ecosystem for service mesh, advanced autoscaling, and multi-tenant isolation
- No hard execution time limit — supports long-running agent loops or batch jobs

**Limitations:**
- Significant operational overhead — cluster management, node provisioning, upgrades, security patching
- Slower to provision new capacity for sudden traffic spikes compared to Lambda's near-instant scaling
- Higher baseline cost if traffic is low or highly variable (idle cluster capacity)
- Requires dedicated platform/DevOps expertise to run well

## Decision Framework

| Factor | Favors Lambda | Favors EKS |
|---|---|---|
| Simple request/response RAG or single-agent calls | ✓ | |
| Long-running multi-agent workflows (minutes to hours) | | ✓ |
| Highly variable/spiky traffic | ✓ | |
| Steady, high, predictable traffic | | ✓ |
| Need for persistent connections/streaming at scale | | ✓ |
| Small team, limited DevOps capacity | ✓ | |
| Existing Kubernetes platform investment | | ✓ |
| Custom model hosting requiring GPU control | | ✓ |

## Hybrid Approach
Many production systems use both: Lambda for the API-facing, stateless request layer (auth, validation, simple RAG calls) and EKS (or Step Functions with longer-running tasks) for complex, long-running orchestration like multi-agent workflows or batch embedding pipelines — routing between them based on the complexity/duration of the specific task.

## Step Functions as a Middle Ground
For workflows that need durable, multi-step orchestration without full container management, AWS Step Functions (often combined with Lambda for individual steps) can handle much of what would otherwise require EKS, while remaining serverless — a good option to evaluate before committing to full Kubernetes operational overhead.

## Summary
Lambda is the right default for most GenAI request/response workloads due to its operational simplicity and elastic scaling; EKS becomes justified when workflows are long-running, require persistent state/connections, need custom GPU hosting, or when an organization already has mature Kubernetes operations in place.
