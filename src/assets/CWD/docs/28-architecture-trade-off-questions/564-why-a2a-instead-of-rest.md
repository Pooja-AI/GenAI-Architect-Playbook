### Why A2A instead of REST?

* **REST** is a general-purpose API communication mechanism.
* **A2A (Agent-to-Agent)** is designed specifically for **communication between AI agents**.
* A2A provides concepts for **agent identity, capabilities, task delegation, status, and agent-to-agent interactions**.
* It avoids creating custom REST contracts for every agent-to-agent interaction.
* REST can still be used **underneath A2A** as the transport/API mechanism.

**In CWD:**

```text
Coordinator
    ↓ A2A
Delegator
    ↓ A2A
Worker
```

**Interview answer:**

> “We used A2A because CWD has multiple autonomous agents communicating with each other. A2A gives us an agent-oriented communication model with agent identity, capabilities, task delegation, and status handling. REST is useful for general APIs, but A2A is better suited for agent-to-agent collaboration. REST can still be used underneath the A2A implementation where required.”
