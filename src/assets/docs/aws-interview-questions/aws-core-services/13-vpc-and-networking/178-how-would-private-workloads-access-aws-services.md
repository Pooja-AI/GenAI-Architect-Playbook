## How would private workloads access AWS services?

I would use **VPC endpoints where supported**, instead of sending AWS service traffic through the public internet.

```text
Private ECS Worker
       ↓
   VPC Endpoint
       ↓
   AWS Service
```

### CWD examples

```text
ECS Worker → S3 VPC Endpoint → S3
ECS Worker → Bedrock VPC Endpoint → Bedrock
ECS Worker → Secrets Manager Endpoint → Secrets Manager
```

For services where a VPC endpoint isn't applicable, use the appropriate AWS networking path, such as NAT Gateway when outbound internet connectivity is required.

### Security layers

* **Private subnet** — no public IP
* **VPC endpoint** — private AWS connectivity
* **Security Groups** — restrict traffic
* **IAM Task Role** — control AWS API permissions
* **KMS** — encryption
* **CloudTrail** — auditing

### 🎯 Strong interview answer

> **“Private CWD workloads access AWS services primarily through VPC endpoints where supported. For example, ECS Workers can access S3, Secrets Manager, and other supported services privately without requiring internet access. IAM task roles provide authorization, security groups control network traffic, and KMS and CloudTrail provide encryption and auditing. NAT is used only when outbound internet access is actually required.”**

**Memory:**
**Private ECS → VPC Endpoint → AWS Service**
