For an interview, keep it **systematic and short**:

### Scenario: Request takes 30s instead of 5s

I would troubleshoot it **layer by layer**:

```text
User
 ↓
API
 ↓
Coordinator
 ↓
Delegator
 ↓
Workers / MCP
 ↓
LLM / RAG / Enterprise APIs
```

1. **Check end-to-end trace**

   * Use **Application Insights + Langfuse**.
   * Find which component consumed the extra 25 seconds.

2. **Check LLM latency**

   * Token count
   * Model response time
   * Number of LLM calls
   * Sequential vs parallel calls

3. **Check RAG**

   * Embedding latency
   * Azure AI Search latency
   * Number of retrieved documents
   * Reranking latency

4. **Check downstream APIs**

   * Salesforce / ServiceNow / SharePoint response time
   * MCP tool latency
   * Network/connectivity issues

5. **Check infrastructure**

   * CPU/memory
   * Pod/container scaling
   * Cold starts
   * Queue delays
   * Database/Redis latency

6. **Fix based on the bottleneck**

   * Parallelize independent workers
   * Reduce unnecessary LLM calls
   * Use caching
   * Optimize prompts/tokens
   * Increase replicas/autoscaling
   * Add connection pooling
   * Use timeout + retry carefully

### Strong interview sentence

> **"I would first use distributed tracing to break the 30 seconds into component-level latency. I would identify whether the bottleneck is LLM, RAG, MCP/downstream APIs, orchestration, or infrastructure, then optimize that specific bottleneck rather than making changes blindly."**
