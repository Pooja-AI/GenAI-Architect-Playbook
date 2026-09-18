# RAG Regression Testing

Regression testing ensures that changes to a RAG system — new embedding models, updated chunking strategies, prompt edits, or index rebuilds — don't silently degrade quality that was previously working well.

## Why It's Necessary
RAG systems have many interacting components; a change intended to fix one issue (e.g., a new embedding model to improve recall on Domain A) can inadvertently hurt performance elsewhere (e.g., Domain B).

## How to Set It Up
1. Maintain a **golden dataset** (see `golden-dataset.md`) covering diverse, representative queries with known expected chunks/answers.
2. Run the full evaluation suite (retrieval metrics + generation metrics like faithfulness and relevance) against this dataset **before and after every significant change**.
3. Compare scores to catch regressions before deploying to production — integrate this as an automated step in CI/CD.
4. **Version and log** which configuration (embedding model, chunking parameters, prompt template) produced each evaluation run for traceability.

## Best Practices
- Include known edge cases and previously-fixed bugs in the golden dataset so past regressions can't silently reappear.
- Periodically refresh the golden dataset as the corpus and real user query patterns evolve, to avoid overfitting improvements to a stale benchmark.
- Track evaluation metrics over time as a dashboard, not just pass/fail per change, to spot gradual quality drift.
