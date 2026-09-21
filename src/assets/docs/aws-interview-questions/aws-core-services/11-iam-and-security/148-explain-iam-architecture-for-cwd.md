# Explain IAM architecture for CWD.

## Short answer
IAM architecture is multi-account, role-based and least-privilege, with guardrails at the organisation level.

## Key points
- AWS Organizations with separate dev, test, prod, security and log-archive accounts; SCPs as guardrails.
- Humans through IAM Identity Center federated to the corporate IdP; workloads through IAM roles.
- Separate roles per component: Lambda execution, ECS task and execution, Glue, SageMaker.
- Resource policies, permission boundaries, tags for ABAC, Access Analyzer, CloudTrail.

## CWD context
End-user login to CWD (Cognito or OIDC) is separate from IAM.
