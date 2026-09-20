# How do you perform model evaluation before production?

## Short answer
Evaluate on your own data before promoting a model, with quality, safety, latency and cost all measured.

## Key points
- Golden dataset with expected answers and expected tool calls.
- Foundry evaluators for groundedness, relevance, coherence, similarity and custom checks.
- Safety testing (jailbreak and red-team scenarios).
- Shadow or canary traffic before full rollout; gates in CI/CD.

## CWD context
The evaluation report is an artifact attached to the release approval.
