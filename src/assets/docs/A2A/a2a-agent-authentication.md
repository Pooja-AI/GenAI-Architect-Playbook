# How Do You Authenticate Agents?

## Interview Question

**“How do you authenticate agents in an Agentic AI / A2A architecture?”**

---

# 1. Strong Interview Answer

> **“I authenticate agents using workload identity rather than trusting the agent name or Agent Card alone. Each agent has a verifiable identity, and when one agent invokes another, it presents a security credential such as an OAuth 2.0 access token or a workload identity token. The receiving agent validates the token's issuer, signature, audience, expiry, and required scopes or claims. After authentication, authorization determines whether the calling agent is actually allowed to perform that operation.”**

The key distinction is:

```text
Authentication → WHO are you?

Authorization → WHAT are you allowed to do?
```

---

# 2. Enterprise Authentication Flow

For my CWD architecture:

```text
Coordinator
     |
     | A2A Request
     | + Access Token
     v
Manufacturing Delegator
     |
     v
Authenticate
     |
     +── Validate Token
     +── Validate Signature
     +── Validate Issuer
     +── Validate Audience
     +── Validate Expiry
     |
     v
Authenticated Agent
     |
     v
Authorization
     |
     v
Allow / Deny
```

---

# 3. Agent Identity

Each agent should have a unique identity.

For example:

```text
Coordinator Agent
    identity:
    coordinator-agent

Manufacturing Delegator
    identity:
    manufacturing-delegator

Vision Agent
    identity:
    vision-agent
```

But we should **not trust a string such as `vision-agent` by itself**.

The identity needs to be backed by a trusted identity provider or workload identity system.

---

# 4. Workload Identity

For enterprise systems, I prefer **workload identity** instead of embedding usernames/passwords or API keys inside agents.

Conceptually:

```text
Vision Agent
     |
     v
Workload Identity
     |
     v
Identity Provider
     |
     v
Access Token
```

The agent uses that identity when calling another agent.

This is especially important when agents are deployed independently in:

* Kubernetes
* Azure
* AWS
* Cloud platforms
* Enterprise service environments

---

# 5. OAuth 2.0 / JWT

A common pattern is:

```text
Agent A
   |
   | Request token
   v
Identity Provider
   |
   | Access Token
   v
Agent A
   |
   | A2A Request + Token
   v
Agent B
```

The access token can contain claims such as:

```json
{
  "iss": "trusted-identity-provider",
  "sub": "manufacturing-delegator",
  "aud": "vision-agent",
  "scope": "image_analysis",
  "exp": 1788360000
}
```

The exact claims depend on the enterprise identity architecture.

---

# 6. What Does Agent B Validate?

When Agent B receives the request:

```text
A2A Request
    |
    v
Token Validation
    |
    +── Signature
    +── Issuer
    +── Audience
    +── Expiration
    +── Scope
    +── Claims
    |
    v
Authenticated?
```

If validation fails:

```text
401 Unauthorized
```

If authentication succeeds but the agent doesn't have permission:

```text
403 Forbidden
```

Remember:

```text
401 → Authentication problem

403 → Authorization problem
```

---

# 7. Authentication vs Authorization

This is a common interview trap.

Suppose:

```text
Manufacturing Delegator
        |
        v
Vision Agent
```

The Vision Agent verifies:

> “Is this really the Manufacturing Delegator?”

That's **authentication**.

Then:

> “Is the Manufacturing Delegator allowed to request image analysis?”

That's **authorization**.

So:

```text
Authentication
      ↓
Who are you?
      ↓
Authorization
      ↓
What can you do?
```

---

# 8. Example Authorization Policy

Suppose we define:

```text
Manufacturing Delegator
    ↓
Allowed:
image_analysis
defect_detection

Not Allowed:
financial_analysis
employee_data_access
```

The authorization layer evaluates:

```text
Caller:
manufacturing-delegator

Target:
vision-agent

Action:
image_analysis
```

Decision:

```text
ALLOW
```

But:

```text
Caller:
manufacturing-delegator

Action:
financial_analysis
```

Decision:

```text
DENY
```

This follows the **least-privilege principle**.

---

# 9. mTLS

For high-security service-to-service communication, we can also use **mutual TLS**.

Normal TLS:

```text
Client
   |
   | verifies Server
   v
Server
```

mTLS:

```text
Agent A
   |
   | verifies Agent B
   |
   | Agent B verifies Agent A
   |
   v
Agent B
```

Both sides authenticate using certificates.

```text
Agent A Certificate
        ↕
     mTLS
        ↕
Agent B Certificate
```

This is useful for internal enterprise service communication.

---

# 10. API Gateway / Service Mesh

Authentication doesn't necessarily have to be implemented inside every agent.

We can place security infrastructure in front of agents.

For example:

```text
Coordinator
     |
     v
API Gateway / Service Mesh
     |
     | Authentication
     | Authorization
     | Policy
     v
Manufacturing Agent
```

This allows centralized enforcement.

For example:

```text
Agent
  ↓
Service Mesh
  ↓
mTLS
  ↓
Policy Enforcement
  ↓
Target Agent
```

This can reduce duplicated security logic across agents.

---

# 11. Agent Card and Authentication

Remember the relationship with the Agent Card.

The Agent Card can advertise information about how the agent expects clients to authenticate.

Conceptually:

```text
Agent Card
    |
    +── Identity
    +── Capabilities
    +── Endpoint
    +── Supported security schemes
```

But:

> **An Agent Card itself is not proof of identity.**

An attacker could potentially publish false metadata.

Therefore:

```text
Agent Card
      ↓
Discovery metadata
      ↓
Trusted identity validation
      ↓
Authentication
      ↓
Authorization
```

---

# 12. CWD Example

Let's take:

```text
Coordinator
     ↓
Manufacturing Delegator
     ↓
Vision Agent
```

The Manufacturing Delegator wants to invoke the Vision Agent.

### Step 1 — Discover

```text
Agent Registry
     ↓
Vision Agent Card
```

The Card tells the Delegator:

```text
Capability:
image_analysis

Endpoint:
Vision Agent

Security:
Supported authentication mechanism
```

---

### Step 2 — Obtain Identity Token

```text
Manufacturing Delegator
       |
       v
Identity Provider
       |
       v
Access Token
```

---

### Step 3 — A2A Request

```text
Manufacturing Delegator
       |
       | A2A Request
       | Authorization: Bearer <token>
       v
Vision Agent
```

---

### Step 4 — Authenticate

Vision Agent validates:

```text
Token signature
Issuer
Audience
Expiration
Agent identity
```

---

### Step 5 — Authorize

Policy engine checks:

```text
Can manufacturing-delegator
invoke image_analysis
on vision-agent?
```

If yes:

```text
ALLOW
```

---

### Step 6 — Execute

```text
Vision Agent
      |
      v
Image Analysis
      |
      v
Result
```

The result is returned through the A2A interaction.

---

# 13. Complete Enterprise Security Flow

```text
                 Agent Discovery
                       |
                       v
                  Agent Card
                       |
                       v
                Target Selection
                       |
                       v
              Obtain Workload Identity
                       |
                       v
                Access Token / mTLS
                       |
                       v
                   A2A Request
                       |
                       v
              Authentication Check
                       |
                       v
              Authorization Check
                       |
                 +-----+-----+
                 |           |
               Allow        Deny
                 |           |
                 v           v
              Execute     Reject
                 |
                 v
              Response
```

---

# 14. Don't Put Secrets Inside Agent Code

Bad approach:

```python
API_KEY = "secret-key-123"
```

or:

```python
USERNAME = "agent"
PASSWORD = "password"
```

This creates serious security problems.

Instead use:

```text
Workload Identity
        +
Short-lived Credentials
        +
Secret Manager
        +
Token-based Authentication
```

The agent obtains credentials dynamically.

---

# 15. Short-Lived Tokens

I prefer short-lived access tokens.

Instead of:

```text
Permanent API Key
       ↓
Agent
```

use:

```text
Agent
  ↓
Identity Provider
  ↓
Short-lived Token
  ↓
A2A Request
```

Benefits:

* Reduced impact if a token is compromised
* Easier rotation
* Better auditability
* No long-lived secrets in applications

---

# 16. Authentication in a Multi-Agent Architecture

For your architecture:

```text
                    Coordinator
                         |
                    Authenticated
                         |
                        A2A
                         |
                         v
                  Manufacturing
                    Delegator
                    /       \
               Authenticated
                  /           \
                A2A           A2A
                /               \
               v                 v
          Vision Agent       RAG Agent
               |                 |
              MCP              MCP
               |                 |
               v                 v
             Tools             Data
```

Every trust boundary should be protected.

Don't assume:

> “It's inside our private network, so it is trusted.”

Use a **zero-trust mindset**:

```text
Every agent
    ↓
Authenticated
    ↓
Authorized
    ↓
Least privilege
```

---

# 17. Agent-to-Agent Security Layers

A strong enterprise design has multiple layers:

```text
Layer 1
Network Security
       ↓
Layer 2
Transport Security
(mTLS / TLS)
       ↓
Layer 3
Identity
(OAuth / Workload Identity)
       ↓
Layer 4
Authorization
(RBAC / ABAC / scopes)
       ↓
Layer 5
Application Validation
(schema / input validation)
       ↓
Layer 6
Audit & Monitoring
```

---

# 18. What About Agent Impersonation?

Suppose an attacker pretends to be:

```text
manufacturing-delegator
```

We prevent this through cryptographically verifiable identity.

```text
Fake Agent
     |
     | Fake identity
     v
Vision Agent
     |
     v
Identity validation
     |
     X
Rejected
```

The receiving agent trusts the identity provider, certificates, or other enterprise trust mechanisms—not the agent's self-declared name.

---

# 19. What About Delegated Authorization?

Sometimes Agent A acts on behalf of a user.

For example:

```text
User
 ↓
Coordinator
 ↓
Manufacturing Delegator
 ↓
Vision Agent
```

There may be two identities:

```text
User Identity
      +
Agent Identity
```

The enterprise security model should distinguish:

```text
Who is the user?

Who is the calling agent?

What is the agent allowed to do on behalf of the user?
```

This becomes important for sensitive enterprise operations.

---

# 20. Authentication + Observability

Every A2A request should ideally carry correlation information.

```text
trace_id
request_id
task_id
caller_agent
target_agent
```

Example:

```text
trace_id = TR-1001
task_id  = TASK-501

Coordinator
    ↓
Manufacturing Delegator
    ↓
Vision Agent
```

This lets us trace:

```text
Who called whom?
When?
Was authentication successful?
What capability was requested?
How long did it take?
Did authorization fail?
```

Sensitive credentials/tokens themselves should **never be logged**.

---

# 21. Authentication Failure Handling

If authentication fails:

```text
A2A Request
    ↓
Authentication
    ↓
FAILED
    ↓
Reject
    ↓
Audit Security Event
```

Don't blindly retry authentication failures.

For example:

```text
401 Unauthorized
→ Refresh/reacquire credential if appropriate

403 Forbidden
→ Don't retry repeatedly
→ Investigate authorization policy
```

This is different from a transient network failure.

---

# 22. Strong Architect-Level Answer

> **“In my enterprise multi-agent architecture, I use workload identity and token-based authentication for agent-to-agent communication, with mTLS where stronger service-to-service identity is required. Each independently deployed agent has a verifiable identity. When the Manufacturing Delegator invokes the Vision Agent, it obtains a short-lived access token and sends it with the A2A request. The Vision Agent validates the token's issuer, signature, audience, expiration, and relevant claims or scopes. After authentication, an authorization layer verifies that the Delegator is permitted to invoke the requested capability. I also apply least privilege, centralized policy enforcement where appropriate, and distributed audit and tracing. The important distinction is that the Agent Card helps advertise security requirements, but it is not itself a trust mechanism.”**

---

# 23. 30-Second Interview Answer

> **“I authenticate agents using workload identity and short-lived OAuth or JWT-based credentials. When one agent invokes another, it presents an access token, and the receiving agent validates the issuer, signature, audience, expiry, and required scopes. After authentication, authorization determines whether that agent is allowed to perform the requested operation. For internal high-security communication, I can also use mTLS. In my CWD architecture, the Manufacturing Delegator is authenticated before it can invoke the Vision Agent through A2A, and authorization ensures it only has access to the capabilities it actually needs.”**

---

# 24. Golden Interview Distinction

```text
Agent Card
     ↓
"What can you do?"

Discovery
     ↓
"Where are you?"

Authentication
     ↓
"Who are you?"

Authorization
     ↓
"What are you allowed to do?"

A2A
     ↓
"Let's communicate."
```

## Final Memory Trick

```text
DISCOVER
   ↓
IDENTIFY
   ↓
AUTHENTICATE
   ↓
AUTHORIZE
   ↓
INVOKE
   ↓
AUDIT
```

### One-Line Architect Answer

> **“I don't trust an agent based on its name or Agent Card; I establish a verifiable workload identity, authenticate every agent-to-agent request, authorize the requested capability using least privilege, and audit the interaction.”**
