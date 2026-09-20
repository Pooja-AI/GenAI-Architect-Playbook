# How would you privately access Azure OpenAI?

## Short answer
Create a private endpoint for the Azure OpenAI account and link the private DNS zone.

## Key points
- Private endpoint in the endpoint subnet; DNS zone for Azure OpenAI / Cognitive Services.
- Disable public network access.
- Callers resolve to the private IP; RBAC with managed identity.
- On-premises callers need DNS forwarding.

## CWD context
Verify name resolution from the actual workload subnet.
