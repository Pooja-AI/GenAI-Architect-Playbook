## How would you perform canary deployment?

Canary deployment means sending a **small percentage of production traffic to the new model first**, validating it, and then gradually increasing traffic.

```text
Production Traffic
       ↓
    Router
    ↙    ↘
 Old v1  New v2
  90%      10%
            ↓
        Monitor
            ↓
       Healthy?
       ↙       ↘
     Yes        No
      ↓          ↓
25% → 50%     Rollback
      ↓
     100%
```

### Practical steps

1. Keep **v1** as the current production model.
2. Deploy **v2** alongside it.
3. Send, for example, **10% traffic → v2**.
4. Monitor:

   * Error rate
   * P95/P99 latency
   * Model quality
   * Throttling
5. If healthy → increase **10% → 25% → 50% → 100%**.
6. If problems occur → immediately route traffic back to **v1**.

### Interview answer

> “I use canary deployment by deploying the new model alongside the current production model and initially sending a small percentage of traffic to it. I monitor both infrastructure and model-quality metrics. If the new model remains within the predefined thresholds, I gradually increase traffic. If it fails, I immediately shift traffic back to the previous model.”

**Memory:** `10% → Monitor → 25% → 50% → 100% | Failure → Rollback`
