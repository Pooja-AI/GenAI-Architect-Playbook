import CookbookApp from "../../components/CookbookApp";

const AgentEvaluation = [
  // =====================================================
  // AGENT EVALUATION
  // =====================================================
  {
    id: "cwd-evaluation",
    category: "Agent Evaluation",
    title: "Agent Evaluation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand how agents and workflows are evaluated for quality, reliability, latency, and cost.",
  },
      {
        id: "agent-evaluation-strategy",
        category: "Agent Evaluation",
        title: "Agent Evaluation Strategy",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand the overall evaluation strategy.",
        concept: "",
        code: "",
      },
      {
        id: "golden-test-suites",
        category: "Agent Evaluation",
        title: "Golden Test Suites",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand golden datasets and test cases.",
        concept: "",
        code: "",
      },
      {
        id: "agent-accuracy",
        category: "Agent Evaluation",
        title: "Accuracy",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand accuracy measurement.",
        concept: "",
        code: "",
      },
      {
        id: "agent-consistency",
        category: "Agent Evaluation",
        title: "Consistency",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand consistency evaluation.",
        concept: "",
        code: "",
      },
      {
        id: "agent-latency",
        category: "Agent Evaluation",
        title: "Latency",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand latency measurement.",
        concept: "",
        code: "",
      },
      {
        id: "token-usage",
        category: "Agent Evaluation",
        title: "Token Usage",
        difficulty: "Intermediate",
        time: "~10 min",
        description: "Understand token consumption.",
        concept: "",
        code: "",
      },
      {
        id: "agent-cost",
        category: "Agent Evaluation",
        title: "Cost",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand LLM and infrastructure cost measurement.",
        concept: "",
        code: "",
      },
      {
        id: "tool-success-rate",
        category: "Agent Evaluation",
        title: "Tool Success Rate",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand tool execution success metrics.",
        concept: "",
        code: "",
      },
      {
        id: "regression-testing",
        category: "Agent Evaluation",
        title: "Regression Testing",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand regression testing for agents and prompts.",
        concept: "",
        code: "",
      },
      {
        id: "ab-evaluation",
        category: "Agent Evaluation",
        title: "A/B Evaluation",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand comparison of different agent or prompt versions.",
        concept: "",
        code: "",
      },
   
];

export default function AgentEvaluationPage() {
  return (
    <CookbookApp
      data={AgentEvaluation}
      title="Agent Evaluation Cookbook"
      subtitle="Quality, reliability, latency and cost"
      icon="📊"
      patternLabel="Topics"
    />
  );
}