# How would you implement health checks?

## Short answer
Use liveness, readiness and startup probes with different purposes.

## Key points
- Liveness: is the process stuck? Restart if not.
- Readiness: can it accept traffic right now?
- Startup: allow slow initialisation before other probes begin.
- Keep dependency checks shallow to avoid cascading failures.

## CWD context
Expose /healthz and /ready endpoints in every service.
