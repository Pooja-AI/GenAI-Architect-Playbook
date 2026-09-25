## Disaster Recovery strategy for CWD

I would use **Multi-AZ for high availability + Multi-Region for disaster recovery**, with clearly defined **RTO/RPO**.

```text id="v8m2qa"
             Region A
          CWD Production
               ↓
        Replication / Backup
               ↓
             Region B
           DR CWD Stack
               ↓
          Failover
```

### Strategy

1. **Multi-AZ** → protects against AZ failure.
2. **Multi-Region** → protects against regional failure.
3. **DynamoDB** → backups / Global Tables depending on RPO requirements.
4. **S3** → versioning + cross-region replication for critical data.
5. **OpenSearch** → snapshots/replication for RAG indexes.
6. **ECR** → keep container images available in the DR region.
7. **Infrastructure as Code** → recreate infrastructure consistently.
8. **Configuration/Prompt/Agent Registry** → version and replicate required configurations.
9. **Route 53 / Global Accelerator** → redirect traffic to healthy region.
10. **Regular DR testing** → perform failover and recovery drills.

### Example

If Region A fails:

```text id="q1n7cv"
Region A ❌
    ↓
Health Check
    ↓
Global Routing
    ↓
Region B
    ↓
CWD continues
```

### RTO vs RPO

* **RTO** = How quickly we need CWD back.
* **RPO** = How much data loss is acceptable.

For example:

> **RTO = 30 minutes** → recover service within 30 minutes.
> **RPO = 5 minutes** → maximum acceptable data loss is approximately 5 minutes.

The actual values should be agreed with the business rather than assumed.

### Interview answer

> “My DR strategy is Multi-AZ for availability and Multi-Region for regional disaster recovery. I replicate or back up critical state and documents, keep container images and infrastructure definitions available in the DR region, and use health-based global routing for failover. I define RTO and RPO with the business and regularly test the failover process rather than assuming the DR design works.”

**Memory:**
**Multi-AZ → Backup/Replicate → DR Region → Failover → RTO/RPO → Test**
