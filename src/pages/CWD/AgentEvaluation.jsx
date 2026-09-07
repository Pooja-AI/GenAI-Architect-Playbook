import CookbookApp from "../../components/CookbookApp";

import CWDEvaluation from "../../assets/CWD/docs/cwd-evaluation.md?raw";
import AgentEvaluationStrategy from "../../assets/CWD/docs/agent-evaluation-strategy.md?raw";
import GoldenTestSuites from "../../assets/CWD/docs/golden-test-suites.md?raw";
import AgentAccuracy from "../../assets/CWD/docs/agent-accuracy.md?raw";
import AgentConsistency from "../../assets/CWD/docs/agent-consistency.md?raw";
import AgentLatency from "../../assets/CWD/docs/agent-latency.md?raw";
import TokenUsage from "../../assets/CWD/docs/token-usage.md?raw";
import AgentCost from "../../assets/CWD/docs/agent-cost.md?raw";
import ToolSuccessRate from "../../assets/CWD/docs/tool-success-rate.md?raw";
import RegressionTesting from "../../assets/CWD/docs/regression-testing.md?raw";
import ABEvaluation from "../../assets/CWD/docs/ab-evaluation.md?raw";  

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
  concept: CWDEvaluation,
    },
      {
        id: "agent-evaluation-strategy",
        category: "Agent Evaluation",
        title: "Agent Evaluation Strategy",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand the overall evaluation strategy.",
        concept: AgentEvaluationStrategy,
        code: "",
      },
      {
        id: "golden-test-suites",
        category: "Agent Evaluation",
        title: "Golden Test Suites",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand golden datasets and test cases.",
        concept: GoldenTestSuites,
        code: "",
      },
      {
        id: "agent-accuracy",
        category: "Agent Evaluation",
        title: "Accuracy",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand accuracy measurement.",
        concept: AgentAccuracy,
        code: "",
      },
      {
        id: "agent-consistency",
        category: "Agent Evaluation",
        title: "Consistency",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand agent-consistency evaluation.",
        concept: AgentConsistency,
        code: "",
      },
      {
        id: "agent-latency",
        category: "Agent Evaluation",
        title: "Latency",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand agent-latency measurement.",
        concept: AgentLatency,
        code: "",
      },
      {
        id: "token-usage",
        category: "Agent Evaluation",
        title: "Token Usage",
        difficulty: "Intermediate",
        time: "~10 min",
        description: "Understand token-usage consumption.",
        concept: TokenUsage,
        code: "",
      },
      {
        id: "agent-cost",
        category: "Agent Evaluation",
        title: "Cost",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand LLM and infrastructure cost measurement.",
        concept: AgentCost,
        code: "",
      },
      {
        id: "tool-success-rate",
        category: "Agent Evaluation",
        title: "Tool Success Rate",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand tool execution success metrics.",
        concept: ToolSuccessRate,
        code: "",
      },
      {
        id: "regression-testing",
        category: "Agent Evaluation",
        title: "Regression Testing",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand regression testing for agents and prompts.",
        concept: RegressionTesting,
        code: "",
      },
      {
        id: "ab-evaluation",
        category: "Agent Evaluation",
        title: "A/B Evaluation",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand comparison of different agent or prompt versions.",
        concept: ABEvaluation,
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