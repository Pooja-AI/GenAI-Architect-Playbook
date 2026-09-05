import CookbookApp from "../../components/CookbookApp";

const LLMOpsMLOps = [
  // =====================================================
  // 24. LLMOPS / MLOPS
  // =====================================================

  {
    id: "cwd-llmops",
    category: "LLMOps / MLOps",
    title: "LLMOps / MLOps",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the end-to-end production lifecycle for models, prompts, agents, datasets, evaluations, experiments, deployments, monitoring, versioning, and governance required to operate CWD reliably at enterprise scale.",

  },
      {
        id: "model-management",
        category: "LLMOps / MLOps",
        title: "Model Management",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how AI and ML models are managed throughout their lifecycle, including model selection, registration, validation, deployment, retirement, performance tracking, and managing multiple model versions across environments.",
        concept: "",
        code: "",
      },

      {
        id: "prompt-management",
        category: "LLMOps / MLOps",
        title: "Prompt Management",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how production prompts are designed, stored, tested, versioned, evaluated, deployed, and rolled back, including prompt templates, variables, model-specific configurations, and controlled prompt changes.",
        concept: "",
        code: "",
      },

      {
        id: "llmops-evaluation",
        category: "LLMOps / MLOps",
        title: "Evaluation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand AI evaluation pipelines for measuring response quality, correctness, groundedness, relevance, safety, latency, and task success across models, prompts, RAG pipelines, and agent workflows.",
        concept: "",
        code: "",
      },

      {
        id: "experiment-tracking",
        category: "LLMOps / MLOps",
        title: "Experiment Tracking",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how experiments are tracked across models, prompts, datasets, parameters, evaluation results, and configurations so teams can reproduce experiments and compare different AI approaches systematically.",
        concept: "",
        code: "",
      },

      {
        id: "llmops-mlflow",
        category: "LLMOps / MLOps",
        title: "MLflow",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how MLflow can support experiment tracking, model lifecycle management, evaluation, artifact management, model versioning, and operational workflows across traditional ML and GenAI applications.",
        concept: "",
        code: "",
      },

      {
        id: "cicd",
        category: "LLMOps / MLOps",
        title: "CI/CD",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CI/CD pipelines automate testing, validation, security checks, packaging, infrastructure changes, and controlled promotion of AI application and agent changes across development, test, staging, and production environments.",
        concept: "",
        code: "",
      },

      {
        id: "ai-deployment",
        category: "LLMOps / MLOps",
        title: "Deployment",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand production deployment strategies for AI applications and agents, including containerized deployment, blue-green releases, canary deployments, rollback strategies, environment configuration, scaling, and zero-downtime releases.",
        concept: "",
        code: "",
      },

      {
        id: "llmops-monitoring",
        category: "LLMOps / MLOps",
        title: "Monitoring",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand AI application monitoring across infrastructure, agents, LLM calls, prompts, RAG retrieval, tools, latency, token usage, cost, errors, throughput, quality, and user experience.",
        concept: "",
        code: "",
      },

      {
        id: "ai-versioning",
        category: "LLMOps / MLOps",
        title: "Versioning",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand version control for models, prompts, agents, workflows, tools, datasets, configurations, evaluation criteria, and infrastructure so production behavior can be reproduced, audited, and rolled back.",
        concept: "",
        code: "",
      },

      {
        id: "ai-governance",
        category: "LLMOps / MLOps",
        title: "Governance",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand governance throughout the AI lifecycle, including security, responsible AI, access control, data governance, model approval, evaluation gates, auditability, compliance, risk management, monitoring, and controlled production releases.",
        concept: "",
        code: "",
      },
    
  
];

export default function LLMOpsMLOpsPage() {
  return (
    <CookbookApp
      data={LLMOpsMLOps}
      title="LLMOps / MLOps Cookbook"
      subtitle="Models, prompts, evaluation, deployment, monitoring and governance"
      icon="⚙️"
      patternLabel="Topics"
    />
  );
}

