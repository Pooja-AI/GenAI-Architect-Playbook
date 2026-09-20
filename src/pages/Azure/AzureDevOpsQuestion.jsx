import CookbookApp from "../../components/CookbookApp";

import Q250 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/250-explain-your-azure-ci-cd-pipeline.md?raw";
import Q251 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/251-how-would-you-deploy-cwd.md?raw";
import Q252 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/252-how-would-you-deploy-containers.md?raw";
import Q253 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/253-how-would-you-deploy-azure-functions.md?raw";
import Q254 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/254-how-would-you-deploy-azure-ml-models.md?raw";
import Q255 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/255-how-would-you-version-prompts.md?raw";
import Q256 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/256-how-would-you-version-models.md?raw";
import Q257 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/257-how-would-you-version-agent-configurations.md?raw";
import Q258 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/258-how-would-you-implement-blue-green-deployment.md?raw";
import Q259 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/259-how-would-you-implement-canary-deployment.md?raw";
import Q260 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/260-how-would-you-roll-back-a-bad-deployment.md?raw";
import Q261 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/261-how-would-you-manage-dev-test-prod.md?raw";
import Q262 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/262-how-would-you-integrate-llm-evaluation-into-ci-cd.md?raw";
import Q263 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/263-how-would-you-prevent-an-untested-model-from-reaching-production.md?raw";
import Q264 from "../../assets/docs/azure-interview-questions/18-azure-devops-ci-cd/264-arm-bicep-vs-terraform.md?raw";

const AzureDevOpsQuestion = [
  {
    id: "250-explain-your-azure-ci-cd-pipeline",
    category: "Azure DevOps / CI/CD",
    title: "Explain your Azure CI/CD pipeline.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q250,
    code: "",
  },

  {
    id: "251-how-would-you-deploy-cwd",
    category: "Azure DevOps / CI/CD",
    title: "How would you deploy CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q251,
    code: "",
  },

  {
    id: "252-how-would-you-deploy-containers",
    category: "Azure DevOps / CI/CD",
    title: "How would you deploy containers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q252,
    code: "",
  },

  {
    id: "253-how-would-you-deploy-azure-functions",
    category: "Azure DevOps / CI/CD",
    title: "How would you deploy Azure Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q253,
    code: "",
  },

  {
    id: "254-how-would-you-deploy-azure-ml-models",
    category: "Azure DevOps / CI/CD",
    title: "How would you deploy Azure ML models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q254,
    code: "",
  },

  {
    id: "255-how-would-you-version-prompts",
    category: "Azure DevOps / CI/CD",
    title: "How would you version prompts?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q255,
    code: "",
  },

  {
    id: "256-how-would-you-version-models",
    category: "Azure DevOps / CI/CD",
    title: "How would you version models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q256,
    code: "",
  },

  {
    id: "257-how-would-you-version-agent-configurations",
    category: "Azure DevOps / CI/CD",
    title: "How would you version agent configurations?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q257,
    code: "",
  },

  {
    id: "258-how-would-you-implement-blue-green-deployment",
    category: "Azure DevOps / CI/CD",
    title: "How would you implement blue-green deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q258,
    code: "",
  },

  {
    id: "259-how-would-you-implement-canary-deployment",
    category: "Azure DevOps / CI/CD",
    title: "How would you implement canary deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q259,
    code: "",
  },

  {
    id: "260-how-would-you-roll-back-a-bad-deployment",
    category: "Azure DevOps / CI/CD",
    title: "How would you roll back a bad deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q260,
    code: "",
  },

  {
    id: "261-how-would-you-manage-dev-test-prod",
    category: "Azure DevOps / CI/CD",
    title: "How would you manage dev/test/prod?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q261,
    code: "",
  },

  {
    id: "262-how-would-you-integrate-llm-evaluation-into-ci-cd",
    category: "Azure DevOps / CI/CD",
    title: "How would you integrate LLM evaluation into CI/CD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q262,
    code: "",
  },

  {
    id: "263-how-would-you-prevent-an-untested-model-from-reaching-production",
    category: "Azure DevOps / CI/CD",
    title: "How would you prevent an untested model from reaching production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q263,
    code: "",
  },

  {
    id: "264-arm-bicep-vs-terraform",
    category: "Azure DevOps / CI/CD",
    title: "ARM/Bicep vs Terraform?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q264,
    code: "",
  },

];

export default function AzureDevOpsQuestionPage() {
  return (
    <CookbookApp
      data={AzureDevOpsQuestion}
      title="Azure DevOps / CI/CD Cookbook"
      subtitle="CI/CD, prompt and model versioning, deployments, rollbacks and IaC"
      icon="🛠️"
      patternLabel="Questions"
    />
  );
}
