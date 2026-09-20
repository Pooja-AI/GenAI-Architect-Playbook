# How would you integrate LLM evaluation into CI/CD?

## Short answer
Run evaluation as a pipeline stage that can fail the build.

## Key points
- Golden dataset versioned in the repo or ADLS.
- Foundry or custom evaluators for groundedness, relevance, tool-call accuracy, task success and safety.
- Compare with the baseline; fail on regression beyond thresholds; publish the report as an artifact.
- Nightly full suite and post-deployment online evaluation.

## CWD context
Fast smoke evaluation on every PR, deeper evaluation nightly.
