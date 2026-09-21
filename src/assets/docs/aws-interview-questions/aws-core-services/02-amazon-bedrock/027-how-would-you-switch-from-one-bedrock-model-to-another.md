# How would you switch from one Bedrock model to another?

## Short answer
Switch models through configuration, evaluation and a gradual rollout.

## Key points
- Model IDs in AppConfig or Parameter Store; Converse API for a uniform interface.
- Evaluate on the golden set and adjust prompts, since providers behave differently.
- Canary by percentage or tenant; keep rollback ready.
- Check quota and regional availability before cutover; watch model lifecycle and end-of-life dates.

## CWD context
Never change the model for all traffic at once.
