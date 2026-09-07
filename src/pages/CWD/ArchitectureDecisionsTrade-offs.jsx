import CookbookApp from "../../components/CookbookApp";

import CWDDecision from "../../assets/CWD/docs/cwd-decisions.md?raw";
import WhyCWD from "../../assets/CWD/docs/why-cwd.md?raw";
import WhyCoordinator from "../../assets/CWD/docs/why-coordinator.md?raw";
import WhyDelegator from "../../assets/CWD/docs/why-delegator.md?raw";
import WhyWorkers from "../../assets/CWD/docs/why-workers.md?raw";
import WhyLangGraph from "../../assets/CWD/docs/why-langgraph.md?raw";
import WhyMCP from "../../assets/CWD/docs/why-mcp.md?raw";
import WhyA2A from "../../assets/CWD/docs/why-a2a.md?raw";
import WhyKafka from "../../assets/CWD/docs/why-kafka.md?raw";
import WhyServiceBus from "../../assets/CWD/docs/why-service-bus.md?raw";
import WhyRedis from "../../assets/CWD/docs/why-redis.md?raw";
import WhyAzureAISearch from "../../assets/CWD/docs/why-azure-ai-search.md?raw";
import BuildVsBuy from "../../assets/CWD/docs/build-vs-buy.md?raw"; 
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
concept: CWDDecision,
  },
      {
        id: "why-cwd",
        category: "Architecture Decisions",
        title: "Why CWD?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why CWD was selected as the enterprise architecture approach for building a scalable, modular, and governed multi-agent platform.",
        concept: WhyCWD,
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
        concept: WhyCoordinator,
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
        concept: WhyDelegator,
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
        concept: WhyWorkers,
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
        concept: WhyLangGraph,
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
        concept: WhyMCP,
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
        concept: WhyA2A,
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
        concept: WhyKafka,
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
        concept: WhyServiceBus,
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
        concept: WhyAzureAISearch,
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
        concept: BuildVsBuy,
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

