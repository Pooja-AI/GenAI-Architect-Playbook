### Scenario 5: RAG returns irrelevant documents

I would troubleshoot the **retrieval pipeline layer by layer**:

1. **Check the query**

   * Is the user query clear?
   * Is query rewriting needed?

2. **Check chunking**

   * Are chunks too large or too small?
   * Do chunks contain enough context?

3. **Check embeddings**

   * Are we using the correct embedding model?
   * Are query and documents embedded consistently?

4. **Check retrieval**

   * Is `Top-K` too high?
   * Compare **vector search vs BM25 keyword search**.

5. **Use hybrid search + reranking**

   * Combine semantic/vector + keyword search.
   * Use a reranker to move the most relevant documents to the top.

6. **Check metadata/ACL filters**

   * Customer ID, document type, department, access permissions, etc.
   * Make sure irrelevant documents are filtered before retrieval.

7. **Evaluate**

   * Use **Recall@K, Precision@K, MRR**, and RAGAS metrics.

### Interview answer

> **"I would first inspect the retrieved documents and determine whether the problem is query understanding, chunking, embeddings, retrieval, or filtering. I would use hybrid search with metadata and ACL filters, followed by reranking. Then I would measure retrieval quality using Precision@K, Recall@K, MRR, and RAGAS to verify the improvement."**
