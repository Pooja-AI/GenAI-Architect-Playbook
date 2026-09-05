import CookbookApp from "../../components/CookbookApp";

const ArchitectureDecisions = [
  // =====================================================
  // ARCHITECTURE DECISIONS
  // =====================================================

  {
    id: "cwd-decisions",
    category: "Architecture Decisions",
    title: "Architecture Decisions & Trade-offs",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the key architectural decisions, rationale, alternatives, and trade-offs behind the CWD enterprise multi-agent architecture.",

  },
      {
        id: "why-cwd",
        category: "Architecture Decisions",
        title: "Why CWD?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why CWD was selected as the enterprise architecture approach for building a scalable, modular, and governed multi-agent platform.",
        concept: "",
        code: "",
      },

      {
        id: "why-coordinator",
        category: "Architecture Decisions",
        title: "Why Coordinator?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why a Coordinator layer is required to manage request orchestration, workflow execution, and communication between agents.",
        concept: "",
        code: "",
      },

      {
        id: "why-delegator",
        category: "Architecture Decisions",
        title: "Why Delegator?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the architectural rationale for the Delegator layer and how it selects the appropriate specialized worker or agent.",
        concept: "",
        code: "",
      },

      {
        id: "why-workers",
        category: "Architecture Decisions",
        title: "Why Workers?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why specialized Worker agents are used to isolate domain responsibilities and execute specific business tasks.",
        concept: "",
        code: "",
      },

      {
        id: "why-langgraph",
        category: "Architecture Decisions",
        title: "Why LangGraph?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the decision to use LangGraph for stateful workflows, agent orchestration, branching, retries, and multi-agent coordination.",
        concept: "",
        code: "",
      },

      {
        id: "why-mcp",
        category: "Architecture Decisions",
        title: "Why MCP?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the rationale for using MCP to standardize how agents discover and interact with enterprise tools, APIs, and data sources.",
        concept: "",
        code: "",
      },

      {
        id: "why-a2a",
        category: "Architecture Decisions",
        title: "Why A2A?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the rationale for agent-to-agent communication and how independent agents collaborate, delegate tasks, and exchange results.",
        concept: "",
        code: "",
      },

      {
        id: "why-kafka",
        category: "Architecture Decisions",
        title: "Why Kafka?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand when and why Kafka is used for event-driven communication, asynchronous processing, scalability, and reliable event streaming.",
        concept: "",
        code: "",
      },

      {
        id: "why-service-bus",
        category: "Architecture Decisions",
        title: "Why Service Bus?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the rationale for using Azure Service Bus for reliable asynchronous messaging, decoupling, retries, and enterprise integration.",
        concept: "",
        code: "",
      },

      {
        id: "why-redis",
        category: "Architecture Decisions",
        title: "Why Redis?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why Redis is used for low-latency state access, caching, session management, and temporary agent state.",
        concept: "",
        code: "",
      },

      {
        id: "why-azure-ai-search",
        category: "Architecture Decisions",
        title: "Why Azure AI Search?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the rationale for Azure AI Search in enterprise document indexing, hybrid search, vector retrieval, metadata filtering, and RAG workflows.",
        concept: "",
        code: "",
      },

      {
        id: "build-vs-buy",
        category: "Architecture Decisions",
        title: "Build vs Buy Decisions",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how architecture components are evaluated using cost, scalability, security, maintainability, integration, and time-to-market considerations.",
        concept: "",
        code: "",
      },
    
];

export default function ArchitectureDecisionsPage() {
  return (
    <CookbookApp
      data={ArchitectureDecisions}
      title="Architecture Decisions Cookbook"
      subtitle="Architectural rationale, alternatives and trade-offs"
      icon="🏗️"
      patternLabel="Topics"
    />
  );
}

