## Multi-AZ CWD design

Deploy the **Coordinator, Delegators, and Workers across multiple Availability Zones** so failure of one AZ doesn't stop CWD.

```text id="n8k4wp"
                    API Gateway
                         ↓
                        ALB
                 ┌───────┴───────┐
                 ↓               ↓
               AZ-1             AZ-2
          ┌────────────┐   ┌────────────┐
          │ Coordinator│   │ Coordinator│
          │ Delegators │   │ Delegators │
          │ Workers    │   │ Workers    │
          └─────┬──────┘   └─────┬──────┘
                │                │
                └───────┬────────┘
                        ↓
             ┌─────────────────────┐
             │ Shared AWS Services │
             │ SQS / DynamoDB / S3 │
             │ OpenSearch / Redis  │
             └─────────────────────┘
```

### Key design

* **VPC:** At least 2–3 AZs.
* **Private subnets:** Coordinator, Delegators, Workers.
* **ALB:** Routes traffic only to healthy ECS tasks.
* **ECS/Fargate:** Multiple tasks distributed across AZs.
* **Auto Scaling:** Replaces failed tasks and handles traffic increases.
* **SQS:** Buffers asynchronous work if one AZ has capacity issues.
* **DynamoDB/S3:** Keep durable state/data outside containers.
* **OpenSearch:** Use multi-AZ deployment and replicas where applicable.
* **Redis:** Use replication/failover rather than a single cache node.
* **NAT:** For production private-subnet internet access, use NAT per AZ so one NAT failure doesn't become a dependency.
* **Health checks:** ECS/ALB detect unhealthy tasks and route around them.

### Example failure

If **AZ-1 goes down**:

```text id="c6t2mz"
AZ-1 ❌
   ↓
ALB stops routing there
   ↓
AZ-2 continues serving
   ↓
ECS replaces capacity
   ↓
CWD remains available
```

### Interview answer

> “I would deploy CWD across at least two Availability Zones, with private subnets containing multiple Coordinator, Delegator, and Worker tasks. An ALB distributes traffic only to healthy tasks, while ECS Auto Scaling replaces failed capacity. Durable state would be externalized to DynamoDB, S3, and other managed services, and stateful services such as OpenSearch and Redis would use appropriate replication and failover. This ensures an AZ failure doesn't become a CWD single point of failure.”

**Memory:**
**Multi-AZ → Private Tasks → Load Balance → Externalize State → Replicate → Failover**
