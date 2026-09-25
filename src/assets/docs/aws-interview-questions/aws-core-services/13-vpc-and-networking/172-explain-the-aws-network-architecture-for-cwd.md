## AWS Network Architecture for CWD

For CWD, I would use a **VPC with public subnets for the entry layer and private subnets for all application services**.

```text
                         Internet / Users
                               │
                               ▼
                         API Gateway
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Public Subnets    │
                    │   ALB / NAT GW      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Private Subnets   │
                    │                     │
                    │  Coordinator       │
                    │       ↓             │
                    │  Delegators        │
                    │       ↓             │
                    │  Workers           │
                    └───────┬─────────────┘
                            │
             ┌──────────────┼─────────────────┐
             ▼              ▼                 ▼
          DynamoDB        S3              OpenSearch
             │
             ▼
          Bedrock
```

### 1. VPC and Availability Zones

I would deploy the CWD application across **multiple Availability Zones** for high availability.

```text
VPC
 ├── AZ-1
 │    ├── Public subnet
 │    └── Private subnet
 │
 └── AZ-2
      ├── Public subnet
      └── Private subnet
```

### 2. Public vs private subnets

**Public subnet:**

* ALB, if internet-facing
* NAT Gateway

**Private subnet:**

* ECS/Fargate Coordinator
* Delegators
* Workers
* Internal services

The application containers should **not have public IP addresses**.

### 3. Security Groups

Use least-privilege network rules.

```text
ALB SG
 ↓ port 443
Coordinator SG
 ↓ required port
Delegator SG
 ↓ required port
Worker SG
```

For example, a Worker Security Group should allow traffic only from the appropriate Delegator/service, not from the entire internet.

### 4. Service-to-service communication

For internal CWD communication:

```text
Coordinator
    ↓
Internal service discovery / Load Balancer
    ↓
Delegator
    ↓
Worker
```

Use **private DNS/service discovery**, TLS, authentication and authorization.

### 5. AWS service connectivity

For services such as S3 and other supported AWS services, use **VPC endpoints** where appropriate.

```text
Private ECS
    ↓
VPC Endpoint
    ↓
AWS Service
```

This reduces the need for internet-based paths.

### 6. NAT Gateway

If private ECS tasks need outbound internet access—for example, to reach an external API—traffic can go:

```text
Private ECS
    ↓
NAT Gateway
    ↓
Internet
```

NAT is for **outbound** connectivity; it does not make the ECS task publicly reachable.

### 7. Network security layers

I would use:

* VPC
* Private subnets
* Security Groups
* Network ACLs where appropriate
* VPC endpoints
* TLS
* IAM roles
* AWS WAF at the public API boundary where applicable
* CloudTrail/CloudWatch monitoring

### 🎯 Strong interview answer

> **“For CWD, I would use a multi-AZ VPC with public subnets for the controlled ingress layer and private subnets for the Coordinator, Delegators, and Workers. API Gateway and the ALB provide the entry boundary, while ECS tasks remain private without public IPs. Security Groups restrict service-to-service traffic, and private service discovery handles internal communication. I would use VPC endpoints for supported AWS services, NAT only when private workloads need outbound internet access, and TLS, IAM, and CloudTrail/CloudWatch for additional security and observability.”**

**Memory:**
**VPC → Public Entry → Private ECS → SG → VPC Endpoints → NAT → Monitor**
