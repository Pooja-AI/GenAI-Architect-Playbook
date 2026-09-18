# RAG vs. Fine-Tuning

Both RAG and fine-tuning adapt an LLM to a specific domain, but they solve different problems.

## RAG
- Injects external knowledge at inference time via retrieval.
- Knowledge base can be updated instantly — no retraining required.
- Answers can cite sources, improving transparency.
- Best for: factual knowledge, frequently changing data, large corpora.

## Fine-Tuning
- Adjusts the model's internal weights using labeled training examples.
- Best for: teaching new skills, style, tone, output format, or domain-specific reasoning patterns.
- Requires retraining (and cost) whenever new knowledge needs to be added.
- Doesn't inherently provide source attribution.

## Choosing Between Them
| Need | Approach |
|---|---|
| Up-to-date facts | RAG |
| Consistent tone/style | Fine-tuning |
| Source citations | RAG |
| New task behavior | Fine-tuning |
| Rapidly changing data | RAG |

In practice, many production systems combine both: a fine-tuned model for style/behavior, paired with RAG for factual grounding.
