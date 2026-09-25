## What role does SageMaker play alongside Bedrock?

Think of it simply:

```text
                    CWD
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
       Bedrock               SageMaker
          │                     │
   Foundation Models       Custom ML Models
          │                     │
   GenAI / LLM calls       Train / Fine-tune
   Embeddings              Deploy / Monitor
   Generation              Custom prediction
```

### Bedrock

Use when you need **foundation models / GenAI**:

* LLM generation
* embeddings
* summarization
* reasoning
* RAG responses

### SageMaker

Use when you need **custom ML**:

* train your own model
* fine-tune/customize models
* deploy ML endpoints
* model evaluation and monitoring
* custom classifiers/ranking models

### CWD example

```text
User Request
     ↓
Coordinator
     ↓
SageMaker → Intent Classification
     ↓
Delegator
     ↓
Worker
     ↓
Bedrock → LLM Response
```

### Interview answer

> “Bedrock and SageMaker complement each other. I would use Bedrock for foundation-model and GenAI workloads, while SageMaker would be used when CWD requires custom ML models, training, deployment, or monitoring. For example, SageMaker could classify the user intent, and Bedrock could generate the final customer briefing.”

**Memory:**
**Bedrock = Use Foundation Models | SageMaker = Build/Manage Custom ML**
