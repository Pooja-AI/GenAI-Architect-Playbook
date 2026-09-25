## What data would come from S3?

For SageMaker training in CWD, **S3 would store the training datasets and model artifacts**.

```text id="g3tq0k"
Enterprise Sources
      ↓
     Glue
      ↓
      S3
   ┌──────────────┐
   │ Training Data│
   │ Validation   │
   │ Test Data    │
   └──────────────┘
        ↓
    SageMaker
```

### CWD example — Intent Classifier

S3 could contain:

```text
s3://cwd-ml-data/
 ├── train/
 │    └── intent_train.parquet
 ├── validation/
 │    └── intent_validation.parquet
 └── test/
      └── intent_test.parquet
```

The data could contain:

| Input                            | Label             |
| -------------------------------- | ----------------- |
| "Show customer incidents"        | IT_SUPPORT        |
| "Give me customer sales history" | SALES             |
| "Create customer briefing"       | CUSTOMER_BRIEFING |

### Where does this data originate?

```text
Salesforce / ServiceNow / S3 / Oracle
             ↓
            Glue
             ↓
      Clean + Transform
             ↓
             S3
             ↓
         SageMaker
```

### Interview answer

> “S3 would contain the prepared training, validation, and test datasets. In CWD, Glue could extract and transform historical enterprise data from sources like Salesforce or ServiceNow and store the curated datasets in S3. SageMaker would then read those datasets for model training.”
