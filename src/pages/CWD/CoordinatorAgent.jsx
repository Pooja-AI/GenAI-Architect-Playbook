import CookbookApp from "../../components/CookbookApp";
const CoordinatorAgent = [
  // =====================================================
  // COORDINATOR AGENT
  // =====================================================

  {
    id: "cwd-coordinator",
    category: "Coordinator Agent",
    title: "Coordinator Agent",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the role of the Coordinator Agent as the central orchestration, planning, coordination, and governance component of the CWD architecture.",

  },
      {
        id: "what-is-coordinator",
        category: "Coordinator Agent",
        title: "What is Coordinator?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the purpose, role, responsibilities, and architectural position of the Coordinator Agent in the CWD platform.",
        concept: "",
        code: "",
      },

      {
        id: "coordinator-responsibilities",
        category: "Coordinator Agent",
        title: "Coordinator Responsibilities",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the responsibilities handled by the Coordinator, including request orchestration, planning, delegation, state management, and result coordination.",
        concept: "",
        code: "",
      },

      {
        id: "request-understanding",
        category: "Coordinator Agent",
        title: "Request Understanding",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator interprets incoming user requests, identifies required actions, and determines the appropriate execution path.",
        concept: "",
        code: "",
      },

      {
        id: "intent-classification",
        category: "Coordinator Agent",
        title: "Intent Classification",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how user intent is identified, classified, and mapped to the appropriate business domain, workflow, or downstream agent.",
        concept: "",
        code: "",
      },

      {
        id: "coordinator-planning",
        category: "Coordinator Agent",
        title: "Planning",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how the Coordinator creates an execution plan, determines task dependencies, identifies required agents, and controls workflow execution.",
        concept: "",
        code: "",
      },

      {
        id: "delegator-selection",
        category: "Coordinator Agent",
        title: "Delegator Selection",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator determines when to invoke the Delegator and how the appropriate Delegator is selected for downstream task execution.",
        concept: "",
        code: "",
      },

      {
        id: "task-creation",
        category: "Coordinator Agent",
        title: "Task Creation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator creates structured tasks, maintains task context, and passes execution requests to downstream agents.",
        concept: "",
        code: "",
      },

      {
        id: "result-aggregation",
        category: "Coordinator Agent",
        title: "Result Aggregation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator collects, validates, combines, and synthesizes results returned by multiple agents or workers.",
        concept: "",
        code: "",
      },

      {
        id: "coordinator-retry-recovery",
        category: "Coordinator Agent",
        title: "Retry & Recovery",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator handles agent failures, timeouts, retries, fallback strategies, partial failures, and recovery workflows.",
        concept: "",
        code: "",
      },

      {
        id: "global-governance",
        category: "Coordinator Agent",
        title: "Global Governance",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how centralized governance, security policies, authorization, guardrails, compliance, and policy enforcement are handled by the Coordinator.",
        concept: "",
        code: "",
      },

      {
        id: "coordinator-interview-questions",
        category: "Coordinator Agent",
        title: "Coordinator Interview Questions",
        difficulty: "Advanced",
        time: "~20 min",
        description:
          "Prepare for architecture, design, troubleshooting, and scenario-based interview questions related to Coordinator Agent implementation and orchestration.",
        concept: "",
        code: "",
      },
  
];

export default function CoordinatorAgentPage() {
  return (
    <CookbookApp
      data={CoordinatorAgent}
      title="Coordinator Agent Cookbook"
      subtitle="Orchestration, planning, delegation and governance"
      icon="🎯"
      patternLabel="Topics"
    />
  );
}

