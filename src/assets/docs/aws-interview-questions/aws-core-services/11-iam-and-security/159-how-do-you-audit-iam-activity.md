## How do you audit IAM activity?

I use **AWS CloudTrail** as the primary audit mechanism for IAM activity.

```text
IAM User / Role
      ↓
AWS API Call
      ↓
CloudTrail
      ↓
CloudWatch / S3
      ↓
Alerts + Investigation
```

### What I monitor

* Role creation/deletion
* Policy changes
* Permission changes
* `AssumeRole`
* `PassRole`
* Access-key activity
* Changes to trust policies
* Changes to permission boundaries

### CWD example

If someone changes the `RAGWorkerRole`:

```text
RAGWorkerRole
     ↓
Policy changed
     ↓
CloudTrail records:
Who → What → When → From where
     ↓
Alert / Investigation
```

I would also use **IAM Access Analyzer** to identify overly broad or unintended permissions.

### 🎯 Strong interview answer

> **“I use CloudTrail to audit IAM API activity, including role assumptions, policy changes, role creation, and PassRole activity. I send relevant logs to CloudWatch or S3 for monitoring and retention, create alerts for sensitive IAM changes, and use IAM Access Analyzer to identify unintended or excessive access.”**

**Memory:**
**CloudTrail = Record → CloudWatch = Monitor → Access Analyzer = Review**
