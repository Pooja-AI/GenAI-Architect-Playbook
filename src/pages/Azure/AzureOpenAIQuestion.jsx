import CookbookApp from "../../components/CookbookApp";

import Q16 from "../../assets/docs/azure-interview-questions/02-azure-openai/016-why-azure-openai-for-cwd.md?raw";
import Q17 from "../../assets/docs/azure-interview-questions/02-azure-openai/017-which-azure-openai-models-would-you-use.md?raw";
import Q18 from "../../assets/docs/azure-interview-questions/02-azure-openai/018-how-do-you-select-the-appropriate-model.md?raw";
import Q19 from "../../assets/docs/azure-interview-questions/02-azure-openai/019-how-do-you-handle-azure-openai-rate-limits.md?raw";
import Q20 from "../../assets/docs/azure-interview-questions/02-azure-openai/020-how-do-you-handle-token-limit-errors.md?raw";
import Q21 from "../../assets/docs/azure-interview-questions/02-azure-openai/021-how-do-you-handle-model-timeout.md?raw";
import Q22 from "../../assets/docs/azure-interview-questions/02-azure-openai/022-how-do-you-implement-retries.md?raw";
import Q23 from "../../assets/docs/azure-interview-questions/02-azure-openai/023-how-do-you-prevent-retry-storms.md?raw";
import Q24 from "../../assets/docs/azure-interview-questions/02-azure-openai/024-how-do-you-reduce-azure-openai-cost.md?raw";
import Q25 from "../../assets/docs/azure-interview-questions/02-azure-openai/025-how-do-you-reduce-token-consumption.md?raw";
import Q26 from "../../assets/docs/azure-interview-questions/02-azure-openai/026-how-do-you-monitor-azure-openai-usage.md?raw";
import Q27 from "../../assets/docs/azure-interview-questions/02-azure-openai/027-how-do-you-monitor-latency.md?raw";
import Q28 from "../../assets/docs/azure-interview-questions/02-azure-openai/028-how-do-you-implement-model-fallback.md?raw";
import Q29 from "../../assets/docs/azure-interview-questions/02-azure-openai/029-how-do-you-perform-model-evaluation-before-production.md?raw";
import Q30 from "../../assets/docs/azure-interview-questions/02-azure-openai/030-how-would-you-switch-from-gpt-4-class-models-to-a-smaller-model.md?raw";
import Q31 from "../../assets/docs/azure-interview-questions/02-azure-openai/031-how-do-you-protect-azure-openai-endpoints.md?raw";
import Q32 from "../../assets/docs/azure-interview-questions/02-azure-openai/032-how-do-you-prevent-prompt-injection.md?raw";
import Q33 from "../../assets/docs/azure-interview-questions/02-azure-openai/033-how-do-you-prevent-sensitive-data-from-being-sent-to-the-model.md?raw";

const AzureOpenAIQuestion = [
  {
    id: "016-why-azure-openai-for-cwd",
    category: "Azure OpenAI",
    title: "Why Azure OpenAI for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q16,
    code: "",
  },

  {
    id: "017-which-azure-openai-models-would-you-use",
    category: "Azure OpenAI",
    title: "Which Azure OpenAI models would you use?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q17,
    code: "",
  },

  {
    id: "018-how-do-you-select-the-appropriate-model",
    category: "Azure OpenAI",
    title: "How do you select the appropriate model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q18,
    code: "",
  },

  {
    id: "019-how-do-you-handle-azure-openai-rate-limits",
    category: "Azure OpenAI",
    title: "How do you handle Azure OpenAI rate limits?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q19,
    code: "",
  },

  {
    id: "020-how-do-you-handle-token-limit-errors",
    category: "Azure OpenAI",
    title: "How do you handle token-limit errors?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q20,
    code: "",
  },

  {
    id: "021-how-do-you-handle-model-timeout",
    category: "Azure OpenAI",
    title: "How do you handle model timeout?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q21,
    code: "",
  },

  {
    id: "022-how-do-you-implement-retries",
    category: "Azure OpenAI",
    title: "How do you implement retries?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q22,
    code: "",
  },

  {
    id: "023-how-do-you-prevent-retry-storms",
    category: "Azure OpenAI",
    title: "How do you prevent retry storms?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q23,
    code: "",
  },

  {
    id: "024-how-do-you-reduce-azure-openai-cost",
    category: "Azure OpenAI",
    title: "How do you reduce Azure OpenAI cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q24,
    code: "",
  },

  {
    id: "025-how-do-you-reduce-token-consumption",
    category: "Azure OpenAI",
    title: "How do you reduce token consumption?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q25,
    code: "",
  },

  {
    id: "026-how-do-you-monitor-azure-openai-usage",
    category: "Azure OpenAI",
    title: "How do you monitor Azure OpenAI usage?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q26,
    code: "",
  },

  {
    id: "027-how-do-you-monitor-latency",
    category: "Azure OpenAI",
    title: "How do you monitor latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q27,
    code: "",
  },

  {
    id: "028-how-do-you-implement-model-fallback",
    category: "Azure OpenAI",
    title: "How do you implement model fallback?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q28,
    code: "",
  },

  {
    id: "029-how-do-you-perform-model-evaluation-before-production",
    category: "Azure OpenAI",
    title: "How do you perform model evaluation before production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q29,
    code: "",
  },

  {
    id: "030-how-would-you-switch-from-gpt-4-class-models-to-a-smaller-model",
    category: "Azure OpenAI",
    title: "How would you switch from GPT-4-class models to a smaller model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q30,
    code: "",
  },

  {
    id: "031-how-do-you-protect-azure-openai-endpoints",
    category: "Azure OpenAI",
    title: "How do you protect Azure OpenAI endpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q31,
    code: "",
  },

  {
    id: "032-how-do-you-prevent-prompt-injection",
    category: "Azure OpenAI",
    title: "How do you prevent prompt injection?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q32,
    code: "",
  },

  {
    id: "033-how-do-you-prevent-sensitive-data-from-being-sent-to-the-model",
    category: "Azure OpenAI",
    title: "How do you prevent sensitive data from being sent to the model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q33,
    code: "",
  },

];

export default function AzureOpenAIQuestionPage() {
  return (
    <CookbookApp
      data={AzureOpenAIQuestion}
      title="Azure OpenAI Cookbook"
      subtitle="Model selection, rate limits, retries, cost, safety and fallback"
      icon="🧠"
      patternLabel="Questions"
    />
  );
}
