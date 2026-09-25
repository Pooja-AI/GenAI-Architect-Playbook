## How would ECS access Bedrock securely?

For CWD, I would use an **ECS task IAM role** with least-privilege permissions to invoke the required Bedrock models.

```text id="v2k5p0"
ECS/Fargate
  Coordinator / Worker
       ↓
   IAM Task Role
       ↓
   AWS STS
       ↓
Bedrock API
       ↓
Foundation Model
```

### 1. ECS Task Role

Attach a dedicated role to the ECS task:

```text id="3h8qk4"
CWDCoordinatorTaskRole
        ↓
bedrock:InvokeModel
```

I would restrict it to the required Bedrock resources/models where supported rather than giving broad Bedrock permissions.

### 2. No access keys

❌ Don't put:

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

inside the container.

The ECS task automatically receives **temporary credentials** through its IAM role.

### 3. Private connectivity

For a security-sensitive CWD deployment, I would use an **Amazon Bedrock interface VPC endpoint (AWS PrivateLink)** where supported/configured, so ECS can reach Bedrock privately without requiring public internet routing.

```text id="j4yq1m"
Private ECS Subnet
      ↓
VPC Endpoint
      ↓
Amazon Bedrock
```

### 4. Encryption and secrets

AWS API communication uses **TLS**.

If the application has other credentials/configuration, store them in:

```text id="o2jzv8"
Secrets Manager
       +
      KMS
```

rather than in the Docker image.

### 5. Audit and monitoring

I would use:

* CloudTrail for AWS API activity
* CloudWatch for operational metrics/logs
* IAM Access Analyzer for permission analysis
* Correlation IDs/Langfuse for end-to-end CWD tracing

### 🎯 Strong interview answer

> **“In CWD, ECS would access Bedrock using a dedicated ECS task IAM role with least-privilege permissions to invoke the required models. I would not store AWS access keys in the container; ECS provides temporary credentials through the task role. For a private enterprise deployment, I would use a Bedrock VPC endpoint where appropriate, along with TLS, KMS/Secrets Manager for other secrets, and CloudTrail and CloudWatch for auditing and monitoring.”**

**Memory trick:**
**ECS → Task Role → Private Endpoint → Bedrock → CloudTrail**
