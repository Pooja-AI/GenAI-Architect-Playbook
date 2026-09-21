## How long do you retain conversations?

In CWD, I **don't choose one arbitrary retention period**. I define retention based on **business, security, compliance, and data-sensitivity requirements**.

For example, I might define a policy like:

```text id="2l8xqv"
Conversation
    ↓
Active period
    ↓
Short-term retention
    ↓
Archive / delete
```

### 1. Separate active conversation from historical data

For example:

```text id="5n3v8a"
Active conversation
    ↓
Redis + durable conversation store
    ↓
User finishes conversation
    ↓
Retention policy
    ↓
Delete / Archive
```

I don't keep conversations indefinitely just because storage is available.

---

### 2. Different data can have different retention

In CWD, I would define separate policies:

| Data                        | Retention approach                                 |
| --------------------------- | -------------------------------------------------- |
| Active conversation context | Short-term                                         |
| Workflow state              | Retain until workflow completion + recovery window |
| Audit logs                  | Longer, based on compliance                        |
| LLM traces                  | Defined by privacy/security policy                 |
| Evaluation data             | Retain according to evaluation needs               |
| Cached conversation data    | Short TTL                                          |

For example, an active conversation might be retained for **30 days as an illustrative policy**, while audit records could require a different period.

The exact period should come from the organization's data-retention policy rather than being hardcoded into the architecture.

---

### 3. Sensitive conversations

If a conversation contains confidential enterprise information, I apply stricter controls:

```text id="d2r0qk"
Sensitive conversation
       ↓
Minimize stored content
       ↓
Encrypt
       ↓
Access control
       ↓
Shorter retention where appropriate
       ↓
Automatic deletion
```

I also avoid storing unnecessary Salesforce/ServiceNow payloads inside conversation history.

---

### 4. TTL and automatic deletion

For short-lived conversation data, I can use TTL.

For example:

```text id="6h9m2c"
conversation_id = CONV-1001
expires_at = <retention-policy timestamp>
```

A scheduled lifecycle process or database TTL removes expired data.

For archived data, I apply storage lifecycle policies such as:

```text id="5j8v1a"
Hot
 ↓
Archive
 ↓
Delete
```

depending on the organization's requirements.

---

### 5. User deletion / privacy requests

The architecture should support deletion by:

```text
tenant_id
user_id
conversation_id
```

When a conversation reaches its retention limit or an authorized deletion request occurs, I remove the conversation data and associated cached copies according to the organization's deletion policy.

---

## 🎯 Interview-ready answer

> **“In CWD, conversation retention is policy-driven rather than a fixed architectural value. I define retention based on business requirements, data sensitivity, security, and compliance. Active conversation state is retained only as long as it is needed, with Redis used for short-lived cached context and durable storage for required conversation state. I apply TTL and lifecycle policies for automatic expiration, and I use shorter retention or stronger controls for sensitive conversations. I also keep conversation data separate from audit and workflow state because those datasets can have different retention requirements. Most importantly, I minimize stored conversation content and don't retain sensitive enterprise data unnecessarily.”**

### Easy memory

**Need → Minimize → Store securely → Retain by policy → Archive if required → Delete automatically**

> **Strong interview line:** **“Retention is a data-governance decision, not simply a storage decision; I retain only what the business and compliance requirements justify.”**
