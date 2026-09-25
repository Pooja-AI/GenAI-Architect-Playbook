## Which CWD components belong in private subnets?

**Almost all CWD application workloads should be in private subnets.**

```text
Public Subnet
   ↓
ALB
   ↓
Private Subnets
   ├── Coordinator
   ├── Sales Delegator
   ├── IT Delegator
   ├── Customer Worker
   ├── Incident Worker
   └── RAG Worker
```

### Private subnet components

1. **Coordinator** — main orchestration service.
2. **Delegators** — Sales, IT/Service, Manufacturing, etc.
3. **Workers** — Customer, Incident, RAG, CRM workers.
4. **Internal MCP services/servers** — when hosted in AWS.
5. **Internal APIs/services** used by CWD.
6. **ECS/Fargate tasks** running these components.

### What should NOT be directly public?

```text
❌ Coordinator
❌ Delegators
❌ Workers
❌ MCP servers
❌ Internal APIs
```

Users should reach them through the controlled entry layer:

```text
User
 ↓
API Gateway / ALB
 ↓
Private ECS
 ↓
Coordinator → Delegator → Worker
```

### 🎯 Strong interview answer

> **“In CWD, I would place the Coordinator, all Delegators, Workers, internal MCP services, and other application services in private subnets. They should not have public IPs. External traffic enters through API Gateway or an appropriate load-balancing layer, while internal services communicate privately using security groups, service discovery, and TLS.”**

**Memory:**
**Application workloads = Private** 🔒
