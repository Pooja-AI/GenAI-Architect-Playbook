import CookbookApp from "../../components/CookbookApp";

import Q199 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/199-why-entra-id-for-cwd-authentication.md?raw";
import Q200 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/200-authentication-vs-authorization.md?raw";
import Q201 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/201-how-does-a-user-authenticate.md?raw";
import Q202 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/202-how-does-apim-validate-the-token.md?raw";
import Q203 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/203-how-does-cwd-obtain-user-identity.md?raw";
import Q204 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/204-how-do-you-implement-rbac.md?raw";
import Q205 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/205-how-do-you-implement-application-roles.md?raw";
import Q206 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/206-how-do-you-implement-managed-identities.md?raw";
import Q207 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/207-system-assigned-vs-user-assigned-managed-identity.md?raw";
import Q208 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/208-why-use-managed-identity-instead-of-credentials.md?raw";
import Q209 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/209-how-does-a-worker-access-azure-resources-securely.md?raw";
import Q210 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/210-how-do-you-implement-least-privilege.md?raw";
import Q211 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/211-how-do-you-implement-user-level-authorization.md?raw";
import Q212 from "../../assets/docs/azure-interview-questions/14-microsoft-entra-id/212-how-do-you-enforce-customer-level-access-control.md?raw";

const AzureEntraIdQuestion = [
  {
    id: "199-why-entra-id-for-cwd-authentication",
    category: "Microsoft Entra ID",
    title: "Why Entra ID for CWD authentication?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q199,
    code: "",
  },

  {
    id: "200-authentication-vs-authorization",
    category: "Microsoft Entra ID",
    title: "Authentication vs authorization?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q200,
    code: "",
  },

  {
    id: "201-how-does-a-user-authenticate",
    category: "Microsoft Entra ID",
    title: "How does a user authenticate?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q201,
    code: "",
  },

  {
    id: "202-how-does-apim-validate-the-token",
    category: "Microsoft Entra ID",
    title: "How does APIM validate the token?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q202,
    code: "",
  },

  {
    id: "203-how-does-cwd-obtain-user-identity",
    category: "Microsoft Entra ID",
    title: "How does CWD obtain user identity?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q203,
    code: "",
  },

  {
    id: "204-how-do-you-implement-rbac",
    category: "Microsoft Entra ID",
    title: "How do you implement RBAC?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q204,
    code: "",
  },

  {
    id: "205-how-do-you-implement-application-roles",
    category: "Microsoft Entra ID",
    title: "How do you implement application roles?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q205,
    code: "",
  },

  {
    id: "206-how-do-you-implement-managed-identities",
    category: "Microsoft Entra ID",
    title: "How do you implement managed identities?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q206,
    code: "",
  },

  {
    id: "207-system-assigned-vs-user-assigned-managed-identity",
    category: "Microsoft Entra ID",
    title: "System-assigned vs user-assigned managed identity?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q207,
    code: "",
  },

  {
    id: "208-why-use-managed-identity-instead-of-credentials",
    category: "Microsoft Entra ID",
    title: "Why use Managed Identity instead of credentials?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q208,
    code: "",
  },

  {
    id: "209-how-does-a-worker-access-azure-resources-securely",
    category: "Microsoft Entra ID",
    title: "How does a Worker access Azure resources securely?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q209,
    code: "",
  },

  {
    id: "210-how-do-you-implement-least-privilege",
    category: "Microsoft Entra ID",
    title: "How do you implement least privilege?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q210,
    code: "",
  },

  {
    id: "211-how-do-you-implement-user-level-authorization",
    category: "Microsoft Entra ID",
    title: "How do you implement user-level authorization?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q211,
    code: "",
  },

  {
    id: "212-how-do-you-enforce-customer-level-access-control",
    category: "Microsoft Entra ID",
    title: "How do you enforce customer-level access control?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q212,
    code: "",
  },

];

export default function AzureEntraIdQuestionPage() {
  return (
    <CookbookApp
      data={AzureEntraIdQuestion}
      title="Microsoft Entra ID Cookbook"
      subtitle="Authentication, RBAC, managed identities and least privilege"
      icon="🔐"
      patternLabel="Questions"
    />
  );
}
