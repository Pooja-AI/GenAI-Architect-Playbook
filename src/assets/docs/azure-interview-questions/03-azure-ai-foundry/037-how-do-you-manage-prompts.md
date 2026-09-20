# How do you manage prompts?

## Short answer
Manage prompts as versioned artifacts, not text edited in production.

## Key points
- Store in Git or the Prompt Registry with ID, semantic version, owner, model and parameters.
- Iterate in the Foundry playground, then promote through the pipeline.
- Attach evaluation scores to each version.
- Parameterised templates with variables.

## CWD context
Every trace records the prompt version used.
