# S3 SSE-S3 vs SSE-KMS

Both encrypt S3 data **at rest**, but the main difference is **who manages the encryption keys and how much control you need**.

|                      | **SSE-S3**                 | **SSE-KMS**               |
| -------------------- | -------------------------- | ------------------------- |
| Encryption           | AES-256                    | AWS KMS-managed keys      |
| Key management       | AWS manages                | KMS manages               |
| Key control          | Less                       | More                      |
| IAM/KMS permissions  | S3 permissions mainly      | S3 + KMS permissions      |
| Key policies         | No separate KMS key policy | Yes                       |
| Audit key usage      | Limited compared with KMS  | CloudTrail KMS events     |
| Key rotation/control | AWS-managed                | More control              |
| Complexity           | Lower                      | Higher                    |
| Cost                 | Lower                      | Additional KMS costs      |
| Good for             | General S3 data            | Sensitive enterprise data |

### Simple architecture

**SSE-S3:**

```text
CWD
 ↓
S3
 ↓
SSE-S3
 ↓
Encrypted object
```

AWS manages the encryption keys for you.

**SSE-KMS:**

```text
CWD
 ↓
S3
 ↓
SSE-KMS
 ↓
AWS KMS Key
 ↓
Encrypted object
```

You get more control over who can use the KMS key.

---

## For CWD, which would I use?

For **sensitive enterprise documents**, I would generally choose **SSE-KMS** when the organization requires stronger key-control, auditing, or separation-of-duties requirements.

For less sensitive/general objects, **SSE-S3** can be sufficient.

The important point is:

> **Don't choose KMS just because it sounds more secure. Choose it when the additional key-management and auditing controls are actually required.**

### 🎯 Strong interview answer

> **“Both SSE-S3 and SSE-KMS provide encryption at rest. SSE-S3 is simpler because AWS manages the encryption keys. SSE-KMS uses AWS KMS and gives us more control over key policies, permissions, auditing, and key management, but adds some operational and cost considerations. For sensitive CWD enterprise documents, I would typically use SSE-KMS when the security requirements call for customer-controlled key access and auditing; otherwise SSE-S3 provides strong encryption with less complexity.”**

### Easy memory trick

**SSE-S3 = Simple encryption**
**SSE-KMS = Controlled encryption**

### Key distinction

**SSE-S3:** *AWS manages the encryption-key layer.*

**SSE-KMS:** *You get a controllable KMS key-management and authorization layer.*
