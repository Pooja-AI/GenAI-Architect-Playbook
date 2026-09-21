## How do you implement model fallback?

Model fallback means if the **primary LLM is unavailable, times out, or returns a supported failure**, we automatically route the request to a secondary model so the CWD workflow can continue.

### CWD flow

```text
Coordinator / Worker
        ↓
Primary Model
(Azure OpenAI)
        ↓
   Success?
   ↙      ↘
 YES       NO
  ↓         ↓
Response   Fallback Policy
             ↓
       Secondary Model
             ↓
          Response
```

### 1. Define the primary and fallback models

For example:

```text
Primary:
Azure OpenAI GPT-4-class model

Fallback:
Another supported Azure OpenAI deployment/model
or a smaller model for appropriate tasks
```

The fallback should be tested beforehand; you don't want to discover during an outage that the backup model cannot handle your prompts or tool calls.

---

### 2. Define which errors trigger fallback

I don't fallback on every error.

**Good fallback candidates:**

* Timeout
* Temporary service unavailable
* Rate limiting
* Capacity/transient infrastructure errors
* Model deployment outage

```text
Timeout / 503 / 429
       ↓
Fallback
```

**Usually don't fallback:**

* Invalid prompt
* Invalid tool arguments
* Authorization failure
* Safety/policy rejection
* Bad application logic

Those need to be fixed or handled by the application rather than blindly retrying another model.

---

### 3. Use timeout + retry + fallback

A typical production flow is:

```text
Request
  ↓
Primary Model
  ↓
Timeout?
  ├── No → Response
  │
  └── Yes
       ↓
   Limited retry
       ↓
   Still failing?
       ↓
   Fallback Model
       ↓
   Response
```

I keep retries **bounded** so we don't create a long latency chain.

---

### 4. Preserve the same request contract

The fallback should receive the same essential:

* System instructions
* User request
* Relevant context
* Tool definitions/schema, if needed
* Output format

For CWD, this is important because the Coordinator or Worker shouldn't need completely different application logic for each model.

---

### 5. Consider tool-calling compatibility

This is especially important in CWD because Workers use MCP.

```text
Worker
  ↓
LLM
  ↓
Tool call
  ↓
MCP Client
  ↓
MCP Server
```

The fallback model must support the required structured/tool-calling behavior.

If it doesn't, I would **not** route a tool-dependent task to that model.

---

### 6. Use task-aware fallback

Not every task needs the same fallback.

```text
Simple classification
      ↓
Primary fails
      ↓
Small fallback model

Complex reasoning
      ↓
Primary fails
      ↓
Another capable reasoning model
```

For a critical Customer Briefing, I would not blindly fall back to a model that has lower reasoning or tool-calling capability.

---

### 7. Monitor fallback usage

I would track:

* Primary success rate
* Fallback rate
* Fallback reason
* Fallback latency
* Fallback model quality
* Cost
* Tool-call success
* Error rate

If fallback usage suddenly increases, that can indicate a primary-model outage or capacity problem.

---

### 🎯 Strong interview answer

> **“I implement model fallback using a policy-driven model router. The primary model handles the request first. For transient failures such as timeout, rate limiting, or service unavailability, we use bounded retries and then route to a prevalidated fallback model. We don't fallback for authorization, invalid requests, or safety failures. For CWD, the fallback must support the required context size, structured output, and MCP tool-calling behavior. We also monitor fallback rate, latency, cost, and quality so fallback remains a resilience mechanism rather than becoming the normal path.”**

### Easy memory trick

**Detect → Retry → Fallback → Validate → Monitor**

Key interview line:

> **“Fallback is for transient model availability problems, not for hiding application or authorization errors.”**
