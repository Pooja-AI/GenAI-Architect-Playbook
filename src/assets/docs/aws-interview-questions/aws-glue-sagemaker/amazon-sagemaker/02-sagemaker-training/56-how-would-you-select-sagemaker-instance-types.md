# How would you select SageMaker instance types?

## Short answer
Choose instance types from the workload, and benchmark before committing.

## Key points
- CPU families for tabular and classic ML; GPU families for deep learning; memory-optimised for large feature sets.
- Spot training with checkpointing to cut cost; profile utilisation.
- Start small and scale.

## CWD context
Idle GPUs are the expensive mistake.
