# LLM Evaluation

## Overview
LLM evaluation is the practice of systematically measuring how well a language model or LLM-based application performs against defined quality, safety, and task-completion criteria. Unlike traditional software testing with deterministic pass/fail assertions, evaluating LLM behavior requires handling inherent output variability and often subjective or nuanced quality dimensions.

## Why LLM Evaluation Is Different
- **Non-determinism**: the same input can produce different (though hopefully similarly good) outputs across runs, complicating simple exact-match testing
- **Open-ended quality dimensions**: correctness, helpfulness, tone, and safety are often matters of degree rather than binary pass/fail
- **Task diversity**: a single application may need evaluation across many different sub-tasks (retrieval, reasoning, generation, tool use) each with different appropriate metrics

## Evaluation Dimensions
- **Task accuracy/correctness**: does the output correctly accomplish the intended task?
- **Groundedness/faithfulness**: for RAG and knowledge-grounded tasks, is the output supported by the provided context? (see groundedness-evaluation.md)
- **Helpfulness**: does the response genuinely address the user's underlying need, not just technically answer the literal question?
- **Safety and appropriateness**: does the output avoid harmful, biased, or policy-violating content?
- **Format/instruction adherence**: does the output follow specified formatting, length, or structural requirements?
- **Latency and cost**: operational dimensions that must be balanced against quality (see cost-latency-quality-tradeoff.md)

## Evaluation Methods

### Human Evaluation
Domain experts or trained raters assess outputs against a rubric — the gold standard for nuanced quality judgment but expensive and slow to scale, typically used to build golden datasets (see golden-dataset.md) and periodically validate automated methods.

### LLM-as-Judge
A strong LLM scores outputs against a defined rubric, offering scalability far beyond human evaluation at some cost to reliability — requires validation against human judgment and awareness of known judge biases (e.g., preferring longer, more confident-sounding, or more similarly-formatted-to-examples outputs).

### Automated Metrics
Reference-based metrics (exact match, ROUGE, BLEU, semantic similarity via embeddings) for tasks with well-defined correct answers; less useful for open-ended generation where many different phrasings could be equally valid.

### A/B Testing and Online Evaluation
Measuring real user behavior signals (satisfaction ratings, task completion rates, follow-up question frequency, escalation rates) in production — captures real-world quality signal automated offline metrics may miss, but requires sufficient traffic and careful experimental design to draw valid conclusions.

## Building an Evaluation Program
1. Define the specific quality dimensions that matter for your application (not a generic, one-size-fits-all rubric)
2. Build a representative golden dataset covering common cases, edge cases, and known failure modes
3. Choose appropriate automated and human evaluation methods for each dimension
4. Run evaluation continuously — pre-deployment (regression testing, see llm-regression-testing.md) and in production (ongoing monitoring, see production-monitoring.md)
5. Feed evaluation findings back into prompt/system improvements, closing the loop

## Common Pitfalls
- Evaluating only on easy, clean test cases that don't reflect the messiness of real user queries
- Relying solely on a single automated metric without human validation, especially for open-ended generation tasks
- Treating evaluation as a one-time pre-launch activity rather than an ongoing production practice
- Not decomposing end-to-end evaluation into component-level evaluation (retrieval vs. generation, planning vs. execution) needed to diagnose where quality issues actually originate

## Summary
LLM evaluation requires a multi-method approach — combining human judgment, LLM-as-judge scoring, automated metrics, and production signal — applied continuously across a representative, well-maintained test set, decomposed by the specific quality dimensions and system components relevant to your application.
