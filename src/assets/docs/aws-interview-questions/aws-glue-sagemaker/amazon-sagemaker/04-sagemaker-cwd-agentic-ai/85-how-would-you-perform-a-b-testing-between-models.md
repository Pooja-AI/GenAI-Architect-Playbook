# How would you perform A/B testing between models?

## Short answer
A/B test with production variants that split traffic by weight.

## Key points
- Variants under one endpoint, for example 90/10; optionally target a variant explicitly.
- Compare invocation metrics and model quality per variant; use statistics.
- Adjust weights with UpdateEndpointWeightsAndCapacities and promote the winner.

## CWD context
Define success metrics before starting.
