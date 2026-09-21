# Why use API Gateway for CWD?

## Short answer
API Gateway centralises security and traffic control so the CWD backend stays simple.

## Key points
- Authentication, throttling, validation, WAF, logging and metrics in one managed layer.
- Private integration to ECS; custom domains and stages.
- Removes cross-cutting code from the application.

## CWD context
Clients never see backend addresses.
