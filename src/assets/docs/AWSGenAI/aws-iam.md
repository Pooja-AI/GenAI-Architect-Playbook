# AWS IAM for GenAI Applications

## Overview
AWS Identity and Access Management (IAM) is the foundational access control service underlying security for every AWS-based GenAI application described throughout this knowledge base — governing what identities (users, services, applications) can do with Bedrock, vector stores, data pipelines, and every other AWS resource involved.

## Core IAM Concepts Applied to GenAI

### IAM Roles for Compute
Lambda functions, ECS tasks, and EKS pods invoking Bedrock, querying vector stores, or accessing S3 documents should each run under a dedicated IAM role scoped to exactly the permissions that specific component needs — following the least-privilege principle emphasized throughout secure-agent-tools.md and agent-authorization.md.

### Resource-Based Policies
For resources like S3 buckets storing sensitive documents, resource-based policies can complement identity-based policies, providing an additional layer of access control specifically scoped to the resource itself.

### IAM Conditions for Fine-Grained Control
IAM policy conditions enable fine-grained, context-dependent access control (e.g., restricting Bedrock model invocation to specific source IP ranges or VPC endpoints, or restricting access to specific times) — implementing part of the ABAC pattern described in rbac-abac.md at the infrastructure level.

## Bedrock-Specific IAM Considerations
- Scope IAM policies to specific Bedrock actions (`bedrock:InvokeModel`, `bedrock:InvokeModelWithResponseStream`, `bedrock:Retrieve` for Knowledge Bases) rather than broad wildcard Bedrock permissions
- Restrict which specific foundation models an identity can invoke, if your organization wants to control which models different teams/applications are authorized to use (e.g., restricting access to a specific model pending security review)
- Apply separate roles for read-only Knowledge Base retrieval versus roles with Guardrail configuration modification permissions, since these represent very different risk levels

## IAM for Multi-Agent and Agentic Systems
Each agent or worker in a multi-agent system (see the Multi-Agent Systems section of this knowledge base) should ideally run under its own scoped IAM role reflecting exactly the tools/data it's authorized to access — a supervisor agent orchestrating several specialized workers shouldn't necessarily share the same broad permission set as every individual worker, since this would undermine the principle of least privilege that makes agent guardrails (see agent-guardrails.md) effective as a genuine security boundary rather than a purely prompt-level convention.

## Auditing IAM Usage
Use AWS CloudTrail to log every IAM-authenticated API call, providing the audit trail needed to investigate security incidents, verify compliance with access policies, and detect anomalous access patterns (e.g., an application suddenly invoking a different, unexpected model, or attempting Bedrock actions outside its normal scope).

## Common IAM Pitfalls in GenAI Applications
- Granting overly broad Bedrock permissions (e.g., `bedrock:*`) for convenience during development, and failing to tighten this before production deployment
- Sharing a single, broadly-scoped IAM role across many different application components with genuinely different access needs, rather than creating appropriately scoped roles per component
- Not applying IAM conditions or resource-based policies to further restrict access even where broader identity-based permissions exist, missing an available defense-in-depth layer

## Relationship to Broader Security Practices
IAM provides the foundational, infrastructure-enforced access control layer that underlies and enables many of the security practices described elsewhere in this knowledge base — agent-authorization.md's action-scope restrictions, secure-agent-tools.md's least-privilege tool design, and tenant-isolation.md's isolation guarantees all ultimately depend on correctly configured IAM policies as their technical enforcement mechanism.

## Summary
AWS IAM provides the foundational, infrastructure-level access control for GenAI applications — scoping Bedrock actions, model access, and data access per component according to least-privilege principles — and serves as the technical enforcement layer underlying the higher-level authorization and security concepts discussed throughout this knowledge base.
