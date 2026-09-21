# How would you reproduce a previous training run?

## Short answer
Reproduce a run by pinning everything that influenced it.

## Key points
- Code commit and container image digest; dataset version; hyperparameters and seeds; library versions.
- Rerun from the recorded configuration through the pipeline.
- Verify metrics within a tolerance and check lineage records.

## CWD context
Reproducibility is required for audits.
