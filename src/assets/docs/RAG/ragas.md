# RAGAS (RAG Assessment)

RAGAS is a popular open-source framework specifically designed for evaluating RAG pipelines without requiring extensive human-labeled ground truth for every metric.

## Core Metrics
- **Faithfulness** — measures whether claims in the generated answer are supported by the retrieved context.
- **Answer Relevancy** — measures how well the generated answer addresses the original question.
- **Context Precision** — measures whether the retrieved chunks that are relevant are ranked appropriately high.
- **Context Recall** — measures whether all the information needed to answer the question was actually retrieved (requires a reference/ground-truth answer).

## How It Works
RAGAS primarily uses an **LLM-as-judge** approach: a separate LLM call evaluates properties like whether each statement in the generated answer can be traced back to the retrieved context, producing a quantitative score for each metric.

## Why Use It
- Enables automated, repeatable evaluation without manually labeling every query.
- Provides separate scores for retrieval quality vs. generation quality, making it easier to diagnose where a RAG pipeline is underperforming.
- Integrates into CI/CD pipelines for regression testing as the system evolves (see `rag-regression-testing.md`).

## Limitation
LLM-as-judge metrics inherit some of the judge model's own biases and imperfections, so RAGAS scores should be validated periodically against human judgment.
