## How would you select SageMaker instance types?

I select the instance based on **model size, workload, GPU/CPU requirement, memory, latency, and cost**.

```text
Model + Workload
      ↓
CPU or GPU?
      ↓
Memory / Compute requirement
      ↓
Training vs Inference
      ↓
Performance + Cost Testing
      ↓
Choose Instance
```

### Simple decision

| Requirement                     | Typical choice                   |
| ------------------------------- | -------------------------------- |
| Small traditional ML            | CPU instance                     |
| Large ML training               | GPU instance                     |
| Deep learning                   | GPU instance                     |
| Large model / high memory       | GPU with higher memory           |
| Lightweight real-time inference | Smaller CPU/GPU                  |
| High-throughput inference       | Multiple instances + autoscaling |

### CWD example

For a **custom intent classifier**, I would start with a CPU instance if the model is lightweight.

For a **large deep-learning model**, I would benchmark GPU instances and select based on training time, memory utilization, throughput, and cost.

### Interview answer

> “I would select SageMaker instances based on the model and workload. First I determine whether CPU or GPU is required, then evaluate memory and compute requirements. I benchmark candidate instances for training time or inference latency and throughput, and choose the smallest instance that meets the performance requirements at an acceptable cost.”

**Memory:**
**Model → CPU/GPU → Memory → Performance → Cost**
