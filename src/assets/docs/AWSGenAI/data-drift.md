# Data Drift

## Overview
Data drift refers to a shift in the statistical distribution of a machine learning model's input data over time, compared to the distribution the model was originally trained on — a primary driver of model performance degradation in production, and a distinct but related concept to the broader model drift discussed in model-drift.md.

## Why Data Drift Happens
- **Changing user behavior or demographics**: the population generating input data evolves over time (new customer segments, changing usage patterns)
- **Upstream system or process changes**: changes in how data is collected, measured, or recorded (a new sensor, a changed survey question, a modified data pipeline transformation) can shift the input distribution without any genuine change in the underlying real-world phenomenon
- **External/seasonal factors**: cyclical or event-driven shifts (holiday shopping patterns, economic conditions) that cause input data characteristics to vary over time even for a stable underlying process
- **Feedback loops**: a deployed model's own decisions can influence future input data (e.g., a recommendation model shaping what content gets engagement, which then becomes training data for future model versions) — an important, often underappreciated drift source

## Detecting Data Drift

### Statistical Distance Metrics
Compare the distribution of incoming production feature data against the training distribution using statistical distance measures (e.g., population stability index, KL divergence, Kolmogorov-Smirnov test for individual features) — flagging features with significant divergence for investigation.

### Feature-Level Monitoring
Track summary statistics (mean, variance, min/max, missing-value rate, category frequency for categorical features) for each input feature over time, comparing against training-time baselines to identify which specific features are drifting, which helps prioritize investigation and potential retraining focus.

### Embedding-Based Drift Detection
For unstructured data (text, images) feeding into embedding-based models, monitor the distribution of embedding vectors themselves over time as a higher-level drift signal, complementing feature-level statistics for structured data.

## Data Drift vs. Model Drift
Data drift specifically concerns the input distribution; model drift (see model-drift.md) more broadly concerns changes in the model's predictive performance or the underlying input-output relationship, which can occur due to data drift, concept drift (the relationship itself changing even with stable input distribution), or both simultaneously — distinguishing between these helps target the right remediation (retraining with fresh data vs. reconsidering the modeling approach).

## Responding to Detected Data Drift
- **Retraining with recent data**: if the underlying input-output relationship remains stable but the input distribution has shifted (e.g., a genuine demographic shift in the customer base), retraining on more recent, representative data typically restores performance
- **Feature engineering revision**: if drift traces to a specific upstream data collection/pipeline change rather than a genuine real-world shift, correcting the pipeline (or adapting feature engineering to be robust to the change) may be more appropriate than retraining
- **Investigating feedback loop effects**: if drift appears linked to the model's own influence on subsequent input data, consider whether the training/retraining process needs adjustment to account for this feedback dynamic rather than naively retraining on data the model itself has shaped

## Monitoring Infrastructure
SageMaker Model Monitor provides built-in capabilities for tracking data quality and drift metrics for deployed SageMaker endpoints, integrating with the broader ML monitoring practices described in ml-model-monitoring.md.

## Summary
Data drift — the shift in input data distribution over time relative to training data — is a primary driver of model performance degradation, detected through statistical distance metrics and feature-level monitoring, and addressed through retraining, feature engineering revision, or investigation of feedback loop effects depending on the specific root cause identified.
