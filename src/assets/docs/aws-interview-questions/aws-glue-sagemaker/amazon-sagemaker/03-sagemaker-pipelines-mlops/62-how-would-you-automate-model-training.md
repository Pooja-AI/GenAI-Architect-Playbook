# How would you automate model training?

## Short answer
Automate training with events and schedules that start the pipeline.

## Key points
- EventBridge rules for new data, schedules or drift alarms.
- Step Functions or CodePipeline for orchestration; notifications and retries.
- Parameterise the dataset version.

## CWD context
Automated training still goes through the approval gate.
