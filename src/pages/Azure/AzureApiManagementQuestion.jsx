import CookbookApp from "../../components/CookbookApp";

import Q148 from "../../assets/docs/azure-interview-questions/10-azure-api-management/148-why-azure-api-management.md?raw";
import Q149 from "../../assets/docs/azure-interview-questions/10-azure-api-management/149-api-management-vs-azure-functions.md?raw";
import Q150 from "../../assets/docs/azure-interview-questions/10-azure-api-management/150-how-does-apim-authenticate-requests.md?raw";
import Q151 from "../../assets/docs/azure-interview-questions/10-azure-api-management/151-how-do-you-implement-authorization.md?raw";
import Q152 from "../../assets/docs/azure-interview-questions/10-azure-api-management/152-how-do-you-implement-rate-limiting.md?raw";
import Q153 from "../../assets/docs/azure-interview-questions/10-azure-api-management/153-how-do-you-implement-throttling.md?raw";
import Q154 from "../../assets/docs/azure-interview-questions/10-azure-api-management/154-how-do-you-validate-requests.md?raw";
import Q155 from "../../assets/docs/azure-interview-questions/10-azure-api-management/155-how-do-you-protect-apis.md?raw";
import Q156 from "../../assets/docs/azure-interview-questions/10-azure-api-management/156-how-would-apim-route-requests-to-cwd.md?raw";
import Q157 from "../../assets/docs/azure-interview-questions/10-azure-api-management/157-how-do-you-implement-api-versioning.md?raw";
import Q158 from "../../assets/docs/azure-interview-questions/10-azure-api-management/158-how-do-you-monitor-apim.md?raw";
import Q159 from "../../assets/docs/azure-interview-questions/10-azure-api-management/159-how-would-you-handle-backend-failures.md?raw";
import Q160 from "../../assets/docs/azure-interview-questions/10-azure-api-management/160-how-would-you-implement-retry-policies.md?raw";
import Q161 from "../../assets/docs/azure-interview-questions/10-azure-api-management/161-how-would-you-secure-apim-with-private-networking.md?raw";

const AzureApiManagementQuestion = [
  {
    id: "148-why-azure-api-management",
    category: "Azure API Management",
    title: "Why Azure API Management?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q148,
    code: "",
  },

  {
    id: "149-api-management-vs-azure-functions",
    category: "Azure API Management",
    title: "API Management vs Azure Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q149,
    code: "",
  },

  {
    id: "150-how-does-apim-authenticate-requests",
    category: "Azure API Management",
    title: "How does APIM authenticate requests?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q150,
    code: "",
  },

  {
    id: "151-how-do-you-implement-authorization",
    category: "Azure API Management",
    title: "How do you implement authorization?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q151,
    code: "",
  },

  {
    id: "152-how-do-you-implement-rate-limiting",
    category: "Azure API Management",
    title: "How do you implement rate limiting?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q152,
    code: "",
  },

  {
    id: "153-how-do-you-implement-throttling",
    category: "Azure API Management",
    title: "How do you implement throttling?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q153,
    code: "",
  },

  {
    id: "154-how-do-you-validate-requests",
    category: "Azure API Management",
    title: "How do you validate requests?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q154,
    code: "",
  },

  {
    id: "155-how-do-you-protect-apis",
    category: "Azure API Management",
    title: "How do you protect APIs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q155,
    code: "",
  },

  {
    id: "156-how-would-apim-route-requests-to-cwd",
    category: "Azure API Management",
    title: "How would APIM route requests to CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q156,
    code: "",
  },

  {
    id: "157-how-do-you-implement-api-versioning",
    category: "Azure API Management",
    title: "How do you implement API versioning?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q157,
    code: "",
  },

  {
    id: "158-how-do-you-monitor-apim",
    category: "Azure API Management",
    title: "How do you monitor APIM?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q158,
    code: "",
  },

  {
    id: "159-how-would-you-handle-backend-failures",
    category: "Azure API Management",
    title: "How would you handle backend failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q159,
    code: "",
  },

  {
    id: "160-how-would-you-implement-retry-policies",
    category: "Azure API Management",
    title: "How would you implement retry policies?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q160,
    code: "",
  },

  {
    id: "161-how-would-you-secure-apim-with-private-networking",
    category: "Azure API Management",
    title: "How would you secure APIM with private networking?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q161,
    code: "",
  },

];

export default function AzureApiManagementQuestionPage() {
  return (
    <CookbookApp
      data={AzureApiManagementQuestion}
      title="Azure API Management Cookbook"
      subtitle="Authentication, throttling, validation, versioning and private networking"
      icon="🚪"
      patternLabel="Questions"
    />
  );
}
