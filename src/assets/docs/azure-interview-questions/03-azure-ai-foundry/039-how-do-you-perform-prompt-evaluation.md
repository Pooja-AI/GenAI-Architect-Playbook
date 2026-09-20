# How do you perform prompt evaluation?

## Short answer
Evaluate prompts by running versions against a fixed dataset and comparing scores.

## Key points
- Inputs with reference answers or expected properties.
- Groundedness, relevance, coherence, fluency, similarity and custom evaluators, including LLM-as-judge.
- Compare versions side by side with thresholds.
- Automate in CI.

## CWD context
Fix temperature and run multiple samples to separate real change from noise.
