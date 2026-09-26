### How do you handle audit requirements?

I implement **end-to-end audit logging and traceability**.

1. **Log every AI interaction**

   * User/request ID
   * Timestamp
   * Agent and model version
   * Prompt version
   * Tools/MCP calls
   * Retrieved data sources
   * Final response
   * Approval/denial decisions

2. **Use correlation IDs**

   ```text
   User
    ↓
   Coordinator
    ↓
   Delegator
    ↓
   Worker
    ↓
   MCP Tool
    ↓
   Enterprise System
   ```

   One `correlation_id` lets us trace the complete request.

3. **Security audit**

   * Track authentication, authorization, data access, and failed access attempts.
   * Use **Entra ID audit logs + Azure Monitor/Log Analytics**.

4. **Immutable/controlled logs**

   * Restrict who can modify or delete audit records.
   * Apply appropriate retention policies.

5. **Compliance reporting**

   * Generate reports for who accessed what, when, why, and what action was performed.

6. **Monitor and alert**

   * Detect unusual access, excessive tool calls, policy violations, and security events.

### Interview answer

> **"I handle audit requirements through end-to-end traceability. Every request gets a correlation ID, and we capture the user, agent, model and prompt versions, tool calls, data access, authorization decisions, and final outcome. We use centralized audit logs with controlled access and retention policies, and integrate them with monitoring and alerting so security and compliance teams can investigate any activity."**
