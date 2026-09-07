import CookbookApp from "../../components/CookbookApp";

import CWDChallenges from "../../assets/CWD/docs/cwd-challenges.md?raw";
import Scalability from "../../assets/CWD/docs/challenge-scalability.md?raw";
import AgentCoordination from "../../assets/CWD/docs/challenge-agent-coordination.md?raw";
import ContextManagement from "../../assets/CWD/docs/challenge-context.md?raw"; 
import Security from "../../assets/CWD/docs/challenge-security.md?raw";
import DataAccess from "../../assets/CWD/docs/challenge-data-access.md?raw";
import Observability from "../../assets/CWD/docs/challenge-observability.md?raw";
import AgentFailures from "../../assets/CWD/docs/challenge-agent-failures.md?raw";
import Cost from "../../assets/CWD/docs/challenge-cost.md?raw";
import Latency from "../../assets/CWD/docs/challenge-latency.md?raw";
import Governance from "../../assets/CWD/docs/challenge-governance.md?raw";
// import CWDChallengesSolutions from "../../assets/CWD/docs/cwd-challenges-solutions.md?raw";
const ChallengesSolutions = [
  // =====================================================
  // CHALLENGES & SOLUTIONS
  // =====================================================

  {
    id: "cwd-challenges",
    category: "Challenges & Solutions",
    title: "Challenges & Solutions",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand the major challenges encountered while designing, implementing, scaling, securing, and operating the CWD enterprise multi-agent platform.",
concept: CWDChallenges,
  },
      {
        id: "challenge-scalability",
        category: "Challenges & Solutions",
        title: "Scalability",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand scalability challenges in multi-agent systems and how horizontal scaling, stateless services, asynchronous processing, and workload distribution can address them.",
        concept: Scalability,
        code: "",
      },

      {
        id: "challenge-agent-coordination",
        category: "Challenges & Solutions",
        title: "Agent Coordination",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand challenges in coordinating multiple agents, including task delegation, execution ordering, dependencies, communication, and state synchronization.",
        concept: AgentCoordination,
        code: "",
      },

      {
        id: "challenge-context",
        category: "Challenges & Solutions",
        title: "Context Management",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand context propagation, context-window limitations, state management, context compression, and maintaining relevant information across multiple agents.",
        concept: ContextManagement,
        code: "",
      },

      {
        id: "challenge-security",
        category: "Challenges & Solutions",
        title: "Security",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand security challenges in agentic systems, including authentication, authorization, tool access, prompt injection, data protection, and agent identity.",
        concept: Security,
        code: "",
      },

      {
        id: "challenge-data-access",
        category: "Challenges & Solutions",
        title: "Data Access",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand enterprise data-access challenges involving permissions, data isolation, heterogeneous sources, secure retrieval, and controlled agent access.",
        concept: DataAccess,
        code: "",
      },

      {
        id: "challenge-observability",
        category: "Challenges & Solutions",
        title: "Observability",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand observability challenges across agents, tools, workflows, and LLM calls, including tracing, logging, metrics, evaluation, and troubleshooting.",
        concept: Observability,
        code: "",
      },

      {
        id: "challenge-agent-failures",
        category: "Challenges & Solutions",
        title: "Agent Failures",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand common agent failure scenarios and recovery strategies such as retries, timeouts, fallbacks, circuit breakers, error handling, and human escalation.",
        concept: AgentFailures,
        code: "",
      },

      {
        id: "challenge-cost",
        category: "Challenges & Solutions",
        title: "Cost",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand LLM and infrastructure cost challenges and techniques such as model selection, token optimization, caching, batching, and controlling unnecessary agent execution.",
        concept: Cost,
        code: "",
      },

      {
        id: "challenge-latency",
        category: "Challenges & Solutions",
        title: "Latency",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand latency challenges in multi-agent execution and techniques such as parallel execution, asynchronous processing, caching, model optimization, and reducing unnecessary tool calls.",
        concept: Latency,
        code: "",
      },

      {
        id: "challenge-governance",
        category: "Challenges & Solutions",
        title: "Governance",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand enterprise AI governance challenges including responsible AI, auditability, access control, model governance, data governance, compliance, and human oversight.",
        concept: Governance,
        code: "",
      },
   
];

export default function ChallengesSolutionsPage() {
  return (
    <CookbookApp
      data={ChallengesSolutions}
      title="Challenges & Solutions Cookbook"
      subtitle="Scalability, security, reliability, cost and governance"
      icon="🛠️"
      patternLabel="Topics"
    />
  );
}

