## Why did you select the model?

For your **CWD enterprise AI platform**, the model selection was based on **business and production requirements**, not simply choosing the largest model.

### Main factors

1. **Reasoning quality**

   * Coordinator and complex Workers need good reasoning.
   * Important for intent understanding, planning, and combining results.

2. **Tool/function calling**

   * CWD relies heavily on MCP.
   * The model needs to reliably generate structured tool calls and parameters.

3. **RAG performance**

   * The model needs to use retrieved enterprise context accurately.
   * We evaluate **faithfulness, answer relevance, context precision/recall**.

4. **Long context**

   * Customer briefings can combine information from multiple Workers and enterprise sources.
   * The model needs sufficient context without unnecessary truncation.

5. **Latency**

   * Enterprise applications need predictable response times.
   * We measure **P50/P95/P99 latency**.

6. **Cost**

   * Not every task requires the most capable model.
   * We can use smaller models for simpler tasks such as classification or extraction.

7. **Enterprise security**

   * Azure OpenAI fits our Azure enterprise environment and governance requirements.

8. **Multimodal capability**

   * Some Onsemi use cases involve images, defects, and technical documents.
   * Vision-capable models are useful for those scenarios.

---

### How I would evaluate models

I would create a representative CWD evaluation dataset:

```text id="7f2q8a"
CWD Golden Dataset
       ↓
Model A ─┐
Model B ─┼──→ Evaluate
Model C ─┘
       ↓
Quality
Tool Calling
RAG Grounding
Latency
Cost
       ↓
Production Model
```

For example:

| Area          | Metric                                   |
| ------------- | ---------------------------------------- |
| RAG retrieval | Recall@K, Precision@K, NDCG              |
| Generation    | Faithfulness, Answer Relevancy           |
| Tool usage    | Tool success rate                        |
| Performance   | P95 latency                              |
| Reliability   | Error/timeout rate                       |
| Cost          | Cost/request                             |
| Safety        | Policy violation / unsafe tool-call rate |

The actual model choice should come from these evaluations rather than assuming one model is universally best.

### 🎯 Strong interview answer

> **“We selected the Azure OpenAI model based on a combination of reasoning quality, reliable tool calling, RAG groundedness, context requirements, latency, cost, security, and multimodal capability. We evaluated candidate models using a CWD golden dataset and measured retrieval quality, faithfulness, answer relevance, tool-call success, latency, and cost. We then selected the model that met our production quality and performance requirements rather than simply choosing the largest model.”**

### Easy memory trick

**Quality → Tools → RAG → Context → Latency → Cost → Security**

A strong architect-level line:

> **“Model selection is an evaluation problem, not a model-name problem.”**
