## API Gateway → Worker → SageMaker architecture

For CWD, I would use this when a **Worker needs a custom ML prediction**.

```text
User
  ↓
API Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
ML Worker
  ↓
SageMaker Endpoint
  ↓
Prediction
  ↓
ML Worker
  ↓
Delegator
  ↓
Coordinator
  ↓
Response
```

### Example: Intent Classification

```text
User: "Show me customer 123 incidents"
              ↓
          API Gateway
              ↓
          Coordinator
              ↓
        ML Delegator
              ↓
         ML Worker
              ↓
     SageMaker Classifier
              ↓
       "IT_SUPPORT"
              ↓
        Coordinator
```

### What each component does

* **API Gateway** → authentication, throttling, API boundary
* **Coordinator** → understands request and orchestrates workflow
* **Delegator** → routes to the appropriate Worker
* **ML Worker** → prepares input, calls SageMaker, validates prediction
* **SageMaker** → hosts the custom ML model and returns prediction

### Important

The **Worker should not directly trust the model output**. It should validate the prediction/confidence before using it for routing.

### Interview answer

> “In CWD, API Gateway receives the request and the Coordinator orchestrates it through the appropriate Delegator. The Delegator invokes an ML Worker, which calls the SageMaker endpoint for custom model inference. The Worker validates the prediction and returns it to the orchestration flow. I would use this pattern for custom ML models such as intent classification or ranking, while using Bedrock for foundation-model-based generation.”
