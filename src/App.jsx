import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

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

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter basename="/GenAI-Architect-Playbook">
      <Navbar />
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
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

      </Routes> 
    </BrowserRouter>
  );
}

export default App;