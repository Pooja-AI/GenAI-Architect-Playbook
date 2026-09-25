## How would you implement model fallback?

I would keep a **secondary approved model** ready and route traffic to it when the primary model fails or violates thresholds.

```text id="1upj38"
Worker
  ↓
Primary Model
  ↓
Failure / Timeout / High Error Rate
  ↓
Fallback Model
  ↓
Prediction
```

### Practical approach

1. Deploy **Primary Model v2**.
2. Keep **Fallback Model v1** available.
3. Monitor errors, latency, and model availability.
4. If v2 fails → switch traffic to v1.
5. Use **circuit breaker** to prevent repeated calls to the failing model.
6. Log the fallback event for investigation.

### Example

```text
v2 → timeout
     ↓
Circuit Breaker
     ↓
v1 → prediction
```

### Interview answer

> “I implement model fallback by keeping a previously approved model available alongside the primary model. If the primary model has repeated timeouts, errors, or availability issues, the Worker or routing layer switches traffic to the fallback model. I use bounded retries and a circuit breaker to avoid repeatedly calling the unhealthy model, and I monitor fallback events for further investigation.”

**Memory:** `Primary → Failure → Circuit Breaker → Fallback → Monitor`
