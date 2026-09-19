# Embedding Pipeline Scaling

## Overview
As a knowledge base grows from thousands to millions of documents, and as update frequency increases, the embedding pipeline (see embedding-pipeline.md) can become a bottleneck constraining how current and comprehensive the retrievable knowledge base can be. This document covers strategies for scaling embedding pipeline throughput.

## Bottleneck Sources
- **Embedding API rate limits**: most embedding APIs (including Bedrock's) enforce per-account or per-model rate limits that bound how many chunks can be embedded per unit time
- **Sequential processing**: a pipeline that processes documents/chunks strictly sequentially rather than in parallel underutilizes available throughput capacity
- **Preprocessing overhead**: for very large documents or complex extraction (e.g., OCR on scanned PDFs), the preprocessing stage preceding embedding can itself become the bottleneck rather than the embedding call itself

## Scaling Strategies

### Parallelization
Distribute embedding work across many concurrent workers (using Spark, see apache-spark.md, or a fan-out pattern with Lambda/Step Functions) rather than processing chunks sequentially — the primary lever for improving raw throughput, bounded ultimately by the embedding API's rate limits.

### Batch API Usage
Use the embedding model's batch invocation capability (submitting many chunks per API call) rather than one chunk per call, significantly reducing per-call overhead and improving effective throughput within a given rate limit.

### Request Queuing and Backpressure
Use a queue (SQS) between document preprocessing and embedding invocation, allowing the embedding stage to consume at a sustainable rate matched to API rate limits, rather than preprocessing racing ahead and creating a large backlog of unprocessed, un-throttled embedding requests.

### Provisioned Throughput / Quota Increases
For sustained high-volume embedding needs, request increased service quotas or consider provisioned throughput options (where available for the specific embedding model) rather than relying entirely on on-demand rate limits and retry-based throttling absorption (see bedrock-retries-throttling.md).

### Incremental Processing
Prioritize incremental embedding of only new/changed content (see embedding-pipeline.md) over full corpus re-embedding wherever possible, since incremental volume is typically far smaller and easier to process within available throughput than a full corpus reprocessing.

### Prioritization for Time-Sensitive Content
When throughput is constrained, implement prioritization logic so time-sensitive or high-value content (e.g., recently updated critical policy documents) is embedded and indexed ahead of lower-priority content in the processing queue, rather than a simple first-in-first-out ordering that might delay important updates behind a large batch of lower-priority content.

## Monitoring Scaling Health
Track embedding pipeline lag (time between a source document change and its availability in the index) as a first-class operational metric — a growing lag trend is the primary signal that current throughput capacity is falling behind ingestion demand and scaling intervention is needed.

## Cost-Throughput Trade-offs
Scaling throughput (via parallelization, increased quotas) often has direct cost implications — evaluate the actual freshness requirements of your specific application (see batch-vs-streaming.md's decision framework) rather than over-provisioning throughput capacity beyond what's genuinely needed for acceptable knowledge base currency.

## Summary
Embedding pipeline scaling requires parallelization, batch API usage, request queuing with appropriate backpressure, and adequate quota/throughput provisioning — prioritized based on actual freshness requirements and monitored via pipeline lag as the key indicator of whether current throughput capacity is keeping pace with ingestion demand.
