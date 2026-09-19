# Handling Failed Data Jobs

## Overview
Data pipeline jobs — ingestion, preprocessing, chunking, embedding, indexing — will fail at various points due to transient errors, malformed source data, downstream service issues, or bugs. Robust failure handling ensures these failures are caught, don't silently corrupt the knowledge base, and can be efficiently diagnosed and remediated.

## Types of Data Job Failures

### Transient Failures
Temporary network issues, rate limiting from an embedding API or source system, or brief downstream service unavailability — typically resolved by retry with backoff (see bedrock-retries-throttling.md for the underlying pattern, applicable here to any external API call within the pipeline).

### Data-Related Failures
Malformed source documents, unexpected schema changes (see schema-evolution.md), content that fails preprocessing (e.g., corrupted files, unsupported formats), or chunks that exceed size limits for the embedding model — generally not resolved by simple retry, since the underlying data issue persists across attempts.

### Systemic/Infrastructure Failures
Bugs in pipeline code, misconfiguration, insufficient resource allocation causing out-of-memory or timeout failures at scale — require code or configuration fixes rather than retry or data-specific remediation.

## Failure Handling Strategies

### Per-Item Failure Isolation
Design pipeline stages so that an individual document/chunk failure doesn't cause the entire batch/job to fail — isolate and log the specific failure while allowing successfully processed items to proceed, then separately address the failed subset.

### Dead-Letter Queues
For queue-based pipeline architectures (see batch-vs-streaming.md), route items that fail processing after exhausting retries to a dead-letter queue for separate investigation and reprocessing, rather than either blocking the main pipeline or silently dropping failed items.

### Automated Retry with Backoff
Apply exponential backoff retry logic for transient failure categories, distinguishing them from data-related failures that retry logic won't resolve (avoid wasting retry attempts on failures that are genuinely not transient).

### Alerting on Failure Rate Thresholds
Rather than alerting on every individual item failure (which would create excessive noise given that some baseline failure rate is often expected, e.g., a small percentage of malformed source documents), alert when the failure rate exceeds an expected baseline threshold, indicating a systemic issue worth investigating.

### Idempotent Reprocessing
Design pipeline jobs to be safely re-runnable/idempotent, so that reprocessing a failed item (or re-running an entire failed job) doesn't create duplicate entries or other side effects from the partially completed prior attempt.

## Diagnosing Failed Jobs
Maintain detailed logs for failed items including the specific error, the input data or reference to it, and the pipeline stage where the failure occurred — this level of detail is essential for efficiently diagnosing whether a given failure category requires a data fix (e.g., excluding a specific document type from the pipeline), a code fix, or is simply an expected, low-rate transient failure not warranting further action.

## Monitoring and Reporting
Track failure rate trends over time, broken down by failure category and pipeline stage, as part of the broader pipeline health monitoring described in enterprise-data-pipeline.md — a sudden spike in a specific failure category is often the earliest signal of an upstream data quality or schema change issue before it manifests as a broader downstream RAG quality problem.

## Summary
Robust handling of failed data jobs requires per-item failure isolation, dead-letter queues for items requiring separate investigation, appropriate retry logic distinguishing transient from data-related failures, and failure-rate-threshold-based alerting — all supported by detailed failure logging to enable efficient root-causing and remediation.
