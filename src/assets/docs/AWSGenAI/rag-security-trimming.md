# RAG Security Trimming

## Overview
Security trimming ensures a RAG system only retrieves and surfaces documents the requesting user is authorized to see. Without it, RAG can become a serious data leakage vector — the LLM will happily summarize a document a user should never have accessed, because retrieval and generation have no inherent concept of authorization.

## Why This Is Different from Traditional App Security
In a traditional app, access control gates which *pages or API endpoints* a user can reach. In RAG, the risk is more subtle: the LLM's final answer can be influenced by unauthorized content even if only a *fragment* of it leaks into the generated text, or if the model reveals the *existence* of a restricted document through its answer.

## Core Pattern: Pre-Filter, Not Post-Filter
Access control must be enforced as a metadata filter applied *during* the vector search query — not by retrieving broadly and then discarding unauthorized results afterward. Post-filtering:
- Wastes retrieval slots on documents that get thrown away, degrading answer quality
- Can leak information through result counts or timing side channels
- Is easy to forget to apply consistently across code paths

## Implementation Approaches

### Attribute-Based Filtering
Tag every chunk with ACL metadata at ingestion time (department, classification level, allowed group IDs). At query time, inject the requesting user's group memberships as a mandatory filter clause in the vector search request.

### Row-Level Security in the Vector Store
Some vector databases (e.g., via OpenSearch document-level security, or Aurora RLS policies) can enforce access rules at the database layer, providing defense-in-depth even if application code has a bug.

### Per-Tenant Index Isolation
For strict multi-tenant SaaS products, physically separate vector indices per tenant eliminate cross-tenant leakage risk entirely, at the cost of operational complexity and reduced resource sharing efficiency.

## Handling Group Membership Changes
ACL metadata must be kept in sync with the source system of truth (e.g., an identity provider or HR system). Stale permissions — a chunk still tagged as accessible to a group a user has since left — are a common source of security drift. Consider real-time permission checks at generation time as a secondary safeguard rather than relying solely on possibly-stale ingestion-time metadata.

## Testing and Auditing
- Build automated tests that attempt retrieval as different simulated users and assert forbidden documents never appear in results
- Log every retrieval with the requesting user, query, and returned document IDs for audit trails
- Periodically run access reviews correlating vector store ACL metadata against the source system's current permissions

## Defense in Depth
Even with correct security trimming, apply guardrails (see agent-guardrails.md and bedrock-guardrails.md) as a final layer to catch cases where sensitive content might still slip through — e.g., PII detection and redaction on the final generated response.

## Summary
Security trimming is not optional for any enterprise RAG system with heterogeneous document access levels. It must be designed in from the ingestion pipeline through the retrieval query, not bolted on afterward, and should be treated with the same rigor as any other access-control system in the enterprise.
