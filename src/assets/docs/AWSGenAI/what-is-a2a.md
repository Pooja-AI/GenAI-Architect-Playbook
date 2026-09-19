# What Is A2A (Agent-to-Agent Protocol)?

## Overview
Agent-to-Agent (A2A) is an open protocol designed to standardize communication and interoperability between independent AI agents — potentially built by different teams, organizations, or vendors, using different underlying frameworks or models — so they can discover each other's capabilities and collaborate on tasks without requiring custom, bespoke integration for every pair of agents that need to interact.

## The Problem A2A Solves
As organizations build increasingly many specialized agents — some internal, some from third-party vendors, potentially built on entirely different agent frameworks — getting them to collaborate on a shared task traditionally requires custom point-to-point integration between every pair that needs to communicate, an "M x N" integration problem analogous to the one MCP addresses for tool/data connectivity (see what-is-mcp.md).

## Core Concepts

### Agent Cards
A standardized, discoverable description of an agent's capabilities, published in a well-known format — analogous to how an MCP server advertises its available tools, an A2A-compliant agent advertises what tasks it can perform, what input/output formats it expects, and how to reach it.

### Task Delegation
A standardized format for one agent to send a task request to another agent, including the task description, any necessary input data/context, and expectations about the response format — implementing the agent-communication.md principles (structured messages, clear task delegation) in an interoperable, cross-vendor way.

### Capability Negotiation
Before or during task delegation, agents can negotiate specifics of how a task will be handled (e.g., what format the response should be in, whether streaming updates are supported) rather than requiring this to be pre-agreed out of band for every pair of agents.

## A2A vs. Internal Multi-Agent Orchestration
The multi-agent patterns described earlier in this knowledge base (supervisor-worker, decentralized agents, LangGraph-based orchestration) typically apply *within* a single system or organization's control, where all agents share a common framework and infrastructure. A2A is specifically aimed at interoperability *across* system boundaries — connecting agents that weren't necessarily designed to work together from the start, potentially built by entirely different organizations.

## Example Use Cases
- A company's internal customer service agent delegating a specialized task (e.g., a complex tax calculation) to a specialized third-party agent via A2A, without needing custom integration code specific to that vendor
- Multiple business partners' agent systems coordinating on a shared multi-party workflow (e.g., supply chain coordination) where each partner's agents remain under their own control and infrastructure
- An enterprise's internal agent ecosystem where different teams have built agents on different frameworks, using A2A as the common interoperability layer rather than requiring all teams to standardize on a single framework

## Relationship to MCP
A2A and MCP are complementary, addressing different integration dimensions: MCP standardizes how an agent connects to tools and data sources; A2A standardizes how independent agents connect and delegate tasks to each other. A sophisticated agent might simultaneously use MCP to access its own tools/data and A2A to delegate parts of a task to other specialized agents (see mcp-and-a2a-together.md).

## Security and Trust Considerations
Because A2A explicitly enables cross-organizational agent collaboration, trust and security considerations are especially important — verifying the identity and authorization of a remote agent, scoping what information is shared in a task delegation, and applying the same untrusted-input scrutiny to responses from external agents that MCP security practices apply to external server responses (see mcp-security.md and prompt-injection.md).

## Summary
A2A is an interoperability protocol enabling independent AI agents — potentially from different vendors, organizations, or frameworks — to discover each other's capabilities and delegate tasks in a standardized way, addressing the cross-boundary integration challenges that internal multi-agent orchestration patterns don't cover.
