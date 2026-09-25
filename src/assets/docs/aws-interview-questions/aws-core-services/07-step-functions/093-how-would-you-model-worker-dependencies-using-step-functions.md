# How would you model Worker dependencies using Step Functions?

I would model Worker dependencies using **States, `Choice`, `Parallel`, and sequential transitions**.

The key idea is:

> **If Worker B depends on Worker A, Step Functions executes B only after A succeeds.**

### Example: CWD Customer Briefing

Suppose:

* Customer Worker gets customer information.
* Sales Worker needs the customer information.
* Incident Worker can run independently.
* Final Briefing Worker needs all results.

```text id="k8p3dx"
                Start
                  ↓
          Customer Worker
                  ↓
             ┌────┴────┐
             ↓         ↓
        Sales Worker  Incident Worker
             ↓         ↓
             └────┬────┘
                  ↓
        Final Briefing Worker
                  ↓
                 End
```

## Step Functions model

Conceptually:

```text id="q0d8va"
CustomerWorker
      ↓
Parallel
 ┌────┴─────────┐
 ↓              ↓
SalesWorker   IncidentWorker
 └────┬─────────┘
      ↓
FinalBriefingWorker
```

### 1. Sequential dependency

If:

```text
Customer Worker → Sales Worker
```

then:

```text id="v5x9hz"
CustomerWorker
      ↓
SalesWorker
```

Sales Worker starts only after Customer Worker succeeds.

---

### 2. Parallel independent Workers

If two Workers don't depend on each other:

```text id="r7y2mc"
          Parallel
         ↙       ↘
   SalesWorker  IncidentWorker
         ↘       ↙
           Aggregate
```

This reduces total execution time.

---

### 3. Conditional dependency

You can use a `Choice` state:

```text id="w6n2qa"
CustomerWorker
      ↓
   Choice
   ↙    ↘
Sales   No Sales
 ↓        ↓
Sales   Skip
Worker
   ↘    ↙
   Final Worker
```

For example, if the customer belongs to the Sales domain, execute Sales Worker; otherwise skip it.

---

### 4. Failure dependency

You can define retry and catch behavior:

```text id="a4c7zs"
SalesWorker
    ↓
  Failed
    ↓
 Retry
    ↓
 Still Failed
    ↓
  Catch
    ↓
Partial / Alternative path
```

For a **mandatory Worker**, the workflow may fail.

For an **optional Worker**, the workflow can continue with partial results.

---

# CWD example

A more realistic workflow:

```text id="x2r9kb"
                 Coordinator
                      ↓
              Step Functions
                      ↓
              Customer Worker
                      ↓
                 Parallel
              ↙             ↘
       Sales Worker     Incident Worker
              ↓             ↓
              └──────┬──────┘
                     ↓
             Validation/Aggregation
                     ↓
             Briefing Worker
                     ↓
                    End
```

The important dependency rules are:

```text
Customer Worker
      ↓
Sales Worker       ← depends on Customer
Incident Worker    ← independent
      ↓
Briefing Worker    ← depends on required results
```

### 🎯 Strong interview answer

> **“I model Worker dependencies as a state graph in Step Functions. Sequential dependencies are represented by state transitions, independent Workers are executed using Parallel states, and Choice states handle conditional execution. For CWD, for example, the Customer Worker can run first, then Sales and Incident Workers can run in parallel, and the final Briefing Worker runs after the required results are available. I also use Retry and Catch for failure handling and distinguish mandatory Workers from optional Workers.”**

### Easy memory trick

**Dependency → Sequence**
**Independent → Parallel**
**Condition → Choice**
**Failure → Retry/Catch**

### Key distinction

**Step Functions defines and executes the dependency graph.**

**LangGraph can dynamically decide which Workers should participate based on the agent's reasoning.**
