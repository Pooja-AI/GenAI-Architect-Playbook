### Which operations should always require approval?

For an enterprise agent, I would require approval for **high-impact or irreversible operations**.

* **Delete or permanently modify critical data**
* **Financial transactions** — payments, refunds, purchases, transfers
* **Production changes** — deployments, infrastructure changes, security configuration
* **Access-control changes** — granting/revoking privileged access
* **External high-impact communication** — legal, contractual, or sensitive customer messages
* **Highly sensitive data access** — when policy requires explicit authorization
* **Security actions** — disabling controls, changing security policies, etc.

**CWD principle:**

```text
Agent decides
     ↓
Risk / Policy Check
     ↓
High-impact operation?
   ↙          ↘
 Yes           No
 ↓              ↓
Human          Execute
Approval
 ↓
Execute MCP Tool
```

**Interview answer:**

> “I would always require approval for operations that are destructive, financially impactful, privileged, security-sensitive, or difficult to reverse. The important point is that approval happens before the MCP tool executes the action. Read-only and low-risk operations can remain automated, while high-impact operations stay under human control.”
