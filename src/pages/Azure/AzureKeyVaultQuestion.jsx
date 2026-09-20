import CookbookApp from "../../components/CookbookApp";

import Q213 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/213-why-key-vault.md?raw";
import Q214 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/214-what-secrets-would-you-store.md?raw";
import Q215 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/215-secrets-vs-certificates-vs-keys.md?raw";
import Q216 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/216-how-does-cwd-access-key-vault.md?raw";
import Q217 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/217-why-use-managed-identity-with-key-vault.md?raw";
import Q218 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/218-how-do-you-rotate-secrets.md?raw";
import Q219 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/219-how-do-you-prevent-secrets-from-appearing-in-logs.md?raw";
import Q220 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/220-how-would-you-secure-key-vault.md?raw";
import Q221 from "../../assets/docs/azure-interview-questions/15-azure-key-vault/221-how-would-you-audit-key-vault-access.md?raw";

const AzureKeyVaultQuestion = [
  {
    id: "213-why-key-vault",
    category: "Azure Key Vault",
    title: "Why Key Vault?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q213,
    code: "",
  },

  {
    id: "214-what-secrets-would-you-store",
    category: "Azure Key Vault",
    title: "What secrets would you store?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q214,
    code: "",
  },

  {
    id: "215-secrets-vs-certificates-vs-keys",
    category: "Azure Key Vault",
    title: "Secrets vs certificates vs keys?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q215,
    code: "",
  },

  {
    id: "216-how-does-cwd-access-key-vault",
    category: "Azure Key Vault",
    title: "How does CWD access Key Vault?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q216,
    code: "",
  },

  {
    id: "217-why-use-managed-identity-with-key-vault",
    category: "Azure Key Vault",
    title: "Why use Managed Identity with Key Vault?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q217,
    code: "",
  },

  {
    id: "218-how-do-you-rotate-secrets",
    category: "Azure Key Vault",
    title: "How do you rotate secrets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q218,
    code: "",
  },

  {
    id: "219-how-do-you-prevent-secrets-from-appearing-in-logs",
    category: "Azure Key Vault",
    title: "How do you prevent secrets from appearing in logs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q219,
    code: "",
  },

  {
    id: "220-how-would-you-secure-key-vault",
    category: "Azure Key Vault",
    title: "How would you secure Key Vault?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q220,
    code: "",
  },

  {
    id: "221-how-would-you-audit-key-vault-access",
    category: "Azure Key Vault",
    title: "How would you audit Key Vault access?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q221,
    code: "",
  },

];

export default function AzureKeyVaultQuestionPage() {
  return (
    <CookbookApp
      data={AzureKeyVaultQuestion}
      title="Azure Key Vault Cookbook"
      subtitle="Secrets, keys, certificates, rotation and auditing"
      icon="🗝️"
      patternLabel="Questions"
    />
  );
}
