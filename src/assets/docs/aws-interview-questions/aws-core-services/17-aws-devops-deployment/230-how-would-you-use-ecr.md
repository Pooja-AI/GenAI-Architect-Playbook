## How would you use ECR?

**Amazon ECR (Elastic Container Registry) stores and manages the Docker images used by CWD.**

```text
CodeBuild
   ↓
Docker Build
   ↓
ECR
   ↓
ECS/Fargate
   ↓
Coordinator / Delegator / Worker
```

### In CWD

1. **Build image** → CodeBuild creates Docker images.
2. **Security scan** → scan images for vulnerabilities.
3. **Tag image** → use immutable version/commit tags.
4. **Push to ECR** → store Coordinator, Delegator, and Worker images.
5. **ECS pulls image** → ECS task definition references the required image version.
6. **Lifecycle policy** → remove old/unused images to control storage cost.
7. **DR** → replicate critical images to the DR region.

### Important

I prefer **immutable image tags**:

```text
cwd-coordinator:git-a81f92
cwd-sales-worker:git-a81f92
```

instead of repeatedly deploying:

```text
cwd-coordinator:latest
```

This makes deployments and rollbacks predictable.

### Interview answer

> “I use ECR as the private container registry for CWD. CodeBuild builds and scans the Docker images, tags them with an immutable version or Git commit, and pushes them to ECR. ECS/Fargate pulls those exact images during deployment. I also use lifecycle policies to clean up old images and replicate critical images to the DR region.”

**Memory:**
**Build → Scan → Tag → Push → ECS Pull → Lifecycle → DR**
