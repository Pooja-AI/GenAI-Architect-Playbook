# Tenant Isolation

## Overview
For multi-tenant generative AI applications — SaaS products serving multiple distinct customer organizations from shared infrastructure — tenant isolation ensures one tenant's data, conversations, and AI-generated outputs can never leak into or be influenced by another tenant's context, even under bugs, misconfiguration, or adversarial conditions.

## Isolation Dimensions Specific to GenAI

### Vector Store Isolation
As discussed in enterprise-rag-architecture.md and vector-database-selection.md, multi-tenant vector search requires either strict metadata filtering (with pre-filtering, not post-filtering, enforcement), separate namespaces/collections per tenant, or fully separate indices — with the strength of isolation chosen based on the sensitivity of tenant data and regulatory requirements.

### Prompt and Context Isolation
Ensure no tenant's data (documents, conversation history, custom instructions) is ever included in another tenant's context window — this requires careful scoping at every step of context construction (retrieval, memory lookup, few-shot examples) to filter strictly by the current tenant's identity.

### Model Fine-Tuning/Customization Isolation
If offering per-tenant model customization (fine-tuning on tenant-specific data), ensure the resulting customized model or its outputs cannot leak tenant-specific information to other tenants — this may require dedicated, isolated model endpoints per tenant rather than a shared endpoint switching between tenant-specific adapters without adequate isolation guarantees.

### Cache Isolation
Semantic and response caches (see semantic-caching.md) must be tenant-scoped — a cache key or namespace must incorporate tenant identity so a cached response generated for one tenant's data is never served to a different tenant, even if the query text happens to be similar.

### Logging and Observability Isolation
Ensure logs, traces, and evaluation datasets are tenant-tagged and access-controlled such that support/engineering staff (or automated systems) reviewing one tenant's logs cannot inadvertently access another tenant's data through shared observability tooling.

## Isolation Strength Levels
- **Logical isolation (shared infrastructure, filtered by tenant ID)**: most cost-efficient, requires rigorous, consistently enforced filtering logic across every code path — a single missed filter is a potential cross-tenant leakage bug
- **Physical isolation (separate infrastructure per tenant, e.g., separate vector indices, separate compute)**: strongest guarantee, higher cost and operational overhead, often reserved for the highest-sensitivity tenants or regulatory requirements

Many SaaS providers offer tiered isolation — standard logical isolation for most tenants, with an enterprise/regulated tier offering physical isolation as a premium option.

## Testing Tenant Isolation
Build automated tests that specifically attempt cross-tenant access (e.g., authenticate as Tenant A and attempt to retrieve or influence Tenant B's data) and run them regularly, including as part of CI/CD for any change touching retrieval, caching, or context-construction logic — cross-tenant leakage is a severe class of bug that deserves dedicated, ongoing test coverage rather than being caught only incidentally by general functional tests.

## Incident Response for Isolation Failures
Given the severity of a cross-tenant data leak, have a defined incident response process specifically for this failure category — including how affected tenants are identified and notified, consistent with contractual and regulatory breach-notification obligations (see ai-compliance.md).

## Summary
Tenant isolation in multi-tenant GenAI systems must be enforced consistently across vector retrieval, context construction, caching, and observability — with isolation strength (logical vs. physical) chosen based on tenant sensitivity and regulatory needs, and validated through dedicated, ongoing automated testing given the severity of any cross-tenant leakage failure.
