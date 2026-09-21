## Which LLMs did you use?

For your **CWD Onsemi enterprise AI platform**, the primary LLM choice is **Azure OpenAI**, because the solution is Azure-based and requires enterprise security, governance, and private enterprise-data integration.

### LLMs in CWD

| Purpose                                 | Model / Approach                             |
| --------------------------------------- | -------------------------------------------- |
| Main reasoning / generation             | **Azure OpenAI GPT-4o / GPT-4-class models** |
| Vision / multimodal use cases           | **GPT-4o vision capabilities**               |
| Embeddings                              | **Azure OpenAI `text-embedding-3-large`**    |
| Specialized/open-source experimentation | Hugging Face models where appropriate        |

### Where the LLM fits

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
RAG / MCP
 ↓
Relevant context + tool results
 ↓
Azure OpenAI LLM
 ↓
Response
```

The important architectural point is that **the LLM doesn't directly access Salesforce, ServiceNow, or SharePoint**.

```text
LLM
 ↓
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Salesforce / ServiceNow
```

And for enterprise knowledge:

```text
LLM
 ↑
RAG Context
 ↑
Azure AI Search
```

### How did you choose the LLM?

I would explain that we didn't select a model simply because it was the newest or largest. We evaluated based on:

* Reasoning quality
* Tool/function-calling reliability
* RAG groundedness
* Context-window requirements
* Latency
* Cost per request
* Security/governance requirements
* Multimodal requirements
* Production throughput

For example, a more expensive model might be used for **complex Coordinator reasoning**, while a smaller/cheaper model can handle simpler classification or extraction tasks.

### 🎯 Strong interview answer

> **“For CWD, Azure OpenAI was our primary LLM platform because the solution runs in the Azure enterprise ecosystem. We used GPT-4-class models for reasoning and generation, with GPT-4o capabilities for multimodal scenarios. For embeddings, we used Azure OpenAI embedding models such as text-embedding-3-large. We selected models based on reasoning quality, tool-calling, RAG groundedness, latency, cost, and enterprise governance rather than using one model for every task.”**

### Easy memory trick

**LLM → Reason**
**Embedding model → Retrieve**
**MCP → Tools**
**Azure AI Search → Knowledge**
