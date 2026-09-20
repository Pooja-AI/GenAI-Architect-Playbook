# How would you deploy Azure Functions?

## Short answer
Deploy Functions from a package, with slots where the plan supports them.

## Key points
- Zip deploy or run-from-package built in the pipeline.
- Deployment slots (Premium or Dedicated) allow warm-up and swap; other plans need a different rollout approach.
- App settings and managed identity per environment; smoke test then swap or roll back.

## CWD context
Confirm what your hosting plan supports before designing the release.
