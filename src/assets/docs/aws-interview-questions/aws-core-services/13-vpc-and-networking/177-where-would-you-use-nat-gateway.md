## Where would you use NAT Gateway?

In CWD, I would use a **NAT Gateway when a private-subnet workload needs outbound internet access**.

```text
Private ECS Worker
       ↓
NAT Gateway
       ↓
Internet Gateway
       ↓
External API
```

### CWD examples

Use NAT when a Worker needs to call:

* External third-party APIs
* External SaaS services
* Public package/repository endpoints during controlled operations
* External services that don't have private connectivity

### When I would NOT use NAT

If the destination is an AWS service that supports a suitable **VPC endpoint**, I would prefer the VPC endpoint.

```text
ECS → VPC Endpoint → S3
```

instead of:

```text
ECS → NAT → Internet → S3
```

### 🎯 Strong interview answer

> **“I use NAT Gateway only when private CWD workloads need outbound internet access, such as calling an external API. I would not use NAT unnecessarily; for supported AWS services like S3, I prefer VPC endpoints for private connectivity. NAT provides outbound access but does not allow unsolicited inbound connections to the private workload.”**

**Memory:**
**NAT = Private workload → External Internet**
