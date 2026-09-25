# How would you prevent public access to S3?

For CWD, I would use **multiple layers**, with **S3 Block Public Access as the primary control**.

```text id="pub01"
                S3 Bucket
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
 Block Public     IAM       Bucket Policy
    Access       Roles        Controls
        │           │           │
        └───────────┼───────────┘
                    ▼
             Private Access
```

## 1. Enable Block Public Access

At the account and bucket level, enable all S3 Block Public Access settings.

This prevents common ways of accidentally exposing objects publicly.

```text id="pub02"
Block Public Access
        ↓
Public bucket/object access blocked
```

For CWD enterprise documents, I would keep this enabled.

---

## 2. Don't use public `Principal: "*"`

Avoid policies such as:

```json id="pub03"
{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:GetObject"
}
```

Instead:

```text id="pub04"
Principal
   ↓
Specific CWD IAM role
```

Example:

```text id="pub05"
CWDIngestionRole
        ↓
s3:GetObject
        ↓
cwd-documents/raw/*
```

---

## 3. Use IAM least privilege

Only authorized CWD services receive S3 permissions.

```text id="pub06"
Ingestion Worker
    ↓
IAM Task Role
    ↓
GetObject
    ↓
raw/*
```

The Worker doesn't automatically get access to every bucket/object.

---

## 4. Use bucket policies to enforce security

For example, explicitly deny non-TLS access:

```json id="pub07"
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

This means requests must use secure transport.

---

## 5. Keep CWD workloads private

For ECS/Fargate workloads:

```text id="pub08"
Private ECS Tasks
       ↓
S3 VPC Endpoint
       ↓
S3
```

This avoids requiring public internet access for the normal CWD-to-S3 path.

---

## 6. Encrypt the data

Use:

```text id="pub09"
S3
 ↓
SSE-KMS
 ↓
KMS Key
```

Encryption doesn't itself prevent public access, but it's another layer of protection if unauthorized access somehow occurs.

---

## 7. Monitor for accidental exposure

Monitor:

```text id="pub10"
Bucket policy changes
Public-access configuration changes
Unexpected GetObject requests
Unexpected principals
```

Use CloudTrail and security monitoring/alerts.

---

## 🎯 Strong interview answer

> **“For CWD, I prevent S3 public access primarily by enabling Block Public Access at the account and bucket level. I avoid public principals such as `Principal: "*"`, use least-privilege IAM task roles, and restrict bucket policies to specific services and prefixes. I also enforce HTTPS, use KMS encryption, and allow private ECS workloads to access S3 through a VPC endpoint where appropriate. Finally, I monitor bucket-policy and public-access configuration changes using CloudTrail and security alerts.”**

### Easy memory trick

**Block → Restrict → Encrypt → Private → Monitor**

### Key distinction

**Block Public Access** prevents public exposure.

**IAM + Bucket Policy** controls which authorized identities can access the bucket.

**VPC Endpoint** keeps private workloads on a private network path to S3.
