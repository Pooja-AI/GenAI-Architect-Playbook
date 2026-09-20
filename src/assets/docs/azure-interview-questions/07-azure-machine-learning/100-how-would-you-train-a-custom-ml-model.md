# How would you train a custom ML model?

## Short answer
Train a custom model as a reproducible job with tracked experiments and a registered result.

## Key points
- Prepare data in ADLS or Databricks and register a data asset.
- Run the training script on an autoscaling compute cluster; AutoML is an option.
- Track metrics with MLflow; evaluate; register the model.
- Pin environments and code versions.

## CWD context
Reproducibility matters: same data version and code must give the same model.
