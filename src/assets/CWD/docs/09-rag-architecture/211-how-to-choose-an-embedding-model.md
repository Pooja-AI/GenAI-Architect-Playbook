## How do you choose an embedding model?

I choose an embedding model based on **retrieval quality + cost + latency**, not just model size.

### For CWD, I look at 5 things:

1. **Retrieval quality**

   * Does it retrieve the right documents?
   * Measure **Recall@K, Precision@K, MRR/NDCG**.

2. **Domain performance**

   * Test it with our actual enterprise content:
   * technical documents
   * product terminology
   * troubleshooting information
   * business terms

3. **Embedding dimensions**

   * Higher dimensions can represent information more richly but increase storage/index size.

4. **Latency and scalability**

   * How quickly can we generate embeddings?
   * Can it handle thousands/millions of chunks?

5. **Cost**

   * Embedding cost during ingestion
   * Storage cost
   * Query-time embedding cost

### Evaluation process

```text id="7f0l7c"
Candidate Embedding Models
          ↓
Same CWD Test Dataset
          ↓
Generate Embeddings
          ↓
Azure AI Search
          ↓
Recall@K / Precision@K
          ↓
Answer Quality
          ↓
Latency + Cost
          ↓
Select Model
```

### Example

Suppose we compare:

```text id="8qv1o9"
Model A → Recall@5 = 88% → lower cost
Model B → Recall@5 = 94% → higher cost
```

We don't automatically choose B. We evaluate whether the **6% retrieval improvement justifies the additional cost/latency** for the business use case.

### 🎯 Strong interview answer

> **“I choose an embedding model based on retrieval quality, domain performance, latency, scalability, dimensions, and cost. For CWD, I would evaluate candidate models on a representative golden dataset using metrics such as Recall@K, Precision@K and MRR, then measure downstream answer quality, latency, and cost. The final model is selected based on the required quality and production trade-offs, not simply because it is the largest model.”**

### Easy memory trick

**Quality → Domain → Dimensions → Latency → Cost**

And one important point:

> **Changing the embedding model usually requires re-embedding the documents, so I also consider migration and index-rebuild cost.**
