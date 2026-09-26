### Scenario 2: Salesforce Worker takes 10 seconds. What do you investigate?

I would check the latency **inside the Salesforce Worker step-by-step**:

1. **MCP latency**

   * How long does MCP Client → MCP Server take?
   * Is there connection/setup overhead?

2. **Salesforce API latency**

   * Salesforce API response time
   * Slow SOQL query?
   * Too many records returned?

3. **Network**

   * DNS/TLS/connection latency
   * Private network/VPN/API gateway overhead

4. **Authentication**

   * Is the worker requesting a new OAuth token for every call?
   * Use **token reuse/caching** where appropriate.

5. **Sequential calls**

   * Is the worker making multiple Salesforce calls sequentially?
   * Independent calls can be executed **in parallel**.

6. **Retries**

   * Did Salesforce return 429/5xx?
   * Check retry count and backoff time.

7. **Payload size**

   * Is the worker retrieving unnecessary fields or too many records?

### Interview answer

> **"I would use distributed tracing to break the 10 seconds into MCP, network, authentication, Salesforce API, and response-processing latency. Then I would check slow SOQL queries, token acquisition, retries, payload size, and whether multiple independent Salesforce calls are sequential. Based on the bottleneck, I would optimize the query, reuse connections and tokens, parallelize calls, or tune timeout and retry policies."**
