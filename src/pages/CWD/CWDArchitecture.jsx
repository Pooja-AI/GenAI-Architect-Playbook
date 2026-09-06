import CookbookApp from "../../components/CookbookApp";
import CWDArchitectureN from "../../assets/CWD/docs/cwd-architecture.md?raw";
import CWDArchitectureOverview from "../../assets/CWD/docs/cwd-architecture-overview.md?raw";
import CWDHighLevelArchitecture from "../../assets/CWD/docs/cwd-high-level-architecture.md?raw";
import CWDArchitectureLayers from "../../assets/CWD/docs/cwd-architecture-layers.md?raw";
import CWDComponentArchitecture from "../../assets/CWD/docs/cwd-component-architecture.md?raw";
import CWDLogicalArchitecture from "../../assets/CWD/docs/cwd-logical-architecture.md?raw";
import CWDDeploymentArchitecture from "../../assets/CWD/docs/cwd-deployment-architecture.md?raw";
import CWDEndToEndArchitectureFlow from "../../assets/CWD/docs/cwd-end-to-end-architecture-flow.md?raw";  
const CWDArchitecture = [
  // =====================================================
  // CWD ARCHITECTURE
  // =====================================================

  {
    id: "cwd-architecture",
    category: "CWD Architecture",
    title: "CWD Architecture",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the complete CWD enterprise multi-agent architecture, including its layers, components, deployment model, interactions, and end-to-end execution flow.",
    concept: CWDArchitectureN,
    code: "",
  },
      {
        id: "cwd-architecture-overview",
        category: "CWD Architecture",
        title: "CWD Architecture Overview",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the major components, responsibilities, communication patterns, and interaction model within the CWD enterprise multi-agent architecture.",
        concept: CWDArchitectureOverview,
        code: "",
      },

      {
        id: "cwd-high-level-architecture",
        category: "CWD Architecture",
        title: "High-Level Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the high-level request flow from the user through the gateway, Coordinator, Delegator, Worker agents, tools, enterprise data sources, and final response.",
        concept: CWDHighLevelArchitecture,
        code: "",
      },

      {
        id: "cwd-architecture-layers",
        category: "CWD Architecture",
        title: "Architecture Layers",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the presentation, API gateway, orchestration, Coordinator, Delegator, Worker, tool integration, data, security, observability, and infrastructure layers.",
        concept: CWDArchitectureLayers,
        code: "",
      },

      {
        id: "cwd-component-architecture",
        category: "CWD Architecture",
        title: "Component Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the individual CWD components, their responsibilities, interfaces, dependencies, and how they work together to execute enterprise workflows.",
        concept: CWDComponentArchitecture,
        code: "",
      },

      {
        id: "cwd-logical-architecture",
        category: "CWD Architecture",
        title: "Logical Architecture",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the logical relationships between the Coordinator, Delegator, Worker agents, MCP tools, A2A communication, services, data sources, and supporting platform components.",
        concept: CWDLogicalArchitecture,
        code: "",
      },

      {
        id: "cwd-deployment-architecture",
        category: "CWD Architecture",
        title: "Deployment Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how CWD components are deployed across cloud infrastructure, including compute, networking, messaging, storage, AI services, security, and observability components.",
        concept: CWDDeploymentArchitecture,
        code: "",
      },

      {
        id: "cwd-end-to-end-architecture-flow",
        category: "CWD Architecture",
        title: "End-to-End Architecture Flow",
        difficulty: "Advanced",
        time: "~20 min",
        description:
          "Trace an enterprise request from the user through the gateway, Coordinator, Delegator, Worker agents, MCP tools, data sources, result aggregation, and final response.",
        concept: CWDEndToEndArchitectureFlow,
        code: "",
      },
   
];

export default function CWDArchitecturePage() {
  return (
    <CookbookApp
      data={CWDArchitecture}
      title="CWD Architecture Cookbook"
      subtitle="Multi-agent architecture, components, layers and end-to-end flow"
      icon="🏗️"
      patternLabel="Topics"
    />
  );
}

