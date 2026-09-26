### Scenario 17: One tenant generates extremely high traffic

This is a **multi-tenant isolation + scalability** problem.

1. **Identify the noisy tenant**

   * Track requests, tokens, CPU, latency, and cost **per tenant**.

2. **Apply tenant-level rate limits**

   * Use **APIM/API Gateway** to limit requests per tenant.
   * Example: `Tenant A → 100 requests/min`.

3. **Use quotas**

   * Set limits for requests, tokens, concurrency, and expensive operations.

4. **Isolate resources**

   * Use separate queues or worker pools where needed.
   * Prevent one tenant from consuming all shared capacity.

5. **Autoscale**

   * Scale Workers/containers based on queue depth, CPU, request rate, etc.

6. **Prioritize traffic**

   * Use queues and priority policies so other tenants continue receiving service.

7. **Monitor per-tenant usage**

   * Dashboard:
     `tenant → requests → tokens → latency → errors → cost`

### Interview answer

> **"I would treat this as a noisy-neighbor problem. I would monitor traffic and resource consumption per tenant, then enforce tenant-level rate limits, quotas, and concurrency limits at the API layer. I would isolate workloads using queues or worker pools and autoscale based on demand. This prevents one tenant from exhausting shared resources and affecting other tenants."**
