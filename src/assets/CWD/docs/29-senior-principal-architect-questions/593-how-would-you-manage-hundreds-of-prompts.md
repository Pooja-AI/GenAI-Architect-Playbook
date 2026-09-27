### How would you manage hundreds of prompts?

I would use a **centralized Prompt Registry** with metadata, versioning, ownership, and lifecycle management.

* **Organize by domain/use case** → Sales, IT, HR, Customer Briefing, etc.
* **Unique prompt ID** → e.g., `customer_briefing_summary`.
* **Version control** → v1, v2, v3; immutable released versions.
* **Metadata** → owner, purpose, model, agent, environment, status.
* **Evaluation** → accuracy, groundedness, safety, latency, token usage.
* **Approval workflow** → draft → tested → approved → production.
* **Search/tagging** → quickly find prompts by domain, agent, model, or status.
* **Deprecation** → identify unused/old prompts and retire them.
* **Usage monitoring** → track which agents use each prompt and its performance.

**Interview answer:**

> “For hundreds of prompts, I would treat prompts as governed software assets. A centralized Prompt Registry would provide unique IDs, versioning, ownership, metadata, evaluation results, approval status, and dependency tracking. Agents would reference specific approved versions, and we would monitor usage and performance so outdated prompts can be safely deprecated or rolled back.”
