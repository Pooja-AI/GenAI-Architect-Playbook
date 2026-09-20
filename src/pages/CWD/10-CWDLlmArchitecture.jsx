import CookbookApp from "../../components/CookbookApp";
import Q233 from "../../assets/CWD/docs/10-llm-architecture/233-which-llms-did-you-use.md?raw";
import Q234 from "../../assets/CWD/docs/10-llm-architecture/234-why-did-you-select-the-model.md?raw";
import Q235 from "../../assets/CWD/docs/10-llm-architecture/235-how-to-select-between-large-and-small-models.md?raw";
import Q236 from "../../assets/CWD/docs/10-llm-architecture/236-how-to-control-token-usage.md?raw";
import Q237 from "../../assets/CWD/docs/10-llm-architecture/237-what-happens-when-context-exceeds-model-limit.md?raw";
import Q238 from "../../assets/CWD/docs/10-llm-architecture/238-how-to-reduce-prompt-size.md?raw";
import Q239 from "../../assets/CWD/docs/10-llm-architecture/239-how-to-summarize-conversation-history.md?raw";
import Q240 from "../../assets/CWD/docs/10-llm-architecture/240-how-to-implement-model-fallback.md?raw";
import Q241 from "../../assets/CWD/docs/10-llm-architecture/241-what-happens-if-azure-openai-is-unavailable.md?raw";
import Q242 from "../../assets/CWD/docs/10-llm-architecture/242-would-you-use-multiple-llm-providers.md?raw";
import Q243 from "../../assets/CWD/docs/10-llm-architecture/243-how-to-route-requests-between-models.md?raw";
import Q244 from "../../assets/CWD/docs/10-llm-architecture/244-how-to-control-temperature.md?raw";
import Q245 from "../../assets/CWD/docs/10-llm-architecture/245-how-to-control-hallucination.md?raw";
import Q246 from "../../assets/CWD/docs/10-llm-architecture/246-how-to-enforce-structured-output.md?raw";
import Q247 from "../../assets/CWD/docs/10-llm-architecture/247-how-to-validate-llm-output.md?raw";
import Q248 from "../../assets/CWD/docs/10-llm-architecture/248-what-happens-when-json-output-is-invalid.md?raw";
import Q249 from "../../assets/CWD/docs/10-llm-architecture/249-how-to-handle-model-timeouts.md?raw";
import Q250 from "../../assets/CWD/docs/10-llm-architecture/250-how-to-handle-rate-limits.md?raw";
import Q251 from "../../assets/CWD/docs/10-llm-architecture/251-how-to-handle-token-throttling.md?raw";
import Q252 from "../../assets/CWD/docs/10-llm-architecture/252-how-to-monitor-model-cost.md?raw";

const CWDLlmArchitecture = [
  // =====================================================
  // 10. LLM ARCHITECTURE
  // =====================================================

  {
    id: "233-which-llms-did-you-use",
    category: "LLM Architecture",
    title: "Which LLMs did you use?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q233,
    code: "",
  },

  {
    id: "234-why-did-you-select-the-model",
    category: "LLM Architecture",
    title: "Why did you select the model?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q234,
    code: "",
  },

  {
    id: "235-how-to-select-between-large-and-small-models",
    category: "LLM Architecture",
    title: "How do you select between large and small models?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q235,
    code: "",
  },

  {
    id: "236-how-to-control-token-usage",
    category: "LLM Architecture",
    title: "How do you control token usage?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q236,
    code: "",
  },

  {
    id: "237-what-happens-when-context-exceeds-model-limit",
    category: "LLM Architecture",
    title: "What happens when the context exceeds the model limit?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q237,
    code: "",
  },

  {
    id: "238-how-to-reduce-prompt-size",
    category: "LLM Architecture",
    title: "How do you reduce prompt size?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q238,
    code: "",
  },

  {
    id: "239-how-to-summarize-conversation-history",
    category: "LLM Architecture",
    title: "How do you summarize conversation history?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q239,
    code: "",
  },

  {
    id: "240-how-to-implement-model-fallback",
    category: "LLM Architecture",
    title: "How do you implement model fallback?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q240,
    code: "",
  },

  {
    id: "241-what-happens-if-azure-openai-is-unavailable",
    category: "LLM Architecture",
    title: "What happens if Azure OpenAI is unavailable?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q241,
    code: "",
  },

  {
    id: "242-would-you-use-multiple-llm-providers",
    category: "LLM Architecture",
    title: "Would you use multiple LLM providers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q242,
    code: "",
  },

  {
    id: "243-how-to-route-requests-between-models",
    category: "LLM Architecture",
    title: "How do you route requests between models?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q243,
    code: "",
  },

  {
    id: "244-how-to-control-temperature",
    category: "LLM Architecture",
    title: "How do you control temperature?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q244,
    code: "",
  },

  {
    id: "245-how-to-control-hallucination",
    category: "LLM Architecture",
    title: "How do you control hallucination?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q245,
    code: "",
  },

  {
    id: "246-how-to-enforce-structured-output",
    category: "LLM Architecture",
    title: "How do you enforce structured output?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q246,
    code: "",
  },

  {
    id: "247-how-to-validate-llm-output",
    category: "LLM Architecture",
    title: "How do you validate LLM output?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q247,
    code: "",
  },

  {
    id: "248-what-happens-when-json-output-is-invalid",
    category: "LLM Architecture",
    title: "What happens when JSON output is invalid?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q248,
    code: "",
  },

  {
    id: "249-how-to-handle-model-timeouts",
    category: "LLM Architecture",
    title: "How do you handle model timeouts?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q249,
    code: "",
  },

  {
    id: "250-how-to-handle-rate-limits",
    category: "LLM Architecture",
    title: "How do you handle rate limits?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q250,
    code: "",
  },

  {
    id: "251-how-to-handle-token-throttling",
    category: "LLM Architecture",
    title: "How do you handle token throttling?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q251,
    code: "",
  },

  {
    id: "252-how-to-monitor-model-cost",
    category: "LLM Architecture",
    title: "How do you monitor model cost?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: model selection, token control, fallback, routing and structured output.",
    concept: Q252,
    code: "",
  },

];

export default function CWDLlmArchitecturePage() {
  return (
    <CookbookApp
      data={CWDLlmArchitecture}
      title="CWD LLM Architecture Cookbook"
      subtitle="Model selection, token control, fallback, routing and structured output"
      icon="🧠"
      patternLabel="Questions"
    />
  );
}
