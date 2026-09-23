### Interview answer

> **I would reduce CWD operational cost by reducing unnecessary LLM usage first, then optimizing infrastructure, retrieval, tool calls, and workflow execution. I would focus on cost per successful business outcome rather than simply reducing the number of resources.**
>
> **First, I would introduce model routing.** I wouldn't use an expensive reasoning model for every task. Simple intent classification, extraction, summarization, and validation could use smaller models, while complex reasoning would use a larger model.
>
> **Second, I would reduce token consumption.** I would control conversation history, use targeted context retrieval, summarize long histories, remove duplicate context, and retrieve only the relevant documents.
>
> **Third, I would optimize RAG.** Instead of retrieving 20–30 documents and sending all of them to the LLM, I would use hybrid search, metadata/ACL filtering, reranking, and a smaller top-K before generation.
>
> **Fourth, I would cache expensive operations.** For example, frequently requested customer metadata, embeddings, retrieval results where appropriate, and deterministic intermediate results could be cached using Redis.
>
> **Fifth, I would reduce unnecessary agent execution.** Not every request needs Coordinator → Delegator → multiple Workers. A simple lookup should follow the shortest deterministic path.
>
> **Sixth, I would optimize infrastructure.** For variable workloads, I would use serverless or autoscaling services and scale AKS/containers based on actual demand rather than maintaining oversized capacity.
>
> **Seventh, I would reduce unnecessary enterprise API calls.** If Salesforce and ServiceNow information is already available from a trusted cache or recent workflow state, I wouldn't repeatedly call those systems.
>
> **Finally, I would introduce cost observability and budgets.** Every request should have a cost record covering model tokens, retrieval, compute, and external API calls. We could then identify the most expensive workflows and optimize them based on actual usage.

### CWD cost optimization

```text
User
  |
  v
Coordinator
  |
  +---- Simple request ----> Deterministic path
  |
  +---- Complex request ---> Model routing
                                |
                    +-----------+-----------+
                    |                       |
              Small/cheap model       Large model
              simple tasks            complex reasoning
```

For RAG:

```text
Documents
   ↓
Hybrid Search
   ↓
ACL + Metadata Filter
   ↓
Top-K
   ↓
Reranker
   ↓
Small relevant context
   ↓
LLM
```

Instead of:

```text
Documents
   ↓
Retrieve many documents
   ↓
Send everything to LLM
   ↓
High token cost
```

### The main cost levers

| Area                | Optimization                                   |
| ------------------- | ---------------------------------------------- |
| **LLM**             | Model routing                                  |
| **Tokens**          | Context reduction + summarization              |
| **RAG**             | Hybrid search + reranking + smaller Top-K      |
| **Caching**         | Redis for reusable results                     |
| **Agents**          | Avoid unnecessary agent hops                   |
| **MCP**             | Avoid duplicate tool calls                     |
| **Enterprise APIs** | Cache/reuse recent results                     |
| **Compute**         | Autoscaling/serverless                         |
| **Workflow**        | Async execution for long-running jobs          |
| **Monitoring**      | Cost per request/workflow                      |
| **Deployment**      | Shut down non-production resources when unused |

### A strong CWD example

Suppose a **Customer Briefing** request needs:

```text
Salesforce customer information
+
ServiceNow incidents
+
LLM summarization
```

I would execute Salesforce and ServiceNow retrieval **in parallel**, cache reusable data, send only the relevant results to the LLM, and use the least expensive model that meets the quality threshold.

So instead of optimizing only:

> **“How much does one LLM call cost?”**

I would measure:

> **“How much does it cost to successfully complete one Customer Briefing?”**

That includes **LLM + tokens + retrieval + compute + MCP/API calls + retries**.

### One-line answer to memorize

> **“I would reduce CWD cost through model routing, token and context optimization, efficient RAG, caching, fewer unnecessary agent and MCP calls, autoscaling infrastructure, and cost-per-workflow observability. The goal is not simply cheaper models—it is minimizing the total cost of producing a successful business outcome while maintaining the required quality.”**
