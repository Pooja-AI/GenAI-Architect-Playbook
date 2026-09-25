## Horizontal scaling of CWD

**Horizontal scaling = add more instances/tasks instead of making one server bigger.**

```text
                    API Gateway
                         ↓
                       ALB
                         ↓
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
     Coordinator     Coordinator     Coordinator
          ↓              ↓              ↓
      Delegators      Delegators      Delegators
          ↓              ↓              ↓
       Workers         Workers         Workers
          ↓
   SQS / Redis / DynamoDB
```

### How I would do it

1. **Containerize** Coordinator, Delegators, and Workers.
2. Deploy them as **ECS/Fargate services** across multiple AZs.
3. Keep services **stateless**; store state in **DynamoDB/Redis**, not local memory.
4. Use **ALB** to distribute requests across tasks.
5. Configure **ECS Auto Scaling** based on CPU, memory, request count, P95 latency, or queue depth.
6. Use **SQS** to buffer workloads and prevent downstream overload.
7. Scale **Coordinator, each Delegator, and Workers independently** based on their workload.
8. Use **idempotency** so retries/duplicate messages don't create duplicate business actions.

### Interview answer

> “I would scale CWD horizontally by running multiple Coordinator, Delegator, and Worker instances on ECS/Fargate across multiple AZs. I would keep them stateless and externalize state to DynamoDB and Redis. ALB distributes traffic, ECS Auto Scaling adds or removes tasks, and SQS provides buffering for asynchronous workloads. I would scale each layer independently based on its own traffic, latency, and queue depth.”

**Memory:**
**Stateless → Multiple Tasks → Load Balance → Auto Scale → Queue → Independent Scaling**
