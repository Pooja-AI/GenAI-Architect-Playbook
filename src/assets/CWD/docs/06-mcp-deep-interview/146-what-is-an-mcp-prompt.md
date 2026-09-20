## What is an MCP Prompt?

An **MCP Prompt** is a **reusable prompt template exposed by an MCP Server** that helps an AI application perform a particular task in a consistent way.

The easiest way to remember:

> **MCP Tool = Do something**
> **MCP Resource = Read something**
> **MCP Prompt = Guide the AI on how to do something**

### In your CWD architecture

Suppose your CWD system frequently performs a **Customer Briefing**.

An MCP Server could expose a prompt such as:

```text
customer_briefing
```

The prompt could provide a standardized structure:

```text
Analyze the customer information.

Include:
1. Customer profile
2. Open opportunities
3. Recent incidents
4. Business risks
5. Recommended follow-up actions
```

The Worker can retrieve/use that prompt instead of having every Worker hard-code the same instructions.

---

### Tool vs Resource vs Prompt

| MCP Concept  | Purpose                                | CWD Example         |
| ------------ | -------------------------------------- | ------------------- |
| **Tool**     | Perform an action                      | `create_incident()` |
| **Resource** | Provide data/context                   | `customer://C123`   |
| **Prompt**   | Provide reusable instructions/template | `customer_briefing` |

Think of it like this:

```text
                 MCP Server
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Tool       Resource      Prompt
        │           │           │
     "Do it"     "Read it"   "Guide me"
        │           │           │
   create_ticket customer     briefing
                  data        template
```

### Example in CWD

For a customer briefing:

```text
1. MCP Resource
   ↓
   Read customer information

2. MCP Resource
   ↓
   Read incidents/opportunities

3. MCP Prompt
   ↓
   Apply the standard Customer Briefing instructions

4. MCP Tool
   ↓
   Retrieve additional information or perform an action
```

So the overall flow could be:

```text
Worker
  │
  ├── Resource → Customer data
  │
  ├── Prompt   → Customer briefing template
  │
  └── Tool     → Salesforce / ServiceNow operation
```

### Why use MCP Prompts?

They are useful when you want **consistent, reusable task instructions** across applications or agents.

For example, instead of having this hard-coded separately in multiple Workers:

```python
prompt = """
Create a customer briefing.
Include profile, opportunities,
incidents and risks.
"""
```

you can expose a standardized prompt through the MCP ecosystem.

This can help with:

* **Prompt reuse**
* **Consistency**
* **Centralized prompt management**
* **Versioning**
* **Separating prompt templates from application code**

### Important interview distinction

Don't say an MCP Prompt is the same as an LLM system prompt.

An **MCP Prompt is a standardized, discoverable prompt template/capability exposed through an MCP server**. Your application can retrieve/use it as part of an AI workflow.

### 🎯 Strong interview answer

> **"An MCP Prompt is a reusable prompt template exposed through an MCP Server. It provides standardized instructions for a particular AI task. In our CWD architecture, we could use an MCP Prompt for tasks such as Customer Briefing so that different Workers follow a consistent structure and instruction set. MCP Tools perform actions, MCP Resources provide context, and MCP Prompts provide reusable instructions."**

### Memory trick

> **Tool → Action** 🔧
> **Resource → Context** 📄
> **Prompt → Instructions** 🧠
