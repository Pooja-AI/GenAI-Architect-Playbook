import CookbookApp from "../../components/CookbookApp";

import Q121 from "../../assets/docs/azure-interview-questions/08-azure-functions/121-why-azure-functions.md?raw";
import Q122 from "../../assets/docs/azure-interview-questions/08-azure-functions/122-which-cwd-components-would-you-implement-using-functions.md?raw";
import Q123 from "../../assets/docs/azure-interview-questions/08-azure-functions/123-functions-vs-container-apps.md?raw";
import Q124 from "../../assets/docs/azure-interview-questions/08-azure-functions/124-functions-vs-aks.md?raw";
import Q125 from "../../assets/docs/azure-interview-questions/08-azure-functions/125-how-do-you-handle-cold-starts.md?raw";
import Q126 from "../../assets/docs/azure-interview-questions/08-azure-functions/126-how-do-you-handle-function-timeout.md?raw";
import Q127 from "../../assets/docs/azure-interview-questions/08-azure-functions/127-how-do-you-implement-retries.md?raw";
import Q128 from "../../assets/docs/azure-interview-questions/08-azure-functions/128-how-do-you-implement-idempotency.md?raw";
import Q129 from "../../assets/docs/azure-interview-questions/08-azure-functions/129-how-does-functions-scale.md?raw";
import Q130 from "../../assets/docs/azure-interview-questions/08-azure-functions/130-how-do-you-monitor-functions.md?raw";
import Q131 from "../../assets/docs/azure-interview-questions/08-azure-functions/131-how-do-you-securely-access-key-vault-from-functions.md?raw";
import Q132 from "../../assets/docs/azure-interview-questions/08-azure-functions/132-how-would-you-trigger-functions-from-service-bus.md?raw";

const AzureFunctionsQuestion = [
  {
    id: "121-why-azure-functions",
    category: "Azure Functions",
    title: "Why Azure Functions?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q121,
    code: "",
  },

  {
    id: "122-which-cwd-components-would-you-implement-using-functions",
    category: "Azure Functions",
    title: "Which CWD components would you implement using Functions?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q122,
    code: "",
  },

  {
    id: "123-functions-vs-container-apps",
    category: "Azure Functions",
    title: "Functions vs Container Apps?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q123,
    code: "",
  },

  {
    id: "124-functions-vs-aks",
    category: "Azure Functions",
    title: "Functions vs AKS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q124,
    code: "",
  },

  {
    id: "125-how-do-you-handle-cold-starts",
    category: "Azure Functions",
    title: "How do you handle cold starts?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q125,
    code: "",
  },

  {
    id: "126-how-do-you-handle-function-timeout",
    category: "Azure Functions",
    title: "How do you handle function timeout?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q126,
    code: "",
  },

  {
    id: "127-how-do-you-implement-retries",
    category: "Azure Functions",
    title: "How do you implement retries?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q127,
    code: "",
  },

  {
    id: "128-how-do-you-implement-idempotency",
    category: "Azure Functions",
    title: "How do you implement idempotency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q128,
    code: "",
  },

  {
    id: "129-how-does-functions-scale",
    category: "Azure Functions",
    title: "How does Functions scale?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q129,
    code: "",
  },

  {
    id: "130-how-do-you-monitor-functions",
    category: "Azure Functions",
    title: "How do you monitor Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q130,
    code: "",
  },

  {
    id: "131-how-do-you-securely-access-key-vault-from-functions",
    category: "Azure Functions",
    title: "How do you securely access Key Vault from Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q131,
    code: "",
  },

  {
    id: "132-how-would-you-trigger-functions-from-service-bus",
    category: "Azure Functions",
    title: "How would you trigger Functions from Service Bus?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q132,
    code: "",
  },

];

export default function AzureFunctionsQuestionPage() {
  return (
    <CookbookApp
      data={AzureFunctionsQuestion}
      title="Azure Functions Cookbook"
      subtitle="Serverless design, cold starts, retries, idempotency and scaling"
      icon="⚡"
      patternLabel="Questions"
    />
  );
}
