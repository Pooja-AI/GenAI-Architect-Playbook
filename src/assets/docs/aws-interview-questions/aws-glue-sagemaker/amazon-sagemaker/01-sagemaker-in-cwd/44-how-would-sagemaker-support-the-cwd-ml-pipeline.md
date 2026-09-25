## How would SageMaker support the CWD ML pipeline?

SageMaker would manage the **custom ML lifecycle** from training to deployment and monitoring.

```text
Enterprise Data
      ↓
     Glue
      ↓
      S3
      ↓
 SageMaker
 ├── Prepare / Feature Engineering
 ├── Train
 ├── Evaluate
 ├── Model Registry
 └── Deploy Endpoint
      ↓
 CWD Coordinator / Worker
      ↓
 Prediction
```

### CWD example

For a **custom intent classifier**:

1. **Glue** prepares historical user requests.
2. Data is stored in **S3**.
3. **SageMaker** trains the classifier.
4. Evaluate accuracy/F1 and validate against a test dataset.
5. Register the approved model.
6. Deploy it to a SageMaker endpoint.
7. CWD Coordinator calls the endpoint for intent classification.
8. Monitor model performance and data drift.

### Interview answer

> “SageMaker would support the CWD custom ML pipeline by taking prepared data from S3, training and evaluating the model, registering the approved version, deploying it for inference, and monitoring it in production. For example, a custom intent classifier could run on a SageMaker endpoint and provide the intent to the CWD Coordinator.”
