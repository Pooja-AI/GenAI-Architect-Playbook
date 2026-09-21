# How would you implement model approval?

## Short answer
Model approval is a status on the model package, set by people or automated checks.

## Key points
- PendingManualApproval → Approved or Rejected.
- An EventBridge event on approval triggers deployment.
- IAM controls who can approve; CloudTrail records it.

## CWD context
Approval and deployment are separate steps by design.
