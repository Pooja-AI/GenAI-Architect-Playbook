# How would you perform continuous training?

## Short answer
Continuous training retrains and redeploys automatically, safely.

## Key points
- Triggers: drift alarms, new labelled data, schedule.
- Pipeline retrains, evaluates against the current model and registers only if better.
- Approval, then canary deployment; guard against feedback loops and bad data; control cost.

## CWD context
Automation must not bypass the approval gate for production.
