# PII Prevention

## Overview
Personally Identifiable Information (PII) — names, addresses, government ID numbers, financial account details, health information, and similar data that can identify an individual — requires specific, systematic handling in generative AI systems to comply with privacy regulations and organizational data protection policies.

## Where PII Risk Arises in GenAI Systems
- **Ingestion**: source documents fed into a RAG knowledge base may contain PII that shouldn't be indexed, retrieved, or surfaced broadly
- **User input**: users may include PII (their own or others') in conversational input, which then becomes part of the model's context and potentially logs
- **Model output**: generated responses may include PII drawn from retrieved context or, in rare cases, fabricated PII-like content that appears plausible but is actually hallucinated
- **Logs and observability data**: full request/response logging captures any PII present in the interaction unless explicitly redacted

## Detection Techniques

### Automated PII Detection Services
Amazon Comprehend (and similar NLP-based PII detection tools) can automatically identify common PII categories (names, SSNs, emails, phone numbers, financial data) in text, enabling automated redaction or flagging during ingestion, logging, or output generation.

### Bedrock Guardrails PII Filters
Bedrock Guardrails include configurable PII detection and redaction/blocking policies applied directly to model input and output as part of the standard invocation flow (see bedrock-guardrails.md), providing enforcement independent of application-layer code correctness.

### Pattern-Based Detection
Regular-expression-based detection for well-structured PII formats (email addresses, phone numbers, specific ID number formats) as a lightweight complement to more sophisticated NLP-based detection for less structured PII (names, addresses).

## Prevention Strategies by Stage

### At Ingestion
Scan and redact or flag PII in documents before they're chunked and embedded into a RAG knowledge base, particularly for content that will be broadly retrievable — consider whether PII-containing content needs to be excluded from the knowledge base entirely or handled with additional access restrictions.

### At Input
Detect PII in user input and apply appropriate handling — redaction before storage/logging, or explicit confirmation/warning to the user if they're about to share sensitive information unnecessarily.

### At Output
Scan generated responses for PII before returning them to the user or storing them, redacting or blocking content that includes PII not appropriate for the specific context or authorization level of the recipient.

### In Logs
Apply redaction to logged prompts/responses as a matter of course, ensuring debugging and observability infrastructure doesn't become an unintended, poorly access-controlled repository of sensitive personal data.

## Regulatory Context
PII handling requirements vary by jurisdiction and data category (GDPR, CCPA, HIPAA for health information, and sector-specific regulations) — see ai-compliance.md for the broader regulatory landscape; PII prevention technical measures are typically a necessary but not sufficient component of full regulatory compliance, which also requires appropriate consent, retention, and data-subject-rights processes.

## Balancing PII Protection and Utility
Overly aggressive PII redaction can degrade legitimate functionality (e.g., a customer service agent that needs some account information to actually help the customer) — calibrate detection and redaction policies to the specific data category's sensitivity and the legitimate business need, rather than applying uniform maximal redaction that breaks core functionality.

## Summary
PII prevention in GenAI systems requires systematic detection (via automated NLP tools, guardrail configurations, and pattern matching) and appropriate handling at every stage of the data lifecycle — ingestion, input, output, and logging — calibrated to balance genuine privacy protection against legitimate application functionality.
