## Secrets Manager vs Parameter Store

Both can store application configuration, but **Secrets Manager is designed specifically for secrets**.

|                   | Secrets Manager             | Parameter Store                    |
| ----------------- | --------------------------- | ---------------------------------- |
| Primary use       | Secrets/credentials         | Configuration + parameters         |
| Password/API keys | ✅ Best fit                  | ✅ Can store SecureString           |
| Secret rotation   | ✅ Built-in rotation support | More manual                        |
| KMS encryption    | ✅                           | ✅ SecureString                     |
| Versioning        | ✅                           | ✅                                  |
| Cost              | Higher                      | Lower / simpler                    |
| CWD example       | DB password, API secret     | Model name, endpoint, feature flag |

### CWD example

**Secrets Manager:**

```text
Salesforce OAuth Secret
ServiceNow Credential
Database Password
API Key
```

**Parameter Store:**

```text
BEDROCK_MODEL_ID = ...
OPENSEARCH_ENDPOINT = ...
MAX_RETRIES = 3
ENVIRONMENT = prod
```

### 🎯 Strong interview answer

> **“I use Secrets Manager for sensitive credentials because it provides dedicated secret management and rotation capabilities. I use Parameter Store mainly for application configuration such as model IDs, endpoints, feature flags, and retry settings. Parameter Store can also store SecureString values, but for production secrets I generally prefer Secrets Manager.”**

**Memory:**
**Secrets Manager = Secrets** 🔐
**Parameter Store = Configuration** ⚙️
