import CookbookApp from "../../components/CookbookApp";
import AzureAWSTable from "../../assets/CWD/docs/azureawstable.md?raw";
import AWSBedrock from "../../assets/CWD/docs/AmazonBedrock.md?raw";
import AWSBedrockCode from "../../assets/CWD/code/awsbedrock.py?raw";

const AWS = [
  // =====================================================
  // 01. AWS ENTERPRISE AGENTIC AI ARCHITECTURE
  // =====================================================

  {
    id: "Azure-AWS-Table",
    category: "AWS",
    title: "Azure-AWS-Table",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand the complete production-grade AWS architecture for CWD, including Coordinator, Delegators, Workers, RAG, APIs, messaging, security, scalability, and observability.",
    concept: AzureAWSTable,
  },

  // =====================================================
  // 02. FOUNDATION MODELS / AI PLATFORM
  // =====================================================

  {
    id: "AmazonBedrock",
    category: "AWS",
    title: "Amazon Bedrock",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise foundation model access, model selection, inference, agents, knowledge bases, guardrails, evaluation, and production GenAI architecture.",
    concept: AWSBedrock,
    code:AWSBedrockCode
  },

  {
    id: "AmazonBedrockModels",
    category: "AWS",
    title: "Amazon Bedrock Foundation Models",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand selecting and using foundation models from Amazon Bedrock for reasoning, generation, embeddings, summarization, classification, and agent workloads.",
    concept: "",
  },

  {
    id: "AmazonBedrockAgents",
    category: "AWS",
    title: "Amazon Bedrock Agents",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand managed agent orchestration, action groups, tools, knowledge bases, prompts, session state, and enterprise agent execution.",
    concept: "",
  },

  {
    id: "AmazonBedrockKnowledgeBases",
    category: "AWS",
    title: "Amazon Bedrock Knowledge Bases",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand managed RAG pipelines, data ingestion, embeddings, vector retrieval, metadata filtering, and grounded responses.",
    concept: "",
  },

  {
    id: "AmazonBedrockGuardrails",
    category: "AWS",
    title: "Amazon Bedrock Guardrails",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand configurable safeguards for harmful content, denied topics, sensitive information, and unsafe model interactions.",
    concept: "",
  },

  {
    id: "AmazonBedrockPromptManagement",
    category: "AWS",
    title: "Amazon Bedrock Prompt Management",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand reusable prompt templates, prompt versioning, variables, and lifecycle management for enterprise GenAI applications.",
    concept: "",
  },

  // =====================================================
  // 03. AGENT ORCHESTRATION
  // =====================================================

  {
    id: "AWSAgentOrchestration",
    category: "AWS",
    title: "AWS Agent Orchestration",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand implementing Coordinator, Delegator, and Worker patterns using AWS managed services and custom agent frameworks.",
    concept: "",
  },

  {
    id: "AWSLambdaAgents",
    category: "AWS",
    title: "AWS Lambda for Agent Tools",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand using serverless Lambda functions as agent tools, action handlers, data processors, and lightweight workers.",
    concept: "",
  },

  {
    id: "AmazonECS",
    category: "AWS",
    title: "Amazon ECS for Agent Services",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand deploying containerized Coordinator, Delegator, and Worker services using Amazon ECS and Fargate.",
    concept: "",
  },

  {
    id: "AmazonEKS",
    category: "AWS",
    title: "Amazon EKS for Agentic AI",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand Kubernetes-based deployment of large-scale agent services, worker pools, networking, autoscaling, and workload identity.",
    concept: "",
  },

  {
    id: "AWSStepFunctions",
    category: "AWS",
    title: "AWS Step Functions",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand durable workflow orchestration, retries, branching, parallel execution, state management, and long-running agent workflows.",
    concept: "",
  },

  // =====================================================
  // 04. MESSAGING / EVENT-DRIVEN ARCHITECTURE
  // =====================================================

  {
    id: "AmazonSQS",
    category: "AWS",
    title: "Amazon SQS",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand asynchronous agent task execution, queue-based decoupling, retries, visibility timeout, and dead-letter queues.",
    concept: "",
  },

  {
    id: "AmazonSNS",
    category: "AWS",
    title: "Amazon SNS",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand pub/sub notifications and event fan-out patterns for enterprise agent workflows.",
    concept: "",
  },

  {
    id: "AmazonEventBridge",
    category: "AWS",
    title: "Amazon EventBridge",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand event-driven agent activation, event routing, rules, schedules, and integration between enterprise systems.",
    concept: "",
  },

  {
    id: "AWSKafkaMSK",
    category: "AWS",
    title: "Amazon MSK / Kafka",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand high-throughput event streaming for agent communication, enterprise events, telemetry, and asynchronous processing.",
    concept: "",
  },

  // =====================================================
  // 05. RAG / SEARCH / KNOWLEDGE
  // =====================================================

  {
    id: "AmazonOpenSearch",
    category: "AWS",
    title: "Amazon OpenSearch Service",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand vector search, keyword search, hybrid retrieval, semantic search, indexing, filtering, and enterprise Agentic RAG.",
    concept: "",
  },

  {
    id: "AmazonOpenSearchServerless",
    category: "AWS",
    title: "Amazon OpenSearch Serverless",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand serverless vector and search infrastructure for scalable GenAI and RAG applications.",
    concept: "",
  },

  {
    id: "AmazonS3RAG",
    category: "AWS",
    title: "Amazon S3 for RAG",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand enterprise document storage, raw data ingestion, artifacts, and knowledge-base source data using Amazon S3.",
    concept: "",
  },

  {
    id: "AWSAgenticRAG",
    category: "AWS",
    title: "AWS Agentic RAG",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand query planning, retrieval agents, tool-based search, reranking, grounding, citations, and multi-step RAG.",
    concept: "",
  },

  {
    id: "AWSVectorSearch",
    category: "AWS",
    title: "AWS Vector Search",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand embeddings, vector indexes, similarity search, metadata filtering, hybrid retrieval, and scalable vector databases.",
    concept: "",
  },

  // =====================================================
  // 06. DATA / STATE / MEMORY
  // =====================================================

  {
    id: "AmazonDynamoDB",
    category: "AWS",
    title: "Amazon DynamoDB",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand scalable NoSQL storage for conversation state, task state, agent metadata, session information, and application data.",
    concept: "",
  },

  {
    id: "AmazonElastiCacheRedis",
    category: "AWS",
    title: "Amazon ElastiCache for Redis",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand short-term agent memory, session state, caching, semantic caching, and low-latency distributed state.",
    concept: "",
  },

  {
    id: "AmazonAurora",
    category: "AWS",
    title: "Amazon Aurora",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand relational enterprise data access for agent tools, transactional workloads, and business applications.",
    concept: "",
  },

  {
    id: "AWSLakeFormation",
    category: "AWS",
    title: "AWS Lake Formation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand enterprise data lake governance, permissions, cataloging, and secure data access for AI workloads.",
    concept: "",
  },

  {
    id: "AWSGlue",
    category: "AWS",
    title: "AWS Glue",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand serverless data integration, ETL, metadata catalogs, and data preparation for AI and RAG pipelines.",
    concept: "",
  },

  {
    id: "AmazonAthena",
    category: "AWS",
    title: "Amazon Athena",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand querying enterprise data stored in S3 for analytics and agent-powered data access.",
    concept: "",
  },

  // =====================================================
  // 07. API / TOOL INTEGRATION
  // =====================================================

  {
    id: "AmazonAPIGateway",
    category: "AWS",
    title: "Amazon API Gateway",
    difficulty: "Advanced",
    time: "~55 min",
    description:
      "Understand secure API exposure for agents, workers, enterprise tools, authentication, throttling, validation, and monitoring.",
    concept: "",
  },

  {
    id: "AWSAppSync",
    category: "AWS",
    title: "AWS AppSync",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand GraphQL APIs, real-time applications, data aggregation, and agent-facing application APIs.",
    concept: "",
  },

  {
    id: "AWSMCP",
    category: "AWS",
    title: "MCP Integration on AWS",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand deploying MCP servers and exposing enterprise tools and resources to AWS-hosted agents.",
    concept: "",
  },

  {
    id: "AWSAgentTools",
    category: "AWS",
    title: "Enterprise APIs as Agent Tools",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand integrating Salesforce, ServiceNow, SAP, databases, internal APIs, and enterprise applications with agent tools.",
    concept: "",
  },

  // =====================================================
  // 08. IDENTITY / ACCESS / SECURITY
  // =====================================================

  {
    id: "AWSIAM",
    category: "AWS",
    title: "AWS IAM",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand users, roles, policies, permissions, least privilege, and service-to-service authorization for Agentic AI.",
    concept: "",
  },

  {
    id: "AWSIAMRoles",
    category: "AWS",
    title: "IAM Roles for Agent Workloads",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand secure identity delegation between Coordinator, Delegators, Workers, Lambda, ECS, EKS, and AWS services.",
    concept: "",
  },

  {
    id: "AmazonCognito",
    category: "AWS",
    title: "Amazon Cognito",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand user authentication, federation, OAuth/OIDC, tokens, and application identity for enterprise AI applications.",
    concept: "",
  },

  {
    id: "AWSSecretsManager",
    category: "AWS",
    title: "AWS Secrets Manager",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand secure storage and rotation of API credentials, database credentials, and application secrets.",
    concept: "",
  },

  {
    id: "AWSKMS",
    category: "AWS",
    title: "AWS Key Management Service",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand encryption key management, data encryption, key policies, and enterprise security controls.",
    concept: "",
  },

  // =====================================================
  // 09. NETWORK SECURITY
  // =====================================================

  {
    id: "AmazonVPC",
    category: "AWS",
    title: "Amazon VPC",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand private networking, subnets, routing, security groups, NAT, gateways, and network isolation for Agentic AI.",
    concept: "",
  },

  {
    id: "AWSPrivateLink",
    category: "AWS",
    title: "AWS PrivateLink",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand private connectivity between agent workloads and AWS services or enterprise services without public internet exposure.",
    concept: "",
  },

  {
    id: "AWSNetworkFirewall",
    category: "AWS",
    title: "AWS Network Firewall",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized network traffic inspection and protection for enterprise AI environments.",
    concept: "",
  },

  {
    id: "AWSWAF",
    category: "AWS",
    title: "AWS WAF",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand protecting API and web entry points from common application-layer attacks.",
    concept: "",
  },

  {
    id: "AWSShield",
    category: "AWS",
    title: "AWS Shield",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand DDoS protection for internet-facing Agentic AI applications and APIs.",
    concept: "",
  },

  // =====================================================
  // 10. SCALABILITY
  // =====================================================

  {
    id: "AWSAutoScaling",
    category: "AWS",
    title: "AWS Auto Scaling",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand horizontal scaling of Coordinator, Delegator, Worker, API, and container workloads.",
    concept: "",
  },

  {
    id: "AWSElasticLoadBalancing",
    category: "AWS",
    title: "Elastic Load Balancing",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand distributing traffic across healthy agent service instances and enabling highly available workloads.",
    concept: "",
  },

  {
    id: "AWSFargate",
    category: "AWS",
    title: "AWS Fargate",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand serverless container execution for scalable agent services without managing EC2 infrastructure.",
    concept: "",
  },

  {
    id: "AWSCloudFront",
    category: "AWS",
    title: "Amazon CloudFront",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand CDN, edge delivery, caching, TLS, and global distribution for CWD frontend applications.",
    concept: "",
  },

  // =====================================================
  // 11. RELIABILITY / RESILIENCE
  // =====================================================

  {
    id: "AWSHighAvailability",
    category: "AWS",
    title: "AWS High Availability Architecture",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand multi-AZ architecture, redundancy, health checks, failover, and resilient agent services.",
    concept: "",
  },

  {
    id: "AWSRetryBackoff",
    category: "AWS",
    title: "AWS Retry & Backoff Patterns",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand retries, exponential backoff, transient failure handling, and resilient agent execution.",
    concept: "",
  },

  {
    id: "AWSDeadLetterQueue",
    category: "AWS",
    title: "SQS Dead Letter Queues",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand handling failed agent tasks, poison messages, retries, investigation, and message replay.",
    concept: "",
  },

  {
    id: "AWSCircuitBreaker",
    category: "AWS",
    title: "Circuit Breaker Pattern",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand preventing cascading failures across agents, APIs, databases, tools, and model services.",
    concept: "",
  },

  {
    id: "AWSBackup",
    category: "AWS",
    title: "AWS Backup",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand centralized backup and recovery strategies for production agentic applications and data.",
    concept: "",
  },

  {
    id: "AWSDisasterRecovery",
    category: "AWS",
    title: "AWS Disaster Recovery",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand RPO, RTO, backup, regional failover, recovery strategies, and business continuity.",
    concept: "",
  },

  // =====================================================
  // 12. OBSERVABILITY
  // =====================================================

  {
    id: "AmazonCloudWatch",
    category: "AWS",
    title: "Amazon CloudWatch",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand metrics, logs, dashboards, alarms, infrastructure monitoring, and operational visibility for agents.",
    concept: "",
  },

  {
    id: "AWSXRay",
    category: "AWS",
    title: "AWS X-Ray",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand distributed tracing across API Gateway, Lambda, containers, databases, and agent services.",
    concept: "",
  },

  {
    id: "AWSCloudTrail",
    category: "AWS",
    title: "AWS CloudTrail",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand API activity auditing, user actions, service activity, security investigations, and compliance.",
    concept: "",
  },

  {
    id: "AWSOpenTelemetry",
    category: "AWS",
    title: "AWS Distro for OpenTelemetry",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand vendor-neutral distributed tracing and telemetry across multi-agent workloads.",
    concept: "",
  },

  {
    id: "AWSManagedGrafana",
    category: "AWS",
    title: "Amazon Managed Grafana",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand operational dashboards for agent latency, throughput, failures, infrastructure health, and business KPIs.",
    concept: "",
  },

  {
    id: "AWSAgentObservability",
    category: "AWS",
    title: "Agent & LLM Observability",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand tracking token usage, model latency, TTFT, tool calls, agent execution, RAG quality, failures, and cost.",
    concept: "",
  },

  // =====================================================
  // 13. AI SAFETY
  // =====================================================

  {
    id: "BedrockGuardrails",
    category: "AWS",
    title: "Amazon Bedrock Guardrails",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand configurable safety controls for harmful content, denied topics, sensitive information, and unsafe outputs.",
    concept: "",
  },

  {
    id: "AWSPromptInjection",
    category: "AWS",
    title: "Prompt Injection Defense",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand defenses against direct and indirect prompt injection attacks in RAG and multi-agent systems.",
    concept: "",
  },

  {
    id: "AWSPiiProtection",
    category: "AWS",
    title: "PII Detection & Protection",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand detecting, masking, filtering, and protecting sensitive information in AI workflows.",
    concept: "",
  },

  {
    id: "AWSToolAuthorization",
    category: "AWS",
    title: "Agent Tool Authorization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand least-privilege authorization and policy controls for agent tool execution.",
    concept: "",
  },

  {
    id: "AWSHumanApproval",
    category: "AWS",
    title: "Human-in-the-Loop Agent Workflows",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand approval workflows for high-risk actions such as financial operations, deletion, and sensitive data access.",
    concept: "",
  },

  {
    id: "AWSResponsibleAI",
    category: "AWS",
    title: "Responsible AI on AWS",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand safety, fairness, explainability, privacy, governance, and responsible AI practices.",
    concept: "",
  },

  // =====================================================
  // 14. SECURITY MONITORING
  // =====================================================

  {
    id: "AmazonGuardDuty",
    category: "AWS",
    title: "Amazon GuardDuty",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand threat detection and continuous security monitoring across AWS workloads.",
    concept: "",
  },

  {
    id: "AWSSecurityHub",
    category: "AWS",
    title: "AWS Security Hub",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized security posture management and aggregation of security findings.",
    concept: "",
  },

  {
    id: "AmazonMacie",
    category: "AWS",
    title: "Amazon Macie",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand sensitive data discovery and protection for data stored in Amazon S3.",
    concept: "",
  },

  {
    id: "AmazonInspector",
    category: "AWS",
    title: "Amazon Inspector",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand vulnerability assessment for EC2, containers, and Lambda workloads.",
    concept: "",
  },

  {
    id: "AWSSecurityLake",
    category: "AWS",
    title: "Amazon Security Lake",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized security data collection and analysis across enterprise AWS environments.",
    concept: "",
  },

  // =====================================================
  // 15. GOVERNANCE / COMPLIANCE
  // =====================================================

  {
    id: "AWSOrganizations",
    category: "AWS",
    title: "AWS Organizations",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand multi-account enterprise AWS architecture, centralized governance, policies, and account management.",
    concept: "",
  },

  {
    id: "AWSSCP",
    category: "AWS",
    title: "AWS Service Control Policies",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand organization-level permission boundaries and enterprise governance controls.",
    concept: "",
  },

  {
    id: "AWSControlTower",
    category: "AWS",
    title: "AWS Control Tower",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand governed multi-account landing zones, guardrails, centralized governance, and enterprise AWS foundations.",
    concept: "",
  },

  {
    id: "AWSConfig",
    category: "AWS",
    title: "AWS Config",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand resource configuration tracking, compliance rules, auditing, and governance.",
    concept: "",
  },

  {
    id: "AWSArtifact",
    category: "AWS",
    title: "AWS Artifact",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand access to AWS compliance documentation and regulatory reports.",
    concept: "",
  },

  // =====================================================
  // 16. DATA GOVERNANCE
  // =====================================================

  {
    id: "AWSGlueDataCatalog",
    category: "AWS",
    title: "AWS Glue Data Catalog",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand metadata management and centralized data discovery for enterprise AI and analytics.",
    concept: "",
  },

  {
    id: "AWSLakeFormationSecurity",
    category: "AWS",
    title: "Lake Formation Security",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand fine-grained access control and governed data access for AI and analytics workloads.",
    concept: "",
  },

  {
    id: "AWSDMS",
    category: "AWS",
    title: "AWS Database Migration Service",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand migrating enterprise databases into AWS data platforms used by AI systems.",
    concept: "",
  },

  // =====================================================
  // 17. DEVOPS / MAINTAINABILITY
  // =====================================================

  {
    id: "AWSCodeCommit",
    category: "AWS",
    title: "AWS CodeCommit",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand source control patterns for AWS application and infrastructure code.",
    concept: "",
  },

  {
    id: "AWSCodeBuild",
    category: "AWS",
    title: "AWS CodeBuild",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand automated application builds, testing, packaging, and container image creation.",
    concept: "",
  },

  {
    id: "AWSCodePipeline",
    category: "AWS",
    title: "AWS CodePipeline",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand CI/CD pipelines for agent services, containers, infrastructure, prompts, and AI applications.",
    concept: "",
  },

  {
    id: "AWSCodeDeploy",
    category: "AWS",
    title: "AWS CodeDeploy",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand automated deployment strategies and controlled application releases.",
    concept: "",
  },

  {
    id: "AmazonECR",
    category: "AWS",
    title: "Amazon ECR",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand secure container image storage, versioning, scanning, and deployment for agent services.",
    concept: "",
  },

  {
    id: "AWSCloudFormation",
    category: "AWS",
    title: "AWS CloudFormation",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand infrastructure as code and repeatable deployment of enterprise AI environments.",
    concept: "",
  },

  {
    id: "AWSCDK",
    category: "AWS",
    title: "AWS CDK",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand defining AWS infrastructure using programming languages and reusable constructs.",
    concept: "",
  },

  {
    id: "AWSTerraform",
    category: "AWS",
    title: "Terraform for AWS",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand multi-cloud infrastructure provisioning and reusable enterprise infrastructure patterns.",
    concept: "",
  },

  // =====================================================
  // 18. AI / ML OPS
  // =====================================================

  {
    id: "AmazonSageMaker",
    category: "AWS",
    title: "Amazon SageMaker",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand enterprise ML development, training, deployment, monitoring, experimentation, and MLOps.",
    concept: "",
  },

  {
    id: "SageMakerPipelines",
    category: "AWS",
    title: "SageMaker Pipelines",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand automated ML workflows, model lifecycle management, validation, and deployment pipelines.",
    concept: "",
  },

  {
    id: "SageMakerModelRegistry",
    category: "AWS",
    title: "SageMaker Model Registry",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand model versioning, approval workflows, lifecycle management, and controlled deployment.",
    concept: "",
  },

  {
    id: "SageMakerClarify",
    category: "AWS",
    title: "SageMaker Clarify",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand bias detection, explainability, and responsible ML practices.",
    concept: "",
  },

  {
    id: "SageMakerModelMonitor",
    category: "AWS",
    title: "SageMaker Model Monitor",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand production model monitoring, data drift, model quality, and operational alerts.",
    concept: "",
  },

  // =====================================================
  // 19. PERFORMANCE / COST
  // =====================================================

  {
    id: "AWSPerformanceOptimization",
    category: "AWS",
    title: "Agent Performance Optimization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand TTFT, latency, concurrency, parallel workers, caching, model selection, and throughput optimization.",
    concept: "",
  },

  {
    id: "AWSLLMCostOptimization",
    category: "AWS",
    title: "LLM Cost Optimization",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand model routing, token optimization, caching, prompt compression, batching, and agent cost controls.",
    concept: "",
  },

  {
    id: "AWSBillingCostManagement",
    category: "AWS",
    title: "AWS Cost Management",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand budgets, cost allocation, forecasting, tagging, monitoring, and optimization of enterprise AI workloads.",
    concept: "",
  },

  {
    id: "AWSCostExplorer",
    category: "AWS",
    title: "AWS Cost Explorer",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand analyzing infrastructure, model, storage, API, and agent workload costs.",
    concept: "",
  },

  // =====================================================
  // 20. PRODUCTION DEPLOYMENT
  // =====================================================

  {
    id: "AWSBlueGreenDeployment",
    category: "AWS",
    title: "AWS Blue-Green Deployment",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand safe zero-downtime releases for agent services and production applications.",
    concept: "",
  },

  {
    id: "AWSCanaryDeployment",
    category: "AWS",
    title: "AWS Canary Deployment",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand gradually releasing new agent, prompt, model, and application versions.",
    concept: "",
  },

  {
    id: "AWSHealthChecks",
    category: "AWS",
    title: "Health Checks & Service Resilience",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand health checks, readiness, liveness, dependency checks, and automatic removal of unhealthy instances.",
    concept: "",
  },

  // =====================================================
  // 21. FRONTEND / APPLICATION
  // =====================================================

  {
    id: "AWSStaticFrontend",
    category: "AWS",
    title: "AWS Static Web Hosting",
    difficulty: "Intermediate",
    time: "~35 min",
    description:
      "Understand hosting the CWD React frontend using Amazon S3 and CloudFront.",
    concept: "",
  },

  {
    id: "AWSCloudFrontFrontend",
    category: "AWS",
    title: "CloudFront for CWD Frontend",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand global CDN delivery, caching, TLS, routing, and secure frontend access.",
    concept: "",
  },

  // =====================================================
  // 22. ENTERPRISE INTEGRATION
  // =====================================================

  {
    id: "AWSDirectoryService",
    category: "AWS",
    title: "AWS Directory Service",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand enterprise directory integration and identity management patterns.",
    concept: "",
  },

  {
    id: "AWSPrivateEnterpriseIntegration",
    category: "AWS",
    title: "Private Enterprise System Integration",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand securely connecting agents to Salesforce, ServiceNow, SAP, databases, and internal enterprise systems.",
    concept: "",
  },

  {
    id: "AWSDirectConnect",
    category: "AWS",
    title: "AWS Direct Connect",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand dedicated private connectivity between enterprise data centers and AWS AI workloads.",
    concept: "",
  },

  // =====================================================
  // 23. MAINTAINABILITY / OPERATIONS
  // =====================================================

  {
    id: "AWSAppConfig",
    category: "AWS",
    title: "AWS AppConfig",
    difficulty: "Intermediate",
    time: "~40 min",
    description:
      "Understand centralized configuration, feature flags, controlled releases, and runtime configuration management.",
    concept: "",
  },

  {
    id: "AWSSystemsManager",
    category: "AWS",
    title: "AWS Systems Manager",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand operational management, parameter storage, automation, patching, and fleet management.",
    concept: "",
  },

  {
    id: "AWSAgentRegistry",
    category: "AWS",
    title: "Agent & Tool Registry",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand centralized discovery, ownership, capabilities, versions, health, and lifecycle management of agents and tools.",
    concept: "",
  },

  {
    id: "AWSPromptVersioning",
    category: "AWS",
    title: "Prompt & Agent Versioning",
    difficulty: "Advanced",
    time: "~40 min",
    description:
      "Understand versioning prompts, agent configurations, tools, models, workflows, and evaluation datasets.",
    concept: "",
  },

  // =====================================================
  // 24. ARCHITECTURE / BEST PRACTICES
  // =====================================================

  {
    id: "AWSWellArchitected",
    category: "AWS",
    title: "AWS Well-Architected Framework",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.",
    concept: "",
  },

  {
    id: "AWSGenerativeAIWellArchitected",
    category: "AWS",
    title: "Generative AI Well-Architected",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand architecture principles for secure, reliable, responsible, performant, and cost-effective GenAI systems.",
    concept: "",
  },

  {
    id: "AWSLandingZone",
    category: "AWS",
    title: "AWS Landing Zone",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand enterprise AWS foundations including accounts, networking, security, governance, logging, and organizational controls.",
    concept: "",
  },

  {
    id: "AWSEnterpriseArchitecture",
    category: "AWS",
    title: "AWS Enterprise Agentic AI Architecture",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand designing secure, scalable, resilient, observable, maintainable, and governed Agentic AI platforms on AWS.",
    concept: "",
  },
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={AWS}
      title="AWS Enterprise AI Cookbook"
      subtitle="Production-Grade Agentic AI & Enterprise Architecture"
      icon="☁️"
      patternLabel="Topics"
    />
  );
}