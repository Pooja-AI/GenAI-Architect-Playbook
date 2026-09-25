## Canary deployment for CWD

**Canary = send a small percentage of traffic to the new version first, validate it, then gradually increase traffic.**

```text
Users
  ↓
ALB
  ↓
90% ──→ CWD v1  (Stable)
10% ──→ CWD v2  (Canary)
             ↓
          Monitor
             ↓
      Healthy? → Increase
             ↓
      25% → 50% → 100%
```

### Steps

1. Deploy **v2** alongside the current v1.
2. Route a small percentage, e.g. **5–10%**, to v2.
3. Monitor:

   * 5xx/error rate
   * P95/P99 latency
   * CPU/memory
   * Bedrock throttling
   * MCP/tool failures
   * LLM quality/groundedness
4. If healthy → increase traffic gradually.
5. If unhealthy → route 100% back to v1.
6. After validation → v2 becomes the production version.

### AWS implementation

For CWD:

```text
CodePipeline
     ↓
CodeDeploy
     ↓
ECS/Fargate
     ↓
ALB
 ↓          ↓
v1         v2
90%        10%
            ↓
       Monitor
            ↓
     25% → 50% → 100%
```

I would use **ECS/Fargate + ALB + CodeDeploy** for controlled traffic shifting.

### Interview answer

> “I implement canary deployment by running the new CWD version alongside the current version and initially sending a small percentage of traffic to it. I monitor infrastructure, latency, errors, Bedrock throttling, tool failures, and AI-quality metrics. If the metrics remain healthy, I gradually increase traffic until the new version reaches 100%. If there is degradation, I immediately route traffic back to the stable version.”

**Memory:**
**Small Traffic → Monitor → Increase → 100% | Problem → Rollback**
