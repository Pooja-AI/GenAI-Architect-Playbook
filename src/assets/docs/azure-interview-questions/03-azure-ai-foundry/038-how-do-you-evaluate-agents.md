# How do you evaluate agents?

## Short answer
Evaluate agents on outcomes and on the path taken, not just the final text.

## Key points
- Intent resolution, tool-call accuracy and task adherence evaluators.
- Trajectory checks against expected tool sequences on golden tasks.
- End-to-end task success plus safety checks.
- Sampled online evaluation of production traffic.

## CWD context
A correct answer reached through a wrong or unsafe tool call is still a failure.
