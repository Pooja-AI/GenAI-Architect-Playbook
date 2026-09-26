### How do you implement Responsible AI?

I implement it across the **AI lifecycle**, not as a single check.

1. **Fairness**

   * Test outputs for unwanted bias across relevant user/data groups.
   * Monitor for drift after deployment.

2. **Transparency**

   * Track model, prompt, and agent versions.
   * Provide citations/explanations where appropriate.

3. **Privacy**

   * Minimize PII.
   * Apply RBAC/ABAC, ACL filtering, encryption, and DLP.

4. **Safety**

   * Content safety/guardrails.
   * Prompt-injection and jailbreak testing.
   * Restrict sensitive tool actions.

5. **Accuracy & Grounding**

   * Evaluate hallucination, groundedness, and answer relevance.
   * Require citations for enterprise RAG responses.
   * Use fallback when evidence is insufficient.

6. **Human oversight**

   * Require human approval for high-impact or destructive actions.

7. **Monitoring & audit**

   * Track quality, safety violations, data access, tool calls, latency, and cost.
   * Maintain audit trails.

8. **Governance**

   * Maintain approval processes for models, agents, prompts, tools, and data.
   * Reassess risk whenever significant changes are made.

### Interview answer

> **"I implement Responsible AI across the full lifecycle by addressing fairness, transparency, privacy, safety, accuracy, and human oversight. In CWD, I use access controls and DLP for privacy, guardrails and tool restrictions for safety, RAG evaluation and citations for groundedness, human approval for sensitive actions, and continuous monitoring and auditing. Every major model, agent, prompt, or tool change goes through evaluation and governance before production."**
