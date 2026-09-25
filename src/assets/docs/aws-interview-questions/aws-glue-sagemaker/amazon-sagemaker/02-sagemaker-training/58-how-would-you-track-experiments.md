## How would you track experiments?

For SageMaker, I would use **SageMaker Experiments / MLflow** to track each training run.

```text id="q4q4m8"
Dataset Version
      ↓
Training Run
      ↓
 ┌─────────────────────┐
 │ Parameters          │
 │ Model Version       │
 │ Metrics             │
 │ Code Version        │
 │ Dataset Version     │
 └─────────────────────┘
      ↓
 Compare Experiments
      ↓
 Select Best Model
```

### What I track

* **Dataset version**
* **Model/algorithm version**
* **Hyperparameters** — learning rate, batch size, epochs
* **Evaluation metrics** — accuracy, precision, recall, F1
* **Training duration**
* **Code/Git version**
* **Model artifact location**
* **Experiment/run ID**

### CWD example

```text id="44x5o6"
Experiment-102
   ↓
Dataset v3
Model v7
F1 = 0.94
Learning Rate = 0.001
   ↓
Compare with Experiment-103
   ↓
Select approved model
```

### Interview answer

> “I would use SageMaker Experiments or MLflow to track every training run, including dataset version, code version, hyperparameters, model version, and evaluation metrics. This allows us to reproduce experiments, compare models, and identify exactly which dataset and configuration produced the production model.”

**Memory:**
**Data → Code → Parameters → Metrics → Model → Compare → Reproduce**
