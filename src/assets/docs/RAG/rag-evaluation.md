# RAG Evaluation

Evaluating a RAG system requires assessing both the **retrieval** and **generation** components, since quality problems can originate in either stage.

## Retrieval Metrics
- **Recall@k** — fraction of relevant documents found within the top-k retrieved results.
- **Precision@k** — fraction of the top-k retrieved results that are actually relevant.
- **Mean Reciprocal Rank (MRR)** — how high the first relevant result ranks, on average.
- **NDCG** — accounts for the graded relevance and position of multiple relevant results.

## Generation Metrics
- **Faithfulness** — whether the generated answer is actually supported by the retrieved context (see `faithfulness.md`).
- **Answer relevance** — whether the answer actually addresses the user's question.
- **Context relevance** — whether the retrieved chunks were relevant to the query (see `context-relevance.md`).

## Evaluation Approaches
- **Golden dataset evaluation** — curated query/expected-answer (and/or expected-chunk) pairs run through the system regularly (see `golden-dataset.md`).
- **LLM-as-judge** — use a separate LLM to score faithfulness, relevance, and correctness of generated answers, often via frameworks like RAGAS (see `ragas.md`).
- **Human evaluation** — spot-check and rate real production interactions, especially for nuanced quality judgments automated metrics might miss.

Continuous evaluation is essential — RAG systems degrade silently as the corpus, embedding model, or prompt templates change over time.
