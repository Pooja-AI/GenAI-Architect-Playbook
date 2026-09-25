## How would you train a model using SageMaker?

Simple flow:

```text
Enterprise Data
      ↓
     Glue
      ↓
      S3
      ↓
SageMaker Training Job
      ↓
Model Artifact
      ↓
      S3
      ↓
Model Registry
      ↓
SageMaker Endpoint
```

### Practical steps

1. **Prepare data** using Glue and store it in S3.
2. **Split data** into training/validation/test datasets.
3. Create a **SageMaker training job** with the algorithm/framework and compute instance.
4. SageMaker reads training data from **S3**.
5. **Train the model** and tune hyperparameters if required.
6. Evaluate against the validation/test dataset.
7. Store the **model artifact in S3**.
8. Register the approved model in **SageMaker Model Registry**.
9. Deploy it to a SageMaker endpoint for inference.

### CWD example

For an **intent classifier**:

```text
Historical CWD Requests
        ↓
       Glue
        ↓
        S3
        ↓
SageMaker Training
        ↓
Intent Classifier
        ↓
Evaluation
        ↓
Model Registry
        ↓
Endpoint
        ↓
CWD ML Worker
```

### Interview answer

> “I would prepare and clean the training data using Glue and store it in S3. Then I would run a SageMaker training job, evaluate the model against validation and test data, register the approved model, and deploy it to a SageMaker endpoint. The CWD ML Worker would invoke that endpoint for real-time predictions.”

**Memory:**
**Prepare → S3 → Train → Evaluate → Register → Deploy**
