# Data Quality for GenAI Pipelines

## Overview
The quality of a RAG or GenAI application's outputs is fundamentally bounded by the quality of its underlying data — no amount of sophisticated retrieval or prompting can fully compensate for a knowledge base full of outdated, duplicate, inconsistent, or poorly structured content. Data quality practices for GenAI pipelines address these issues systematically at the source.

## Key Data Quality Dimensions

### Freshness
Is the content in the knowledge base current, or does it include outdated information (superseded policies, old product specifications) that could mislead retrieval and generation? Stale content is a direct hallucination and incorrect-answer risk (see preventing-rag-hallucination.md).

### Duplication
Duplicate or near-duplicate documents/chunks waste retrieval slots, can cause confusing or redundant context in generated responses, and inflate storage/embedding costs unnecessarily (see duplicate-embeddings.md).

### Consistency
Conflicting information across different documents (e.g., two versions of a policy stating different values) creates ambiguity that RAG systems handle poorly by default, often confidently picking one version without acknowledging the conflict.

### Completeness
Gaps in the knowledge base — topics users ask about that simply aren't covered — lead to either appropriate "I don't know" responses (if properly handled) or hallucinated fabrications (if not), making completeness gap analysis valuable for both prioritizing content creation and understanding system limitations.

### Structural Integrity
Documents with broken formatting, garbled OCR output (for scanned content), or extraction artifacts (navigation menus, ads, boilerplate mixed into extracted text) degrade chunking and embedding quality even when the underlying information is otherwise accurate and current.

## Data Quality Practices

### Automated Quality Checks in the Pipeline
Integrate automated checks into the ingestion pipeline (see enterprise-data-pipeline.md) — flagging documents with extraction errors, unusually short or garbled extracted text, or duplicate content signatures — before they proceed to chunking and embedding.

### Content Freshness Tracking
Tag documents with source system timestamps and implement policies for flagging or deprioritizing content past a defined staleness threshold, or triggering review workflows for content approaching expiration.

### Conflict Detection
Periodically (or as part of ingestion) run similarity-based checks to identify documents covering the same topic with potentially conflicting information, surfacing these for human review and resolution (e.g., archiving the outdated version) rather than allowing both to persist indiscoverably in the knowledge base.

### Human Content Review Workflows
For high-stakes knowledge bases, establish a periodic human review cadence (content owners reviewing and confirming or updating their area's content) rather than relying solely on automated checks, particularly for content types where automated quality signals are less reliable (subtle factual staleness that doesn't manifest as an obvious structural or duplication issue).

## Measuring Data Quality Impact
Correlate data quality metrics (duplication rate, average content age, detected conflict count) with downstream RAG evaluation metrics (see rag-evaluation.md) to build an evidence-based case for data quality investment — demonstrating concretely how upstream data issues translate into downstream retrieval and generation quality problems.

## Data Quality as an Ongoing Process
Data quality isn't a one-time cleanup project — establish ongoing monitoring and periodic review processes, since knowledge bases naturally accumulate quality issues over time as new content is added, old content becomes stale, and organizational knowledge evolves.

## Summary
Data quality — freshness, deduplication, consistency, completeness, and structural integrity — fundamentally bounds achievable GenAI application quality, requiring automated pipeline checks, systematic freshness and conflict tracking, and periodic human review as an ongoing practice rather than a one-time pre-launch cleanup effort.
