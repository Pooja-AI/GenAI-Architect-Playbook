## Gateway Endpoint vs Interface Endpoint

The simple difference:

**Gateway endpoint = route-based**
**Interface endpoint = private network interface**

|                 | Gateway Endpoint          | Interface Endpoint             |
| --------------- | ------------------------- | ------------------------------ |
| Technology      | Route table               | AWS PrivateLink                |
| Uses ENI        | ❌ No                      | ✅ Yes                          |
| Cost            | No hourly endpoint charge | Hourly/data processing charges |
| Main examples   | **S3, DynamoDB**          | Many AWS services              |
| Security Groups | Not attached to endpoint  | Can use Security Groups        |
| DNS             | Not required in same way  | Private DNS commonly used      |

### CWD example

**S3:**

```text id="5s7h1v"
Private ECS
    ↓
Route Table
    ↓
Gateway Endpoint
    ↓
S3
```

**Secrets Manager:**

```text id="f2y8qa"
Private ECS
    ↓
Interface Endpoint
    ↓
Private ENI
    ↓
Secrets Manager
```

### Easy memory

> **Gateway = Route**
> **Interface = ENI + PrivateLink**

### 🎯 Strong interview answer

> **“Gateway endpoints are route-table based and are primarily used for S3 and DynamoDB. Interface endpoints use AWS PrivateLink and create private network interfaces inside the VPC, allowing private connectivity to many AWS services. In CWD, I would typically use a gateway endpoint for S3 and interface endpoints for services such as Secrets Manager and other supported APIs.”**
