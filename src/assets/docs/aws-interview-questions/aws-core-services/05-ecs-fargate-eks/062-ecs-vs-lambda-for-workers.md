# ECS vs Lambda for Workers?

## Short answer
Use ECS for Workers that are long, variable, dependency-heavy or steady; use Lambda for short, simple, spiky tasks.

## Key points
- ECS: no 15-minute limit, persistent connections, larger images.
- Lambda: fast to build, scale to zero, but limited duration and concurrency control.
- Scale ECS Workers on queue backlog per task.

## CWD context
Decide per Worker type, not for all Workers.
