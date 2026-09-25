# Where would you use EventBridge?

## Short answer

I would use **Amazon EventBridge** as the **event-driven integration layer** in CWD when different services need to react to business events without being tightly coupled to each other.

**SQS = queue work.**
**EventBridge = route events.**

## Key points

* Event-driven architecture.
* Decouples producers and consumers.
* Routes events based on event patterns.
* Supports fan-out to multiple targets.
* Integrates with Lambda, SQS, Step Functions, ECS and many AWS services.
* Supports scheduled events.
* Useful for business/domain events.
* Central event bus for multiple CWD services.
* Helps avoid point-to-point integrations.

### CWD flow

```text id="v8q3mw"
Enterprise System / CWD Service
              ↓
         EventBridge
              ↓
       Event Bus / Rules
        ↙      ↓      ↘
       SQS   Lambda   Step Functions
        ↓      ↓          ↓
     Worker  Processor   Workflow
```

## Where would I use it?

### 1. Business events

Suppose a customer incident is created in ServiceNow:

```text id="k6m2rx"
ServiceNow
    ↓
"IncidentCreated"
    ↓
EventBridge
    ↓
 ┌─────────────┬──────────────┐
 ↓             ↓              ↓
SQS          Lambda       Step Functions
 ↓             ↓              ↓
IT Worker    Notification   Workflow
```

Multiple CWD components can react to the same event without ServiceNow knowing about each consumer.

---

### 2. Decouple CWD services

Without EventBridge:

```text id="p4z7ns"
Service A → Service B
Service A → Service C
Service A → Service D
```

This creates many direct dependencies.

With EventBridge:

```text id="q9x3bc"
             EventBridge
             /    |    \
            ↓     ↓     ↓
          SQS   Lambda  Step Functions
```

The producer only publishes an event.

---

### 3. Event routing

We can define rules based on the event.

For example:

```json id="d5r8kw"
{
  "source": "servicenow",
  "detail-type": "IncidentCreated"
}
```

EventBridge can route that event to the appropriate target.

Another event:

```json id="m3v7qp"
{
  "source": "salesforce",
  "detail-type": "OpportunityUpdated"
}
```

can trigger a different CWD workflow.

---

### 4. Fan-out

One event can trigger multiple consumers.

```text id="x2k8fv"
CustomerUpdated
      ↓
 EventBridge
   ↙   ↓    ↘
 SQS Lambda Step Functions
```

For example:

* SQS → update a Worker
* Lambda → update a cache
* Step Functions → start a business workflow

---

### 5. Scheduled jobs

EventBridge can also trigger scheduled operations.

For example:

```text id="w6n4yt"
Every night at 2 AM
       ↓
 EventBridge
       ↓
 Lambda / Step Functions
       ↓
Run evaluation / cleanup / reconciliation
```

This could be used for periodic CWD evaluation, stale-document checks, or reconciliation workflows.

---

### 6. CWD observability/event processing

We can publish application events such as:

```text id="c8v2jp"
AgentRunCompleted
WorkerFailed
DocumentIndexed
EvaluationCompleted
```

Then EventBridge can route those events to appropriate downstream processing.

---

## EventBridge vs SQS

This is a **very common interview question**.

| EventBridge              | SQS                       |
| ------------------------ | ------------------------- |
| Event router             | Message queue             |
| Routes events            | Stores work/messages      |
| Event-driven integration | Asynchronous processing   |
| Pattern-based routing    | Consumer-based processing |
| Fan-out                  | Buffering                 |
| Multiple targets         | Typically queue consumers |
| Business events          | Work items                |

### Simple example

```text id="h7p5sq"
"CustomerUpdated"
       ↓
 EventBridge
    ↙    ↘
   SQS   Lambda
```

EventBridge says:

> **“Who should receive this event?”**

SQS says:

> **“Hold this work until a consumer processes it.”**

---

## EventBridge vs Step Functions

```text id="b4m9zx"
EventBridge
    ↓
"Something happened."

Step Functions
    ↓
"Execute these steps."
```

Example:

```text id="u3k8wd"
IncidentCreated
      ↓
 EventBridge
      ↓
Step Functions
      ↓
Validate
  ↓
Get customer
  ↓
Get incidents
  ↓
Generate briefing
```

---

## Example in CWD

Suppose Salesforce updates a customer opportunity:

```text id="r6v2kn"
Salesforce
    ↓
OpportunityUpdated
    ↓
EventBridge
    ↓
Rule
    ↓
Step Functions
    ↓
Sales Worker
    ↓
MCP
    ↓
Salesforce
```

The event-driven workflow can run independently without the Salesforce system directly calling every CWD component.

---

## 🎯 Strong interview answer

> **“I would use Amazon EventBridge as the event-driven integration layer for CWD. When an important business event occurs, such as a Salesforce opportunity update, ServiceNow incident creation, or document indexing completion, the producer publishes an event to EventBridge. EventBridge applies rules and routes that event to the appropriate targets such as SQS, Lambda, or Step Functions. This decouples CWD services and supports fan-out and event-based workflows. I would use SQS when I need durable queued work, whereas EventBridge is primarily responsible for routing business events.”**

## Easy memory trick

**EventBridge = Detect & Route**

**SQS = Queue & Process**

**Step Functions = Orchestrate**

```text id="s9k4mx"
Event happens
     ↓
EventBridge
     ↓
Where should it go?
     ↓
SQS / Lambda / Step Functions
```

## Key distinction

> **“EventBridge is the event router, SQS is the work queue, and Step Functions is the workflow orchestrator.”**
