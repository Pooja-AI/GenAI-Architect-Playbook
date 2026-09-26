### How do you implement Human-on-the-Loop?

**Human-on-the-loop (HOTL)** means the agent can **execute autonomously**, while a human continuously monitors the system rather than approving every action.

```text
Agent
  ↓
Execute autonomously
  ↓
Monitor
  ├── Normal → Continue
  └── Anomaly / Policy violation
              ↓
         Human intervention
```

### In CWD

* Agent executes **pre-approved, low-risk actions** automatically.
* Monitor **latency, errors, confidence, policy violations, tool usage, cost, and outcomes**.
* Set **thresholds/alerts** for abnormal behavior.
* Human can **pause, stop, or intervene** when thresholds are exceeded.
* High-risk actions still use **HITL approval before execution**.

**Interview answer:**

> “For human-on-the-loop, I allow the agent to execute within predefined policies and continuously monitor its behavior. We track metrics such as errors, confidence, policy violations, tool usage, and cost. If an anomaly or threshold breach occurs, we alert a human who can pause or stop the workflow. Unlike HITL, the human does not approve every normal action; they supervise the autonomous operation and intervene when needed.”
