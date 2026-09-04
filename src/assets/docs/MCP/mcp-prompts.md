# What Are MCP Prompts?

## Interview Question

**“What are MCP Prompts?”**

---

## 1. Strong Interview Answer

**MCP Prompts are reusable, structured prompt templates exposed by an MCP Server that help an AI application or agent perform a specific task consistently.**

Instead of hard-coding the same instructions inside every agent, we can define reusable prompts on an MCP Server.

For example, in our CWD enterprise assistant, we could expose prompts such as:

* `analyze_incident`
* `summarize_incident`
* `generate_root_cause_analysis`
* `create_incident_report`
* `troubleshoot_application_failure`

The MCP Client can discover these prompts and retrieve the appropriate prompt template when needed.

So, in simple terms:

> **MCP Tool = Do something**
> **MCP Resource = Give me information**
> **MCP Prompt = Tell the AI how to perform a task**

---

# 2. Why Do We Need MCP Prompts?

Without MCP Prompts, agents may have task instructions hard-coded into their application.

For example:

```text
You are an incident analysis agent.

Analyze the incident.
Review logs.
Identify possible root causes.
Provide evidence.
Recommend remediation.
```

If multiple applications need the same behavior, the prompt may be duplicated across multiple applications.

This creates:

* Prompt duplication
* Inconsistent behavior
* Difficult prompt maintenance
* Difficult version management
* Poor governance

MCP Prompts provide a standardized way to expose reusable prompt templates.

---

# 3. MCP Prompt Architecture

```text
                    User
                      |
                      v
              +---------------+
              |  AI Agent      |
              +---------------+
                      |
                      v
              +---------------+
              |   MCP Client   |
              +---------------+
                      |
                 MCP Protocol
                      |
                      v
              +----------------+
              |   MCP Server   |
              |                |
              | Prompt:         |
              | analyze_incident|
              +----------------+
                      |
                      v
              Prompt Template
                      |
                      v
                  LLM
```

The important point is that the **MCP Server owns and exposes the reusable prompt**, while the AI application uses it through the MCP protocol.

---

# 4. What Does an MCP Prompt Contain?

A prompt can contain:

### 1. Prompt Name

Example:

```text
analyze_incident
```

### 2. Description

Example:

```text
Analyze a CWD production incident and identify probable root cause.
```

### 3. Arguments

For example:

```text
incident_id
severity
application_name
```

### 4. Message Instructions

The prompt can provide structured instructions to the model.

Conceptually:

```text
Analyze incident {incident_id}.

Application:
{application_name}

Severity:
{severity}

Review the available incident information and logs.

Provide:

1. Incident summary
2. Probable root cause
3. Supporting evidence
4. Impact
5. Recommended remediation
```

---

# 5. CWD Enterprise Example

Suppose the user asks:

```text
Why did CWD application fail yesterday?
```

The Coordinator determines that this requires the **Incident Analysis Agent**.

```text
User
 |
 v
Coordinator
 |
 v
Incident Analysis Agent
 |
 v
MCP Client
 |
 +----> Incident MCP Server
 |
 +----> Knowledge MCP Server
```

The Incident MCP Server exposes a prompt:

```text
analyze_incident
```

The prompt could receive:

```text
incident_id = INC-12345
application = CWD
severity = P1
```

The resulting instructions could be:

```text
Analyze incident INC-12345 for the CWD application.

Use incident details, logs, deployment information,
and relevant knowledge articles.

Determine:

- What happened?
- What was the impact?
- What is the probable root cause?
- What evidence supports the conclusion?
- What remediation is recommended?
```

The agent then combines this prompt with information retrieved through MCP Resources and/or MCP Tools.

---

# 6. MCP Tools vs Resources vs Prompts

This is one of the most important interview comparisons.

| MCP Primitive | Purpose                       | Example                |
| ------------- | ----------------------------- | ---------------------- |
| **Tool**      | Perform an action             | `restart_service()`    |
| **Resource**  | Provide information/context   | `incident://INC-12345` |
| **Prompt**    | Provide reusable instructions | `analyze_incident`     |

### Easy memory trick

```text
Tool     → DO
Resource → READ
Prompt   → GUIDE
```

---

# 7. How They Work Together

This is where MCP becomes powerful.

Suppose the user asks:

```text
Analyze incident INC-12345 and recommend remediation.
```

The agent may use all three primitives.

### Step 1 — Prompt

Get the reusable analysis instructions:

```text
analyze_incident
```

### Step 2 — Resources

Retrieve context:

```text
incident://INC-12345
logs://CWD/INC-12345
deployment://CWD/latest
```

### Step 3 — Tools

Perform operations if required:

```text
search_related_incidents()
get_incident_metrics()
get_deployment_details()
```

Then the LLM reasons over the information.

```text
             MCP Prompt
                  |
                  v
          Analysis Instructions
                  |
                  +
                  |
        +---------+---------+
        |                   |
        v                   v
   MCP Resources       MCP Tools
   Context/Data        Actions/Data
        |                   |
        +---------+---------+
                  |
                  v
                 LLM
                  |
                  v
             Final Answer
```

---

# 8. Are MCP Prompts the Same as System Prompts?

**No.**

This is an important distinction.

A **system prompt** is generally an instruction configured by the application to establish the model's behavior.

An **MCP Prompt** is a reusable prompt template exposed through the MCP ecosystem by an MCP Server.

For example:

```text
System Prompt
    ↓
"You are a secure enterprise assistant."

MCP Prompt
    ↓
"Analyze this production incident using the following methodology..."
```

The MCP prompt is typically task-specific and reusable.

---

# 9. MCP Prompts vs Hard-Coded Prompts

### Without MCP

```text
Agent A
   |
   +-- Hard-coded incident prompt

Agent B
   |
   +-- Hard-coded incident prompt

Agent C
   |
   +-- Hard-coded incident prompt
```

This can result in duplication.

### With MCP

```text
              MCP Server
                  |
          +-------+-------+
          |               |
   analyze_incident   summarize_incident
          |
          |
     +----+----+
     |         |
  Agent A    Agent B
```

Now the prompt can be centrally managed and reused.

---

# 10. Enterprise Benefits

MCP Prompts can provide:

### Reusability

One prompt can be reused by multiple applications or agents.

### Consistency

Multiple agents can follow the same task methodology.

### Maintainability

Prompt changes can be managed centrally rather than modifying every application.

### Governance

Organizations can manage approved prompt templates.

### Versioning

Prompts can be versioned as business requirements change.

### Domain Standardization

For example, all incident-analysis agents can follow the organization's approved RCA methodology.

---

# 11. Important Security Consideration

MCP Prompts should not automatically be treated as trusted instructions.

In an enterprise architecture, we should consider:

```text
Prompt
  ↓
Validation
  ↓
Authorization
  ↓
Policy Check
  ↓
Agent / LLM
```

For example, an MCP server should not expose an unsafe prompt that instructs an agent to bypass authorization or execute unrestricted operations.

Prompts also should not be used as a replacement for actual security controls.

**Security must be enforced at the tool/API/data layer, not only through prompt instructions.**

---

# 12. MCP Prompt vs RAG

These are different concepts.

### RAG

RAG retrieves relevant information.

```text
Question
   ↓
Retriever
   ↓
Vector DB
   ↓
Relevant Documents
```

### MCP Prompt

MCP Prompt provides reusable instructions.

```text
Task
   ↓
MCP Prompt
   ↓
Structured Instructions
```

They can work together:

```text
MCP Prompt
    +
MCP Resources
    +
MCP Tools
    +
RAG
    ↓
LLM
    ↓
Answer
```

---

# 13. MCP Prompt Discovery

Conceptually, an MCP Client can discover available prompts from an MCP Server.

For example:

```text
prompts/list
```

The server may expose:

```text
analyze_incident
summarize_incident
generate_rca
create_incident_report
```

The client can then retrieve/use the appropriate prompt.

Conceptually:

```text
MCP Client
    |
    | prompts/list
    v
MCP Server
    |
    +--> analyze_incident
    +--> generate_rca
    +--> summarize_incident
```

---

# 14. Where Does the Agent Fit?

This distinction is especially important in an interview.

```text
+-----------------------+
|        Agent          |
|                       |
| Reasoning             |
| Planning              |
| Decision Making       |
| Tool Selection        |
+-----------+-----------+
            |
            v
+-----------------------+
|      MCP Client       |
|                       |
| Protocol Communication|
+-----------+-----------+
            |
            v
+-----------------------+
|      MCP Server       |
|                       |
| Tools                 |
| Resources             |
| Prompts               |
+-----------------------+
```

Therefore:

> **The agent is responsible for reasoning and decision-making, while the MCP Client handles protocol communication and the MCP Server exposes reusable enterprise capabilities.**

---

# 15. CWD End-to-End Example

User:

```text
Analyze why CWD payment service failed.
```

### Step 1 — Coordinator

The Coordinator identifies:

```text
Required capability = Incident Analysis
```

### Step 2 — Delegate

Coordinator delegates to:

```text
Incident Analysis Agent
```

### Step 3 — MCP Prompt

The agent accesses:

```text
analyze_incident
```

### Step 4 — MCP Resources

The agent retrieves:

```text
incident://INC-12345
logs://CWD/INC-12345
deployment://CWD/latest
```

### Step 5 — MCP Tools

The agent may invoke:

```text
search_related_incidents()
get_incident_metrics()
get_deployment_details()
```

### Step 6 — LLM Reasoning

The LLM combines:

```text
Instructions
     +
Incident Data
     +
Logs
     +
Deployment Information
     +
Historical Incidents
```

### Step 7 — Final Answer

The agent produces:

```text
Root Cause:
Recent configuration deployment caused database
connection failures.

Evidence:
- Error started immediately after deployment.
- Connection pool errors increased by 85%.
- Similar previous incidents had the same pattern.

Recommendation:
Rollback configuration and increase connection-pool capacity.
```

---

# 16. Strong Enterprise Architecture

```text
                       User
                         |
                         v
                  API / AI Gateway
                         |
                         v
                    Coordinator
                    (LangGraph)
                         |
                  A2A Communication
                         |
                         v
               Incident Analysis Agent
                         |
                         v
                    MCP Client
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
     MCP Server      MCP Server     MCP Server
     Incident        Knowledge      Monitoring
          |              |              |
          v              v              v
     Incident DB     Vector DB      Metrics/API
```

MCP Servers can expose:

```text
Tools:
- search_incidents()
- get_logs()

Resources:
- incident://...
- logs://...

Prompts:
- analyze_incident
- generate_rca
```

---

# 17. Interview Follow-Up Questions

### Q1. Are MCP Prompts executable?

**Answer:**

No. Prompts primarily provide reusable instructions/templates. Tools are the executable capabilities that perform operations.

---

### Q2. Can MCP Prompts access data?

**Answer:**

The prompt itself is primarily an instruction template. The agent can combine the prompt with data obtained through MCP Resources, MCP Tools, RAG, or other application mechanisms.

---

### Q3. Who hosts MCP Prompts?

**Answer:**

They are exposed by an MCP Server and consumed through an MCP Client.

---

### Q4. Can multiple agents use the same MCP Prompt?

**Answer:**

Yes. That's one of the main benefits—reusable and standardized task instructions.

---

### Q5. Are MCP Prompts mandatory?

**Answer:**

No. MCP supports different primitives, and an application can use tools, resources, prompts, or combinations of them depending on the use case.

---

# 18. One-Line Interview Answer

> **“MCP Prompts are reusable, structured prompt templates exposed by an MCP Server that provide standardized task-specific instructions to AI applications or agents.”**

---

# 19. Final Memory Trick

Remember the three MCP primitives as:

```text
MCP Tool
    ↓
DO something

MCP Resource
    ↓
READ information

MCP Prompt
    ↓
GUIDE the AI
```

And for your CWD architecture:

```text
A2A → Agent ↔ Agent

MCP → Agent ↔ Enterprise World

Tool → Action

Resource → Data

Prompt → Instructions
```

**Best interview statement:**

> **“In my CWD enterprise assistant, I use MCP as the integration layer. MCP Tools provide executable capabilities, MCP Resources provide enterprise context, and MCP Prompts provide reusable task-specific instructions. The agents use these capabilities through MCP Clients, while the MCP Servers encapsulate the underlying enterprise systems.”**
