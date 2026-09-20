import CookbookApp from "../../components/CookbookApp";

import Q133 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/133-why-azure-container-apps-for-cwd.md?raw";
import Q134 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/134-why-aks.md?raw";
import Q135 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/135-container-apps-vs-aks.md?raw";
import Q136 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/136-which-cwd-components-would-run-as-containers.md?raw";
import Q137 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/137-how-would-you-deploy-the-coordinator.md?raw";
import Q138 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/138-how-would-you-deploy-delegators.md?raw";
import Q139 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/139-how-would-you-deploy-workers.md?raw";
import Q140 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/140-how-would-you-implement-autoscaling.md?raw";
import Q141 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/141-how-would-you-implement-health-checks.md?raw";
import Q142 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/142-how-would-you-handle-container-failures.md?raw";
import Q143 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/143-how-would-you-perform-zero-downtime-deployment.md?raw";
import Q144 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/144-how-would-you-implement-service-discovery.md?raw";
import Q145 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/145-how-would-you-secure-containers.md?raw";
import Q146 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/146-how-would-you-monitor-containers.md?raw";
import Q147 from "../../assets/docs/azure-interview-questions/09-azure-container-apps-aks/147-when-would-you-choose-aks-instead-of-container-apps.md?raw";

const AzureContainerAppsQuestion = [
  {
    id: "133-why-azure-container-apps-for-cwd",
    category: "Azure Container Apps / AKS",
    title: "Why Azure Container Apps for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q133,
    code: "",
  },

  {
    id: "134-why-aks",
    category: "Azure Container Apps / AKS",
    title: "Why AKS?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q134,
    code: "",
  },

  {
    id: "135-container-apps-vs-aks",
    category: "Azure Container Apps / AKS",
    title: "Container Apps vs AKS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q135,
    code: "",
  },

  {
    id: "136-which-cwd-components-would-run-as-containers",
    category: "Azure Container Apps / AKS",
    title: "Which CWD components would run as containers?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q136,
    code: "",
  },

  {
    id: "137-how-would-you-deploy-the-coordinator",
    category: "Azure Container Apps / AKS",
    title: "How would you deploy the Coordinator?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q137,
    code: "",
  },

  {
    id: "138-how-would-you-deploy-delegators",
    category: "Azure Container Apps / AKS",
    title: "How would you deploy Delegators?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q138,
    code: "",
  },

  {
    id: "139-how-would-you-deploy-workers",
    category: "Azure Container Apps / AKS",
    title: "How would you deploy Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q139,
    code: "",
  },

  {
    id: "140-how-would-you-implement-autoscaling",
    category: "Azure Container Apps / AKS",
    title: "How would you implement autoscaling?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q140,
    code: "",
  },

  {
    id: "141-how-would-you-implement-health-checks",
    category: "Azure Container Apps / AKS",
    title: "How would you implement health checks?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q141,
    code: "",
  },

  {
    id: "142-how-would-you-handle-container-failures",
    category: "Azure Container Apps / AKS",
    title: "How would you handle container failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q142,
    code: "",
  },

  {
    id: "143-how-would-you-perform-zero-downtime-deployment",
    category: "Azure Container Apps / AKS",
    title: "How would you perform zero-downtime deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q143,
    code: "",
  },

  {
    id: "144-how-would-you-implement-service-discovery",
    category: "Azure Container Apps / AKS",
    title: "How would you implement service discovery?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q144,
    code: "",
  },

  {
    id: "145-how-would-you-secure-containers",
    category: "Azure Container Apps / AKS",
    title: "How would you secure containers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q145,
    code: "",
  },

  {
    id: "146-how-would-you-monitor-containers",
    category: "Azure Container Apps / AKS",
    title: "How would you monitor containers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q146,
    code: "",
  },

  {
    id: "147-when-would-you-choose-aks-instead-of-container-apps",
    category: "Azure Container Apps / AKS",
    title: "When would you choose AKS instead of Container Apps?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q147,
    code: "",
  },

];

export default function AzureContainerAppsQuestionPage() {
  return (
    <CookbookApp
      data={AzureContainerAppsQuestion}
      title="Azure Container Apps / AKS Cookbook"
      subtitle="Containerized agents, autoscaling, health checks and zero-downtime deploys"
      icon="📦"
      patternLabel="Questions"
    />
  );
}
