# AWS EKS for GenAI Applications

## Overview
Amazon Elastic Kubernetes Service (EKS) provides managed Kubernetes infrastructure suited to GenAI workloads requiring long-running orchestration, custom model hosting, or complex multi-agent systems that exceed what serverless compute (Lambda) comfortably handles — as introduced in the lambda-vs-eks.md comparison.

## When EKS Fits GenAI Workloads
- **Long-running multi-agent orchestration**: complex agentic workflows (see the Multi-Agent Systems section) that run for extended durations beyond Lambda's execution time limits
- **Custom/self-hosted model serving**: hosting open-source or custom foundation models (potentially via SageMaker-adjacent infrastructure or directly on EKS with GPU node groups) requiring fine-grained control over serving infrastructure
- **High-throughput, steady-state workloads**: where the operational overhead of managing a cluster is justified by cost efficiency at sustained high volume compared to Lambda's per-invocation pricing
- **Persistent connections/streaming at scale**: applications requiring long-lived WebSocket connections or other persistent-connection patterns not naturally suited to Lambda's request/response model

## Key EKS Architecture Considerations for GenAI

### GPU Node Groups
For self-hosted model inference (via SageMaker or custom serving frameworks deployed on EKS), configure GPU-enabled node groups with appropriate instance types, and use Kubernetes device plugins to properly schedule GPU-requiring workloads.

### Autoscaling
Configure Horizontal Pod Autoscaling (based on custom metrics like request queue depth or GPU utilization, not just CPU) and Cluster Autoscaler (or Karpenter) to dynamically adjust node capacity in response to GenAI workload demand, balancing responsiveness to load spikes against cost efficiency during lower-demand periods.

### Service Mesh for Multi-Agent Communication
For complex multi-agent systems with many services communicating (see agent-communication.md), a service mesh (e.g., App Mesh or Istio) can provide observability, traffic management, and mutual TLS security for inter-service communication, supporting the comprehensive tracing needs described in multi-agent-observability.md.

### IAM Integration via IRSA
Use IAM Roles for Service Accounts (IRSA) to grant Kubernetes pods fine-grained, least-privilege AWS permissions (e.g., a specific pod's service account granted only the Bedrock and S3 permissions it needs) rather than broadly scoped node-level IAM roles shared across all pods on a node — directly implementing the least-privilege principles described in aws-iam.md within a Kubernetes context.

## Deploying LangGraph and Multi-Agent Applications on EKS
For LangGraph-based applications requiring long-running execution or high throughput (see langgraph-production-deployment.md), EKS provides the container orchestration platform to run graph execution workers, with checkpoint state persisted to an external durable store (DynamoDB or Aurora) rather than relying on pod-local storage, ensuring resumability even if a pod is rescheduled.

## Operational Overhead Trade-off
EKS provides substantial flexibility and control but requires genuine Kubernetes operational expertise — cluster upgrades, security patching, networking configuration, and general cluster health management are ongoing responsibilities that a Lambda-based architecture largely avoids. Organizations without existing Kubernetes investment should carefully weigh this operational cost against the specific capabilities EKS provides that Lambda or Step Functions cannot adequately deliver (see lambda-vs-eks.md's decision framework).

## Summary
EKS provides the container orchestration platform needed for GenAI workloads requiring long-running execution, custom GPU-based model hosting, high sustained throughput, or complex multi-agent service architectures — at the cost of meaningfully greater operational complexity than serverless alternatives, making it the right choice specifically when Lambda's constraints (execution time limits, cold starts, per-invocation model) don't fit the workload's genuine requirements.
