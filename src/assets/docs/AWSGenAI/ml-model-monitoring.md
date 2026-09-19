# ML Model Monitoring

## Overview
ML model monitoring is the ongoing practice of tracking a deployed machine learning model's operational health, prediction quality, and input/output characteristics in production — providing the visibility needed to detect drift (see model-drift.md and data-drift.md), operational issues, and performance degradation before they cause significant business impact.

## Monitoring Dimensions

### Operational Health
Standard infrastructure metrics for the serving endpoint — request volume, latency, error rate, resource utilization (CPU/GPU, memory) — tracked with the same rigor as any production service.

### Data Quality
Monitoring incoming feature data for quality issues — missing values, out-of-range values, unexpected data types or categories — that could indicate an upstream data pipeline issue affecting model input quality independent of genuine data drift.

### Data and Prediction Drift
Tracking the statistical distribution of input features and model predictions over time relative to training-time baselines, as detailed in data-drift.md and model-drift.md.

### Performance/Accuracy (When Ground Truth Is Available)
For scenarios where actual outcomes eventually become known (even with delay), tracking real accuracy/performance metrics against the original validation baseline provides the most direct signal of whether the model is still performing as expected in production.

### Fairness and Bias Monitoring
For models influencing decisions about individuals, ongoing monitoring for disparate performance or outcome patterns across protected characteristic groups — particularly important for models used in regulated or high-stakes decision contexts (see ai-compliance.md).

## Implementation on AWS
- **SageMaker Model Monitor**: provides built-in capabilities for data quality, model quality, bias drift, and feature attribution drift monitoring for SageMaker-hosted endpoints, with configurable baselines and scheduled monitoring jobs
- **CloudWatch**: standard operational metrics and custom metric emission for model-specific quality signals
- **SageMaker Clarify**: bias detection and explainability tooling that can be integrated into ongoing monitoring workflows

## Establishing Baselines
Model monitoring requires establishing a clear baseline (typically derived from the training/validation dataset's statistical properties) against which production data and predictions are compared — without a well-defined baseline, drift detection lacks a meaningful reference point for determining what constitutes a significant deviation.

## Alerting and Response
Define alerting thresholds for each monitoring dimension, with a clear escalation and response process — a data quality alert might trigger investigation of an upstream pipeline issue, while a sustained performance degradation alert might trigger a retraining workflow (see end-to-end-ml-pipeline.md and model-training.md).

## Monitoring Cadence
Balance monitoring frequency against the practical rate of change in the underlying data/relationships and the cost of monitoring infrastructure — some models warrant near-real-time monitoring given rapid-changing environments (e.g., fraud detection), while others may only need periodic (e.g., weekly) batch monitoring given more slowly evolving underlying patterns.

## Connecting ML Monitoring to Business Outcomes
Where possible, correlate model monitoring signals with downstream business metrics (e.g., does a detected drift event correspond with an observed increase in customer complaints or a decrease in a relevant business KPI?) — this connection strengthens the case for monitoring investment and helps prioritize which drift signals warrant urgent remediation versus lower-priority investigation.

## Summary
ML model monitoring spans operational health, data quality, drift detection, performance tracking (where ground truth is available), and fairness — implemented on AWS primarily through SageMaker Model Monitor and CloudWatch, requiring well-established baselines and a clear alerting/response process connecting detected issues to appropriate remediation actions like retraining.
