import CookbookApp from "../components/CookbookApp";

import WhatIsMCP from "../assets/docs/MCP/what-is-mcp.md?raw";
import WhyMCP from "../assets/docs/MCP/why-mcp.md?raw";
import MCPProblem from "../assets/docs/MCP/mcp-problem.md?raw";
import MCPClientServer from "../assets/docs/MCP/mcp-client-server.md?raw";
import MCPTools from "../assets/docs/MCP/mcp-tools.md?raw";
import MCPResources from "../assets/docs/MCP/mcp-resources.md?raw";
import MCPPrompts from "../assets/docs/MCP/mcp-prompts.md?raw";
import MCPToolDiscovery from "../assets/docs/MCP/mcp-tool-discovery.md?raw"; 
import MCPToolInvocation from "../assets/docs/MCP/mcp-tool-invocation.md?raw";
import MCPVsRestAPI from "../assets/docs/MCP/mcp-vs-rest-api.md?raw";
import MCPVsFunctionCalling from "../assets/docs/MCP/mcp-vs-function-calling.md?raw";
import MCPVsPlugins from "../assets/docs/MCP/mcp-vs-plugins.md?raw";
import MCPSecurity from "../assets/docs/MCP/mcp-security.md?raw";
import MCPAuthAuthorization from "../assets/docs/MCP/mcp-auth-authorization.md?raw";
import EnterpriseMCPServer from "../assets/docs/MCP/enterprise-mcp-server.md?raw";
import MCPServerFailures from "../assets/docs/MCP/mcp-server-failures.md?raw";
import DangerousMCPTools from "../assets/docs/MCP/dangerous-mcp-tools.md?raw";


const MCPQuestion = 
[
  {
    id: "what-is-mcp",
    category: "MCP",
    title: "What is MCP?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the Model Context Protocol (MCP), its purpose, architecture, core components, and how it standardizes connections between AI applications and external tools, resources, and services.",
    concept: WhatIsMCP,
    code: ""
  },

  {
    id: "why-mcp",
    category: "MCP",
    title: "Why do we need MCP?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand why MCP is needed to standardize how AI applications discover and interact with external tools, data sources, resources, and enterprise systems.",
    concept: WhyMCP,
    code: ""
  },

  {
    id: "mcp-problem",
    category: "MCP",
    title: "What problem does MCP solve?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the integration and interoperability problems MCP addresses, including fragmented tool integrations, duplicated connectors, inconsistent interfaces, and tight coupling between AI applications and external systems.",
    concept: MCPProblem,
    code: ""
  },

  {
    id: "mcp-client-server",
    category: "MCP Architecture",
    title: "What are MCP clients and servers?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand the roles of MCP hosts, clients, and servers and how they interact to establish connections, discover capabilities, and exchange requests and results.",
    concept: MCPClientServer,
    code: ""
  },

  {
    id: "mcp-tools",
    category: "MCP",
    title: "What are MCP tools?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand MCP tools as executable capabilities exposed by MCP servers that allow AI applications to perform actions such as querying systems, calling APIs, modifying data, or triggering business operations.",
    concept: MCPTools,
    code: ""
  },

  {
    id: "mcp-resources",
    category: "MCP",
    title: "What are MCP resources?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand MCP resources as contextual data exposed by MCP servers, including documents, files, database information, application data, and other information that AI applications can retrieve.",
    concept: MCPResources,
    code: ""
  },

  {
    id: "mcp-prompts",
    category: "MCP",
    title: "What are MCP prompts?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand MCP prompts as reusable prompt templates or interaction patterns exposed by MCP servers to help clients and AI applications use domain-specific instructions consistently.",
    concept: MCPPrompts,
    code: ""
  },

  {
    id: "mcp-tool-discovery",
    category: "MCP",
    title: "How does an agent discover MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how MCP clients connect to servers, discover available capabilities and tool schemas, and make those capabilities available to an AI agent for decision-making.",
    concept: MCPToolDiscovery,
    code: ""
  },

  {
    id: "mcp-tool-invocation",
    category: "MCP",
    title: "How does an agent invoke an MCP tool?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the lifecycle of an MCP tool invocation, including tool selection, structured arguments, request transmission, server-side execution, validation, response handling, and error processing.",
    concept: MCPToolInvocation,
    code: ""
  },

  {
    id: "mcp-vs-rest-api",
    category: "MCP Architecture",
    title: "MCP vs REST API?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Compare MCP and REST APIs in terms of purpose, discovery, standardization, tool schemas, resources, transport, interoperability, integration patterns, and appropriate enterprise use cases.",
    concept: MCPVsRestAPI,
    code: ""
  },

  {
    id: "mcp-vs-function-calling",
    category: "MCP Architecture",
    title: "MCP vs function calling?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the difference between MCP as a standardized protocol for connecting AI applications with external capabilities and function calling as a model capability for generating structured requests to invoke functions.",
    concept: MCPVsFunctionCalling,
    code: ""
  },

  {
    id: "mcp-vs-plugins",
    category: "MCP Architecture",
    title: "MCP vs plugins?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Compare MCP with traditional plugin architectures in terms of interoperability, standardized discovery, tool definitions, portability, client-server separation, and ecosystem integration.",
    concept: MCPVsPlugins,
    code: ""
  },

  {
    id: "mcp-security",
    category: "MCP Security",
    title: "How do you secure MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand MCP security controls including authentication, authorization, least privilege, input validation, output validation, secret management, network security, auditing, and tool-level access policies.",
    concept: MCPSecurity,
    code: ""
  },

  {
    id: "mcp-auth-authorization",
    category: "MCP Security",
    title: "How do you implement authentication/authorization for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to authenticate MCP clients and authorize tool and resource access using identity providers, OAuth, tokens, workload identity, RBAC, ABAC, scopes, and policy enforcement.",
    concept: MCPAuthAuthorization,
    code: ""
  },

  {
    id: "enterprise-mcp-server",
    category: "MCP Architecture",
    title: "How would you build an enterprise MCP server?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Design an enterprise-grade MCP server covering tool and resource design, authentication, authorization, validation, secrets management, scalability, observability, rate limiting, error handling, versioning, and deployment.",
    concept: EnterpriseMCPServer,
    code: ""
  },

  {
    id: "mcp-server-failures",
    category: "MCP Reliability",
    title: "How do you handle MCP server failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand strategies for handling MCP server failures using timeouts, retries, circuit breakers, health checks, fallback mechanisms, graceful degradation, error classification, and observability.",
    concept: MCPServerFailures,
    code: ""
  },

  {
    id: "dangerous-mcp-tools",
    category: "MCP Security",
    title: "How do you prevent an agent from calling dangerous MCP tools?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Understand how to control dangerous MCP tool execution using least privilege, tool-level authorization, policy engines, allowlists, deny lists, input validation, human approval, sandboxing, and audit controls.",
    concept: DangerousMCPTools,
    code: ""
  }
];
export default function CWDPage() {
  return (
    <CookbookApp
      data={MCPQuestion}
      title="MCPQuestion Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}