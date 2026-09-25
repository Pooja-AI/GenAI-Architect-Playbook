## How would you reproduce a previous training run?

The key is to **version everything needed for training**.

```text
Previous Run
   ↓
Dataset Version
+ Code Version
+ Model Version
+ Hyperparameters
+ Environment
   ↓
Re-run Training
   ↓
Compare Metrics
```

### What I would preserve

* **Dataset version** → exact S3 dataset
* **Code version** → Git commit
* **Hyperparameters** → learning rate, batch size, epochs
* **Model/algorithm version**
* **Container/dependencies** → exact image/version
* **Training configuration** → instance type, distributed settings
* **Experiment metadata** → MLflow/SageMaker Experiments

### CWD example

```text
Experiment-102
 ├── Dataset: v3
 ├── Code: Git abc123
 ├── Parameters: lr=0.001, epochs=10
 ├── Container: v5
 └── Model: v7
        ↓
   Re-run exactly
```

### Interview answer

> “To reproduce a previous training run, I would retrieve the exact dataset version, Git commit, hyperparameters, container or dependency version, and training configuration recorded in SageMaker Experiments or MLflow. I would run the same configuration and compare the resulting metrics with the original experiment.”

**Memory:**
**Data + Code + Parameters + Environment = Reproducible Run**
