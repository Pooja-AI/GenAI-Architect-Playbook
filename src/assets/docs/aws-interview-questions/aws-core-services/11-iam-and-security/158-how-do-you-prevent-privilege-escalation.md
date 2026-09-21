# How do you prevent privilege escalation?

## Short answer
Prevent privilege escalation by restricting who can create or change permissions.

## Key points
- Restrict iam:PassRole to specific roles and services; deny policy-editing actions to non-admins.
- Permission boundaries required for role creation; SCP guardrails.
- Review trust policies; admin roles with MFA.

## CWD context
A workload that can edit its own permissions can grant itself anything.
