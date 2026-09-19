# SageMaker for Machine Learning

## Overview
Amazon SageMaker is AWS's comprehensive platform for building, training, and deploying machine learning models, spanning traditional ML, deep learning, and custom/open-source foundation model hosting. This document summarizes SageMaker's core capabilities as they relate to the broader ML and GenAI practices described throughout this knowledge base.

## Core SageMaker Components

### SageMaker Studio
An integrated development environment for the full ML lifecycle — data exploration, experimentation, training job management, and model deployment — providing a unified workspace for data scientists and ML engineers.

### SageMaker Data Wrangler
Visual and code-based data preparation and feature engineering tooling, simplifying the data preprocessing stage of the pipeline described in end-to-end-ml-pipeline.md.

### SageMaker Training
Managed training infrastructure supporting a wide range of frameworks (PyTorch, TensorFlow, scikit-learn, and others), with support for distributed training across multiple instances/GPUs for larger-scale training jobs (see model-training.md).

### SageMaker Experiments
Tracking and comparing multiple training runs, hyperparameter configurations, and resulting model performance — essential for systematic hyperparameter search and reproducible experimentation.

### SageMaker Model Registry
Version-controlled storage of trained models, supporting model lineage tracking, approval workflows, and integration with deployment pipelines.

### SageMaker Endpoints
Managed model hosting supporting real-time, batch, asynchronous, and serverless inference patterns (see model-deployment.md).

### SageMaker Model Monitor
Ongoing monitoring of deployed models for data quality, drift, and bias (see ml-model-monitoring.md, data-drift.md, model-drift.md).

### SageMaker Pipelines
Orchestration of the full ML workflow — from data preparation through training, evaluation, and deployment — as a reproducible, automated pipeline supporting CI/CD-style MLOps practices.

### SageMaker JumpStart
Access to a broad library of pre-trained models (including many open-source foundation models) that can be deployed directly or fine-tuned on SageMaker infrastructure, relevant when a needed model isn't available through Bedrock's managed offerings (see bedrock-vs-sagemaker.md).

## When SageMaker Is the Right Tool
- Training custom models (traditional ML or specialized deep learning models) on proprietary data
- Hosting open-source or custom foundation models not available via Bedrock, with full infrastructure control
- Extensive fine-tuning or continued pre-training workflows beyond what Bedrock's managed customization supports
- Organizations needing tight integration between traditional ML workflows (tabular models, forecasting) and generative AI components

## SageMaker and Bedrock Together
Many enterprise architectures use both platforms in complementary roles — Bedrock for foundation-model-based generative AI application logic, and SageMaker for custom model training (e.g., a specialized embedding model trained on proprietary data, feeding into a Bedrock-based RAG application's vector store) or traditional ML components integrated into the broader system (see bedrock-vs-sagemaker.md for a detailed comparison of when each fits best).

## Operational Considerations
SageMaker provides substantially more infrastructure control than Bedrock but correspondingly more operational responsibility — instance selection, scaling configuration, and cost management for training and hosting infrastructure are all direct SageMaker user responsibilities, in contrast to Bedrock's fully managed, pay-per-token model.

## Summary
SageMaker provides a comprehensive, integrated platform spanning the full traditional ML lifecycle — data preparation, training, experimentation, model registry, deployment, and monitoring — serving as the appropriate tool for custom model training and specialized hosting needs that complement, rather than replace, Bedrock-based generative AI application development.
