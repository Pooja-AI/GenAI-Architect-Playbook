# Golden Datasets for RAG Evaluation

A golden dataset is a curated set of representative queries paired with expected answers and/or expected relevant chunks, used as a consistent benchmark to evaluate and track RAG system quality over time.

## What to Include
- **Diverse query types** — factual lookups, multi-hop questions, ambiguous questions, questions with no good answer in the corpus (to test zero-result handling).
- **Expected relevant chunks/documents** — for measuring retrieval metrics like recall@k and precision@k.
- **Reference answers** — for measuring generation quality, faithfulness, and answer relevance.
- **Edge cases** — conflicting documents, outdated information, adversarial or ambiguous phrasing.

## Building One
- Start with real user queries from logs (if available), supplemented by domain-expert-written questions covering important topics.
- Have subject-matter experts label the truly relevant chunks/documents for each query — this is often the most labor-intensive but highest-value step.
- Keep the dataset version-controlled and periodically refreshed as the corpus and use cases evolve.

## Why It's Essential
Without a golden dataset, RAG quality improvements (or regressions) can only be judged anecdotally. A golden dataset enables objective, repeatable evaluation and regression testing (see `rag-regression-testing.md`) across chunking, embedding, or prompt changes.
