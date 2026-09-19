# What Is Amazon Bedrock?

## Overview
Amazon Bedrock is AWS's fully managed service for building generative AI applications using foundation models (FMs) from multiple providers — including Anthropic (Claude), Amazon (Titan/Nova), Meta (Llama), Cohere, Mistral, and others — through a single, unified API. Bedrock removes the operational burden of hosting and scaling large models, letting teams focus on application logic.

## Core Capabilities
- **Unified Model Access**: call different foundation models through a consistent API (the Converse API) without rewriting integration code per provider
- **Knowledge Bases**: managed RAG — handles document ingestion, chunking, embedding, vector storage, and retrieval
- **Agents**: managed orchestration for tool-calling and multi-step task execution
- **Guardrails**: configurable content filtering, PII redaction, and topic restriction applied consistently across any model
- **Fine-tuning and Continued Pre-training**: customize select models with your own data
- **Provisioned Throughput**: reserved capacity for predictable, high-volume workloads with guaranteed latency

## Why Use Bedrock Instead of Calling Model APIs Directly
- **No infrastructure to manage** — no GPU provisioning, scaling, or patching
- **Model flexibility** — swap between models (e.g., Claude, Llama, Titan) with minimal code changes, enabling A/B testing and cost/quality trade-off experiments
- **AWS-native integration** — IAM for access control, CloudWatch for monitoring, VPC endpoints for private connectivity, and billing consolidated with the rest of your AWS spend
- **Compliance posture** — inherits AWS's compliance certifications (HIPAA eligibility, SOC, FedRAMP, etc.) which can simplify audits versus managing direct vendor contracts and infrastructure yourself

## The Converse API
Bedrock's Converse API standardizes the request/response format across model providers, including multi-turn conversation handling, system prompts, tool use (function calling), and streaming — this is the recommended entry point for new applications rather than model-specific APIs.

## Typical Use Cases
- Customer support chatbots grounded in company knowledge (RAG)
- Document summarization and extraction pipelines
- Code generation and review assistants
- Multi-agent workflows for complex business processes
- Content generation (marketing copy, reports) with brand-voice guardrails

## Pricing Model
Bedrock is billed primarily on a per-token basis (input and output tokens, which differ in price), varying by model. Provisioned Throughput offers a flat-rate option for guaranteed capacity, which becomes more cost-effective at sustained high volume compared to on-demand token pricing.

## How It Fits Into a Broader AWS Architecture
Bedrock typically sits behind API Gateway and Lambda (or ECS/EKS for more complex orchestration), with S3 for document storage, OpenSearch or Bedrock Knowledge Bases for vector search, and CloudWatch/X-Ray for observability — forming the "AWS GenAI stack" referenced throughout this documentation set.

## Getting Started Checklist
1. Request model access in the Bedrock console (model access must be explicitly enabled per account/region)
2. Choose a model based on your task (see bedrock-model-selection.md)
3. Set up IAM roles scoped to `bedrock:InvokeModel` and related actions
4. Decide whether to use Knowledge Bases (managed RAG) or build custom retrieval
5. Configure Guardrails before going to production

## Summary
Amazon Bedrock is the primary AWS entry point for generative AI, providing multi-model access, managed RAG and agent capabilities, and enterprise-grade governance without the operational overhead of self-hosting foundation models.
