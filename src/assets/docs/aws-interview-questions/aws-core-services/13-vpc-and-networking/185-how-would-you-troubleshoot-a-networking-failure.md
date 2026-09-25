## How would you troubleshoot a networking failure?

I troubleshoot **from the application layer down to the network layer**.

```text
Request
  ↓
DNS
  ↓
Route
  ↓
Security Group
  ↓
NACL
  ↓
VPC Endpoint / NAT
  ↓
Target Service
```

### Step-by-step

**1. Identify the failure**

* Which service? Coordinator → Delegator → Worker?
* Check error: timeout, connection refused, DNS failure, 403, etc.
* Check P50/P95/P99 latency.

**2. Check DNS**

```text
Can Worker resolve the service name?
```

Check Route 53/private DNS/service discovery.

**3. Check routing**
Verify route tables:

```text
Private subnet → VPC endpoint
Private subnet → NAT Gateway
```

depending on the destination.

**4. Check Security Groups**
Verify:

```text
Source SG → Destination SG → Port
```

**5. Check NACLs**
Because NACLs are stateless, check **both inbound and outbound rules**.

**6. Check VPC endpoints/NAT**

* Endpoint exists?
* Endpoint SG allows traffic?
* NAT Gateway healthy?
* Route to NAT exists?

**7. Check target service**
Check ECS task health, ALB target health, Bedrock/S3 availability, downstream API errors, etc.

**8. Trace the request**

Use:

* CloudWatch logs/metrics
* VPC Flow Logs
* CloudTrail where relevant
* X-Ray/OpenTelemetry
* Correlation ID

### 🎯 Strong interview answer

> **“I troubleshoot networking failures layer by layer. First I identify the failing service and error type, then verify DNS and service discovery, route tables, Security Groups, NACLs, and VPC endpoints or NAT depending on the destination. Then I check the target service and task health. I use CloudWatch, VPC Flow Logs, distributed tracing, and correlation IDs to locate exactly where the request is failing.”**

**Memory:**
**DNS → Route → SG → NACL → Endpoint/NAT → Target → Logs/Trace**
