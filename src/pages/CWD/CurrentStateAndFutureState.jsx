import CookbookApp from "../../components/CookbookApp";

const CurrentFutureState = [
  // =====================================================
  // CURRENT STATE VS FUTURE STATE
  // =====================================================

  {
    id: "cwd-current-future-state",
    category: "Current State vs Future State",
    title: "Current State vs Future State",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand the evolution from legacy RAG and current AIOPS capabilities toward the CWD enterprise multi-agent platform and its future evolution.",

  },
      {
        id: "legacy-rag",
        category: "Current State vs Future State",
        title: "Legacy RAG",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand traditional RAG architecture, its capabilities, limitations, and challenges when applied to complex enterprise use cases.",
        concept: "",
        code: "",
      },

      {
        id: "current-aiops",
        category: "Current State vs Future State",
        title: "Current AIOPS",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the capabilities, architecture, workflows, and limitations of the existing AIOPS platform.",
        concept: "",
        code: "",
      },

      {
        id: "cwd-adoption",
        category: "Current State vs Future State",
        title: "CWD Adoption",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD is introduced into the existing platform while preserving existing capabilities and enabling multi-agent workflows.",
        concept: "",
        code: "",
      },

      {
        id: "platform-hardening",
        category: "Current State vs Future State",
        title: "Platform Hardening",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand production hardening of the CWD platform across security, reliability, scalability, observability, governance, and operational readiness.",
        concept: "",
        code: "",
      },

      {
        id: "future-agent-expansion",
        category: "Current State vs Future State",
        title: "Future Agent Expansion",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how additional domain-specific agents can be introduced, registered, discovered, governed, and integrated into the CWD platform.",
        concept: "",
        code: "",
      },

      {
        id: "migration-strategy",
        category: "Current State vs Future State",
        title: "Migration Strategy",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the phased migration strategy from existing AIOPS and RAG capabilities toward the CWD architecture while minimizing business and operational risk.",
        concept: "",
        code: "",
      },
  
];

export default function CurrentFutureStatePage() {
  return (
    <CookbookApp
      data={CurrentFutureState}
      title="Current State vs Future State Cookbook"
      subtitle="Legacy RAG, AIOPS evolution and CWD adoption"
      icon="🔄"
      patternLabel="Topics"
    />
  );
}

