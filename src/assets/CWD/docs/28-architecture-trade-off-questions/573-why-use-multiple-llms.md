### Why use multiple LLMs?

We use multiple LLMs mainly for **model routing** based on task complexity.

* **Simple tasks** → smaller/faster/cheaper model.
* **Complex reasoning** → larger/more capable model.
* **Vision tasks** → multimodal/vision model.
* **Fallback** → another approved model if the primary model is unavailable.
* **Cost optimization** → avoid using an expensive model for every request.
* **Latency optimization** → use faster models for simple requests.

**Example:**

```text
User Request
     ↓
Task Classifier
   ↙       ↘
Simple    Complex
  ↓          ↓
Small LLM  Large LLM
```

**Interview answer:**

> “We used multiple LLMs because different tasks have different complexity, latency, and cost requirements. A routing layer selects a smaller model for simple tasks and a more capable model for complex reasoning or multimodal tasks. We can also use an approved fallback model for availability and reliability.”
