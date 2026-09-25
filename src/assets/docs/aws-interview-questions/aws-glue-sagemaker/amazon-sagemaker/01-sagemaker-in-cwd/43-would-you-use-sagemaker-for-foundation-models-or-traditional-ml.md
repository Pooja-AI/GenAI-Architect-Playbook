## Would you use SageMaker for foundation models or traditional ML?

**Both**, but the use cases differ.

* **Traditional ML:** classification, regression, forecasting, anomaly detection, recommendation.
* **Foundation models:** SageMaker can also train, fine-tune, deploy, and customize foundation models when you need more control over the model lifecycle.

For **CWD**, I would typically use:

```text
Traditional / Custom ML → SageMaker
Foundation-model GenAI → Bedrock
```

### Interview answer

> “SageMaker supports both traditional ML and foundation-model workflows. In CWD, I would primarily use SageMaker for custom or specialized ML models where I need training and lifecycle control, while using Bedrock for managed foundation-model capabilities such as LLM generation and embeddings.”
