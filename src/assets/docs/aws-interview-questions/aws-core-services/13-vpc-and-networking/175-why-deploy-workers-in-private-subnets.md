## Why deploy Workers in private subnets?

Because Workers often handle **sensitive enterprise data and powerful downstream tools**, so they should not be directly reachable from the internet.

```text
Internet
   ↓
API Gateway / ALB
   ↓
Private Subnet
   ↓
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP / AWS / Enterprise Systems
```

### Main reasons

1. **Reduce attack surface**
   Workers don't need public IPs.

2. **Control inbound access**
   Security Groups can allow traffic only from authorized CWD services.

3. **Protect sensitive data**
   Workers may process customer data, documents, tickets, etc.

4. **Protect powerful tools**
   Workers may invoke Salesforce, ServiceNow, S3, Bedrock, etc.

5. **Private service-to-service communication**
   Coordinator → Delegator → Worker stays inside the private network.

6. **Outbound access is controlled**
   If a Worker needs internet access, use NAT Gateway or appropriate VPC endpoints.

### 🎯 Strong interview answer

> **“I deploy Workers in private subnets because they process sensitive enterprise data and can invoke powerful downstream tools. They don't need direct internet exposure. Security Groups restrict inbound traffic to authorized CWD services, while VPC endpoints or NAT provide controlled outbound connectivity when required. This reduces the attack surface and provides network isolation.”**

**Memory:**
**Sensitive + Powerful + No Public Access = Private Subnet**
