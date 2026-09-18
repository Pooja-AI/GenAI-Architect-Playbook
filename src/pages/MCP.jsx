import CookbookApp from "../components/CookbookApp";

// MCP Fundamentals
import WhatIsMCP from "../assets/docs/MCP/what-is-mcp.md?raw";
import WhyMCP from "../assets/docs/MCP/why-mcp.md?raw";
import MCPVsREST from "../assets/docs/MCP/mcp-vs-rest-api.md?raw";
import MCPHost from "../assets/docs/MCP/mcp-host.md?raw";
import MCPClient from "../assets/docs/MCP/mcp-client.md?raw";
import MCPServer from "../assets/docs/MCP/mcp-server.md?raw";
import MCPArchitecture from "../assets/docs/MCP/mcp-architecture.md?raw";
import MCPCommunication from "../assets/docs/MCP/mcp-communication.md?raw";
import JSONRPC from "../assets/docs/MCP/json-rpc.md?raw";
import MCPCapabilities from "../assets/docs/MCP/mcp-capabilities.md?raw";

// MCP Tools
import WhatIsMCPTool from "../assets/docs/MCP/what-is-mcp-tool.md?raw";
import ToolDiscovery from "../assets/docs/MCP/tool-discovery.md?raw";
import ToolSchema from "../assets/docs/MCP/tool-schema.md?raw";
import ToolInputValidation from "../assets/docs/MCP/tool-input-validation.md?raw";
import ToolExecution from "../assets/docs/MCP/tool-execution.md?raw";
import ToolFailures from "../assets/docs/MCP/tool-failures.md?raw";
import ToolTimeouts from "../assets/docs/MCP/tool-timeouts.md?raw";
import ToolAuthorization from "../assets/docs/MCP/tool-authorization.md?raw";
import DestructiveTools from "../assets/docs/MCP/destructive-tools.md?raw";
import HumanInTheLoopMCP from "../assets/docs/MCP/human-in-the-loop-mcp.md?raw";
import MCPToolRetries from "../assets/docs/MCP/mcp-tool-retries.md?raw";
import MCPToolIdempotency from "../assets/docs/MCP/mcp-tool-idempotency.md?raw";
import MCPToolMonitoring from "../assets/docs/MCP/mcp-tool-monitoring.md?raw";

// MCP Resources
import WhatIsMCPResource from "../assets/docs/MCP/what-is-mcp-resource.md?raw";
import MCPResourceVsTool from "../assets/docs/MCP/resource-vs-tool.md?raw";
import ResourceDiscovery from "../assets/docs/MCP/resource-discovery.md?raw";
import SecureMCPResources from "../assets/docs/MCP/secure-mcp-resources.md?raw";
import DynamicMCPResources from "../assets/docs/MCP/dynamic-mcp-resources.md?raw";
import LargeMCPResources from "../assets/docs/MCP/large-mcp-resources.md?raw";
import DatabaseMCPResources from "../assets/docs/MCP/database-mcp-resources.md?raw";

// MCP Prompts
import WhatIsMCPPrompt from "../assets/docs/MCP/what-is-mcp-prompt.md?raw";
import MCPPromptVsTool from "../assets/docs/MCP/prompt-vs-tool.md?raw";
import MCPPromptParameters from "../assets/docs/MCP/prompt-parameters.md?raw";
import MCPPromptVersioning from "../assets/docs/MCP/prompt-versioning.md?raw";
import MCPPromptGovernance from "../assets/docs/MCP/prompt-governance.md?raw";

// MCP Security
import MCPAuthentication from "../assets/docs/MCP/mcp-authentication.md?raw";
import MCPAuthorization from "../assets/docs/MCP/mcp-authorization.md?raw";
import MCPSecurity from "../assets/docs/MCP/mcp-security.md?raw";
import MCPRBAC from "../assets/docs/MCP/mcp-rbac.md?raw";
import MCPOAuth from "../assets/docs/MCP/mcp-oauth.md?raw";
import MCPSecrets from "../assets/docs/MCP/mcp-secrets.md?raw";
import MCPPromptInjection from "../assets/docs/MCP/mcp-prompt-injection.md?raw";
import MCPDataExfiltration from "../assets/docs/MCP/mcp-data-exfiltration.md?raw";
import MCPLeastPrivilege from "../assets/docs/MCP/mcp-least-privilege.md?raw";
import MCPAuditLogging from "../assets/docs/MCP/mcp-audit-logging.md?raw";
import MCPZeroTrust from "../assets/docs/MCP/mcp-zero-trust.md?raw";

// MCP + Agentic AI
import MCPAgenticAI from "../assets/docs/MCP/mcp-agentic-ai.md?raw";
import AgentMCPTools from "../assets/docs/MCP/agent-mcp-tools.md?raw";
import DynamicToolDiscovery from "../assets/docs/MCP/dynamic-tool-discovery.md?raw";
import MCPWithLangGraph from "../assets/docs/MCP/mcp-with-langgraph.md?raw";
import MCPWithCrewAI from "../assets/docs/MCP/mcp-with-crewai.md?raw";
import MCPWithAutoGen from "../assets/docs/MCP/mcp-with-autogen.md?raw";
import MCPAgentFailures from "../assets/docs/MCP/mcp-agent-failures.md?raw";
import MCPToolSelection from "../assets/docs/MCP/mcp-tool-selection.md?raw";

// MCP + A2A
import MCPVsA2A from "../assets/docs/MCP/mcp-vs-a2a.md?raw";
import WhenToUseMCP from "../assets/docs/MCP/when-to-use-mcp.md?raw";
import WhenToUseA2A from "../assets/docs/MCP/when-to-use-a2a.md?raw";
import MCPAndA2ATogether from "../assets/docs/MCP/mcp-and-a2a-together.md?raw";
import MCPA2AArchitecture from "../assets/docs/MCP/mcp-a2a-architecture.md?raw";

// MCP Reliability
import MCPServerFailures from "../assets/docs/MCP/mcp-server-failures.md?raw";
import MCPRetries from "../assets/docs/MCP/mcp-retries.md?raw";
import MCPExponentialBackoff from "../assets/docs/MCP/mcp-exponential-backoff.md?raw";
import MCPCircuitBreaker from "../assets/docs/MCP/mcp-circuit-breaker.md?raw";
import MCPHealthChecks from "../assets/docs/MCP/mcp-health-checks.md?raw";
import MCPScaling from "../assets/docs/MCP/mcp-scaling.md?raw";
import MCPLoadBalancing from "../assets/docs/MCP/mcp-load-balancing.md?raw";

// MCP Observability
import MCPMonitoring from "../assets/docs/MCP/mcp-monitoring.md?raw";
import MCPTracing from "../assets/docs/MCP/mcp-tracing.md?raw";
import MCPLatency from "../assets/docs/MCP/mcp-latency.md?raw";
import MCPErrorMonitoring from "../assets/docs/MCP/mcp-error-monitoring.md?raw";
import MCPDistributedTracing from "../assets/docs/MCP/mcp-distributed-tracing.md?raw";

// Enterprise MCP
import EnterpriseMCPArchitecture from "../assets/docs/MCP/enterprise-mcp-architecture.md?raw";
import SalesforceMCP from "../assets/docs/MCP/salesforce-mcp.md?raw";
import SnowflakeMCP from "../assets/docs/MCP/snowflake-mcp.md?raw";
import SharePointMCP from "../assets/docs/MCP/sharepoint-mcp.md?raw";
import EnterpriseAPIMCP from "../assets/docs/MCP/enterprise-api-mcp.md?raw";
import MultiMCPServers from "../assets/docs/MCP/multiple-mcp-servers.md?raw";
import MCPGovernance from "../assets/docs/MCP/mcp-governance.md?raw";

// MCP + LangGraph
import LangGraphMCPIntegration from "../assets/docs/MCP/langgraph-mcp-integration.md?raw";
import LangGraphMCPTools from "../assets/docs/MCP/langgraph-mcp-tools.md?raw";
import LangGraphMCPFailureHandling from "../assets/docs/MCP/langgraph-mcp-failure-handling.md?raw";

// Azure MCP
import AzureMCPArchitecture from "../assets/docs/MCP/azure-mcp-architecture.md?raw";
import AzureMCPSecurity from "../assets/docs/MCP/azure-mcp-security.md?raw";
import AzureMCPDeployment from "../assets/docs/MCP/azure-mcp-deployment.md?raw";

// AWS MCP
import AWSMCPArchitecture from "../assets/docs/MCP/aws-mcp-architecture.md?raw";
import AWSMCPSecurity from "../assets/docs/MCP/aws-mcp-security.md?raw";
import AWSMCPDeployment from "../assets/docs/MCP/aws-mcp-deployment.md?raw";

// MCP Coding
import CreateMCPServer from "../assets/docs/MCP/create-mcp-server.md?raw";
import CreateMCPTool from "../assets/docs/MCP/create-mcp-tool.md?raw";
import CreateMCPClient from "../assets/docs/MCP/create-mcp-client.md?raw";
import MCPToolSchemaCoding from "../assets/docs/MCP/mcp-tool-schema-coding.md?raw";
import MCPExceptionHandling from "../assets/docs/MCP/mcp-exception-handling.md?raw";
import MCPTesting from "../assets/docs/MCP/mcp-testing.md?raw";
import MCPContainerization from "../assets/docs/MCP/mcp-containerization.md?raw";


const MCPQuestion = [

  // =========================================================
  // MCP FUNDAMENTALS
  // =========================================================

  {
    id: "what-is-mcp",
    category: "MCP Fundamentals",
    title: "What is MCP?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsMCP,
    code: ""
  },

  {
    id: "why-mcp",
    category: "MCP Fundamentals",
    title: "Why was MCP introduced?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhyMCP,
    code: ""
  },

  {
    id: "mcp-vs-rest-api",
    category: "MCP Fundamentals",
    title: "How is MCP different from a REST API?",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: MCPVsREST,
    code: ""
  },

  {
    id: "mcp-host",
    category: "MCP Fundamentals",
    title: "What is an MCP Host?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: MCPHost,
    code: ""
  },

  {
    id: "mcp-client",
    category: "MCP Fundamentals",
    title: "What is an MCP Client?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: MCPClient,
    code: ""
  },

  {
    id: "mcp-server",
    category: "MCP Fundamentals",
    title: "What is an MCP Server?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: MCPServer,
    code: ""
  },

  {
    id: "mcp-architecture",
    category: "MCP Fundamentals",
    title: "Explain MCP architecture end-to-end.",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPArchitecture,
    code: ""
  },

  {
    id: "mcp-communication",
    category: "MCP Fundamentals",
    title: "How does an MCP client communicate with an MCP server?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPCommunication,
    code: ""
  },

  {
    id: "json-rpc",
    category: "MCP Fundamentals",
    title: "What is JSON-RPC and why does MCP use it?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: JSONRPC,
    code: ""
  },

  {
    id: "mcp-capabilities",
    category: "MCP Fundamentals",
    title: "What are MCP capabilities?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPCapabilities,
    code: ""
  },


  // =========================================================
  // MCP TOOLS
  // =========================================================

  {
    id: "what-is-mcp-tool",
    category: "MCP Tools",
    title: "What is an MCP Tool?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsMCPTool,
    code: ""
  },

  {
    id: "tool-discovery",
    category: "MCP Tools",
    title: "How does an LLM discover MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ToolDiscovery,
    code: ""
  },

  {
    id: "tool-schema",
    category: "MCP Tools",
    title: "What is an MCP tool schema?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ToolSchema,
    code: ""
  },

  {
    id: "tool-input-validation",
    category: "MCP Tools",
    title: "How do you validate MCP tool inputs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ToolInputValidation,
    code: ""
  },

  {
    id: "tool-execution",
    category: "MCP Tools",
    title: "How does MCP tool execution work?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ToolExecution,
    code: ""
  },

  {
    id: "tool-failures",
    category: "MCP Tools",
    title: "How do you handle MCP tool execution failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ToolFailures,
    code: ""
  },

  {
    id: "tool-timeouts",
    category: "MCP Tools",
    title: "How do you handle MCP tool timeouts?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ToolTimeouts,
    code: ""
  },

  {
    id: "tool-authorization",
    category: "MCP Tools",
    title: "How do you prevent unauthorized MCP tool execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ToolAuthorization,
    code: ""
  },

  {
    id: "destructive-tools",
    category: "MCP Tools",
    title: "How would you secure a destructive MCP tool such as delete?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DestructiveTools,
    code: ""
  },

  {
    id: "human-in-the-loop-mcp",
    category: "MCP Tools",
    title: "How do you implement human-in-the-loop approval for MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: HumanInTheLoopMCP,
    code: ""
  },

  {
    id: "mcp-tool-retries",
    category: "MCP Tools",
    title: "How do you implement retries for MCP tool calls?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPToolRetries,
    code: ""
  },

  {
    id: "mcp-tool-idempotency",
    category: "MCP Tools",
    title: "How do you make MCP tool calls idempotent?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPToolIdempotency,
    code: ""
  },

  {
    id: "mcp-tool-monitoring",
    category: "MCP Tools",
    title: "How do you monitor MCP tool execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPToolMonitoring,
    code: ""
  },


  // =========================================================
  // MCP RESOURCES
  // =========================================================

  {
    id: "what-is-mcp-resource",
    category: "MCP Resources",
    title: "What is an MCP Resource?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsMCPResource,
    code: ""
  },

  {
    id: "resource-vs-tool",
    category: "MCP Resources",
    title: "How are MCP Resources different from MCP Tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPResourceVsTool,
    code: ""
  },

  {
    id: "resource-discovery",
    category: "MCP Resources",
    title: "How does an agent discover MCP Resources?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ResourceDiscovery,
    code: ""
  },

  {
    id: "secure-mcp-resources",
    category: "MCP Resources",
    title: "How do you secure MCP Resources?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: SecureMCPResources,
    code: ""
  },

  {
    id: "dynamic-mcp-resources",
    category: "MCP Resources",
    title: "How do you implement dynamic MCP Resources?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DynamicMCPResources,
    code: ""
  },

  {
    id: "large-mcp-resources",
    category: "MCP Resources",
    title: "How do you handle large MCP Resources?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LargeMCPResources,
    code: ""
  },

  {
    id: "database-mcp-resources",
    category: "MCP Resources",
    title: "How would you expose database information through MCP Resources?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DatabaseMCPResources,
    code: ""
  },


  // =========================================================
  // MCP PROMPTS
  // =========================================================

  {
    id: "what-is-mcp-prompt",
    category: "MCP Prompts",
    title: "What is an MCP Prompt?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsMCPPrompt,
    code: ""
  },

  {
    id: "prompt-vs-tool",
    category: "MCP Prompts",
    title: "How are MCP Prompts different from Tools?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPPromptVsTool,
    code: ""
  },

  {
    id: "prompt-parameters",
    category: "MCP Prompts",
    title: "How do you parameterize MCP Prompts?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPPromptParameters,
    code: ""
  },

  {
    id: "prompt-versioning",
    category: "MCP Prompts",
    title: "How do you version MCP Prompts?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPPromptVersioning,
    code: ""
  },

  {
    id: "prompt-governance",
    category: "MCP Prompts",
    title: "How do you implement MCP Prompt governance?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPPromptGovernance,
    code: ""
  },


  // =========================================================
  // MCP SECURITY
  // =========================================================

  {
    id: "mcp-authentication",
    category: "MCP Security",
    title: "How do you authenticate MCP clients?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAuthentication,
    code: ""
  },

  {
    id: "mcp-authorization",
    category: "MCP Security",
    title: "How do you authorize MCP tool execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAuthorization,
    code: ""
  },

  {
    id: "mcp-security",
    category: "MCP Security",
    title: "How do you secure an MCP server?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPSecurity,
    code: ""
  },

  {
    id: "mcp-rbac",
    category: "MCP Security",
    title: "How do you implement RBAC for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPRBAC,
    code: ""
  },

  {
    id: "mcp-oauth",
    category: "MCP Security",
    title: "How do you implement OAuth for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPOAuth,
    code: ""
  },

  {
    id: "mcp-secrets",
    category: "MCP Security",
    title: "How do you protect MCP credentials and secrets?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPSecrets,
    code: ""
  },

  {
    id: "mcp-prompt-injection",
    category: "MCP Security",
    title: "How do you prevent prompt injection through MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPPromptInjection,
    code: ""
  },

  {
    id: "mcp-data-exfiltration",
    category: "MCP Security",
    title: "How do you prevent data exfiltration through MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPDataExfiltration,
    code: ""
  },

  {
    id: "mcp-least-privilege",
    category: "MCP Security",
    title: "How do you implement least-privilege access for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPLeastPrivilege,
    code: ""
  },

  {
    id: "mcp-audit-logging",
    category: "MCP Security",
    title: "How do you audit MCP tool calls?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAuditLogging,
    code: ""
  },

  {
    id: "mcp-zero-trust",
    category: "MCP Security",
    title: "How would you secure MCP using a zero-trust architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MCPZeroTrust,
    code: ""
  },


  // =========================================================
  // MCP + AGENTIC AI
  // =========================================================

  {
    id: "mcp-agentic-ai",
    category: "MCP + Agentic AI",
    title: "How does MCP fit into an Agentic AI architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAgenticAI,
    code: ""
  },

  {
    id: "agent-mcp-tools",
    category: "MCP + Agentic AI",
    title: "How does an agent use MCP Tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentMCPTools,
    code: ""
  },

  {
    id: "dynamic-tool-discovery",
    category: "MCP + Agentic AI",
    title: "How does an agent dynamically discover MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DynamicToolDiscovery,
    code: ""
  },

  {
    id: "mcp-with-langgraph",
    category: "MCP + Agentic AI",
    title: "How do you integrate MCP with LangGraph?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MCPWithLangGraph,
    code: ""
  },

  {
    id: "mcp-with-crewai",
    category: "MCP + Agentic AI",
    title: "How do you integrate MCP with CrewAI?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPWithCrewAI,
    code: ""
  },

  {
    id: "mcp-with-autogen",
    category: "MCP + Agentic AI",
    title: "How do you integrate MCP with AutoGen?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPWithAutoGen,
    code: ""
  },

  {
    id: "mcp-agent-failures",
    category: "MCP + Agentic AI",
    title: "How do you handle MCP failures inside an agent workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAgentFailures,
    code: ""
  },

  {
    id: "mcp-tool-selection",
    category: "MCP + Agentic AI",
    title: "How do you prevent agents from calling unnecessary MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPToolSelection,
    code: ""
  },


  // =========================================================
  // MCP + A2A
  // =========================================================

  {
    id: "mcp-vs-a2a",
    category: "MCP + A2A",
    title: "What is the difference between MCP and A2A?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPVsA2A,
    code: ""
  },

  {
    id: "when-to-use-mcp",
    category: "MCP + A2A",
    title: "When would you use MCP instead of A2A?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: WhenToUseMCP,
    code: ""
  },

  {
    id: "when-to-use-a2a",
    category: "MCP + A2A",
    title: "When would you use A2A instead of MCP?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: WhenToUseA2A,
    code: ""
  },

  {
    id: "mcp-and-a2a-together",
    category: "MCP + A2A",
    title: "Can MCP and A2A be used together?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAndA2ATogether,
    code: ""
  },

  {
    id: "mcp-a2a-architecture",
    category: "MCP + A2A",
    title: "How would MCP and A2A work together in a multi-agent architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MCPA2AArchitecture,
    code: ""
  },


  // =========================================================
  // MCP RELIABILITY
  // =========================================================

  {
    id: "mcp-server-failures",
    category: "MCP Reliability",
    title: "How do you handle MCP server failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPServerFailures,
    code: ""
  },

  {
    id: "mcp-retries",
    category: "MCP Reliability",
    title: "How do you implement retries for MCP requests?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPRetries,
    code: ""
  },

  {
    id: "mcp-exponential-backoff",
    category: "MCP Reliability",
    title: "How do you implement exponential backoff?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPExponentialBackoff,
    code: ""
  },

  {
    id: "mcp-circuit-breaker",
    category: "MCP Reliability",
    title: "How do you implement a circuit breaker for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPCircuitBreaker,
    code: ""
  },

  {
    id: "mcp-health-checks",
    category: "MCP Reliability",
    title: "How do you implement MCP server health checks?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPHealthChecks,
    code: ""
  },

  {
    id: "mcp-scaling",
    category: "MCP Reliability",
    title: "How do you scale MCP servers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPScaling,
    code: ""
  },

  {
    id: "mcp-load-balancing",
    category: "MCP Reliability",
    title: "How do you load-balance MCP servers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPLoadBalancing,
    code: ""
  },


  // =========================================================
  // MCP OBSERVABILITY
  // =========================================================

  {
    id: "mcp-monitoring",
    category: "MCP Observability",
    title: "How do you monitor MCP in production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPMonitoring,
    code: ""
  },

  {
    id: "mcp-tracing",
    category: "MCP Observability",
    title: "How do you trace an MCP request end-to-end?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPTracing,
    code: ""
  },

  {
    id: "mcp-latency",
    category: "MCP Observability",
    title: "How do you monitor MCP latency?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPLatency,
    code: ""
  },

  {
    id: "mcp-error-monitoring",
    category: "MCP Observability",
    title: "How do you monitor MCP errors?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPErrorMonitoring,
    code: ""
  },

  {
    id: "mcp-distributed-tracing",
    category: "MCP Observability",
    title: "How do you implement distributed tracing for MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPDistributedTracing,
    code: ""
  },


  // =========================================================
  // ENTERPRISE MCP
  // =========================================================

  {
    id: "enterprise-mcp-architecture",
    category: "Enterprise MCP",
    title: "How would you design an enterprise MCP architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: EnterpriseMCPArchitecture,
    code: ""
  },

  {
    id: "salesforce-mcp",
    category: "Enterprise MCP",
    title: "How would you build an MCP server for Salesforce?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: SalesforceMCP,
    code: ""
  },

  {
    id: "snowflake-mcp",
    category: "Enterprise MCP",
    title: "How would you build an MCP server for Snowflake?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: SnowflakeMCP,
    code: ""
  },

  {
    id: "sharepoint-mcp",
    category: "Enterprise MCP",
    title: "How would you build an MCP server for SharePoint?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: SharePointMCP,
    code: ""
  },

  {
    id: "enterprise-api-mcp",
    category: "Enterprise MCP",
    title: "How would you expose internal enterprise APIs through MCP?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: EnterpriseAPIMCP,
    code: ""
  },

  {
    id: "multiple-mcp-servers",
    category: "Enterprise MCP",
    title: "Can one MCP client connect to multiple MCP servers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultiMCPServers,
    code: ""
  },

  {
    id: "mcp-governance",
    category: "Enterprise MCP",
    title: "How would you implement centralized MCP governance?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MCPGovernance,
    code: ""
  },


  // =========================================================
  // MCP + LANGGRAPH
  // =========================================================

  {
    id: "langgraph-mcp-integration",
    category: "MCP + LangGraph",
    title: "How do you integrate MCP with LangGraph?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: LangGraphMCPIntegration,
    code: ""
  },

  {
    id: "langgraph-mcp-tools",
    category: "MCP + LangGraph",
    title: "How do you use MCP tools inside LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LangGraphMCPTools,
    code: ""
  },

  {
    id: "langgraph-mcp-failure-handling",
    category: "MCP + LangGraph",
    title: "How do you handle MCP failures inside LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LangGraphMCPFailureHandling,
    code: ""
  },


  // =========================================================
  // AZURE MCP
  // =========================================================

  {
    id: "azure-mcp-architecture",
    category: "Azure MCP",
    title: "How would you design an MCP architecture on Azure?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AzureMCPArchitecture,
    code: ""
  },

  {
    id: "azure-mcp-security",
    category: "Azure MCP",
    title: "How would you secure MCP on Azure?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AzureMCPSecurity,
    code: ""
  },

  {
    id: "azure-mcp-deployment",
    category: "Azure MCP",
    title: "How would you deploy an MCP server on Azure?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AzureMCPDeployment,
    code: ""
  },


  // =========================================================
  // AWS MCP
  // =========================================================

  {
    id: "aws-mcp-architecture",
    category: "AWS MCP",
    title: "How would you design an MCP architecture on AWS?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AWSMCPArchitecture,
    code: ""
  },

  {
    id: "aws-mcp-security",
    category: "AWS MCP",
    title: "How would you secure MCP on AWS?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AWSMCPSecurity,
    code: ""
  },

  {
    id: "aws-mcp-deployment",
    category: "AWS MCP",
    title: "How would you deploy an MCP server on AWS?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AWSMCPDeployment,
    code: ""
  },


  // =========================================================
  // MCP CODING
  // =========================================================

  {
    id: "create-mcp-server",
    category: "MCP Coding",
    title: "How would you create a simple MCP server?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: CreateMCPServer,
    code: ""
  },

  {
    id: "create-mcp-tool",
    category: "MCP Coding",
    title: "How would you create an MCP Tool?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: CreateMCPTool,
    code: ""
  },

  {
    id: "create-mcp-client",
    category: "MCP Coding",
    title: "How would you create an MCP Client?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: CreateMCPClient,
    code: ""
  },

  {
    id: "mcp-tool-schema-coding",
    category: "MCP Coding",
    title: "How would you define an MCP Tool input schema?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPToolSchemaCoding,
    code: ""
  },

  {
    id: "mcp-exception-handling",
    category: "MCP Coding",
    title: "How would you handle MCP exceptions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPExceptionHandling,
    code: ""
  },

  {
    id: "mcp-testing",
    category: "MCP Coding",
    title: "How would you test an MCP server?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: MCPTesting,
    code: ""
  },

  {
    id: "mcp-containerization",
    category: "MCP Coding",
    title: "How would you containerize an MCP server?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPContainerization,
    code: ""
  }

];


export default function MCPPage() {
  return (
    <CookbookApp
      data={MCPQuestion}
      title="MCP Interview Questions Cookbook"
      subtitle="Model Context Protocol"
      icon="🔌"
      patternLabel="Topics"
    />
  );
}