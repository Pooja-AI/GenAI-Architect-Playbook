# How would you encrypt S3 data?

For CWD, I would use **encryption at rest with SSE-KMS** and **TLS encryption in transit**.

```text
CWD Worker
    │
    │ HTTPS / TLS
    ▼
   S3
    │
    │ SSE-KMS
    ▼
 KMS Key
```

## 1. Encrypt data at rest

I would use:

**SSE-KMS = Server-Side Encryption with AWS KMS**

```text
Document
   ↓
S3
   ↓
SSE-KMS
   ↓
KMS Key
   ↓
Encrypted Object
```

The data stored in S3 is encrypted automatically.

---

## 2. Use a customer-managed KMS key

For sensitive enterprise CWD documents, I would typically use a **customer-managed KMS key** when we need stronger control over key policies, access, auditing, rotation, or separation of duties.

Example:

```text
CWDIngestionRole
       ↓
   KMS permissions
       ↓
Customer-managed KMS key
       ↓
      S3
```

The IAM role needs permission to use the key, such as `kms:Encrypt` / `kms:Decrypt`, depending on the operation.

---

## 3. Enforce encryption through bucket policy

I can prevent uploads that don't use the required encryption configuration.

Conceptually:

```text
PutObject
    ↓
SSE-KMS specified?
   / \
 YES  NO
 ↓     ↓
Allow  Deny
```

This prevents a client from accidentally uploading an unencrypted object.

---

## 4. Encrypt data in transit

When CWD communicates with S3:

```text
ECS/Fargate
     ↓
 HTTPS/TLS
     ↓
    S3
```

I would also enforce secure transport using an S3 bucket policy.

---

## 5. Control who can use the KMS key

Encryption is only useful if key access is controlled.

I would use:

* IAM policies
* KMS key policy
* Least privilege
* Separate roles for different workloads
* CloudTrail auditing

For example:

```text
CWD Worker
    ↓
IAM authorization
    ↓
KMS key policy
    ↓
Decrypt
```

---

## 6. Key rotation

For a customer-managed KMS key, I would enable appropriate **automatic key rotation** according to the organization's security requirements.

The application generally doesn't need to manage encryption keys itself.

---

## 7. CWD example

For a RAG document:

```text
Enterprise PDF
      ↓
     S3
      ↓
 SSE-KMS encryption
      ↓
Encrypted storage
      ↓
Ingestion Worker
      ↓
Extract / Chunk / Embed
      ↓
OpenSearch
```

The original document remains protected in S3.

---

# 🎯 Strong interview answer

> **“For CWD, I would encrypt S3 data both at rest and in transit. For data at rest, I would use SSE-KMS, typically with a customer-managed KMS key when we need stronger control over key policies and auditing. I would grant KMS permissions only to the required CWD IAM roles and enforce the required encryption configuration through the S3 bucket policy. For data in transit, I would require HTTPS/TLS and deny insecure transport. I would also enable key rotation and monitor key and S3 access through CloudTrail.”**

### Easy memory trick

**At Rest → SSE-KMS**
**In Transit → TLS**
**Key Control → KMS**
**Access Control → IAM**
**Audit → CloudTrail**

### Key distinction

**S3 encrypts the object.**
**KMS manages the encryption key.**
**IAM/KMS policies control who can use the key.**
