import CookbookApp from "../../components/CookbookApp";

import Q222 from "../../assets/docs/azure-interview-questions/16-azure-networking/222-explain-the-vnet-architecture-for-cwd.md?raw";
import Q223 from "../../assets/docs/azure-interview-questions/16-azure-networking/223-which-services-should-be-private.md?raw";
import Q224 from "../../assets/docs/azure-interview-questions/16-azure-networking/224-why-use-private-endpoints.md?raw";
import Q225 from "../../assets/docs/azure-interview-questions/16-azure-networking/225-how-would-you-privately-access-azure-openai.md?raw";
import Q226 from "../../assets/docs/azure-interview-questions/16-azure-networking/226-how-would-you-privately-access-azure-ai-search.md?raw";
import Q227 from "../../assets/docs/azure-interview-questions/16-azure-networking/227-how-would-you-privately-access-key-vault.md?raw";
import Q228 from "../../assets/docs/azure-interview-questions/16-azure-networking/228-what-is-vnet-integration.md?raw";
import Q229 from "../../assets/docs/azure-interview-questions/16-azure-networking/229-what-is-private-link.md?raw";
import Q230 from "../../assets/docs/azure-interview-questions/16-azure-networking/230-nsg-vs-azure-firewall.md?raw";
import Q231 from "../../assets/docs/azure-interview-questions/16-azure-networking/231-how-would-you-secure-traffic-between-cwd-services.md?raw";
import Q232 from "../../assets/docs/azure-interview-questions/16-azure-networking/232-how-would-you-isolate-production-from-development.md?raw";
import Q233 from "../../assets/docs/azure-interview-questions/16-azure-networking/233-how-would-you-troubleshoot-connectivity-problems.md?raw";

const AzureNetworkingQuestion = [
  {
    id: "222-explain-the-vnet-architecture-for-cwd",
    category: "Azure Networking",
    title: "Explain the VNet architecture for CWD.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q222,
    code: "",
  },

  {
    id: "223-which-services-should-be-private",
    category: "Azure Networking",
    title: "Which services should be private?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q223,
    code: "",
  },

  {
    id: "224-why-use-private-endpoints",
    category: "Azure Networking",
    title: "Why use private endpoints?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q224,
    code: "",
  },

  {
    id: "225-how-would-you-privately-access-azure-openai",
    category: "Azure Networking",
    title: "How would you privately access Azure OpenAI?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q225,
    code: "",
  },

  {
    id: "226-how-would-you-privately-access-azure-ai-search",
    category: "Azure Networking",
    title: "How would you privately access Azure AI Search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q226,
    code: "",
  },

  {
    id: "227-how-would-you-privately-access-key-vault",
    category: "Azure Networking",
    title: "How would you privately access Key Vault?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q227,
    code: "",
  },

  {
    id: "228-what-is-vnet-integration",
    category: "Azure Networking",
    title: "What is VNet integration?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q228,
    code: "",
  },

  {
    id: "229-what-is-private-link",
    category: "Azure Networking",
    title: "What is Private Link?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q229,
    code: "",
  },

  {
    id: "230-nsg-vs-azure-firewall",
    category: "Azure Networking",
    title: "NSG vs Azure Firewall?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q230,
    code: "",
  },

  {
    id: "231-how-would-you-secure-traffic-between-cwd-services",
    category: "Azure Networking",
    title: "How would you secure traffic between CWD services?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q231,
    code: "",
  },

  {
    id: "232-how-would-you-isolate-production-from-development",
    category: "Azure Networking",
    title: "How would you isolate production from development?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q232,
    code: "",
  },

  {
    id: "233-how-would-you-troubleshoot-connectivity-problems",
    category: "Azure Networking",
    title: "How would you troubleshoot connectivity problems?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q233,
    code: "",
  },

];

export default function AzureNetworkingQuestionPage() {
  return (
    <CookbookApp
      data={AzureNetworkingQuestion}
      title="Azure Networking Cookbook"
      subtitle="VNets, private endpoints, Private Link and connectivity troubleshooting"
      icon="🌐"
      patternLabel="Questions"
    />
  );
}
