# How would you prevent production deployment of an untested AI model?

## Short answer
Prevent untested models from reaching production with technical gates.

## Key points
- The evaluation stage must pass for the exact model, prompt and configuration version.
- Approved-model allow-list in AppConfig, validated by the pipeline.
- IAM on the task role limits bedrock:InvokeModel to approved ARNs; SCPs restrict model access by account.
- Manual approval, IaC-only changes, canary with automatic rollback, and an audit trail.

## CWD context
Make the safe path the only path.
