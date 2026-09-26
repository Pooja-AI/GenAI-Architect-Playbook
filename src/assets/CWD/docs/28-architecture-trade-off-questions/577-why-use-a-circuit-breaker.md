### Why use a circuit breaker?

A **circuit breaker prevents repeated calls to a failing dependency** and protects the rest of the system.

Example: Salesforce is down.

```text
Worker → Salesforce
          ↓
       failures
          ↓
   Circuit OPEN
          ↓
Stop calling Salesforce temporarily
```

* Prevents **cascading failures**.
* Reduces unnecessary **timeouts and latency**.
* Protects downstream systems from additional load.
* Allows the system to **recover gracefully**.
* After a cooldown, it moves to **half-open** and tests the dependency again.

**Interview answer:**

> “We use a circuit breaker to prevent repeated calls to an unhealthy dependency such as Salesforce or an LLM provider. After consecutive failures, the circuit opens and temporarily stops requests. After a cooldown period, it enters half-open state and tests the dependency. This prevents cascading failures and improves overall system reliability.”
