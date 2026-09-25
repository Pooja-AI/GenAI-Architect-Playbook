## Multi-region CWD design

For multi-region CWD, I would run **independent CWD stacks in two regions** and use a global routing layer to direct users to a healthy region.

```text id="h6p3qa"
                    Users
                      ↓
              Route 53 / Global
                 Accelerator
                 ↙       ↘
             Region A   Region B
                ↓          ↓
              ALB        ALB
                ↓          ↓
          ECS/Fargate  ECS/Fargate
          Coordinator  Coordinator
          Delegators   Delegators
          Workers      Workers
                ↓          ↓
             SQS        SQS
                ↓          ↓
        Regional AWS Services
```

### Key design

* **Each region has its own complete CWD stack.**
* **Route 53 / Global Accelerator** routes users to a healthy region.
* ECS/Fargate services run across **multiple AZs in each region**.
* **DynamoDB Global Tables** for state that must be available across regions.
* **S3 Cross-Region Replication** for required documents/artifacts.
* OpenSearch data is replicated using an appropriate cross-region strategy.
* Redis is treated carefully—**don't assume cache replication is enough for durable state**.
* **SQS is regional**, so asynchronous work needs a regional/failover strategy.
* Keep **configuration, prompts, agent registry, and model configuration versioned** so regions remain consistent.
* Use **CloudWatch/X-Ray/OpenTelemetry** per region and centralized observability where required.

### Active-active vs active-passive

**Active-active:**

```text
Users → Region A
     ↘ Region B
```

Both regions serve production traffic.

**Active-passive:**

```text
Users → Region A
           ↓ failure
        Region B
```

Region B is primarily for disaster recovery.

For CWD, the choice depends on **RTO/RPO, cost, data residency, downstream-system availability, and operational complexity**.

### Important CWD consideration

The biggest challenge is not just duplicating ECS.

You also need to consider:

```text
State
↓
DynamoDB
↓
Cross-region consistency

Enterprise systems
↓
Salesforce / ServiceNow
↓
Are they region-independent?

LLM
↓
Bedrock model availability/quota
↓
Available in both regions?
```

### Interview answer

> “I would design multi-region CWD as two independently deployable regional stacks, each already multi-AZ. Route 53 or Global Accelerator would route users to a healthy region. I would use DynamoDB Global Tables for required application state, S3 cross-region replication for documents and artifacts, and an appropriate replication strategy for OpenSearch. I would also ensure Bedrock model availability, quotas, enterprise-system connectivity, configuration, and observability are consistent across regions. The final choice between active-active and active-passive would depend on RTO, RPO, data residency, cost, and downstream dependencies.”

**Memory:**
**Two Regions → Each Multi-AZ → Global Routing → Replicate State → Validate Dependencies → Failover**
