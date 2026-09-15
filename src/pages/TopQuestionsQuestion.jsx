import CookbookApp from "../components/CookbookApp";
// ================================
// LangGraph / Agentic AI Docs
// ================================

import A2AProblemSolved from "../assets/docs/a2a-problem-solved.md?raw";
import A2AVsRest from "../assets/docs/a2a-vs-rest.md?raw";
import A2AWithoutLangGraph from "../assets/docs/a2a-without-langgraph.md?raw";

import AgentCircularDependency from "../assets/docs/agent-circular-dependency.md?raw";
import AgentCommunication from "../assets/docs/agent-communication.md?raw";
import AgentCountDecision from "../assets/docs/agent-count-decision.md?raw";
import AgentDiscovery from "../assets/docs/agent-discovery.md?raw";
import AgentObservability from "../assets/docs/agent-observability.md?raw";

import AgenticCost from "../assets/docs/agentic-cost.md?raw";
import AgenticLatency from "../assets/docs/agentic-latency.md?raw";
import AgenticOverengineering from "../assets/docs/agentic-overengineering.md?raw";
import BiggestAgenticLimitation from "../assets/docs/biggest-agentic-limitation.md?raw";

import BuildOwnAgentFramework from "../assets/docs/build-own-agent-framework.md?raw";

import ConflictingAgentResults from "../assets/docs/conflicting-agent-results.md?raw";
import AgentBoundaries from "../assets/docs/agent-boundaries.md?raw";


// ================================
// Coordinator / Delegator / Worker
// ================================

import CoordinatorDelegatorWorker from "../assets/docs/coordinator-delegator-worker.md?raw";
import CoordinatorRouting from "../assets/docs/coordinator-routing.md?raw";
import CoordinatorWorkerDirect from "../assets/docs/coordinator-worker-direct.md?raw";
import CoordinatorWrongRouting from "../assets/docs/coordinator-wrong-routing.md?raw";

import CrossAgentState from "../assets/docs/cross-agent-state.md?raw";
import DelegatorWorkerSelection from "../assets/docs/delegator-worker-selection.md?raw";


// ================================
// Framework Comparisons
// ================================

import FrameworkAlternatives from "../assets/docs/framework-alternatives.md?raw";

import LanggraphLimitations from "../assets/docs/langgraph-limitations.md?raw";
import LanggraphTradeoffs from "../assets/docs/langgraph-tradeoffs.md?raw";

import LanggraphVSautogen from "../assets/docs/langgraph-vs-autogen.md?raw";
import LanggraphVScrewai from "../assets/docs/langgraph-vs-crewai.md?raw";
import LanggraphVSopenaiagents from "../assets/docs/langgraph-vs-openai-agents-sdk.md?raw";
import LanggraphVSsemantickernel from "../assets/docs/langgraph-vs-semantic-kernel.md?raw";

import LanggraphWithoutA2A from "../assets/docs/langgraph-without-a2a.md?raw";

import WorkerFailure from "../assets/docs/worker-failure.md?raw";


// ================================
// Hierarchical / Multi-Agent
// ================================

import HierarchicalVsPeerToPeer from "../assets/docs/hierarchical-vs-peer-to-peer.md?raw";
import HierarchicalVsSupervisor from "../assets/docs/hierarchical-vs-supervisor.md?raw";

import JustifyAgenticComplexity from "../assets/docs/justify-agentic-complexity.md?raw";

import MultipleAgentLayers from "../assets/docs/multiple-agent-layers.md?raw";

import MultiAgentTradeoffs from "../assets/docs/multi-agent-tradeoffs.md?raw";
import MultiAgentVsSingleAgent from "../assets/docs/multi-agent-vs-single-agent.md?raw";

import SingleLLMVsMultiAgent from "../assets/docs/single-llm-vs-multi-agent.md?raw";


// ================================
// LangGraph + A2A / MCP
// ================================

import LanggraphA2ACombination from "../assets/docs/langgraph-a2a-combination.md?raw";

import MCPA2ATogether from "../assets/docs/mcp-a2a-together.md?raw";


// ================================
// Architecture Decisions
// ================================

import RedesignAgenticArchitecture from "../assets/docs/redesign-agentic-architecture.md?raw";
import SimplifyAgenticArchitecture from "../assets/docs/simplify-agentic-architecture.md?raw";


// ================================
// When / Why Questions
// ================================

import WhenNotA2A from "../assets/docs/when-not-a2a.md?raw";
import WhenNotLanggraph from "../assets/docs/when-not-langgraph.md?raw";

import WhyA2A from "../assets/docs/why-a2a.md?raw";
import WhyAgenticFramework from "../assets/docs/why-agentic-framework.md?raw";
import WhyHierarchicalAgents from "../assets/docs/why-hierarchical-agents.md?raw";

import WhyLanggraph from "../assets/docs/whychooselanggraph.md?raw";

const AgentTopQuestion = [ 

  { 
    id: "why-langgraph", 
    category: "Agentic AI Frameworks", 
    title: "Why did you choose LangGraph for your project?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    tags: [ 
      "langgraph", 
      "agentic ai", 
      "agent orchestration", 
      "multi-agent", 
      "state management", 
      "workflow", 
      "architecture", 
      "enterprise ai" 
    ], 
    concept: WhyLanggraph, 
    code: "" 
  }, 

  { 
    id: "langgraph-vs-langchain-agents", 
    category: "Agentic AI Frameworks", 
    title: "Why did you choose LangGraph instead of LangChain Agents?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphVScrewai, 
    code: "" 
  }, 

  { 
    id: "langgraph-vs-crewai", 
    category: "Agentic AI Frameworks", 
    title: "Why did you choose LangGraph instead of CrewAI?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphVScrewai, 
    code: "" 
  }, 

  { 
    id: "langgraph-vs-autogen", 
    category: "Agentic AI Frameworks", 
    title: "Why did you choose LangGraph instead of AutoGen?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphVSautogen, 
    code: "" 
  }, 

  { 
    id: "langgraph-vs-semantic-kernel", 
    category: "Agentic AI Frameworks", 
    title: "Why did you choose LangGraph instead of Semantic Kernel?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphVSsemantickernel, 
    code: "" 
  }, 

  { 
    id: "langgraph-vs-openai-agents-sdk", 
    category: "Agentic AI Frameworks", 
    title: "Why did you choose LangGraph instead of OpenAI Agents SDK?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphVSopenaiagents, 
    code: "" 
  }, 

  { 
    id: "why-agentic-framework", 
    category: "Agentic AI Frameworks", 
    title: "What criteria did you use to select an Agentic AI framework?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhyAgenticFramework, 
    code: "" 
  }, 

  { 
    id: "langgraph-limitations", 
    category: "Agentic AI Frameworks", 
    title: "What are the limitations of LangGraph?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphLimitations, 
    code: "" 
  }, 

  { 
    id: "when-not-langgraph", 
    category: "Agentic AI Frameworks", 
    title: "When would you not use LangGraph?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhenNotLanggraph, 
    code: "" 
  }, 

  { 
    id: "build-own-agent-framework", 
    category: "Agentic AI Frameworks", 
    title: "Would you build your own Agentic AI orchestration framework? Why or why not?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: BuildOwnAgentFramework, 
    code: "" 
  }, 

  { 
    id: "why-a2a", 
    category: "Agentic AI Protocols", 
    title: "Why did you use A2A in your project?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhyA2A, 
    code: "" 
  }, 

  { 
    id: "a2a-vs-rest", 
    category: "Agentic AI Protocols", 
    title: "Why did you choose A2A instead of REST APIs for agent communication?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AVsRest, 
    code: "" 
  }, 

  { 
    id: "a2a-problem-solved", 
    category: "Agentic AI Protocols", 
    title: "What problem specifically did A2A solve in your architecture?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AProblemSolved, 
    code: "" 
  }, 

  { 
    id: "langgraph-a2a-combination", 
    category: "Agentic AI Architecture", 
    title: "Why did you use both LangGraph and A2A?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphA2ACombination, 
    code: "" 
  }, 

  { 
    id: "langgraph-without-a2a", 
    category: "Agentic AI Architecture", 
    title: "Can LangGraph work without A2A?", 
    difficulty: "Advanced", 
    time: "~10 min", 
    concept: LanggraphWithoutA2A, 
    code: "" 
  }, 

  { 
    id: "a2a-without-langgraph", 
    category: "Agentic AI Architecture", 
    title: "Can A2A work without LangGraph?", 
    difficulty: "Advanced", 
    time: "~10 min", 
    concept: A2AWithoutLangGraph, 
    code: "" 
  }, 

  { 
    id: "mcp-a2a-together", 
    category: "Agentic AI Protocols", 
    title: "Why did you use MCP and A2A together?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: MCPA2ATogether, 
    code: "" 
  }, 

  { 
    id: "when-not-a2a", 
    category: "Agentic AI Protocols", 
    title: "When would you not use A2A?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhenNotA2A, 
    code: "" 
  }, 

  { 
    id: "multi-agent-vs-single-agent", 
    category: "Agentic AI Architecture", 
    title: "Why did you choose multi-agent instead of a single-agent architecture?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: MultiAgentVsSingleAgent, 
    code: "" 
  }, 

  { 
    id: "coordinator-delegator-worker", 
    category: "Multi-Agent Architecture", 
    title: "Why did you choose a Coordinator → Delegator → Worker architecture?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: CoordinatorDelegatorWorker, 
    code: "" 
  }, 

  { 
    id: "coordinator-worker-direct", 
    category: "Multi-Agent Architecture", 
    title: "Why not use a Coordinator → Worker architecture directly?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: CoordinatorWorkerDirect, 
    code: "" 
  }, 

  { 
    id: "multiple-agent-layers", 
    category: "Multi-Agent Architecture", 
    title: "Why do you need multiple layers of agents?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: MultipleAgentLayers, 
    code: "" 
  }, 

  { 
    id: "agent-count-decision", 
    category: "Multi-Agent Architecture", 
    title: "How did you decide the number of agents in your architecture?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentCountDecision, 
    code: "" 
  }, 

  { 
    id: "agent-boundaries", 
    category: "Multi-Agent Architecture", 
    title: "How did you define the responsibility and boundary of each agent?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentBoundaries, 
    code: "" 
  }, 

  { 
    id: "why-hierarchical-agents", 
    category: "Multi-Agent Architecture", 
    title: "Why did you choose hierarchical agents?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhyHierarchicalAgents, 
    code: "" 
  }, 

  { 
    id: "hierarchical-vs-supervisor", 
    category: "Multi-Agent Architecture", 
    title: "Why not use a supervisor pattern?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: HierarchicalVsSupervisor, 
    code: "" 
  }, 

  { 
    id: "hierarchical-vs-peer-to-peer", 
    category: "Multi-Agent Architecture", 
    title: "Why not use peer-to-peer agents?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: HierarchicalVsPeerToPeer, 
    code: "" 
  }, 

  { 
    id: "multi-agent-tradeoffs", 
    category: "Multi-Agent Architecture", 
    title: "What are the trade-offs of your multi-agent architecture?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: MultiAgentTradeoffs, 
    code: "" 
  }, 

  { 
    id: "agentic-overengineering", 
    category: "Agentic AI Architecture", 
    title: "Isn't your Agentic AI architecture over-engineered?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgenticOverengineering, 
    code: "" 
  }, 

  { 
    id: "single-llm-vs-multi-agent", 
    category: "Agentic AI Architecture", 
    title: "Why can't a single powerful LLM perform all these tasks?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: SingleLLMVsMultiAgent, 
    code: "" 
  }, 

  { 
    id: "framework-alternatives", 
    category: "Agentic AI Frameworks", 
    title: "What alternatives did you evaluate before selecting LangGraph?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: FrameworkAlternatives, 
    code: "" 
  }, 

  { 
    id: "langgraph-tradeoffs", 
    category: "Agentic AI Frameworks", 
    title: "What trade-offs did you accept by choosing LangGraph?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: LanggraphTradeoffs, 
    code: "" 
  }, 

  { 
    id: "redesign-agentic-architecture", 
    category: "Agentic AI Architecture", 
    title: "What would you change if you redesigned the architecture today?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: RedesignAgenticArchitecture, 
    code: "" 
  }, 

  { 
    id: "simplify-agentic-architecture", 
    category: "Agentic AI Architecture", 
    title: "What component of your architecture would you remove if you had to simplify it?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: SimplifyAgenticArchitecture, 
    code: "" 
  }, 

  { 
    id: "biggest-agentic-limitation", 
    category: "Agentic AI Architecture", 
    title: "What is the biggest limitation of your current Agentic AI architecture?", 
    difficulty: "Advanced", 
    time: "~10 min", 
    concept: BiggestAgenticLimitation, 
    code: "" 
  }, 

  { 
    id: "agentic-latency", 
    category: "Agentic AI Architecture", 
    title: "How does your architecture impact latency?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgenticLatency, 
    code: "" 
  }, 

  { 
    id: "agentic-cost", 
    category: "Agentic AI Architecture", 
    title: "How does your architecture impact cost?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgenticCost, 
    code: "" 
  }, 

  { 
    id: "justify-agentic-complexity", 
    category: "Agentic AI Architecture", 
    title: "How do you justify the additional complexity of a multi-agent architecture?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: JustifyAgenticComplexity, 
    code: "" 
  }, 

  { 
    id: "coordinator-routing", 
    category: "Multi-Agent Architecture", 
    title: "How does your Coordinator decide which Delegator to invoke?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: CoordinatorRouting, 
    code: "" 
  }, 

  { 
    id: "delegator-worker-selection", 
    category: "Multi-Agent Architecture", 
    title: "How does the Delegator select the appropriate Worker?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: DelegatorWorkerSelection, 
    code: "" 
  }, 

  { 
    id: "agent-discovery", 
    category: "Agentic AI Protocols", 
    title: "How does an agent discover another agent?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentDiscovery, 
    code: "" 
  }, 

  { 
    id: "agent-communication", 
    category: "Multi-Agent Architecture", 
    title: "How do your agents communicate with each other?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentCommunication, 
    code: "" 
  }, 

  { 
    id: "cross-agent-state", 
    category: "Multi-Agent Architecture", 
    title: "How do you maintain state across agents?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: CrossAgentState, 
    code: "" 
  }, 

  { 
    id: "worker-failure", 
    category: "Multi-Agent Reliability", 
    title: "How do you handle failure of a Worker agent?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WorkerFailure, 
    code: "" 
  }, 

  { 
    id: "coordinator-wrong-routing", 
    category: "Multi-Agent Reliability", 
    title: "What happens if the Coordinator makes the wrong routing decision?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: CoordinatorRouting, 
    code: "" 
  }, 

  { 
    id: "conflicting-agent-results", 
    category: "Multi-Agent Reliability", 
    title: "What happens if two agents return conflicting answers?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: ConflictingAgentResults, 
    code: "" 
  }, 

  { 
    id: "agent-circular-dependency", 
    category: "Multi-Agent Reliability", 
    title: "How do you prevent agents from repeatedly calling each other?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentCircularDependency, 
    code: "" 
  }, 

  { 
    id: "agent-observability", 
    category: "Agentic AI Operations", 
    title: "How do you monitor and trace the complete multi-agent execution?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentObservability, 
    code: "" 
  } 
];
export default function CWDPage() {
  return (
    <CookbookApp
      data={AgentTopQuestion}
      title="AgentTopQuestion Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}