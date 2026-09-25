## Security Group vs NACL

The easiest way to remember:

**Security Group = resource-level firewall**
**NACL = subnet-level firewall**

|                 | Security Group         | NACL                       |
| --------------- | ---------------------- | -------------------------- |
| Applied to      | ENI/resource           | Subnet                     |
| State           | **Stateful**           | **Stateless**              |
| Rules           | Allow only             | Allow + Deny               |
| Return traffic  | Automatically allowed  | Must explicitly allow      |
| Typical CWD use | ECS service protection | Additional subnet boundary |

### CWD example

```text id="7t3q9k"
Internet
   ↓
ALB
   ↓
[ NACL ]
   ↓
Private Subnet
   ↓
[ Security Group ]
   ↓
ECS Worker
```

### Security Group

Example:

```text id="x8c2vp"
Worker SG
  Allow HTTPS
  Source = Delegator SG
```

So only the authorized Delegator can reach the Worker on the required port.

### NACL

At the subnet level, you could have rules such as:

```text id="k4m9ws"
Allow required traffic
Deny known unwanted traffic
```

Because NACLs are **stateless**, inbound and outbound traffic must be handled separately.

### 🎯 Strong interview answer

> **“Security Groups are stateful, resource-level firewalls attached to ENIs, and they primarily control which sources can reach a service. NACLs are stateless, subnet-level controls that support both allow and deny rules. In CWD, I would use Security Groups as the primary service-to-service network control and NACLs as an additional subnet-level defense layer.”**

**Memory:**
**SG = Stateful + Resource**
**NACL = Stateless + Subnet**
