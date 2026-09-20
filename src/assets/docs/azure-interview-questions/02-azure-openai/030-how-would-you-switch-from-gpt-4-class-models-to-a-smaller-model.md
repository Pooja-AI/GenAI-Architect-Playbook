# How would you switch from GPT-4-class models to a smaller model?

## Short answer
Move to a smaller model task by task, with evidence, not all at once.

## Key points
- Pick tasks that are simple (classification, extraction, routing).
- Build a task-specific evaluation set and compare baseline versus small model.
- Set an acceptance threshold; tighten the prompt or add few-shot examples if needed.
- Shadow test, then canary a percentage; keep the larger model as fallback.

## CWD context
Track savings and quality side by side so the trade-off is visible.
