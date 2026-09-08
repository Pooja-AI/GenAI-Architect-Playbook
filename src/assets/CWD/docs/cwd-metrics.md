# Operational and AI-Specific Metrics in CWD

Metrics are numerical measurements that tell us how CWD is performing, how reliably it executes work, how efficiently it uses AI and infrastructure, and whether it achieves the intended business outcome.

For CWD, metrics must cover both:

* Operational performance: Is the platform available, responsive, scalable, and reliable?

* AI behavior: Are agents making correct decisions, using tools appropriately, retrieving useful evidence, and producing quality results?

> A fast agent that produces incorrect answers is not successful. A correct agent that consistently times out is not production-ready.

## 1. Where metrics fit in CWD

```
User Request
    ↓
Gateway
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ├── LLM
    ├── RAG
    ├── MCP Tool
    └── Enterprise Data Source
    ↓
Aggregation
    ↓
Final Response
    ↓
Metrics Collection
    ↓
Dashboards + Alerts + Evaluation
```

A single request can generate multiple agent executions, LLM calls, tool calls, retrieval operations, and messages. Therefore, metrics must be measured at multiple levels rather than only at the API Gateway.

## 2. Operational vs AI-specific metrics

|
Category

|

Main question

|
| --- | --- |
|

Operational metrics

|

Is the platform running efficiently and reliably?

|
|

AI-specific metrics

|

Is the AI behaving correctly and efficiently?

|
|

Business metrics

|

Is the intended business outcome being achieved?

|

### Examples

```
Operational:
Request volume, throughput, error rate, queue depth, latency

AI-specific:
Agent accuracy, LLM latency, TTFT, token consumption,
tool success, retrieval quality, groundedness

Business:
Task completion, successful workflows, user satisfaction,
cost per successful business outcome
```

## 3. Request volume

Request volume measures how many requests CWD receives during a specific time period.

Examples:

* Requests per second

* Requests per minute

* Requests per hour

* Requests per tenant

* Requests per application

* Requests per agent capability

### Example

```
10:00–10:01
Incoming requests = 600
```

### Why it matters

Request volume helps determine:

* Traffic patterns

* Peak usage

* Capacity requirements

* Autoscaling needs

* Tenant workload distribution

* Cost trends

### CWD example

```
Gateway receives 1,000 requests/minute
        ↓
Coordinator creates 1,500 tasks
        ↓
Workers execute 3,000 tool calls
```

Request volume is not the same as execution volume. One request may create many downstream operations.

## 4. Throughput

Throughput measures how much work CWD successfully processes during a time period.

Examples:

* Completed workflows per second

* Completed tasks per minute

* Worker executions per minute

* Tool calls per second

* RAG queries per second

* Messages processed per second

### Formula

Throughput=Completed OperationsTime Period\text{Throughput} = \frac{\text{Completed Operations}}{\text{Time Period}}Throughput=Time PeriodCompleted Operations

### Example

```
500 tasks completed in 60 seconds
```

Throughput=50060≈8.33\text{Throughput} = \frac{500}{60} \approx 8.33Throughput=60500≈8.33

Throughput measures completed work, not merely incoming requests.

## 5. Error rate

Error rate measures the percentage of operations that fail.

### Formula

Error Rate=Failed OperationsTotal Operations×100\text{Error Rate} = \frac{\text{Failed Operations}}{\text{Total Operations}} \times 100Error Rate=Total OperationsFailed Operations×100

### Example

```
Total requests = 1,000
Failed requests = 20
```

Error Rate=201000×100=2%\text{Error Rate} = \frac{20}{1000}\times100 = 2\%Error Rate=100020×100=2%

### CWD error layers

```
Gateway errors
Coordinator errors
Delegator errors
Worker errors
LLM errors
MCP errors
RAG errors
Database errors
Messaging errors
Workflow errors
```

### Important distinction

A request may return HTTP 200 but still have:

* Failed Worker

* Partial result

* Invalid tool result

* Incorrect business outcome

Therefore, CWD should measure both technical error rate and business failure rate.

## 6. Agent execution time

Agent execution time measures how long an individual Coordinator, Delegator, or Worker takes to complete its assigned responsibility.

### Formula

Agent Execution Time=Tcompletion−Tstart\text{Agent Execution Time} = T_{\text{completion}} - T_{\text{start}}Agent Execution Time=Tcompletion−Tstart

### Example

```
Worker started:   10:00:00
Worker completed: 10:00:02
```

Execution Time=2 seconds\text{Execution Time} = 2\text{ seconds}Execution Time=2 seconds

### CWD measurement levels

```
Coordinator execution time
Delegator execution time
Worker execution time
Task execution time
Workflow execution time
End-to-end request time
```

### Why it matters

It helps identify whether latency comes from:

* Planning

* Agent discovery

* Task decomposition

* Worker execution

* Aggregation

* Retries

* Dependency calls

Agent execution time should be broken down into meaningful steps rather than treated as one unexplained number.

## 7. LLM latency

LLM latency measures the time spent waiting for an LLM response.

It is a dependency-level metric inside the Worker.

```
Worker
   ↓
LLM Invocation
   ↓
Response
```

### Important latency measures

|
Metric

|

Meaning

|
| --- | --- |
|

Request latency

|

Time until the LLM request completes

|
|

Time to first token (TTFT)

|

Time until the first output token is received

|
|

Generation latency

|

Time spent generating output

|
|

Total LLM latency

|

Complete LLM request duration

|
|

P50/P95/P99 latency

|

Typical and tail latency

|

### Why it matters

LLM latency affects:

* User experience

* Workflow completion time

* Worker utilization

* Queue buildup

* Cost

* Timeout and retry behavior

A Worker may be slow because the LLM is slow, but it may also be slow because of RAG, MCP, or an enterprise API.

## 8. Time to first token (TTFT)

Time to first token measures how long it takes for the LLM to begin producing output after the request is sent.

```
LLM Request Sent
       ↓
       ↓
First Token Received
```

### Formula

TTFT=Tfirst token−Trequest sent\text{TTFT} = T_{\text{first token}} - T_{\text{request sent}}TTFT=Tfirst token−Trequest sent

### Example

```
Request sent:      10:00:00.000
First token:       10:00:00.800
```

TTFT=800 ms\text{TTFT} = 800\text{ ms}TTFT=800 ms

### Why it matters

TTFT is especially important for:

* Streaming responses

* Interactive chat

* User-perceived responsiveness

* Long prompts

* Large context windows

* Model queueing

### TTFT vs total latency

```
Request sent
    ↓ 800 ms
First token
    ↓ 2,200 ms
Complete response

TTFT = 800 ms
Total latency = 3,000 ms
```

TTFT measures responsiveness; total latency measures completion time.

## 9. Token consumption

Token consumption measures how many input and output tokens CWD sends to and receives from LLMs.

### Formula

Total Tokens=Input Tokens+Output Tokens\text{Total Tokens} = \text{Input Tokens} + \text{Output Tokens}Total Tokens=Input Tokens+Output Tokens

### Example

```
Input tokens  = 2,000
Output tokens = 500
```

Total Tokens=2,500\text{Total Tokens} = 2,500Total Tokens=2,500

### CWD token sources

* User prompt

* System/developer instructions

* Conversation history

* Short-term memory

* Persistent memory

* Retrieved RAG context

* Tool results

* Agent-to-agent context

* LLM output

### Why it matters

Token consumption affects:

* LLM cost

* Latency

* Context-window usage

* Throughput

* Memory requirements

* Prompt efficiency

### Important insight

```
More context ≠ Better answer
```

CWD should retrieve and propagate relevant, authorized, bounded context, not the entire conversation or all available documents.

## 10. Tool latency

Tool latency measures how long an MCP tool or approved enterprise API takes to execute.

```
Worker
   ↓
MCP Tool
   ↓
Enterprise API
   ↓
Result
```

### Formula

Tool Latency=Tresult−Tinvocation\text{Tool Latency} = T_{\text{result}} - T_{\text{invocation}}Tool Latency=Tresult−Tinvocation

### Example

```
Tool invoked: 10:00:00.000
Tool result:   10:00:01.200
```

Tool Latency=1.2 seconds\text{Tool Latency} = 1.2\text{ seconds}Tool Latency=1.2 seconds

### Why it matters

Tool latency can dominate Worker execution time.

```
Worker = 4 seconds
   ├── LLM = 500 ms
   ├── MCP Tool = 3,200 ms
   └── Validation = 300 ms
```

The enterprise dependency may be the actual bottleneck.

### Tool metrics

* Tool latency

* Tool invocation success rate

* Tool timeout rate

* Tool retry rate

* Tool argument-validation failures

* Tool authorization denials

* Tool result-validation failures

* Tool business success rate

## 11. Retrieval performance

Retrieval performance measures how effectively and efficiently the RAG layer finds useful enterprise evidence.

It includes both quality and latency.

```
Query
   ↓
Query Transformation
   ↓
Embedding
   ↓
Azure AI Search
   ↓
Security Filtering
   ↓
Ranking
   ↓
Context Assembly
```

### Operational retrieval metrics

* Retrieval latency

* Query volume

* Indexing latency

* Indexing failure rate

* Search throttling

* Candidate count

* Authorized result count

* Selected chunk count

* Context size

### AI retrieval-quality metrics

|
Metric

|

Meaning

|
| --- | --- |
|

Recall@K

|

How many relevant documents were retrieved in top K

|
|

Precision@K

|

How many retrieved documents were relevant

|
|

MRR

|

How highly the first relevant result appears

|
|

NDCG

|

Quality of ranking across retrieved results

|
|

Context relevance

|

Whether retrieved evidence is relevant

|
|

Context precision

|

Whether selected context is mostly useful

|
|

Context recall

|

Whether necessary evidence was retrieved

|
|

Groundedness

|

Whether the answer is supported by evidence

|

### Why it matters

A retrieval system can be fast but return irrelevant evidence.

```
Retrieval latency = 100 ms
Retrieval quality = Poor
```

Or it can retrieve excellent evidence but be too slow.

```
Retrieval quality = High
Retrieval latency = 5 seconds
```

CWD must optimize both retrieval quality and retrieval performance.

## 12. Queue depth

Queue depth measures how many messages or tasks are waiting to be processed.

```
Coordinator
    ↓
Service Bus Queue
    ↓
Worker Pool
```

### Example

```
Queue depth = 500 tasks
Available Workers = 10
```

### Why it matters

Queue depth indicates:

* Backlog

* Consumer capacity

* Traffic spikes

* Worker availability

* Scaling requirements

* Downstream dependency slowdown

### Related metrics

* Queue depth

* Message age

* Queue wait time

* Consumer throughput

* Delivery count

* Retry count

* Dead-letter count

* Consumer lag

### Important distinction

```
High request volume
        ↓
High queue depth
        ↓
Longer task latency
        ↓
Timeouts
        ↓
Retries
        ↓
More queue pressure
```

Queue depth is often an early warning of overload.

## 13. Success rate

Success rate measures the percentage of operations that complete successfully.

### Formula

Success Rate=Successful OperationsTotal Operations×100\text{Success Rate} = \frac{\text{Successful Operations}}{\text{Total Operations}} \times 100Success Rate=Total OperationsSuccessful Operations×100

### Example

```
Total workflows = 1,000
Successful workflows = 950
```

Success Rate=95%\text{Success Rate} = 95\%Success Rate=95%

### CWD success levels

```
Request success
Agent success
Task success
Run success
Tool success
Workflow success
Business outcome success
```

These are not interchangeable.

### Example

```
Gateway request = Success
Worker execution = Success
Tool execution = Success
Business outcome = Failure
```

The system technically executed, but the business objective was not achieved.

## 14. Cost

Cost metrics measure the resources consumed by CWD to execute agents and complete workflows.

### Cost categories

```
LLM inference
Embedding generation
RAG / Search
Compute
Cosmos DB
Redis
Service Bus
Storage
Networking
Observability
External APIs
```

### LLM cost

LLM Cost=(Input Tokens×Input Price)+(Output Tokens×Output Price)\text{LLM Cost} = (\text{Input Tokens}\times\text{Input Price}) + (\text{Output Tokens}\times\text{Output Price})LLM Cost=(Input Tokens×Input Price)+(Output Tokens×Output Price)

### Workflow cost

Workflow Cost=∑LLM Costs+∑Infrastructure Costs+∑External Service Costs\text{Workflow Cost} = \sum \text{LLM Costs} + \sum \text{Infrastructure Costs} + \sum \text{External Service Costs}Workflow Cost=∑LLM Costs+∑Infrastructure Costs+∑External Service Costs

### Cost attribution

```
Tenant
   ↓
Session
   ↓
Turn
   ↓
Workflow
   ↓
Task
   ↓
Run
   ↓
Step
   ↓
Agent / Worker
   ↓
LLM / Tool / Infrastructure
```

### Important metric

Cost per Successful Workflow=Total CostSuccessful Workflows\text{Cost per Successful Workflow} = \frac{\text{Total Cost}}{\text{Successful Workflows}}Cost per Successful Workflow=Successful WorkflowsTotal Cost

Cost should be evaluated together with quality, reliability, latency, and business value.

## 15. Metrics across the complete CWD path

|
Component

|

Important metrics

|
| --- | --- |
|

Gateway

|

Request volume, throughput, error rate, latency, availability

|
|

Coordinator

|

Planning time, routing accuracy, authorization decisions, workflow success

|
|

Delegator

|

Task decomposition, Worker selection, queue wait, aggregation time

|
|

Worker

|

Execution time, success rate, retries, tool latency, LLM latency

|
|

LLM

|

TTFT, total latency, tokens, model errors, cost

|
|

MCP Tool

|

Tool latency, invocation success, argument validity, authorization, retries

|
|

RAG

|

Retrieval latency, Recall@K, Precision@K, groundedness, context size

|
|

Service Bus

|

Queue depth, message age, throughput, delivery failures, DLQ

|
|

Cosmos DB

|

Request latency, throttling, failures, throughput

|
|

Redis

|

Latency, hit ratio, memory, evictions, connection failures

|
|

Workflow

|

End-to-end latency, success rate, partial failures, recovery rate

|
|

Business

|

Goal completion, user satisfaction, cost per successful outcome

|

## 16. Latency breakdown in CWD

A useful end-to-end latency model is:

TE2E=TGateway+TCoordinator+TDelegator+TCritical Path+TAggregation+TResponseT_{\text{E2E}} = T_{\text{Gateway}} + T_{\text{Coordinator}} + T_{\text{Delegator}} + T_{\text{Critical Path}} + T_{\text{Aggregation}} + T_{\text{Response}}TE2E=TGateway+TCoordinator+TDelegator+TCritical Path+TAggregation+TResponse

For a Worker:

TWorker=TValidation+TRAG+TLLM+TMCP+TBusiness Logic+TOutput ValidationT_{\text{Worker}} = T_{\text{Validation}} + T_{\text{RAG}} + T_{\text{LLM}} + T_{\text{MCP}} + T_{\text{Business Logic}} + T_{\text{Output Validation}}TWorker=TValidation+TRAG+TLLM+TMCP+TBusiness Logic+TOutput Validation

For parallel Workers:

TCritical Path≈max⁡(TWorker A,TWorker B,TWorker C)T_{\text{Critical Path}} \approx \max(T_{\text{Worker A}},T_{\text{Worker B}},T_{\text{Worker C}})TCritical Path≈max(TWorker A,TWorker B,TWorker C)

This helps identify whether the bottleneck is:

* Gateway

* Coordinator

* Delegator

* Queue

* Worker

* LLM

* MCP

* Data source

* Aggregation

## 17. Metrics and observability

Metrics alone do not explain every failure.

```
Metrics → What is happening?
Traces  → Where did it happen?
Logs    → What happened in detail?
Evaluation → Was the AI behavior good?
Audit   → What governed action occurred?
```

For example:

```
Metric:
P95 workflow latency increased to 8 seconds.

Trace:
Worker → MCP → Enterprise API is the slow path.

Log:
Enterprise API timeout occurred.

Evaluation:
Workflow success rate decreased.

Audit:
Tool access was authorized.
```

Together, these provide a complete operational picture.

## 18. Metrics and evaluation

Operational metrics tell us whether the system is functioning.

AI-specific evaluation tells us whether the system is correct and useful.

|
Operational metric

|

AI-specific evaluation

|
| --- | --- |
|

Request success rate

|

Answer correctness

|
|

Worker execution time

|

Agent decision accuracy

|
|

Tool latency

|

Tool-selection accuracy

|
|

Queue depth

|

Workflow completion

|
|

LLM latency

|

Groundedness

|
|

Token consumption

|

Response relevance

|
|

Retrieval latency

|

Recall@K / Precision@K

|
|

Infrastructure availability

|

Business outcome success

|

### Example

```
Workflow success rate = 99%
Answer accuracy = 70%
```

The platform is reliable, but the AI quality is poor.

Another example:

```
Answer accuracy = 95%
Workflow success rate = 60%
```

The AI may be capable, but the execution architecture is unreliable.

## 19. Metrics and scalability

Metrics help CWD determine when to scale.

### Scaling signals

* Request volume

* Task throughput

* Queue depth

* Active Worker count

* Worker utilization

* P95/P99 latency

* LLM latency

* Tool latency

* Memory pressure

* CPU utilization

* Message age

* Cost per workflow

### Example

```
Queue depth increases
        ↓
Worker capacity is insufficient
        ↓
Autoscaling adds Worker instances
        ↓
Throughput increases
        ↓
Queue depth decreases
```

CPU alone is not enough. A Worker may be waiting on an LLM or API while CPU remains low.

## 20. Metrics and security

Security metrics help detect abnormal behavior.

Examples:

* Authentication failure rate

* Authorization denial rate

* Unauthorized tool attempts

* DLP violations

* Prompt-injection detections

* Cross-tenant access attempts

* Privilege-escalation attempts

* Secret-access failures

* Policy rejection rate

A security denial may be a successful security control, not an application failure.

## 21. Metrics and cost optimization

Metrics help identify unnecessary resource consumption.

```
High token consumption
        ↓
Large context
        ↓
Higher LLM cost
        ↓
Higher latency
```

Possible optimization:

* Reduce unnecessary context

* Improve retrieval filtering

* Use smaller models for simple tasks

* Reduce redundant LLM calls

* Cache appropriate results

* Avoid excessive retries

* Optimize Worker scaling

* Reduce unnecessary tool calls

* Improve prompt efficiency

Cost optimization should not reduce security, accuracy, or reliability.

## 22. Recommended CWD metrics architecture

```
CWD Services
    │
    ├── Gateway
    ├── Coordinator
    ├── Delegators
    ├── Workers
    ├── LLM
    ├── RAG
    ├── MCP
    └── Infrastructure
    │
    ▼
Metrics Instrumentation
    │
    ▼
OpenTelemetry / Azure Monitor
    │
    ├── Operational Metrics
    ├── AI Metrics
    ├── Cost Metrics
    ├── Security Metrics
    └── Business Metrics
    │
    ▼
Dashboards + Alerts + Evaluation
    │
    ▼
Capacity Planning + Troubleshooting + Optimization
```

## 23. Core formulas

### Operational metrics

Operational Metrics=Volume+Throughput+Latency+Error Rate+Availability+Queue Depth\text{Operational Metrics} = \text{Volume} + \text{Throughput} + \text{Latency} + \text{Error Rate} + \text{Availability} + \text{Queue Depth}Operational Metrics=Volume+Throughput+Latency+Error Rate+Availability+Queue Depth

### AI-specific metrics

AI Metrics=Agent Quality+LLM Latency+TTFT+Token Consumption+Tool Success+Retrieval Quality+Groundedness\text{AI Metrics} = \text{Agent Quality} + \text{LLM Latency} + \text{TTFT} + \text{Token Consumption} + \text{Tool Success} + \text{Retrieval Quality} + \text{Groundedness}AI Metrics=Agent Quality+LLM Latency+TTFT+Token Consumption+Tool Success+Retrieval Quality+Groundedness

### CWD performance

CWD Performance=Quality+Reliability+Latency+Throughput+Scalability+Cost Efficiency\text{CWD Performance} = \text{Quality} + \text{Reliability} + \text{Latency} + \text{Throughput} + \text{Scalability} + \text{Cost Efficiency}CWD Performance=Quality+Reliability+Latency+Throughput+Scalability+Cost Efficiency

### CWD success

CWD Success=Correct AI Behavior∧Reliable Execution∧Acceptable Latency∧Business Outcome Achieved\text{CWD Success} = \text{Correct AI Behavior} \land \text{Reliable Execution} \land \text{Acceptable Latency} \land \text{Business Outcome Achieved}CWD Success=Correct AI Behavior∧Reliable Execution∧Acceptable Latency∧Business Outcome Achieved

## Final definition

Operational and AI-specific metrics in CWD are the systematic measurements used to evaluate the platform’s traffic, throughput, reliability, latency, resource consumption, AI behavior, retrieval quality, tool execution, and business outcomes. Operational metrics measure request volume, throughput, error rate, agent execution time, queue depth, availability, and dependency performance. AI-specific metrics measure LLM latency, time to first token, token consumption, tool latency and success, retrieval performance, groundedness, accuracy, and cost. These metrics are correlated across Gateway, Coordinator, Delegator, Worker, LLM, MCP, RAG, messaging, and infrastructure components so CWD can identify bottlenecks, detect failures, scale capacity, control cost, and continuously improve quality and reliability.

### Interview-ready answer

> “In CWD, I measure both operational and AI-specific metrics because a multi-agent platform must be reliable, performant, cost-efficient, and correct. Operational metrics include request volume, throughput, error rate, agent execution time, queue depth, availability, and dependency latency. AI-specific metrics include LLM latency, time to first token, token consumption, tool latency and success, retrieval quality, groundedness, and cost. I measure these at Gateway, Coordinator, Delegator, Worker, workflow, and end-to-end levels, using correlation IDs to connect the execution. For example, if workflow latency increases, I break it down into queue wait, Worker execution, LLM, MCP, RAG, and aggregation latency. I also distinguish technical success from business success, because an HTTP 200 response does not guarantee a correct business outcome. Finally, I evaluate quality, reliability, latency, and cost together so that optimizing one metric does not damage the overall enterprise outcome.”

### Mental model

```
Operational Metrics
        +
AI-Specific Metrics
        +
Business Metrics
        ↓
CWD Performance Measurement
        ↓
Quality + Reliability + Latency + Cost
        ↓
Scaling + Troubleshooting + Optimization
```


### The most important distinction

CWD should not use one metric to represent the entire system. A production scorecard should keep these measurements separate:

|
Metric

|

What it tells you

|
| --- | --- |
|

Request volume

|

How much demand is arriving

|
|

Throughput

|

How much work is being completed

|
|

Error rate

|

How often operations fail

|
|

Agent execution time

|

How long an agent takes to process work

|
|

LLM latency

|

How long the model takes to respond

|
|

TTFT

|

How quickly streaming output begins

|
|

Token consumption

|

How much model context and output is used

|
|

Tool latency

|

How long enterprise capabilities take

|
|

Retrieval performance

|

How efficiently and accurately evidence is found

|
|

Queue depth

|

How much work is waiting

|
|

Success rate

|

How often operations complete successfully

|
|

Cost

|

How many resources are consumed

|

The final CWD objective is not “lowest latency” or “lowest cost.” It is:

> Achieve the required business quality and security with reliable execution, acceptable latency, and sustainable cost.
