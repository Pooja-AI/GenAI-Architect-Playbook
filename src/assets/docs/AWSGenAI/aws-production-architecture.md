# AWS Production Architecture for GenAI

## Overview
This document synthesizes the individual AWS service topics covered in this Cloud Architecture section into a cohesive reference for a production-grade GenAI application architecture, tying together IAM, KMS, S3, networking, compute, and observability into a single integrated view.

## Reference Architecture
```
                          Route 53 / CloudFront
                                  ↓
                            API Gateway
                    (Cognito Auth, Rate Limiting)
                                  ↓
                    ┌─────────────────────────┐
                    │   VPC (Private Subnets)  │
                    │                          │
                    │   Lambda / ECS / EKS     │
                    │   (Orchestration Layer)  │
                    │        ↓        ↓        │
                    │  Bedrock    OpenSearch/  │
                    │ (via VPC    Aurora        │
                    │  Endpoint)  (Vector Store)│
                    │        ↓        ↓        │
                    │   DynamoDB (Session/     │
                    │   Checkpoint State)      │
                    └─────────────────────────┘
                                  ↓
                    S3 (Documents, Logs, Backups)
                    KMS (Encryption Keys)
                    Secrets Manager (API Keys)
                                  ↓
                    CloudWatch + X-Ray (Observability)
                    CloudTrail (Audit Logging)
```

## Layer-by-Layer Security and Reliability
- **Entry point**: API Gateway with Cognito authentication and rate limiting (see aws-api-gateway.md), fronted by CloudFront for global edge caching/DDoS protection where appropriate
- **Network**: VPC with private subnets for compute, VPC endpoints for private AWS service connectivity (see aws-networking.md)
- **Compute**: Lambda for request/response orchestration, ECS/EKS for longer-running or higher-throughput workloads (see aws-lambda.md and aws-eks.md), each with least-privilege IAM roles (see aws-iam.md)
- **Model invocation**: Bedrock accessed via VPC endpoint, with retry/fallback logic (see bedrock-retries-throttling.md and bedrock-model-fallback.md) and Guardrails applied (see bedrock-guardrails.md)
- **Data**: S3 for documents/logs (see aws-s3-security.md), vector store for retrieval (see vector-database-selection.md), DynamoDB for session/checkpoint state, all encrypted via KMS (see aws-kms.md)
- **Secrets**: Secrets Manager for any third-party API keys or credentials (see aws-secrets-manager.md)
- **Observability**: CloudWatch and X-Ray for metrics, logs, and tracing (see aws-cloudwatch.md and agent-tracing.md), CloudTrail for API-level audit logging

## High Availability Design
- Multi-AZ deployment for all compute and data tier resources
- Multi-region model fallback for critical availability SLAs (see bedrock-model-fallback.md)
- Health checks and automated failover at each layer (Route 53 health checks, API Gateway/Lambda multi-region deployment where warranted)

## Deployment and Change Management
Layer the CI/CD practices described in genai-ci-cd.md on top of this infrastructure — automated evaluation gates, staged/canary deployment, and fast rollback capability (see genai-rollback.md) for both application code and prompt/configuration changes.

## Cost Management Layer
Apply cost allocation tags consistently across every resource in this architecture, feeding into the cost monitoring and optimization practices described in llm-cost-monitoring.md and bedrock-cost-optimization.md.

## Scaling This Architecture
As usage grows, apply the scaling considerations described in rag-scaling.md (vector index sharding, ingestion pipeline scaling) and general Bedrock capacity planning (Provisioned Throughput, see bedrock-cost-optimization.md) to ensure the architecture scales smoothly rather than hitting unexpected bottlenecks at higher volume.

## Summary
A production-grade AWS GenAI architecture integrates API Gateway, VPC-isolated compute, Bedrock with resilience patterns, encrypted and access-controlled data stores, and comprehensive observability into a cohesive, layered system — with high availability, CI/CD, and cost management practices applied consistently across every layer described in this Cloud Architecture section.
