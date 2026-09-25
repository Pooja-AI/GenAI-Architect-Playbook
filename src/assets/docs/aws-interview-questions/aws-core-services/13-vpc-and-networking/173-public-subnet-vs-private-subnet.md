## Public subnet vs Private subnet

The main difference is **whether resources have a route to the Internet Gateway**.

|                        | Public Subnet                 | Private Subnet                     |
| ---------------------- | ----------------------------- | ---------------------------------- |
| Internet Gateway route | ✅ Yes                         | ❌ No direct route                  |
| Public IP              | Can have one                  | Typically no public IP             |
| Internet inbound       | Possible with proper controls | Not directly                       |
| Typical CWD use        | ALB, NAT Gateway              | ECS Coordinator/Delegators/Workers |
| Security               | More exposed                  | More isolated                      |

### CWD example

```text
Internet
   ↓
Internet Gateway
   ↓
Public Subnet
   ↓
ALB
   ↓
Private Subnet
   ↓
ECS/Fargate
 ┌──────┼──────┐
Coordinator
Delegators
Workers
```

### Private ECS needs internet?

It can use:

```text
Private ECS
    ↓
NAT Gateway
    ↓
Internet
```

The ECS task can make **outbound** connections, but the internet cannot directly initiate connections to the ECS task.

### 🎯 Strong interview answer

> **“A public subnet has a route to an Internet Gateway, so resources such as an internet-facing ALB can be placed there. A private subnet does not have direct Internet Gateway access, so I would place CWD ECS services there for isolation. If those services need outbound internet access, they can use a NAT Gateway.”**

**Memory:**
**Public = Internet Gateway route**
**Private = No direct Internet Gateway route**
