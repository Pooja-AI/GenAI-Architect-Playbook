## How would you prevent secrets from appearing in logs?

I use **secret-safe logging** and make sure sensitive values never enter application logs.

### 1. Don't log secret values

```python
logger.info("Calling Salesforce")
```

Not:

```python
logger.info(f"Token: {token}")  # ❌
logger.info(f"Password: {password}")  # ❌
```

### 2. Mask sensitive fields

If a request contains:

```text
Authorization
password
api_key
access_token
client_secret
```

sanitize or mask them before logging:

```text
Authorization: ******
api_key: ******
```

### 3. Secrets Manager

Retrieve secrets from **Secrets Manager** at runtime instead of putting them in configuration or environment logs.

### 4. Prevent accidental logging

Configure application/framework logging filters to automatically redact known sensitive fields.

### 5. Secure error handling

Don't expose secrets through exception messages or stack traces.

```text
❌ Connection failed: password=ABC123

✅ Connection to Salesforce failed
```

### 6. Protect the logs themselves

Use:

* CloudWatch Logs encryption
* Restricted IAM access
* Appropriate retention
* CloudTrail for audit activity

### 🎯 Strong interview answer

> **“I prevent secrets from appearing in logs by never logging credentials directly, using structured logging with automatic redaction of sensitive fields, and sanitizing errors and request headers. Secrets are retrieved from Secrets Manager at runtime. I also restrict and encrypt log access so even the logs themselves are protected.”**

**Memory:**
**Don't Log → Mask → Sanitize → Encrypt → Restrict**
