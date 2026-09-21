# How would you perform distributed training?

## Short answer
Distribute training across instances when data or models are too large for one.

## Key points
- Data parallelism (SageMaker distributed data parallel, PyTorch DDP, Horovod).
- Model or sharded parallelism (FSDP, DeepSpeed) for large models; HyperPod for very large training.
- Managed spot with checkpoints; tune batch size and network.

## CWD context
Most CWD models are small; scale out only when needed.
