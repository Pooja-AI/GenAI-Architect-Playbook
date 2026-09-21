# How do you configure request validation?

## Short answer
Validate requests at the gateway before the backend runs.

## Key points
- REST API request validators and JSON Schema models for body, parameters and headers; 400 on failure.
- Payload size limits; reject unknown fields.
- Application-level schema validation (for example Pydantic) as a second layer.

## CWD context
Rejected requests cost almost nothing.
