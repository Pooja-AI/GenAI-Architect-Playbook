## How would you privately access Bedrock?

For CWD, I would use an **Interface VPC Endpoint powered by AWS PrivateLink** for the supported Amazon Bedrock APIs.

```text
Private ECS Worker
       ↓
Private Subnet
       ↓
Interface VPC Endpoint
       ↓
AWS PrivateLink
       ↓
Amazon Bedrock
```

### Security

* **No public IP** on ECS Worker
* Private connectivity through the VPC endpoint
* **Security Group** controls access to the endpoint
* **IAM Task Role** controls which Bedrock APIs/models the Worker can invoke
* **TLS** encrypts communication
* **CloudTrail/CloudWatch** for auditing and monitoring

### 🎯 Strong interview answer

> **“For private Bedrock access, I would use an interface VPC endpoint through AWS PrivateLink, where the required Bedrock API is supported. The ECS Worker remains in a private subnet and communicates through the endpoint. I would secure the endpoint with security groups and IAM task roles, use TLS for encryption, and monitor access through CloudTrail and CloudWatch.”**

**Memory:**
**Private ECS → Interface Endpoint → PrivateLink → Bedrock**
