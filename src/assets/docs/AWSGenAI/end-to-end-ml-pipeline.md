# End-to-End ML Pipeline

## Overview
While much of this knowledge base focuses on generative AI built on foundation models, many enterprise AI architectures also incorporate traditional machine learning models — classifiers, regressors, recommendation systems — either standalone or in combination with generative AI components (e.g., a classifier routing requests before they reach an LLM, or a fraud-detection model informing an agentic workflow). This document outlines the end-to-end ML pipeline for these traditional ML components.

## Pipeline Stages

### Data Collection and Labeling
Gathering training data and, for supervised learning, obtaining accurate labels — often the most time-consuming and quality-critical stage, since model performance is fundamentally bounded by training data quality.

### Feature Engineering
Transforming raw data into the input representations a model will learn from — for traditional tabular ML, this includes normalization, encoding categorical variables, and constructing derived features capturing relevant signal.

### Model Training
Fitting a model to the training data, typically involving hyperparameter tuning and cross-validation to select a well-generalizing configuration rather than one that overfits the training set.

### Model Evaluation
Assessing model performance on held-out test data using metrics appropriate to the task (accuracy, precision/recall, AUC for classification; RMSE/MAE for regression) — see ml-model-monitoring.md for the ongoing evaluation practices needed once a model is in production.

### Model Deployment
Packaging and deploying the trained model for inference, typically via SageMaker endpoints for traditional ML models (see model-deployment.md).

### Monitoring and Retraining
Tracking production model performance over time, detecting drift (see model-drift.md and data-drift.md), and triggering retraining when performance degrades or the underlying data distribution shifts meaningfully from the training distribution.

## AWS Implementation
Amazon SageMaker provides an integrated platform for the full ML pipeline — SageMaker Data Wrangler for feature engineering, SageMaker Training for model training with managed compute, SageMaker Experiments for tracking training runs and hyperparameter search, SageMaker Model Registry for versioning trained models, and SageMaker Pipelines for orchestrating the full pipeline as a reproducible, automated workflow (see sagemaker-ml.md for a deeper treatment).

## Traditional ML vs. Generative AI Pipeline Differences
Unlike generative AI applications built on pre-trained foundation models (where the primary "pipeline" work is prompt engineering, retrieval configuration, and evaluation rather than training a model from scratch), traditional ML pipelines center on the model training lifecycle itself — data labeling, feature engineering, and training being central concerns that don't have a direct analog in most Bedrock-based generative AI application development.

## Where Traditional ML and GenAI Intersect
- A traditional ML classifier can pre-screen or route requests before they reach a more expensive LLM call (see conditional-agent-routing.md's complexity-assessment routing pattern)
- A traditional ML model might power a specific sub-capability within an agentic system (e.g., a fraud-risk score informing an agent's decision-making)
- Embedding models themselves (see embedding-models.md) are trained via ML techniques, and organizations with specialized domains may train custom embedding models using the same ML pipeline practices described here

## CI/CD for ML Pipelines (MLOps)
Apply CI/CD discipline (automated retraining triggers, evaluation gates before deployment, staged rollout) to the traditional ML pipeline analogous to the GenAI CI/CD practices described in genai-ci-cd.md, recognizing that traditional ML models require their own distinct MLOps practices even within an organization that's also building generative AI applications.

## Summary
The end-to-end ML pipeline — data collection/labeling, feature engineering, training, evaluation, deployment, and ongoing monitoring/retraining — remains a distinct and often complementary discipline to generative AI application development, implemented on AWS primarily via SageMaker's integrated tooling, and frequently intersecting with GenAI systems through routing, scoring, and specialized sub-capability use cases.
