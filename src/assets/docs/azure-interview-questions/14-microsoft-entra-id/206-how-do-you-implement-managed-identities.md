# How do you implement managed identities?

## Short answer
Enable managed identities on compute and grant them RBAC roles on target resources.

## Key points
- Container Apps, Functions and Azure ML support managed identities.
- Use DefaultAzureCredential; tokens are obtained and refreshed automatically.
- Sign-in logs show identity usage for audit.

## CWD context
Grant roles at the narrowest resource scope.
