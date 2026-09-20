# How would APIM route requests to CWD?

## Short answer
Route requests by importing the API definition and pointing operations at internal backends.

## Key points
- set-backend-service to the internal FQDN of the Container App.
- Version-based paths; backend pools for multi-region.
- Forward correlation ID, identity and tenant headers; use managed identity to call the backend.

## CWD context
Routing policy is code, stored and deployed through the pipeline.
