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
import CoordinatorAgent from "./pages/CWD/CoordinatorAgent";
import DelegatorAgents from "./pages/CWD/DelegatorAgents";
import WorkerAgents from "./pages/CWD/WorkerAgents";
import CWDOrchestrationFlow from "./pages/CWD/CWDOrchestrationFlow";
import LangGraph from "./pages/CWD/LangGraph";
import MCP from "./pages/CWD/MCP";
import A2ACommunication from "./pages/CWD/A2ACommunication";
import AgentRegistry from "./pages/CWD/AgentRegistry";
import PromptRegistry from "./pages/CWD/PromptRegistry";
import RAGArchitecture from "./pages/CWD/RAGArchitecture";
import MemoryStateManagement from "./pages/CWD/MemoryStateManagement";
import EnterpriseDataIntegration from "./pages/CWD/EnterpriseDataIntegration";
import SecurityGovernance from "./pages/CWD/SecurityGovernance";
import Observability from "./pages/CWD/Observability";
import MessagingArchitecture from "./pages/CWD/MessagingArchitecture";
import EnterpriseGateway from "./pages/CWD/EnterpriseGateway";
import InfrastructureCloud from "./pages/CWD/InfrastructureCloud";
import EndtoEndCWDScenario from "./pages/CWD/EndtoEndCWDScenario";
import CWDStateExecutionModel from "./pages/CWD/CWDStateExecutionModel";
import ReliabilityFailureHandling from "./pages/CWD/ReliabilityFailureHandling";
import AgentEvaluation from "./pages/CWD/AgentEvaluation";
import LLMOpsAndMLOps from "./pages/CWD/LLMOpsAndMLOps";
import ArchitectureDecisionsTradeoffs from "./pages/CWD/ArchitectureDecisionsTrade-offs";
import ChallengesSolutions from "./pages/CWD/ChallengesSolutions";
import CurrentStateAndFutureState from "./pages/CWD/CurrentStateAndFutureState";
import InterviewPreparation from "./pages/CWD/InterviewPreparation";

import AWS from "./pages/AWS";
import GCP from "./pages/CWD/GCP";
import Azure from "./pages/CWD/Azure";
import AboutPooja from "./pages/CWD/AboutPooja";
import AzureEnterpriseQuestions from "./pages/CWD/CWDQuestions";

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
// COMPONENTS
// =====================================================

import ArraysAndLists from "./pages/Python/ArraysAndList"
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
          path="/cwd-coordinator"
          element={<CoordinatorAgent />}
        />

        <Route
          path="/cwd-delegator"
          element={<DelegatorAgents />}
        />

        <Route
          path="/cwd-workers"
          element={<WorkerAgents />}
        />

        <Route
          path="/cwd-orchestration"
          element={<CWDOrchestrationFlow />}
        />

        <Route
          path="/cwd-langgraph"
          element={<LangGraph />}
        />

        <Route
          path="/cwd-mcp"
          element={<MCP />}
        />

        <Route
          path="/cwd-a2a"
          element={<A2ACommunication />}
        />

        <Route
          path="/cwd-agent-registry"
          element={<AgentRegistry />}
        />

        <Route
          path="/cwd-prompt-registry"
          element={<PromptRegistry />}
        />

        <Route
          path="/cwd-rag"
          element={<RAGArchitecture />}
        />

        <Route
          path="/cwd-memory"
          element={<MemoryStateManagement />}
        />

        <Route
          path="/cwd-data-integration"
          element={<EnterpriseDataIntegration />}
        />

        <Route
          path="/cwd-security"
          element={<SecurityGovernance />}
        />

        <Route
          path="/cwd-observability"
          element={<Observability />}
        />

        <Route
          path="/cwd-messaging"
          element={<MessagingArchitecture />}
        />

        <Route
          path="/cwd-gateway"
          element={<EnterpriseGateway />}
        />

        <Route
          path="/cwd-cloud"
          element={<InfrastructureCloud />}
        />

        <Route
          path="/cwd-cbd-scenario"
          element={<EndtoEndCWDScenario />}
        />

        <Route
          path="/cwd-execution-model"
          element={<CWDStateExecutionModel />}
        />

        <Route
          path="/cwd-reliability"
          element={<ReliabilityFailureHandling />}
        />

        <Route
          path="/cwd-evaluation"
          element={<AgentEvaluation />}
        />

        <Route
          path="/cwd-llmops"
          element={<LLMOpsAndMLOps />}
        />

        <Route
          path="/cwd-decisions"
          element={<ArchitectureDecisionsTradeoffs />}
        />

        <Route
          path="/cwd-challenges"
          element={<ChallengesSolutions />}
        />

        <Route
          path="/cwd-current-future-state"
          element={<CurrentStateAndFutureState />}
        />

        <Route
          path="/cwd-interview"
          element={<InterviewPreparation />}
        />

        <Route 
        path="/ArraysAndLists" element={<ArraysAndLists />}

        />

        <Route 
        path="/AWS" element={<AWS />}

        />
        <Route 
        path="/GCP" element={<GCP />}

        />
        <Route 
        path="/Azure" element={<Azure />}

        />

        <Route 
        path="/about" element={<AboutPooja/>}

        />

        <Route path="/cwd-top-questions" element={<AzureEnterpriseQuestions/>} />

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

      </Routes>

    </BrowserRouter>
  );
}

export default App;
