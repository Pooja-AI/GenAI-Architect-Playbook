## Eliminate AWS single points of failure

Design CWD with **redundancy across Availability Zones** and avoid single-instance dependencies.

```text id="k3m7qa"
                 API Gateway
                     ↓
                    ALB
              ┌──────┴──────┐
              ↓             ↓
           AZ-1            AZ-2
        Coordinator      Coordinator
        Delegators       Delegators
        Workers          Workers
              ↓             ↓
           Shared Managed Services
      DynamoDB / SQS / S3 / OpenSearch
```

### Key actions

* **ECS/Fargate:** Run multiple tasks across **2+ AZs**.
* **ALB:** Distribute traffic across healthy targets in multiple AZs.
* **ECS Auto Scaling:** Replace failed tasks automatically.
* **SQS:** Use durable queues and **DLQs**.
* **DynamoDB:** Use its multi-AZ managed architecture; avoid relying on one instance.
* **S3:** Use durable managed storage rather than local container storage.
* **OpenSearch:** Use multiple nodes/AZs and replicas where using a provisioned domain.
* **ElastiCache/Redis:** Use replication/failover configuration rather than a single node.
* **NAT Gateway:** If required for production, use NAT Gateway per AZ to avoid one NAT becoming a regional dependency.
* **ECS state:** Keep state outside containers in DynamoDB/Redis/S3.
* **Health checks:** ALB/ECS detect unhealthy tasks and route around them.
* **Multi-region:** Add only if the business requires regional disaster recovery; AZ redundancy is the first layer.

### Interview answer

> “I eliminate single points of failure by running CWD workloads across multiple Availability Zones, with multiple ECS tasks behind an ALB and automatic replacement and scaling. I use managed highly available services such as DynamoDB, S3, and SQS, and configure replication/failover for services like OpenSearch and Redis where applicable. I also avoid storing state locally in containers. For stronger disaster recovery requirements, I would add a multi-region strategy.”

**Memory:**
**Multi-AZ → Multiple Tasks → Managed HA → Replication → Failover → Multi-Region**
