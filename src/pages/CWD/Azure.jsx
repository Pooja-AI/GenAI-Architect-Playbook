import CookbookApp from "../../components/CookbookApp";

import AzureArch from "../../assets/CWD/docs/azurearch.md?raw";
import AzureAIFoundary from "../../assets/CWD/docs/azureaifoundary.md?raw";
import AzureAIFoundaryCode from "../../assets/CWD/code/azureaifoundary.py?raw";
import AzureFoundryAgentService from "../../assets/CWD/docs/AzureFoundryAgentService.md?raw";
import AzureOpenAI from "../../assets/CWD/docs/AzureOpenAI.md?raw";
import AzureOpenAIModelDeployment from "../../assets/CWD/docs/AzureOpenAIModelDeployment.md?raw";
import AzureAgentOrchestration from "../../assets/CWD/docs/AzureAgentOrchestration.md?raw";
import AzureContainerAppsAgents from "../../assets/CWD/docs/AzureContainerAppsAgents.md?raw";
import AzureAKSAgents from "../../assets/CWD/docs/AzureAKSAgents.md?raw";
import AzureFunctionsAgents from "../../assets/CWD/docs/AzureFunctionsAgents.md?raw";
import AzureServiceBus from "../../assets/CWD/docs/AzureServiceBus.md?raw";
import AzureEventGrid from "../../assets/CWD/docs/AzureEventGrid.md?raw";
import AzureLogicApps from "../../assets/CWD/docs/AzureLogicApps.md?raw";
import AzureAISearchVector from "../../assets/CWD/docs/AzureAISearchVector.md?raw";
import AzureAgenticRAG from "../../assets/CWD/docs/AzureAgenticRAG.md?raw";
import AzureBlobStorage from "../../assets/CWD/docs/AzureBlobStorage.md?raw";
import AzureCosmosDB from "../../assets/CWD/docs/AzureCosmosDB.md?raw";
import AzureRedis from "../../assets/CWD/docs/AzureRedis.md?raw";
import AzureSQL from "../../assets/CWD/docs/AzureSQL.md?raw";
import AzureDataLake from "../../assets/CWD/docs/AzureDataLake.md?raw";
import AzureAPIM from "../../assets/CWD/docs/AzureAPIM.md?raw";
import AzureMCP from "../../assets/CWD/docs/AzureMCP.md?raw";
import AzureAPIAgentTools from "../../assets/CWD/docs/AzureAPIAgentTools.md?raw";
import MicrosoftTeamsIntegration from "../../assets/CWD/docs/MicrosoftTeamsIntegration.md?raw";
import MicrosoftCopilotStudio from "../../assets/CWD/docs/MicrosoftCopilotStudio.md?raw";
import MicrosoftGraph from "../../assets/CWD/docs/MicrosoftGraph.md?raw";
import SharePointIntegration from "../../assets/CWD/docs/SharePointIntegration.md?raw";
import MicrosoftFabric from "../../assets/CWD/docs/MicrosoftFabric.md?raw";
import MicrosoftEntraID from "../../assets/CWD/docs/MicrosoftEntraID.md?raw";
import AzureManagedIdentity from "../../assets/CWD/docs/AzureManagedIdentity.md?raw";
import AzureKeyVault from "../../assets/CWD/docs/AzureKeyVault.md?raw";
import AzureRBAC from "../../assets/CWD/docs/AzureRBAC.md?raw";
import AzureDLP from "../../assets/CWD/docs/AzureDLP.md?raw";
import AzureContentSafety from "../../assets/CWD/docs/AzureContentSafety.md?raw";
import AzureFrontDoor from "../../assets/CWD/docs/AzureFrontDoor.md?raw";
import AzureApplicationGateway from "../../assets/CWD/docs/AzureApplicationGateway.md?raw";
import AzureLoadBalancing from "../../assets/CWD/docs/AzureLoadBalancing.md?raw";
import AzureCommon from "../../assets/CWD/docs/azurecommon.md?raw";



const Azure = [
  // =====================================================
  // 01. AZURE ARCHITECTURE
  // =====================================================

  {
    id: "AzureArch",
    category: "Azure",
    title: "Azure Enterprise Agentic AI Architecture",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the complete production-grade Azure architecture for CWD, including Coordinator, Delegators, Workers, RAG, APIs, messaging, security, deployment, and observability.",
    concept: AzureArch,
  },

  // =====================================================
  // 02. AI / AGENT PLATFORM
  // =====================================================

  {
    id: "AzureAIFoundry",
    category: "Azure",
    title: "Azure AI Foundry",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand Azure AI Foundry for enterprise agent development, model selection, evaluations, tracing, projects, deployments, and AI application lifecycle management.",
    concept: AzureAIFoundary,
    code:AzureAIFoundaryCode
  },

  {
    id: "AzureFoundryAgentService",
    category: "Azure",
    title: "Azure AI Foundry Agent Service",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand managed agents, tools, conversations, agent execution, enterprise identity, and production agent deployment using Azure AI Foundry.",
    concept: AzureFoundryAgentService,
  },

  {
    id: "AzureOpenAI",
    category: "Azure",
    title: "Azure OpenAI Service",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise LLM integration using Azure OpenAI, including GPT models, embeddings, structured outputs, tool calling, deployments, quotas, and responsible AI.",
    concept: AzureOpenAI,
  },

  {
    id: "AzureOpenAIModelDeployment",
    category: "Azure",
    title: "Azure OpenAI Model Deployment & Quotas",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand model deployments, TPM/RPM limits, quota management, model selection, scaling, fallback, and production reliability patterns.",
    concept: AzureOpenAIModelDeployment,
  },

  // =====================================================
  // 03. AGENT ORCHESTRATION
  // =====================================================

  {
    id: "AzureAgentOrchestration",
    category: "Azure",
    title: "Azure Agent Orchestration",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Design enterprise Coordinator, Delegator, and Worker orchestration using Azure services and custom agent frameworks.",
    concept: AzureAgentOrchestration,
  },

  {
    id: "AzureContainerAppsAgents",
    category: "Azure",
    title: "Azure Container Apps for Agents",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand hosting custom agents and worker services using Azure Container Apps with autoscaling, revisions, ingress, networking, and managed identity.",
    concept: AzureContainerAppsAgents,
  },

  {
    id: "AzureAKSAgents",
    category: "Azure",
    title: "Azure Kubernetes Service for Agentic AI",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand deploying large-scale production agent services and worker pools on AKS with Kubernetes orchestration, scaling, networking, and security.",
    concept: AzureAKSAgents,
  },

  {
    id: "AzureFunctionsAgents",
    category: "Azure",
    title: "Azure Functions for Agent Tools",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand using serverless Azure Functions as tools and task executors for agent workflows.",
    concept: AzureFunctionsAgents,
  },

  // =====================================================
  // 04. WORKFLOW / MESSAGING
  // =====================================================

  {
    id: "AzureServiceBus",
    category: "Azure",
    title: "Azure Service Bus",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand queues, topics, subscriptions, retries, dead-letter queues, asynchronous task execution, and reliable Coordinator-to-Delegator-to-Worker communication.",
    concept: AzureServiceBus,
  },

  {
    id: "AzureEventGrid",
    category: "Azure",
    title: "Azure Event Grid",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand event-driven architectures for triggering agents and workflows from enterprise events.",
    concept: AzureEventGrid,
  },

  {
    id: "AzureLogicApps",
    category: "Azure",
    title: "Azure Logic Apps",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand integrating agent workflows with enterprise applications, approvals, notifications, and business processes.",
    concept: AzureLogicApps,
  },

  // =====================================================
  // 05. RAG / KNOWLEDGE
  // =====================================================

  {
    id: "AzureAISearch",
    category: "Azure",
    title: "Azure AI Search",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise RAG using hybrid search, vector search, semantic ranking, metadata filtering, chunking, indexing, and ACL-based retrieval.",
    concept: "",
  },

  {
    id: "AzureAISearchVector",
    category: "Azure",
    title: "Azure AI Search Vector & Hybrid Search",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand vector, keyword, hybrid, semantic, filtered, and multi-stage retrieval for enterprise Agentic RAG.",
    concept: AzureAISearchVector,
  },

  {
    id: "AzureAgenticRAG",
    category: "Azure",
    title: "Azure Agentic RAG",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand query planning, retrieval agents, search agents, reranking, grounding, citations, and multi-step enterprise RAG.",
    concept: AzureAgenticRAG,
  },

  {
    id: "AzureBlobStorage",
    category: "Azure",
    title: "Azure Blob Storage",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand document storage, raw enterprise files, ingestion pipelines, artifacts, and RAG data preparation using Azure Blob Storage.",
    concept: AzureBlobStorage,
  },

  // =====================================================
  // 06. DATA / STATE / MEMORY
  // =====================================================

  {
    id: "AzureCosmosDB",
    category: "Azure",
    title: "Azure Cosmos DB",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand conversation state, task state, agent metadata, session persistence, scalable NoSQL storage, and distributed application patterns.",
    concept: AzureCosmosDB,
  },

  {
    id: "AzureRedis",
    category: "Azure",
    title: "Azure Cache for Redis",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand short-term agent memory, session state, caching, distributed state, conversation context, and low-latency access.",
    concept: AzureRedis,
  },

  {
    id: "AzureSQL",
    category: "Azure",
    title: "Azure SQL Database",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand structured enterprise data access for agent tools, workers, analytics, and transactional workloads.",
    concept: AzureSQL,
  },

  {
    id: "AzureDataLake",
    category: "Azure",
    title: "Azure Data Lake Storage",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand enterprise-scale data lake architecture for analytics, AI pipelines, historical data, and agent knowledge sources.",
    concept: AzureDataLake,
  },

  // =====================================================
  // 07. API / INTEGRATION
  // =====================================================

  {
    id: "AzureAPIM",
    category: "Azure",
    title: "Azure API Management",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand API gateway architecture for securing and governing agent tools, enterprise APIs, throttling, authentication, authorization, and auditing.",
    concept: AzureAPIM,
  },

  {
    id: "AzureMCP",
    category: "Azure",
    title: "MCP Integration on Azure",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand exposing enterprise tools and data through MCP servers and integrating MCP with Azure-hosted agents and workers.",
    concept: AzureMCP,
  },

  {
    id: "AzureAPIAgentTools",
    category: "Azure",
    title: "Enterprise APIs as Agent Tools",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand how agents securely invoke Salesforce, ServiceNow, SAP, SQL, M365, and internal APIs through governed Azure API layers.",
    concept: AzureAPIAgentTools,
  },

  // =====================================================
  // 08. MICROSOFT ECOSYSTEM
  // =====================================================

  {
    id: "MicrosoftTeamsIntegration",
    category: "Azure",
    title: "Microsoft Teams Integration",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand integrating CWD agents with Microsoft Teams using conversational interfaces, authentication, Adaptive Cards, and enterprise agent workflows.",
    concept: MicrosoftTeamsIntegration,
  },

  {
    id: "MicrosoftCopilotStudio",
    category: "Azure",
    title: "Microsoft Copilot Studio",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand building enterprise copilots, connecting agents and tools, integrating business data, and extending Microsoft Copilot experiences.",
    concept: "",
  },

  {
    id: "MicrosoftGraph",
    category: "Azure",
    title: "Microsoft Graph",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand accessing Microsoft 365 services such as Teams, SharePoint, Outlook, OneDrive, users, groups, and enterprise collaboration data.",
    concept: MicrosoftGraph,
  },

  {
    id: "SharePointIntegration",
    category: "Azure",
    title: "SharePoint / Microsoft 365 Integration",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand enterprise document ingestion, retrieval, permissions, and RAG integration with SharePoint and Microsoft 365.",
    concept: SharePointIntegration,
  },

  {
    id: "MicrosoftFabric",
    category: "Azure",
    title: "Microsoft Fabric",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise analytics, OneLake, data engineering, data science, real-time intelligence, and AI workloads integrated with agentic systems.",
    concept: MicrosoftFabric,
  },

  // =====================================================
  // 09. IDENTITY / SECURITY
  // =====================================================

  {
    id: "MicrosoftEntraID",
    category: "Azure",
    title: "Microsoft Entra ID",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise authentication, OAuth2, RBAC, application identities, user identity propagation, and agent authorization.",
    concept: MicrosoftEntraID,
  },

  {
    id: "AzureManagedIdentity",
    category: "Azure",
    title: "Azure Managed Identity",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand passwordless authentication between agents, Azure services, APIs, databases, storage, and enterprise resources.",
    concept: AzureManagedIdentity,
  },

  {
    id: "AzureKeyVault",
    category: "Azure",
    title: "Azure Key Vault",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand secure management of API keys, secrets, certificates, encryption keys, and application credentials.",
    concept: AzureKeyVault,
  },

  {
    id: "AzureRBAC",
    category: "Azure",
    title: "Azure RBAC",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand role-based authorization for users, agents, services, resources, and enterprise data.",
    concept: AzureRBAC,
  },

  {
    id: "AzurePrivateNetworking",
    category: "Azure",
    title: "Azure Private Networking",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand VNets, private endpoints, private DNS, network isolation, and secure connectivity for enterprise AI workloads.",
    concept: "",
  },

  {
    id: "AzureDLP",
    category: "Azure",
    title: "Microsoft Purview & DLP",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand data classification, sensitive information protection, governance, DLP, lineage, and enterprise AI data controls.",
    concept: AzureDLP,
  },

  {
    id: "AzureContentSafety",
    category: "Azure",
    title: "Azure AI Content Safety",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand content filtering, prompt safety, harmful content detection, and responsible AI controls for production GenAI systems.",
    concept: AzureContentSafety,
  },

  // =====================================================
  // 10. NETWORKING / EDGE
  // =====================================================

  {
    id: "AzureFrontDoor",
    category: "Azure",
    title: "Azure Front Door",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand global entry points, CDN, WAF, routing, TLS termination, and secure access to enterprise AI applications.",
    concept: AzureFrontDoor,
  },

  {
    id: "AzureApplicationGateway",
    category: "Azure",
    title: "Azure Application Gateway",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand Layer 7 load balancing, TLS termination, routing, and Web Application Firewall integration.",
    concept: AzureApplicationGateway,
  },

  {
    id: "AzureLoadBalancing",
    category: "Azure",
    title: "Azure Load Balancing",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand load balancing and traffic distribution patterns for production agent services.",
    concept: AzureLoadBalancing,
  },

  // =====================================================
  // 11. OBSERVABILITY / EVALUATION
  // =====================================================

  {
    id: "AzureApplicationInsights",
    category: "Azure",
    title: "Azure Application Insights",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand distributed tracing, request tracking, agent latency, dependency monitoring, exceptions, and production diagnostics.",
    concept: AzureCommon,
  },

  {
    id: "AzureMonitor",
    category: "Azure",
    title: "Azure Monitor",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand monitoring Azure AI workloads, infrastructure, applications, agents, containers, and operational health.",
    concept: AzureCommon,
  },

  {
    id: "AzureLogAnalytics",
    category: "Azure",
    title: "Log Analytics",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized logging, KQL queries, correlation IDs, agent traces, failures, and operational analytics.",
    concept: AzureCommon,
  },

  {
    id: "AzureAIEvaluation",
    category: "Azure",
    title: "Azure AI Evaluation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand evaluating agent and RAG quality using groundedness, relevance, coherence, safety, tool success, latency, and cost metrics.",
    concept: AzureCommon,
  },

  // =====================================================
  // 12. DEVOPS / CI-CD
  // =====================================================

  {
    id: "AzureDevOps",
    category: "Azure",
    title: "Azure DevOps",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand enterprise source control, work items, CI/CD pipelines, release strategies, approvals, and production deployment.",
    concept: AzureCommon,
  },

  {
    id: "AzureDevOpsCICD",
    category: "Azure",
    title: "Azure DevOps CI/CD for Agentic AI",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand CI/CD pipelines for prompts, agents, APIs, containers, RAG pipelines, infrastructure, testing, and production releases.",
    concept: AzureCommon,
  },

  {
    id: "AzureML",
    category: "Azure",
    title: "Azure Machine Learning",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise ML/AI lifecycle management, experiments, model deployment, MLOps, registries, evaluation, and integration with GenAI workloads.",
    concept: AzureCommon,
  },

  {
    id: "AzureMLPromptFlow",
    category: "Azure",
    title: "Azure ML Prompt Flow",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand prompt engineering workflows, LLM evaluation, tracing, experimentation, and production GenAI lifecycle management.",
    concept: AzureCommon,
  },

  {
    id: "AzureMLMLflow",
    category: "Azure",
    title: "Azure ML & MLflow",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand experiment tracking, model management, prompt/version tracking, evaluation, and reproducibility using MLflow.",
    concept: AzureCommon,
  },

  // =====================================================
  // 13. CONTAINERS
  // =====================================================

  {
    id: "AzureContainerRegistry",
    category: "Azure",
    title: "Azure Container Registry",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand storing, versioning, securing, and deploying container images for agent services and workers.",
    concept: AzureCommon,
  },

  {
    id: "AzureAKSNetworking",
    category: "Azure",
    title: "AKS Networking & Security",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand private AKS, ingress, workload identity, network policies, secrets, scaling, and enterprise Kubernetes security.",
    concept: AzureCommon,
  },

  // =====================================================
  // 14. GOVERNANCE / ENTERPRISE AI
  // =====================================================

  {
    id: "AzurePolicy",
    category: "Azure",
    title: "Azure Policy",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand enforcing enterprise governance, allowed resources, regions, networking, security, and compliance requirements.",
    concept: AzureCommon,
  },

  {
    id: "AzureResourceManager",
    category: "Azure",
    title: "Azure Resource Manager",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand resource organization, deployments, resource groups, templates, and infrastructure management.",
    concept: AzureCommon,
  },

  {
    id: "AzureArchitectureCenter",
    category: "Azure",
    title: "Azure Well-Architected Framework",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand reliability, security, cost optimization, operational excellence, and performance principles for production agentic AI systems.",
    concept: AzureCommon,
  },

  // =====================================================
  // 15. COST / PERFORMANCE
  // =====================================================

  {
    id: "AzureCostOptimization",
    category: "Azure",
    title: "Azure AI Cost Optimization",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand token optimization, model routing, caching, batching, autoscaling, retrieval optimization, and agent cost controls.",
    concept: AzureCommon,
  },

  {
    id: "AzureAgentLatency",
    category: "Azure",
    title: "Agent Latency & Performance Optimization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand TTFT, token latency, parallel agent execution, asynchronous workflows, caching, model selection, and production performance optimization.",
    concept: AzureCommon,
  },

];

export default function CWDPage() {
  return (
    <CookbookApp
      data={Azure}
      title="Azure Enterprise AI Cookbook"
      subtitle="Production-Grade Agentic AI & Enterprise Architecture"
      icon="☁️"
      patternLabel="Topics"
    />
  );
}