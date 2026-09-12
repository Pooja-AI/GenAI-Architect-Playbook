import CookbookApp from "../../components/CookbookApp";

import AzureArch from "../../assets/CWD/docs/azurearch.md?raw";
import AzureAIFoundary from "../../assets/CWD/docs/azureaifoundary.md?raw";
import AzureAIFoundaryCode from "../../assets/CWD/code/azureaifoundary.py?raw"

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
    concept: "",
  },

  {
    id: "AzureOpenAI",
    category: "Azure",
    title: "Azure OpenAI Service",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise LLM integration using Azure OpenAI, including GPT models, embeddings, structured outputs, tool calling, deployments, quotas, and responsible AI.",
    concept: "",
  },

  {
    id: "AzureOpenAIModelDeployment",
    category: "Azure",
    title: "Azure OpenAI Model Deployment & Quotas",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand model deployments, TPM/RPM limits, quota management, model selection, scaling, fallback, and production reliability patterns.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureContainerAppsAgents",
    category: "Azure",
    title: "Azure Container Apps for Agents",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand hosting custom agents and worker services using Azure Container Apps with autoscaling, revisions, ingress, networking, and managed identity.",
    concept: "",
  },

  {
    id: "AzureAKSAgents",
    category: "Azure",
    title: "Azure Kubernetes Service for Agentic AI",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand deploying large-scale production agent services and worker pools on AKS with Kubernetes orchestration, scaling, networking, and security.",
    concept: "",
  },

  {
    id: "AzureFunctionsAgents",
    category: "Azure",
    title: "Azure Functions for Agent Tools",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand using serverless Azure Functions as tools and task executors for agent workflows.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureEventGrid",
    category: "Azure",
    title: "Azure Event Grid",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand event-driven architectures for triggering agents and workflows from enterprise events.",
    concept: "",
  },

  {
    id: "AzureLogicApps",
    category: "Azure",
    title: "Azure Logic Apps",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand integrating agent workflows with enterprise applications, approvals, notifications, and business processes.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureAgenticRAG",
    category: "Azure",
    title: "Azure Agentic RAG",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand query planning, retrieval agents, search agents, reranking, grounding, citations, and multi-step enterprise RAG.",
    concept: "",
  },

  {
    id: "AzureBlobStorage",
    category: "Azure",
    title: "Azure Blob Storage",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand document storage, raw enterprise files, ingestion pipelines, artifacts, and RAG data preparation using Azure Blob Storage.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureRedis",
    category: "Azure",
    title: "Azure Cache for Redis",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand short-term agent memory, session state, caching, distributed state, conversation context, and low-latency access.",
    concept: "",
  },

  {
    id: "AzureSQL",
    category: "Azure",
    title: "Azure SQL Database",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand structured enterprise data access for agent tools, workers, analytics, and transactional workloads.",
    concept: "",
  },

  {
    id: "AzureDataLake",
    category: "Azure",
    title: "Azure Data Lake Storage",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand enterprise-scale data lake architecture for analytics, AI pipelines, historical data, and agent knowledge sources.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureMCP",
    category: "Azure",
    title: "MCP Integration on Azure",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand exposing enterprise tools and data through MCP servers and integrating MCP with Azure-hosted agents and workers.",
    concept: "",
  },

  {
    id: "AzureAPIAgentTools",
    category: "Azure",
    title: "Enterprise APIs as Agent Tools",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand how agents securely invoke Salesforce, ServiceNow, SAP, SQL, M365, and internal APIs through governed Azure API layers.",
    concept: "",
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
    concept: "",
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
    concept: "",
  },

  {
    id: "SharePointIntegration",
    category: "Azure",
    title: "SharePoint / Microsoft 365 Integration",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand enterprise document ingestion, retrieval, permissions, and RAG integration with SharePoint and Microsoft 365.",
    concept: "",
  },

  {
    id: "MicrosoftFabric",
    category: "Azure",
    title: "Microsoft Fabric",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise analytics, OneLake, data engineering, data science, real-time intelligence, and AI workloads integrated with agentic systems.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureManagedIdentity",
    category: "Azure",
    title: "Azure Managed Identity",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand passwordless authentication between agents, Azure services, APIs, databases, storage, and enterprise resources.",
    concept: "",
  },

  {
    id: "AzureKeyVault",
    category: "Azure",
    title: "Azure Key Vault",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand secure management of API keys, secrets, certificates, encryption keys, and application credentials.",
    concept: "",
  },

  {
    id: "AzureRBAC",
    category: "Azure",
    title: "Azure RBAC",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand role-based authorization for users, agents, services, resources, and enterprise data.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureContentSafety",
    category: "Azure",
    title: "Azure AI Content Safety",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand content filtering, prompt safety, harmful content detection, and responsible AI controls for production GenAI systems.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureApplicationGateway",
    category: "Azure",
    title: "Azure Application Gateway",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand Layer 7 load balancing, TLS termination, routing, and Web Application Firewall integration.",
    concept: "",
  },

  {
    id: "AzureLoadBalancing",
    category: "Azure",
    title: "Azure Load Balancing",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand load balancing and traffic distribution patterns for production agent services.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureMonitor",
    category: "Azure",
    title: "Azure Monitor",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand monitoring Azure AI workloads, infrastructure, applications, agents, containers, and operational health.",
    concept: "",
  },

  {
    id: "AzureLogAnalytics",
    category: "Azure",
    title: "Log Analytics",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized logging, KQL queries, correlation IDs, agent traces, failures, and operational analytics.",
    concept: "",
  },

  {
    id: "AzureAIEvaluation",
    category: "Azure",
    title: "Azure AI Evaluation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand evaluating agent and RAG quality using groundedness, relevance, coherence, safety, tool success, latency, and cost metrics.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureDevOpsCICD",
    category: "Azure",
    title: "Azure DevOps CI/CD for Agentic AI",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand CI/CD pipelines for prompts, agents, APIs, containers, RAG pipelines, infrastructure, testing, and production releases.",
    concept: "",
  },

  {
    id: "AzureML",
    category: "Azure",
    title: "Azure Machine Learning",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise ML/AI lifecycle management, experiments, model deployment, MLOps, registries, evaluation, and integration with GenAI workloads.",
    concept: "",
  },

  {
    id: "AzureMLPromptFlow",
    category: "Azure",
    title: "Azure ML Prompt Flow",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand prompt engineering workflows, LLM evaluation, tracing, experimentation, and production GenAI lifecycle management.",
    concept: "",
  },

  {
    id: "AzureMLMLflow",
    category: "Azure",
    title: "Azure ML & MLflow",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand experiment tracking, model management, prompt/version tracking, evaluation, and reproducibility using MLflow.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureAKSNetworking",
    category: "Azure",
    title: "AKS Networking & Security",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand private AKS, ingress, workload identity, network policies, secrets, scaling, and enterprise Kubernetes security.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureResourceManager",
    category: "Azure",
    title: "Azure Resource Manager",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand resource organization, deployments, resource groups, templates, and infrastructure management.",
    concept: "",
  },

  {
    id: "AzureArchitectureCenter",
    category: "Azure",
    title: "Azure Well-Architected Framework",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand reliability, security, cost optimization, operational excellence, and performance principles for production agentic AI systems.",
    concept: "",
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
    concept: "",
  },

  {
    id: "AzureAgentLatency",
    category: "Azure",
    title: "Agent Latency & Performance Optimization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand TTFT, token latency, parallel agent execution, asynchronous workflows, caching, model selection, and production performance optimization.",
    concept: "",
  },

    // =====================================================
  // 16. SCALABILITY
  // =====================================================

  {
    id: "AzureAutoscaling",
    category: "Azure",
    title: "Azure Autoscaling",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand horizontal and event-driven autoscaling for Coordinator, Delegator, and Worker services using Azure Container Apps and AKS.",
    concept: "",
  },

  {
    id: "AzureLoadTesting",
    category: "Azure",
    title: "Azure Load Testing",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand load testing for agent APIs, RAG services, worker pools, concurrency, throughput, latency, and production capacity planning.",
    concept: "",
  },

  {
    id: "AzureProvisionedThroughput",
    category: "Azure",
    title: "Azure OpenAI Provisioned Throughput",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand predictable model capacity, throughput planning, high-volume workloads, and production LLM performance.",
    concept: "",
  },

  {
    id: "AzureFrontDoorGlobalScaling",
    category: "Azure",
    title: "Azure Front Door Global Scaling",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand global traffic routing, load balancing, health probes, failover, and multi-region agent application architecture.",
    concept: "",
  },

  // =====================================================
  // 17. RELIABILITY / RESILIENCE
  // =====================================================

  {
    id: "AzureReliabilityArchitecture",
    category: "Azure",
    title: "Azure Reliability Architecture",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand highly available CWD architecture using redundancy, health checks, retries, failover, availability zones, and resilient services.",
    concept: "",
  },

  {
    id: "AzureRetryPatterns",
    category: "Azure",
    title: "Agent Retry & Backoff Patterns",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand exponential backoff, retry limits, transient failures, retryable errors, and resilient agent-to-tool communication.",
    concept: "",
  },

  {
    id: "AzureCircuitBreaker",
    category: "Azure",
    title: "Circuit Breaker Pattern",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand preventing cascading failures when agents, APIs, LLMs, databases, or enterprise systems become unavailable.",
    concept: "",
  },

  {
    id: "AzureDeadLetterQueue",
    category: "Azure",
    title: "Service Bus Dead Letter Queue",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand handling permanently failed agent tasks, poison messages, retries, investigation, replay, and operational recovery.",
    concept: "",
  },

  {
    id: "AzureIdempotency",
    category: "Azure",
    title: "Agent Idempotency",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand preventing duplicate tool execution and duplicate business transactions when agent tasks are retried.",
    concept: "",
  },

  {
    id: "AzureMultiRegion",
    category: "Azure",
    title: "Azure Multi-Region Architecture",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand active-active and active-passive architectures for highly available enterprise Agentic AI platforms.",
    concept: "",
  },

  {
    id: "AzureDisasterRecovery",
    category: "Azure",
    title: "Azure Disaster Recovery",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand backup, recovery, regional failover, RPO, RTO, and disaster recovery strategies for production agent platforms.",
    concept: "",
  },

  // =====================================================
  // 18. OBSERVABILITY
  // =====================================================

  {
    id: "AzureManagedGrafana",
    category: "Azure",
    title: "Azure Managed Grafana",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand operational dashboards for agent latency, throughput, failures, token usage, infrastructure health, and business KPIs.",
    concept: "",
  },

  {
    id: "AzureMonitorAlerts",
    category: "Azure",
    title: "Azure Monitor Alerts",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand metric alerts, log alerts, action groups, anomaly detection, and proactive incident management.",
    concept: "",
  },

  {
    id: "AzureMonitorWorkbooks",
    category: "Azure",
    title: "Azure Monitor Workbooks",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand building custom operational dashboards for CWD agent health, latency, failures, cost, and usage.",
    concept: "",
  },

  {
    id: "OpenTelemetryAzure",
    category: "Azure",
    title: "OpenTelemetry with Azure",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand distributed tracing across Teams, APIs, Coordinator, Delegators, Workers, MCP tools, databases, and LLM calls.",
    concept: "",
  },

  {
    id: "AgentCorrelationTracing",
    category: "Azure",
    title: "Agent Correlation & Distributed Tracing",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand correlation IDs and end-to-end tracing across hierarchical multi-agent workflows.",
    concept: "",
  },

  {
    id: "AzureAIMonitoring",
    category: "Azure",
    title: "LLM & Agent Observability",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand monitoring token usage, TTFT, latency, model calls, tool calls, agent failures, RAG quality, and cost per request.",
    concept: "",
  },

  // =====================================================
  // 19. AI EVALUATION / QUALITY
  // =====================================================

  {
    id: "AzureAgentEvaluation",
    category: "Azure",
    title: "Agent Evaluation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand evaluation of agent responses, tool usage, task completion, groundedness, relevance, safety, latency, and cost.",
    concept: "",
  },

  {
    id: "AzureRAGEvaluation",
    category: "Azure",
    title: "RAG Evaluation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand retrieval quality, groundedness, relevance, context precision, context recall, and hallucination detection.",
    concept: "",
  },

  {
    id: "AzureRedTeam",
    category: "Azure",
    title: "AI Red Teaming",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand adversarial testing for prompt injection, jailbreaks, data leakage, malicious tools, unsafe responses, and agent vulnerabilities.",
    concept: "",
  },

  // =====================================================
  // 20. AI SAFETY
  // =====================================================

  {
    id: "AzureAISafetyArchitecture",
    category: "Azure",
    title: "Enterprise AI Safety Architecture",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand layered AI safety controls across prompts, models, agents, tools, enterprise data, users, and outputs.",
    concept: "",
  },

  {
    id: "AzurePromptInjectionDefense",
    category: "Azure",
    title: "Prompt Injection Defense",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand direct and indirect prompt injection defenses for RAG and multi-agent systems.",
    concept: "",
  },

  {
    id: "AzurePromptShields",
    category: "Azure",
    title: "Prompt Shields",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand protection against prompt injection and malicious instructions in enterprise GenAI applications.",
    concept: "",
  },

  {
    id: "AzurePIIProtection",
    category: "Azure",
    title: "PII Detection & Protection",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand detecting, masking, filtering, and protecting personally identifiable information in agent workflows.",
    concept: "",
  },

  {
    id: "AzureHumanInLoop",
    category: "Azure",
    title: "Human-in-the-Loop Agent Workflows",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand approval workflows for high-risk agent actions such as financial transactions, data deletion, and sensitive operations.",
    concept: "",
  },

  {
    id: "AzureToolAuthorization",
    category: "Azure",
    title: "Agent Tool Authorization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand policy-based authorization for agent tools and prevent unauthorized or dangerous tool execution.",
    concept: "",
  },

  {
    id: "AzureGuardrails",
    category: "Azure",
    title: "Agent Guardrails",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand input, reasoning, tool, data, and output guardrails for production Agentic AI systems.",
    concept: "",
  },

  // =====================================================
  // 21. SECURITY
  // =====================================================

  {
    id: "AzureDefenderCloud",
    category: "Azure",
    title: "Microsoft Defender for Cloud",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand cloud security posture management, workload protection, recommendations, vulnerabilities, and security monitoring.",
    concept: "",
  },

  {
    id: "MicrosoftSentinel",
    category: "Azure",
    title: "Microsoft Sentinel",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand SIEM, security analytics, threat detection, incident investigation, and security monitoring for enterprise AI platforms.",
    concept: "",
  },

  {
    id: "AzureFirewall",
    category: "Azure",
    title: "Azure Firewall",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand network traffic filtering, outbound control, application rules, network rules, and enterprise network security.",
    concept: "",
  },

  {
    id: "AzureWAF",
    category: "Azure",
    title: "Azure Web Application Firewall",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand protecting Teams/web/API entry points against common web attacks such as SQL injection and XSS.",
    concept: "",
  },

  {
    id: "AzureDDoS",
    category: "Azure",
    title: "Azure DDoS Protection",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand protection against distributed denial-of-service attacks for internet-facing enterprise applications.",
    concept: "",
  },

  {
    id: "EntraConditionalAccess",
    category: "Azure",
    title: "Microsoft Entra Conditional Access",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand policy-based access control using user, device, location, application, and risk conditions.",
    concept: "",
  },

  {
    id: "EntraWorkloadIdentity",
    category: "Azure",
    title: "Microsoft Entra Workload Identity",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand secure identity for containerized workloads and agent services without storing credentials.",
    concept: "",
  },

  // =====================================================
  // 22. GOVERNANCE / COMPLIANCE
  // =====================================================

  {
    id: "MicrosoftPurview",
    category: "Azure",
    title: "Microsoft Purview",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand enterprise data governance, classification, lineage, sensitive data discovery, and compliance.",
    concept: "",
  },

  {
    id: "AzurePolicyGovernance",
    category: "Azure",
    title: "Azure Policy & Enterprise Governance",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand enforcing organizational standards for regions, networking, security, resource types, and compliance.",
    concept: "",
  },

  {
    id: "AzureCompliance",
    category: "Azure",
    title: "Azure Compliance & Regulatory Architecture",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand designing enterprise AI systems for security, privacy, auditability, compliance, and regulatory requirements.",
    concept: "",
  },

  {
    id: "AzureAuditLogging",
    category: "Azure",
    title: "Azure Audit Logging",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand activity logs, diagnostic logs, audit trails, agent actions, tool calls, and enterprise compliance evidence.",
    concept: "",
  },

  // =====================================================
  // 23. MAINTAINABILITY
  // =====================================================

  {
    id: "AzureAppConfiguration",
    category: "Azure",
    title: "Azure App Configuration",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand centralized configuration, feature flags, environment-specific settings, and configuration management.",
    concept: "",
  },

  {
    id: "AzureBicep",
    category: "Azure",
    title: "Azure Bicep Infrastructure as Code",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand repeatable Azure infrastructure deployment using Bicep and infrastructure-as-code practices.",
    concept: "",
  },

  {
    id: "AzureTerraform",
    category: "Azure",
    title: "Terraform for Azure",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand multi-environment and multi-cloud infrastructure provisioning for enterprise AI platforms.",
    concept: "",
  },

  {
    id: "AzureContainerRegistry",
    category: "Azure",
    title: "Azure Container Registry",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand secure container image storage, versioning, scanning, and deployment for agent services.",
    concept: "",
  },

  {
    id: "AzureFeatureFlags",
    category: "Azure",
    title: "Feature Flags for Agentic AI",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand controlled rollout of new agents, prompts, models, tools, and features without full application redeployment.",
    concept: "",
  },

  {
    id: "AzureAgentVersioning",
    category: "Azure",
    title: "Agent & Prompt Versioning",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand version control for agents, prompts, tools, model configurations, evaluation datasets, and workflows.",
    concept: "",
  },

  {
    id: "AzureAgentRegistry",
    category: "Azure",
    title: "Agent Registry & Tool Registry",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized discovery, ownership, capabilities, versions, health, and lifecycle management of enterprise agents and tools.",
    concept: "",
  },

  // =====================================================
  // 24. COST OPTIMIZATION
  // =====================================================

  {
    id: "AzureCostManagement",
    category: "Azure",
    title: "Azure Cost Management",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand monitoring, allocation, budgeting, forecasting, and optimization of enterprise AI infrastructure costs.",
    concept: "",
  },

  {
    id: "AzureLLMCostOptimization",
    category: "Azure",
    title: "LLM Cost Optimization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand model routing, prompt optimization, caching, token reduction, batching, smaller models, and agent cost controls.",
    concept: "",
  },

  {
    id: "AzureCachingStrategy",
    category: "Azure",
    title: "AI Caching Strategy",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand semantic caching, response caching, retrieval caching, and Redis-based optimization for reducing latency and LLM cost.",
    concept: "",
  },

  // =====================================================
  // 25. PRODUCTION OPERATIONS
  // =====================================================

  {
    id: "AzureHealthProbes",
    category: "Azure",
    title: "Health Checks & Probes",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand liveness, readiness, dependency health, and automated traffic removal for unhealthy agent instances.",
    concept: "",
  },

  {
    id: "AzureBlueGreenDeployment",
    category: "Azure",
    title: "Blue-Green Deployment",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand zero-downtime releases and safe rollout of new agent, prompt, model, and application versions.",
    concept: "",
  },

  {
    id: "AzureCanaryDeployment",
    category: "Azure",
    title: "Canary Deployment",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand gradually exposing new agent versions to a subset of users and monitoring quality before full rollout.",
    concept: "",
  },

  {
    id: "AzureIncidentManagement",
    category: "Azure",
    title: "Production Incident Management",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand alerts, incident detection, root-cause analysis, runbooks, rollback, recovery, and operational support.",
    concept: "",
  },

  // =====================================================
  // 26. AZURE ARCHITECTURE PRINCIPLES
  // =====================================================

  {
    id: "AzureWellArchitected",
    category: "Azure",
    title: "Azure Well-Architected Framework",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand reliability, security, cost optimization, operational excellence, and performance efficiency for production Agentic AI.",
    concept: "",
  },

  {
    id: "AzureLandingZone",
    category: "Azure",
    title: "Azure Landing Zones",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand enterprise Azure foundation, subscriptions, management groups, networking, identity, governance, and policy.",
    concept: "",
  },

  {
    id: "AzureEnterpriseArchitecture",
    category: "Azure",
    title: "Enterprise Azure Architecture Patterns",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand designing secure, scalable, maintainable, observable, resilient, and governed Azure Agentic AI platforms.",
    concept: "",
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