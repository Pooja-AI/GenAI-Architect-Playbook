import CookbookApp from "../../components/CookbookApp";

const DelegatorAgents = [
  // =====================================================
  // 04. DELEGATOR AGENTS
  // =====================================================

  {
    id: "cwd-delegator",
    category: "Delegator Agents",
    title: "Delegator Agents",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the Delegator layer responsible for domain-level task decomposition, domain routing, Worker selection, execution control, and communication between the Coordinator and specialized Worker agents.",

  },
      {
        id: "what-is-delegator",
        category: "Delegator Agents",
        title: "What is a Delegator?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand what a Delegator Agent is, where it fits in the CWD architecture, and how it acts as the domain-level orchestration layer between the Coordinator and specialized Workers.",
        concept: "",
        code: "",
      },

      {
        id: "why-delegator-required",
        category: "Delegator Agents",
        title: "Why Delegator is Required",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand why a dedicated Delegator layer is required between the Coordinator and Workers, including separation of responsibilities, domain isolation, scalability, maintainability, and more efficient task routing.",
        concept: "",
        code: "",
      },

      {
        id: "delegator-responsibilities",
        category: "Delegator Agents",
        title: "Delegator Responsibilities",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the core responsibilities of a Delegator, including domain identification, task decomposition, Worker discovery and selection, execution coordination, policy enforcement, failure handling, and result management.",
        concept: "",
        code: "",
      },

      {
        id: "domain-based-routing",
        category: "Delegator Agents",
        title: "Domain-Based Routing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Delegators identify the appropriate business or technical domain and route incoming tasks to the correct domain-specific Worker agents and capabilities.",
        concept: "",
        code: "",
      },

      {
        id: "delegator-task-decomposition",
        category: "Delegator Agents",
        title: "Task Decomposition",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how Delegators decompose complex domain-level tasks into smaller, well-defined, atomic Worker tasks while preserving dependencies, context, execution order, and required inputs and outputs.",
        concept: "",
        code: "",
      },

      {
        id: "worker-selection",
        category: "Delegator Agents",
        title: "Worker Selection",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Delegator selects the most appropriate Worker based on capabilities, domain ownership, tool access, availability, health, permissions, workload, and task requirements.",
        concept: "",
        code: "",
      },

      {
        id: "worker-pool-management",
        category: "Delegator Agents",
        title: "Worker Pool Management",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Workers are organized, monitored, scaled, and managed within a domain, including load distribution, Worker availability, health status, concurrency, and capacity management.",
        concept: "",
        code: "",
      },

      {
        id: "domain-guardrails",
        category: "Delegator Agents",
        title: "Domain Guardrails",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Delegators enforce domain-specific policies, authorization boundaries, data-access restrictions, allowed capabilities, tool restrictions, validation rules, and other governance controls.",
        concept: "",
        code: "",
      },

      {
        id: "delegator-worker-communication",
        category: "Delegator Agents",
        title: "Delegator-to-Worker Communication",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Delegators communicate with Workers, transfer task context and execution metadata, invoke Worker capabilities, track responses, handle failures, and manage asynchronous or synchronous execution.",
        concept: "",
        code: "",
      },

      {
        id: "multiple-delegator-architecture",
        category: "Delegator Agents",
        title: "Multiple Delegator Architecture",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how multiple domain-specific Delegators can operate within an enterprise CWD architecture, including cross-domain coordination, routing, isolation, scalability, shared governance, and interaction with the central Coordinator.",
        concept: "",
        code: "",
      },

      {
        id: "delegator-interview-questions",
        category: "Delegator Agents",
        title: "Delegator Interview Questions",
        difficulty: "Advanced",
        time: "~20 min",
        description:
          "Prepare for architecture, design, troubleshooting, and scenario-based interview questions covering Delegator responsibilities, domain routing, task decomposition, Worker selection, scalability, guardrails, failures, and Coordinator–Delegator–Worker interactions.",
        concept: "",
        code: "",
      },
   
];

export default function DelegatorAgentsPage() {
  return (
    <CookbookApp
      data={DelegatorAgents}
      title="Delegator Agents Cookbook"
      subtitle="Domain routing, task decomposition, Worker selection and execution"
      icon="🧭"
      patternLabel="Topics"
    />
  );
}

