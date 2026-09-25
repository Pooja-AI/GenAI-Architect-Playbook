## How does AWS CloudTrail help?

**CloudTrail records AWS API activity** so we can answer:

> **Who did what, when, from where, and against which AWS resource?**

```text id="2k2v1c"
User / IAM Role / Service
          ↓
      AWS API Call
          ↓
       CloudTrail
          ↓
   Logs / Investigation
```

### CWD example

If someone changes the `RAGWorkerRole` permissions:

```text id="8qzj7n"
IAM Policy Changed
       ↓
CloudTrail
       ↓
Who? → Which role/user?
What? → Policy modification
When? → Timestamp
Where? → Source IP / context
       ↓
Security Investigation
```

### What I use it for

* **IAM activity** — role/policy changes, `AssumeRole`, `PassRole`
* **S3 activity** — object access and bucket changes
* **KMS activity** — key usage
* **ECS activity** — service/task changes
* **Security investigation** — identify who made a change
* **Compliance/audit** — maintain an activity history

### Important distinction

**CloudTrail ≠ CloudWatch**

* **CloudTrail** → *Who performed which AWS API action?*
* **CloudWatch** → *How is the application/service behaving?*

### 🎯 Strong interview answer

> **“CloudTrail provides an audit trail of AWS API activity. In CWD, I use it to track IAM changes, role assumptions, S3 access, KMS usage, and infrastructure changes. It helps with security investigations, compliance, and detecting unauthorized or suspicious activity.”**

**Memory:**
**CloudTrail = Who did what?**
**CloudWatch = How is it behaving?**
