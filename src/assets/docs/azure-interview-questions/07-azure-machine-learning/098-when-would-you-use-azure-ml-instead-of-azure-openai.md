# When would you use Azure ML instead of Azure OpenAI?

## Short answer
Choose Azure ML over Azure OpenAI when a task needs a custom, cheap, fast or deterministic model.

## Key points
- Structured prediction such as scoring, classification or forecasting.
- Strict latency or cost for a narrow task.
- Data that must not leave a controlled model boundary.
- Large-scale batch scoring or self-hosted open-source models.

## CWD context
A small classifier is often cheaper and more reliable than an LLM for routing.
