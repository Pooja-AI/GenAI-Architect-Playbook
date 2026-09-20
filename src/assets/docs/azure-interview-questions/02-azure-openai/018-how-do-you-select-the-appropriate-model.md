# How do you select the appropriate model?

## Short answer
Select the smallest model that meets the quality bar for each task, proven with evaluation.

## Key points
- Criteria: task complexity, latency SLO, cost per token, context window, tool-calling and structured-output support, region and quota.
- Run the golden dataset per task against candidates and compare quality, latency and cost.
- Start with a larger model, then downshift tasks that stay above threshold.
- Keep the mapping in configuration and version it.

## CWD context
Say "we route per task" and give an example: mini for intent, flagship for final synthesis.
