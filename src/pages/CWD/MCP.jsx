import CookbookApp from "../../components/CookbookApp";
import CWDMCP from "../../assets/CWD/docs/cwd-mcp.md?raw";
import WhatIsMCP from "../../assets/CWD/docs/what-is-mcp-cwd.md?raw";
import WhyMCP from "../../assets/CWD/docs/why-mcp-cwd.md?raw";
import MCPArchitecture from "../../assets/CWD/docs/mcp-architecture-cwd.md?raw";
import MCPServer from "../../assets/CWD/docs/mcp-server.md?raw";
import MCPTools from "../../assets/CWD/docs/mcp-tools.md?raw";
import MCPResources from "../../assets/CWD/docs/mcp-resources.md?raw";
import MCPContext from "../../assets/CWD/docs/mcp-context.md?raw";
import WorkerMCP from "../../assets/CWD/docs/worker-mcp.md?raw";
import MCPSecurity from "../../assets/CWD/docs/mcp-security.md?raw";
// import MCPInterviewQuestions from "../../assets/CWD/docs/mcp-interview-questions.md?raw";
import MCPCode from "../../assets/CWD/code/mcp.py?raw";

const MCP = [
  // =====================================================
  // 08. MCP
  // =====================================================

  {
    id: "cwd-mcp",
    category: "MCP",
    title: "MCP",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the Model Context Protocol (MCP) and how CWD uses it as a standardized integration layer for connecting AI agents with enterprise tools, resources, context, and external services in a secure and governed manner.",
concept: CWDMCP,
    code: MCPCode,
  },
      {
        id: "what-is-mcp-cwd",
        category: "MCP",
        title: "What is MCP?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the Model Context Protocol, its purpose, core concepts, protocol semantics, communication model, and how it standardizes the interaction between AI applications, agents, and external capabilities.",
        concept: WhatIsMCP,
        code: "",
      },

      {
        id: "why-mcp-cwd",
        category: "MCP",
        title: "Why MCP?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why MCP is used within CWD to avoid point-to-point integrations, standardize tool access, improve reusability, simplify agent integration, and provide a governed interface to enterprise capabilities.",
        concept: WhyMCP,
        code: "",
      },

      {
        id: "mcp-architecture-cwd",
        category: "MCP",
        title: "MCP Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the MCP architecture, including MCP hosts, clients, servers, tools, resources, prompts, protocol messages, transports, and how these components interact to provide standardized context and capability access.",
        concept: MCPArchitecture,
        code: "",
      },

      {
        id: "mcp-server",
        category: "MCP",
        title: "MCP Server",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the responsibilities of an MCP Server, including exposing tools and resources, validating requests, executing approved operations, enforcing security policies, handling errors, and returning structured results to MCP clients.",
        concept: MCPServer,
        code: "",
      },

      {
        id: "mcp-tools",
        category: "MCP",
        title: "MCP Tools",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how enterprise capabilities are exposed as MCP tools, including tool discovery, input schemas, invocation, validation, execution, structured outputs, error handling, authorization, and controlled access to APIs and business services.",
        concept: MCPTools,
        code: "",
      },

      {
        id: "mcp-resources",
        category: "MCP",
        title: "MCP Resources",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand MCP resources as a standardized mechanism for providing contextual information to agents, including documents, application data, knowledge content, metadata, and other read-oriented enterprise information.",
        concept: MCPResources,
        code: "",
      },

      {
        id: "mcp-context",
        category: "MCP",
        title: "MCP Context",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how MCP enables standardized access to relevant context and capabilities, including how clients discover available resources and tools and provide the appropriate information to an AI application or agent.",
        concept: MCPContext,
        code: "",
      },

      {
        id: "worker-mcp",
        category: "MCP",
        title: "Worker + MCP",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how CWD Worker agents use MCP to discover and invoke domain-specific enterprise tools and access approved resources, while the Worker remains focused on domain reasoning and task execution.",
        concept: WorkerMCP,
        code: "",
      },

      {
        id: "mcp-security",
        category: "MCP",
        title: "MCP Security",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand enterprise MCP security, including authentication, authorization, identity propagation, tool-level permissions, input validation, secrets management, network controls, data protection, auditing, rate limiting, and preventing unsafe tool execution.",
        concept: MCPSecurity,
        code: "",
      },

      {
        id: "mcp-interview",
        category: "MCP",
        title: "MCP Interview Questions",
        difficulty: "Advanced",
        time: "~20 min",
        description:
          "Prepare for MCP architecture and enterprise interview questions covering MCP clients and servers, tools, resources, prompts, discovery, invocation, transports, security, authorization, enterprise integration, MCP versus REST APIs, and MCP versus function calling.",
        concept: "",
        code: "",
      },
    
  
];

export default function MCPPage() {
  return (
    <CookbookApp
      data={MCP}
      title="MCP Cookbook"
      subtitle="Protocol, tools, resources, context, Worker integration and security"
      icon="🔗"
      patternLabel="Topics"
    />
  );
}

