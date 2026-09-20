# How do you implement RBAC?

## Short answer
Use RBAC at two layers: Azure resource access and application roles.

## Key points
- Azure RBAC data-plane roles for identities (for example Cognitive Services OpenAI User, Search Index Data Reader, Key Vault Secrets User).
- Application roles and groups for feature access.
- Assign to groups, scope narrowly, define in IaC.

## CWD context
Avoid Owner and Contributor for workloads.
