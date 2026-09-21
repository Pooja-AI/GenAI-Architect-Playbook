## What is RTO?

**RTO = Recovery Time Objective.**

It means:

> **The maximum amount of time a system can be unavailable after a disaster before it must be restored.**

### CWD example

Suppose your CWD business requirement is:

```text
RTO = 15 minutes
```

If the primary Azure region fails at **10:00 AM**, CWD should be operational again by approximately **10:15 AM**.

```text
10:00 AM
   ↓
Region failure ❌
   ↓
Detect failure
   ↓
Route traffic to DR region
   ↓
Start/activate services
   ↓
Load workflow checkpoints
   ↓
Resume workflows
   ↓
10:15 AM
CWD available ✅
```

### RTO vs RPO

| Term    | Meaning                         | CWD example |
| ------- | ------------------------------- | ----------- |
| **RTO** | How quickly must we recover?    | 15 minutes  |
| **RPO** | How much data/work can we lose? | Near-zero   |

**Easy memory:**

* **RTO = Time to recover**
* **RPO = Data you can afford to lose**

### Interview answer

> **"RTO is Recovery Time Objective—the maximum acceptable time to restore service after a disaster. For example, if CWD has an RTO of 15 minutes, after a regional failure we need to fail over, recover the required infrastructure and workflow state, and make CWD operational within 15 minutes."**
