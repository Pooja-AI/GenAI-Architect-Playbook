### Why use an Agent Registry?

An **Agent Registry** is a centralized place to **register, discover, govern, and manage agents**.

* Stores agent **name, purpose, capabilities, version, owner**.
* Defines which **tools/MCP servers** the agent can use.
* Helps the **Coordinator/Delegator discover the correct agent** dynamically.
* Supports **authorization and governance**.
* Tracks **versions, status, and lifecycle**.
* Prevents unregistered or unauthorized agents from participating.

**In CWD:**

```text
Coordinator
     ↓
Agent Registry
     ↓
Find suitable Delegator
     ↓
Delegator
     ↓
Worker Registry
     ↓
Select Worker
```

**Interview answer:**

> “We used an Agent Registry as a centralized control plane for agent discovery and governance. It stores each agent’s capabilities, owner, version, tools, permissions, and status. The Coordinator and Delegators use the registry to dynamically discover the right agent instead of hardcoding agent relationships. It also helps with authorization, versioning, auditing, and lifecycle management.”
