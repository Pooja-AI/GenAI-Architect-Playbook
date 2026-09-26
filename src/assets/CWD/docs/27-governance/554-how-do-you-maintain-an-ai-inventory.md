### How do you maintain an AI inventory?

I maintain a **centralized AI inventory/registry** for all AI assets.

1. **Inventory what?**

   * Agents
   * Models
   * Prompts
   * MCP/tools
   * RAG indexes
   * AI applications/use cases

2. **Capture metadata**

   * Name/version
   * Owner/team
   * Business purpose
   * Environment
   * Data sources
   * Dependencies
   * Risk classification
   * Approved users/agents

3. **Track lifecycle**

   ```text
   Proposed → Development → Testing → Approved → Production → Retired
   ```

4. **Track relationships**

   ```text
   Agent
     ↓
   Model + Prompt
     ↓
   Tools/MCP
     ↓
   Enterprise Data
   ```

5. **Governance status**

   * Approval status
   * Evaluation results
   * Security review
   * Last review date
   * Current production version

6. **Continuous monitoring**

   * Usage
   * Cost
   * Latency
   * Errors
   * Policy violations

### Interview answer

> **"I maintain a centralized AI inventory that tracks agents, models, prompts, tools, RAG indexes, and AI applications. For each asset, I capture ownership, purpose, version, dependencies, data sources, risk, approval status, and lifecycle state. I also maintain relationships between agents, models, tools, and data so we have end-to-end visibility and can identify what needs review when a component changes."**
