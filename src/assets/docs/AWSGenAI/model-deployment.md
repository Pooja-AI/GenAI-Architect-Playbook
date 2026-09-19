# Model Deployment

## Overview
Model deployment is the process of making a trained machine learning model available for inference in production, whether serving real-time requests, processing batch workloads, or running at the edge. For traditional ML models, this typically involves Amazon SageMaker's deployment capabilities; for foundation models, deployment is largely abstracted away by Bedrock's managed inference (see what-is-amazon-bedrock.md).

## Deployment Patterns

### Real-Time Inference Endpoints
A persistently running, auto-scaling endpoint that serves individual prediction requests with low latency — appropriate for interactive applications needing immediate model predictions (e.g., a fraud-risk score needed synchronously as part of a transaction flow).

### Batch Transform
Processing a large volume of inference requests as a batch job rather than maintaining a persistently running endpoint — appropriate for non-time-sensitive bulk scoring (e.g., scoring an entire customer database overnight) where the cost savings of not maintaining an always-on endpoint outweigh the need for immediate results.

### Asynchronous Inference
For requests with larger payloads or longer processing times that don't fit real-time latency requirements but still need a response sooner than a full batch job cycle — SageMaker Asynchronous Inference queues requests and processes them without requiring a persistently active connection, auto-scaling down to zero when idle.

### Serverless Inference
For workloads with intermittent, unpredictable traffic where maintaining a persistently provisioned endpoint would be wasteful, serverless inference options automatically provision and scale compute in response to request volume, trading some cold-start latency for reduced idle cost.

## Deployment Considerations

### Instance/Compute Sizing
Selecting appropriate compute (CPU vs. GPU, instance size) based on the model's resource requirements and the latency/throughput needs of the application — over-provisioning wastes cost, under-provisioning risks latency or throughput issues under load.

### Auto-Scaling Configuration
Configure auto-scaling policies for real-time endpoints based on expected traffic patterns and latency requirements, balancing responsiveness to load spikes against cost efficiency during low-traffic periods.

### Multi-Model Endpoints
For scenarios with many similar, moderately-sized models (e.g., a per-tenant fine-tuned model in a multi-tenant SaaS context), SageMaker multi-model endpoints allow serving multiple models from a shared endpoint infrastructure, improving resource utilization compared to dedicating separate endpoint infrastructure to each individual model.

### A/B Testing and Shadow Deployment
Deploy a new model version alongside the current production version, routing a portion of traffic (A/B testing) or mirroring traffic without affecting the response (shadow deployment) to validate the new model's real-world performance before fully committing to it — analogous to the staged rollout practices described in genai-ci-cd.md for generative AI applications.

## Deployment for Foundation Models vs. Traditional ML
Foundation models accessed via Bedrock don't require this deployment infrastructure management — Bedrock handles hosting, scaling, and inference infrastructure entirely, with the "deployment" concern shifting to prompt/configuration management (see prompt-versioning.md) and model version selection (see model-versioning.md) rather than infrastructure provisioning. This deployment infrastructure discussion applies specifically to traditional ML models or self-hosted custom/open-source foundation models via SageMaker (see bedrock-vs-sagemaker.md).

## Monitoring Post-Deployment
Once deployed, continuously monitor the model's production performance (see ml-model-monitoring.md), latency, and resource utilization, feeding findings back into decisions about retraining, scaling adjustments, or infrastructure changes.

## Summary
Model deployment for traditional ML models on AWS spans real-time, batch, asynchronous, and serverless inference patterns via SageMaker, each suited to different latency and traffic pattern requirements — a distinct concern from foundation model "deployment" via Bedrock, where infrastructure management is abstracted away in favor of prompt and configuration management concerns.
