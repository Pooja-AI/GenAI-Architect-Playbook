# Model Training

## Overview
Model training is the process of fitting a machine learning model's parameters to a dataset so it learns to perform a target task — whether training a traditional ML model from scratch, fine-tuning a foundation model on domain-specific data, or continued pre-training to adapt a model's broader knowledge base.

## Training Approaches

### Training from Scratch
Building and training a model with randomly initialized parameters entirely on your own dataset — appropriate for traditional ML tasks (tabular classification/regression) or highly specialized use cases where no suitable pre-trained model exists, but requires substantial labeled data and compute investment.

### Fine-Tuning
Starting from a pre-trained foundation model and further training it on a smaller, task-specific or domain-specific dataset to adapt its behavior — far more data- and compute-efficient than training from scratch, and the primary customization approach for adapting foundation models (available for select models on Bedrock) to specific styles, formats, or domain vocabularies.

### Continued Pre-Training
Further training a foundation model on a large corpus of domain-specific text (without necessarily task-specific labels) to deepen its knowledge of a specific domain's vocabulary and concepts, typically as a precursor to subsequent fine-tuning for specific tasks.

## Key Training Considerations

### Data Quality and Quantity
Training data quality is typically more impactful than raw quantity — a smaller, carefully curated, accurately labeled dataset often produces better results than a much larger but noisy or inconsistently labeled one, particularly for fine-tuning where the training signal needs to clearly and consistently demonstrate the desired behavior.

### Hyperparameter Selection
Learning rate, batch size, number of training epochs, and (for fine-tuning) how much of the model to update all significantly affect training outcomes — systematic hyperparameter search (grid search, random search, or more sophisticated Bayesian optimization) generally outperforms manual guess-and-check tuning.

### Overfitting Prevention
Techniques like regularization, early stopping (halting training when validation performance stops improving), and appropriately sized held-out validation sets help ensure a trained model generalizes to new data rather than merely memorizing training examples.

### Compute Infrastructure
Training, especially for larger models or datasets, typically requires GPU-accelerated compute — SageMaker Training provides managed, scalable training infrastructure supporting distributed training across multiple GPU instances for larger-scale training jobs.

## Fine-Tuning on Bedrock
For supported models, Bedrock provides managed fine-tuning capability — upload a training dataset, configure training parameters, and Bedrock handles the underlying training infrastructure, producing a custom model version accessible via the same Converse API used for base models, simplifying the operational overhead compared to self-managed training infrastructure via SageMaker.

## When Fine-Tuning Is Worth It vs. Prompt Engineering/RAG
Fine-tuning is generally justified when:
- A consistent, specific output format or style is needed that prompting alone struggles to reliably achieve
- The task requires absorbing a large volume of examples/patterns that would be impractical to include as few-shot examples in every prompt
- Domain-specific vocabulary or reasoning patterns aren't well captured by the base model even with strong prompting and RAG

For most knowledge-injection needs (as opposed to behavior/style adaptation), RAG (see what-is-rag.md) is typically more appropriate, cost-effective, and easier to keep current than fine-tuning, since RAG doesn't require retraining to reflect new information.

## Summary
Model training spans training from scratch, fine-tuning pre-trained foundation models, and continued pre-training — with data quality, careful hyperparameter selection, and overfitting prevention as universal considerations, and a clear-eyed assessment of whether fine-tuning (behavior/style adaptation) or RAG (knowledge injection) is the appropriate tool for a given customization need.
