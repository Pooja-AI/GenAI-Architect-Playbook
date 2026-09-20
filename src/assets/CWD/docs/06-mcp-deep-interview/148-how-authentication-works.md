In your **CWD architecture**, authentication happens at multiple layers because we need to authenticate both the **user/agent request** and the **MCP tool call**.

### 1. Overall flow

```text
User
  ↓
FastAPI / API Gateway
  ↓
Microsoft Entra ID
  ↓
Coordinator
  ↓ A2A
Delegator
  ↓ A2A
Worker
  ↓ MCP
MCP Client
  ↓
MCP Server
  ↓
Enterprise System
Salesforce / ServiceNow / SharePoint
```

### 2. How authentication works

**Step 1 — User authentication**

The user signs in through **Microsoft Entra ID**.

The client receives an OAuth 2.0 / OIDC access token.

```text
User → Entra ID → Access Token
```

The request to CWD contains:

```http
Authorization: Bearer <access_token>
```

---

**Step 2 — API validates the token**

FastAPI/API Gateway validates:

* Token signature
* Issuer
* Audience
* Expiration
* Required scopes/roles

For example:

```python
def validate_token(token):
    claims = decode_and_validate_jwt(token)

    if claims["aud"] != CWD_API_CLIENT_ID:
        raise Unauthorized()

    if "customer.read" not in claims["scp"]:
        raise Forbidden()

    return claims
```

Now CWD knows **who the user is and what they are allowed to do**.

---

### 3. Authentication between CWD components

For example:

```text
Coordinator → Delegator → Worker
```

These are trusted internal services.

Instead of passing the user's password, we use **service identities / OAuth tokens**.

For Azure, this can be:

```text
Managed Identity
       ↓
Azure Entra ID
       ↓
Access Token
       ↓
Internal service
```

So the Worker can authenticate when communicating with another protected service.

---

### 4. MCP authentication

When the Worker calls an MCP Server:

```text
Worker
  ↓
MCP Client
  ↓ authenticated request
MCP Server
```

The MCP Server verifies that the caller is authorized to use the requested tool.

For example:

```text
Worker
   |
   | access token
   ↓
MCP Server
   |
   | validate identity
   | check permissions
   ↓
get_customer()
```

The MCP Server should **not trust the Worker just because it is inside the network**.

It verifies:

```text
Who is calling?
        ↓
Is this service/user authenticated?
        ↓
Does it have permission?
        ↓
Is this particular tool allowed?
```

---

### 5. Authorization is different from authentication

This is very important in an interview.

**Authentication = Who are you?**

**Authorization = What are you allowed to do?**

Example:

```text
Sales Worker
    ↓
Authenticated? YES
    ↓
Can use get_customer? YES
    ↓
Can use get_incident? NO
```

So authentication alone doesn't mean the Worker can execute every MCP tool.

---

### 6. Salesforce example

Suppose the request is:

```text
"Give me a customer briefing for C123"
```

The Sales Worker needs Salesforce data.

```text
Sales Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Authentication
   ↓
Authorization
   ↓
Salesforce API
   ↓
Customer C123
```

The MCP Server can use a **service identity / OAuth credential** to authenticate with Salesforce.

Credentials should be stored in something like:

```text
Azure Key Vault
```

—not hardcoded in Worker code.

---

### 7. Interview answer

> **“In CWD, authentication starts at the API layer using Microsoft Entra ID and OAuth tokens. We validate the user's token for identity, audience, expiration, and scopes. For internal Coordinator, Delegator, and Worker communication, we use service identities such as Managed Identity. When a Worker invokes an MCP Server, the MCP layer also authenticates the caller and performs authorization before allowing a specific tool to execute. Enterprise credentials such as Salesforce credentials are securely stored in Key Vault rather than in application code. So authentication establishes identity, while authorization determines which agent or user can access which tool and data.”**

### Easy memory trick

**Authentication → Who are you?**
**Authorization → What can you do?**
**MCP → Which tool can you call?**
**Key Vault → Where are secrets stored?**
