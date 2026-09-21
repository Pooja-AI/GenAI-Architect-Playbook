# How do you select a Bedrock model?

## Short answer
Select the smallest model that meets the quality bar for each task, proven on your own data.

## Key points
- Criteria: quality, latency, cost per token, context window, tool use and structured output, region and quota, Guardrails support.
- Run the golden dataset per candidate; compare quality, latency and cost.
- Use the Converse API to keep the choice swappable.

## CWD context
Start larger, then downshift tasks that stay above threshold.
