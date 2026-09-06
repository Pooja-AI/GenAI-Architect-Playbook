import CookbookApp from "../../components/CookbookApp";
import cwdCoordinator from "../../assets/CWD/docs/cwd-coordinator.md?raw";
import WhatIsCoordinator from "../../assets/CWD/docs/what-is-coordinator.md?raw";
import CoordinatorResponsibilities from "../../assets/CWD/docs/coordinator-responsibilities.md?raw";
import RequestUnderstanding from "../../assets/CWD/docs/request-understanding.md?raw";
import IntentClassification from "../../assets/CWD/docs/intent-classification.md?raw";
import CoordinatorPlanning from "../../assets/CWD/docs/coordinator-planning.md?raw";
import DelegatorSelection from "../../assets/CWD/docs/delegator-selection.md?raw";
import TaskCreation from "../../assets/CWD/docs/task-creation.md?raw";
import ResultAggregation from "../../assets/CWD/docs/result-aggregation.md?raw";
import CoordinatorRetryRecovery from "../../assets/CWD/docs/coordinator-retry-recovery.md?raw";
import GlobalGovernance from "../../assets/CWD/docs/global-governance.md?raw";
//import CoordinatorInterviewQuestions from "../../assets/CWD/docs/coordinator-interview-questions.md?raw";
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
concept: cwdCoordinator,
  },
      {
        id: "what-is-coordinator",
        category: "Coordinator Agent",
        title: "What is Coordinator?",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the purpose, role, responsibilities, and architectural position of the Coordinator Agent in the CWD platform.",
        concept: WhatIsCoordinator,
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
        concept: CoordinatorResponsibilities,
        code: ""
      },

      {
        id: "request-understanding",
        category: "Coordinator Agent",
        title: "Request Understanding",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the Coordinator interprets incoming user requests, identifies required actions, and determines the appropriate execution path.",
        concept: RequestUnderstanding,
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
        concept: IntentClassification,
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
        concept: CoordinatorPlanning,
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
        concept: DelegatorSelection,
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
        concept: TaskCreation,
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
        concept: ResultAggregation,
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
        concept: CoordinatorRetryRecovery,
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
        concept: GlobalGovernance,
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

