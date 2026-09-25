## What models would you deploy using SageMaker?

In CWD, I would deploy **specialized custom ML models** where a foundation model from Bedrock is not the best fit.

### Examples

```text
SageMaker
   ├── Intent Classification
   ├── Custom Ranking
   ├── Anomaly Detection
   ├── Forecasting
   ├── Recommendation
   └── Custom/Fine-tuned NLP Models
```

### CWD examples

* **Intent classifier** → Customer Briefing vs IT Support vs other intents
* **Custom ranking model** → rank retrieved enterprise documents
* **Anomaly detection** → detect unusual manufacturing/operational patterns
* **Forecasting model** → predict business/operational metrics
* **Custom NLP model** → specialized enterprise classification/extraction

### Interview answer

> “In CWD, I would use SageMaker for specialized models such as a custom intent classifier, ranking model, anomaly detection model, or forecasting model. These models would be trained on enterprise-specific data and exposed through SageMaker endpoints for real-time inference. Bedrock would remain the primary service for foundation-model-based GenAI tasks.”

**Memory:**
**SageMaker → Specialized Custom ML | Bedrock → Foundation-model GenAI**
