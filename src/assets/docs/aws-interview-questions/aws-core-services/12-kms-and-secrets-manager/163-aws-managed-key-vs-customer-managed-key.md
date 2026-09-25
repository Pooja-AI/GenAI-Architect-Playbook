## AWS-managed key vs Customer-managed key

Both are **KMS keys used for encryption**, but the amount of control you have is different.

|                    | AWS-managed key     | Customer-managed key     |
| ------------------ | ------------------- | ------------------------ |
| Key management     | AWS manages         | You manage               |
| Control            | Less                | More                     |
| Custom key policy  | Limited             | Full control             |
| Key rotation       | AWS-managed         | You configure/manage     |
| Audit/control      | Less customization  | More control             |
| Operational effort | Low                 | Higher                   |
| Best for           | Standard encryption | Sensitive/regulated data |

### CWD example

**AWS-managed key:**

```text
S3
 ↓
AWS-managed KMS key
 ↓
Encrypted document
```

Simple and low operational overhead.

**Customer-managed key:**

```text
S3
 ↓
Customer-managed KMS key
 ↓
Encrypted document
```

I can control **who can use the key, key policy, access boundaries, rotation settings, and auditing**.

### When would I choose each?

* **AWS-managed key** → when standard AWS encryption is sufficient and I don't need detailed key-management control.
* **Customer-managed key** → when CWD has stronger security, compliance, separation-of-duties, or customer-controlled key requirements.

### 🎯 Strong interview answer

> **“AWS-managed KMS keys are simpler because AWS manages most of the key lifecycle. Customer-managed keys give us more control over key policies, permissions, rotation, and auditing, but require more operational management. In CWD, I would use customer-managed keys for highly sensitive or compliance-driven data when we need that additional control; otherwise AWS-managed encryption may be sufficient.”**

**Memory:**
**AWS-managed = Simple**
**Customer-managed = Control**
