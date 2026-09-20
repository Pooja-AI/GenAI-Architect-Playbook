import CookbookApp from "../../components/CookbookApp";

import Q34 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/034-what-is-azure-ai-foundrys-role-in-cwd.md?raw";
import Q35 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/035-why-use-ai-foundry-in-addition-to-azure-openai.md?raw";
import Q36 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/036-how-do-you-manage-models-in-ai-foundry.md?raw";
import Q37 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/037-how-do-you-manage-prompts.md?raw";
import Q38 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/038-how-do-you-evaluate-agents.md?raw";
import Q39 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/039-how-do-you-perform-prompt-evaluation.md?raw";
import Q40 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/040-how-do-you-perform-model-evaluation.md?raw";
import Q41 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/041-how-would-you-use-ai-foundry-for-agent-development.md?raw";
import Q42 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/042-how-would-you-move-an-agent-from-development-to-production.md?raw";
import Q43 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/043-how-do-you-monitor-genai-applications.md?raw";
import Q44 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/044-how-would-you-perform-regression-testing.md?raw";
import Q45 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/045-how-would-you-compare-two-models.md?raw";
import Q46 from "../../assets/docs/azure-interview-questions/03-azure-ai-foundry/046-how-would-you-track-model-prompt-versions.md?raw";

const AzureAIFoundryQuestion = [
  {
    id: "034-what-is-azure-ai-foundrys-role-in-cwd",
    category: "Azure AI Foundry",
    title: "What is Azure AI Foundry's role in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q34,
    code: "",
  },

  {
    id: "035-why-use-ai-foundry-in-addition-to-azure-openai",
    category: "Azure AI Foundry",
    title: "Why use AI Foundry in addition to Azure OpenAI?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q35,
    code: "",
  },

  {
    id: "036-how-do-you-manage-models-in-ai-foundry",
    category: "Azure AI Foundry",
    title: "How do you manage models in AI Foundry?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q36,
    code: "",
  },

  {
    id: "037-how-do-you-manage-prompts",
    category: "Azure AI Foundry",
    title: "How do you manage prompts?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q37,
    code: "",
  },

  {
    id: "038-how-do-you-evaluate-agents",
    category: "Azure AI Foundry",
    title: "How do you evaluate agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q38,
    code: "",
  },

  {
    id: "039-how-do-you-perform-prompt-evaluation",
    category: "Azure AI Foundry",
    title: "How do you perform prompt evaluation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q39,
    code: "",
  },

  {
    id: "040-how-do-you-perform-model-evaluation",
    category: "Azure AI Foundry",
    title: "How do you perform model evaluation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q40,
    code: "",
  },

  {
    id: "041-how-would-you-use-ai-foundry-for-agent-development",
    category: "Azure AI Foundry",
    title: "How would you use AI Foundry for agent development?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q41,
    code: "",
  },

  {
    id: "042-how-would-you-move-an-agent-from-development-to-production",
    category: "Azure AI Foundry",
    title: "How would you move an agent from development to production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q42,
    code: "",
  },

  {
    id: "043-how-do-you-monitor-genai-applications",
    category: "Azure AI Foundry",
    title: "How do you monitor GenAI applications?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q43,
    code: "",
  },

  {
    id: "044-how-would-you-perform-regression-testing",
    category: "Azure AI Foundry",
    title: "How would you perform regression testing?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q44,
    code: "",
  },

  {
    id: "045-how-would-you-compare-two-models",
    category: "Azure AI Foundry",
    title: "How would you compare two models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q45,
    code: "",
  },

  {
    id: "046-how-would-you-track-model-prompt-versions",
    category: "Azure AI Foundry",
    title: "How would you track model/prompt versions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q46,
    code: "",
  },

];

export default function AzureAIFoundryQuestionPage() {
  return (
    <CookbookApp
      data={AzureAIFoundryQuestion}
      title="Azure AI Foundry Cookbook"
      subtitle="Model and prompt management, evaluation, agent lifecycle and versioning"
      icon="🏭"
      patternLabel="Questions"
    />
  );
}
