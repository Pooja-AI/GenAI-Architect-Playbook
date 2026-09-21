# How would you secure ECS tasks?

## Short answer
Secure ECS tasks with separate roles, hardened images and restricted access.

## Key points
- Task role (application permissions) separate from execution role (pull image, read secrets, write logs).
- Secrets injected from Secrets Manager; read-only root filesystem, non-root user.
- Image scanning (ECR, Inspector), immutable tags, GuardDuty runtime monitoring.
- Restrict and audit ECS Exec.

## CWD context
Least privilege applies per Worker type.
