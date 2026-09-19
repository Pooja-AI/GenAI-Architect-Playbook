# RBAC and ABAC for GenAI Systems

## Overview
Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) are two complementary authorization models for determining what a given user (or an agent acting on their behalf) can access or do within a generative AI system — extending traditional access control models to the specific needs of RAG retrieval, agent action authorization, and multi-tenant AI applications.

## Role-Based Access Control (RBAC)
Access is determined by a user's assigned role(s) (e.g., "support-agent," "manager," "admin"), with each role granted a defined set of permissions.

**In a GenAI context:**
- A RAG knowledge base might tag documents with required roles, and only surface content to users whose role matches
- An agentic system might expose different sets of available tools/actions depending on the invoking user's role (e.g., a "manager" role can approve refunds an "associate" role can only propose)

**Strengths:** simple to reason about and administer for organizations with well-defined, relatively stable role structures.
**Limitations:** can become unwieldy when access requirements depend on many fine-grained, context-specific factors that don't map cleanly to a small set of discrete roles.

## Attribute-Based Access Control (ABAC)
Access is determined by evaluating policies against attributes of the user, the resource, and the environment/context (e.g., "allow access if user.department == document.department AND user.clearance_level >= document.classification AND current_time is within business hours").

**In a GenAI context:**
- RAG retrieval filters can incorporate multiple attributes simultaneously (department, clearance level, project assignment) rather than a single role field, enabling much finer-grained security trimming (see rag-security-trimming.md)
- Agent action authorization can evaluate contextual attributes (transaction amount, customer risk tier, time of day) rather than a static role-based yes/no

**Strengths:** far more flexible and precise for complex, multi-dimensional access requirements.
**Limitations:** more complex to design, implement, and audit — policies can become intricate and harder to reason about at a glance compared to a simple role list.

## Choosing Between RBAC and ABAC
Many enterprise GenAI systems use a hybrid: RBAC for broad, stable access categories (department-level document access, high-level agent capability tiers) combined with ABAC for finer-grained, context-dependent policies layered on top (specific document sensitivity levels, transaction-specific approval thresholds).

## Implementation in AWS
- IAM natively supports both RBAC-style role assignment and ABAC-style policies using resource/principal tags and conditions
- For RAG metadata filtering, encode role/attribute information as chunk metadata (see rag-security-trimming.md) and construct retrieval queries that apply the appropriate RBAC/ABAC filter logic based on the requesting user's context
- For agent action authorization, implement policy evaluation (potentially using AWS's policy evaluation capabilities, or a dedicated policy engine) as part of the authorization check described in agent-authorization.md

## Keeping Access Policies Synchronized
Whichever model is used, access control metadata (roles, attributes) must be kept synchronized with the authoritative identity/HR system — stale role or attribute data is a common source of both over-permissive access (a security risk) and under-permissive access (a usability/productivity problem) as organizational structures and individual assignments change over time.

## Summary
RBAC provides simplicity for stable, coarse-grained access categories, while ABAC provides the flexibility needed for fine-grained, context-dependent access decisions — most mature enterprise GenAI systems combine both, applying each where it fits best across RAG retrieval security trimming and agentic action authorization.
