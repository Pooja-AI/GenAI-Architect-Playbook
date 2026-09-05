import CookbookApp from "../../components/CookbookApp";

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

  },
      {
        id: "what-is-mcp-cwd",
        category: "MCP",
        title: "What is MCP?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the Model Context Protocol, its purpose, core concepts, protocol semantics, communication model, and how it standardizes the interaction between AI applications, agents, and external capabilities.",
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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

