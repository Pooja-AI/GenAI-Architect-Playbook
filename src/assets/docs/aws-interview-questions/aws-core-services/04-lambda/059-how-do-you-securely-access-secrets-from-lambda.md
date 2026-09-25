# How do you securely access secrets from Lambda?

## Short answer

I would use **AWS Secrets Manager + IAM execution roles**, rather than hardcoding secrets or storing them directly in Lambda code.

```text id="r9x4k2"
Lambda
   ↓
IAM Execution Role
   ↓
Secrets Manager
   ↓
Secret
```

## Key points

### 1. Store secrets in Secrets Manager

Examples:

* Salesforce credentials
* ServiceNow credentials
* API keys
* OAuth client secrets
* Database credentials

```text id="v6n2q8"
Secrets Manager
 ├── /cwd/prod/salesforce
 ├── /cwd/prod/servicenow
 └── /cwd/prod/database
```

---

### 2. Give Lambda an IAM execution role

Lambda gets an **execution role**.

For example:

```text id="j3k7p1"
Lambda: CustomerWorker
       ↓
IAM Role: CWD-CustomerWorker-Role
       ↓
secretsmanager:GetSecretValue
       ↓
Only required Salesforce secret
```

Use **least privilege**.

Don't give:

```text
❌ secretsmanager:*
```

to every Lambda.

Instead, allow access to only the required secret ARN.

---

### 3. Retrieve the secret at runtime

Conceptually:

```python id="u2q8m4"
secret = secrets_manager.get_secret_value(
    SecretId="cwd/prod/salesforce"
)
```

Then use the credential to call the required service.

```text id="h8k3v5"
Lambda
 ↓
Get secret
 ↓
Salesforce API
```

---

### 4. Don't log the secret

Never do:

```python id="b3r7x1"
print(secret)
```

Also avoid logging:

* API keys
* Passwords
* Access tokens
* Authorization headers
* Full secret responses

---

### 5. Encrypt secrets

Secrets Manager encrypts secrets using **AWS KMS**.

For higher security requirements:

```text id="n5c8q2"
Lambda
 ↓
IAM
 ↓
Secrets Manager
 ↓
KMS encryption
```

The Lambda role must have the appropriate permissions to retrieve/decrypt the secret.

---

### 6. Use VPC/private connectivity where required

If CWD Lambda accesses private enterprise resources, I can place Lambda in the appropriate VPC and use private connectivity.

For Secrets Manager access from a VPC, an **interface VPC endpoint** can keep traffic on the AWS network rather than requiring public internet access.

```text id="a7m2v9"
Lambda in VPC
     ↓
VPC Endpoint
     ↓
Secrets Manager
```

---

### 7. Rotate secrets

Secrets should not live forever.

```text id="c9f4w6"
Secret
 ↓
Rotation
 ↓
New credential
 ↓
Lambda retrieves current secret
```

Secrets Manager supports rotation workflows for supported credential patterns.

---

# CWD example

Suppose the Customer Worker needs Salesforce access:

```text id="x6q1m8"
Customer Worker
      ↓
Lambda
      ↓
IAM Execution Role
      ↓
Secrets Manager
      ↓
Salesforce Credential
      ↓
MCP / Salesforce
```

The Worker does **not** contain:

```text id="p4s7n2"
❌ username = "..."
❌ password = "..."
❌ API_KEY = "..."
```

Instead, it retrieves the required secret at runtime.

---

# 🎯 Strong interview answer

> **“I securely access Lambda secrets using AWS Secrets Manager and the Lambda execution role. The secret is encrypted with KMS, and the Lambda IAM role has least-privilege permission to retrieve only the required secret. The Lambda retrieves it at runtime, uses it for the downstream operation, and never logs or hardcodes the credential. For private workloads, I can use VPC connectivity such as a Secrets Manager interface endpoint, and I enable rotation where appropriate. In CWD, this could protect Salesforce, ServiceNow or MCP authentication credentials.”**

## Easy memory trick

**Store → Secrets Manager**
**Access → IAM Role**
**Encrypt → KMS**
**Network → Private endpoint when required**
**Rotate → Secrets Manager**
**Never log → Secret**

### Key distinction

> **IAM controls who can retrieve the secret; Secrets Manager stores and manages the secret; KMS protects the secret cryptographically.**
