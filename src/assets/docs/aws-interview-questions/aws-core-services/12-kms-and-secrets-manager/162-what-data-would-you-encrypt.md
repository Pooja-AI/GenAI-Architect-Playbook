## What data would you encrypt?

In CWD, I would encrypt **sensitive data both at rest and in transit**.

### Data at rest

```text id="4qv8tx"
S3
 ├── Customer documents
 ├── PDFs / reports
 └── RAG source files

DynamoDB
 ├── Session/task/run state
 └── Workflow metadata

SQS
 └── Messages containing sensitive data

Secrets Manager
 └── API credentials / secrets

CloudWatch
 └── Sensitive application logs
```

Use **KMS** for encryption where customer-managed key control is required.

### Data in transit

Encrypt communication using **TLS/HTTPS**:

```text id="3f0u4h"
User
 ↓ TLS
API Gateway
 ↓ TLS
Coordinator
 ↓ TLS
Delegator
 ↓ TLS
Worker
 ↓ TLS
AWS / Enterprise Systems
```

### Especially sensitive data

I would pay particular attention to:

* Customer/employee PII
* Confidential enterprise documents
* Customer IDs and business data
* API credentials and secrets
* Authentication tokens
* Proprietary source data
* Agent/workflow data containing sensitive information

### Important interview point

**Don't encrypt blindly.** Apply encryption based on **data classification, compliance requirements, and business sensitivity**.

### 🎯 Strong interview answer

> **“In CWD, I would encrypt sensitive customer and enterprise data such as documents, PII, workflow state, credentials, and confidential business information. Data at rest would use service-side encryption, with KMS where customer-controlled key management is required, and all service-to-service and external communication would use TLS. I would also avoid storing secrets or tokens in application logs.”**

**Memory:**
**Sensitive data → Encrypt at rest + Encrypt in transit + Protect secrets**
