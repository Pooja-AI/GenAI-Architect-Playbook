## What is an MCP Resource?

An **MCP Resource** is **readable context or data exposed by an MCP Server** that an AI application can access.

The easiest way to remember:

> **MCP Tool = perform an action**
> **MCP Resource = access information/context**

### In your CWD architecture

```text
                    MCP Server
                   /           \
                  /             \
            MCP Tools        MCP Resources
               │                  │
          Perform action       Read data
               │                  │
        Salesforce API       Customer data
        Create ticket        Documents
        Update record        Policies
        Search records       Knowledge
```

### Example

Suppose your Worker needs information about customer `C123`.

A **Resource** could expose customer information:

```text
Resource:
customer://C123
```

The Worker can read that resource:

```text
Worker
   ↓
MCP Client
   ↓
MCP Resource
   ↓
customer://C123
   ↓
Customer information
```

The resource is primarily **data/context**, rather than an operation that changes something.

---

## Tool vs Resource

This distinction is very important for interviews.

| MCP Tool                     | MCP Resource                            |
| ---------------------------- | --------------------------------------- |
| Performs an action           | Provides information                    |
| Usually invoked              | Usually read/accessed                   |
| Has input arguments          | Identified by a URI/resource identifier |
| Can change enterprise state  | Generally represents read-only context  |
| Example: `create_ticket()`   | Example: `customer://C123`              |
| Example: `update_customer()` | Example: `policy://security-policy`     |

### CWD example

Imagine the Worker needs to create an IT ticket.

**Resource:**

```text
customer://C123
```

provides customer information.

**Tool:**

```text
create_incident(
    customer_id="C123",
    description="Network issue"
)
```

performs the actual operation.

So:

```text
Worker
  │
  ├── READ → MCP Resource → Customer information
  │
  └── ACTION → MCP Tool → Create ServiceNow incident
```

### Another enterprise example

Your MCP Server could expose resources such as:

```text
customer://C123
policy://data-retention
document://sales/customer-briefing-template
schema://customer
```

The Worker can use these as **context for reasoning**.

For example:

```text
Worker
   ↓
Read customer resource
   ↓
Read company policy resource
   ↓
Reason about request
   ↓
Call MCP Tool
   ↓
Create/update enterprise record
```

### Resource vs Tool vs Prompt

You may get this as an interview follow-up:

```text
MCP Tool
    → "Do something"

MCP Resource
    → "Give me information"

MCP Prompt
    → "Give me a reusable prompt/template"
```

### 🎯 Strong interview answer

> **"An MCP Resource represents data or contextual information exposed by an MCP Server that an AI application can read. Unlike an MCP Tool, which is used to perform an operation, a Resource is primarily used to provide context to the model or Worker. In our CWD architecture, a Resource could represent customer information, enterprise policies, documents, or other contextual data, while Tools would perform operations such as retrieving records, creating tickets, or updating systems."**

### Memory trick

> **Tool = Action 🔧**
> **Resource = Information 📄**
