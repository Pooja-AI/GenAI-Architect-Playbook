## What are VPC Endpoints?

**VPC endpoints allow resources inside a VPC to access supported AWS services privately, without going through the public internet.**

```text id="x5k7pd"
Private ECS Worker
       ↓
   VPC Endpoint
       ↓
    AWS Service
```

### Two main types

**1. Gateway Endpoint**

* Mainly for **S3 and DynamoDB**
* No hourly endpoint charge
* Example:

```text id="q6c9au"
Private ECS → S3 Gateway Endpoint → S3
```

**2. Interface Endpoint**

* Uses **AWS PrivateLink**
* Creates private network interfaces in your subnet
* Used for many AWS services such as Secrets Manager and supported Bedrock APIs.

```text id="h0u3nv"
Private ECS
     ↓
Interface Endpoint
     ↓
AWS Service
```

### Why use them in CWD?

They help keep AWS service traffic **private** and reduce the need for NAT/internet routing.

### 🎯 Strong interview answer

> **“VPC endpoints provide private connectivity from resources inside a VPC to supported AWS services. In CWD, I can use gateway endpoints for S3 and DynamoDB, and interface endpoints using PrivateLink for supported services such as Secrets Manager and Bedrock. This allows private workloads to access AWS services without requiring public internet connectivity.”**

**Memory:**
**VPC Endpoint = Private path to AWS services**
