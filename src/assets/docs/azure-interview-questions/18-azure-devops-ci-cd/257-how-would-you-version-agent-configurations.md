# How would you version agent configurations?

## Short answer
Treat agent configuration as versioned code.

## Key points
- Routing rules, tool allowlists, prompts, model mapping, thresholds and timeouts in files or a registry.
- Schema validation, pull requests and evaluation; promote across environments.
- Agent Registry records version, capabilities and status; contracts keep agents compatible.

## CWD context
A config change can alter behaviour as much as a code change.
