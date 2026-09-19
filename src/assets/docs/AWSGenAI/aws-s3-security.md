# AWS S3 Security for GenAI Applications

## Overview
Amazon S3 typically serves as the foundational storage layer for GenAI applications — housing raw source documents feeding RAG pipelines, embedding backups, conversation transcripts, and evaluation datasets. Properly securing S3 is essential given the sensitive and voluminous data it often holds in GenAI architectures.

## Core S3 Security Practices

### Bucket Policies and IAM
Apply least-privilege bucket policies and IAM permissions (see aws-iam.md) scoped to exactly which identities/roles need read/write access to which specific buckets or prefixes — a document ingestion pipeline needing to read source documents shouldn't necessarily have write access to a separate bucket storing evaluation golden datasets.

### Block Public Access
Enable S3's Block Public Access settings at the account and bucket level as a default safeguard, given that GenAI application data (source documents, especially) is rarely intended for public access and accidental public exposure represents a severe, common cloud security failure mode.

### Encryption at Rest
Enable S3 server-side encryption using KMS-managed keys (see aws-kms.md) for buckets storing sensitive source documents, conversation logs, or any data subject to compliance requirements (see ai-compliance.md).

### VPC Endpoints for Private Access
Use S3 VPC endpoints (Gateway or Interface endpoints) so that compute resources (Lambda, ECS, EKS) accessing S3 do so over private AWS network paths rather than the public internet, reducing exposure and supporting stricter network security postures (see aws-networking.md).

## GenAI-Specific S3 Security Considerations

### Access Control Alignment with RAG Security Trimming
If source documents in S3 have varying sensitivity/access levels that should be reflected in downstream RAG retrieval permissions (see rag-security-trimming.md), ensure S3-level access controls and the metadata tagging used for downstream retrieval filtering are consistently derived from the same authoritative access-control source, avoiding drift between the raw document storage permissions and the retrieval-layer permissions.

### Versioning for Data Governance
Enable S3 versioning for buckets containing source documents, supporting both data governance needs (recovering from accidental deletion/overwrite) and providing an audit trail of document changes relevant to understanding knowledge base evolution over time (see schema-evolution.md and data-quality.md's freshness tracking).

### Lifecycle Policies
Configure S3 lifecycle policies to manage the retention and storage class transitions of data over time — particularly relevant for conversation logs and evaluation data that may need to be retained for compliance purposes but can transition to cheaper storage tiers once no longer needed for active, frequent access.

### Object-Level Logging
Enable S3 access logging or CloudTrail data events for buckets containing particularly sensitive content, providing granular visibility into individual object access patterns beyond what bucket-level IAM policy auditing alone provides.

## Multi-Tenant S3 Considerations
For multi-tenant GenAI SaaS applications, apply the same tenant isolation principles described in tenant-isolation.md to S3 storage — using tenant-specific prefixes or separate buckets with strictly enforced per-tenant IAM policies, ensuring one tenant's documents can never be accessed through a misconfigured or overly broad permission granted for another tenant's processing pipeline.

## Summary
S3 security for GenAI applications requires least-privilege bucket policies, blocked public access, KMS encryption, and VPC endpoint usage as baseline practices — with particular attention to consistent access-control alignment between raw document storage and downstream RAG retrieval permissions, and strict tenant isolation for multi-tenant architectures.
