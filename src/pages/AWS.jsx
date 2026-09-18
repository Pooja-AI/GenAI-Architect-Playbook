import CookbookApp from "../components/CookbookApp";

// ============================================================
// GENERATIVE AI & RAG
// ============================================================
import WhatIsRAG from "../assets/docs/AWSGenAI/what-is-rag.md?raw";
import EnterpriseRAGArchitecture from "../assets/docs/AWSGenAI/enterprise-rag-architecture.md?raw";
import RAGChunkingStrategy from "../assets/docs/AWSGenAI/rag-chunking-strategy.md?raw";
import EmbeddingModels from "../assets/docs/AWSGenAI/embedding-models.md?raw";
import VectorDatabaseSelection from "../assets/docs/AWSGenAI/vector-database-selection.md?raw";
import HybridSearch from "../assets/docs/AWSGenAI/hybrid-search.md?raw";
import RAGRetrievalOptimization from "../assets/docs/AWSGenAI/rag-retrieval-optimization.md?raw";
import RAGSecurityTrimming from "../assets/docs/AWSGenAI/rag-security-trimming.md?raw";
import RAGScaling from "../assets/docs/AWSGenAI/rag-scaling.md?raw";
import RAGLatencyOptimization from "../assets/docs/AWSGenAI/rag-latency-optimization.md?raw";
import SemanticCaching from "../assets/docs/AWSGenAI/semantic-caching.md?raw";
import ContextWindowOptimization from "../assets/docs/AWSGenAI/context-window-optimization.md?raw";
import PreventingRAGHallucination from "../assets/docs/AWSGenAI/preventing-rag-hallucination.md?raw";
import RAGEvaluation from "../assets/docs/AWSGenAI/rag-evaluation.md?raw";
import RAGTroubleshooting from "../assets/docs/AWSGenAI/rag-troubleshooting.md?raw";

// ============================================================
// AWS & BEDROCK
// ============================================================
import WhatIsAmazonBedrock from "../assets/docs/AWSGenAI/what-is-amazon-bedrock.md?raw";
import BedrockVsDirectLLM from "../assets/docs/AWSGenAI/bedrock-vs-direct-llm.md?raw";
import BedrockModelSelection from "../assets/docs/AWSGenAI/bedrock-model-selection.md?raw";
import BedrockGuardrails from "../assets/docs/AWSGenAI/bedrock-guardrails.md?raw";
import BedrockRetriesThrottling from "../assets/docs/AWSGenAI/bedrock-retries-throttling.md?raw";
import BedrockModelFallback from "../assets/docs/AWSGenAI/bedrock-model-fallback.md?raw";
import BedrockCostOptimization from "../assets/docs/AWSGenAI/bedrock-cost-optimization.md?raw";
import BedrockProductionArchitecture from "../assets/docs/AWSGenAI/bedrock-production-architecture.md?raw";
import LambdaVsEKS from "../assets/docs/AWSGenAI/lambda-vs-eks.md?raw";
import BedrockVsSageMaker from "../assets/docs/AWSGenAI/bedrock-vs-sagemaker.md?raw";
import AWSGenAIPlatform from "../assets/docs/AWSGenAI/aws-genai-platform.md?raw";

// ============================================================
// AGENTIC AI
// ============================================================
import WhatIsAgenticAI from "../assets/docs/AWSGenAI/what-is-agentic-ai.md?raw";
import AIReasoningLoop from "../assets/docs/AWSGenAI/ai-reasoning-loop.md?raw";
import AutonomousPlanning from "../assets/docs/AWSGenAI/autonomous-planning.md?raw";
import FunctionCallingToolUse from "../assets/docs/AWSGenAI/function-calling-tool-use.md?raw";
import StructuredToolInputs from "../assets/docs/AWSGenAI/structured-tool-inputs.md?raw";
import AgentGuardrails from "../assets/docs/AWSGenAI/agent-guardrails.md?raw";
import HumanInTheLoop from "../assets/docs/AWSGenAI/human-in-the-loop.md?raw";
import PreventingAgentLoops from "../assets/docs/AWSGenAI/preventing-agent-loops.md?raw";
import AgentState from "../assets/docs/AWSGenAI/agent-state.md?raw";
import AgentMemory from "../assets/docs/AWSGenAI/agent-memory.md?raw";
import AgentFailureRecovery from "../assets/docs/AWSGenAI/agent-failure-recovery.md?raw";

// ============================================================
// MULTI-AGENT SYSTEMS
// ============================================================
import WhyMultiAgent from "../assets/docs/AWSGenAI/why-multi-agent.md?raw";
import SupervisorWorker from "../assets/docs/AWSGenAI/supervisor-worker.md?raw";
import DecentralizedAgents from "../assets/docs/AWSGenAI/decentralized-agents.md?raw";
import StatefulMultiAgentGraphs from "../assets/docs/AWSGenAI/stateful-multi-agent-graphs.md?raw";
import AgentCommunication from "../assets/docs/AWSGenAI/agent-communication.md?raw";
import MultiAgentState from "../assets/docs/AWSGenAI/multi-agent-state.md?raw";
import SharedAgentMemory from "../assets/docs/AWSGenAI/shared-agent-memory.md?raw";
import ParallelAgentExecution from "../assets/docs/AWSGenAI/parallel-agent-execution.md?raw";
import SequentialAgentExecution from "../assets/docs/AWSGenAI/sequential-agent-execution.md?raw";
import ConditionalAgentRouting from "../assets/docs/AWSGenAI/conditional-agent-routing.md?raw";
import MultiAgentFailureHandling from "../assets/docs/AWSGenAI/multi-agent-failure-handling.md?raw";
import MultiAgentResultAggregation from "../assets/docs/AWSGenAI/multi-agent-result-aggregation.md?raw";
import MultiAgentObservability from "../assets/docs/AWSGenAI/multi-agent-observability.md?raw";

// ============================================================
// LANGGRAPH
// ============================================================
import WhatIsLangGraph from "../assets/docs/AWSGenAI/what-is-langgraph.md?raw";
import LangGraphVsLangChain from "../assets/docs/AWSGenAI/langgraph-vs-langchain.md?raw";
import LangGraphStateGraph from "../assets/docs/AWSGenAI/langgraph-state-graph.md?raw";
import LangGraphNodesEdges from "../assets/docs/AWSGenAI/langgraph-nodes-edges.md?raw";
import LangGraphConditionalRouting from "../assets/docs/AWSGenAI/langgraph-conditional-routing.md?raw";
import LangGraphLoops from "../assets/docs/AWSGenAI/langgraph-loops.md?raw";
import LangGraphParallelExecution from "../assets/docs/AWSGenAI/langgraph-parallel-execution.md?raw";
import LangGraphCheckpointing from "../assets/docs/AWSGenAI/langgraph-checkpointing.md?raw";
import LangGraphHumanInLoop from "../assets/docs/AWSGenAI/langgraph-human-in-loop.md?raw";
import LangGraphProductionDeployment from "../assets/docs/AWSGenAI/langgraph-production-deployment.md?raw";

// ============================================================
// MCP & A2A
// ============================================================
import WhatIsMCP from "../assets/docs/AWSGenAI/what-is-mcp.md?raw";
import MCPVsFunctionCalling from "../assets/docs/AWSGenAI/mcp-vs-function-calling.md?raw";
import MCPVsREST from "../assets/docs/AWSGenAI/mcp-vs-rest.md?raw";
import MCPSecurity from "../assets/docs/AWSGenAI/mcp-security.md?raw";
import WhatIsA2A from "../assets/docs/AWSGenAI/what-is-a2a.md?raw";
import A2AAgentCommunication from "../assets/docs/AWSGenAI/a2a-agent-communication.md?raw";
import A2AVsMCP from "../assets/docs/AWSGenAI/a2a-vs-mcp.md?raw";
import MCPAndA2ATogether from "../assets/docs/AWSGenAI/mcp-and-a2a-together.md?raw";

// ============================================================
// GOVERNANCE & SECURITY
// ============================================================
import EnterpriseAIGovernance from "../assets/docs/AWSGenAI/enterprise-ai-governance.md?raw";
import GenAISecurity from "../assets/docs/AWSGenAI/genai-security.md?raw";
import PromptInjection from "../assets/docs/AWSGenAI/prompt-injection.md?raw";
import PromptInjectionDefense from "../assets/docs/AWSGenAI/prompt-injection-defense.md?raw";
import DataLeakagePrevention from "../assets/docs/AWSGenAI/data-leakage-prevention.md?raw";
import PIIPrevention from "../assets/docs/AWSGenAI/pii-prevention.md?raw";
import AgentAuthorization from "../assets/docs/AWSGenAI/agent-authorization.md?raw";
import RBACABAC from "../assets/docs/AWSGenAI/rbac-abac.md?raw";
import TenantIsolation from "../assets/docs/AWSGenAI/tenant-isolation.md?raw";
import SecureAgentTools from "../assets/docs/AWSGenAI/secure-agent-tools.md?raw";
import AICompliance from "../assets/docs/AWSGenAI/ai-compliance.md?raw";

// ============================================================
// EVALUATION
// ============================================================
import LLMEvaluation from "../assets/docs/AWSGenAI/llm-evaluation.md?raw";
import HallucinationEvaluation from "../assets/docs/AWSGenAI/hallucination-evaluation.md?raw";
import GroundednessEvaluation from "../assets/docs/AWSGenAI/groundedness-evaluation.md?raw";
import GoldenDataset from "../assets/docs/AWSGenAI/golden-dataset.md?raw";
import LLMRegressionTesting from "../assets/docs/AWSGenAI/llm-regression-testing.md?raw";
import NonDeterministicTesting from "../assets/docs/AWSGenAI/non-deterministic-testing.md?raw";
import AgentEvaluation from "../assets/docs/AWSGenAI/agent-evaluation.md?raw";
import ToolSelectionEvaluation from "../assets/docs/AWSGenAI/tool-selection-evaluation.md?raw";

// ============================================================
// LLMOPS & OBSERVABILITY
// ============================================================
import LLMOpsArchitecture from "../assets/docs/AWSGenAI/llmops-architecture.md?raw";
import GenAIObservability from "../assets/docs/AWSGenAI/genai-observability.md?raw";
import AgentTracing from "../assets/docs/AWSGenAI/agent-tracing.md?raw";
import TokenUsageMonitoring from "../assets/docs/AWSGenAI/token-usage-monitoring.md?raw";
import LLMCostMonitoring from "../assets/docs/AWSGenAI/llm-cost-monitoring.md?raw";
import PromptVersioning from "../assets/docs/AWSGenAI/prompt-versioning.md?raw";
import ModelVersioning from "../assets/docs/AWSGenAI/model-versioning.md?raw";
import GenAICICD from "../assets/docs/AWSGenAI/genai-ci-cd.md?raw";
import GenAIRollback from "../assets/docs/AWSGenAI/genai-rollback.md?raw";
import ProductionMonitoring from "../assets/docs/AWSGenAI/production-monitoring.md?raw";

// ============================================================
// DATA ENGINEERING
// ============================================================
import EnterpriseDataPipeline from "../assets/docs/AWSGenAI/enterprise-data-pipeline.md?raw";
import BatchVsStreaming from "../assets/docs/AWSGenAI/batch-vs-streaming.md?raw";
import ApacheSpark from "../assets/docs/AWSGenAI/apache-spark.md?raw";
import DataQuality from "../assets/docs/AWSGenAI/data-quality.md?raw";
import SchemaEvolution from "../assets/docs/AWSGenAI/schema-evolution.md?raw";
import EmbeddingPipeline from "../assets/docs/AWSGenAI/embedding-pipeline.md?raw";
import EmbeddingPipelineScaling from "../assets/docs/AWSGenAI/embedding-pipeline-scaling.md?raw";
import FailedDataJobs from "../assets/docs/AWSGenAI/failed-data-jobs.md?raw";
import DuplicateEmbeddings from "../assets/docs/AWSGenAI/duplicate-embeddings.md?raw";
import EmbeddingVersioning from "../assets/docs/AWSGenAI/embedding-versioning.md?raw";

// ============================================================
// MACHINE LEARNING
// ============================================================
import EndToEndMLPipeline from "../assets/docs/AWSGenAI/end-to-end-ml-pipeline.md?raw";
import ModelTraining from "../assets/docs/AWSGenAI/model-training.md?raw";
import ModelDeployment from "../assets/docs/AWSGenAI/model-deployment.md?raw";
import ModelDrift from "../assets/docs/AWSGenAI/model-drift.md?raw";
import DataDrift from "../assets/docs/AWSGenAI/data-drift.md?raw";
import MLModelMonitoring from "../assets/docs/AWSGenAI/ml-model-monitoring.md?raw";
import SageMakerML from "../assets/docs/AWSGenAI/sagemaker-ml.md?raw";

// ============================================================
// CLOUD ARCHITECTURE
// ============================================================
import AWSIAM from "../assets/docs/AWSGenAI/aws-iam.md?raw";
import AWSKMS from "../assets/docs/AWSGenAI/aws-kms.md?raw";
import AWSSecretsManager from "../assets/docs/AWSGenAI/aws-secrets-manager.md?raw";
import AWSS3Security from "../assets/docs/AWSGenAI/aws-s3-security.md?raw";
import AWSNetworking from "../assets/docs/AWSGenAI/aws-networking.md?raw";
import AWSEKS from "../assets/docs/AWSGenAI/aws-eks.md?raw";
import AWSLambda from "../assets/docs/AWSGenAI/aws-lambda.md?raw";
import AWSAPIGateway from "../assets/docs/AWSGenAI/aws-api-gateway.md?raw";
import AWSCloudWatch from "../assets/docs/AWSGenAI/aws-cloudwatch.md?raw";
import AWSProductionArchitecture from "../assets/docs/AWSGenAI/aws-production-architecture.md?raw";

// ============================================================
// SOLUTION ARCHITECTURE & LEADERSHIP
// ============================================================
import BusinessToAIArchitecture from "../assets/docs/AWSGenAI/business-to-ai-architecture.md?raw";
import AIArchitectureDiscovery from "../assets/docs/AWSGenAI/ai-architecture-discovery.md?raw";
import TechnologySelection from "../assets/docs/AWSGenAI/technology-selection.md?raw";
import GenAIPOCToProduction from "../assets/docs/AWSGenAI/genai-poc-to-production.md?raw";
import CostLatencyQualityTradeoff from "../assets/docs/AWSGenAI/cost-latency-quality-tradeoff.md?raw";
import ReusableArchitecturePatterns from "../assets/docs/AWSGenAI/reusable-architecture-patterns.md?raw";
import StakeholderCommunication from "../assets/docs/AWSGenAI/stakeholder-communication.md?raw";
import EngineeringMentorship from "../assets/docs/AWSGenAI/engineering-mentorship.md?raw";
import ComplexGenAIProject from "../assets/docs/AWSGenAI/complex-genai-project.md?raw";
import MultiAgentProject from "../assets/docs/AWSGenAI/multi-agent-project.md?raw";
import ProductionIssueResolution from "../assets/docs/AWSGenAI/production-issue-resolution.md?raw";

const AWSGenAIInterviewQuestions = [

  // ============================================================
  // GENERATIVE AI & RAG
  // ============================================================

  {
    id: "what-is-rag",
    category: "Generative AI & RAG",
    title: "What is RAG and why would you use it instead of fine-tuning?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsRAG,
    code: ""
  },

  {
    id: "enterprise-rag-architecture",
    category: "Generative AI & RAG",
    title: "Walk me through an enterprise RAG architecture on AWS.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: EnterpriseRAGArchitecture,
    code: ""
  },

  {
    id: "rag-chunking-strategy",
    category: "Generative AI & RAG",
    title: "How do you decide the right chunking strategy?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: RAGChunkingStrategy,
    code: ""
  },

  {
    id: "embedding-models",
    category: "Generative AI & RAG",
    title: "How do you select an embedding model?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: EmbeddingModels,
    code: ""
  },

  {
    id: "vector-database-selection",
    category: "Generative AI & RAG",
    title: "How do you select a vector database for an enterprise RAG system?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: VectorDatabaseSelection,
    code: ""
  },

  {
    id: "hybrid-search",
    category: "Generative AI & RAG",
    title: "What is hybrid search and why is it useful?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: HybridSearch,
    code: ""
  },

  {
    id: "rag-retrieval-optimization",
    category: "Generative AI & RAG",
    title: "How do you improve poor retrieval quality?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGRetrievalOptimization,
    code: ""
  },

  {
    id: "rag-security-trimming",
    category: "Generative AI & RAG",
    title: "How do you implement metadata filtering and security trimming?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGSecurityTrimming,
    code: ""
  },

  {
    id: "rag-scaling",
    category: "Generative AI & RAG",
    title: "How would you scale a RAG system to millions of documents?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: RAGScaling,
    code: ""
  },

  {
    id: "rag-latency-optimization",
    category: "Generative AI & RAG",
    title: "How do you optimize RAG latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGLatencyOptimization,
    code: ""
  },

  {
    id: "semantic-caching",
    category: "Generative AI & RAG",
    title: "What is semantic caching and where would you use it?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: SemanticCaching,
    code: ""
  },

  {
    id: "context-window-optimization",
    category: "Generative AI & RAG",
    title: "How do you optimize context-window usage?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ContextWindowOptimization,
    code: ""
  },

  {
    id: "preventing-rag-hallucination",
    category: "Generative AI & RAG",
    title: "How do you prevent hallucinations in a RAG application?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: PreventingRAGHallucination,
    code: ""
  },

  {
    id: "rag-evaluation",
    category: "Generative AI & RAG",
    title: "How do you evaluate a RAG system?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RAGEvaluation,
    code: ""
  },

  {
    id: "rag-troubleshooting",
    category: "Generative AI & RAG",
    title: "A RAG system retrieves incorrect documents. How would you troubleshoot it?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: RAGTroubleshooting,
    code: ""
  },

  // ============================================================
  // AWS & BEDROCK
  // ============================================================

  {
    id: "what-is-amazon-bedrock",
    category: "AWS & Bedrock",
    title: "What is Amazon Bedrock?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsAmazonBedrock,
    code: ""
  },

  {
    id: "bedrock-vs-direct-llm",
    category: "AWS & Bedrock",
    title: "Why would you choose Amazon Bedrock instead of directly calling an LLM provider?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: BedrockVsDirectLLM,
    code: ""
  },

  {
    id: "bedrock-model-selection",
    category: "AWS & Bedrock",
    title: "How do you select a foundation model in Amazon Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: BedrockModelSelection,
    code: ""
  },

  {
    id: "bedrock-guardrails",
    category: "AWS & Bedrock",
    title: "How do you implement guardrails with Amazon Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: BedrockGuardrails,
    code: ""
  },

  {
    id: "bedrock-retries-throttling",
    category: "AWS & Bedrock",
    title: "How do you handle Bedrock throttling, retries, and transient failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: BedrockRetriesThrottling,
    code: ""
  },

  {
    id: "bedrock-model-fallback",
    category: "AWS & Bedrock",
    title: "How would you implement model fallback in Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: BedrockModelFallback,
    code: ""
  },

  {
    id: "bedrock-cost-optimization",
    category: "AWS & Bedrock",
    title: "How do you control and optimize Bedrock costs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: BedrockCostOptimization,
    code: ""
  },

  {
    id: "bedrock-production-architecture",
    category: "AWS & Bedrock",
    title: "How would you build a production-grade GenAI application using Bedrock?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: BedrockProductionArchitecture,
    code: ""
  },

  {
    id: "lambda-vs-eks",
    category: "AWS & Bedrock",
    title: "When would you use Lambda versus EKS for an AI application?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LambdaVsEKS,
    code: ""
  },

  {
    id: "bedrock-vs-sagemaker",
    category: "AWS & Bedrock",
    title: "When would you use Bedrock versus SageMaker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: BedrockVsSageMaker,
    code: ""
  },

  {
    id: "aws-genai-platform",
    category: "AWS & Bedrock",
    title: "Design a production-grade enterprise GenAI platform completely on AWS.",
    difficulty: "Expert",
    time: "~30 min",
    concept: AWSGenAIPlatform,
    code: ""
  },

  // ============================================================
  // AGENTIC AI
  // ============================================================

  {
    id: "what-is-agentic-ai",
    category: "Agentic AI",
    title: "What is Agentic AI?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsAgenticAI,
    code: ""
  },

  {
    id: "ai-reasoning-loop",
    category: "Agentic AI",
    title: "What is an AI reasoning loop?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: AIReasoningLoop,
    code: ""
  },

  {
    id: "autonomous-planning",
    category: "Agentic AI",
    title: "What is autonomous planning and how do agents use it?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AutonomousPlanning,
    code: ""
  },

  {
    id: "function-calling-tool-use",
    category: "Agentic AI",
    title: "What is function calling and tool use?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: FunctionCallingToolUse,
    code: ""
  },

  {
    id: "structured-tool-inputs",
    category: "Agentic AI",
    title: "How do you design structured inputs and outputs for agent tools?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: StructuredToolInputs,
    code: ""
  },

  {
    id: "agent-guardrails",
    category: "Agentic AI",
    title: "What guardrails are required for autonomous agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentGuardrails,
    code: ""
  },

  {
    id: "human-in-the-loop",
    category: "Agentic AI",
    title: "How do you implement human-in-the-loop controls?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: HumanInTheLoop,
    code: ""
  },

  {
    id: "preventing-agent-loops",
    category: "Agentic AI",
    title: "How do you prevent infinite loops in autonomous agents?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: PreventingAgentLoops,
    code: ""
  },

  {
    id: "agent-state",
    category: "Agentic AI",
    title: "How do you manage agent state?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentState,
    code: ""
  },

  {
    id: "agent-memory",
    category: "Agentic AI",
    title: "What is agent memory and how do you implement it?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentMemory,
    code: ""
  },

  {
    id: "agent-failure-recovery",
    category: "Agentic AI",
    title: "How do you recover from an agent failure?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentFailureRecovery,
    code: ""
  },

  // ============================================================
  // MULTI-AGENT SYSTEMS
  // ============================================================

  {
    id: "why-multi-agent",
    category: "Multi-Agent Systems",
    title: "Why would you use multiple agents instead of one agent?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: WhyMultiAgent,
    code: ""
  },

  {
    id: "supervisor-worker",
    category: "Multi-Agent Systems",
    title: "What is the supervisor-worker multi-agent pattern?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: SupervisorWorker,
    code: ""
  },

  {
    id: "decentralized-agents",
    category: "Multi-Agent Systems",
    title: "What is decentralized agent collaboration?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: DecentralizedAgents,
    code: ""
  },

  {
    id: "stateful-multi-agent-graphs",
    category: "Multi-Agent Systems",
    title: "How do you design a stateful multi-agent graph?",
    difficulty: "Expert",
    time: "~20 min",
    concept: StatefulMultiAgentGraphs,
    code: ""
  },

  {
    id: "agent-communication",
    category: "Multi-Agent Systems",
    title: "How do multiple agents communicate with each other?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentCommunication,
    code: ""
  },

  {
    id: "multi-agent-state",
    category: "Multi-Agent Systems",
    title: "How do you pass and persist state between multiple agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultiAgentState,
    code: ""
  },

  {
    id: "shared-agent-memory",
    category: "Multi-Agent Systems",
    title: "How do you implement shared memory between agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: SharedAgentMemory,
    code: ""
  },

  {
    id: "parallel-agent-execution",
    category: "Multi-Agent Systems",
    title: "How do you implement parallel execution of agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ParallelAgentExecution,
    code: ""
  },

  {
    id: "sequential-agent-execution",
    category: "Multi-Agent Systems",
    title: "When would you use sequential agent execution?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: SequentialAgentExecution,
    code: ""
  },

  {
    id: "conditional-agent-routing",
    category: "Multi-Agent Systems",
    title: "How do you implement conditional routing between agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ConditionalAgentRouting,
    code: ""
  },

  {
    id: "multi-agent-failure-handling",
    category: "Multi-Agent Systems",
    title: "Worker 1 and Worker 2 succeed but Worker 3 fails. How do you recover without rerunning successful workers?",
    difficulty: "Expert",
    time: "~20 min",
    concept: MultiAgentFailureHandling,
    code: ""
  },

  {
    id: "multi-agent-result-aggregation",
    category: "Multi-Agent Systems",
    title: "How do you aggregate results from multiple agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultiAgentResultAggregation,
    code: ""
  },

  {
    id: "multi-agent-observability",
    category: "Multi-Agent Systems",
    title: "How do you trace and monitor an end-to-end multi-agent workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MultiAgentObservability,
    code: ""
  },

  // ============================================================
  // LANGGRAPH
  // ============================================================

  {
    id: "what-is-langgraph",
    category: "LangGraph",
    title: "What is LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: WhatIsLangGraph,
    code: ""
  },

  {
    id: "langgraph-vs-langchain",
    category: "LangGraph",
    title: "Why would you use LangGraph instead of LangChain?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: LangGraphVsLangChain,
    code: ""
  },

  {
    id: "langgraph-state-graph",
    category: "LangGraph",
    title: "What is a StateGraph in LangGraph?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: LangGraphStateGraph,
    code: ""
  },

  {
    id: "langgraph-nodes-edges",
    category: "LangGraph",
    title: "What are nodes and edges in LangGraph?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: LangGraphNodesEdges,
    code: ""
  },

  {
    id: "langgraph-conditional-routing",
    category: "LangGraph",
    title: "How do you implement conditional routing in LangGraph?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: LangGraphConditionalRouting,
    code: ""
  },

  {
    id: "langgraph-loops",
    category: "LangGraph",
    title: "How do you implement loops and reasoning cycles in LangGraph?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: LangGraphLoops,
    code: ""
  },

  {
    id: "langgraph-parallel-execution",
    category: "LangGraph",
    title: "How do you implement parallel execution in LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LangGraphParallelExecution,
    code: ""
  },

  {
    id: "langgraph-checkpointing",
    category: "LangGraph",
    title: "How does LangGraph checkpointing and persistence work?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LangGraphCheckpointing,
    code: ""
  },

  {
    id: "langgraph-human-in-loop",
    category: "LangGraph",
    title: "How do you implement human-in-the-loop in LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LangGraphHumanInLoop,
    code: ""
  },

  {
    id: "langgraph-production-deployment",
    category: "LangGraph",
    title: "How would you deploy LangGraph in production?",
    difficulty: "Expert",
    time: "~20 min",
    concept: LangGraphProductionDeployment,
    code: ""
  },

  // ============================================================
  // MCP & A2A
  // ============================================================

  {
    id: "what-is-mcp",
    category: "MCP & A2A",
    title: "What is Model Context Protocol?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: WhatIsMCP,
    code: ""
  },

  {
    id: "mcp-vs-function-calling",
    category: "MCP & A2A",
    title: "How is MCP different from function calling?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPVsFunctionCalling,
    code: ""
  },

  {
    id: "mcp-vs-rest",
    category: "MCP & A2A",
    title: "How is MCP different from REST APIs?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: MCPVsREST,
    code: ""
  },

  {
    id: "mcp-security",
    category: "MCP & A2A",
    title: "How do you secure MCP tools?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPSecurity,
    code: ""
  },

  {
    id: "what-is-a2a",
    category: "MCP & A2A",
    title: "What is A2A?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: WhatIsA2A,
    code: ""
  },

  {
    id: "a2a-agent-communication",
    category: "MCP & A2A",
    title: "How does A2A enable agent-to-agent communication?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: A2AAgentCommunication,
    code: ""
  },

  {
    id: "a2a-vs-mcp",
    category: "MCP & A2A",
    title: "How is A2A different from MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: A2AVsMCP,
    code: ""
  },

  {
    id: "mcp-and-a2a-together",
    category: "MCP & A2A",
    title: "Can MCP and A2A be used together?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MCPAndA2ATogether,
    code: ""
  },

  // ============================================================
  // GOVERNANCE & SECURITY
  // ============================================================

  {
    id: "enterprise-ai-governance",
    category: "AI Governance & Security",
    title: "How would you design an enterprise AI governance framework?",
    difficulty: "Expert",
    time: "~20 min",
    concept: EnterpriseAIGovernance,
    code: ""
  },

  {
    id: "genai-security",
    category: "AI Governance & Security",
    title: "How do you secure an enterprise GenAI application?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: GenAISecurity,
    code: ""
  },

  {
    id: "prompt-injection",
    category: "AI Governance & Security",
    title: "What is prompt injection?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: PromptInjection,
    code: ""
  },

  {
    id: "prompt-injection-defense",
    category: "AI Governance & Security",
    title: "How do you defend against prompt injection?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: PromptInjectionDefense,
    code: ""
  },

  {
    id: "data-leakage-prevention",
    category: "AI Governance & Security",
    title: "How do you prevent data leakage in GenAI applications?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DataLeakagePrevention,
    code: ""
  },

  {
    id: "pii-prevention",
    category: "AI Governance & Security",
    title: "How do you protect PII in an enterprise AI system?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: PIIPrevention,
    code: ""
  },

  {
    id: "agent-authorization",
    category: "AI Governance & Security",
    title: "How do you implement authorization for AI agents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentAuthorization,
    code: ""
  },

  {
    id: "rbac-abac",
    category: "AI Governance & Security",
    title: "How would you use RBAC and ABAC in an AI platform?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: RBACABAC,
    code: ""
  },

  {
    id: "tenant-isolation",
    category: "AI Governance & Security",
    title: "How do you implement tenant isolation in a GenAI platform?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: TenantIsolation,
    code: ""
  },

  {
    id: "secure-agent-tools",
    category: "AI Governance & Security",
    title: "An agent can delete production data. How would you secure that tool?",
    difficulty: "Expert",
    time: "~20 min",
    concept: SecureAgentTools,
    code: ""
  },

  {
    id: "ai-compliance",
    category: "AI Governance & Security",
    title: "How do you address privacy, compliance, risk, and responsible AI?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AICompliance,
    code: ""
  },

  // ============================================================
  // LLM EVALUATION
  // ============================================================

  {
    id: "llm-evaluation",
    category: "LLM Evaluation",
    title: "How do you evaluate an LLM application?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LLMEvaluation,
    code: ""
  },

  {
    id: "hallucination-evaluation",
    category: "LLM Evaluation",
    title: "How do you measure hallucination?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: HallucinationEvaluation,
    code: ""
  },

  {
    id: "groundedness-evaluation",
    category: "LLM Evaluation",
    title: "How do you measure groundedness?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: GroundednessEvaluation,
    code: ""
  },

  {
    id: "golden-dataset",
    category: "LLM Evaluation",
    title: "What is a golden dataset and how do you create one?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: GoldenDataset,
    code: ""
  },

  {
    id: "llm-regression-testing",
    category: "LLM Evaluation",
    title: "How do you perform regression testing for LLM applications?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: LLMRegressionTesting,
    code: ""
  },

  {
    id: "non-deterministic-testing",
    category: "LLM Evaluation",
    title: "How do you test non-deterministic AI outputs?",
    difficulty: "Expert",
    time: "~15 min",
    concept: NonDeterministicTesting,
    code: ""
  },

  {
    id: "agent-evaluation",
    category: "LLM Evaluation",
    title: "How do you evaluate an autonomous agent?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentEvaluation,
    code: ""
  },

  {
    id: "tool-selection-evaluation",
    category: "LLM Evaluation",
    title: "How do you evaluate agent tool-selection accuracy?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ToolSelectionEvaluation,
    code: ""
  },

  // ============================================================
  // LLMOPS & OBSERVABILITY
  // ============================================================

  {
    id: "llmops-architecture",
    category: "LLMOps & Observability",
    title: "How would you design an LLMOps platform?",
    difficulty: "Expert",
    time: "~20 min",
    concept: LLMOpsArchitecture,
    code: ""
  },

  {
    id: "genai-observability",
    category: "LLMOps & Observability",
    title: "How do you implement observability for GenAI applications?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: GenAIObservability,
    code: ""
  },

  {
    id: "agent-tracing",
    category: "LLMOps & Observability",
    title: "How do you trace an end-to-end agent workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AgentTracing,
    code: ""
  },

  {
    id: "token-usage-monitoring",
    category: "LLMOps & Observability",
    title: "How do you monitor token usage?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: TokenUsageMonitoring,
    code: ""
  },

  {
    id: "llm-cost-monitoring",
    category: "LLMOps & Observability",
    title: "How do you calculate and monitor cost per AI request?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: LLMCostMonitoring,
    code: ""
  },

  {
    id: "prompt-versioning",
    category: "LLMOps & Observability",
    title: "How do you implement prompt versioning?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: PromptVersioning,
    code: ""
  },

  {
    id: "model-versioning",
    category: "LLMOps & Observability",
    title: "How do you manage model versions in production?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ModelVersioning,
    code: ""
  },

  {
    id: "genai-ci-cd",
    category: "LLMOps & Observability",
    title: "How do you implement CI/CD for GenAI applications?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: GenAICICD,
    code: ""
  },

  {
    id: "genai-rollback",
    category: "LLMOps & Observability",
    title: "How do you roll back a problematic model or prompt?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: GenAIRollback,
    code: ""
  },

  {
    id: "production-monitoring",
    category: "LLMOps & Observability",
    title: "What metrics would you monitor in a production GenAI system?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ProductionMonitoring,
    code: ""
  },

  // ============================================================
  // DATA ENGINEERING
  // ============================================================

  {
    id: "enterprise-data-pipeline",
    category: "Data Engineering",
    title: "How would you design an enterprise data pipeline for GenAI?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: EnterpriseDataPipeline,
    code: ""
  },

  {
    id: "batch-vs-streaming",
    category: "Data Engineering",
    title: "Batch processing vs streaming: when would you use each?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: BatchVsStreaming,
    code: ""
  },

  {
    id: "apache-spark",
    category: "Data Engineering",
    title: "How would you use Apache Spark in a GenAI data pipeline?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ApacheSpark,
    code: ""
  },

  {
    id: "data-quality",
    category: "Data Engineering",
    title: "How do you implement data-quality checks?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: DataQuality,
    code: ""
  },

  {
    id: "schema-evolution",
    category: "Data Engineering",
    title: "How do you handle schema evolution?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: SchemaEvolution,
    code: ""
  },

  {
    id: "embedding-pipeline",
    category: "Data Engineering",
    title: "How do you design an embedding-generation pipeline?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: EmbeddingPipeline,
    code: ""
  },

  {
    id: "embedding-pipeline-scaling",
    category: "Data Engineering",
    title: "How do you scale embedding generation for millions of documents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: EmbeddingPipelineScaling,
    code: ""
  },

  {
    id: "failed-data-jobs",
    category: "Data Engineering",
    title: "How do you handle failed data-processing jobs?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: FailedDataJobs,
    code: ""
  },

  {
    id: "duplicate-embeddings",
    category: "Data Engineering",
    title: "How do you prevent duplicate embeddings?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: DuplicateEmbeddings,
    code: ""
  },

  {
    id: "embedding-versioning",
    category: "Data Engineering",
    title: "How do you version embeddings?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: EmbeddingVersioning,
    code: ""
  },

  // ============================================================
  // MACHINE LEARNING
  // ============================================================

  {
    id: "end-to-end-ml-pipeline",
    category: "Machine Learning",
    title: "Explain an end-to-end machine learning pipeline.",
    difficulty: "Advanced",
    time: "~15 min",
    concept: EndToEndMLPipeline,
    code: ""
  },

  {
    id: "model-training",
    category: "Machine Learning",
    title: "How do you design a scalable model-training workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ModelTraining,
    code: ""
  },

  {
    id: "model-deployment",
    category: "Machine Learning",
    title: "How do you deploy an ML model to production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ModelDeployment,
    code: ""
  },

  {
    id: "model-drift",
    category: "Machine Learning",
    title: "What is model drift and how do you handle it?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: ModelDrift,
    code: ""
  },

  {
    id: "data-drift",
    category: "Machine Learning",
    title: "What is data drift and how do you monitor it?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: DataDrift,
    code: ""
  },

  {
    id: "ml-model-monitoring",
    category: "Machine Learning",
    title: "How do you monitor ML model performance in production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: MLModelMonitoring,
    code: ""
  },

  {
    id: "sagemaker-ml",
    category: "Machine Learning",
    title: "How would you use SageMaker for an enterprise ML workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: SageMakerML,
    code: ""
  },

  // ============================================================
  // AWS CLOUD ARCHITECTURE
  // ============================================================

  {
    id: "aws-iam",
    category: "AWS Cloud Architecture",
    title: "How do you use IAM to secure an enterprise AI platform?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AWSIAM,
    code: ""
  },

  {
    id: "aws-kms",
    category: "AWS Cloud Architecture",
    title: "How do you use KMS for encryption in an AI platform?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: AWSKMS,
    code: ""
  },

  {
    id: "aws-secrets-manager",
    category: "AWS Cloud Architecture",
    title: "How do you manage secrets in AWS?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: AWSSecretsManager,
    code: ""
  },

  {
    id: "aws-s3-security",
    category: "AWS Cloud Architecture",
    title: "How do you secure enterprise data stored in S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AWSS3Security,
    code: ""
  },

  {
    id: "aws-networking",
    category: "AWS Cloud Architecture",
    title: "How would you design secure networking for an enterprise AI platform?",
    difficulty: "Advanced",
    time: "~20 min",
    concept: AWSNetworking,
    code: ""
  },

  {
    id: "aws-eks",
    category: "AWS Cloud Architecture",
    title: "How would you deploy AI services on Amazon EKS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AWSEKS,
    code: ""
  },

  {
    id: "aws-lambda",
    category: "AWS Cloud Architecture",
    title: "When would you use AWS Lambda in a GenAI architecture?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: AWSLambda,
    code: ""
  },

  {
    id: "aws-api-gateway",
    category: "AWS Cloud Architecture",
    title: "How would you use API Gateway in an enterprise AI platform?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: AWSAPIGateway,
    code: ""
  },

  {
    id: "aws-cloudwatch",
    category: "AWS Cloud Architecture",
    title: "How do you use CloudWatch for AI application monitoring?",
    difficulty: "Advanced",
    time: "~10 min",
    concept: AWSCloudWatch,
    code: ""
  },

  {
    id: "aws-production-architecture",
    category: "AWS Cloud Architecture",
    title: "Design a secure, scalable, highly available AWS GenAI architecture.",
    difficulty: "Expert",
    time: "~30 min",
    concept: AWSProductionArchitecture,
    code: ""
  },

  // ============================================================
  // SOLUTION ARCHITECTURE & LEADERSHIP
  // ============================================================

  {
    id: "business-to-ai-architecture",
    category: "Solution Architecture & Leadership",
    title: "How do you translate a business problem into an AI architecture?",
    difficulty: "Expert",
    time: "~20 min",
    concept: BusinessToAIArchitecture,
    code: ""
  },

  {
    id: "ai-architecture-discovery",
    category: "Solution Architecture & Leadership",
    title: "How do you conduct an AI architecture discovery workshop?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: AIArchitectureDiscovery,
    code: ""
  },

  {
    id: "technology-selection",
    category: "Solution Architecture & Leadership",
    title: "How do you choose between competing AI technologies?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: TechnologySelection,
    code: ""
  },

  {
    id: "genai-poc-to-production",
    category: "Solution Architecture & Leadership",
    title: "How do you move a GenAI POC into production?",
    difficulty: "Expert",
    time: "~20 min",
    concept: GenAIPOCToProduction,
    code: ""
  },

  {
    id: "cost-latency-quality-tradeoff",
    category: "Solution Architecture & Leadership",
    title: "How do you balance AI cost, latency, quality, and scalability?",
    difficulty: "Expert",
    time: "~20 min",
    concept: CostLatencyQualityTradeoff,
    code: ""
  },

  {
    id: "reusable-architecture-patterns",
    category: "Solution Architecture & Leadership",
    title: "How do you establish reusable AI architecture and deployment patterns?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ReusableArchitecturePatterns,
    code: ""
  },

  {
    id: "stakeholder-communication",
    category: "Solution Architecture & Leadership",
    title: "How do you communicate AI architecture to business stakeholders?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: StakeholderCommunication,
    code: ""
  },

  {
    id: "engineering-mentorship",
    category: "Solution Architecture & Leadership",
    title: "How do you mentor and guide AI engineering teams?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: EngineeringMentorship,
    code: ""
  },

  {
    id: "complex-genai-project",
    category: "Solution Architecture & Leadership",
    title: "Tell me about your most complex Generative AI project.",
    difficulty: "Expert",
    time: "~20 min",
    concept: ComplexGenAIProject,
    code: ""
  },

  {
    id: "multi-agent-project",
    category: "Solution Architecture & Leadership",
    title: "Walk me through a complex multi-agent system you designed.",
    difficulty: "Expert",
    time: "~20 min",
    concept: MultiAgentProject,
    code: ""
  },

  {
    id: "production-issue-resolution",
    category: "Solution Architecture & Leadership",
    title: "Tell me about a production AI issue you identified and resolved.",
    difficulty: "Advanced",
    time: "~15 min",
    concept: ProductionIssueResolution,
    code: ""
  }
];

export default function AWSGenAIInterviewPage() {
  return (
    <CookbookApp
      data={AWSGenAIInterviewQuestions}
      title="AWS GenAI Interview Cookbook"
      subtitle="Generative AI • Agentic AI • AWS • RAG • Architecture"
      icon="☁️"
      patternLabel="Topics"
    />
  );
}

