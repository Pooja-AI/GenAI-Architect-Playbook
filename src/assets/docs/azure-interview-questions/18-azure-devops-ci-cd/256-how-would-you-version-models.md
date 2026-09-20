# How would you version models?

## Short answer
Pin explicit model deployment names and versions, and change them only through evaluation and rollout.

## Key points
- Track versions in configuration and the model inventory; watch retirement dates.
- Azure ML models via registry versions.
- Store the embedding model version alongside each index.

## CWD context
Model upgrades are releases, not background events.
