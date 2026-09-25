## Why use Bedrock for LLM inference but SageMaker for another ML model?

Because they solve **different ML needs**.

|                | Bedrock                    | SageMaker              |
| -------------- | -------------------------- | ---------------------- |
| Main purpose   | Foundation/LLM inference   | Custom ML models       |
| Example        | GPT/Claude/Llama           | Intent classifier      |
| Training       | Usually not needed         | Train/customize models |
| Infrastructure | Managed by AWS             | More control           |
| CWD example    | Generate Customer Briefing | Classify user intent   |

### CWD example

```text
User Request
     ↓
Coordinator
     ↓
Intent Classifier ──→ SageMaker
     ↓
Customer Briefing
     ↓
LLM ──→ Bedrock
     ↓
Final Response
```

### Interview answer

> “I use Bedrock when I need managed foundation-model capabilities for tasks like generation, summarization, or embeddings. I use SageMaker when I have a specialized ML model that we need to train, customize, evaluate, and manage through the ML lifecycle. For example, in CWD, SageMaker could host an intent-classification model, while Bedrock handles the LLM-based customer briefing generation.”

**Memory:** **Bedrock = Foundation Models | SageMaker = Custom ML**
