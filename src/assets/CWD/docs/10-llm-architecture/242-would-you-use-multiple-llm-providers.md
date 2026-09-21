## Would you use multiple LLM providers?

**Yes, potentially—but I would not introduce multiple providers by default.** In CWD, I would start with **Azure OpenAI as the primary provider** because the platform is Azure-based and we already have enterprise security, networking, identity, monitoring, and governance around it.

I would introduce a second provider only when there is a clear architectural requirement such as **resilience, model capability, cost optimization, or avoiding provider-specific dependency**.

### CWD architecture

```text id="q2m7ka"
                    CWD
                     ↓
                Model Router
                ↙         ↘
        Azure OpenAI     Provider 2
          Primary          Fallback
             ↓               ↓
             └───────┬───────┘
                     ↓
              Standardized
              LLM Interface
                     ↓
              Coordinator/Worker
```

### When multiple providers make sense

**1. Availability**

If the primary provider has an outage:

```text
Azure OpenAI unavailable
        ↓
Provider 2
        ↓
Continue workflow
```

**2. Different model capabilities**

One provider may have a model better suited for a specific task, such as:

* Complex reasoning
* Multimodal processing
* Long-context workloads
* Lower-cost classification

**3. Cost optimization**

For simple tasks:

```text
Classification → lower-cost model
Complex reasoning → more capable model
```

**4. Avoid excessive vendor lock-in**

I can keep the application layer provider-neutral so switching models doesn't require rewriting the Coordinator and Workers.

---

## But there are trade-offs

Multiple providers increase:

* Security and compliance complexity
* Monitoring complexity
* Prompt/model compatibility testing
* Tool-calling differences
* Data-governance requirements
* Operational overhead
* Cost of maintaining multiple integrations

So I wouldn't use multiple providers just because they are available.

### How I would design it

Create a common model abstraction:

```python
class LLMProvider:
    def generate(self, request):
        pass

    def generate_with_tools(self, request, tools):
        pass
```

Then:

```text id="h4w8mz"
                Model Router
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
   AzureOpenAIAdapter   Provider2Adapter
          ↓                   ↓
      Azure Model        Other Model
```

The CWD application doesn't need to know the provider-specific implementation.

---

### Important CWD consideration

Because Workers use **MCP**, the fallback provider must support the capabilities required by the Worker.

For example:

```text id="d8n4cf"
Worker
  ↓
Model
  ↓
Tool call
  ↓
MCP Client
  ↓
MCP Server
  ↓
Salesforce
```

If Provider 2 cannot reliably produce the required structured tool calls, I wouldn't use it as the fallback for that particular Worker.

---

### 🎯 Strong interview answer

> **“I would consider multiple LLM providers, but I wouldn't introduce them by default. For CWD, Azure OpenAI would remain the primary provider because of our Azure enterprise ecosystem and governance. A second provider could be introduced for resilience, specialized capabilities, or cost optimization. I would place a model router and provider abstraction in front of the models, and validate that the fallback supports our context, structured output, and MCP tool-calling requirements. The trade-off is increased security, testing, monitoring, and operational complexity, so there should be a clear business reason for multi-provider architecture.”**

### Easy memory trick

**Primary → Need → Router → Validate → Fallback**

Key line:

> **“Multi-provider is an architectural trade-off, not automatically a best practice.”**
