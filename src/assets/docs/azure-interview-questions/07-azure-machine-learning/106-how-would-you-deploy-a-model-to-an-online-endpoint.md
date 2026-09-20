# How would you deploy a model to an online endpoint?

## Short answer
Deploy to a managed online endpoint: a stable endpoint with one or more deployments behind it.

## Key points
- Create the endpoint (URL and auth), then a deployment (model, environment, scoring code or MLflow model, instance type and count).
- Enable Application Insights and autoscale.
- Send test traffic, then route production traffic.

## CWD context
Deployments defined in YAML and released through the pipeline.
