### How would you detect latency degradation?

Monitor **P50, P95, and P99 latency** over time and compare them against the normal baseline/SLA.

```text id="q7m2kx"
Request
   ↓
CloudWatch / X-Ray
   ↓
P50 / P95 / P99
   ↓
Compare with baseline
   ↓
Threshold exceeded?
   ↓
Alarm
```

For CWD, break latency down by component:

* API Gateway
* Coordinator
* Delegator
* Worker
* MCP/tool calls
* OpenSearch retrieval
* Bedrock inference

Example:

```text id="n6v4ta"
Normal P95 = 3 sec
Current P95 = 6 sec
        ↓
CloudWatch Alarm
        ↓
X-Ray trace
        ↓
Find slow component
```

### Interview answer

> “I detect latency degradation by monitoring P50, P95 and P99 latency and comparing them with historical baselines and SLA thresholds. When P95 or P99 increases significantly, CloudWatch triggers an alarm. I then use X-Ray or OpenTelemetry traces and correlation IDs to identify whether the latency is coming from the API, Coordinator, Worker, MCP, OpenSearch, or Bedrock.”

**Memory:**
**Measure → Compare → Alarm → Trace → Find bottleneck**
