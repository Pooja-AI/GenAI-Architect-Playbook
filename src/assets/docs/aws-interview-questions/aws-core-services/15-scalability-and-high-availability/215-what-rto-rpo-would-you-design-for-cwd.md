## RTO/RPO for CWD

I would **not choose the numbers purely from the architecture**. They should come from business impact and SLA requirements.

For an enterprise CWD platform, a reasonable **illustrative starting target** could be:

* **RTO: 30 minutes** → restore service within 30 minutes after a regional disaster.
* **RPO: 5 minutes** → lose no more than about 5 minutes of recoverable workflow/state data.

```text id="m7q3ka"
Disaster
   ↓
Failover
   ↓
≤ 30 min → CWD available      = RTO

Last replicated state
   ↓
≤ 5 min data gap              = RPO
```

### How I would achieve it

**RTO 30 min**

* Pre-deployed DR region
* ECS/Fargate capacity ready or quickly scalable
* ECR images available in DR
* Route 53 / Global Accelerator failover
* IaC for rapid infrastructure recovery

**RPO 5 min**

* DynamoDB replication/backups
* S3 versioning + cross-region replication
* OpenSearch snapshots/replication
* Durable workflow checkpoints

### Interview answer

> “For CWD, I would initially propose an RTO of around 30 minutes and RPO of around 5 minutes, but I would validate those targets with the business. To achieve them, I would maintain a DR region, replicate critical state and documents, keep deployment artifacts ready, and use health-based traffic failover. I would regularly test the DR process to verify the actual RTO and RPO.”

**Memory:**
**RTO = How fast? | RPO = How much data can we lose?**
