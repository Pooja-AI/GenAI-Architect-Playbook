## Why did you choose Amazon Bedrock?

For an **AWS version of CWD**, I would choose Amazon Web Services **Amazon Bedrock** because it provides a managed way to access multiple foundation models while integrating with AWS security, networking, monitoring, and application services.

### Main reasons

1. **Multiple foundation models**

   * Access models from different providers through one AWS service.
   * Makes model evaluation and model switching easier.

2. **Enterprise security**

   * Integrates with AWS IAM, KMS, VPC/private networking patterns, and CloudTrail.
   * Supports enterprise governance requirements.

3. **Model flexibility**

   * We can evaluate models based on:

     * Reasoning quality
     * Tool calling
     * Context requirements
     * Latency
     * Cost
     * Multimodal capability

4. **AWS ecosystem integration**

For CWD:

```text
CWD
 ↓
Model Router
 ↓
Amazon Bedrock
 ↓
Foundation Model
 ↓
Coordinator / Worker
```

And it integrates naturally with services such as:

```text
S3          → documents
OpenSearch  → RAG/vector search
Lambda      → tools/functions
DynamoDB    → state
CloudWatch  → monitoring
IAM         → authorization
KMS         → encryption
```

5. **Managed service**

I don't have to build and operate the underlying foundation-model infrastructure myself. Bedrock provides managed access to foundation models, allowing the team to focus more on the CWD agent architecture and business workflows.

### Example in CWD

For a **Customer Briefing** request:

```text
User
 ↓
Coordinator
 ↓
Sales / Service Delegator
 ↓
Workers
 ↓
RAG + MCP tools
 ↓
Bedrock
 ↓
Final synthesis
 ↓
Customer briefing
```

The Workers retrieve Salesforce/ServiceNow information, and Bedrock can perform the reasoning and synthesis.

### 🎯 Strong interview answer

> **“For the AWS implementation of CWD, we chose Amazon Bedrock because it provides managed access to multiple foundation models while fitting naturally into the AWS enterprise ecosystem. It integrates with IAM, KMS, CloudWatch and other AWS services for security and governance. It also gives us model flexibility, so we can evaluate different models based on reasoning quality, tool calling, latency, cost and context requirements. This allowed us to focus on the multi-agent architecture while using Bedrock as the managed foundation-model layer.”**

### Easy memory trick

**Models → Security → Flexibility → AWS Integration → Managed**

One important interview point: **Bedrock is not itself the agent orchestration framework.** In CWD, LangGraph or another orchestration layer coordinates the agents, while Bedrock provides the foundation-model capabilities.
