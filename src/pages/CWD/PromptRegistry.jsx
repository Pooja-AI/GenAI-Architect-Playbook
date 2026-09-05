import CookbookApp from "../../components/CookbookApp";

const PromptRegistry = [
  // =====================================================
  // 11. PROMPT REGISTRY
  // =====================================================

  {
    id: "cwd-prompt-registry",
    category: "Prompt Registry",
    title: "Prompt Registry",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand enterprise prompt management through a centralized Prompt Registry, including prompt creation, versioning, metadata, classification, approval, access control, lifecycle management, testing, deployment, rollback, and governance.",

  },
      {
        id: "why-prompt-registry",
        category: "Prompt Registry",
        title: "Why Prompt Registry?",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand why enterprise AI platforms require centralized prompt management instead of storing prompts directly inside application code, including consistency, reuse, traceability, testing, controlled changes, and governance.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-versioning",
        category: "Prompt Registry",
        title: "Prompt Versioning",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how prompt versions are created, tracked, compared, tested, promoted, and rolled back so changes to production prompts remain controlled, traceable, and reproducible.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-metadata",
        category: "Prompt Registry",
        title: "Prompt Metadata",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand metadata associated with enterprise prompts, including prompt name, version, owner, purpose, model compatibility, variables, environment, domain, status, evaluation results, approval information, and usage history.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-approval",
        category: "Prompt Registry",
        title: "Prompt Approval",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand production prompt approval workflows, including authoring, validation, evaluation, security review, business approval, deployment gates, audit trails, and controlled promotion from development to production.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-classification",
        category: "Prompt Registry",
        title: "Prompt Classification",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how prompts can be classified based on purpose, domain, sensitivity, risk level, model usage, business criticality, and allowed capabilities to apply appropriate testing, approval, and governance policies.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-rbac",
        category: "Prompt Registry",
        title: "RBAC",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand role-based access control for prompt management, including who can create, view, modify, approve, publish, deploy, rollback, or retire prompts and how access is restricted based on roles and responsibilities.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-lifecycle",
        category: "Prompt Registry",
        title: "Prompt Lifecycle",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the complete enterprise prompt lifecycle from design and development through testing, evaluation, approval, registration, deployment, monitoring, version updates, rollback, deprecation, and retirement.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-governance",
        category: "Prompt Registry",
        title: "Prompt Governance",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand governance controls for enterprise prompts, including ownership, approval policies, auditability, security reviews, sensitive-data protection, prompt injection defenses, evaluation requirements, change management, compliance, and production controls.",
        concept: "",
        code: "",
      },
    
];

export default function PromptRegistryPage() {
  return (
    <CookbookApp
      data={PromptRegistry}
      title="Prompt Registry Cookbook"
      subtitle="Prompt versioning, metadata, approval, RBAC, lifecycle and governance"
      icon="📝"
      patternLabel="Topics"
    />
  );
}

