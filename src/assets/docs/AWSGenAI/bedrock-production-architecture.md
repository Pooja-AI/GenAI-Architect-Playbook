# Bedrock Production Architecture

## Overview
Moving a Bedrock-based prototype to production requires layering in reliability, security, observability, and cost controls around the core model invocation. This document outlines a reference production architecture.

## Reference Architecture Components

### Entry Point
- Amazon API Gateway (REST or HTTP API) for external-facing endpoints, or an internal ALB for service-to-service traffic
- Authentication via Cognito, IAM, or a custom authorizer Lambda

### Orchestration Layer
- Lambda for lightweight, stateless request handling (single model call or short RAG pipeline)
- ECS/Fargate or EKS for more complex, longer-running, or stateful orchestration (multi-agent workflows, long conversations)
- Step Functions for multi-step workflows requiring durable state and visual auditability

### Model Invocation Layer
- Bedrock Converse API calls wrapped with retry/backoff logic (see bedrock-retries-throttling.md) and fallback routing (see bedrock-model-fallback.md)
- Guardrails applied on every invocation
- Prompt templates version-controlled separately from application code (see prompt-versioning.md)

### Data Layer
- S3 for raw documents and conversation transcripts
- DynamoDB or Aurora for conversation state, session management, and application metadata
- OpenSearch/Bedrock Knowledge Bases for vector search (RAG)
- ElastiCache/Redis for semantic and response caching

### Security Layer
- IAM roles scoped to least-privilege Bedrock actions per service
- KMS encryption for data at rest across S3, DynamoDB, and OpenSearch
- VPC endpoints for private connectivity to Bedrock, avoiding public internet egress
- Bedrock Guardrails plus application-layer PII scrubbing on logs

### Observability Layer
- CloudWatch Logs and Metrics for request/response volumes, latency, error rates, token usage
- AWS X-Ray for distributed tracing across the full request path (API Gateway → Lambda → Bedrock → vector store)
- Custom dashboards tracking business metrics (answer quality scores, user satisfaction, hallucination rate)

### CI/CD Layer
- Automated evaluation suites run against prompt/model changes before deployment (see llm-regression-testing.md)
- Blue/green or canary deployment for prompt and model version changes, with rollback capability (see genai-rollback.md)

## Deployment Topology Example
```
Client → API Gateway → Lambda (auth, request validation)
                          ↓
                    Step Functions / ECS (orchestration)
                          ↓
              ┌───────────┼───────────┐
        Knowledge Base   Bedrock     Guardrails
         (retrieval)     (generate)
                          ↓
                    DynamoDB (session state)
                          ↓
                    CloudWatch / X-Ray (observability)
```

## High Availability Considerations
- Multi-AZ deployment for all compute and data layers
- Multi-region model fallback for critical availability SLAs
- Graceful degradation paths (cached responses, simplified fallback flows) when downstream dependencies are degraded

## Scaling Considerations
- Lambda concurrency limits and reserved concurrency for predictable-load endpoints
- Bedrock quota management and Provisioned Throughput for sustained high volume
- Vector store scaling per rag-scaling.md guidance

## Summary
A production Bedrock architecture wraps the core model invocation with orchestration, security, observability, and CI/CD layers matching standard enterprise application architecture practices — generative AI components should be integrated into, not exempted from, existing production engineering discipline.
