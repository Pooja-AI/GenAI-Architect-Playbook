## Blue-Green deployment for CWD

**Blue = current production version**
**Green = new version**

```text id="p7z2cw"
                Load Balancer
                     ↓
              ┌──────┴──────┐
              ↓             ↓
        Blue - v1       Green - v2
        Production       New version
              │             │
              └──────┬──────┘
                     ↓
                 Monitoring
```

### Steps

1. **Blue is serving 100% traffic.**
2. Deploy the new CWD version to **Green**.
3. Run health checks, integration tests, and LLM evaluation.
4. Send a small amount of traffic to Green if using a controlled transition.
5. Monitor:

   * 5xx errors
   * P95/P99 latency
   * CPU/memory
   * Bedrock errors/throttling
   * agent/tool failures
   * LLM quality metrics
6. If healthy → shift **100% traffic to Green**.
7. If unhealthy → route traffic back to **Blue**.
8. Keep Blue available for a rollback window, then terminate it.

### AWS implementation

For CWD, I would use **ECS/Fargate + ALB**, typically with **CodeDeploy blue-green deployment**.

```text id="m0r8fd"
CodePipeline
    ↓
CodeBuild
    ↓
ECR
    ↓
CodeDeploy
   ↙     ↘
Blue     Green
   ↓       ↓
 ALB Target Groups
       ↓
   Traffic Shift
```

### Interview answer

> “For CWD, I would use ECS/Fargate with ALB and CodeDeploy blue-green deployment. The existing version remains Blue while the new version is deployed to Green. I run health, integration, and LLM quality checks, then gradually shift traffic to Green while monitoring errors, latency, infrastructure and AI-quality metrics. If anything degrades, I immediately shift traffic back to Blue.”
