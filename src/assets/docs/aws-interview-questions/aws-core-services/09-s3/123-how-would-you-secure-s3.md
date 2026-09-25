# How would you implement S3 bucket policies?

For CWD, I would use the **S3 bucket policy as a resource-level security layer**, together with IAM roles. The goal is to allow only the required CWD services to access the required S3 paths.

### CWD example

```text id="bkt01"
CWD Ingestion Worker
        │
        │ IAM Role
        ▼
   S3 Bucket Policy
        │
        ├── Allow GetObject
        ├── Allow PutObject
        └── Deny insecure access
```

## 1. Allow only the required IAM role

For example, the ingestion Worker needs to read raw documents:

```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": "arn:aws:iam::123456789012:role/CWDIngestionRole"
  },
  "Action": [
    "s3:GetObject"
  ],
  "Resource": "arn:aws:s3:::cwd-documents/raw/*"
}
```

So the Worker can read:

```text
cwd-documents/raw/*
```

but not necessarily the entire bucket.

---

## 2. Restrict access by prefix

Separate CWD data:

```text
cwd-documents/
├── raw/
├── processed/
├── evaluation/
└── reports/
```

Then give different services different permissions.

```text id="bkt02"
Ingestion Worker
   ↓
raw/* → READ

Processing Worker
   ↓
processed/* → READ/WRITE

Reporting Service
   ↓
reports/* → READ
```

This follows **least privilege**.

---

## 3. Explicitly deny insecure transport

I would add a bucket-level deny for requests that don't use HTTPS:

```json
{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": [
    "arn:aws:s3:::cwd-documents",
    "arn:aws:s3:::cwd-documents/*"
  ],
  "Condition": {
    "Bool": {
      "aws:SecureTransport": "false"
    }
  }
}
```

This is an important pattern because the **Deny overrides an Allow**.

---

## 4. Require encryption for uploads

For sensitive CWD documents, I can require SSE-KMS for uploads.

Conceptually:

```text id="bkt03"
PutObject
   ↓
Is encryption header present?
   ↓
YES → Allow
NO  → Deny
```

This prevents clients from uploading unencrypted objects when the policy is designed to enforce that requirement.

---

## 5. Combine bucket policy + IAM

I don't rely on the bucket policy alone.

```text id="bkt04"
Request
   ↓
IAM permission
   +
Bucket policy
   +
KMS permission
   +
Network controls
   ↓
Access
```

For example:

```text id="bkt05"
ECS Task
  ↓
IAM Task Role
  ↓
S3 Bucket Policy
  ↓
KMS
  ↓
S3 Object
```

The ECS task should use its **task role**, not hardcoded AWS credentials.

---

## 6. Protect against public access

I would enable:

```text
Block Public Access = ON
```

and avoid policies that grant:

```text
Principal = "*"
Action = s3:GetObject
```

unless there is a very specific, reviewed public-access requirement.

---

## 7. Monitor policy and access changes

I would use:

```text id="bkt06"
CloudTrail
   ↓
S3 API activity
   ↓
CloudWatch / Security monitoring
```

Especially monitor:

* Bucket policy changes
* Public-access changes
* Unexpected object access
* Delete operations
* KMS-related access failures

---

## 🎯 Strong interview answer

> **“For CWD, I implement S3 bucket policies using least privilege. I allow specific IAM roles to access only the required prefixes, such as allowing the ingestion Worker to read `raw/*` rather than the entire bucket. I also explicitly deny non-TLS access, enforce encryption requirements where appropriate, and keep Block Public Access enabled. I combine the bucket policy with IAM task roles, KMS permissions, and network controls rather than relying on one security mechanism. Finally, I monitor bucket-policy and object-access activity through CloudTrail and CloudWatch.”**

### Easy memory trick

**Role → Prefix → TLS → Encryption → Public Access → Monitor**

### Key distinction

**IAM policy:** *What can this identity do?*
**Bucket policy:** *What does this bucket allow or deny?*
**KMS policy:** *Who can use the encryption key?*
