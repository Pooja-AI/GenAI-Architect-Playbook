## How would you manage training datasets?

I would manage datasets using **S3 + Glue + versioning + data validation**.

```text id="p1x7la"
Enterprise Data
      ↓
     Glue
      ↓
Clean / Validate / Transform
      ↓
      S3
 ┌────┼─────────┐
 ↓    ↓         ↓
v1   v2        v3
      ↓
SageMaker Training
```

### Key practices

1. **S3** – central storage for training, validation, and test data.
2. **Version datasets** – keep track of which dataset trained each model.
3. **Glue** – clean, transform, deduplicate, and prepare data.
4. **Data quality checks** – missing values, duplicates, schema, invalid labels.
5. **Partition data** – organize large datasets by date/source/domain.
6. **Encryption & IAM** – restrict access and encrypt sensitive enterprise data.
7. **Lineage** – record `dataset_version → model_version → deployment`.
8. **Retention/lifecycle** – archive or delete obsolete datasets according to policy.

### CWD example

```text
dataset-v3
    ↓
SageMaker Model v7
    ↓
Production Endpoint
```

If Model v7 performs poorly, I can identify **exactly which dataset version trained it** and reproduce or roll back the model.

### Interview answer

> “I would store training datasets in S3, use Glue for preparation and quality validation, and maintain dataset versions and lineage. I would track the relationship between dataset version, model version, and deployment. I would also use IAM and KMS to protect sensitive enterprise training data.”

**Memory:**
**Store → Validate → Version → Secure → Track Lineage**
