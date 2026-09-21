# How would you integrate API Gateway with Lambda?

## Short answer
Integrate with Lambda through proxy integration and resource permissions.

## Key points
- Lambda proxy passes the request event and returns the response.
- Grant invoke permission to API Gateway; use aliases for traffic shifting.
- Synchronous payload limit and the 29-second timeout apply.

## CWD context
Use it for light endpoints such as auth hooks and status checks.
