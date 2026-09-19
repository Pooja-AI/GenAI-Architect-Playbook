# Model Drift

## Overview
Model drift refers to the degradation of a deployed machine learning model's performance over time as the real-world relationships it was trained to capture change, even if the underlying input data distribution itself remains stable — distinct from but related to data drift (see data-drift.md), which refers specifically to shifts in the input data distribution.

## Types of Drift

### Concept Drift
The underlying relationship between input features and the target outcome changes over time — e.g., a fraud-detection model trained on historical fraud patterns becomes less effective as fraudsters adapt their tactics, even though the general shape of incoming transaction data hasn't changed.

### Prediction Drift
The distribution of the model's own output predictions shifts over time, which can be a downstream symptom of either concept drift or data drift, and is often one of the more directly observable signals since it doesn't require access to ground-truth labels (which are often delayed or unavailable at prediction time).

### Label Drift
The distribution of actual outcomes (ground truth labels, once available) shifts over time — related to concept drift but specifically about the target variable's distribution rather than the input-output relationship itself.

## Why Drift Matters for GenAI-Adjacent Systems
Even in organizations primarily focused on generative AI, traditional ML models are often used in complementary roles (routing classifiers, risk scoring, content moderation classifiers) — and these components are just as susceptible to drift as any traditional ML deployment, requiring the same ongoing monitoring discipline described here.

## Detecting Drift

### Statistical Distribution Comparison
Compare statistical properties (mean, variance, distribution shape) of recent prediction outputs against a baseline (typically the training/validation distribution), flagging significant divergence for investigation.

### Performance Metric Tracking (When Labels Are Available)
Where ground-truth labels eventually become available (even with delay), track actual model accuracy/performance over time against the original validation performance, directly measuring whether the model's real-world effectiveness is degrading.

### Proxy Metrics When True Labels Are Unavailable
For scenarios where ground truth is delayed or never fully available, use proxy signals — prediction confidence distribution shifts, downstream business metric changes correlated with model decisions — as indirect drift indicators.

## Responding to Detected Drift
- **Retraining**: the most direct response, incorporating more recent data that reflects the current underlying relationships — requires an established, ideally automated retraining pipeline (see end-to-end-ml-pipeline.md) rather than an ad hoc, manual process each time drift is detected
- **Model replacement**: in some cases, drift indicates the original modeling approach itself needs reconsideration, not just retraining with fresher data using the same approach
- **Threshold/decision boundary adjustment**: for some drift patterns, adjusting decision thresholds (rather than full retraining) can be a faster, lower-effort mitigation while a more thorough retraining is planned

## Establishing a Drift Monitoring Cadence
Define a regular monitoring cadence and clear escalation thresholds — rather than only investigating drift reactively after a business-visible model failure, establishing proactive, scheduled review of drift metrics to catch degradation before it produces significant real-world impact.

## Relationship to Data Drift
Model drift and data drift (see data-drift.md) are related but distinct concepts — data drift specifically concerns shifts in the input feature distribution, while model drift more broadly encompasses shifts in the model's predictive relationship or performance, which can occur even without an obvious corresponding shift in input data distribution (pure concept drift).

## Summary
Model drift — concept, prediction, and label drift — represents the natural degradation of deployed ML model performance over time as real-world relationships evolve, requiring systematic monitoring (via distribution comparison and, where available, direct performance tracking) and a defined response process (retraining, replacement, or threshold adjustment) rather than treating a deployed model as a permanently "finished" artifact.
