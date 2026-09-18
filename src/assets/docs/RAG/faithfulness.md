# Faithfulness in RAG

Faithfulness measures whether a generated answer's claims are actually supported by the retrieved context — a core metric for detecting hallucination in RAG systems.

## How It's Measured
1. Break the generated answer down into individual factual claims/statements.
2. For each claim, check whether it can be directly inferred or supported by the retrieved context (often using an LLM-as-judge to make this determination).
3. Compute faithfulness as the fraction of claims that are supported by the context.

## Why It Matters
An answer can be fluent, relevant, and confident while still containing unsupported or fabricated claims — faithfulness specifically targets this failure mode, independent of whether the answer *sounds* good.

## Improving Faithfulness
- Strengthen grounding instructions in the generation prompt (see `grounded-generation.md`).
- Improve retrieval quality so the necessary supporting information is actually present in context.
- Require citations, which both encourages more faithful generation and makes faithfulness easier to audit.
- Use faithfulness scores as a continuous monitoring metric to catch regressions after prompt, model, or retrieval changes.

Low faithfulness despite good retrieval usually points to a generation/prompting problem; low faithfulness with poor retrieval usually points to a retrieval problem.
