# MCP vs. Function Calling

## Overview
Function calling and MCP are related but operate at different levels of abstraction. Function calling is the fundamental LLM capability of invoking a structured tool given a schema (see function-calling-tool-use.md); MCP is a protocol layer built on top of that capability, standardizing how tools and data sources are defined, discovered, and connected across many applications.

## Function Calling: The Underlying Mechanism
Function calling is a model-level capability: given a set of tool definitions (name, description, input schema) provided in the model's context, the model decides whether and how to invoke a tool, producing structured output matching the schema. This is provider-specific in its exact request/response format, and the tool definitions themselves are typically hardcoded into each individual application's integration code.

## MCP: The Standardization Layer
MCP standardizes:
- **How tool/resource definitions are exposed**: a common protocol for a server to advertise its available tools/resources/prompts, rather than each application needing bespoke knowledge of a specific external system's API
- **How connections and discovery work**: a client can connect to a new MCP server and immediately discover its capabilities without the application developer needing to write custom integration code for that specific server
- **How authentication and session management are handled** in a protocol-consistent way across different servers

Underneath, an MCP server ultimately still uses the model's native function-calling capability to let the LLM decide when and how to invoke the tools the server exposes — MCP doesn't replace function calling, it standardizes the layer around it.

## Practical Implications

### Without MCP
An application wanting to connect an agent to five different external systems (a CRM, a ticketing system, a database, a search engine, a calendar) needs five separate, custom integrations, each translating that system's specific API into the tool schema format the model expects.

### With MCP
If all five systems have (or can be wrapped with) an MCP server, the application's MCP client connects to each using the same protocol, discovers their capabilities dynamically, and the model can use tools from any of them without the application needing custom integration code per system.

## When to Use Plain Function Calling
- Simple applications with a small, fixed, well-known set of tools that aren't expected to change or be reused across other applications
- Situations where the overhead of standing up or connecting to an MCP server isn't justified by the integration-reuse benefit

## When to Use MCP
- Building an agent platform intended to connect to many different, potentially evolving external systems
- Wanting to reuse tool integrations across multiple different AI applications rather than reimplementing the same tool schema for each
- Building a tool/data source that you want to make available to a broad ecosystem of AI applications, not just one specific application

## Summary
Function calling is the foundational model capability for invoking structured tools; MCP is a standardization and ecosystem layer on top of it, addressing the integration-complexity and reusability challenges that arise once an application needs to connect to many different, evolving external tools and data sources.
