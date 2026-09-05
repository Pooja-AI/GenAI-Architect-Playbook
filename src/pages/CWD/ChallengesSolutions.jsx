import CookbookApp from "../../components/CookbookApp";

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

  },
      {
        id: "challenge-scalability",
        category: "Challenges & Solutions",
        title: "Scalability",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand scalability challenges in multi-agent systems and how horizontal scaling, stateless services, asynchronous processing, and workload distribution can address them.",
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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
        concept: "",
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

