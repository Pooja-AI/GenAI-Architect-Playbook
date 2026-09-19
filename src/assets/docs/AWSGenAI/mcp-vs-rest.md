# MCP vs. REST APIs

## Overview
Both MCP and traditional REST APIs enable a client to interact with an external system's data and functionality, but they're designed for fundamentally different consumers: REST APIs are designed primarily for deterministic programmatic clients (application code written by a developer with full knowledge of the API's specification), while MCP is designed specifically for LLM-driven clients that need to dynamically discover and reason about which capability to invoke.

## Key Differences

### Discoverability
A REST API typically requires a developer to read documentation (or an OpenAPI spec) and write specific, hardcoded calls to known endpoints at development time. MCP is designed for runtime capability discovery — a client connects to a server and dynamically learns what tools/resources are available, with natural-language descriptions the LLM can reason about to decide which to use for a given task, without a human developer having pre-wired each specific call.

### Consumer Model
REST APIs assume the caller (application code) already knows exactly which endpoint to call and how to structure the request. MCP assumes the caller is (or is driven by) an LLM that needs descriptive metadata to reason about *which* capability is relevant to the current natural-language task, not just *how* to structurally format a known call.

### Standardization Scope
REST is a broad architectural style with wide variation in how individual APIs are actually designed (authentication schemes, pagination conventions, error formats all vary by API). MCP defines a more prescriptive, narrower protocol specifically for AI tool/resource interaction, trading broad flexibility for more consistent, predictable AI-facing behavior across different servers.

### Description-Driven Interaction
MCP tool and resource definitions include rich natural-language descriptions specifically intended to guide an LLM's decision-making about when and how to use them (mirroring the tool description best practices in function-calling-tool-use.md) — REST API documentation is written for human developers and isn't typically structured to be directly consumed by a model's reasoning process without an intermediate translation/wrapping layer.

## Can MCP Servers Wrap REST APIs?
Yes — a very common MCP server implementation pattern is to wrap an existing REST API, translating its endpoints into MCP tool/resource definitions with LLM-friendly descriptions. This lets organizations expose existing REST-based systems to AI agents via MCP without needing to redesign the underlying REST API itself — the MCP server acts as an adapter layer.

## When to Build a REST API vs. an MCP Server
- **REST API**: the primary consumers are traditional application code, other backend services, or human developers integrating via well-documented, stable endpoints
- **MCP Server**: the primary consumers are AI agents/assistants that need to dynamically discover and reason about which capability to invoke, especially across a fleet of different AI applications that shouldn't each need custom integration code

Many organizations build both: a REST API as the canonical, stable interface to a system, with an MCP server as a thin AI-facing adapter layer on top of it, giving them the benefits of both a well-established API discipline and AI-native discoverability.

## Summary
REST APIs and MCP serve different consumer models — REST for developer-integrated, statically-known API calls, and MCP for LLM-driven, dynamically-discovered tool and resource interaction — and are frequently complementary, with MCP servers commonly implemented as an AI-facing adapter layer wrapping existing REST APIs.
