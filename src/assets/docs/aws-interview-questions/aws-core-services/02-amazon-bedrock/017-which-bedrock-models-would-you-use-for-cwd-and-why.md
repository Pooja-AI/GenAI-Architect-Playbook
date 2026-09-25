# Which Bedrock models would you use for CWD and why?

## Short answer

I would **not use one model for every CWD task**. I would use **model routing** based on task complexity, latency, cost, and required reasoning capability.

For example, I could use **Amazon Nova Micro/Lite** for simple tasks and **Claude Sonnet** for complex agent reasoning and final synthesis, subject to the models available and approved in the target AWS region.

## CWD model routing

```text
                    Worker
                      ↓
                Task Classifier
                      ↓
             Model Router
              ↙           ↘
       Simple task       Complex task
           ↓                  ↓
    Nova Micro/Lite      Claude Sonnet
           ↓                  ↓
      Bedrock Model        Bedrock Model
                      ↓
                   Result
```

## 1. Amazon Nova Micro

I would consider **Nova Micro** for lightweight tasks such as:

* Intent classification
* Simple routing decisions
* Query classification
* Simple extraction
* Short summarization

Why?

* Lower latency
* Lower cost
* Suitable for simpler workloads

Example:

```text
"Is this request about Sales or IT?"
             ↓
        Nova Micro
             ↓
          IT
```

---

## 2. Amazon Nova Lite

I would consider **Nova Lite** for tasks that are still relatively lightweight but need more capability, including some multimodal workloads.

Example:

```text
Document/Image
      ↓
Nova Lite
      ↓
Extract relevant information
```

It can be useful where we want a balance between capability, latency, and cost.

---

## 3. Claude Sonnet

I would use a **Claude Sonnet-class model** for more complex CWD reasoning tasks, depending on the approved Bedrock model/version.

For example:

* Complex customer briefing
* Multi-source synthesis
* Tool-use reasoning
* Long-context analysis
* Complex summarization
* Final response generation

Example:

```text
Salesforce data
       +
ServiceNow incidents
       +
Knowledge documents
       ↓
   Claude Sonnet
       ↓
Customer briefing
```

This is where the model needs to reason over multiple pieces of evidence rather than simply classify a request.

---

# Example CWD routing

Suppose the user asks:

> "Give me a customer briefing for ABC."

The flow could be:

```text
User
 ↓
Coordinator
 ↓
Task Classifier
 ↓
Is this simple or complex?
       ↓
 ┌─────┴─────┐
 ↓           ↓
Simple      Complex
 ↓           ↓
Nova       Claude
 ↓           ↓
Coordinator / Workers
```

The Workers then retrieve the actual information:

```text
Sales Worker
     ↓
Salesforce via MCP

Service Worker
     ↓
ServiceNow via MCP

Knowledge Worker
     ↓
OpenSearch Serverless
```

Then the complex model can synthesize the authorized results.

---

# Why not use the largest model everywhere?

Because it increases:

* Cost
* Latency
* Token consumption
* Capacity pressure

For example:

```text
Simple classification
       ↓
Small model
       ↓
Fast + inexpensive

Complex reasoning
       ↓
Larger model
       ↓
Higher capability
```

So I would optimize for **quality + latency + cost**, rather than automatically selecting the biggest model.

---

# Important: don't let the LLM choose blindly

I would have a **model-routing policy**.

```text
Request
  ↓
Task Classifier
  ↓
Task complexity
  ↓
Policy
 ├── Simple → Small model
 ├── Medium → Mid-tier model
 └── Complex → High-capability model
```

The policy can consider:

* Task type
* Number of tools
* Context size
* Reasoning requirement
* Latency SLA
* Cost budget
* Model availability
* Historical evaluation results

And I would validate routing decisions using an evaluation dataset rather than assuming the larger model is always better.

---

# 🎯 Strong interview answer

> **“I wouldn't use a single Bedrock model for all CWD workloads. I would use model routing. For lightweight tasks such as intent classification, routing, and simple extraction, I could use a lower-cost model such as Amazon Nova Micro or Nova Lite. For complex multi-source reasoning, customer briefing, tool-use reasoning, and final synthesis, I would consider a Claude Sonnet-class model available through Bedrock. The routing decision would be based on task complexity, latency, cost, context size, and evaluation results. This gives us a balance between quality, performance, and cost.”**

## Easy memory trick

**Simple → Small model**

**Complex → Capable model**

**Router → Decides**

**Bedrock → Provides the models**

### Key distinction

> **Model Router decides *which model to use*. Bedrock provides the managed access to those models. LangGraph decides *which agent/workflow step should execute*.**
