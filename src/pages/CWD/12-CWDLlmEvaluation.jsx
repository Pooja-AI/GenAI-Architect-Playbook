import CookbookApp from "../../components/CookbookApp";
import Q267 from "../../assets/CWD/docs/12-llm-evaluation/267-how-do-you-evaluate-your-cwd-system.md?raw";
import Q268 from "../../assets/CWD/docs/12-llm-evaluation/268-what-is-offline-evaluation.md?raw";
import Q269 from "../../assets/CWD/docs/12-llm-evaluation/269-what-is-online-evaluation.md?raw";
import Q270 from "../../assets/CWD/docs/12-llm-evaluation/270-what-is-a-golden-dataset.md?raw";
import Q271 from "../../assets/CWD/docs/12-llm-evaluation/271-how-to-create-golden-test-cases.md?raw";
import Q272 from "../../assets/CWD/docs/12-llm-evaluation/272-what-metrics-do-you-track.md?raw";
import Q273 from "../../assets/CWD/docs/12-llm-evaluation/273-retrieval-relevance.md?raw";
import Q274 from "../../assets/CWD/docs/12-llm-evaluation/274-context-precision.md?raw";
import Q275 from "../../assets/CWD/docs/12-llm-evaluation/275-context-recall.md?raw";
import Q276 from "../../assets/CWD/docs/12-llm-evaluation/276-faithfulness.md?raw";
import Q277 from "../../assets/CWD/docs/12-llm-evaluation/277-answer-relevance.md?raw";
import Q278 from "../../assets/CWD/docs/12-llm-evaluation/278-tool-call-accuracy.md?raw";
import Q279 from "../../assets/CWD/docs/12-llm-evaluation/279-agent-routing-accuracy.md?raw";
import Q280 from "../../assets/CWD/docs/12-llm-evaluation/280-task-completion-rate.md?raw";
import Q281 from "../../assets/CWD/docs/12-llm-evaluation/281-hallucination-rate.md?raw";
import Q282 from "../../assets/CWD/docs/12-llm-evaluation/282-latency.md?raw";
import Q283 from "../../assets/CWD/docs/12-llm-evaluation/283-cost-per-request.md?raw";
import Q284 from "../../assets/CWD/docs/12-llm-evaluation/284-how-to-evaluate-agent-trajectories.md?raw";
import Q285 from "../../assets/CWD/docs/12-llm-evaluation/285-how-to-evaluate-tool-selection.md?raw";
import Q286 from "../../assets/CWD/docs/12-llm-evaluation/286-how-to-evaluate-final-answers.md?raw";
import Q287 from "../../assets/CWD/docs/12-llm-evaluation/287-how-to-perform-regression-testing.md?raw";
import Q288 from "../../assets/CWD/docs/12-llm-evaluation/288-what-happens-when-a-new-prompt-reduces-accuracy.md?raw";
import Q289 from "../../assets/CWD/docs/12-llm-evaluation/289-how-to-compare-two-llm-versions.md?raw";
import Q290 from "../../assets/CWD/docs/12-llm-evaluation/290-how-to-implement-llm-evaluation-in-ci-cd.md?raw";
import Q291 from "../../assets/CWD/docs/12-llm-evaluation/291-what-is-your-production-evaluation-strategy.md?raw";
import Q292 from "../../assets/CWD/docs/12-llm-evaluation/292-how-human-evaluations-fit-into-the-system.md?raw";

const CWDLlmEvaluation = [
  // =====================================================
  // 12. LLM EVALUATION
  // =====================================================

  {
    id: "267-how-do-you-evaluate-your-cwd-system",
    category: "LLM Evaluation",
    title: "How do you evaluate your CWD system?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q267,
    code: "",
  },

  {
    id: "268-what-is-offline-evaluation",
    category: "LLM Evaluation",
    title: "What is offline evaluation?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q268,
    code: "",
  },

  {
    id: "269-what-is-online-evaluation",
    category: "LLM Evaluation",
    title: "What is online evaluation?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q269,
    code: "",
  },

  {
    id: "270-what-is-a-golden-dataset",
    category: "LLM Evaluation",
    title: "What is a golden dataset?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q270,
    code: "",
  },

  {
    id: "271-how-to-create-golden-test-cases",
    category: "LLM Evaluation",
    title: "How do you create golden test cases?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q271,
    code: "",
  },

  {
    id: "272-what-metrics-do-you-track",
    category: "LLM Evaluation",
    title: "What metrics do you track?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q272,
    code: "",
  },

  {
    id: "273-retrieval-relevance",
    category: "LLM Evaluation",
    title: "Retrieval relevance?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q273,
    code: "",
  },

  {
    id: "274-context-precision",
    category: "LLM Evaluation",
    title: "Context precision?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q274,
    code: "",
  },

  {
    id: "275-context-recall",
    category: "LLM Evaluation",
    title: "Context recall?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q275,
    code: "",
  },

  {
    id: "276-faithfulness",
    category: "LLM Evaluation",
    title: "Faithfulness?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q276,
    code: "",
  },

  {
    id: "277-answer-relevance",
    category: "LLM Evaluation",
    title: "Answer relevance?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q277,
    code: "",
  },

  {
    id: "278-tool-call-accuracy",
    category: "LLM Evaluation",
    title: "Tool-call accuracy?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q278,
    code: "",
  },

  {
    id: "279-agent-routing-accuracy",
    category: "LLM Evaluation",
    title: "Agent routing accuracy?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q279,
    code: "",
  },

  {
    id: "280-task-completion-rate",
    category: "LLM Evaluation",
    title: "Task completion rate?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q280,
    code: "",
  },

  {
    id: "281-hallucination-rate",
    category: "LLM Evaluation",
    title: "Hallucination rate?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q281,
    code: "",
  },

  {
    id: "282-latency",
    category: "LLM Evaluation",
    title: "Latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q282,
    code: "",
  },

  {
    id: "283-cost-per-request",
    category: "LLM Evaluation",
    title: "Cost per request?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q283,
    code: "",
  },

  {
    id: "284-how-to-evaluate-agent-trajectories",
    category: "LLM Evaluation",
    title: "How do you evaluate agent trajectories?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q284,
    code: "",
  },

  {
    id: "285-how-to-evaluate-tool-selection",
    category: "LLM Evaluation",
    title: "How do you evaluate tool selection?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q285,
    code: "",
  },

  {
    id: "286-how-to-evaluate-final-answers",
    category: "LLM Evaluation",
    title: "How do you evaluate final answers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q286,
    code: "",
  },

  {
    id: "287-how-to-perform-regression-testing",
    category: "LLM Evaluation",
    title: "How do you perform regression testing?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q287,
    code: "",
  },

  {
    id: "288-what-happens-when-a-new-prompt-reduces-accuracy",
    category: "LLM Evaluation",
    title: "What happens when a new prompt reduces accuracy?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q288,
    code: "",
  },

  {
    id: "289-how-to-compare-two-llm-versions",
    category: "LLM Evaluation",
    title: "How do you compare two LLM versions?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q289,
    code: "",
  },

  {
    id: "290-how-to-implement-llm-evaluation-in-ci-cd",
    category: "LLM Evaluation",
    title: "How do you implement LLM evaluation in CI/CD?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q290,
    code: "",
  },

  {
    id: "291-what-is-your-production-evaluation-strategy",
    category: "LLM Evaluation",
    title: "What is your production evaluation strategy?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q291,
    code: "",
  },

  {
    id: "292-how-human-evaluations-fit-into-the-system",
    category: "LLM Evaluation",
    title: "How do human evaluations fit into the system?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: offline and online evaluation, metrics, regression testing and CI/CD.",
    concept: Q292,
    code: "",
  },

];

export default function CWDLlmEvaluationPage() {
  return (
    <CookbookApp
      data={CWDLlmEvaluation}
      title="CWD LLM Evaluation Cookbook"
      subtitle="Offline and online evaluation, metrics, regression testing and CI/CD"
      icon="📊"
      patternLabel="Questions"
    />
  );
}
