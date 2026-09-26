### How do you govern enterprise data?

I would use **data classification + access control + encryption + lineage + auditing**.

1. **Data classification**

   * Classify data as public, internal, confidential, or restricted/PII.

2. **Access control**

   * Use **Entra ID + RBAC/ABAC**.
   * Enforce user/role permissions before retrieving data.

3. **Data-level security**

   * Apply **ACL/metadata filters** in Azure AI Search.
   * Users should retrieve only documents they are authorized to access.

4. **Encryption & secrets**

   * Encrypt data at rest and in transit.
   * Store secrets/keys in **Azure Key Vault**.

5. **Data protection**

   * Apply PII detection/masking and DLP policies.
   * Don't send unauthorized or unnecessary sensitive data to the LLM.

6. **Data lineage & quality**

   * Track where data came from, transformations, ownership, and freshness.
   * Validate data before using it in AI workflows.

7. **Audit & monitoring**

   * Log who accessed what data, when, and through which agent/tool.
   * Use **Azure Monitor, Log Analytics, and audit logs**.

### Interview answer

> **"I govern enterprise data through classification, identity-based access control, ACL filtering, encryption, DLP, lineage, and auditing. In CWD, authorization is checked before retrieval, and Azure AI Search applies document-level ACL filters so only entitled data reaches the agent and LLM. Sensitive operations and data access are logged for audit and compliance."**
