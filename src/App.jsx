import { BrowserRouter, Routes, Route } from "react-router-dom";

// HOME
import Home from "./pages/Home";

// =====================================================
// AGENTIC AI
// =====================================================


import MCPQuestion from "./pages/MCPQuestion";
import A2AQuestion from "./pages/A2AQuestion";
import AgenticScenarioBasedQuestion from "./pages/AgenticScenarioBasedQuestion";
import TopQuestionsQuestion from "./pages/TopQuestionsQuestion";
import RAGQuestion from "./pages/RAGQuestion";


// =====================================================
// CWD PROJECT
// =====================================================

import ProjectOverview from "./pages/CWD/ProjectOverview";
import CWDArchitecture from "./pages/CWD/CWDArchitecture";

import AboutPooja from "./pages/CWD/AboutPooja";


// =====================================================
// CWD INTERVIEW QUESTION COOKBOOKS (one page per section)
// =====================================================

import ArchitectureQuestions from "./pages/CWD/02-CWDArchitecture";
import CoordinatorAgentQuestions from "./pages/CWD/03-CWDCoordinatorAgent";
import DelegatorArchitectureQuestions from "./pages/CWD/04-CWDDelegatorArchitecture";
import WorkerArchitectureQuestions from "./pages/CWD/05-CWDWorkerArchitecture";
import McpDeepInterviewQuestions from "./pages/CWD/06-CWDMcpDeepInterview";
import A2aAgentCommunicationQuestions from "./pages/CWD/07-CWDA2aAgentCommunication";
import LangGraphQuestions from "./pages/CWD/08-CWDLangGraph";
import RagArchitectureQuestions from "./pages/CWD/09-CWDRagArchitecture";
import LlmArchitectureQuestions from "./pages/CWD/10-CWDLlmArchitecture";
import HallucinationGroundingQuestions from "./pages/CWD/11-CWDHallucinationGrounding";
import LlmEvaluationQuestions from "./pages/CWD/12-CWDLlmEvaluation";
import SecurityArchitectureQuestions from "./pages/CWD/13-CWDSecurityArchitecture";
import ObservabilityQuestions from "./pages/CWD/15-CWDObservability";
import ReliabilityFailureHandlingQuestions from "./pages/CWD/16-CWDReliabilityFailureHandling";
import ScalabilityQuestions from "./pages/CWD/17-CWDScalability";
import PerformanceOptimizationQuestions from "./pages/CWD/18-CWDPerformanceOptimization";
import CostOptimizationQuestions from "./pages/CWD/19-CWDCostOptimization";
import DataArchitectureQuestions from "./pages/CWD/20-CWDDataArchitecture";
import EnterpriseIntegrationQuestions from "./pages/CWD/21-CWDEnterpriseIntegration";
import ApiBackendArchitectureQuestions from "./pages/CWD/22-CWDApiBackendArchitecture";
import DeploymentDevOpsQuestions from "./pages/CWD/23-CWDDeploymentDevOps";
import TestingQuestions from "./pages/CWD/24-CWDTesting";
import TroubleshootingScenariosQuestions from "./pages/CWD/25-CWDTroubleshootingScenarios";
import AgenticAiDesignQuestions from "./pages/CWD/26-CWDAgenticAiDesign";
import GovernanceQuestions from "./pages/CWD/27-CWDGovernance";
import ArchitectureTradeOffsQuestions from "./pages/CWD/28-CWDArchitectureTradeOffs";
import PrincipalArchitectQuestions from "./pages/CWD/29-CWDPrincipalArchitect";

// =====================================================
// AWS INTERVIEW QUESTION COOKBOOKS (one page per concept)
// =====================================================

import AWSArchitectureQuestion from "./pages/AWS/AWSArchitectureQuestion";
import AWSBedrockQuestion from "./pages/AWS/AWSBedrockQuestion";
import AWSApiGatewayQuestion from "./pages/AWS/AWSApiGatewayQuestion";
import AWSLambdaQuestion from "./pages/AWS/AWSLambdaQuestion";
import AWSEcsFargateEksQuestion from "./pages/AWS/AWSEcsFargateEksQuestion";
import AWSSqsAsyncQuestion from "./pages/AWS/AWSSqsAsyncQuestion";
import AWSStepFunctionsQuestion from "./pages/AWS/AWSStepFunctionsQuestion";
import AWSDynamoDbQuestion from "./pages/AWS/AWSDynamoDbQuestion";
import AWSS3Question from "./pages/AWS/AWSS3Question";
import AWSOpenSearchQuestion from "./pages/AWS/AWSOpenSearchQuestion";
import AWSIamSecurityQuestion from "./pages/AWS/AWSIamSecurityQuestion";
import AWSKmsSecretsQuestion from "./pages/AWS/AWSKmsSecretsQuestion";
import AWSVpcNetworkingQuestion from "./pages/AWS/AWSVpcNetworkingQuestion";
import AWSCloudWatchQuestion from "./pages/AWS/AWSCloudWatchQuestion";
import AWSScalabilityHaQuestion from "./pages/AWS/AWSScalabilityHaQuestion";
import AWSCostOptimizationQuestion from "./pages/AWS/AWSCostOptimizationQuestion";
import AWSDevOpsQuestion from "./pages/AWS/AWSDevOpsQuestion";
import AWSGlueQuestion from "./pages/AWS/AWSGlueQuestion";
import AWSSageMakerQuestion from "./pages/AWS/AWSSageMakerQuestion";

// =====================================================
// AZURE INTERVIEW QUESTION COOKBOOKS (one page per concept)
// =====================================================

import AzureArchitectureQuestion from "./pages/Azure/AzureArchitectureQuestion";
import AzureOpenAIQuestion from "./pages/Azure/AzureOpenAIQuestion";
import AzureAIFoundryQuestion from "./pages/Azure/AzureAIFoundryQuestion";
import AzureAISearchQuestion from "./pages/Azure/AzureAISearchQuestion";
import AzureDataFactoryQuestion from "./pages/Azure/AzureDataFactoryQuestion";
import AzureDatabricksQuestion from "./pages/Azure/AzureDatabricksQuestion";
import AzureMachineLearningQuestion from "./pages/Azure/AzureMachineLearningQuestion";
import AzureFunctionsQuestion from "./pages/Azure/AzureFunctionsQuestion";
import AzureContainerAppsQuestion from "./pages/Azure/AzureContainerAppsQuestion";
import AzureApiManagementQuestion from "./pages/Azure/AzureApiManagementQuestion";
import AzureServiceBusQuestion from "./pages/Azure/AzureServiceBusQuestion";
import AzureCosmosDbQuestion from "./pages/Azure/AzureCosmosDbQuestion";
import AzureRedisQuestion from "./pages/Azure/AzureRedisQuestion";
import AzureEntraIdQuestion from "./pages/Azure/AzureEntraIdQuestion";
import AzureKeyVaultQuestion from "./pages/Azure/AzureKeyVaultQuestion";
import AzureNetworkingQuestion from "./pages/Azure/AzureNetworkingQuestion";
import AzureMonitorQuestion from "./pages/Azure/AzureMonitorQuestion";
import AzureDevOpsQuestion from "./pages/Azure/AzureDevOpsQuestion";

// =====================================================
// DATA STRUCTURES INTERVIEW QUESTION COOKBOOKS
// (one page per topic per section: concept + code)
// =====================================================

import DSArraysListsConceptQuestion from "./pages/data-structures-interview-questions/01-arrays-lists/concept";
import DSArraysListsCodeQuestion from "./pages/data-structures-interview-questions/01-arrays-lists/code";
import DSStringsConceptQuestion from "./pages/data-structures-interview-questions/02-strings/concept";
import DSStringsCodeQuestion from "./pages/data-structures-interview-questions/02-strings/code";
import DSHashTableDictionaryConceptQuestion from "./pages/data-structures-interview-questions/03-hash-table-dictionary/concept";
import DSHashTableDictionaryCodeQuestion from "./pages/data-structures-interview-questions/03-hash-table-dictionary/code";
import DSSetConceptQuestion from "./pages/data-structures-interview-questions/04-set/concept";
import DSSetCodeQuestion from "./pages/data-structures-interview-questions/04-set/code";
import DSLinkedListConceptQuestion from "./pages/data-structures-interview-questions/05-linked-list/concept";
import DSLinkedListCodeQuestion from "./pages/data-structures-interview-questions/05-linked-list/code";
import DSStackConceptQuestion from "./pages/data-structures-interview-questions/06-stack/concept";
import DSStackCodeQuestion from "./pages/data-structures-interview-questions/06-stack/code";
import DSQueueConceptQuestion from "./pages/data-structures-interview-questions/07-queue/concept";
import DSQueueCodeQuestion from "./pages/data-structures-interview-questions/07-queue/code";
import DSHeapPriorityQueueConceptQuestion from "./pages/data-structures-interview-questions/08-heap-priority-queue/concept";
import DSHeapPriorityQueueCodeQuestion from "./pages/data-structures-interview-questions/08-heap-priority-queue/code";
import DSTreesConceptQuestion from "./pages/data-structures-interview-questions/09-trees/concept";
import DSTreesCodeQuestion from "./pages/data-structures-interview-questions/09-trees/code";
import DSBinarySearchTreeBstConceptQuestion from "./pages/data-structures-interview-questions/10-binary-search-tree-bst/concept";
import DSBinarySearchTreeBstCodeQuestion from "./pages/data-structures-interview-questions/10-binary-search-tree-bst/code";
import DSTrieConceptQuestion from "./pages/data-structures-interview-questions/11-trie/concept";
import DSTrieCodeQuestion from "./pages/data-structures-interview-questions/11-trie/code";
import DSGraphsConceptQuestion from "./pages/data-structures-interview-questions/12-graphs/concept";
import DSGraphsCodeQuestion from "./pages/data-structures-interview-questions/12-graphs/code";
import DSGraphAlgorithmsConceptQuestion from "./pages/data-structures-interview-questions/13-graph-algorithms/concept";
import DSUnionFindDisjointSetConceptQuestion from "./pages/data-structures-interview-questions/14-union-find-disjoint-set/concept";
import DSUnionFindDisjointSetCodeQuestion from "./pages/data-structures-interview-questions/14-union-find-disjoint-set/code";
import DSRecursionConceptQuestion from "./pages/data-structures-interview-questions/15-recursion/concept";
import DSRecursionCodeQuestion from "./pages/data-structures-interview-questions/15-recursion/code";
import DSBacktrackingConceptQuestion from "./pages/data-structures-interview-questions/16-backtracking/concept";
import DSBacktrackingCodeQuestion from "./pages/data-structures-interview-questions/16-backtracking/code";
import DSSortingConceptQuestion from "./pages/data-structures-interview-questions/17-sorting/concept";
import DSSortingCodeQuestion from "./pages/data-structures-interview-questions/17-sorting/code";
import DSSearchingConceptQuestion from "./pages/data-structures-interview-questions/18-searching/concept";
import DSSearchingCodeQuestion from "./pages/data-structures-interview-questions/18-searching/code";
import DSPrefixSumConceptQuestion from "./pages/data-structures-interview-questions/19-prefix-sum/concept";
import DSPrefixSumCodeQuestion from "./pages/data-structures-interview-questions/19-prefix-sum/code";
import DSSlidingWindowConceptQuestion from "./pages/data-structures-interview-questions/20-sliding-window/concept";
import DSSlidingWindowCodeQuestion from "./pages/data-structures-interview-questions/20-sliding-window/code";
import DSTwoPointersConceptQuestion from "./pages/data-structures-interview-questions/21-two-pointers/concept";
import DSTwoPointersCodeQuestion from "./pages/data-structures-interview-questions/21-two-pointers/code";
import DSMonotonicStackQueueConceptQuestion from "./pages/data-structures-interview-questions/22-monotonic-stack-queue/concept";
import DSMonotonicStackQueueCodeQuestion from "./pages/data-structures-interview-questions/22-monotonic-stack-queue/code";
import DSIntervalsConceptQuestion from "./pages/data-structures-interview-questions/23-intervals/concept";
import DSIntervalsCodeQuestion from "./pages/data-structures-interview-questions/23-intervals/code";
import DSBitManipulationConceptQuestion from "./pages/data-structures-interview-questions/24-bit-manipulation/concept";
import DSBitManipulationCodeQuestion from "./pages/data-structures-interview-questions/24-bit-manipulation/code";
import DSComplexityAnalysisConceptQuestion from "./pages/data-structures-interview-questions/25-complexity-analysis/concept";

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter basename="/GenAI-Architect-Playbook">

      <Navbar />

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* =================================================
            AGENTIC AI
        ================================================= */}
        
        <Route
          path="/rag"
          element={<RAGQuestion />}
        />

        <Route
          path="/mcp"
          element={<MCPQuestion />}
        />
  
        <Route
          path="/a2a"
          element={<A2AQuestion />}
        />
       
        <Route
          path="/agentic-scenario-based"
          element={<AgenticScenarioBasedQuestion />}
        />
       
        <Route
          path="/top-questions"
          element={<TopQuestionsQuestion />}
        />

      
        {/* =================================================
            CWD PROJECT
        ================================================= */}

        <Route
          path="/cwd-project-overview"
          element={<ProjectOverview />}
        />

        <Route
          path="/cwd-architecture"
          element={<CWDArchitecture />}
        />

        

        <Route 
        path="/about" element={<AboutPooja/>}

        />


        {/* =================================================
            CWD INTERVIEW QUESTION COOKBOOKS
        ================================================= */}

        {/* 02. Architecture Questions */}
        <Route
          path="/cwd-q-architecture-questions"
          element={<ArchitectureQuestions />}
        />

        {/* 03. Coordinator Agent */}
        <Route
          path="/cwd-q-coordinator-agent"
          element={<CoordinatorAgentQuestions />}
        />

        {/* 04. Delegator Architecture */}
        <Route
          path="/cwd-q-delegator-architecture"
          element={<DelegatorArchitectureQuestions />}
        />

        {/* 05. Worker Architecture */}
        <Route
          path="/cwd-q-worker-architecture"
          element={<WorkerArchitectureQuestions />}
        />

        {/* 06. Mcp Deep Interview */}
        <Route
          path="/cwd-q-mcp-deep-interview"
          element={<McpDeepInterviewQuestions />}
        />

        {/* 07. A2A Agent Communication */}
        <Route
          path="/cwd-q-a2a-agent-communication"
          element={<A2aAgentCommunicationQuestions />}
        />

        {/* 08. Langgraph */}
        <Route
          path="/cwd-q-langgraph"
          element={<LangGraphQuestions />}
        />

        {/* 09. Rag Architecture */}
        <Route
          path="/cwd-q-rag-architecture"
          element={<RagArchitectureQuestions />}
        />

        {/* 10. Llm Architecture */}
        <Route
          path="/cwd-q-llm-architecture"
          element={<LlmArchitectureQuestions />}
        />

        {/* 11. Hallucination And Grounding */}
        <Route
          path="/cwd-q-hallucination-and-grounding"
          element={<HallucinationGroundingQuestions />}
        />

        {/* 12. Llm Evaluation */}
        <Route
          path="/cwd-q-llm-evaluation"
          element={<LlmEvaluationQuestions />}
        />

        {/* 13. Security Architecture */}
        <Route
          path="/cwd-q-security-architecture"
          element={<SecurityArchitectureQuestions />}
        />

        {/* 15. Observability */}
        <Route
          path="/cwd-q-observability"
          element={<ObservabilityQuestions />}
        />

        {/* 16. Reliability And Failure Handling */}
        <Route
          path="/cwd-q-reliability-and-failure-handling"
          element={<ReliabilityFailureHandlingQuestions />}
        />

        {/* 17. Scalability */}
        <Route
          path="/cwd-q-scalability"
          element={<ScalabilityQuestions />}
        />

        {/* 18. Performance And Optimization */}
        <Route
          path="/cwd-q-performance-and-optimization"
          element={<PerformanceOptimizationQuestions />}
        />

        {/* 19. Cost Optimization */}
        <Route
          path="/cwd-q-cost-optimization"
          element={<CostOptimizationQuestions />}
        />

        {/* 20. Data Architecture */}
        <Route
          path="/cwd-q-data-architecture"
          element={<DataArchitectureQuestions />}
        />

        {/* 21. Enterprise Integration */}
        <Route
          path="/cwd-q-enterprise-integration"
          element={<EnterpriseIntegrationQuestions />}
        />

        {/* 22. Api And Backend Architecture */}
        <Route
          path="/cwd-q-api-and-backend-architecture"
          element={<ApiBackendArchitectureQuestions />}
        />

        {/* 23. Production Deployment Devops */}
        <Route
          path="/cwd-q-production-deployment-devops"
          element={<DeploymentDevOpsQuestions />}
        />

        {/* 24. Testing */}
        <Route
          path="/cwd-q-testing"
          element={<TestingQuestions />}
        />

        {/* 25. Troubleshooting Scenarios */}
        <Route
          path="/cwd-q-troubleshooting-scenarios"
          element={<TroubleshootingScenariosQuestions />}
        />

        {/* 26. Agentic Ai Design Questions */}
        <Route
          path="/cwd-q-agentic-ai-design-questions"
          element={<AgenticAiDesignQuestions />}
        />

        {/* 27. Governance */}
        <Route
          path="/cwd-q-governance"
          element={<GovernanceQuestions />}
        />

        {/* 28. Architecture Trade Off Questions */}
        <Route
          path="/cwd-q-architecture-trade-off-questions"
          element={<ArchitectureTradeOffsQuestions />}
        />

        {/* 29. Senior Principal Architect Questions */}
        <Route
          path="/cwd-q-senior-principal-architect-questions"
          element={<PrincipalArchitectQuestions />}
        />

        {/* =================================================
            AWS INTERVIEW QUESTION COOKBOOKS
        ================================================= */}

        {/* AWS Architecture */}
        <Route
          path="/aws-architecture"
          element={<AWSArchitectureQuestion />}
        />

        {/* Amazon Bedrock */}
        <Route
          path="/aws-bedrock"
          element={<AWSBedrockQuestion />}
        />

        {/* API Gateway */}
        <Route
          path="/aws-api-gateway"
          element={<AWSApiGatewayQuestion />}
        />

        {/* AWS Lambda */}
        <Route
          path="/aws-lambda"
          element={<AWSLambdaQuestion />}
        />

        {/* ECS / Fargate / EKS */}
        <Route
          path="/aws-ecs-fargate-eks"
          element={<AWSEcsFargateEksQuestion />}
        />

        {/* SQS & Asynchronous Processing */}
        <Route
          path="/aws-sqs"
          element={<AWSSqsAsyncQuestion />}
        />

        {/* Step Functions */}
        <Route
          path="/aws-step-functions"
          element={<AWSStepFunctionsQuestion />}
        />

        {/* DynamoDB */}
        <Route
          path="/aws-dynamodb"
          element={<AWSDynamoDbQuestion />}
        />

        {/* Amazon S3 */}
        <Route
          path="/aws-s3"
          element={<AWSS3Question />}
        />

        {/* OpenSearch */}
        <Route
          path="/aws-opensearch"
          element={<AWSOpenSearchQuestion />}
        />

        {/* IAM & Security */}
        <Route
          path="/aws-iam-security"
          element={<AWSIamSecurityQuestion />}
        />

        {/* KMS & Secrets Manager */}
        <Route
          path="/aws-kms-secrets"
          element={<AWSKmsSecretsQuestion />}
        />

        {/* VPC & Networking */}
        <Route
          path="/aws-vpc-networking"
          element={<AWSVpcNetworkingQuestion />}
        />

        {/* CloudWatch & Observability */}
        <Route
          path="/aws-cloudwatch"
          element={<AWSCloudWatchQuestion />}
        />

        {/* Scalability & High Availability */}
        <Route
          path="/aws-scalability-ha"
          element={<AWSScalabilityHaQuestion />}
        />

        {/* AWS Cost Optimization */}
        <Route
          path="/aws-cost-optimization"
          element={<AWSCostOptimizationQuestion />}
        />

        {/* AWS DevOps / Deployment */}
        <Route
          path="/aws-devops"
          element={<AWSDevOpsQuestion />}
        />

        {/* AWS Glue */}
        <Route
          path="/aws-glue"
          element={<AWSGlueQuestion />}
        />

        {/* Amazon SageMaker */}
        <Route
          path="/aws-sagemaker"
          element={<AWSSageMakerQuestion />}
        />

        {/* =================================================
            AZURE INTERVIEW QUESTION COOKBOOKS
        ================================================= */}

        {/* Azure Architecture */}
        <Route
          path="/azure-architecture"
          element={<AzureArchitectureQuestion />}
        />

        {/* Azure OpenAI */}
        <Route
          path="/azure-openai"
          element={<AzureOpenAIQuestion />}
        />

        {/* Azure AI Foundry */}
        <Route
          path="/azure-ai-foundry"
          element={<AzureAIFoundryQuestion />}
        />

        {/* Azure AI Search */}
        <Route
          path="/azure-ai-search"
          element={<AzureAISearchQuestion />}
        />

        {/* Azure Data Factory / Data Integration */}
        <Route
          path="/azure-data-factory"
          element={<AzureDataFactoryQuestion />}
        />

        {/* Azure Databricks */}
        <Route
          path="/azure-databricks"
          element={<AzureDatabricksQuestion />}
        />

        {/* Azure Machine Learning */}
        <Route
          path="/azure-machine-learning"
          element={<AzureMachineLearningQuestion />}
        />

        {/* Azure Functions */}
        <Route
          path="/azure-functions"
          element={<AzureFunctionsQuestion />}
        />

        {/* Azure Container Apps / AKS */}
        <Route
          path="/azure-container-apps"
          element={<AzureContainerAppsQuestion />}
        />

        {/* Azure API Management */}
        <Route
          path="/azure-api-management"
          element={<AzureApiManagementQuestion />}
        />

        {/* Azure Service Bus */}
        <Route
          path="/azure-service-bus"
          element={<AzureServiceBusQuestion />}
        />

        {/* Cosmos DB */}
        <Route
          path="/azure-cosmos-db"
          element={<AzureCosmosDbQuestion />}
        />

        {/* Azure Cache for Redis */}
        <Route
          path="/azure-redis"
          element={<AzureRedisQuestion />}
        />

        {/* Microsoft Entra ID */}
        <Route
          path="/azure-entra-id"
          element={<AzureEntraIdQuestion />}
        />

        {/* Azure Key Vault */}
        <Route
          path="/azure-key-vault"
          element={<AzureKeyVaultQuestion />}
        />

        {/* Azure Networking */}
        <Route
          path="/azure-networking"
          element={<AzureNetworkingQuestion />}
        />

        {/* Azure Monitor / Application Insights */}
        <Route
          path="/azure-monitor"
          element={<AzureMonitorQuestion />}
        />

        {/* Azure DevOps / CI/CD */}
        <Route
          path="/azure-devops"
          element={<AzureDevOpsQuestion />}
        />

        {/* =================================================
            DATA STRUCTURES INTERVIEW QUESTION COOKBOOKS
        ================================================= */}

        {/* 01. Arrays / Lists — Concept */}
        <Route
          path="/ds-arrays-lists-concept"
          element={<DSArraysListsConceptQuestion />}
        />

        {/* 01. Arrays / Lists — Code */}
        <Route
          path="/ds-arrays-lists-code"
          element={<DSArraysListsCodeQuestion />}
        />

        {/* 02. Strings — Concept */}
        <Route
          path="/ds-strings-concept"
          element={<DSStringsConceptQuestion />}
        />

        {/* 02. Strings — Code */}
        <Route
          path="/ds-strings-code"
          element={<DSStringsCodeQuestion />}
        />

        {/* 03. Hash Table / Dictionary — Concept */}
        <Route
          path="/ds-hash-table-dictionary-concept"
          element={<DSHashTableDictionaryConceptQuestion />}
        />

        {/* 03. Hash Table / Dictionary — Code */}
        <Route
          path="/ds-hash-table-dictionary-code"
          element={<DSHashTableDictionaryCodeQuestion />}
        />

        {/* 04. Set — Concept */}
        <Route
          path="/ds-set-concept"
          element={<DSSetConceptQuestion />}
        />

        {/* 04. Set — Code */}
        <Route
          path="/ds-set-code"
          element={<DSSetCodeQuestion />}
        />

        {/* 05. Linked List — Concept */}
        <Route
          path="/ds-linked-list-concept"
          element={<DSLinkedListConceptQuestion />}
        />

        {/* 05. Linked List — Code */}
        <Route
          path="/ds-linked-list-code"
          element={<DSLinkedListCodeQuestion />}
        />

        {/* 06. Stack — Concept */}
        <Route
          path="/ds-stack-concept"
          element={<DSStackConceptQuestion />}
        />

        {/* 06. Stack — Code */}
        <Route
          path="/ds-stack-code"
          element={<DSStackCodeQuestion />}
        />

        {/* 07. Queue — Concept */}
        <Route
          path="/ds-queue-concept"
          element={<DSQueueConceptQuestion />}
        />

        {/* 07. Queue — Code */}
        <Route
          path="/ds-queue-code"
          element={<DSQueueCodeQuestion />}
        />

        {/* 08. Heap / Priority Queue — Concept */}
        <Route
          path="/ds-heap-priority-queue-concept"
          element={<DSHeapPriorityQueueConceptQuestion />}
        />

        {/* 08. Heap / Priority Queue — Code */}
        <Route
          path="/ds-heap-priority-queue-code"
          element={<DSHeapPriorityQueueCodeQuestion />}
        />

        {/* 09. Trees — Concept */}
        <Route
          path="/ds-trees-concept"
          element={<DSTreesConceptQuestion />}
        />

        {/* 09. Trees — Code */}
        <Route
          path="/ds-trees-code"
          element={<DSTreesCodeQuestion />}
        />

        {/* 10. Binary Search Tree (BST) — Concept */}
        <Route
          path="/ds-binary-search-tree-bst-concept"
          element={<DSBinarySearchTreeBstConceptQuestion />}
        />

        {/* 10. Binary Search Tree (BST) — Code */}
        <Route
          path="/ds-binary-search-tree-bst-code"
          element={<DSBinarySearchTreeBstCodeQuestion />}
        />

        {/* 11. Trie — Concept */}
        <Route
          path="/ds-trie-concept"
          element={<DSTrieConceptQuestion />}
        />

        {/* 11. Trie — Code */}
        <Route
          path="/ds-trie-code"
          element={<DSTrieCodeQuestion />}
        />

        {/* 12. Graphs — Concept */}
        <Route
          path="/ds-graphs-concept"
          element={<DSGraphsConceptQuestion />}
        />

        {/* 12. Graphs — Code */}
        <Route
          path="/ds-graphs-code"
          element={<DSGraphsCodeQuestion />}
        />

        {/* 13. Graph Algorithms — Concept (no dedicated coding section in source) */}
        <Route
          path="/ds-graph-algorithms-concept"
          element={<DSGraphAlgorithmsConceptQuestion />}
        />

        {/* 14. Union-Find / Disjoint Set — Concept */}
        <Route
          path="/ds-union-find-disjoint-set-concept"
          element={<DSUnionFindDisjointSetConceptQuestion />}
        />

        {/* 14. Union-Find / Disjoint Set — Code */}
        <Route
          path="/ds-union-find-disjoint-set-code"
          element={<DSUnionFindDisjointSetCodeQuestion />}
        />

        {/* 15. Recursion — Concept */}
        <Route
          path="/ds-recursion-concept"
          element={<DSRecursionConceptQuestion />}
        />

        {/* 15. Recursion — Code */}
        <Route
          path="/ds-recursion-code"
          element={<DSRecursionCodeQuestion />}
        />

        {/* 16. Backtracking — Concept */}
        <Route
          path="/ds-backtracking-concept"
          element={<DSBacktrackingConceptQuestion />}
        />

        {/* 16. Backtracking — Code */}
        <Route
          path="/ds-backtracking-code"
          element={<DSBacktrackingCodeQuestion />}
        />

        {/* 17. Sorting — Concept */}
        <Route
          path="/ds-sorting-concept"
          element={<DSSortingConceptQuestion />}
        />

        {/* 17. Sorting — Code */}
        <Route
          path="/ds-sorting-code"
          element={<DSSortingCodeQuestion />}
        />

        {/* 18. Searching — Concept */}
        <Route
          path="/ds-searching-concept"
          element={<DSSearchingConceptQuestion />}
        />

        {/* 18. Searching — Code */}
        <Route
          path="/ds-searching-code"
          element={<DSSearchingCodeQuestion />}
        />

        {/* 19. Prefix Sum — Concept */}
        <Route
          path="/ds-prefix-sum-concept"
          element={<DSPrefixSumConceptQuestion />}
        />

        {/* 19. Prefix Sum — Code */}
        <Route
          path="/ds-prefix-sum-code"
          element={<DSPrefixSumCodeQuestion />}
        />

        {/* 20. Sliding Window — Concept */}
        <Route
          path="/ds-sliding-window-concept"
          element={<DSSlidingWindowConceptQuestion />}
        />

        {/* 20. Sliding Window — Code */}
        <Route
          path="/ds-sliding-window-code"
          element={<DSSlidingWindowCodeQuestion />}
        />

        {/* 21. Two Pointers — Concept */}
        <Route
          path="/ds-two-pointers-concept"
          element={<DSTwoPointersConceptQuestion />}
        />

        {/* 21. Two Pointers — Code */}
        <Route
          path="/ds-two-pointers-code"
          element={<DSTwoPointersCodeQuestion />}
        />

        {/* 22. Monotonic Stack / Queue — Concept */}
        <Route
          path="/ds-monotonic-stack-queue-concept"
          element={<DSMonotonicStackQueueConceptQuestion />}
        />

        {/* 22. Monotonic Stack / Queue — Code */}
        <Route
          path="/ds-monotonic-stack-queue-code"
          element={<DSMonotonicStackQueueCodeQuestion />}
        />

        {/* 23. Intervals — Concept */}
        <Route
          path="/ds-intervals-concept"
          element={<DSIntervalsConceptQuestion />}
        />

        {/* 23. Intervals — Code */}
        <Route
          path="/ds-intervals-code"
          element={<DSIntervalsCodeQuestion />}
        />

        {/* 24. Bit Manipulation — Concept */}
        <Route
          path="/ds-bit-manipulation-concept"
          element={<DSBitManipulationConceptQuestion />}
        />

        {/* 24. Bit Manipulation — Code */}
        <Route
          path="/ds-bit-manipulation-code"
          element={<DSBitManipulationCodeQuestion />}
        />

        {/* 25. Complexity & Analysis — Concept (no dedicated coding section in source) */}
        <Route
          path="/ds-complexity-analysis-concept"
          element={<DSComplexityAnalysisConceptQuestion />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
