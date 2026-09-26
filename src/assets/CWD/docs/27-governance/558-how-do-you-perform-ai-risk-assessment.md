### How do you perform AI risk assessment?

I use a **risk-based assessment** before an AI agent/model goes to production.

1. **Identify the use case**

   * What does the AI do?
   * What decisions/actions can it take?
   * Who uses it?

2. **Classify the data**

   * Public, internal, confidential, PII, financial, HR, etc.

3. **Assess key risks**

   * **Security:** prompt injection, unauthorized access
   * **Privacy:** PII/data leakage
   * **Accuracy:** hallucination, incorrect answers
   * **Reliability:** failures, downtime
   * **Safety:** harmful or unintended actions
   * **Compliance:** regulatory/policy requirements
   * **Cost:** unexpected token/API consumption

4. **Assess impact and likelihood**

   ```text
   Risk = Likelihood × Impact
   ```

   Prioritize high-impact risks first.

5. **Define controls**

   * RBAC/ABAC
   * Data/ACL filtering
   * Guardrails
   * Tool allowlists
   * Human approval
   * Encryption
   * Monitoring and audit
   * Rate limits

6. **Test the controls**

   * Red-team / adversarial testing
   * Prompt-injection tests
   * Data leakage tests
   * Model evaluation
   * Failure/chaos testing

7. **Approve and continuously monitor**

   * Document residual risk.
   * Get appropriate approval before production.
   * Reassess when the model, prompt, agent, tool, or data changes.

### Interview answer

> **"I perform AI risk assessment by first understanding the use case, data, users, and actions the AI can perform. Then I assess security, privacy, accuracy, reliability, safety, compliance, and cost risks based on likelihood and impact. I define controls such as RBAC, ACL filtering, guardrails, tool allowlists, human approval, and monitoring, validate them through testing, document residual risk, and continuously reassess after significant changes."**
