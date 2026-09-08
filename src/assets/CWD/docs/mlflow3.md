## MLflow’s role in CWD

MLflow provides the experiment, evaluation, and model-lifecycle evidence layer for CWD. It helps teams record what they tried, measure what happened, compare alternatives, and identify which model or AI configuration should move toward production. Its traditional ML capabilities include experiment tracking, model evaluation, and a Model Registry; its LLM and agent capabilities extend into tracing, evaluation, and prompt management.

![](https://www.google.com/s2/favicons?domain=https://www.mlflow.org\&sz=32)

MLflow AI Platform+1

The key distinction is:

> CWD executes and orchestrates AI workflows. MLflow records, evaluates, and compares their behavior.

MLflow does not replace LangGraph, Agent Registry, Policy/IAM, Service Bus, Redis, Cosmos DB, or Azure Monitor. It complements them.


## 1. Why MLflow is important in CWD

A CWD request may involve multiple agents, prompts, models, retrieval operations, and tools. Without experiment tracking, it becomes difficult to answer:

* Which model and prompt produced this result?

* What parameters and dataset were used?

* Why did one experiment outperform another?

* Did a new prompt improve quality but increase latency?

* Which model version is approved for production?

* Can we reproduce the result?

* Did a change introduce a regression?

MLflow provides a structured way to capture this evidence. Its Tracking system organizes work into experiments and runs, while the Model Registry provides versioning, lineage, aliases, and lifecycle metadata.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform+1

# 2. MLflow in the broader CWD architecture

```
                         USER
                           │
                           ▼
                    API / Gateway
                           │
                           ▼
                    CWD Coordinator
                           │
                           ▼
                    CWD Delegator
                           │
                           ▼
                     CWD Worker
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          RAG           LLM           MCP Tool
             │             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                    Workflow Result
                           │
                           ▼
                    CWD Observability
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        OpenTelemetry   MLflow        Audit Store
             │             │             │
             ▼             ▼             ▼
       Azure Monitor   Experiments   Governance
                       Evaluation
                       Registry
                       Artifacts
```

### Responsibility separation

|
Component

|

Primary responsibility

|
| --- | --- |
|

CWD Coordinator

|

Enterprise orchestration and routing

|
|

LangGraph

|

Workflow state, transitions, checkpoints, recovery

|
|

Agent Registry

|

Agent discovery and capability metadata

|
|

Prompt Registry

|

Governed prompt versions

|
|

MLflow

|

Experiment tracking, evaluation, model lineage, comparison

|
|

OpenTelemetry / Azure Monitor

|

Runtime traces, logs, metrics, alerts

|
|

Cosmos DB

|

Durable application and execution state

|
|

Redis

|

Fast working state and caching

|
|

Service Bus

|

Durable asynchronous task delivery

|
|

Audit Store

|

Governed evidence of significant actions

|

MLflow is therefore part of the broader LLMOps and MLOps control plane, not the CWD execution engine.

# 3. Experiment tracking

An experiment groups related runs for a particular objective.

For example:

```
Experiment:
shipment-delay-analysis
```

Possible runs:

```
RUN-001 → GPT model + Prompt v1
RUN-002 → GPT model + Prompt v2
RUN-003 → Claude model + Prompt v2
RUN-004 → Smaller model + Prompt v2
```

Each run represents one execution of the experiment. MLflow Tracking records metadata such as parameters, metrics, timestamps, and artifacts, and provides UI/API capabilities for exploring and comparing runs.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform+1

### CWD experiment examples

|
Experiment

|

Objective

|
| --- | --- |
|

`shipment-delay-analysis`

|

Compare prompts and models for delay analysis

|
|

`rag-retrieval-quality`

|

Compare chunking and retrieval strategies

|
|

`agent-routing-evaluation`

|

Evaluate Coordinator routing decisions

|
|

`tool-selection-evaluation`

|

Measure correct tool selection and arguments

|
|

`workflow-latency-optimization`

|

Compare orchestration configurations

|
|

`credit-risk-model`

|

Compare traditional ML models

|

# 4. What is a run?

A run is one execution of an experiment.

For a traditional ML model:

```
RUN-001
    │
    ├── Dataset version
    ├── Algorithm
    ├── Hyperparameters
    ├── Training metrics
    ├── Evaluation metrics
    ├── Model artifact
    └── Result
```

For a CWD AI experiment:

```
RUN-001
    │
    ├── User test case
    ├── Agent version
    ├── Prompt version
    ├── Model version
    ├── RAG configuration
    ├── Tool configuration
    ├── Workflow configuration
    ├── Quality metrics
    ├── Latency metrics
    ├── Cost metrics
    ├── Evaluation results
    └── Trace / artifact references
```

This creates a reproducible record of what configuration produced what outcome.

# 5. Parameters

Parameters are the configuration values used during an experiment.

For traditional ML:

Python

Run

```
params = {
    "algorithm": "xgboost",
    "learning_rate": 0.05,
    "max_depth": 6,
    "n_estimators": 200,
    "train_dataset_version": "v3"
}
```

For CWD and LLMOps:

Python

Run

```
params = {
    "agent_name": "shipping-agent",
    "agent_version": "2.4.1",
    "prompt_id": "shipment-delay-analysis",
    "prompt_version": "2.2.0",
    "model": "approved-model-v4",
    "temperature": 0.1,
    "retrieval_mode": "hybrid",
    "top_k": 5,
    "chunk_size": 600,
    "reranking_enabled": True,
    "max_tool_calls": 4,
    "max_retries": 2
}
```

Parameters answer:

> What configuration did we use?

They are especially useful for comparing prompt, model, retrieval, and workflow changes.

# 6. Metrics

Metrics are numerical measurements of experiment performance.

### Traditional ML metrics

|
Problem

|

Example metrics

|
| --- | --- |
|

Classification

|

Accuracy, precision, recall, F1, ROC-AUC

|
|

Regression

|

MAE, RMSE, R²

|
|

Ranking

|

NDCG, MRR

|
|

Clustering

|

Silhouette score

|

### CWD / LLMOps metrics

|
Dimension

|

Example metrics

|
| --- | --- |
|

Agent quality

|

Intent accuracy, routing accuracy

|
|

Workflow quality

|

Task success, goal completion

|
|

Tool execution

|

Tool-selection accuracy, invocation success

|
|

RAG

|

Recall@K, Precision@K, groundedness

|
|

Generation

|

Correctness, relevance, completeness

|
|

Reliability

|

Success rate, timeout rate, retry recovery

|
|

Latency

|

P50, P95, P99

|
|

Cost

|

Cost per run, cost per successful workflow

|
|

Safety

|

Policy violations, unsafe outputs

|
|

Consistency

|

Stable decisions across repeated runs

|

MLflow evaluation supports built-in and custom evaluation metrics, including domain-specific evaluation criteria.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform+1

Example:

Python

Run

```
metrics = {
    "intent_accuracy": 0.98,
    "routing_accuracy": 0.95,
    "tool_selection_accuracy": 0.97,
    "groundedness": 0.91,
    "workflow_success_rate": 0.94,
    "p95_latency_ms": 4200,
    "cost_per_successful_workflow": 0.08
}
```

# 7. Artifacts

Artifacts are files or other outputs produced by a run.

MLflow Tracking supports storing artifacts such as model files, images, and data files alongside run metadata.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform

### Traditional ML artifacts

```
artifacts/
├── model.pkl
├── confusion_matrix.png
├── feature_importance.png
├── evaluation_report.json
├── predictions.parquet
└── requirements.txt
```

### CWD / LLMOps artifacts

```
artifacts/
├── evaluation_results.json
├── golden_dataset_version.json
├── retrieval_evaluation.json
├── prompt_comparison.json
├── tool_selection_report.json
├── workflow_trace_reference.json
├── latency_breakdown.json
├── cost_report.json
├── safety_evaluation.json
└── model_or_agent_package/
```

For sensitive enterprise data, store references, sanitized outputs, hashes, and metadata rather than unrestricted raw prompts, confidential documents, credentials, or full tool responses.

# 8. Evaluation results

MLflow can organize evaluation results so teams can compare the behavior of different models, prompts, and AI applications.

For example:

```
Experiment: shipment-delay-analysis
```

|
Run

|

Model

|

Prompt

|

Groundedness

|

P95 latency

|

Cost

|
| --- | --- | --- | --- | --- | --- |
|

RUN-001

|

Model A

|

v1

|

0.86

|

3,200 ms

|

$0.05

|
|

RUN-002

|

Model A

|

v2

|

0.93

|

3,600 ms

|

$0.06

|
|

RUN-003

|

Model B

|

v2

|

0.95

|

4,100 ms

|

$0.09

|

This allows the team to ask:

> Did Prompt v2 improve groundedness, and was the additional latency acceptable?

MLflow’s evaluation framework supports analyzing LLM and agent outputs with built-in and custom evaluation criteria.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform

# 9. Comparing AI and ML experiments

Comparison is one of MLflow’s most valuable capabilities.

### Traditional ML comparison

```
Experiment: credit-risk-model
    │
    ├── Logistic Regression
    ├── Random Forest
    ├── XGBoost
    └── Neural Network
```

Compare:

```
Accuracy
F1
ROC-AUC
Training time
Inference latency
Model size
Cost
```

### CWD AI comparison

```
Experiment: enterprise-knowledge-qa
    │
    ├── Prompt v1 + Model A
    ├── Prompt v2 + Model A
    ├── Prompt v2 + Model B
    ├── Hybrid RAG + Model A
    └── Vector-only RAG + Model A
```

Compare:

```
Answer correctness
Groundedness
Citation accuracy
Tool success
Workflow success
P95 latency
Token usage
Cost
Safety
```

MLflow Tracking provides run comparison and metric visualization through its UI.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform

# 10. Model lifecycle visibility

The Model Registry provides centralized lifecycle visibility for registered models.

It supports model versioning, lineage to the producing run, aliases, tags, descriptions, and lifecycle management.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform

```
Training / Experiment
        ↓
MLflow Run
        ↓
Logged Model
        ↓
Model Registry
        ↓
Validation
        ↓
Approved Version
        ↓
Deployment
        ↓
Monitoring
        ↓
Rollback / Promotion
```

Example:

```
Model: credit-risk-model
    │
    ├── Version 1 → Experimental
    ├── Version 2 → Validation
    ├── Version 3 → Approved
    └── Version 4 → Candidate
```

For CWD, this can be extended to model dependencies used by agents:

```
Agent
   ├── Prompt Version
   ├── LLM Model Version
   ├── Embedding Model Version
   ├── Reranker Version
   ├── Agent Version
   └── Evaluation Dataset Version
```

Important: MLflow Model Registry manages model lifecycle. The CWD Agent Registry manages agent identity, capabilities, endpoints, and operational routing metadata. They are complementary.

# 11. MLflow and prompt lifecycle

In LLMOps, prompts are production artifacts.

A useful experiment might compare:

```
Prompt: shipment-delay-analysis
    ├── v1.0.0
    ├── v1.1.0
    └── v2.0.0
```

Each version can be evaluated against the same golden dataset.

```
Prompt v1 → Evaluation → Metrics
Prompt v2 → Evaluation → Metrics
Prompt v3 → Evaluation → Metrics
```

This helps determine whether a prompt change improves:

* Correctness

* Groundedness

* Tool selection

* Safety

* Consistency

* Latency

* Cost.

MLflow’s current LLM/agent platform includes prompt management alongside tracing and evaluation capabilities.

![](https://www.google.com/s2/favicons?domain=https://www.mlflow.org\&sz=32)

MLflow AI Platform+1

# 12. MLflow and CWD observability

CWD observability answers:

> What happened during production execution?

MLflow experiment tracking and evaluation answer:

> How good was that execution, and which configuration produced it?

|
Capability

|

CWD observability

|

MLflow

|
| --- | --- | --- |
|

Runtime trace

|

OpenTelemetry / Azure Monitor

|

LLM/agent tracing capabilities

|
|

Request correlation

|

Correlation ID

|

Run/trace references

|
|

Step latency

|

Runtime telemetry

|

Evaluation and trace analysis

|
|

Parameters

|

Runtime configuration

|

Experiment parameters

|
|

Metrics

|

Operational metrics

|

Experiment/evaluation metrics

|
|

Artifacts

|

Result references

|

Artifact storage

|
|

Model lineage

|

Runtime model version

|

Model Registry

|
|

Prompt comparison

|

Runtime prompt version

|

Prompt/evaluation tracking

|
|

Quality evaluation

|

Production quality signals

|

Evaluation framework

|
|

Alerts

|

Azure Monitor / alerting

|

Evaluation and monitoring workflows

|

MLflow’s LLMOps guidance includes tracing, evaluation, prompt management, and production monitoring for LLM applications and multi-step agents.

![](https://www.google.com/s2/favicons?domain=https://www.mlflow.org\&sz=32)

MLflow AI Platform

# 13. MLflow and LangGraph

LangGraph controls the workflow:

```
START
  ↓
Intent
  ↓
Planning
  ↓
Delegation
  ↓
Retrieval
  ↓
Tool Execution
  ↓
Validation
  ↓
Response
```

MLflow can record the experiment and evaluation evidence associated with that workflow.

```
LangGraph Step
      ↓
MLflow Run / Trace
      ↓
Parameters + Metrics + Artifacts
      ↓
Evaluation
      ↓
Comparison
```

### Separation

```
LangGraph = What happens next?
MLflow    = How did it perform?
```

For example:

```
LangGraph:
"Retry retrieval because evidence was insufficient."

MLflow:
"Retrieval sufficiency score = 0.62.
Retry increased latency by 800 ms."
```

MLflow does not replace LangGraph’s workflow state or checkpointing.

# 14. MLflow and the CWD evaluation lifecycle

```
Business Objective
       ↓
Golden Dataset
       ↓
Experiment Definition
       ↓
Run with CWD
       ↓
Log Parameters
       ↓
Log Metrics
       ↓
Log Artifacts
       ↓
Evaluate Results
       ↓
Compare Runs
       ↓
Model / Prompt / Agent Decision
       ↓
Validation Gate
       ↓
Promotion / Deployment
       ↓
Production Monitoring
       ↓
Regression Evaluation
```

This creates a continuous improvement loop:

```
Measure → Evaluate → Compare → Improve → Validate → Deploy → Monitor
```

# 15. Example: evaluating a CWD RAG Worker

Suppose a RAG Worker must answer:

> “Why is shipment SHIP123 delayed?”

### Experiment configuration

Python

Run

```
experiment = {
    "name": "shipment-delay-rag-evaluation",
    "agent": "shipping-rag-worker",
    "prompt_version": "2.2.0",
    "model": "approved-model-v4",
    "retrieval_mode": "hybrid",
    "top_k": 5,
    "chunk_size": 600
}
```

### Logged parameters

Python

Run

```
mlflow.log_params({
    "agent_version": "2.4.1",
    "prompt_version": "2.2.0",
    "retrieval_mode": "hybrid",
    "top_k": 5,
    "chunk_size": 600
})
```

### Logged metrics

Python

Run

```
mlflow.log_metrics({
    "retrieval_recall_at_5": 0.92,
    "context_relevance": 0.94,
    "groundedness": 0.93,
    "citation_accuracy": 0.96,
    "p95_latency_ms": 3800,
    "workflow_success_rate": 0.95
})
```

### Logged artifacts

Python

Run

```
mlflow.log_dict(
    evaluation_results,
    "artifacts/evaluation_results.json"
)

mlflow.log_dict(
    retrieval_report,
    "artifacts/retrieval_report.json"
)
```

The experiment can then be compared against another configuration:

```
Hybrid Search + Prompt v2
          vs
Vector Search + Prompt v1
```

The winning configuration should be selected using quality, security, reliability, latency, and cost, not just one metric.

# 16. Example: tracking a traditional ML model in CWD

For a credit-risk Worker:

Python

Run

```
import mlflow
import mlflow.sklearn

mlflow.set_experiment("credit-risk-model")

with mlflow.start_run() as run:
    mlflow.log_params({
        "algorithm": "random_forest",
        "n_estimators": 200,
        "max_depth": 8
    })

    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)

    mlflow.log_metric("accuracy", accuracy)

    mlflow.sklearn.log_model(
        model,
        name="credit-risk-model"
    )

    print("Run ID:", run.info.run_id)
```

The resulting run can be compared with Logistic Regression or XGBoost experiments.

For current MLflow APIs, use the installed version’s documentation because model logging and registry APIs evolve.

# 17. Example: tracking an LLM experiment in CWD

A simplified conceptual example:

Python

Run

```
import mlflow

mlflow.set_experiment("shipment-delay-analysis")

with mlflow.start_run() as run:

    mlflow.log_params({
        "agent": "shipping-agent",
        "prompt_version": "2.2.0",
        "model": "approved-model-v4",
        "temperature": 0.1,
        "retrieval_mode": "hybrid",
        "top_k": 5
    })

    result = run_cwd_workflow(
        user_request="Why is shipment SHIP123 delayed?"
    )

    mlflow.log_metrics({
        "groundedness": result["groundedness"],
        "tool_success": result["tool_success"],
        "latency_ms": result["latency_ms"],
        "cost_usd": result["cost_usd"]
    })

    mlflow.log_dict(
        result["evaluation"],
        "artifacts/evaluation.json"
    )

    print("Run ID:", run.info.run_id)
```

The `run_cwd_workflow()` function represents your existing Coordinator → Delegator → Worker execution. MLflow records the experiment evidence; it does not replace that workflow.

# 18. Model lifecycle visibility in production

A production CWD platform should know:

```
Which model is deployed?
Which version?
Which agent uses it?
Which prompt version?
Which evaluation dataset?
Which approval?
Which deployment?
Which rollback target?
```

A useful lineage chain is:

```
Golden Dataset v3
       ↓
Experiment RUN-104
       ↓
Prompt v2.2.0
       ↓
Model Version 7
       ↓
Evaluation Passed
       ↓
Approved
       ↓
Agent Version 2.4.1
       ↓
Production Deployment
       ↓
Workflow Results
```

MLflow Model Registry provides model-version lineage and lifecycle metadata; CWD and deployment systems should connect that information to agent and workflow versions.

![](https://www.google.com/s2/favicons?domain=https://mlflow.org\&sz=32)

MLflow AI Platform

# 19. MLflow and production regression evaluation

Suppose a new model is deployed:

```
Model v1 → Groundedness 0.93
Model v2 → Groundedness 0.84
```

Even if the new model is faster:

```
Model v1 → P95 = 4.2 s
Model v2 → P95 = 2.8 s
```

CWD should not automatically promote it.

A release decision may require:

```
Security PASS
       AND
Groundedness ≥ Threshold
       AND
Workflow Success ≥ SLA
       AND
P95 Latency ≤ Budget
       AND
Cost ≤ Budget
```

This is where MLflow evaluation results become part of the broader CWD release gate.

# 20. MLflow and AgentOps

For multi-agent systems, MLflow can support evaluation of:

```
Coordinator
   ├── Intent classification
   ├── Routing
   └── Planning

Delegator
   ├── Decomposition
   ├── Worker selection
   └── Aggregation

Worker
   ├── Tool selection
   ├── RAG
   ├── Business logic
   └── Output validation
```

Each can be evaluated independently and as part of the complete workflow.

MLflow’s current platform documentation explicitly includes agent and LLM tracing, evaluation, and optimization capabilities, including examples involving LangGraph agents and multi-turn applications.

![](https://www.google.com/s2/favicons?domain=https://www.mlflow.org\&sz=32)

MLflow AI Platform+1

# 21. What MLflow should not replace

|
CWD component

|

Why MLflow does not replace it

|
| --- | --- |
|

LangGraph

|

Controls execution state and workflow transitions

|
|

Agent Registry

|

Discovers and routes to eligible agents

|
|

Prompt Registry

|

Governs prompt lifecycle and deployment

|
|

Policy / IAM

|

Enforces authorization

|
|

Service Bus

|

Delivers durable asynchronous tasks

|
|

Redis

|

Provides low-latency working state

|
|

Cosmos DB

|

Stores durable application/execution state

|
|

Azure AI Search

|

Performs enterprise retrieval

|
|

MCP

|

Provides standardized tool/system integration

|
|

A2A

|

Enables agent-to-agent communication

|
|

Azure Monitor

|

Provides runtime infrastructure and operational monitoring

|
|

Audit Store

|

Maintains governed audit evidence

|

The correct architecture is integration, not substitution.

# 22. MLflow in the CWD observability strategy

A useful mental model is:

```
CWD Runtime
   │
   ├── Logs / Metrics / Traces
   │       └── OpenTelemetry / Azure Monitor
   │
   ├── Experiment Evidence
   │       └── MLflow Tracking
   │
   ├── Model Lifecycle
   │       └── MLflow Model Registry
   │
   ├── Prompt Lifecycle
   │       └── Prompt Registry
   │
   ├── Durable Execution State
   │       └── Cosmos DB
   │
   └── Audit Evidence
           └── Audit Store
```

### The key distinction

```
Observability = What happened?
Evaluation    = Was it good enough?
MLflow        = What configuration produced it, and how do alternatives compare?
Audit         = What governed action occurred?
```

# 23. Core formulas

### Experiment tracking

Experiment=Collection of Related Runs\text{Experiment} = \text{Collection of Related Runs}Experiment=Collection of Related Runs

Run=Configuration+Execution+Metrics+Artifacts\text{Run} = \text{Configuration} + \text{Execution} + \text{Metrics} + \text{Artifacts}Run=Configuration+Execution+Metrics+Artifacts

### Evaluation

Evaluation Result=Actual Output+Expected Behavior+Evaluation Metrics\text{Evaluation Result} = \text{Actual Output} + \text{Expected Behavior} + \text{Evaluation Metrics}Evaluation Result=Actual Output+Expected Behavior+Evaluation Metrics

### Model lifecycle

Model Lifecycle=Training+Tracking+Evaluation+Versioning+Approval+Deployment+Monitoring+Rollback\text{Model Lifecycle} = \text{Training} + \text{Tracking} + \text{Evaluation} + \text{Versioning} + \text{Approval} + \text{Deployment} + \text{Monitoring} + \text{Rollback}Model Lifecycle=Training+Tracking+Evaluation+Versioning+Approval+Deployment+Monitoring+Rollback

### CWD + MLflow

CWD LLMOps=Workflow Execution+Observability+Experiment Tracking+Evaluation+Model Lifecycle+Prompt Governance+Continuous Improvement\text{CWD LLMOps} = \text{Workflow Execution} + \text{Observability} + \text{Experiment Tracking} + \text{Evaluation} + \text{Model Lifecycle} + \text{Prompt Governance} + \text{Continuous Improvement}CWD LLMOps=Workflow Execution+Observability+Experiment Tracking+Evaluation+Model Lifecycle+Prompt Governance+Continuous Improvement

## Interview-ready answer

> “In CWD, MLflow supports the experiment and evaluation layer of the broader MLOps and LLMOps strategy. It records experiments and runs, including parameters such as model, prompt version, retrieval configuration, and agent version; metrics such as accuracy, groundedness, tool success, workflow success, latency, and cost; and artifacts such as evaluation reports, model files, retrieval results, and sanitized trace references. This allows us to compare different models, prompts, RAG strategies, and agent configurations using the same golden datasets. MLflow’s Model Registry provides model versioning, lineage, lifecycle visibility, and controlled promotion. In the CWD architecture, LangGraph still manages workflow execution, Agent Registry manages agent discovery, Policy/IAM manages authorization, Service Bus manages messaging, and Azure Monitor provides runtime observability. MLflow complements these components by answering which configuration produced the result, how well it performed, and whether it should be promoted or rolled back.”

### Core definition

MLflow in CWD is the experiment-tracking, evaluation, artifact-management, and model-lifecycle capability that records the configurations and outcomes of AI, ML, RAG, and multi-agent experiments, enables comparison across models, prompts, agents, and workflows, preserves lineage and reproducibility, and provides evidence for governed promotion, regression detection, and continuous improvement within the broader MLOps and LLMOps strategy.

### Mental model

```
CWD executes
   ↓
Observability measures
   ↓
MLflow records and compares
   ↓
Evaluation determines quality
   ↓
Registry manages lifecycle
   ↓
Governance decides promotion
   ↓
CWD deploys and monitors
```

One sentence: MLflow helps CWD move from “the agent produced an answer” to “we know exactly which configuration produced it, how well it performed, what it cost, and whether it is ready for production.”
