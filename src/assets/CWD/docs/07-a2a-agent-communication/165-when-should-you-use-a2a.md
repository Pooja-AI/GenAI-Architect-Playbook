## When should you use A2A?

Use **A2A when one AI agent needs to communicate, delegate work to, or collaborate with another independent AI agent**.

### In your CWD project

You have:

```text
User
  |
  v
Coordinator Agent
  |
  | A2A
  v
Sales Delegator
  |
  | A2A
  +------> Customer Worker
  |
  | A2A
  +------> Opportunity Worker
```

The Coordinator doesn't need to know the internal implementation of every Worker. It can delegate a business task to another agent.

### Use A2A when:

1. **You have multiple independent agents**

   * Coordinator
   * Sales Agent
   * IT Agent
   * Customer Agent

2. **Agents need to delegate work**

   ```text
   Coordinator → Sales Delegator
   ```

3. **Agents need to exchange context and results**

   ```text
   Sales Delegator → Customer Worker
                    customer_id = C123
   ```

4. **Different agents have different responsibilities**

   ```text
   Sales Agent → CRM
   IT Agent    → ServiceNow
   Knowledge Agent → SharePoint
   ```

5. **You want loosely coupled agents**

   The Coordinator should not need to know the internal implementation of the Sales Agent.

6. **Agents may be independently developed or deployed**

   For example, the Sales Agent and IT Agent can evolve independently while still communicating through the agent interface.

---

## When NOT to use A2A

Don't introduce A2A just because you have multiple Python functions or services.

For example:

```text
Worker → Salesforce
```

This is **not agent-to-agent communication**.

Use:

```text
Worker → MCP → Salesforce
```

Similarly, if you simply need a traditional backend API:

```text
Application → REST API → Database
```

REST may be sufficient.

---

## A2A vs MCP in CWD

```text
Coordinator
     |
     | A2A
     v
Delegator
     |
     | A2A
     v
Worker
     |
     | MCP
     v
MCP Server
     |
     +----> Salesforce
     +----> ServiceNow
     +----> SharePoint
```

Think of it as:

> **A2A = “I need another agent to do something.”**
> **MCP = “I need a tool/system to do something.”**

### 🎯 Strong interview answer

> **“I use A2A when I have multiple autonomous agents that need to collaborate or delegate tasks. In CWD, the Coordinator communicates with Delegators and Delegators communicate with Workers using A2A. It allows us to exchange task context, status, and results without tightly coupling the agents. When the Worker needs to access Salesforce, ServiceNow, or SharePoint, I use MCP instead because that is agent-to-tool communication.”**

### Easy memory trick

**Agent → Agent = A2A**
**Agent → Tool = MCP**
**System → API = REST**
