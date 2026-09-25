## S3 → Glue → SageMaker Training

This is a **data preparation → model training** pipeline.

```text
Raw Data
   ↓
  S3
   ↓
  Glue
   ├── Clean
   ├── Transform
   ├── Deduplicate
   ├── Feature Engineering
   └── Data Validation
   ↓
Curated Data
   ↓
  S3
   ↓
SageMaker Training Job
   ↓
Trained Model
   ↓
Model Artifact → S3
```

### Step-by-step

**1. S3 – Raw data**

* Stores historical Salesforce, ServiceNow, application, or other enterprise data.
* Example: customer requests and their intent labels.

**2. Glue – Data preparation**

* Reads data from S3.
* Cleans missing/invalid data.
* Removes duplicates.
* Transforms fields.
* Creates features/labels.
* Validates data quality.
* Writes curated training data back to S3.

**3. SageMaker – Training**

* Reads curated data from S3.
* Runs the training job on selected compute.
* Evaluates the model.
* Produces a model artifact and stores it in S3.

### CWD example

```text
Historical CWD Requests
        ↓
       S3
        ↓
      Glue
        ↓
request_text + intent_label
        ↓
       S3
        ↓
SageMaker Training
        ↓
Intent Classifier
```

### Interview answer

> “S3 stores the raw enterprise data. Glue performs the data engineering—cleaning, transformation, deduplication, feature and label preparation, and validation—and writes the curated dataset back to S3. SageMaker then reads that curated data and runs the training job, producing a versioned model artifact in S3.”

**Memory:**
**S3 = Store → Glue = Prepare → SageMaker = Train**
