# Batch vs. Streaming Ingestion

## Overview
Choosing between batch and streaming ingestion for a GenAI data pipeline depends primarily on how quickly changes to source data need to be reflected in the retrievable knowledge base, balanced against the added complexity and cost of streaming infrastructure.

## Batch Ingestion
Data is processed in discrete, scheduled runs (e.g., nightly, hourly) — a batch job pulls all new/changed documents since the last run, processes them through the full pipeline (see enterprise-data-pipeline.md), and updates the index.

**Advantages:**
- Simpler to implement, operate, and debug than streaming infrastructure
- More cost-efficient for data that doesn't require near-real-time freshness
- Easier to apply comprehensive, resource-intensive processing (e.g., large-scale deduplication or quality checks) across a full batch

**Limitations:**
- Inherent lag between a source change and its reflection in the index (bounded by the batch schedule frequency)
- Can create large, bursty processing loads at each scheduled run rather than smooth, continuous resource utilization

## Streaming Ingestion
Data changes are processed continuously and incrementally as they occur, typically via an event-driven architecture — a change to a source document triggers immediate processing and index update.

**Advantages:**
- Minimal lag between a source change and its availability for retrieval — important for use cases where freshness is critical (e.g., a support knowledge base that must reflect policy changes within minutes)
- Smoother, more evenly distributed processing load compared to bursty batch runs

**Limitations:**
- More complex infrastructure (event sources, stream processing, more sophisticated error handling for partial/out-of-order processing)
- Harder to apply certain batch-oriented quality checks that benefit from seeing the full dataset at once
- Generally higher operational cost for the added infrastructure and continuous processing capacity

## AWS Implementation Options

### Batch
AWS Glue scheduled jobs, Step Functions triggered on a schedule (EventBridge Scheduler), or simple scheduled Lambda functions for lighter-weight batch processing.

### Streaming
S3 event notifications triggering Lambda for near-real-time processing of new/changed documents, Amazon Kinesis or Managed Streaming for Kafka (MSK) for higher-volume, continuous event streams (e.g., processing a continuous feed of support tickets or transaction records into a knowledge base).

## Hybrid Approaches
Many production systems use a hybrid: streaming ingestion for genuinely time-sensitive, high-priority content (e.g., critical policy updates) combined with batch processing for the bulk of less time-sensitive content, balancing freshness needs against overall system complexity and cost.

## Decision Framework

| Factor | Favors Batch | Favors Streaming |
|---|---|---|
| Freshness requirement (minutes vs. hours/days acceptable) | Hours/days | Minutes |
| Source data change frequency | Infrequent, predictable | Frequent, continuous |
| Team's operational maturity with event-driven architecture | Lower | Higher |
| Cost sensitivity | More cost-efficient | Higher infrastructure cost |
| Need for full-dataset quality checks during processing | Easier | Harder |

## Summary
Batch ingestion is simpler and more cost-efficient, appropriate when moderate ingestion lag is acceptable; streaming ingestion minimizes lag at the cost of added infrastructure complexity, appropriate for genuinely time-sensitive content — many production GenAI systems adopt a hybrid approach applying each pattern where it best fits the specific content's freshness requirements.
