# AWS Lambda for GenAI Applications

## Overview
AWS Lambda is the most commonly used compute service for GenAI application orchestration on AWS, providing serverless, auto-scaling execution well suited to the request/response patterns common in RAG applications, API-facing agent endpoints, and individual pipeline processing steps — as introduced in the lambda-vs-eks.md comparison.

## Common Lambda Use Cases in GenAI Architectures
- **RAG request handling**: a Lambda function receiving a user query, performing retrieval, invoking Bedrock, and returning the generated response
- **Individual data pipeline stages**: chunking, embedding invocation, or metadata tagging as discrete Lambda functions within a Step Functions-orchestrated pipeline (see enterprise-data-pipeline.md)
- **Webhook/event handlers**: responding to S3 event notifications (new document uploaded, triggering ingestion) or other event-driven triggers
- **Individual agent nodes**: in a LangGraph or custom agent orchestration architecture, individual graph nodes implemented as Lambda functions, particularly for shorter-running orchestration (see lambda-vs-eks.md and langgraph-production-deployment.md)

## Lambda-Specific Considerations for GenAI Workloads

### Execution Timeout
Lambda's maximum execution timeout (15 minutes) constrains how long-running a single invocation can be — this bounds how extensive an agentic reasoning loop or multi-step RAG pipeline stage can be within a single Lambda invocation, requiring either careful iteration budgeting (see preventing-agent-loops.md) or a different compute pattern (Step Functions for multi-invocation orchestration, or EKS for genuinely long-running tasks) for workflows exceeding this limit.

### Cold Starts
Lambda functions not recently invoked incur cold-start latency on their next invocation, particularly for functions with larger deployment packages or VPC attachment — for latency-sensitive GenAI endpoints, consider provisioned concurrency to keep a baseline of pre-warmed execution environments ready, mitigating cold-start impact for critical, latency-sensitive paths.

### Memory and Timeout Configuration
Configure Lambda memory allocation (which also scales proportional CPU allocation) appropriately for the workload — a function performing significant local computation (e.g., in-process reranking, complex prompt construction logic) benefits from higher memory/CPU allocation, while simple orchestration-only functions calling out to Bedrock and a vector store need less.

### VPC Attachment Trade-offs
Attaching a Lambda function to a VPC (needed for private connectivity to VPC-only resources like an Aurora database or private OpenSearch cluster) can add cold-start latency compared to a non-VPC-attached function, though AWS has significantly improved VPC networking performance for Lambda over time — benchmark this trade-off for your specific latency requirements rather than assuming it's prohibitive by default.

## Concurrency Management
Configure reserved concurrency for predictable-load, latency-sensitive GenAI endpoints to guarantee available execution capacity, and be aware of how Lambda concurrency interacts with downstream service rate limits (e.g., Bedrock quotas, see bedrock-retries-throttling.md) — a Lambda function scaling up rapidly in response to a traffic spike can itself trigger downstream throttling if concurrency isn't coordinated with those downstream limits.

## Streaming Responses
For interactive RAG or chat applications wanting to stream generated tokens to the client as they're produced (improving perceived latency, see rag-latency-optimization.md), use Lambda response streaming (via Lambda Function URLs with streaming support) or an API Gateway WebSocket API pattern, rather than waiting for the full generation to complete before returning any response.

## Cost Model
Lambda's pay-per-invocation, pay-per-duration pricing model is well-suited to GenAI workloads with variable or unpredictable traffic, avoiding the idle-capacity cost of an always-running server or container — but at sustained very high, predictable volume, compare this against EKS or other always-on compute options where the economics may favor dedicated infrastructure (see lambda-vs-eks.md's decision framework).

## Summary
AWS Lambda is the default, well-suited compute choice for most GenAI request/response orchestration and individual pipeline processing steps, with execution timeout, cold-start latency, and VPC attachment trade-offs as the primary architectural considerations distinguishing it from EKS-based alternatives for longer-running or more complex agentic workflows.
