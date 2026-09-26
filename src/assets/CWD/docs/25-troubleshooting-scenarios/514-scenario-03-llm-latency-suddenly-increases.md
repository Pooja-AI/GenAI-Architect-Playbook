### Scenario 3: LLM latency suddenly increases

I would investigate in this order:

1. **Check LLM provider metrics**

   * Azure OpenAI/Bedrock latency
   * Any service degradation or throttling

2. **Check token size**

   * Input/output tokens suddenly increased?
   * Large prompts or too much conversation history?

3. **Check model**

   * Did traffic switch to a larger/slower model?
   * Was model routing changed?

4. **Check 429/throttling**

   * Requests exceeding TPM/RPM limits?
   * Retry/backoff adding extra latency?

5. **Check concurrent traffic**

   * Sudden traffic spike?
   * Queueing requests before they reach the model?

6. **Check number of LLM calls**

   * Did one request start making multiple sequential LLM calls?

### Interview answer

> **"I would first check the LLM provider latency and throttling metrics, then compare token usage, model selection, concurrency, and number of LLM calls against the normal baseline. I would use tracing to identify whether the delay is provider latency, throttling, queueing, or our application logic. Then I would optimize the specific bottleneck—for example, reduce tokens, use model routing, parallelize calls, or increase capacity."**
