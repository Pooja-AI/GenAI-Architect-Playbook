# How do you prevent sensitive data from being sent to the model?

## Short answer
Keep sensitive data out of the model by controlling what is retrieved and what is sent.

## Key points
- Entitlement-first retrieval so only documents the user may see reach the context.
- Data minimisation: send needed fields, not whole records.
- PII detection and masking (Azure AI Language PII, Presidio) and Purview sensitivity labels.
- Redact prompts in logs; private endpoints; regional deployments for residency.

## CWD context
The LLM never decides access; authorization happens before the prompt is built.
