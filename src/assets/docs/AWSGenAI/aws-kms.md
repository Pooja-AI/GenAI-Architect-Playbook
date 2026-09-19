# AWS KMS for GenAI Applications

## Overview
AWS Key Management Service (KMS) provides centralized encryption key management, enabling encryption at rest for the data infrastructure underlying GenAI applications — documents, embeddings, conversation logs, and checkpointed agent state — as a foundational data protection control.

## Where Encryption Matters in GenAI Architectures
- **S3 buckets** storing raw source documents, embeddings backups, and conversation transcripts
- **Vector stores** (OpenSearch, Aurora pgvector) containing embedded document content and potentially sensitive metadata
- **DynamoDB tables** storing session state, agent checkpoints (see langgraph-checkpointing.md), and conversation history
- **CloudWatch Logs** capturing request/response data, which may contain sensitive content unless properly redacted (see pii-prevention.md)

## KMS Key Types

### AWS Managed Keys
Keys automatically created and managed by AWS for specific services, requiring no direct management overhead but offering less granular control over key policies and rotation schedules.

### Customer Managed Keys (CMK)
Keys you create and control, allowing custom key policies (fine-grained control over who can use the key for encryption/decryption), custom rotation schedules, and the ability to disable or revoke the key independently — generally preferred for sensitive GenAI data given the additional control and auditability.

## Key Policy Design
Structure KMS key policies to enforce least-privilege access to encryption/decryption operations — not every service or role that can access an encrypted resource necessarily needs the ability to use the associated KMS key directly, and separating these concerns provides an additional layer of access control beyond the resource-level IAM permissions discussed in aws-iam.md.

## Envelope Encryption
KMS uses envelope encryption for most integrations — data is encrypted with a data key, which is itself encrypted by the KMS master key — providing efficient encryption of large volumes of data (like a large document corpus) without requiring every encryption operation to directly call KMS for the bulk data itself.

## Cross-Service Encryption Consistency
Apply consistent KMS-based encryption across every data store in the GenAI pipeline — it's a common gap for teams to properly encrypt a primary database while overlooking secondary stores like caching layers (see semantic-caching.md) or checkpoint stores (see langgraph-checkpointing.md), leaving a gap in the overall encryption posture.

## Key Rotation
Configure automatic key rotation (supported natively for AWS-managed keys and configurable for customer-managed keys) to limit the exposure window if a key is ever compromised, consistent with standard cryptographic hygiene practices.

## Auditing Key Usage
CloudTrail logs every KMS API call (encrypt, decrypt, key policy changes), providing visibility into exactly which resources and identities are using which keys — valuable both for security monitoring and for demonstrating compliance with data protection requirements during audits (see ai-compliance.md).

## Multi-Region and Cross-Account Considerations
For multi-region GenAI architectures (see bedrock-model-fallback.md's multi-region fallback pattern), plan KMS key strategy carefully — multi-region keys or appropriately replicated key policies are needed to support encrypted data access and fallback across regions without introducing encryption-related availability gaps.

## Summary
AWS KMS provides the encryption key management foundation for protecting GenAI application data at rest — applied consistently across every data store in the architecture (documents, vector stores, session/checkpoint state, logs), with customer-managed keys and carefully designed key policies providing the granular control and auditability appropriate for sensitive generative AI application data.
