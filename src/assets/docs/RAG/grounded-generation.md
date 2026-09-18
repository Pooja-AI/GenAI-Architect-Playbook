# Grounded Generation

Grounded generation means the LLM's output is explicitly derived from and traceable to the retrieved source documents, rather than solely from its internal (parametric) knowledge.

## Techniques for Grounding
- **Prompt instructions** — explicitly tell the model to base its answer only on the provided context and to avoid adding outside information.
- **Inline citations** — require the model to reference specific source chunks (e.g., `[1]`, `[Source: doc.pdf, p.3]`) for each claim, making it easier to verify grounding.
- **Context-only answering mode** — for high-stakes applications, instruct the model to refuse to answer if the retrieved context doesn't contain sufficient information.
- **Structured output** — ask the model to separate "answer" from "supporting evidence" fields, making grounding easier to audit programmatically.

## Why It Matters
Grounded generation increases user trust (answers can be verified against sources), reduces hallucination, and is often a compliance requirement in regulated industries (legal, healthcare, finance) where unsupported claims carry real risk.

## Evaluating Groundedness
Faithfulness metrics (see `faithfulness.md`) can automatically assess whether generated claims are actually supported by the retrieved context, providing a quantitative measure of grounding quality.
