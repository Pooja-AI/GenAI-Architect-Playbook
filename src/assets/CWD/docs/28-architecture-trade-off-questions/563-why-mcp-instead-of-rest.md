### Why MCP instead of REST?

* **REST** is a general API communication approach.
* **MCP** is designed specifically for **AI agents to discover and use tools/context**.
* MCP provides standardized **tool definitions, schemas, discovery, and tool invocation**.
* It reduces custom integration logic between every Worker and enterprise system.
* We can apply **authorization, validation, auditing, and tool-level governance** consistently.

**In CWD:**

```text
Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Salesforce / ServiceNow / SharePoint / Oracle
```

**Interview answer:**

> “We used MCP because CWD is an agentic AI platform where Workers need to dynamically discover and invoke enterprise tools. REST can expose the APIs, but MCP provides a standardized tool interface with schemas, discovery, and AI-friendly tool invocation. It also makes tool governance, authorization, validation, and auditing easier across multiple Workers. We could still use REST behind the MCP Server to communicate with systems like Salesforce or ServiceNow.”
