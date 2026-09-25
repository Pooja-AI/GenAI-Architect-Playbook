## When would you use SageMaker instead of Bedrock?

Use **SageMaker** when the requirement is primarily **custom ML/model lifecycle**, rather than simply consuming a managed foundation model.

### Examples

```text
Need custom ML?
      ↓
   SageMaker
   ├── Train custom model
   ├── Fine-tune/customize
   ├── Custom inference endpoint
   ├── Custom algorithms
   └── Model monitoring
```

### CWD example

If CWD needs a **custom intent-classification model** trained on Onsemi historical requests, I would use SageMaker.

```text
User Request
     ↓
SageMaker Custom Classifier
     ↓
Intent
     ↓
Coordinator
     ↓
Delegator → Worker
```

For generating a customer briefing using an LLM, I would use **Bedrock**.

### Interview answer

> “I would choose SageMaker when I need significant control over training, customization, deployment, or monitoring of a custom ML model. I would choose Bedrock when I primarily need managed foundation models for GenAI capabilities such as generation, embeddings, or RAG.”

**Memory:**
**Custom ML → SageMaker | Foundation-model GenAI → Bedrock**
