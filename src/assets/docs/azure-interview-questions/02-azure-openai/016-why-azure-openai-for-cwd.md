# Why Azure OpenAI for CWD?

## Short answer
Azure OpenAI provides OpenAI-class models with enterprise controls: private networking, Entra authentication, content filtering, regional data residency and Azure compliance.

## Key points
- Microsoft states prompts and completions are not used to train the base models.
- Private endpoints plus managed identity mean no API keys in code.
- Built-in content filters, and Prompt Shields via Azure AI Content Safety for injection and jailbreak detection.
- Deployment types (Standard, Provisioned/PTU, Global, Data Zone) trade cost, latency and residency.
- Tight integration with AI Search, Foundry, APIM and Monitor.

## CWD context
Trade-off is model availability and lag versus direct OpenAI, mitigated by a model-abstraction layer.
