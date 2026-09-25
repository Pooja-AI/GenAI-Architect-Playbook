## What is a NAT Gateway?

**NAT Gateway allows resources in private subnets to make outbound connections to the internet without allowing inbound internet connections to those resources.**

```text id="n6v8r2"
Private ECS Worker
       ↓
Private Subnet
       ↓
NAT Gateway
       ↓
Internet Gateway
       ↓
Internet
```

### CWD example

Suppose a Worker needs to call an external API:

```text id="0d5c3w"
Worker
 ↓
NAT Gateway
 ↓
External API
```

The Worker does **not** need a public IP.

### Important distinction

```text id="3z8q5p"
NAT Gateway
= Outbound Internet Access

Internet Gateway
= VPC ↔ Internet connectivity
```

NAT Gateway does **not** make the private Worker publicly reachable.

### 🎯 Strong interview answer

> **“A NAT Gateway provides outbound internet connectivity for resources in private subnets while preventing direct inbound internet connections. In CWD, if a private ECS Worker needs to call an external API, its traffic can go through the NAT Gateway. The Worker doesn't need a public IP.”**

**Memory:**
**Private Subnet → NAT → Internet = Outbound only**
