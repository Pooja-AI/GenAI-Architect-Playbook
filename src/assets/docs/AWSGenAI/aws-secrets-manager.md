# AWS Secrets Manager for GenAI Applications

## Overview
AWS Secrets Manager provides secure storage, retrieval, and automated rotation of sensitive credentials — API keys, database passwords, third-party service tokens — needed by GenAI applications, particularly relevant for the diverse set of external integrations common in agentic and RAG systems (MCP servers, tool APIs, third-party data sources).

## Where Secrets Are Needed in GenAI Architectures
- **Third-party API keys**: for tools an agent invokes (see function-calling-tool-use.md), external search APIs, or third-party MCP servers requiring authentication (see mcp-security.md)
- **Database credentials**: for vector stores (Aurora pgvector) or metadata stores not using IAM-based authentication
- **Direct LLM provider API keys**: for organizations using direct provider APIs alongside or instead of Bedrock (see bedrock-vs-direct-llm.md)
- **A2A agent authentication credentials**: for authenticating with remote agents in cross-organizational A2A integrations (see what-is-a2a.md)

## Why Not Hardcode or Use Environment Variables Directly
Hardcoding secrets in application code or configuration files creates significant security risk (accidental exposure via version control, logs, or error messages) and makes rotation difficult, since every place the secret is used must be manually updated. Secrets Manager centralizes secret storage with fine-grained access control and supports automated rotation without requiring application code changes at rotation time (when integrated properly).

## Key Capabilities

### Automated Rotation
Configure automatic rotation schedules for supported secret types (database credentials, and custom rotation via Lambda functions for other secret types), reducing the operational burden and security risk of long-lived, unrotated credentials.

### Fine-Grained Access Control
IAM policies control exactly which roles/identities can retrieve which specific secrets, enabling least-privilege access consistent with the broader IAM practices described in aws-iam.md — a Lambda function invoking one specific third-party tool API should only have permission to retrieve that specific secret, not every secret in the account.

### Versioning
Secrets Manager maintains version history for secrets, supporting safe rotation (the old version remains available briefly during a transition) and rollback if a rotation introduces an issue.

## Integration Patterns
- Retrieve secrets at application startup or on-demand (with appropriate caching to avoid excessive Secrets Manager API calls) rather than embedding them in deployment configuration or environment variables directly baked into container images
- For Lambda functions, use Secrets Manager's Lambda extension or direct SDK calls to retrieve secrets at invocation time, with appropriate caching to minimize latency overhead on frequently invoked functions

## Secrets in Multi-Agent and MCP Contexts
As agentic systems increasingly integrate with many external tools and services (see secure-agent-tools.md and mcp-security.md), the number of distinct secrets requiring management grows correspondingly — treat secret sprawl as a governance concern, maintaining a clear inventory of what secrets exist, what they're used for, and ensuring each follows appropriate rotation and access-control practices rather than allowing ad hoc secret proliferation without oversight.

## Auditing Secret Access
CloudTrail logs Secrets Manager API calls, providing visibility into which identities accessed which secrets and when — valuable for security monitoring and incident investigation, particularly important given that secret access often represents a step toward accessing a broader external system that itself may not have equivalently detailed AWS-native audit logging.

## Cost Considerations
Secrets Manager charges per secret stored and per API call for retrieval — for high-frequency secret retrieval patterns, implement appropriate caching (with a sensible TTL balancing freshness against cost/latency) rather than retrieving a secret fresh on every single request.

## Summary
AWS Secrets Manager provides centralized, access-controlled, and rotatable secret storage essential for the diverse external API keys and credentials required by GenAI applications' tool integrations, MCP server connections, and third-party service dependencies — replacing insecure hardcoded or environment-variable-based secret handling with a properly governed, auditable secret management practice.
