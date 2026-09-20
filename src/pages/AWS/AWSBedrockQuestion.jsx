import CookbookApp from "../../components/CookbookApp";

import Q16 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/016-why-amazon-bedrock-instead-of-directly-calling-an-llm-api.md?raw";
import Q17 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/017-which-bedrock-models-would-you-use-for-cwd-and-why.md?raw";
import Q18 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/018-how-do-you-select-a-bedrock-model.md?raw";
import Q19 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/019-how-do-you-handle-bedrock-throttling.md?raw";
import Q20 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/020-how-do-you-handle-bedrock-timeout.md?raw";
import Q21 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/021-how-do-you-implement-retries-for-bedrock.md?raw";
import Q22 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/022-how-do-you-control-bedrock-token-usage.md?raw";
import Q23 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/023-how-do-you-reduce-bedrock-cost.md?raw";
import Q24 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/024-how-do-you-monitor-bedrock-usage.md?raw";
import Q25 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/025-how-do-you-monitor-bedrock-latency.md?raw";
import Q26 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/026-how-do-you-implement-model-fallback.md?raw";
import Q27 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/027-how-would-you-switch-from-one-bedrock-model-to-another.md?raw";
import Q28 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/028-how-do-you-version-model-configurations.md?raw";
import Q29 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/029-how-do-you-handle-model-specific-context-limits.md?raw";
import Q30 from "../../assets/docs/aws-interview-questions/aws-core-services/02-amazon-bedrock/030-how-would-you-evaluate-a-new-bedrock-model-before-production.md?raw";

const AWSBedrockQuestion = [
  {
    id: "016-why-amazon-bedrock-instead-of-directly-calling-an-llm-api",
    category: "Amazon Bedrock",
    title: "Why Amazon Bedrock instead of directly calling an LLM API?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q16,
    code: "",
  },

  {
    id: "017-which-bedrock-models-would-you-use-for-cwd-and-why",
    category: "Amazon Bedrock",
    title: "Which Bedrock models would you use for CWD and why?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q17,
    code: "",
  },

  {
    id: "018-how-do-you-select-a-bedrock-model",
    category: "Amazon Bedrock",
    title: "How do you select a Bedrock model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q18,
    code: "",
  },

  {
    id: "019-how-do-you-handle-bedrock-throttling",
    category: "Amazon Bedrock",
    title: "How do you handle Bedrock throttling?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q19,
    code: "",
  },

  {
    id: "020-how-do-you-handle-bedrock-timeout",
    category: "Amazon Bedrock",
    title: "How do you handle Bedrock timeout?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q20,
    code: "",
  },

  {
    id: "021-how-do-you-implement-retries-for-bedrock",
    category: "Amazon Bedrock",
    title: "How do you implement retries for Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q21,
    code: "",
  },

  {
    id: "022-how-do-you-control-bedrock-token-usage",
    category: "Amazon Bedrock",
    title: "How do you control Bedrock token usage?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q22,
    code: "",
  },

  {
    id: "023-how-do-you-reduce-bedrock-cost",
    category: "Amazon Bedrock",
    title: "How do you reduce Bedrock cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q23,
    code: "",
  },

  {
    id: "024-how-do-you-monitor-bedrock-usage",
    category: "Amazon Bedrock",
    title: "How do you monitor Bedrock usage?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q24,
    code: "",
  },

  {
    id: "025-how-do-you-monitor-bedrock-latency",
    category: "Amazon Bedrock",
    title: "How do you monitor Bedrock latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q25,
    code: "",
  },

  {
    id: "026-how-do-you-implement-model-fallback",
    category: "Amazon Bedrock",
    title: "How do you implement model fallback?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q26,
    code: "",
  },

  {
    id: "027-how-would-you-switch-from-one-bedrock-model-to-another",
    category: "Amazon Bedrock",
    title: "How would you switch from one Bedrock model to another?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q27,
    code: "",
  },

  {
    id: "028-how-do-you-version-model-configurations",
    category: "Amazon Bedrock",
    title: "How do you version model configurations?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q28,
    code: "",
  },

  {
    id: "029-how-do-you-handle-model-specific-context-limits",
    category: "Amazon Bedrock",
    title: "How do you handle model-specific context limits?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q29,
    code: "",
  },

  {
    id: "030-how-would-you-evaluate-a-new-bedrock-model-before-production",
    category: "Amazon Bedrock",
    title: "How would you evaluate a new Bedrock model before production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q30,
    code: "",
  },

];

export default function AWSBedrockQuestionPage() {
  return (
    <CookbookApp
      data={AWSBedrockQuestion}
      title="Amazon Bedrock Cookbook"
      subtitle="Model selection, throttling, retries, cost and evaluation"
      icon="🧠"
      patternLabel="Questions"
    />
  );
}
