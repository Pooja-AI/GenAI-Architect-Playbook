# Agent Authorization

## Overview
Agent authorization determines what actions an AI agent is permitted to take and what data it can access, on behalf of which users, under what conditions. As agents gain the ability to take real-world actions (not just generate text), authorization becomes as critical a security control as it is for any traditional application performing actions on a user's behalf.

## Authorization Dimensions

### On Behalf of Whom
An agent typically acts within the authorization context of a specific user or service identity — its permissions should never exceed what that underlying identity is legitimately authorized to do, even if the agent's own credentials technically allow more (the agent should apply the more restrictive of its own permissions and the acting-on-behalf-of user's permissions).

### Which Actions
Explicit allowlisting of which tools/actions an agent can invoke in a given context — not every agent needs access to every available tool, and scoping this tightly per use case reduces the blast radius of both bugs and successful prompt injection attacks (see agent-guardrails.md).

### Under What Conditions
Some actions may be conditionally authorized — permitted only below a certain financial threshold, only during certain hours, only for certain customer segments — requiring the authorization layer to evaluate contextual conditions, not just a static yes/no permission.

## Implementation Approaches

### IAM-Backed Authorization
For actions mapping to AWS resources, standard IAM roles and policies can directly enforce what an agent's underlying execution environment (Lambda, ECS task) is permitted to do — providing a hard, infrastructure-level authorization boundary independent of the agent's own reasoning or any prompt-level instruction.

### Application-Layer Authorization Checks
For business-logic-level permissions not directly mapped to IAM (e.g., "this agent can process refunds up to $500 for this customer tier"), implement explicit authorization checks in the application code that executes a proposed agent action, validating it against the relevant policy before execution — never relying on the model's own prompt instructions as the sole enforcement of such a rule.

### Delegated User Authorization (OAuth-style)
When an agent acts on behalf of a specific end user (e.g., accessing that user's calendar or email via a connected third-party service), use standard delegated authorization patterns (OAuth scopes) so the agent's access is explicitly scoped to what that user has consented to, and revocable independently of the agent's own broader credentials.

## Authorization vs. Guardrails
Authorization determines *whether an action is permitted at all* for a given identity/context; guardrails (see agent-guardrails.md) provide additional safety constraints (content filtering, approval gates) that may apply even to actions that are technically authorized. Both layers are necessary — an authorized action can still be inappropriate or require additional review, and a well-designed guardrail shouldn't be the only thing standing between an agent and an unauthorized action.

## Auditing Authorization Decisions
Log every authorization check — what was requested, on behalf of whom, what the outcome was, and why — providing the audit trail needed both for security incident investigation and for demonstrating compliance with access control policies to auditors or regulators (see ai-compliance.md).

## Common Pitfalls
- Granting an agent's underlying execution role broad permissions "to keep things simple," relying entirely on prompt instructions to constrain what it actually does — this fails to provide a hard security boundary and is vulnerable to prompt injection
- Not distinguishing between the agent's own service-level permissions and the permissions of the specific user it's acting on behalf of, potentially allowing privilege escalation
- Treating authorization as a one-time design decision rather than an ongoing review process as an agent's capabilities and use cases evolve

## Summary
Agent authorization requires explicit, infrastructure-enforced (not just prompt-instructed) control over what actions an agent can take, on behalf of whom, and under what conditions — implemented through IAM roles, application-layer policy checks, and delegated authorization patterns, with comprehensive audit logging of every authorization decision.
