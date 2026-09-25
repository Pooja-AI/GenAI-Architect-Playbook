## Why would you use SageMaker in CWD?

I would use **Amazon SageMaker** when CWD needs to **build, train, evaluate, deploy, or monitor custom ML models**.

```text
Enterprise Data
      ↓
     Glue
      ↓
   S3 / Feature Data
      ↓
   SageMaker
   ├── Train
   ├── Evaluate
   └── Deploy
      ↓
 CWD Worker / API
```

### In CWD, examples

* **Custom intent classifier** → identify user intent before Coordinator routing.
* **Risk/fraud/anomaly models** → if the business requires custom ML.
* **Custom ranking model** → improve retrieval/ranking.
* **Model training & experimentation** → SageMaker training jobs.
* **Model endpoint** → real-time predictions from Workers.
* **Model monitoring** → detect model/data drift.

### SageMaker vs Bedrock

| Service       | CWD use                                                           |
| ------------- | ----------------------------------------------------------------- |
| **Bedrock**   | Foundation/LLM capabilities without managing model infrastructure |
| **SageMaker** | Custom ML model training, deployment, tuning, and monitoring      |

### Interview answer

> “In CWD, I would use SageMaker when we need custom ML models rather than only foundation models. For example, we could train an intent classifier or custom ranking model using enterprise data, deploy it through SageMaker, and call it from the Coordinator or Worker. Bedrock would handle foundation-model and GenAI workloads, while SageMaker would handle custom ML lifecycle requirements.”

**Memory:**
**Bedrock = Foundation Models | SageMaker = Custom ML Lifecycle**
