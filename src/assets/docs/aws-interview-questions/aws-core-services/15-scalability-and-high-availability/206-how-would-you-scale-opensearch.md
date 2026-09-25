## How would you scale OpenSearch?

Scale **data nodes / capacity** based on search and indexing workload.

```text id="t7m3qa"
More RAG Traffic
      ↓
OpenSearch
 ┌────┬────┬────┐
 ↓    ↓    ↓
Node Node Node
      ↓
Scale Capacity
```

### What I would monitor

* Search **P95/P99 latency**
* Search/indexing throughput
* CPU utilization
* Memory / JVM pressure
* Storage utilization
* Indexing errors
* Request throttling
* Queue/rejected requests

### CWD approach

1. **Horizontal scaling** → add capacity/nodes rather than only increasing one node.
2. **Shard data** appropriately so search/indexing work is distributed.
3. **Replica shards** → improve read scalability and availability.
4. **Separate indexing and search workload** where the deployment architecture supports it.
5. **Scale based on actual workload**, not simply number of users.
6. For **OpenSearch Serverless**, adjust capacity based on workload and let the service handle underlying infrastructure scaling.

### Interview answer

> “I would scale OpenSearch based on search and indexing workload. I would monitor P95/P99 search latency, CPU, JVM pressure, storage, throughput, and rejected requests. For a managed cluster, I can add capacity and distribute data using shards and replicas. For OpenSearch Serverless, I would use its managed capacity scaling and tune the workload, while monitoring retrieval latency and cost.”

**Memory:**
**Traffic → Monitor → Shards → Replicas → Capacity → Optimize**
