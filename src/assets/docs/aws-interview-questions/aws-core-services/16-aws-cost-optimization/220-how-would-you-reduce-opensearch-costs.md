## How would you reduce OpenSearch costs?

Main idea: **store less data, retrieve efficiently, and use only the capacity you need.**

```text
Documents
   ↓
Clean + Deduplicate
   ↓
Chunk efficiently
   ↓
OpenSearch
   ↓
Efficient Retrieval
```

### Practical techniques

1. **Remove duplicate/obsolete documents** → don't index unnecessary data.
2. **Optimize chunking** → avoid creating excessive chunks.
3. **Use metadata filters first** → reduce unnecessary search work.
4. **Use hybrid search efficiently** → BM25 + vector only where needed.
5. **Right-size capacity** → avoid over-provisioning.
6. **Use lifecycle policies** → move/delete old data when business rules allow.
7. **Monitor storage and search workload** → scale capacity based on actual usage.
8. **Avoid storing large source documents** → keep originals in **S3** and store searchable chunks/metadata in OpenSearch.

### Interview answer

> “I reduce OpenSearch cost by controlling the amount of data indexed, optimizing chunking, removing duplicates, using metadata filtering, and right-sizing search capacity. I would keep large source documents in S3 and use OpenSearch primarily for chunks, embeddings, and metadata. I would also monitor search traffic, storage, and capacity utilization to avoid over-provisioning.”

**Memory:**
**Less Data → Better Chunks → Filter → Right-size → S3 for Originals**
