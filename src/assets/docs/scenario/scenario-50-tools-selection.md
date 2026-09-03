# Your agent has access to 50 tools. Tool selection accuracy is poor. What would you do?

### 🎯 Strong Interview Answer

> **“I would not try to solve this only by improving the prompt. Fifty tools create a tool-selection problem. I would reduce the agent's decision space by organizing tools into domains, dynamically exposing only relevant tools, improving tool metadata and schemas, and introducing a capability-based routing layer. I would then measure tool-selection accuracy and continuously optimize based on traces.”**

---

## 1. Don't expose all 50 tools to one agent

This is the first thing I would change.

Instead of:

```text
Agent
 ├── Tool 1
 ├── Tool 2
 ├── ...
 └── Tool 50
```

I would create **domain-specific tool groups**:

```text
                    Coordinator
                         ↓
                 Capability Router
                         ↓
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      Knowledge       Analytics       Actions
          ↓              ↓              ↓
       10 tools        15 tools        10 tools
```

The agent now sees only the tools relevant to the task.

---

# 2. Use hierarchical tool selection

For example, the user asks:

> "Find historical CWD incidents."

Instead of selecting from 50 tools:

```text
50 tools
   ↓
Which tool?
```

I use:

```text
User Request
     ↓
Domain Classification
     ↓
Knowledge / Incident Analysis
     ↓
Retrieve relevant tools
     ↓
5 candidate tools
     ↓
Final tool selection
```

This dramatically reduces the search space.

---

# 3. Capability-based routing

I would maintain metadata for each tool:

```yaml
tool:
  name: search_incidents

capability:
  - incident_search

domain:
  - CWD

description:
  Search historical CWD incidents

input:
  incident_id: string
  date_range: string

access:
  read_only
```

Then the router first determines:

```text
Required capability:
incident_search
```

and retrieves only tools that provide that capability.

---

# 4. Improve tool descriptions and schemas

Poor tool description:

```text
search()
Searches data.
```

Better:

```text
search_incidents()

Purpose:
Search historical CWD incidents.

Use when:
- User asks about previous incidents
- User asks for incident history

Do NOT use when:
- User wants current system status
- User wants to create an incident

Required:
incident_id OR date_range
```

Clear descriptions reduce ambiguity between similar tools.

---

# 5. Avoid overlapping tools

Suppose I have:

```text
search_documents()
search_knowledge()
search_incidents()
search_logs()
search_records()
```

The LLM can easily confuse them.

I would establish clear boundaries:

```text
Documents → policies/manuals
Knowledge → semantic enterprise knowledge
Incidents → incident records
Logs → application/system logs
Records → structured business data
```

If two tools perform nearly the same function, I would consider **consolidating them** behind a single interface.

---

# 6. Use a tool router

A dedicated router can select candidate tools before the LLM executes anything.

```text
User
 ↓
Coordinator
 ↓
Tool/Capability Router
 ↓
Top-K candidate tools
 ↓
Agent
 ↓
Final tool selection
 ↓
Execution
```

For example:

```text
50 tools
 ↓
Router
 ↓
Top 5 relevant tools
 ↓
LLM
 ↓
Tool 3 selected
```

This is much better than asking the LLM to reason over all 50 every time.

---

# 7. Use semantic tool retrieval

For a large enterprise platform, I would store tool metadata in a searchable registry.

```text
Tool Registry
     ↓
Embedding / metadata search
     ↓
User intent
     ↓
Top-K tools
     ↓
Agent
```

For example:

```text
User:
"Show me database-related CWD failures."

Retrieved tools:

1. search_incidents
2. query_database_logs
3. analyze_failures
4. retrieve_cwd_documents
```

The agent doesn't need to consider the other 46 tools.

---

# 8. Add permissions to tool selection

Tool selection isn't only about relevance.

It is also about **authorization**.

```text
Candidate Tool
      ↓
Does user have access?
      ↓
Does agent have permission?
      ↓
Is environment allowed?
      ↓
Tool available?
```

For example:

```text
Production DB Write
       ↓
Action Agent?
       ↓
Permission denied
       ↓
Tool never exposed
```

I prefer filtering unauthorized tools **before** they reach the LLM.

---

# 9. Add guardrails before execution

Even if the LLM selects a tool, I would validate the selection.

```text
LLM selects:
delete_incident()

        ↓

Policy Check

Is delete allowed?
Is this the correct domain?
Are required parameters present?
Does agent have permission?

        ↓
   Execute / Reject
```

This provides a second layer of protection.

---

# 10. Measure tool-selection accuracy

I would create an evaluation dataset:

```text
User Query                     Expected Tool
------------------------------------------------
"Find CWD incidents"           search_incidents
"Show application logs"        search_logs
"Create a ticket"              create_ticket
"Find troubleshooting guide"   search_documents
```

Then measure:

```text
Tool Selection Accuracy
Top-1 Accuracy
Top-3 Accuracy
Wrong Tool Rate
Tool Failure Rate
Unnecessary Tool Calls
Average Tool Calls / Request
Latency
Cost
```

This turns tool selection into an **evaluatable engineering problem** rather than subjective prompt tuning.

---

# 11. Learn from production traces

Suppose traces show:

```text
search_documents
       ↓
wrong tool
       ↓
search_knowledge
       ↓
correct tool
```

I would investigate why the first tool was selected.

Maybe:

* descriptions overlap
* tool names are confusing
* router classification is wrong
* parameters aren't clear
* agent lacks domain context

Then I update the **registry, routing logic, schemas, or prompt**, rather than simply adding more instructions.

---

# 12. Enterprise architecture

```text
                         User
                           ↓
                    Coordinator Agent
                           ↓
                  Intent / Capability
                       Router
                           ↓
                  Agent/Tool Registry
                           ↓
                     Top-K Tools
                           ↓
                    Domain Agent
                           ↓
                  Policy / Guardrail
                           ↓
                    Tool Execution
                           ↓
                  Validate Result
                           ↓
                     Coordinator
                           ↓
                    Final Response
```

---

## CWD Example

Suppose CWD has 50 enterprise tools.

I wouldn't expose all 50 to the Coordinator.

I'd organize them:

```text
CWD Tool Registry
│
├── Knowledge
│   ├── search_documents
│   ├── search_policies
│   └── retrieve_manuals
│
├── Incident
│   ├── search_incidents
│   ├── incident_details
│   └── incident_history
│
├── Analytics
│   ├── run_sql
│   ├── analyze_failures
│   └── generate_statistics
│
└── Actions
    ├── create_ticket
    ├── update_ticket
    └── trigger_workflow
```

User:

> **"Show me similar historical incidents."**

Routing becomes:

```text
User
 ↓
Coordinator
 ↓
Capability = incident_search
 ↓
Incident Tool Group
 ↓
search_incidents
 ↓
Results
```

The agent never needs to reason about unrelated tools such as `create_ticket`, `trigger_workflow`, or `update_ticket`.

---

# ⭐ 45-Second Interview Answer

> **“If an agent has 50 tools and tool-selection accuracy is poor, I would reduce the decision space rather than simply making the prompt longer. I would organize tools by domain and capability, maintain a centralized tool registry with strong descriptions and schemas, and introduce a capability or semantic router that retrieves the top few relevant tools for the agent. I would also filter tools based on permissions before exposing them to the model and add policy validation before execution. Finally, I would build an evaluation dataset and monitor top-1/top-K tool-selection accuracy, wrong-tool rate, unnecessary calls, latency, and cost through distributed tracing. In my CWD architecture, this gives us hierarchical routing: Coordinator → capability/domain → specialized agent → relevant tools, instead of one agent choosing from all 50 tools.”**

### 🔥 Key line to remember

**“Don't make the LLM choose from 50 tools—reduce the choice to the 3–5 tools that are actually relevant.”**
