# What Is MCP (Model Context Protocol)?

## Overview
The Model Context Protocol (MCP) is an open standard for connecting AI applications (particularly LLM-based assistants and agents) to external data sources and tools through a consistent, provider-agnostic interface. Instead of every application building bespoke, one-off integrations to every tool or data source it needs, MCP defines a common protocol that any MCP-compliant client can speak to any MCP-compliant server.

## Core Concepts

### MCP Servers
An MCP server exposes a set of capabilities — tools (functions the model can invoke), resources (data the model can read), and prompts (reusable prompt templates) — over a standardized protocol. A server might wrap a database, a SaaS API (e.g., a CRM, a ticketing system), a filesystem, or any other external system.

### MCP Clients
An MCP client (typically embedded in an AI application or agent runtime) connects to one or more MCP servers, discovers their available capabilities, and lets the LLM invoke them as part of its reasoning — following the same fundamental tool-use mechanics described in function-calling-tool-use.md, but with a standardized discovery and invocation protocol rather than custom, per-integration code.

### Capability Discovery
A key MCP feature is that clients can dynamically discover what tools/resources a server offers at connection time, rather than requiring the tool definitions to be hardcoded into the client application ahead of time — this makes it far easier to add new integrations without modifying the core agent application.

## Why MCP Matters
Before standardized protocols like MCP, connecting an LLM application to N different external systems required N custom integrations, each with its own authentication, data format, and error handling conventions. MCP addresses this "M x N" integration problem by providing a single standard interface — any MCP-compliant client works with any MCP-compliant server, similar to how a standard like HTTP or SQL decouples clients from needing bespoke knowledge of every server's internals.

## MCP vs. Traditional Function Calling
See mcp-vs-function-calling.md for a detailed comparison, but in brief: function calling is the underlying mechanism (how an LLM decides to invoke a tool and receives its result), while MCP is a standardized protocol and ecosystem for *defining, discovering, and connecting* to tools and data sources across many different applications and servers, rather than each application defining its own bespoke tool schemas from scratch.

## Example Use Cases
- Connecting an agent to a company's internal ticketing system via an MCP server, allowing the agent to look up, create, and update tickets
- Exposing a company's document repository as MCP resources, letting any MCP-compliant agent perform retrieval without a custom RAG integration for that specific application
- Standardizing access to common developer tools (version control, CI/CD systems) across multiple different AI coding assistants

## Security Considerations
Because MCP servers can expose powerful capabilities (data access, action-taking tools) to any connected client, security considerations from secure-agent-tools.md apply directly — servers should enforce authentication and authorization, and clients should apply appropriate guardrails and validation before executing any tool call an LLM proposes, treating server-provided data as untrusted input subject to the same prompt injection risks discussed in prompt-injection.md.

## Relationship to A2A
MCP standardizes how an AI application connects to tools and data (a client-to-server, "vertical" integration), while the Agent-to-Agent (A2A) protocol standardizes how independent AI agents communicate with each other (a "horizontal" integration) — see what-is-a2a.md and mcp-and-a2a-together.md for how these complementary protocols fit together.

## Summary
MCP is an open standard that decouples AI applications from the specific tools and data sources they connect to, solving the integration-complexity problem of building bespoke connections for every tool-to-application pairing — enabling a more composable, reusable ecosystem of AI capabilities.
