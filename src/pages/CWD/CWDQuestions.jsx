import CookbookApp from "../../components/CookbookApp";
const AzureEnterpriseQuestions = [
  // =====================================================
  // 10. AZURE AI SEARCH
  // =====================================================

  {
    id: "what-is-azure-ai-search",
    category: "Azure AI Search",
    title: "What is Azure AI Search?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand Azure AI Search and how it provides enterprise search, vector retrieval, semantic ranking, and RAG capabilities.",
  },
  {
    id: "what-is-an-index",
    category: "Azure AI Search",
    title: "What is an index?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand the role of an Azure AI Search index and how documents and searchable fields are organized.",
  },
  {
    id: "what-is-an-indexer",
    category: "Azure AI Search",
    title: "What is an indexer?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how Azure AI Search indexers extract data from supported sources and populate search indexes.",
  },
  {
    id: "what-is-a-data-source",
    category: "Azure AI Search",
    title: "What is a data source?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how Azure AI Search connects to enterprise data sources such as Blob Storage, SQL, and Cosmos DB.",
  },
  {
    id: "what-is-a-skillset",
    category: "Azure AI Search",
    title: "What is a skillset?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand AI enrichment pipelines, built-in skills, custom skills, and how skillsets transform enterprise content.",
  },
  {
    id: "what-is-vector-search",
    category: "Azure AI Search",
    title: "What is vector search?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand embeddings, vector indexes, similarity search, and how vector retrieval supports semantic RAG.",
  },
  {
    id: "what-is-hybrid-search",
    category: "Azure AI Search",
    title: "What is hybrid search?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand how keyword and vector search can be combined to improve enterprise retrieval accuracy.",
  },
  {
    id: "what-is-semantic-search",
    category: "Azure AI Search",
    title: "What is semantic search?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand semantic ranking and how Azure AI Search improves relevance beyond traditional keyword matching.",
  },
  {
    id: "azure-ai-search-security-trimming",
    category: "Azure AI Search",
    title: "How do you implement security trimming?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how to enforce document-level authorization so users retrieve only enterprise content they are entitled to access.",
  },
  {
    id: "troubleshoot-poor-search-results",
    category: "Azure AI Search",
    title: "How would you troubleshoot poor search results?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn a systematic approach to diagnosing poor retrieval quality, including chunking, embeddings, filters, ranking, and query design.",
  },

  // =====================================================
  // 11. AZURE OPENAI
  // =====================================================

  {
    id: "what-is-azure-openai",
    category: "Azure OpenAI",
    title: "What is Azure OpenAI?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand Azure OpenAI and how enterprise applications consume OpenAI models through Microsoft Azure.",
  },
  {
    id: "azure-openai-vs-openai-api",
    category: "Azure OpenAI",
    title: "Azure OpenAI vs OpenAI API?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Compare Azure OpenAI and the OpenAI API from enterprise security, networking, governance, deployment, and operational perspectives.",
  },
  {
    id: "how-select-an-llm",
    category: "Azure OpenAI",
    title: "How do you select an LLM?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how to select models based on quality, reasoning, latency, cost, context window, multimodal capabilities, and enterprise requirements.",
  },
  {
    id: "gpt-vs-small-language-models",
    category: "Azure OpenAI",
    title: "GPT vs smaller language models?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Compare large and smaller language models for enterprise workloads, including cost, latency, accuracy, and deployment tradeoffs.",
  },
  {
    id: "what-is-temperature",
    category: "Azure OpenAI",
    title: "What is temperature?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how temperature affects randomness and response variation during LLM generation.",
  },
  {
    id: "what-is-top-p",
    category: "Azure OpenAI",
    title: "What is top-p?",
    difficulty: "Intermediate",
    time: "~5 min",
    description:
      "Understand nucleus sampling and how top-p controls the token probability distribution used during generation.",
  },
  {
    id: "what-is-context-window",
    category: "Azure OpenAI",
    title: "What is a context window?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand input and output token limits and why context-window management matters in enterprise LLM applications.",
  },
  {
    id: "what-is-tokenization",
    category: "Azure OpenAI",
    title: "What is tokenization?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how text is converted into tokens and why tokenization impacts cost, latency, and context limits.",
  },
  {
    id: "what-is-prompt-engineering",
    category: "Azure OpenAI",
    title: "What is prompt engineering?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand how prompts are designed and optimized to improve reliability, consistency, and task performance.",
  },
  {
    id: "what-is-structured-output",
    category: "Azure OpenAI",
    title: "What is structured output?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how LLMs can generate predictable JSON or schema-constrained responses for enterprise applications.",
  },
  {
    id: "what-is-function-tool-calling",
    category: "Azure OpenAI",
    title: "What is function/tool calling?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how LLMs select tools and generate structured arguments to interact with enterprise APIs and systems.",
  },
  {
    id: "reduce-llm-latency",
    category: "Azure OpenAI",
    title: "How do you reduce LLM latency?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn techniques such as model selection, prompt optimization, streaming, caching, parallel execution, and token reduction.",
  },

  // =====================================================
  // 12. AZURE AI FOUNDRY
  // =====================================================

  {
    id: "what-is-azure-ai-foundry",
    category: "Azure AI Foundry",
    title: "What is Azure AI Foundry?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand Azure AI Foundry as Microsoft's platform for building, evaluating, deploying, governing, and operating AI applications.",
  },
  {
    id: "azure-ai-foundry-capabilities",
    category: "Azure AI Foundry",
    title: "What capabilities does Azure AI Foundry provide?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Explore model catalog, agents, evaluation, tracing, prompt management, deployments, monitoring, and enterprise AI development capabilities.",
  },
  {
    id: "azure-ai-foundry-vs-azure-ml",
    category: "Azure AI Foundry",
    title: "Azure AI Foundry vs Azure Machine Learning?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Compare Azure AI Foundry and Azure Machine Learning across generative AI, ML lifecycle, experimentation, evaluation, deployment, and governance.",
  },
  {
    id: "azure-ai-foundry-vs-azure-openai",
    category: "Azure AI Foundry",
    title: "Azure AI Foundry vs Azure OpenAI?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand the difference between the broader AI development platform and Azure's managed OpenAI model service.",
  },
  {
    id: "deploy-models-in-foundry",
    category: "Azure AI Foundry",
    title: "How do you deploy models?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand model deployment patterns, managed endpoints, serverless inference, and production model serving.",
  },
  {
    id: "evaluate-llms-in-foundry",
    category: "Azure AI Foundry",
    title: "How do you evaluate LLMs?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how to evaluate model quality, groundedness, relevance, coherence, safety, and task-specific performance.",
  },
  {
    id: "monitor-ai-applications-foundry",
    category: "Azure AI Foundry",
    title: "How do you monitor AI applications?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand tracing, application telemetry, token usage, latency, failures, model behavior, and production monitoring.",
  },
  {
    id: "manage-prompts-foundry",
    category: "Azure AI Foundry",
    title: "How do you manage prompts?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand prompt versioning, templates, configuration, experimentation, and lifecycle management.",
  },
  {
    id: "perform-model-evaluation",
    category: "Azure AI Foundry",
    title: "How do you perform model evaluation?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how to establish datasets, evaluation criteria, automated metrics, human review, and regression testing.",
  },
  {
    id: "what-is-model-catalog",
    category: "Azure AI Foundry",
    title: "What is model catalog?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how the model catalog helps organizations discover and select foundation and specialized models.",
  },
  {
    id: "ai-agents-in-foundry",
    category: "Azure AI Foundry",
    title: "What are AI agents in Foundry?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand enterprise agents, instructions, tools, knowledge, orchestration, evaluation, and deployment.",
  },
  {
    id: "enterprise-ai-platform-using-foundry",
    category: "Azure AI Foundry",
    title: "How would you build an enterprise AI platform using Foundry?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design an enterprise AI platform covering models, agents, RAG, identity, networking, governance, evaluation, observability, and deployment.",
  },

  // =====================================================
  // 13. MICROSOFT COPILOT STUDIO
  // =====================================================

  {
    id: "what-is-copilot-studio",
    category: "Microsoft Copilot Studio",
    title: "What is Microsoft Copilot Studio?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand Microsoft Copilot Studio and its low-code platform for building and extending enterprise copilots and agents.",
  },
  {
    id: "copilot-studio-vs-azure-ai-foundry",
    category: "Microsoft Copilot Studio",
    title: "Copilot Studio vs Azure AI Foundry?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Compare low-code business agent development in Copilot Studio with pro-code enterprise AI engineering in Azure AI Foundry.",
  },
  {
    id: "copilot-studio-vs-custom-agent",
    category: "Microsoft Copilot Studio",
    title: "Copilot Studio vs custom agent?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand when to use Copilot Studio and when a fully custom agent platform is more appropriate.",
  },
  {
    id: "what-are-copilot-topics",
    category: "Microsoft Copilot Studio",
    title: "What are topics?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand topics, triggers, conversation flows, conditions, and responses in Copilot Studio.",
  },
  {
    id: "what-are-copilot-actions",
    category: "Microsoft Copilot Studio",
    title: "What are actions?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how actions allow copilots to invoke APIs, workflows, connectors, and enterprise operations.",
  },
  {
    id: "what-are-copilot-connectors",
    category: "Microsoft Copilot Studio",
    title: "What are connectors?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand standard and custom connectors for accessing enterprise systems from Copilot Studio.",
  },
  {
    id: "what-are-generative-answers",
    category: "Microsoft Copilot Studio",
    title: "What are generative answers?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how generative answers use enterprise knowledge sources to dynamically produce responses.",
  },
  {
    id: "copilot-enterprise-data",
    category: "Microsoft Copilot Studio",
    title: "How does Copilot Studio connect to enterprise data?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how Copilot Studio integrates with SharePoint, Dataverse, connectors, APIs, and other enterprise data sources.",
  },
  {
    id: "copilot-user-authentication",
    category: "Microsoft Copilot Studio",
    title: "How do you authenticate users?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand authentication, Entra ID, user identity, permissions, and enterprise access control.",
  },
  {
    id: "copilot-teams-integration",
    category: "Microsoft Copilot Studio",
    title: "How do you integrate Copilot Studio with Teams?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how Copilot Studio agents are published and consumed through Microsoft Teams.",
  },
  {
    id: "custom-api-from-copilot-studio",
    category: "Microsoft Copilot Studio",
    title: "How do you call a custom API from Copilot Studio?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how custom connectors and APIs can extend Copilot Studio agents with enterprise capabilities.",
  },
  {
    id: "copilot-power-platform-integration",
    category: "Microsoft Copilot Studio",
    title: "How do you integrate Power Platform?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand integration with Power Automate, Power Apps, Dataverse, connectors, and other Power Platform services.",
  },
  {
    id: "what-is-dataverse",
    category: "Microsoft Copilot Studio",
    title: "What is Dataverse?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand Microsoft Dataverse as a governed data platform for Power Platform applications and business data.",
  },
  {
    id: "when-not-to-use-copilot-studio",
    category: "Microsoft Copilot Studio",
    title: "When would you NOT use Copilot Studio?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand scenarios where custom agent orchestration, advanced RAG, complex workflows, or infrastructure control require a pro-code platform.",
  },
  {
    id: "enterprise-copilot-studio-architecture",
    category: "Microsoft Copilot Studio",
    title: "Design a Copilot Studio architecture for a large enterprise.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design a secure enterprise Copilot architecture covering Teams, identity, data, APIs, connectors, governance, monitoring, and DLP.",
  },

  // =====================================================
  // 14. MICROSOFT TEAMS INTEGRATION
  // =====================================================

  {
    id: "integrate-ai-agent-with-teams",
    category: "Microsoft Teams Integration",
    title: "How do you integrate an AI agent with Teams?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how Teams can act as the user interface for enterprise AI agents and connect to an orchestration backend.",
  },
  {
    id: "teams-authentication",
    category: "Microsoft Teams Integration",
    title: "How does authentication work in Teams?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand Teams identity, Entra ID authentication, tokens, permissions, and enterprise access control.",
  },
  {
    id: "teams-sso",
    category: "Microsoft Teams Integration",
    title: "How do you implement SSO?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn how Entra ID and Teams SSO can provide seamless authenticated access to enterprise agents.",
  },
  {
    id: "entra-id-teams",
    category: "Microsoft Teams Integration",
    title: "How does Entra ID integrate with Teams?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand the relationship between Teams identities, Entra ID applications, permissions, and enterprise resources.",
  },
  {
    id: "teams-backend-apis",
    category: "Microsoft Teams Integration",
    title: "How do you call backend APIs from Teams?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand secure communication between Teams applications, bot services, APIs, and agent orchestration layers.",
  },
  {
    id: "adaptive-cards",
    category: "Microsoft Teams Integration",
    title: "How do you implement Adaptive Cards?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how Adaptive Cards provide interactive enterprise UI elements inside Teams conversations.",
  },
  {
    id: "teams-agent-orchestration",
    category: "Microsoft Teams Integration",
    title: "How would Teams communicate with an agent orchestration layer?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design the communication flow between Teams, gateway services, coordinator agents, delegated agents, workers, and enterprise systems.",
  },
  {
    id: "secure-teams-enterprise-agents",
    category: "Microsoft Teams Integration",
    title: "How would you secure Teams-based enterprise agents?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design authentication, authorization, identity propagation, network security, DLP, auditing, and tool-level controls.",
  },

  // =====================================================
  // 15. MICROSOFT FABRIC
  // =====================================================

  {
    id: "what-is-microsoft-fabric",
    category: "Microsoft Fabric",
    title: "What is Microsoft Fabric?",
    difficulty: "Beginner",
    time: "~8 min",
    description:
      "Understand Microsoft Fabric as an integrated analytics platform covering data engineering, data science, warehousing, real-time analytics, and BI.",
  },
  {
    id: "what-is-onelake",
    category: "Microsoft Fabric",
    title: "What is OneLake?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand OneLake as Fabric's unified logical data lake and how it simplifies enterprise data management.",
  },
  {
    id: "onelake-vs-adls",
    category: "Microsoft Fabric",
    title: "OneLake vs ADLS?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Compare OneLake and Azure Data Lake Storage across architecture, governance, access, and Fabric integration.",
  },
  {
    id: "fabric-lakehouse",
    category: "Microsoft Fabric",
    title: "What is Fabric Lakehouse?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand the Fabric Lakehouse architecture for storing and processing structured and semi-structured enterprise data.",
  },
  {
    id: "fabric-warehouse",
    category: "Microsoft Fabric",
    title: "What is Fabric Warehouse?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand Fabric Warehouse and when SQL-based analytical workloads should use it.",
  },
  {
    id: "fabric-data-factory",
    category: "Microsoft Fabric",
    title: "What is Fabric Data Factory?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand pipelines, ingestion, transformation, orchestration, and connectivity in Fabric Data Factory.",
  },
  {
    id: "fabric-notebooks",
    category: "Microsoft Fabric",
    title: "What are Fabric notebooks?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand how notebooks are used for Spark-based data engineering, analytics, and data science in Fabric.",
  },
  {
    id: "what-is-direct-lake",
    category: "Microsoft Fabric",
    title: "What is Direct Lake?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand how Power BI can query data stored in OneLake with Direct Lake for high-performance analytics.",
  },
  {
    id: "fabric-semantic-model",
    category: "Microsoft Fabric",
    title: "What is a semantic model in Fabric?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand semantic models, business definitions, relationships, measures, and their role in Power BI.",
  },
  {
    id: "fabric-vs-databricks",
    category: "Microsoft Fabric",
    title: "Fabric vs Databricks?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Compare Microsoft Fabric and Databricks across data engineering, lakehouse architecture, AI, governance, and BI.",
  },
  {
    id: "fabric-vs-synapse",
    category: "Microsoft Fabric",
    title: "Fabric vs Synapse?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand the differences between Microsoft Fabric and Azure Synapse and when each architecture is appropriate.",
  },
  {
    id: "power-bi-fabric",
    category: "Microsoft Fabric",
    title: "How does Power BI integrate with Fabric?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand how Fabric data engineering and analytics capabilities integrate with Power BI semantic models and reports.",
  },
  {
    id: "ai-data-platform-fabric",
    category: "Microsoft Fabric",
    title: "How would you build an AI data platform using Fabric?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design a Fabric-based AI data platform covering ingestion, lakehouse, governance, vectorization, analytics, and agent consumption.",
  },
  {
    id: "agents-consume-fabric-data",
    category: "Microsoft Fabric",
    title: "How would agents consume Fabric data?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Understand how enterprise agents can securely retrieve and analyze Fabric data through APIs, semantic models, SQL, and governed tools.",
  },
  {
    id: "enterprise-fabric-architecture",
    category: "Microsoft Fabric",
    title: "Design an enterprise Fabric architecture.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design a complete enterprise Fabric architecture covering OneLake, ingestion, Lakehouse, Warehouse, governance, Power BI, security, and AI.",
  },

  // =====================================================
  // 16. DATABRICKS / DELTA LAKE
  // =====================================================

  {
    id: "what-is-databricks",
    category: "Databricks / Delta Lake",
    title: "What is Databricks?",
    difficulty: "Beginner",
    time: "~8 min",
    description:
      "Understand Databricks as a cloud data and AI platform built around Apache Spark and lakehouse architecture.",
  },
  {
    id: "what-is-delta-lake",
    category: "Databricks / Delta Lake",
    title: "What is Delta Lake?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand Delta Lake and how it adds transactional reliability and data-management capabilities to data lakes.",
  },
  {
    id: "delta-lake-vs-parquet",
    category: "Databricks / Delta Lake",
    title: "Delta Lake vs Parquet?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare Delta Lake and Parquet and understand how Delta builds transactional capabilities on top of file-based storage.",
  },
  {
    id: "delta-acid",
    category: "Databricks / Delta Lake",
    title: "What is ACID in Delta Lake?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand atomicity, consistency, isolation, and durability in Delta Lake transactions.",
  },
  {
    id: "delta-schema-evolution",
    category: "Databricks / Delta Lake",
    title: "What is schema evolution?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how Delta Lake handles controlled changes to data schemas over time.",
  },
  {
    id: "delta-schema-enforcement",
    category: "Databricks / Delta Lake",
    title: "What is schema enforcement?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how Delta Lake protects tables from incompatible or invalid data writes.",
  },
  {
    id: "delta-time-travel",
    category: "Databricks / Delta Lake",
    title: "What is time travel?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how Delta Lake enables querying historical versions of data for auditing and recovery.",
  },
  {
    id: "bronze-silver-gold",
    category: "Databricks / Delta Lake",
    title: "What are Bronze/Silver/Gold layers?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand the medallion architecture and how raw, refined, and business-ready data layers are separated.",
  },
  {
    id: "unity-catalog",
    category: "Databricks / Delta Lake",
    title: "What is Unity Catalog?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand centralized data governance, permissions, lineage, discovery, and auditing through Unity Catalog.",
  },
  {
    id: "databricks-vs-fabric",
    category: "Databricks / Delta Lake",
    title: "Databricks vs Fabric?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Compare Databricks and Fabric across data engineering, lakehouse, AI, governance, analytics, and enterprise integration.",
  },
  {
    id: "optimize-spark-job",
    category: "Databricks / Delta Lake",
    title: "How do you optimize a Spark job?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn Spark optimization techniques involving partitioning, joins, caching, file sizes, shuffles, and cluster configuration.",
  },
  {
    id: "databricks-agentic-ai",
    category: "Databricks / Delta Lake",
    title: "How would you integrate Databricks with an Agentic AI platform?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design secure integration between Databricks data platforms, RAG pipelines, vector search, agents, governance, and enterprise tools.",
  },

  // =====================================================
  // 17. DATA ENGINEERING
  // =====================================================

  {
    id: "enterprise-data-pipeline",
    category: "Data Engineering",
    title: "Explain an enterprise data pipeline.",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Explain ingestion, validation, transformation, storage, governance, serving, monitoring, and consumption in an enterprise pipeline.",
  },
  {
    id: "batch-vs-streaming",
    category: "Data Engineering",
    title: "Batch vs streaming?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare batch and real-time data processing and understand when each approach should be used.",
  },
  {
    id: "etl-vs-elt",
    category: "Data Engineering",
    title: "ETL vs ELT?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand the difference between extract-transform-load and extract-load-transform architectures.",
  },
  {
    id: "what-is-cdc",
    category: "Data Engineering",
    title: "What is CDC?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand Change Data Capture and how incremental database changes are propagated into modern data platforms.",
  },
  {
    id: "data-lineage",
    category: "Data Engineering",
    title: "What is data lineage?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how data lineage tracks the origin, transformation, movement, and consumption of enterprise data.",
  },
  {
    id: "data-quality",
    category: "Data Engineering",
    title: "What is data quality?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand completeness, accuracy, consistency, validity, uniqueness, and timeliness in enterprise data.",
  },
  {
    id: "data-profiling",
    category: "Data Engineering",
    title: "What is data profiling?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand how data profiling analyzes distributions, nulls, duplicates, patterns, and anomalies.",
  },
  {
    id: "data-cataloging",
    category: "Data Engineering",
    title: "What is data cataloging?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how catalogs help organizations discover, classify, understand, and govern enterprise data.",
  },
  {
    id: "data-governance",
    category: "Data Engineering",
    title: "What is data governance?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand policies, ownership, stewardship, security, compliance, quality, lineage, and lifecycle management.",
  },
  {
    id: "master-data",
    category: "Data Engineering",
    title: "What is master data?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand master data management and how organizations maintain trusted entities such as customers, products, and suppliers.",
  },
  {
    id: "dimensional-modeling",
    category: "Data Engineering",
    title: "What is dimensional modeling?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand facts, dimensions, measures, relationships, and analytical data modeling.",
  },
  {
    id: "star-vs-snowflake-schema",
    category: "Data Engineering",
    title: "Star schema vs snowflake schema?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare star and snowflake schemas and understand their analytical performance and modeling tradeoffs.",
  },
  {
    id: "what-is-fact-table",
    category: "Data Engineering",
    title: "What is a fact table?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand fact tables, measures, grain, and relationships in analytical data models.",
  },
  {
    id: "what-is-dimension-table",
    category: "Data Engineering",
    title: "What is a dimension table?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand dimensions, descriptive attributes, surrogate keys, and their role in analytical systems.",
  },
  {
    id: "legacy-modern-data-platforms",
    category: "Data Engineering",
    title: "How would you integrate legacy and modern data platforms?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design an integration strategy connecting legacy databases and applications with cloud data lakes, warehouses, APIs, and AI platforms.",
  },

  // =====================================================
  // 18. SQL SERVER / AZURE SQL / SYNAPSE
  // =====================================================

  {
    id: "sql-server-vs-azure-sql",
    category: "SQL Server / Azure SQL / Synapse",
    title: "SQL Server vs Azure SQL?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare on-premises SQL Server with Azure SQL deployment options across management, scalability, networking, and operations.",
  },
  {
    id: "azure-sql-vs-synapse",
    category: "SQL Server / Azure SQL / Synapse",
    title: "Azure SQL vs Synapse?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Compare transactional Azure SQL workloads with analytical workloads in Azure Synapse.",
  },
  {
    id: "oltp-vs-olap",
    category: "SQL Server / Azure SQL / Synapse",
    title: "OLTP vs OLAP?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand the architectural differences between transactional and analytical database workloads.",
  },
  {
    id: "clustered-index",
    category: "SQL Server / Azure SQL / Synapse",
    title: "What is a clustered index?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand clustered indexes and how they affect physical data organization and query performance.",
  },
  {
    id: "nonclustered-index",
    category: "SQL Server / Azure SQL / Synapse",
    title: "What is a nonclustered index?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand nonclustered indexes and how they accelerate data retrieval.",
  },
  {
    id: "sql-ctes",
    category: "SQL Server / Azure SQL / Synapse",
    title: "What are CTEs?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand Common Table Expressions and their use in readable and recursive SQL queries.",
  },
  {
    id: "sql-window-functions",
    category: "SQL Server / Azure SQL / Synapse",
    title: "What are window functions?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand analytical SQL functions that calculate values across related rows without collapsing the result set.",
  },
  {
    id: "row-number-rank-dense-rank",
    category: "SQL Server / Azure SQL / Synapse",
    title: "ROW_NUMBER vs RANK vs DENSE_RANK?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand the differences between common SQL ranking functions and when to use each one.",
  },
  {
    id: "optimize-slow-sql-query",
    category: "SQL Server / Azure SQL / Synapse",
    title: "How do you optimize a slow SQL query?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn query optimization techniques involving execution plans, indexes, joins, statistics, partitioning, and query design.",
  },
  {
    id: "sql-partitioning",
    category: "SQL Server / Azure SQL / Synapse",
    title: "What is partitioning?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand table partitioning and how it improves manageability and performance for large datasets.",
  },
  {
    id: "database-normalization",
    category: "SQL Server / Azure SQL / Synapse",
    title: "What is database normalization?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand normalization principles and how they reduce data duplication and improve data integrity.",
  },
  {
    id: "secure-ai-agent-sql-query",
    category: "SQL Server / Azure SQL / Synapse",
    title: "How would an AI agent securely query SQL Server?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design a secure text-to-SQL architecture using identity, read-only access, query validation, row-level security, and tool authorization.",
  },

  // =====================================================
  // 19. PYSPARK
  // =====================================================

  {
    id: "what-is-pyspark",
    category: "PySpark",
    title: "What is PySpark?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand PySpark and how Python applications use Apache Spark for distributed data processing.",
  },
  {
    id: "dataframe-vs-rdd",
    category: "PySpark",
    title: "DataFrame vs RDD?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Compare Spark DataFrames and RDDs in terms of abstraction, optimization, performance, and use cases.",
  },
  {
    id: "lazy-evaluation",
    category: "PySpark",
    title: "What is lazy evaluation?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how Spark delays execution of transformations until an action requires results.",
  },
  {
    id: "spark-transformation",
    category: "PySpark",
    title: "What is a transformation?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand Spark transformations such as map, filter, select, join, and groupBy.",
  },
  {
    id: "spark-action",
    category: "PySpark",
    title: "What is an action?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand Spark actions such as count, collect, show, and write that trigger execution.",
  },
  {
    id: "spark-repartition",
    category: "PySpark",
    title: "What is repartition?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how repartition changes the number and distribution of Spark partitions.",
  },
  {
    id: "repartition-vs-coalesce",
    category: "PySpark",
    title: "Repartition vs coalesce?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Compare repartition and coalesce and understand when each should be used.",
  },
  {
    id: "broadcast-join",
    category: "PySpark",
    title: "What is a broadcast join?",
    difficulty: "Advanced",
    time: "~7 min",
    description:
      "Understand how Spark broadcasts small datasets to reduce expensive shuffle operations during joins.",
  },
  {
    id: "pyspark-optimize-job",
    category: "PySpark",
    title: "How do you optimize a Spark job?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn practical Spark optimization techniques involving partitions, joins, caching, shuffles, and file formats.",
  },
  {
    id: "enterprise-pyspark-pipeline",
    category: "PySpark",
    title: "Write a PySpark pipeline to process enterprise data.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design a production PySpark pipeline covering ingestion, cleansing, transformation, validation, storage, and monitoring.",
  },

  // =====================================================
  // 20. ENTERPRISE INTEGRATION
  // =====================================================

  {
    id: "sap-ai-agent",
    category: "Enterprise Integration",
    title: "How would you integrate SAP with an AI agent?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design secure integration between SAP enterprise processes, APIs, identity, agent tools, and orchestration layers.",
  },
  {
    id: "salesforce-ai-agent",
    category: "Enterprise Integration",
    title: "How would you integrate Salesforce with an AI agent?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design an agent integration with Salesforce using secure APIs, OAuth, tool authorization, and enterprise workflows.",
  },
  {
    id: "oracle-ai-agent",
    category: "Enterprise Integration",
    title: "How would you integrate Oracle with an AI agent?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design secure Oracle integration through APIs, database access, identity, authorization, and agent tools.",
  },
  {
    id: "rest-vs-soap",
    category: "Enterprise Integration",
    title: "REST vs SOAP?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare REST and SOAP for enterprise integration, interoperability, security, and API design.",
  },
  {
    id: "api-gateway-vs-direct-api",
    category: "Enterprise Integration",
    title: "API Gateway vs direct API calls?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand why enterprise agents should typically access backend systems through governed API gateways.",
  },
  {
    id: "what-is-oauth2",
    category: "Enterprise Integration",
    title: "What is OAuth 2.0?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Understand OAuth 2.0 roles, flows, access tokens, scopes, and enterprise authorization.",
  },
  {
    id: "oauth-vs-api-key",
    category: "Enterprise Integration",
    title: "OAuth vs API key?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Compare OAuth-based delegated authorization with simpler API-key authentication mechanisms.",
  },
  {
    id: "client-credentials-flow",
    category: "Enterprise Integration",
    title: "What is client credentials flow?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand machine-to-machine authentication and when client credentials are appropriate.",
  },
  {
    id: "authorization-code-flow",
    category: "Enterprise Integration",
    title: "What is authorization code flow?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand user-delegated OAuth authentication and authorization code flow.",
  },
  {
    id: "secure-access-tokens",
    category: "Enterprise Integration",
    title: "How do you securely store access tokens?",
    difficulty: "Advanced",
    time: "~7 min",
    description:
      "Learn secure token storage, secret management, token lifetimes, rotation, and managed identity patterns.",
  },
  {
    id: "what-is-idempotency",
    category: "Enterprise Integration",
    title: "What is idempotency?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand idempotent operations and why they are critical for reliable agent-driven enterprise writes.",
  },
  {
    id: "api-rate-limits",
    category: "Enterprise Integration",
    title: "How do you handle API rate limits?",
    difficulty: "Advanced",
    time: "~7 min",
    description:
      "Learn throttling strategies including backoff, retry-after handling, queues, caching, and concurrency control.",
  },
  {
    id: "api-failures",
    category: "Enterprise Integration",
    title: "How do you handle API failures?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand timeout handling, retries, fallback, circuit breakers, dead-letter queues, and graceful degradation.",
  },
  {
    id: "api-retries",
    category: "Enterprise Integration",
    title: "How do you implement retries?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand exponential backoff, jitter, retry limits, transient errors, and idempotency.",
  },
  {
    id: "prevent-agent-unauthorized-writes",
    category: "Enterprise Integration",
    title: "How do you prevent an agent from making unauthorized writes?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design tool-level authorization, identity propagation, policy enforcement, approval workflows, and audit controls.",
  },

  // =====================================================
  // 21. MICROSOFT GRAPH / POWER PLATFORM
  // =====================================================

  {
    id: "what-is-microsoft-graph",
    category: "Microsoft Graph / Power Platform",
    title: "What is Microsoft Graph?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand Microsoft Graph as the unified API layer for Microsoft 365 and related enterprise resources.",
  },
  {
    id: "graph-connectors",
    category: "Microsoft Graph / Power Platform",
    title: "What are Graph Connectors?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how Graph Connectors bring external enterprise data into Microsoft Graph experiences.",
  },
  {
    id: "graph-api-vs-connector",
    category: "Microsoft Graph / Power Platform",
    title: "Graph API vs Graph Connector?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare Graph API access with Graph Connector indexing and discovery patterns.",
  },
  {
    id: "agent-access-m365",
    category: "Microsoft Graph / Power Platform",
    title: "How would an agent access Microsoft 365 data?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Design secure agent access to Microsoft 365 resources using Graph APIs, delegated permissions, application permissions, and identity.",
  },
  {
    id: "agent-access-sharepoint",
    category: "Microsoft Graph / Power Platform",
    title: "How would an agent access SharePoint?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand secure SharePoint access through Microsoft Graph, search, permissions, ACLs, and identity propagation.",
  },
  {
    id: "what-is-power-automate",
    category: "Microsoft Graph / Power Platform",
    title: "What is Power Automate?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand Power Automate for workflow orchestration, approvals, system integration, and business automation.",
  },
  {
    id: "power-automate-vs-functions",
    category: "Microsoft Graph / Power Platform",
    title: "Power Automate vs Azure Functions?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Compare low-code workflow automation with code-based serverless compute.",
  },
  {
    id: "custom-connectors",
    category: "Microsoft Graph / Power Platform",
    title: "What are custom connectors?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how custom connectors expose enterprise APIs to Power Platform applications and workflows.",
  },
  {
    id: "secure-power-platform-connectors",
    category: "Microsoft Graph / Power Platform",
    title: "How do you secure Power Platform connectors?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand authentication, permissions, DLP policies, environment governance, and least privilege for connectors.",
  },
  {
    id: "sharepoint-to-salesforce-agent",
    category: "Microsoft Graph / Power Platform",
    title: "Design an agent that reads SharePoint and writes to Salesforce.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design an end-to-end secure agent workflow connecting SharePoint, Microsoft Graph, orchestration, authorization, and Salesforce.",
  },

  // =====================================================
  // 22. SECURITY
  // =====================================================

  {
    id: "secure-enterprise-agentic-ai",
    category: "Security",
    title: "How do you secure an enterprise Agentic AI platform?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design defense-in-depth security across identity, APIs, tools, data, networks, models, agents, memory, and observability.",
  },
  {
    id: "what-is-entra-id",
    category: "Security",
    title: "What is Microsoft Entra ID?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand Entra ID for authentication, authorization, application identity, users, groups, and enterprise access management.",
  },
  {
    id: "authentication-vs-authorization",
    category: "Security",
    title: "Authentication vs authorization?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand the difference between proving identity and determining what an identity is allowed to do.",
  },
  {
    id: "rbac-vs-abac",
    category: "Security",
    title: "RBAC vs ABAC?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare role-based and attribute-based authorization for enterprise AI applications.",
  },
  {
    id: "what-is-managed-identity",
    category: "Security",
    title: "What is Managed Identity?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand Azure Managed Identity and passwordless authentication between Azure resources.",
  },
  {
    id: "why-managed-identity",
    category: "Security",
    title: "Why use Managed Identity?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand why managed identities reduce secret management and improve enterprise security.",
  },
  {
    id: "what-is-key-vault",
    category: "Security",
    title: "What is Azure Key Vault?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand secure management of secrets, keys, and certificates in Azure.",
  },
  {
    id: "what-is-private-endpoint",
    category: "Security",
    title: "What is a Private Endpoint?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand private network connectivity to Azure services through private IP addresses.",
  },
  {
    id: "what-is-vnet-integration",
    category: "Security",
    title: "What is VNet integration?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand how application services communicate securely with resources inside private networks.",
  },
  {
    id: "what-is-api-management",
    category: "Security",
    title: "What is API Management?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand API gateway capabilities including authentication, policies, throttling, transformation, and observability.",
  },
  {
    id: "secure-apis",
    category: "Security",
    title: "How do you secure APIs?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Design API security using identity, OAuth, JWT validation, scopes, RBAC, rate limits, network controls, and auditing.",
  },
  {
    id: "what-is-oauth",
    category: "Security",
    title: "What is OAuth?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand OAuth as an authorization framework and its role in enterprise applications.",
  },
  {
    id: "what-is-jwt",
    category: "Security",
    title: "What is JWT?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand JWT structure, claims, signatures, validation, expiration, and authorization.",
  },
  {
    id: "security-tokenization",
    category: "Security",
    title: "What is tokenization?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand tokenization as a technique for replacing sensitive values with controlled tokens.",
  },
  {
    id: "data-masking",
    category: "Security",
    title: "What is data masking?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how sensitive values can be hidden or transformed before being exposed to users or AI systems.",
  },
  {
    id: "encryption-at-rest",
    category: "Security",
    title: "What is encryption at rest?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how stored enterprise data is protected through encryption.",
  },
  {
    id: "encryption-in-transit",
    category: "Security",
    title: "What is encryption in transit?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand TLS and other mechanisms used to protect data while moving between systems.",
  },
  {
    id: "least-privilege",
    category: "Security",
    title: "What is least privilege?",
    difficulty: "Beginner",
    time: "~5 min",
    description:
      "Understand how enterprise systems grant only the minimum permissions required to perform an operation.",
  },
  {
    id: "identity-propagation-agents",
    category: "Security",
    title: "How do you implement identity propagation through agents?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design user identity propagation across coordinator, delegator, worker, APIs, and enterprise data sources.",
  },
  {
    id: "tool-level-authorization",
    category: "Security",
    title: "How do you implement authorization at the tool level?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design policy enforcement that evaluates user identity, roles, permissions, tool sensitivity, and target resources before execution.",
  },

  // =====================================================
  // 23. MICROSOFT PURVIEW / GOVERNANCE
  // =====================================================

  {
    id: "what-is-microsoft-purview",
    category: "Microsoft Purview / Governance",
    title: "What is Microsoft Purview?",
    difficulty: "Beginner",
    time: "~7 min",
    description:
      "Understand Microsoft Purview for enterprise data governance, discovery, classification, lineage, and compliance.",
  },
  {
    id: "data-classification",
    category: "Microsoft Purview / Governance",
    title: "What is data classification?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how enterprise data is categorized based on sensitivity, business value, and compliance requirements.",
  },
  {
    id: "sensitivity-labels",
    category: "Microsoft Purview / Governance",
    title: "What are sensitivity labels?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand sensitivity labels and how they help protect and govern sensitive enterprise content.",
  },
  {
    id: "purview-data-lineage",
    category: "Microsoft Purview / Governance",
    title: "What is data lineage?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how Purview tracks the movement and transformation of enterprise data.",
  },
  {
    id: "purview-genai-governance",
    category: "Microsoft Purview / Governance",
    title: "How does Purview support GenAI governance?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how governance, classification, compliance, discovery, and protection controls can be applied to AI workloads.",
  },
  {
    id: "identify-sensitive-data",
    category: "Microsoft Purview / Governance",
    title: "How do you identify sensitive enterprise data?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Learn how sensitive information types, classification, metadata, labels, and scanning can identify protected data.",
  },
  {
    id: "prevent-sensitive-data-llm",
    category: "Microsoft Purview / Governance",
    title: "How do you prevent sensitive data from entering an LLM?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design data classification, DLP, masking, filtering, authorization, and prompt inspection controls.",
  },
  {
    id: "what-is-dlp",
    category: "Microsoft Purview / Governance",
    title: "What is DLP?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand Data Loss Prevention and how policies prevent sensitive information from being improperly shared.",
  },
  {
    id: "dlp-for-ai",
    category: "Microsoft Purview / Governance",
    title: "How do you implement DLP for AI applications?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design DLP controls across prompts, retrieved documents, tool inputs, model outputs, and downstream systems.",
  },
  {
    id: "enterprise-genai-governance-framework",
    category: "Microsoft Purview / Governance",
    title: "Design a governance framework for enterprise GenAI.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design an enterprise governance framework covering data, models, agents, identity, security, compliance, evaluation, monitoring, and lifecycle management.",
  },

  // =====================================================
  // 24. AI GUARDRAILS / RESPONSIBLE AI
  // =====================================================

  {
    id: "what-is-ai-guardrail",
    category: "AI Guardrails / Responsible AI",
    title: "What is an AI guardrail?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand preventive and detective controls that constrain AI behavior and protect enterprise applications.",
  },
  {
    id: "prevent-prompt-injection",
    category: "AI Guardrails / Responsible AI",
    title: "How do you prevent prompt injection?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design layered defenses against malicious instructions attempting to manipulate LLM or agent behavior.",
  },
  {
    id: "indirect-prompt-injection",
    category: "AI Guardrails / Responsible AI",
    title: "What is indirect prompt injection?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand attacks where malicious instructions are embedded in external content retrieved by an agent.",
  },
  {
    id: "what-is-jailbreak",
    category: "AI Guardrails / Responsible AI",
    title: "What is jailbreak?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand jailbreak attempts and how attackers try to bypass model safety constraints.",
  },
  {
    id: "detect-harmful-content",
    category: "AI Guardrails / Responsible AI",
    title: "How do you detect harmful content?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand content safety classifiers, policy filters, moderation, and human review.",
  },
  {
    id: "azure-ai-content-safety",
    category: "AI Guardrails / Responsible AI",
    title: "What is Azure AI Content Safety?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand Microsoft's service for detecting harmful or unsafe content in AI applications.",
  },
  {
    id: "prevent-data-leakage",
    category: "AI Guardrails / Responsible AI",
    title: "How do you prevent data leakage?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Design controls covering data access, retrieval, prompts, model inputs, outputs, tools, logs, and downstream systems.",
  },
  {
    id: "prevent-hallucinations",
    category: "AI Guardrails / Responsible AI",
    title: "How do you prevent hallucinations?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Learn grounding, RAG, constrained generation, validation, citations, confidence checks, and human review strategies.",
  },
  {
    id: "validate-llm-output",
    category: "AI Guardrails / Responsible AI",
    title: "How do you validate LLM output?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand schema validation, policy checks, factuality checks, business rules, and deterministic validators.",
  },
  {
    id: "tool-authorization",
    category: "AI Guardrails / Responsible AI",
    title: "How do you enforce tool authorization?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Design authorization policies that validate user identity and permissions before every sensitive tool operation.",
  },
  {
    id: "restrict-agent-autonomy",
    category: "AI Guardrails / Responsible AI",
    title: "How do you restrict agent autonomy?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Learn approval gates, tool allowlists, budgets, timeouts, action limits, and policy enforcement for agent autonomy.",
  },
  {
    id: "human-approval",
    category: "AI Guardrails / Responsible AI",
    title: "How do you implement human approval?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand human-in-the-loop patterns for high-risk actions such as financial, HR, or destructive operations.",
  },
  {
    id: "audit-agent-actions",
    category: "AI Guardrails / Responsible AI",
    title: "How do you audit agent actions?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Design audit logging for prompts, decisions, tool calls, identity, outputs, approvals, and enterprise transactions.",
  },
  {
    id: "protect-pii",
    category: "AI Guardrails / Responsible AI",
    title: "How do you protect PII?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Design PII detection, masking, encryption, access controls, DLP, retention, and secure processing strategies.",
  },
  {
    id: "enterprise-ai-safety-architecture",
    category: "AI Guardrails / Responsible AI",
    title: "How would you design an enterprise AI safety architecture?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design a layered AI safety architecture covering input controls, identity, RAG security, tool authorization, content safety, output validation, and auditing.",
  },

  // =====================================================
  // 25. AGENT MEMORY
  // =====================================================

  {
    id: "short-term-memory",
    category: "Agent Memory",
    title: "What is short-term memory?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand short-lived conversational state maintained during an active agent session.",
  },
  {
    id: "long-term-memory",
    category: "Agent Memory",
    title: "What is long-term memory?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand persistent information retained across conversations or sessions.",
  },
  {
    id: "conversational-memory",
    category: "Agent Memory",
    title: "What is conversational memory?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand how previous conversation turns can be maintained and used by agents.",
  },
  {
    id: "semantic-memory",
    category: "Agent Memory",
    title: "What is semantic memory?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand memory that stores facts and knowledge retrieved through semantic similarity.",
  },
  {
    id: "episodic-memory",
    category: "Agent Memory",
    title: "What is episodic memory?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand memory representing previous experiences, events, tasks, and interactions.",
  },
  {
    id: "redis-vs-vector-memory",
    category: "Agent Memory",
    title: "Redis vs vector database for memory?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Compare Redis and vector databases for session state, semantic memory, caching, and persistent agent memory.",
  },
  {
    id: "prevent-memory-poisoning",
    category: "Agent Memory",
    title: "How do you prevent memory poisoning?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Design controls to prevent malicious or incorrect information from becoming trusted persistent agent memory.",
  },
  {
    id: "memory-expiration",
    category: "Agent Memory",
    title: "How do you manage memory expiration?",
    difficulty: "Advanced",
    time: "~7 min",
    description:
      "Understand TTLs, retention policies, archival, deletion, and lifecycle management for agent memory.",
  },
  {
    id: "secure-agent-memory",
    category: "Agent Memory",
    title: "How do you secure agent memory?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Design authorization, encryption, tenant isolation, retention, access controls, and auditing for agent memory.",
  },
  {
    id: "enterprise-agent-memory-architecture",
    category: "Agent Memory",
    title: "Design an enterprise agent memory architecture.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design session, task, run, turn, step, semantic, episodic, and long-term memory with enterprise security and governance.",
  },

  // =====================================================
  // 26. OBSERVABILITY / LLMOPS
  // =====================================================

  {
    id: "monitor-agentic-ai",
    category: "Observability / LLMOps",
    title: "How do you monitor an Agentic AI application?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design monitoring across application health, agents, LLMs, tools, data retrieval, latency, cost, and business outcomes.",
  },
  {
    id: "agentic-ai-metrics",
    category: "Observability / LLMOps",
    title: "What metrics do you capture?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand technical, model, agent, retrieval, tool, cost, security, and business metrics.",
  },
  {
    id: "what-is-llm-observability",
    category: "Observability / LLMOps",
    title: "What is LLM observability?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand visibility into prompts, responses, tokens, latency, model behavior, tools, and agent workflows.",
  },
  {
    id: "what-is-tracing",
    category: "Observability / LLMOps",
    title: "What is tracing?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand distributed tracing across API gateways, agents, LLM calls, tools, databases, and external systems.",
  },
  {
    id: "token-usage-monitoring",
    category: "Observability / LLMOps",
    title: "What is token usage monitoring?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand tracking input and output tokens for cost, capacity, performance, and optimization.",
  },
  {
    id: "what-is-ttft",
    category: "Observability / LLMOps",
    title: "What is TTFT?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand Time to First Token and why it is a critical user-perceived latency metric.",
  },
  {
    id: "ttft-vs-total-latency",
    category: "Observability / LLMOps",
    title: "TTFT vs total latency?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand the difference between time to first token and complete response latency.",
  },
  {
    id: "monitor-tool-calls",
    category: "Observability / LLMOps",
    title: "How do you monitor tool calls?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Track tool latency, success rate, failures, authorization decisions, retries, payloads, and business outcomes.",
  },
  {
    id: "monitor-agent-to-agent-calls",
    category: "Observability / LLMOps",
    title: "How do you monitor agent-to-agent calls?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand distributed tracing and correlation IDs across coordinator, delegator, worker, and external agent calls.",
  },
  {
    id: "identify-expensive-agents",
    category: "Observability / LLMOps",
    title: "How do you identify expensive agents?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Learn how to attribute token, model, tool, compute, and retry costs to individual agents and workflows.",
  },
  {
    id: "troubleshoot-agent-hallucinations",
    category: "Observability / LLMOps",
    title: "How do you troubleshoot hallucinations?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Trace prompts, retrieved context, model responses, tool results, and agent decisions to identify hallucination root causes.",
  },
  {
    id: "llmops-azure-ml-mlflow-langfuse",
    category: "Observability / LLMOps",
    title: "How would you implement LLMOps using Azure ML/MLflow/Langfuse?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design an enterprise LLMOps architecture covering experimentation, prompt versions, evaluations, tracing, monitoring, deployment, and governance.",
  },

  // =====================================================
  // 27. EVALUATION
  // =====================================================

  {
    id: "evaluate-llm-application",
    category: "Evaluation",
    title: "How do you evaluate an LLM application?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Understand offline and online evaluation across accuracy, relevance, groundedness, safety, latency, cost, and business outcomes.",
  },
  {
    id: "rag-evaluation",
    category: "Evaluation",
    title: "What is RAG evaluation?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand how retrieval and generation quality are evaluated separately and together.",
  },
  {
    id: "what-is-faithfulness",
    category: "Evaluation",
    title: "What is faithfulness?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand whether an answer is supported by the retrieved context rather than fabricated by the model.",
  },
  {
    id: "answer-relevance",
    category: "Evaluation",
    title: "What is answer relevance?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand whether generated answers directly address the user's question.",
  },
  {
    id: "context-precision",
    category: "Evaluation",
    title: "What is context precision?",
    difficulty: "Advanced",
    time: "~6 min",
    description:
      "Understand how accurately retrieved context contains information relevant to answering the query.",
  },
  {
    id: "context-recall",
    category: "Evaluation",
    title: "What is context recall?",
    difficulty: "Advanced",
    time: "~6 min",
    description:
      "Understand whether retrieval successfully captures the information needed to answer a question.",
  },
  {
    id: "hallucination-rate",
    category: "Evaluation",
    title: "What is hallucination rate?",
    difficulty: "Intermediate",
    time: "~6 min",
    description:
      "Understand how hallucination frequency can be measured and tracked as a production quality metric.",
  },
  {
    id: "golden-dataset",
    category: "Evaluation",
    title: "How do you create a golden dataset?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Learn how to create representative questions, expected answers, contexts, edge cases, and evaluation criteria.",
  },
  {
    id: "offline-vs-online-evaluation",
    category: "Evaluation",
    title: "Offline vs online evaluation?",
    difficulty: "Advanced",
    time: "~7 min",
    description:
      "Compare pre-production benchmark evaluation with production monitoring and continuous evaluation.",
  },
  {
    id: "production-ai-kpis",
    category: "Evaluation",
    title: "What KPIs would you establish before production?",
    difficulty: "Expert",
    time: "~10 min",
    description:
      "Define quality, retrieval, latency, cost, reliability, safety, adoption, and business KPIs before production rollout.",
  },

  // =====================================================
  // 28. SCALABILITY / RELIABILITY
  // =====================================================

  {
    id: "scale-agentic-ai-system",
    category: "Scalability / Reliability",
    title: "How do you scale an Agentic AI system?",
    difficulty: "Expert",
    time: "~12 min",
    description:
      "Design horizontal scaling across gateways, orchestration services, workers, queues, model endpoints, databases, and caches.",
  },
  {
    id: "horizontal-vs-vertical-scaling",
    category: "Scalability / Reliability",
    title: "Horizontal vs vertical scaling?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand the difference between adding resources to a machine and adding more service instances.",
  },
  {
    id: "stateless-vs-stateful",
    category: "Scalability / Reliability",
    title: "Stateless vs stateful architecture for scaling?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand why stateless services scale more easily and how external state stores support scalable agent platforms.",
  },
  {
    id: "10000-concurrent-users",
    category: "Scalability / Reliability",
    title: "How do you handle 10,000 concurrent users?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design load balancing, autoscaling, queues, caching, rate limits, model capacity, state management, and resilience.",
  },
  {
    id: "llm-rate-limits",
    category: "Scalability / Reliability",
    title: "How do you handle LLM rate limits?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand throttling, retries, exponential backoff, workload distribution, quotas, and capacity planning.",
  },
  {
    id: "azure-openai-throttling",
    category: "Scalability / Reliability",
    title: "How do you handle Azure OpenAI throttling?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Design quota management, retry strategies, model routing, deployment distribution, caching, and workload controls.",
  },
  {
    id: "what-is-caching",
    category: "Scalability / Reliability",
    title: "What is caching?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand caching and how it reduces latency, load, and cost in enterprise AI applications.",
  },
  {
    id: "semantic-caching",
    category: "Scalability / Reliability",
    title: "What is semantic caching?",
    difficulty: "Advanced",
    time: "~7 min",
    description:
      "Understand caching based on semantic similarity rather than exact request matching.",
  },
  {
    id: "reduce-token-costs",
    category: "Scalability / Reliability",
    title: "How do you reduce token costs?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Learn prompt compression, context optimization, model routing, caching, summarization, and smaller-model strategies.",
  },
  {
    id: "reduce-ai-latency",
    category: "Scalability / Reliability",
    title: "How do you reduce latency?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Optimize model selection, prompts, retrieval, network paths, parallel execution, streaming, caching, and tool calls.",
  },
  {
    id: "what-is-circuit-breaker",
    category: "Scalability / Reliability",
    title: "What is circuit breaker?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand the circuit breaker pattern for preventing cascading failures in distributed systems.",
  },
  {
    id: "high-availability-agent-platform",
    category: "Scalability / Reliability",
    title: "How do you design high availability for an agent platform?",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design multi-instance, zone-aware, resilient agent services with queues, failover, health checks, retries, and disaster recovery.",
  },

  // =====================================================
  // 29. AZURE INFRASTRUCTURE
  // =====================================================

  {
    id: "azure-functions-vs-container-apps",
    category: "Azure Infrastructure",
    title: "Azure Functions vs Container Apps?",
    difficulty: "Intermediate",
    time: "~8 min",
    description:
      "Compare event-driven serverless functions with containerized microservices and agent backends.",
  },
  {
    id: "container-apps-vs-aks",
    category: "Azure Infrastructure",
    title: "Container Apps vs AKS?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Compare Azure Container Apps and AKS in terms of Kubernetes control, operational complexity, scaling, and workload requirements.",
  },
  {
    id: "when-use-aks",
    category: "Azure Infrastructure",
    title: "When would you use AKS?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand when enterprise workloads require Kubernetes-level control, networking, orchestration, or customization.",
  },
  {
    id: "when-use-functions",
    category: "Azure Infrastructure",
    title: "When would you use Azure Functions?",
    difficulty: "Beginner",
    time: "~6 min",
    description:
      "Understand event-driven serverless workloads and when Functions are appropriate.",
  },
  {
    id: "azure-api-management",
    category: "Azure Infrastructure",
    title: "What is Azure API Management?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand API gateway, security, throttling, transformation, subscription, policy, and observability capabilities.",
  },
  {
    id: "what-is-azure-service-bus",
    category: "Azure Infrastructure",
    title: "What is Azure Service Bus?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Understand reliable enterprise messaging using queues, topics, subscriptions, retries, dead-letter queues, and transactions.",
  },
  {
    id: "service-bus-vs-event-grid",
    category: "Azure Infrastructure",
    title: "Service Bus vs Event Grid?",
    difficulty: "Intermediate",
    time: "~7 min",
    description:
      "Compare enterprise messaging and event notification patterns and when each Azure service should be used.",
  },
  {
    id: "when-use-kafka",
    category: "Azure Infrastructure",
    title: "When would you use Kafka?",
    difficulty: "Advanced",
    time: "~8 min",
    description:
      "Understand Kafka's event-streaming architecture and when high-throughput, durable event streams are appropriate.",
  },
  {
    id: "deploy-agent-backend",
    category: "Azure Infrastructure",
    title: "How would you deploy an agent backend?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Design CI/CD, containers, networking, identity, secrets, scaling, observability, and deployment strategies for an agent backend.",
  },
  {
    id: "production-azure-agentic-ai-architecture",
    category: "Azure Infrastructure",
    title: "Design a production Azure architecture for Agentic AI.",
    difficulty: "Expert",
    time: "~15 min",
    description:
      "Design a complete production architecture covering Teams, Front Door, APIM, agents, Azure OpenAI, AI Search, data, Service Bus, security, monitoring, and governance.",
  },
];


export default function CWDPage() {
  return (
    <CookbookApp
      data={AzureEnterpriseQuestions}
      title="AzureEnterpriseQuestions Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}