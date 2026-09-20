# How would you implement continuous training?

## Short answer
Continuous training retrains and redeploys automatically but safely.

## Key points
- Triggers: schedule, new data, drift alert or performance drop.
- Azure ML pipeline trains, then evaluates against the current champion model.
- Register and promote only if better and approved.
- Orchestrated with Azure DevOps and Event Grid.

## CWD context
Automation must never bypass the approval gate for production.
