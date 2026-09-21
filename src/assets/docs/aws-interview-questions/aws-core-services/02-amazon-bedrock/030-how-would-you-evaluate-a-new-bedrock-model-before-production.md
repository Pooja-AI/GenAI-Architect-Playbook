# How would you evaluate a new Bedrock model before production?

## Short answer
Evaluate a new model on your data, with quality, safety, latency, cost and quota all measured.

## Key points
- Bedrock model evaluation (automatic, LLM-as-judge or human) or your own harness on the golden dataset.
- RAG evaluation for groundedness and relevance; guardrail and red-team tests.
- Shadow traffic, then canary; CI/CD gate; add the model to the approved allow-list only after passing.

## CWD context
The evaluation report is an artifact attached to the release approval.
