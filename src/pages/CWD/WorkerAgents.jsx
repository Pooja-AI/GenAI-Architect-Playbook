import CookbookApp from "../../components/CookbookApp";

// =====================================================
// 05. WORKER AGENTS
// =====================================================

const WorkerAgents = [
  {
    id: "cwd-workers",
    category: "Worker Agents",
    title: "Worker Agents",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand specialized Worker Agents in CWD that execute focused business tasks using enterprise data, APIs, tools, RAG, and governed services while returning validated results to the Delegator.",
  },
      {
        id: "what-is-worker",
        category: "Worker Agents",
        title: "What is a Worker?",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the role of a Worker Agent as a specialized execution component responsible for performing a well-defined business or technical task delegated by the Delegator.",
        concept: "",
        code: "",
      },

      {
        id: "worker-responsibilities",
        category: "Worker Agents",
        title: "Worker Responsibilities",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand Worker responsibilities including task execution, tool selection, data retrieval, business logic, validation, error handling, and returning structured results to the Delegator.",
        concept: "",
        code: "",
      },

      {
        id: "atomic-task-execution",
        category: "Worker Agents",
        title: "Atomic Task Execution",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers execute focused atomic tasks with clear inputs, defined responsibilities, controlled tool access, deterministic processing where possible, and structured outputs.",
        concept: "",
        code: "",
      },

      {
        id: "worker-tool-calling",
        category: "Worker Agents",
        title: "Tool Calling",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers discover and invoke authorized enterprise tools through mechanisms such as MCP while enforcing tool permissions, input validation, and execution policies.",
        concept: "",
        code: "",
      },

      {
        id: "worker-data-retrieval",
        category: "Worker Agents",
        title: "Data Retrieval",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers retrieve governed enterprise information using RAG, search services, databases, APIs, and other authorized data sources while respecting user entitlements.",
        concept: "",
        code: "",
      },

      {
        id: "worker-api-integration",
        category: "Worker Agents",
        title: "API Integration",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers securely interact with enterprise APIs and microservices for retrieving information, executing business operations, and integrating with downstream systems.",
        concept: "",
        code: "",
      },

      {
        id: "artifact-generation",
        category: "Worker Agents",
        title: "Artifact Generation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers generate structured artifacts such as customer briefings, reports, summaries, documents, recommendations, and other business outputs.",
        concept: "",
        code: "",
      },

      {
        id: "worker-output-validation",
        category: "Worker Agents",
        title: "Output Validation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Worker outputs are validated for schema correctness, completeness, business rules, authorization, data quality, and grounding before being returned to the Delegator.",
        concept: "",
        code: "",
      },

      {
        id: "worker-error-handling",
        category: "Worker Agents",
        title: "Error Handling",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers detect transient and permanent failures, apply retry and timeout policies, capture errors, and return controlled failure information for Delegator-level recovery.",
        concept: "",
        code: "",
      },

      {
        id: "worker-pool",
        category: "Worker Agents",
        title: "Worker Pool",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand Worker pooling, horizontal scaling, workload distribution, concurrency, health management, capacity planning, and dynamic Worker selection for reliable enterprise execution.",
        concept: "",
        code: "",
      },

      {
        id: "worker-interview-questions",
        category: "Worker Agents",
        title: "Worker Interview Questions",
        difficulty: "Advanced",
        time: "~20 min",
        description:
          "Prepare for architecture and scenario-based interview questions covering Worker responsibilities, task boundaries, tool calling, RAG, security, scalability, failure handling, and Delegator-to-Worker communication.",
        concept: "",
        code: "",
      },
    
];

export default function WorkerAgentsPage() {
  return (
    <CookbookApp
      data={WorkerAgents}
      title="Worker Agents Cookbook"
      subtitle="Atomic execution, tools, enterprise data, validation and scalability"
      icon="⚙️"
      patternLabel="Topics"
    />
  );
}

