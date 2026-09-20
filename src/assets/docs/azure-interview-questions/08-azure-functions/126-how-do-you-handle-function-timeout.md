# How do you handle function timeout?

## Short answer
Timeouts depend on the hosting plan, and HTTP-triggered functions have a load-balancer limit of about 230 seconds.

## Key points
- Consumption plan has a short maximum; Premium and Flex allow much longer executions.
- For long tasks use a queue with a Container Apps job or Durable Functions, and return 202 to the client.

## CWD context
Design long work as asynchronous from the beginning.
