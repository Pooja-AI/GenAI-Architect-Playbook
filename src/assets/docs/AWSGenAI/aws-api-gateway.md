# AWS API Gateway for GenAI Applications

## Overview
Amazon API Gateway serves as the standard external-facing entry point for GenAI applications on AWS, providing authentication, request validation, rate limiting, and routing before traffic reaches backend orchestration logic (typically Lambda, as described in aws-lambda.md, or ECS/EKS for more complex workloads).

## Core API Gateway Capabilities for GenAI

### Authentication and Authorization
Integrate with Amazon Cognito, IAM authorizers, or custom Lambda authorizers to authenticate incoming requests before they reach backend GenAI application logic — ensuring only authorized users/systems can invoke potentially expensive LLM-backed endpoints, and providing the identity context needed for the authorization and RBAC/ABAC patterns described in agent-authorization.md and rbac-abac.md.

### Rate Limiting and Throttling
Configure usage plans and throttling limits at the API Gateway layer to protect backend Bedrock invocations from being overwhelmed by excessive request volume — complementing (not replacing) the Bedrock-level retry/throttling handling described in bedrock-retries-throttling.md by controlling load at the entry point before it even reaches the backend.

### Request Validation
Validate incoming request structure/schema at the API Gateway layer before invoking backend logic, catching malformed requests early and reducing unnecessary backend Lambda invocations for requests that would fail validation anyway.

### WebSocket Support for Streaming
For interactive chat/RAG applications wanting to stream generated responses token-by-token to the client, API Gateway's WebSocket API support (paired with Lambda) provides a pattern for maintaining a persistent connection and pushing incremental response chunks — an alternative to Lambda response streaming via Function URLs, useful particularly when other WebSocket-based application features are also needed.

## REST API vs. HTTP API
API Gateway offers both REST APIs (more features, including more extensive request/response transformation and older-generation capabilities) and HTTP APIs (simpler, lower latency, lower cost, sufficient for many modern GenAI application needs) — HTTP APIs are generally the better default choice for new GenAI applications unless a specific REST API-only feature is required.

## Caching at the API Gateway Layer
API Gateway supports response caching, which can be leveraged for GenAI endpoints serving genuinely cacheable, non-personalized responses — though for most conversational or personalized GenAI use cases, the semantic caching approach described in semantic-caching.md (implemented at the application layer, aware of semantic similarity rather than exact request matching) is more appropriate than API Gateway's exact-match caching.

## Monitoring and Logging
Enable API Gateway access logging and integrate with CloudWatch metrics to track request volume, latency, and error rates at the entry-point layer — providing an important complementary view to the deeper application-level observability described in genai-observability.md, particularly useful for distinguishing entry-point-layer issues (authentication failures, throttling) from backend GenAI application logic issues.

## Multi-Region and Custom Domain Considerations
For applications requiring multi-region availability (see bedrock-model-fallback.md), configure API Gateway with appropriate custom domain and Route 53 failover routing to support seamless failover between regional API Gateway deployments if a primary region experiences issues.

## Summary
API Gateway provides the essential external entry-point layer for GenAI applications — handling authentication, rate limiting, request validation, and (via WebSocket support) streaming response patterns — serving as the first line of defense and control before traffic reaches the backend orchestration and Bedrock invocation logic described elsewhere in this knowledge base.
