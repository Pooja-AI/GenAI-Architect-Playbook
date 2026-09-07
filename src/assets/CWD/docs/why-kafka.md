# Why and When Kafka Is Used in CWD

In the **CWD (Coordinator–Delegator–Worker)** architecture, Apache Kafka is useful when communication is primarily **event-driven, high-volume, asynchronous, durable, and stream-oriented**.

The key architectural principle is:

> **Use Kafka when CWD needs to publish, distribute, process, retain, and replay streams of events at scale—not simply when it needs to send one task from one agent to another.**

This distinction is important because **Kafka and Azure Service Bus solve related but different problems**.

---

# 1. What Problem Does Kafka Solve?

Consider an enterprise platform where thousands of events are continuously generated:

```text
Shipment Events
Order Events
Customer Events
Inventory Events
Machine Events
Agent Events
Workflow Events
Security Events
Model Events
```

Instead of tightly coupling every system:

```text
System A ───► System B
System A ───► System C
System A ───► System D
System B ───► System C
...
```

Kafka creates a durable event-streaming backbone:

```text
                    Kafka
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Consumer A  Consumer B  Consumer C
       Analytics   Agent       Monitoring
```

A producer publishes an event once, and multiple independent consumers can process it.

---

# 2. Kafka's Core Model

The basic model is:

```text
Producer
   │
   ▼
 Kafka Topic
   │
 ┌─┼───────────┐
 ▼ ▼           ▼
C1 C2          C3
```

Kafka is fundamentally built around:

* **topics**
* **partitions**
* **producers**
* **consumers**
* **consumer groups**
* **offsets**
* **replication**
* **retention**

The important mental model is:

> **Kafka stores an ordered stream of events and allows independent consumers to process that stream at their own pace.**

---

# 3. Event vs Command

This is one of the most important decisions in CWD.

### Command

A command says:

> **"Please do this."**

Example:

```json
{
  "type": "analyze_shipment",
  "shipment_id": "SHIP123"
}
```

This is naturally suited to a task queue or command mechanism.

### Event

An event says:

> **"This happened."**

Example:

```json
{
  "event_type": "shipment_delayed",
  "shipment_id": "SHIP123",
  "timestamp": "2026-09-06T15:10:00Z",
  "reason": "carrier_capacity"
}
```

The distinction:

```text
Command → Desired action
Event   → Fact that something happened
```

Kafka is especially strong for **events**.

---

# 4. Kafka in CWD

A CWD architecture might look like:

```text
                         CWD
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Coordinator   Delegators    Workers
             │            │            │
             └────────────┼────────────┘
                          │
                          ▼
                        Kafka
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
        Analytics     Monitoring    Other Agents
```

Kafka can carry events such as:

```text
workflow.started
workflow.completed
task.created
task.completed
agent.status.changed
worker.scaled
tool.executed
shipment.delayed
inventory.changed
risk.detected
approval.completed
```

---

# 5. Why Use Kafka?

There are several major reasons.

## 5.1 Event-Driven Communication

Instead of agents constantly calling each other synchronously:

```text
Agent A
   │
   ▼
Agent B
   │
   ▼
Agent C
```

you can publish events:

```text
Agent A
   │
   ▼
Kafka
   │
 ┌─┼─────┐
 ▼ ▼     ▼
B  C     D
```

This reduces direct coupling.

Agent A doesn't need to know every consumer.

---

# 6. Asynchronous Processing

Kafka allows producers and consumers to operate independently.

```text
Producer
   │
   ▼
Kafka
   │
   ▼
Consumer
```

The producer doesn't necessarily wait for the consumer to finish.

For example:

```text
Coordinator
     │
     ▼
workflow.started
     │
     ▼
Kafka
     │
     ├──► Analytics
     ├──► Monitoring
     ├──► Audit
     └──► Agent
```

This is particularly useful when consumers perform expensive processing.

---

# 7. Scalability

Kafka scales through **partitions**.

Suppose:

```text
shipment-events
```

has:

```text
Partition 0
Partition 1
Partition 2
Partition 3
```

Consumers can process different partitions concurrently.

```text
                Kafka Topic
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Consumer 1   Consumer 2   Consumer 3
```

Within a consumer group, partitions can be distributed among consumers.

This allows processing capacity to increase by adding consumers, subject to partitioning and workload constraints.

---

# 8. High-Volume Event Streaming

This is where Kafka is particularly valuable.

Imagine:

```text
100,000 events/sec
```

from:

```text
IoT
ERP
CRM
Manufacturing
Supply Chain
Applications
Agents
```

Kafka provides a scalable event-streaming backbone.

```text
Enterprise Systems
       │
       ▼
    Producers
       │
       ▼
   ┌─────────┐
   │  Kafka  │
   └─────────┘
       │
 ┌─────┼──────┬────────┐
 ▼     ▼      ▼        ▼
AI   Analytics Alerts Audit
```

This is different from a simple task queue.

---

# 9. Durable Event Retention

Kafka doesn't simply deliver a message and immediately forget it.

Events can be retained according to configured retention policies.

Conceptually:

```text
Event 1
Event 2
Event 3
Event 4
Event 5
  │
  ▼
Kafka Log
```

Consumers maintain offsets indicating how far they have processed.

Therefore a consumer can potentially:

```text
Read events
   ↓
Process
   ↓
Crash
   ↓
Restart
   ↓
Resume from offset
```

This is a major advantage for event-streaming architectures.

---

# 10. Replay

One of Kafka's most useful properties is the ability to replay retained events.

Suppose an analytics consumer has a bug:

```text
Kafka
  │
  ▼
Analytics Consumer
  │
  ✗ Bug
```

After fixing it:

```text
Kafka retained events
        │
        ▼
Restart consumer
        │
        ▼
Replay events
        │
        ▼
Rebuild analytics
```

This makes Kafka useful for:

* event reconstruction
* data pipelines
* analytics
* model training pipelines
* audit-related processing
* downstream projections
* reprocessing after software bugs

---

# 11. Multiple Independent Consumers

Suppose CWD produces:

```text
workflow.completed
```

Multiple systems may need it.

```text
                    Kafka
                      │
        workflow.completed
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
   Analytics        Audit        Notification
```

Each consumer can independently process the event.

This is a major benefit over point-to-point communication.

---

# 12. Consumer Groups

Consumer groups provide scalable processing.

Example:

```text
Topic:
shipment-events

Consumer Group:
shipping-ai
```

Suppose there are three partitions:

```text
P0 ─────► Consumer A
P1 ─────► Consumer B
P2 ─────► Consumer C
```

If another consumer joins:

```text
P0 ─────► Consumer A
P1 ─────► Consumer B
P2 ─────► Consumer C
```

The group can rebalance partitions according to Kafka's consumer-group semantics.

Another group:

```text
analytics-group
```

can independently consume the same topic.

Thus:

```text
                    Topic
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
     Agent Group             Analytics Group
       A1 A2 A3                 X1 X2
```

Both groups receive the event stream independently.

---

# 13. Event Ordering

Kafka provides ordering within a partition.

For example:

```text
Partition 0

Event 1
Event 2
Event 3
Event 4
```

Consumers process that partition in order.

This is useful when event sequence matters.

For example:

```text
ShipmentCreated
      ↓
ShipmentPicked
      ↓
ShipmentShipped
      ↓
ShipmentDelayed
      ↓
ShipmentDelivered
```

You may partition using a business key such as:

```text
shipment_id
```

so events for the same shipment are routed consistently to the same partition.

---

# 14. Kafka and CWD Agent Events

CWD can publish lifecycle events:

```text
agent.registered
agent.ready
agent.degraded
agent.draining
agent.offline
```

Workers can publish:

```text
worker.task.started
worker.task.completed
worker.task.failed
worker.tool.executed
```

Workflow events:

```text
workflow.started
workflow.step.completed
workflow.retry
workflow.failed
workflow.completed
```

This creates an event-driven observability and integration layer around CWD.

---

# 15. Kafka for Agent Coordination

Kafka can participate in multi-agent architecture:

```text
Coordinator
    │
    ▼
Kafka
    │
    ▼
Domain Agent
    │
    ▼
Kafka
    │
    ▼
Other Consumers
```

However, I would **not automatically use Kafka for every Coordinator→Delegator task**.

If the communication is:

> "Delegator, please execute this specific task and return the result."

a command/task mechanism such as Service Bus may be more natural.

If it is:

> "Shipment SHIP123 has entered delayed status."

Kafka is a strong fit.

---

# 16. Kafka vs Azure Service Bus

This is a very important CWD architectural decision.

| Requirement                       | Kafka             | Azure Service Bus        |
| --------------------------------- | ----------------- | ------------------------ |
| Event streaming                   | ⭐⭐⭐               | ⭐⭐                       |
| High-throughput streams           | ⭐⭐⭐               | ⭐⭐                       |
| Event replay                      | ⭐⭐⭐               | More limited/different   |
| Multiple independent consumers    | ⭐⭐⭐               | ⭐⭐⭐                      |
| Point-to-point commands           | ⭐⭐                | ⭐⭐⭐                      |
| Enterprise task queues            | ⭐⭐                | ⭐⭐⭐                      |
| Dead-letter workflow              | Possible patterns | Strong native fit        |
| Sessions/message ordering         | Partition-based   | Sessions/order features  |
| Long-running task orchestration   | Possible          | Strong complementary fit |
| Event history                     | ⭐⭐⭐               | Not primary purpose      |
| Stream processing                 | ⭐⭐⭐               | Not primary purpose      |
| Azure-native enterprise messaging | Good              | Excellent                |
| CWD task delivery                 | Possible          | Often preferred          |
| CWD event backbone                | Excellent         | Possible                 |

The architectural mental model is:

```text
Service Bus
     =
Durable Task / Command Delivery

Kafka
     =
Durable Event Streaming
```

---

# 17. Don't Confuse Kafka With LangGraph

They operate at different layers.

### LangGraph

Controls:

```text
What happens next?
```

### Kafka

Provides:

```text
How do events flow between distributed components?
```

Example:

```text
LangGraph
    │
    ▼
Task Completed
    │
    ▼
Publish Event
    │
    ▼
Kafka
    │
    ├──► Monitoring
    ├──► Analytics
    └──► Other Agents
```

Kafka doesn't replace the workflow engine.

---

# 18. Kafka vs A2A

Similarly:

### A2A

Defines:

> **Agent-to-agent collaboration contract.**

### Kafka

Provides:

> **Event streaming infrastructure.**

They can coexist.

```text
Agent A
   │
   │ A2A semantics
   ▼
Kafka
   │
   ▼
Agent B
```

But Kafka itself doesn't automatically make two systems A2A-compatible.

---

# 19. Kafka vs MCP

They are completely different boundaries.

```text
A2A
Agent ─────────► Agent

MCP
Agent ─────────► Tool/System

Kafka
Producer ──────► Event Stream ─────► Consumers
```

So:

```text
A2A   = Agent collaboration
MCP   = Tool integration
Kafka = Event streaming
```

---

# 20. Kafka + MCP Example

Suppose an inventory system changes stock:

```text
Inventory System
       │
       ▼
inventory.updated
       │
       ▼
Kafka
       │
       ├──► Inventory Agent
       ├──► Forecasting
       ├──► Analytics
       └──► Alerting
```

The Inventory Agent may then use MCP:

```text
Inventory Agent
       │
       ▼
MCP
       │
       ▼
Inventory Tool
       │
       ▼
ERP
```

So Kafka distributes the **event**, while MCP provides **capability access**.

---

# 21. Kafka + RAG

Kafka can also support event-driven knowledge ingestion.

Example:

```text
SharePoint Document Changed
            │
            ▼
      document.updated
            │
            ▼
          Kafka
            │
            ▼
      RAG Ingestion
            │
      ┌─────┴─────┐
      ▼           ▼
    Parse       Metadata
      │           │
      └─────┬─────┘
            ▼
         Chunk
            ↓
        Embedding
            ↓
      Azure AI Search
```

This allows RAG indexing to react to enterprise content changes.

---

# 22. Kafka + Agent Registry

Agent lifecycle events can also be streamed.

```text
Agent Registry
      │
      ▼
agent.status.changed
      │
      ▼
Kafka
      │
 ┌────┼─────┐
 ▼    ▼     ▼
Router Ops Analytics
```

For example:

```json
{
  "event_type": "agent.status.changed",
  "agent_id": "shipping-agent",
  "status": "degraded",
  "version": "2.4.1",
  "timestamp": "2026-09-06T15:10:00Z"
}
```

The routing layer could consume these events and update its operational view.

---

# 23. Event-Driven Agent Activation

Kafka can also support event-triggered agent workflows.

For example:

```text
Manufacturing System
       │
       ▼
temperature.high
       │
       ▼
Kafka
       │
       ▼
Monitoring Consumer
       │
       ▼
Coordinator
       │
       ▼
Maintenance Agent
       │
       ▼
Workers
```

The agent isn't constantly polling the manufacturing system.

The event activates the workflow.

---

# 24. Event-Driven Architecture

The larger architecture becomes:

```text
                    Enterprise Systems
                           │
                    Events / Changes
                           │
                           ▼
                    ┌─────────────┐
                    │    Kafka    │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     CWD Agents       Analytics          Monitoring
          │
          ▼
      LangGraph
          │
     ┌────┴────┐
     ▼         ▼
 Delegator   Worker
               │
               ▼
              MCP
               │
               ▼
       Enterprise Systems
```

This is a powerful pattern because the platform can operate both:

```text
Request-driven
```

and:

```text
Event-driven
```

---

# 25. Request-Driven vs Event-Driven CWD

### Request-driven

User asks:

> "Why is shipment SHIP123 delayed?"

```text
User
 ↓
Gateway
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Carrier API
```

### Event-driven

System detects:

> "Shipment SHIP123 has become delayed."

```text
Carrier
 ↓
Event
 ↓
Kafka
 ↓
CWD Event Consumer
 ↓
Coordinator
 ↓
Investigation Workflow
```

This gives CWD two execution modes.

---

# 26. Kafka Reliability

Kafka supports reliability through mechanisms such as:

* replicated partitions
* acknowledgments
* consumer offsets
* configurable retention
* consumer groups
* failure recovery
* durable log architecture

But there is an important principle:

> **Kafka's reliable delivery does not automatically make the business operation exactly-once.**

Suppose:

```text
Kafka Event
    ↓
Worker
    ↓
Create Ticket
    ↓
Worker crashes
```

The event may be processed again.

Therefore CWD still needs:

```text
Idempotency
Deduplication
Business transaction controls
```

---

# 27. Kafka and Idempotency

For example:

```json
{
  "event_id": "EVT-1001",
  "event_type": "shipment.delayed",
  "shipment_id": "SHIP123"
}
```

The consumer can maintain:

```text
processed_event_id = EVT-1001
```

Before executing:

```text
Already processed?
   │
 ┌─┴──┐
YES   NO
 │     │
Skip  Execute
       │
       ▼
     Mark
```

This is especially important for agent-triggered business operations.

---

# 28. Backpressure and Consumer Scaling

Suppose events arrive faster than consumers can process:

```text
Producer Rate = 10,000/sec
Consumer Rate = 5,000/sec
```

The backlog grows.

```text
Kafka
 │
 ▼
██████████████████
       backlog
```

CWD can respond by:

* increasing consumer instances
* increasing partitions where appropriate
* reducing unnecessary processing
* batching
* using smaller models
* throttling producers
* prioritizing workloads
* separating consumer groups
* applying backpressure

Kafka therefore helps absorb traffic spikes.

---

# 29. Kafka and Agentic AI Scalability

Consider:

```text
10,000 business events/minute
```

Each event potentially creates:

```text
1 Coordinator workflow
3 Delegator tasks
5 Worker tasks
2 RAG queries
3 tool calls
```

The downstream execution could explode.

Kafka provides a buffering and streaming layer:

```text
Enterprise Events
       ↓
Kafka
       ↓
Controlled Consumers
       ↓
CWD Workflows
       ↓
Worker Pools
```

This helps prevent every upstream event from immediately overwhelming the agent platform.

But you still need:

* quotas
* rate limits
* concurrency controls
* autoscaling
* workload prioritization
* retry limits

---

# 30. Kafka Topics in CWD

A possible topic design:

```text
agent-events
workflow-events
task-events
tool-events
security-events
rag-events
model-events
business-events
```

Or domain-specific:

```text
shipping-events
finance-events
inventory-events
customer-events
```

The correct topic design depends on:

* event ownership
* throughput
* retention
* consumer requirements
* partitioning
* security
* schema evolution
* operational boundaries

Avoid creating thousands of unnecessary topics without governance.

---

# 31. Event Schema Governance

Enterprise Kafka requires schema governance.

Example:

```json
{
  "event_id": "EVT-1001",
  "event_type": "shipment.delayed",
  "event_version": "1.0",
  "correlation_id": "CORR-7890",
  "timestamp": "2026-09-06T15:10:00Z",
  "source": "shipping-system",
  "payload": {
    "shipment_id": "SHIP123",
    "reason": "carrier_capacity"
  }
}
```

Important metadata includes:

```text
event_id
event_type
event_version
timestamp
source
correlation_id
tenant_id
payload
```

Schema evolution must be managed carefully so consumers don't break when producers change.

---

# 32. Kafka Security in CWD

Kafka should be treated as enterprise infrastructure, not an open event bus.

Controls include:

```text
Authentication
Authorization
TLS
Encryption
Topic ACLs
Consumer permissions
Producer permissions
Tenant isolation
Network controls
Schema governance
Audit
Data classification
Retention policies
```

For example:

```text
Shipping Worker
      │
      ▼
Allowed:
shipping-events

Not allowed:
hr-events
finance-events
```

Least privilege should apply to producers and consumers.

---

# 33. Don't Put Sensitive Data Everywhere

Events can propagate widely.

Bad:

```json
{
  "event": "customer.updated",
  "customer_ssn": "...",
  "credit_card": "..."
}
```

Better:

```json
{
  "event_id": "EVT-1001",
  "event_type": "customer.updated",
  "customer_id": "C123",
  "resource_reference": "customer://C123"
}
```

Then the authorized consumer can retrieve the necessary data through an approved mechanism.

This follows the principle:

> **Events should contain the minimum information necessary for downstream processing.**

---

# 34. Kafka Observability

Important Kafka metrics include:

```text
Producer rate
Consumer rate
Consumer lag
Partition distribution
Message age
Error rate
Retry rate
Reprocessing rate
Throughput
Broker health
Under-replicated partitions
```

For CWD, correlate events with:

```text
correlation_id
workflow_id
task_id
run_id
step_id
agent_id
event_id
```

Then you can trace:

```text
Business Event
     ↓
Kafka
     ↓
Consumer
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
MCP
     ↓
Enterprise System
```

---

# 35. Kafka Failure Handling

A robust design considers:

```text
Producer failure
Broker failure
Consumer failure
Network failure
Schema failure
Malformed event
Consumer processing failure
Downstream API failure
Agent unavailable
```

Typical pattern:

```text
Kafka Event
     │
     ▼
Consumer
     │
     ▼
Validate
     │
 ┌───┴────┐
 ▼        ▼
Valid    Invalid
 │         │
 ▼         ▼
Process   Error handling
           │
           ▼
       Retry/DLQ pattern
```

The exact retry/DLQ architecture should be designed according to Kafka platform capabilities and enterprise standards.

---

# 36. When Kafka Should NOT Be Used

Don't introduce Kafka simply because the architecture is "event-driven."

For example:

```text
Coordinator
    │
    ▼
Delegator
    │
    ▼
"Please execute this task"
```

If this is a simple command requiring controlled completion, a task-oriented messaging mechanism may be better.

Likewise, don't use Kafka as:

```text
❌ Database
❌ Workflow engine
❌ Agent Registry
❌ IAM
❌ MCP
❌ A2A protocol
❌ General-purpose cache
```

Kafka is primarily the **event-streaming backbone**.

---

# 37. Kafka Decision Matrix

| Situation                            | Kafka?                   |
| ------------------------------------ | ------------------------ |
| High-volume events                   | ✅ Strong fit             |
| Event history/replay                 | ✅ Strong fit             |
| Multiple independent consumers       | ✅ Strong fit             |
| Stream processing                    | ✅ Strong fit             |
| Event-driven agent activation        | ✅ Strong fit             |
| Enterprise event integration         | ✅ Strong fit             |
| Real-time analytics                  | ✅ Strong fit             |
| Simple Coordinator→Delegator command | ⚠️ Often Service Bus/A2A |
| Simple request/response              | ❌ Usually unnecessary    |
| Workflow state                       | ❌ LangGraph/Cosmos       |
| Tool integration                     | ❌ MCP                    |
| Agent discovery                      | ❌ Agent Registry         |
| Authorization                        | ❌ IAM/Policy             |
| Short-lived cache                    | ❌ Redis                  |

---

# 38. Recommended CWD Pattern

A mature CWD architecture can use **both Kafka and Service Bus**.

```text
                         CWD
                          │
          ┌───────────────┴───────────────┐
          │                               │
     Command / Task                  Event Streaming
          │                               │
          ▼                               ▼
    Azure Service Bus                   Kafka
          │                               │
          ▼                               ▼
Coordinator / Delegator          Independent Consumers
Worker execution                Analytics / Monitoring /
                                 Event-driven Agents
```

Then:

```text
A2A
 ↓
Defines agent collaboration

Service Bus
 ↓
Delivers asynchronous tasks

Kafka
 ↓
Streams enterprise/platform events

LangGraph
 ↓
Controls workflow state

MCP
 ↓
Connects Workers to enterprise capabilities
```

---

# 39. Complete CWD Event-Driven Architecture

```text
                         ENTERPRISE SYSTEMS
                    ┌─────────┼──────────┐
                    │         │          │
                 ERP       CRM       Manufacturing
                    │         │          │
                    └─────────┼──────────┘
                              │
                         Business Events
                              │
                              ▼
                       ┌────────────┐
                       │   KAFKA    │
                       │ Event Bus  │
                       └─────┬──────┘
                             │
              ┌──────────────┼───────────────┐
              ▼              ▼               ▼
         CWD Event       Analytics       Monitoring
         Consumer
              │
              ▼
         Coordinator
              │
             A2A
              │
              ▼
          Delegator
              │
        Service Bus
              │
              ▼
           Workers
              │
          ┌───┴────┐
          ▼        ▼
         MCP      RAG
          │        │
          ▼        ▼
      Enterprise  Search
       APIs
```

This architecture supports both **reactive event-driven workflows** and **request-driven workflows**.

---

# 40. Architectural Formula

$$
\boxed{
Kafka =
Event\ Streaming
+
Durable\ Log
+
Partitioning
+
Consumer\ Groups
+
Scalability
+
Retention
+
Replay
+
Asynchronous\ Processing
+
Independent\ Consumers
}
$$

For CWD:

$$
\boxed{
CWD\ Event\ Architecture =
Business\ Events
+
Kafka
+
Event\ Consumers
+
Agent\ Activation
+
LangGraph\ Workflow
+
MCP/A2A
+
Observability
}
$$

---

# 41. Interview-Ready Answer

> **"Kafka is used in CWD when we need high-volume, asynchronous, event-driven communication and durable event streaming rather than simple request-response task execution. Enterprise systems can publish business and platform events such as shipment updates, inventory changes, workflow events, agent status changes, or security events to Kafka. Multiple independent consumer groups can consume those events for agent activation, analytics, monitoring, auditing, or downstream processing. Kafka's partitioning provides horizontal scalability, while retention and offsets allow consumers to recover and replay events when necessary.**
>
> **I would not use Kafka for every CWD communication. For a direct command such as 'Delegator, execute this task,' a task-oriented mechanism such as Azure Service Bus combined with the A2A contract may be more appropriate. Kafka is better when the message represents an event or stream of facts that multiple independent consumers need to process asynchronously. LangGraph remains responsible for workflow state and orchestration, A2A defines agent collaboration, MCP handles tool and enterprise-system integration, and Kafka provides the event-streaming backbone.**
>
> **In production, Kafka also requires schema governance, authentication, authorization, encryption, topic-level access control, partition strategy, consumer scaling, lag monitoring, idempotency, retry/error handling, data minimization, and correlation IDs. The architectural goal is to decouple producers from consumers while allowing CWD to process enterprise events reliably and at scale."**

# Final Mental Model

```text
                 WHAT HAPPENED?
                      │
                      ▼
                    Kafka
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      Agent        Analytics      Monitor
        │
        ▼
    LangGraph
        │
        ▼
    Coordinator
        │
       A2A
        │
        ▼
    Delegator
        │
   Service Bus
        │
        ▼
     Worker
        │
       MCP
        │
        ▼
Enterprise Systems
```

> **One sentence to remember:**
> **Kafka is used in CWD when enterprise or platform events need to be streamed asynchronously at scale to multiple independent consumers with durable retention, partition-based scalability, failure recovery, and replayability; Service Bus handles task-oriented messaging, LangGraph handles workflow state, A2A handles agent collaboration, and MCP handles enterprise tool integration.**
