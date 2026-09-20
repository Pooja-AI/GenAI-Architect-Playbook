# How do you prevent prompt injection?

## Short answer
Defend against prompt injection in layers; no single control is enough.

## Key points
- Keep instructions separate from data; treat retrieved and tool content as untrusted.
- Use Prompt Shields for user prompts and documents.
- Enforce authorization in code, not in the prompt; give tools least privilege.
- Validate model output against a schema; require human approval for destructive actions.
- Apply ACL filtering before retrieval; red-team regularly.

## CWD context
Indirect injection (malicious text inside a document or tool result) is the bigger risk in an agentic system.
