## How would Glue prepare training data for SageMaker?

Glue would handle the **data engineering**, while SageMaker handles the **model training**.

```text
Salesforce / ServiceNow / S3
            ↓
           Glue
            ↓
   Clean + Transform
   Deduplicate
   Join data
   Create features
   Validate quality
            ↓
      S3 — Parquet
            ↓
        SageMaker
            ↓
      Train Model
```

### Glue steps

1. **Extract** historical enterprise data.
2. **Clean** missing/invalid records.
3. **Deduplicate** records.
4. **Transform** fields into model-ready format.
5. **Create features/labels** where required.
6. **Validate data quality**.
7. **Split** into train/validation/test datasets.
8. Store curated data in **S3 as Parquet**.

### CWD example

For an intent classifier:

```text
Historical User Requests
        ↓
       Glue
        ↓
Clean + Deduplicate
        ↓
Create:
request_text + intent_label
        ↓
Train / Validation / Test
        ↓
       S3
        ↓
    SageMaker
```

### Interview answer

> “I would use Glue to extract historical enterprise data, clean and deduplicate it, transform it into model-ready features and labels, validate data quality, and split it into training, validation, and test datasets. I would store the curated datasets in S3, typically as Parquet, and SageMaker would consume them for training.”

**Memory:**
**Extract → Clean → Deduplicate → Transform → Validate → Split → S3 → SageMaker**
