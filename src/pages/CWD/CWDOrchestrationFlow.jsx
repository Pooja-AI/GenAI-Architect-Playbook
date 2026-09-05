import CookbookApp from "../../components/CookbookApp";

const CWDOrchestration = [
  // =====================================================
  // CWD ORCHESTRATION
  // =====================================================

  {
    id: "cwd-orchestration",
    category: "CWD Orchestration",
    title: "CWD Orchestration Flow",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand the complete request orchestration flow across the CWD platform, from user request and gateway validation through Coordinator, Delegator, Worker execution, data access, result aggregation, and final response.",

  },
      {
        id: "cwd-user-request",
        category: "CWD Orchestration",
        title: "User Request",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how a user request enters the CWD platform and how the request is captured, validated, and prepared for downstream processing.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-gateway",
        category: "CWD Orchestration",
        title: "Gateway",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the gateway handles request routing, authentication, validation, security checks, and controlled entry into the agentic platform.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-entitlement-check",
        category: "CWD Orchestration",
        title: "Entitlement Check",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how user identity, authorization, roles, permissions, and entitlements are validated before allowing access to agents, tools, and enterprise data.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-coordinator-flow",
        category: "CWD Orchestration",
        title: "Coordinator",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator interprets the request, determines intent, creates an execution plan, manages workflow state, and controls downstream orchestration.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-delegator-flow",
        category: "CWD Orchestration",
        title: "Delegator",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Delegator decomposes tasks, identifies the appropriate domain or Worker agents, and routes tasks for execution.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-worker-flow",
        category: "CWD Orchestration",
        title: "Worker",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how specialized Worker agents execute assigned tasks using domain logic, LLM capabilities, tools, APIs, and enterprise data.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-data-sources",
        category: "CWD Orchestration",
        title: "Data Sources",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Worker agents securely access enterprise data sources through retrieval systems, APIs, MCP tools, databases, and other connected services.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-result-aggregation",
        category: "CWD Orchestration",
        title: "Result Aggregation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how results from multiple Workers, tools, and data sources are collected, validated, combined, and returned to the Coordinator.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-final-response",
        category: "CWD Orchestration",
        title: "Final Response",
        difficulty: "Intermediate",
        time: "~5 min",
        description:
          "Understand how the Coordinator synthesizes the completed workflow results into a final response and returns it securely to the user.",
        concept: "",
        code: "",
      },
   
];

export default function CWDOrchestrationPage() {
  return (
    <CookbookApp
      data={CWDOrchestration}
      title="CWD Orchestration Cookbook"
      subtitle="Request flow, coordination, delegation, execution and response"
      icon="🔄"
      patternLabel="Topics"
    />
  );
}

