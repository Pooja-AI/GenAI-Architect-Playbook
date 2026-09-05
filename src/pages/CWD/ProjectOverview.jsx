import CookbookApp from "../../components/CookbookApp";

const CWDProjectOverview = [
  // =====================================================
  // 01. PROJECT OVERVIEW
  // =====================================================

  {
    id: "cwd-project-overview",
    category: "Project Overview",
    title: "Project Overview",
    difficulty: "Intermediate",
    time: "~45 min",
    description:
      "Understand the CWD project from an end-to-end business and technical perspective, including the business context, problem statement, objectives, current state, target state, transition to agentic AI, and the business value delivered by the platform.",

  },
      {
        id: "what-is-cwd",
        category: "Project Overview",
        title: "What is CWD?",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand what CWD is, the purpose of the enterprise AI platform, the problems it addresses, and how it enables users to interact with enterprise knowledge, applications, tools, and specialized AI agents through a unified experience.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-business-context",
        category: "Project Overview",
        title: "Business Context",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the enterprise environment that led to CWD, including fragmented data, multiple business systems, growing AI adoption, domain-specific workflows, and the need for a scalable and governed enterprise AI platform.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-business-problem",
        category: "Project Overview",
        title: "Business Problem",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the key business and technical challenges CWD is designed to solve, including disconnected enterprise knowledge, manual workflows, limited automation, inconsistent AI experiences, difficult system integrations, and lack of centralized governance.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-project-objectives",
        category: "Project Overview",
        title: "Project Objectives",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the primary objectives of CWD, including creating a reusable enterprise AI platform, enabling multi-agent orchestration, integrating enterprise data and tools, improving automation, enforcing security and governance, and providing scalable AI capabilities.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-current-state",
        category: "Project Overview",
        title: "Current State",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the enterprise AI capabilities that existed before CWD, including traditional RAG, individual AI applications, point-to-point integrations, manual workflows, and the limitations of operating isolated AI solutions.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-target-state",
        category: "Project Overview",
        title: "Target / End State",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the target CWD architecture and capabilities, including centralized orchestration, Coordinator–Delegator–Worker agents, enterprise data integration, MCP tools, A2A communication, RAG, state management, observability, security, and scalable deployment.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-why-agentic-ai",
        category: "Project Overview",
        title: "Why Agentic AI?",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand why CWD moves beyond traditional chatbots and standalone RAG by using agentic AI for planning, reasoning, task decomposition, domain routing, tool execution, multi-step workflows, autonomous coordination, and controlled interaction with enterprise systems.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-business-benefits",
        category: "Project Overview",
        title: "Key Business Benefits",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the key business benefits of CWD, including improved employee productivity, faster access to enterprise knowledge, workflow automation, reusable AI capabilities, reduced integration complexity, better governance, scalable adoption, and improved decision support.",
        concept: "",
        code: "",
      },
    
  
];

export default function CWDProjectOverviewPage() {
  return (
    <CookbookApp
      data={CWDProjectOverview}
      title="CWD Project Overview Cookbook"
      subtitle="Business context, problem, objectives, architecture evolution and value"
      icon="📘"
      patternLabel="Topics"
    />
  );
}

