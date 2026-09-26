### How would you prevent prompt/version conflicts?

Use **centralized versioning + immutable releases + dependency tracking**.

* **Prompt Registry** → every prompt has a unique version.
* **Immutable versions** → once released, don't modify `v3`; create `v4`.
* **Agent → Prompt mapping** → each agent references an exact approved prompt version.
* **Model compatibility** → track which model version was tested with the prompt.
* **Environment promotion** → Dev → Test → Staging → Prod.
* **Evaluation gate** → validate new prompt versions before production.
* **Canary deployment** → test new version with limited traffic.
* **Rollback** → switch the agent back to the previous approved version.
* **Dependency tracking** → track Agent → Prompt → Model → Tools.

**Example:**

```text
CustomerBriefing Agent
        ↓
Prompt v3
        ↓
GPT-4.x
        ↓
Approved Production Release

New change
        ↓
Prompt v4 → Evaluate → Canary → Production
```

**Interview answer:**

> “We prevent prompt and version conflicts by using a centralized Prompt Registry with immutable versions. Each agent references an exact approved prompt and model version rather than using a floating ‘latest’ version. Changes go through evaluation, approval, and controlled promotion, with dependency tracking and rollback available if the new version causes issues.”
