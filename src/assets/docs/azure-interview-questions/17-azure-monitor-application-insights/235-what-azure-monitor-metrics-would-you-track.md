# What Azure Monitor metrics would you track?

## Short answer
Track health, capacity, quality and cost metrics at each layer.

## Key points
- Service: request rate, p95 latency, error rate.
- Azure OpenAI: tokens, throttled requests, PTU utilisation. AI Search: latency and throttling. Service Bus: active and dead-lettered messages.
- Containers: replicas, restarts, CPU. Cosmos DB: RU consumption and 429s. Redis: hit rate and memory. APIM: capacity.
- Agent metrics: steps per run, tool failure rate, loop-guard hits; quality: groundedness and task success; cost per request.

## CWD context
Choose a handful of SLO metrics, and keep the rest for diagnosis.
