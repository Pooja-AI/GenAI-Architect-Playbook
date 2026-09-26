### How do you govern prompts?

I would use a **Prompt Registry + versioning + evaluation + approval** process.

1. **Prompt Registry**

   * Store prompts centrally.
   * Example: `CustomerBriefingPrompt v1.2`.

2. **Version control**

   * Every prompt change creates a new version.
   * Never directly overwrite the production prompt.

3. **Ownership**

   * Each prompt has an owner, purpose, model, and associated agent.

4. **Testing & evaluation**

   * Test new prompts against a fixed evaluation dataset.
   * Check **accuracy, groundedness, hallucination, safety, and token usage**.

5. **Approval**

   * Only approved prompt versions can move to production.

6. **Deployment**

   * Use **dev → test → staging → production**.
   * Use canary/A-B testing for significant changes.

7. **Monitoring & rollback**

   * Monitor quality, latency, token consumption, and failures.
   * If performance drops, quickly roll back to the previous prompt version.

### Interview answer

> **"I govern prompts using a centralized Prompt Registry with versioning, ownership, evaluation, and approval. Every change is tested against a fixed evaluation dataset for quality, groundedness, safety, and token usage before production. I deploy prompts through controlled environments and monitor them in production, with rollback available if a new version causes regression."**
