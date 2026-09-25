## SageMaker vs Bedrock

|                | **Amazon Bedrock**                   | **Amazon SageMaker**                    |
| -------------- | ------------------------------------ | --------------------------------------- |
| Main purpose   | GenAI / Foundation Models            | Custom ML                               |
| Training       | Usually not your main focus          | Train custom models                     |
| Models         | Managed foundation models            | Bring/train/customize ML models         |
| Fine-tuning    | Supported for some foundation models | Extensive customization                 |
| Deployment     | Managed model inference              | Custom model endpoints                  |
| CWD example    | Customer briefing, RAG, LLM response | Intent classifier, custom ranking model |
| Infrastructure | More managed                         | More control                            |

### Simple CWD example

```text
User
 ↓
Coordinator
 ├── SageMaker → Custom Intent Classifier
 │
 └── Bedrock → LLM / RAG Response
```

### Interview answer

> “Bedrock is primarily for consuming foundation models and building GenAI applications, while SageMaker is for developing and managing custom ML models. In CWD, I would use Bedrock for LLM-based generation and RAG, and SageMaker when we need custom model training, deployment, or specialized ML inference.”

**Memory:**
**Bedrock = GenAI | SageMaker = Custom ML**
