import { BrowserRouter, Routes, Route } from "react-router-dom";

// HOME
import Home from "./pages/Home";

// =====================================================
// AGENTIC AI
// =====================================================

import AgenticAIFundamentalsQuestion from "./pages/AgenticAIFundamentalsQuestion";
import SingleAgentArchitectureQuestions from "./pages/SingleAgentArchitectureQuestions";
import MultiAgentSystemsQuestions from "./pages/MultiAgentSystemsQuestions";
import LangraphQuestion from "./pages/LangraphQuestion";
import MCPQuestion from "./pages/MCPQuestion";
import A2AQuestion from "./pages/A2AQuestion";
import AgentRAGQuestion from "./pages/AgentRAGQuestion";
import PlanningReasoningQuestion from "./pages/PlanningReasoningQuestion";
import MemoryQuestion from "./pages/MemoryQuestion";
import AgentEvaluationQuestion from "./pages/AgentEvaluationQuestion";
import ProductionLLMOpsQuestion from "./pages/ProductionLLMOpsQuestion";
import SecurityResponsibleAIQuestion from "./pages/SecurityResponsibleAIQuestion";
import CloudArchitectureQuestion from "./pages/CloudArchitectureQuestion";
import EnterpriseAgentArchitectureQuestion from "./pages/EnterpriseAgentArchitectureQuestion";
import AgenticSystemDesignQuestionsQuestion from "./pages/AgenticSystemDesignQuestionsQuestion";
import AgenticScenarioBasedQuestion from "./pages/AgenticScenarioBasedQuestion";
import AgenticOwnProjectQuestion from "./pages/AgenticOwnProjectQuestion";
import TopQuestionsQuestion from "./pages/TopQuestionsQuestion";
import GenAIQuestion from "./pages/GenAIQuestion";

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
          path="/agentic-ai-fundamentals"
          element={<AgenticAIFundamentalsQuestion />}
        />

        <Route
          path="/single-agent-architecture"
          element={<SingleAgentArchitectureQuestions />}
        />

        <Route
          path="/multi-agent-systems"
          element={<MultiAgentSystemsQuestions />}
        />

        <Route
          path="/langgraph"
          element={<LangraphQuestion />}
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
          path="/agent-rag"
          element={<AgentRAGQuestion />}
        />

        <Route
          path="/planning-reasoning"
          element={<PlanningReasoningQuestion />}
        />

        <Route
          path="/memory"
          element={<MemoryQuestion />}
        />

        <Route
          path="/agent-evaluation"
          element={<AgentEvaluationQuestion />}
        />

        <Route
          path="/production-llmops"
          element={<ProductionLLMOpsQuestion />}
        />

        <Route
          path="/security-responsible-ai"
          element={<SecurityResponsibleAIQuestion />}
        />

        <Route
          path="/cloud-architecture"
          element={<CloudArchitectureQuestion />}
        />

        <Route
          path="/enterprise-agent-architecture"
          element={<EnterpriseAgentArchitectureQuestion />}
        />

        <Route
          path="/agentic-system-design-questions"
          element={<AgenticSystemDesignQuestionsQuestion />}
        />

        <Route
          path="/agentic-scenario-based"
          element={<AgenticScenarioBasedQuestion />}
        />

        <Route
          path="/agentic-own-project"
          element={<AgenticOwnProjectQuestion />}
        />

        <Route
          path="/top-questions"
          element={<TopQuestionsQuestion />}
        />

        <Route
          path="/genai-questions"
          element={<GenAIQuestion />}
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

      </Routes>

    </BrowserRouter>
  );
}

export default App;