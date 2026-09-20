In your **CWD (Coordinator → Delegator → Worker)** architecture, a **Single Point of Failure (SPOF)** is a component where **if that component fails, the whole workflow—or a critical part of it—stops working**.

For an AI Architect interview, don't just list SPOFs. Explain **how you remove or reduce each one**.

### Potential SPOFs in CWD

| Component                       | Failure impact                           | How I would mitigate it                                                         |
| ------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| **Coordinator**                 | Entire workflow may stop                 | Multiple instances + load balancer + stateless design + checkpointing           |
| **Delegator**                   | A particular domain workflow may stop    | Multiple replicas + health checks + checkpointing                               |
| **LLM endpoint**                | Reasoning/planning may fail              | Model fallback + retry + timeout + circuit breaker                              |
| **MCP Server**                  | Workers cannot access required tools     | Multiple MCP instances + health checks + retry/circuit breaker                  |
| **Salesforce / ServiceNow**     | Specific business capability unavailable | Retry + timeout + fallback/partial result where business rules allow            |
| **Redis**                       | Cache/session access may be lost         | Redis replication/cluster + failover; don't make cache the only source of truth |
| **Cosmos DB**                   | Durable state may become unavailable     | Replication + appropriate consistency/backup strategy                           |
| **Service Bus**                 | Async jobs/events may stop flowing       | Managed-service redundancy + DLQ + retry + monitoring                           |
| **Azure AI Search**             | RAG retrieval unavailable                | Replication/partitioning + fallback behavior                                    |
| **Key Vault**                   | Secrets/configuration unavailable        | Managed redundancy + cached short-lived configuration where appropriate         |
| **API Gateway / FastAPI layer** | Users cannot enter the system            | Multiple API instances + load balancer                                          |

### Most important CWD SPOF: Coordinator

Your architecture starts here:

```text
                    Coordinator
                        ↓
                  Delegator(s)
                        ↓
                     Workers
```

If you have only **one Coordinator instance** and it goes down:

```text
Users
  ↓
❌ Coordinator
  ↓
No workflow
```

So I would deploy:

```text
                 Load Balancer
                  /          \
                 ↓            ↓
        Coordinator-1   Coordinator-2
                 \            /
                  ↓          ↓
                 Shared State
                    ↓
                Delegators
```

The Coordinator should be **stateless as much as practical**, with workflow state stored externally. That way another instance can continue processing.

---

### Worker is different

A Worker failure does **not necessarily mean the entire CWD system fails**.

For example:

```text
Sales Delegator
   ├── Salesforce Worker → ✅
   ├── Revenue Worker    → ✅
   └── Customer Worker   → ❌
```

The architecture can:

1. Retry the failed Worker
2. Use a timeout
3. Move repeated failures to DLQ
4. Determine whether that Worker is mandatory
5. Continue with partial results if the business rule allows
6. Persist the workflow state
7. Resume the failed Worker later

So **Worker failure is usually a partial failure, not necessarily a system-wide SPOF**.

### Interview answer

> **“The main potential single points of failure in CWD are the Coordinator, shared state, LLM endpoint, MCP services, and critical enterprise dependencies. I would eliminate these through horizontal replicas, load balancing, durable checkpointing, managed-service redundancy, retries, timeouts, circuit breakers, and graceful degradation. For example, the Coordinator would run as multiple instances behind a load balancer, while workflow state would be persisted externally so another Coordinator can resume an interrupted workflow. For Worker failures, we use retries and partial-failure handling rather than allowing one Worker to bring down the entire workflow.”**

### One strong architect-level point

Don't say **“there are no single points of failure.”**

A better answer is:

> **“I identify potential SPOFs and design the system so that failure of any single component does not cause an unacceptable system-wide outage.”**

That demonstrates **high availability and failure-domain thinking**, which is much stronger in an AI Architect interview.
