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
  description:
    "Understand the architectural reasons for selecting LangGraph for stateful, multi-step, and hierarchical agent orchestration in an enterprise Agentic AI system.",

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

  concept:WhyLanggraph,

  code: ""
},
{
  id: "langgraph-vs-langchain-agents",
  category: "Agentic AI Frameworks",
  title: "Why did you choose LangGraph instead of LangChain Agents?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural differences between LangGraph and LangChain Agents and the factors involved in selecting LangGraph for complex enterprise agent orchestration.",

  concept: LanggraphVScrewai,

  code: ""
},
{
  id: "langgraph-vs-crewai",
  category: "Agentic AI Frameworks",
  title: "Why did you choose LangGraph instead of CrewAI?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural differences between LangGraph and CrewAI and how to select the appropriate framework based on orchestration, state management, multi-agent coordination, flexibility, and enterprise requirements.",

  concept: LanggraphVScrewai,

  code: ""
},
{
  id: "langgraph-vs-autogen",
  category: "Agentic AI Frameworks",
  title: "Why did you choose LangGraph instead of AutoGen?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural differences between LangGraph and AutoGen and how to evaluate them for multi-agent communication, orchestration, state management, workflow control, and enterprise production requirements.",

  concept: LanggraphVSautogen,

  code: ""
},
{
  id: "langgraph-vs-semantic-kernel",
  category: "Agentic AI Frameworks",
  title: "Why did you choose LangGraph instead of Semantic Kernel?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural differences between LangGraph and Semantic Kernel and how to select between them based on agent orchestration, workflow control, state management, enterprise integration, and cloud ecosystem requirements.",

  concept: LanggraphVSsemantickernel,

  code: ""
},
{
  id: "langgraph-vs-openai-agents-sdk",
  category: "Agentic AI Frameworks",
  title: "Why did you choose LangGraph instead of OpenAI Agents SDK?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural differences between LangGraph and OpenAI Agents SDK and how to evaluate them for agent orchestration, stateful workflows, tool usage, handoffs, observability, flexibility, and enterprise production requirements.",

  concept: LanggraphVSopenaiagents,

  code: ""
},
{
  id: "why-agentic-framework",
  category: "Agentic AI Frameworks",
  title: "What criteria did you use to select an Agentic AI framework?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the key technical, architectural, operational, and business criteria used to evaluate and select an Agentic AI framework for enterprise applications, including orchestration, state management, scalability, observability, security, ecosystem, and maintainability.",

  concept: WhyAgenticFramework,

  code: ""
},
{
  id: "langgraph-limitations",
  category: "Agentic AI Frameworks",
  title: "What are the limitations of LangGraph?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the limitations and trade-offs of LangGraph for enterprise Agentic AI systems, including workflow complexity, state management, debugging, scalability, framework dependency, operational overhead, and when a simpler approach may be more appropriate.",

  concept: LanggraphLimitations,

  code: ""
},
{
  id: "when-not-langgraph",
  category: "Agentic AI Frameworks",
  title: "When would you not use LangGraph?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand scenarios where LangGraph may be unnecessary or introduce excessive complexity, and how to determine when a simpler LLM chain, deterministic workflow, traditional orchestration framework, or another Agentic AI framework is a better architectural choice.",

  concept: WhenNotLanggraph,

  code: ""
},
{
  id: "build-own-agent-framework",
  category: "Agentic AI Frameworks",
  title: "Would you build your own Agentic AI orchestration framework? Why or why not?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Evaluate the architectural, engineering, operational, and business trade-offs between adopting an existing Agentic AI framework and building a custom orchestration framework for enterprise applications.",

  concept: BuildOwnAgentFramework,

  code: ""
},
{
  id: "why-a2a",
  category: "Agentic AI Protocols",
  title: "Why did you use A2A in your project?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural reasons for using Agent-to-Agent (A2A) communication to enable interoperability, capability discovery, task delegation, and communication between independently deployed AI agents in an enterprise multi-agent system.",

  concept: WhyA2A,

  code: ""
},
{
  id: "a2a-vs-rest",
  category: "Agentic AI Protocols",
  title: "Why did you choose A2A instead of REST APIs for agent communication?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Understand the architectural differences between A2A and traditional REST APIs and the factors involved in choosing A2A for interoperable agent-to-agent communication, including agent capabilities, discovery, task delegation, asynchronous interactions, and loose coupling.",

  concept: A2AVsRest,

  code: ""
},
{
  id: "a2a-problem-solved",
  category: "Agentic AI Protocols",
  title: "What problem specifically did A2A solve in your architecture?",
  difficulty: "Advanced",
  time: "~15 min",
  description:
    "Explain the specific architectural problem A2A addressed in a multi-agent enterprise system, including agent interoperability, capability discovery, task delegation, loose coupling, and communication between independently developed and deployed agents.",

  concept: A2AProblemSolved,

  code: ""
},
  {
    id: "langgraph-a2a-combination",
    category: "Agentic AI Architecture",
    title: "Why did you use both LangGraph and A2A?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand why LangGraph and A2A can serve different architectural responsibilities, with LangGraph handling agent orchestration and workflow control while A2A enables communication and interoperability between agents.",
    concept: LanggraphA2ACombination,
    code: ""
  },

  {
    id: "langgraph-without-a2a",
    category: "Agentic AI Architecture",
    title: "Can LangGraph work without A2A?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand whether LangGraph can independently orchestrate agents and workflows without using A2A, and identify scenarios where A2A may or may not be required.",
    concept: LanggraphWithoutA2A,
    code: ""
  },

  {
    id: "a2a-without-langgraph",
    category: "Agentic AI Architecture",
    title: "Can A2A work without LangGraph?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand whether A2A is independent of a specific agent orchestration framework and how agents can communicate through A2A while using different internal frameworks or implementations.",
    concept: A2AWithoutLangGraph,
    code: ""
  },

  {
    id: "mcp-a2a-together",
    category: "Agentic AI Protocols",
    title: "Why did you use MCP and A2A together?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how MCP and A2A solve different integration problems and how they can work together in an enterprise multi-agent architecture.",
    concept: MCPA2ATogether,
    code: ""
  },

  {
    id: "when-not-a2a",
    category: "Agentic AI Protocols",
    title: "When would you not use A2A?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Identify scenarios where A2A introduces unnecessary complexity and where direct function calls, REST APIs, messaging systems, or internal orchestration may be more appropriate.",
    concept: WhenNotA2A,
    code: ""
  },

  {
    id: "multi-agent-vs-single-agent",
    category: "Agentic AI Architecture",
    title: "Why did you choose multi-agent instead of a single-agent architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the architectural, functional, scalability, governance, and maintainability reasons for selecting a multi-agent architecture over a single general-purpose agent.",
    concept: MultiAgentVsSingleAgent,
    code: ""
  },

  {
    id: "coordinator-delegator-worker",
    category: "Multi-Agent Architecture",
    title: "Why did you choose a Coordinator → Delegator → Worker architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the reasons for using hierarchical agent orchestration with Coordinator, Delegator, and Worker layers and how this structure supports separation of responsibilities, routing, scalability, and governance.",
    concept: CoordinatorDelegatorWorker,
    code: ""
  },

  {
    id: "coordinator-worker-direct",
    category: "Multi-Agent Architecture",
    title: "Why not use a Coordinator → Worker architecture directly?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Evaluate the trade-offs between direct Coordinator-to-Worker routing and introducing Delegator agents for domain-level decomposition and specialized orchestration.",
    concept: CoordinatorWorkerDirect,
    code: ""
  },

  {
    id: "multiple-agent-layers",
    category: "Multi-Agent Architecture",
    title: "Why do you need multiple layers of agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand when multiple layers of agent orchestration are justified and how hierarchical decomposition can improve scalability, specialization, governance, and maintainability.",
    concept: MultipleAgentLayers,
    code: ""
  },

  {
    id: "agent-count-decision",
    category: "Multi-Agent Architecture",
    title: "How did you decide the number of agents in your architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to determine the appropriate number of agents based on business domains, responsibilities, tools, autonomy boundaries, complexity, latency, cost, and maintainability.",
    concept: AgentCountDecision,
    code: ""
  },

  {
    id: "agent-boundaries",
    category: "Multi-Agent Architecture",
    title: "How did you define the responsibility and boundary of each agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to establish clear agent responsibilities, capabilities, tool ownership, permissions, input/output contracts, and boundaries in an enterprise multi-agent system.",
    concept: AgentBoundaries,
    code: ""
  },

  {
    id: "why-hierarchical-agents",
    category: "Multi-Agent Architecture",
    title: "Why did you choose hierarchical agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand why hierarchical orchestration can be preferred for complex enterprise workloads requiring centralized coordination, domain-level delegation, specialized workers, and controlled execution.",
    concept: WhyHierarchicalAgents,
    code: ""
  },

  {
    id: "hierarchical-vs-supervisor",
    category: "Multi-Agent Architecture",
    title: "Why not use a supervisor pattern?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Compare hierarchical Coordinator → Delegator → Worker architecture with supervisor-based agent orchestration and evaluate their differences in routing, responsibility, scalability, and control.",
    concept: HierarchicalVsSupervisor,
    code: ""
  },

  {
    id: "hierarchical-vs-peer-to-peer",
    category: "Multi-Agent Architecture",
    title: "Why not use peer-to-peer agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Compare hierarchical orchestration with decentralized peer-to-peer agent communication and evaluate the trade-offs in control, coordination, routing, observability, and scalability.",
    concept: HierarchicalVsPeerToPeer,
    code: ""
  },

  {
    id: "multi-agent-tradeoffs",
    category: "Multi-Agent Architecture",
    title: "What are the trade-offs of your multi-agent architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Evaluate the benefits and drawbacks of multi-agent architecture across latency, cost, complexity, reliability, observability, scalability, communication overhead, and maintenance.",
    concept: MultiAgentTradeoffs,
    code: ""
  },

  {
    id: "agentic-overengineering",
    category: "Agentic AI Architecture",
    title: "Isn't your Agentic AI architecture over-engineered?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Evaluate whether the selected agentic architecture is justified by business and technical requirements and how to defend architectural complexity with measurable value.",
    concept: AgenticOverengineering,
    code: ""
  },

  {
    id: "single-llm-vs-multi-agent",
    category: "Agentic AI Architecture",
    title: "Why can't a single powerful LLM perform all these tasks?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the limitations of using a single general-purpose LLM for complex enterprise workloads and when specialized agents provide advantages in responsibility isolation, permissions, tools, scalability, and governance.",
    concept: SingleLLMVsMultiAgent,
    code: ""
  },

  {
    id: "framework-alternatives",
    category: "Agentic AI Frameworks",
    title: "What alternatives did you evaluate before selecting LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to evaluate alternative Agentic AI frameworks such as LangChain, CrewAI, AutoGen, Semantic Kernel, and OpenAI Agents SDK before making an architectural decision.",
    concept: FrameworkAlternatives,
    code: ""
  },

  {
    id: "langgraph-tradeoffs",
    category: "Agentic AI Frameworks",
    title: "What trade-offs did you accept by choosing LangGraph?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Evaluate the trade-offs introduced by LangGraph, including workflow flexibility, state management, development complexity, observability, framework dependency, and operational overhead.",
    concept: LanggraphTradeoffs,
    code: ""
  },

  {
    id: "redesign-agentic-architecture",
    category: "Agentic AI Architecture",
    title: "What would you change if you redesigned the architecture today?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Evaluate an existing Agentic AI architecture retrospectively and identify improvements in orchestration, communication, state management, security, scalability, observability, cost, and reliability.",
    concept: RedesignAgenticArchitecture,
    code: ""
  },

  {
    id: "simplify-agentic-architecture",
    category: "Agentic AI Architecture",
    title: "What component of your architecture would you remove if you had to simplify it?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Assess which components of an enterprise Agentic AI architecture are essential versus optional and determine how to simplify the system while preserving core business capabilities.",
    concept: SimplifyAgenticArchitecture,
    code: ""
  },

  {
    id: "biggest-agentic-limitation",
    category: "Agentic AI Architecture",
    title: "What is the biggest limitation of your current Agentic AI architecture?",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Identify and explain the most significant technical or operational limitation in a production multi-agent architecture and describe how it could be mitigated.",
    concept: BiggestAgenticLimitation,
    code: ""
  },

  {
    id: "agentic-latency",
    category: "Agentic AI Architecture",
    title: "How does your architecture impact latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Analyze how multiple agents, LLM calls, tool calls, retrieval, and inter-agent communication affect end-to-end latency and how the architecture can be optimized.",
    concept: AgenticLatency,
    code: ""
  },

  {
    id: "agentic-cost",
    category: "Agentic AI Architecture",
    title: "How does your architecture impact cost?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Analyze the cost implications of multi-agent execution, model calls, tool calls, retrieval, communication, and infrastructure and identify strategies for controlling cost.",
    concept: AgenticCost,
    code: ""
  },

  {
    id: "justify-agentic-complexity",
    category: "Agentic AI Architecture",
    title: "How do you justify the additional complexity of a multi-agent architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to justify multi-agent architectural complexity through measurable business value, specialization, scalability, governance, reliability, and operational benefits.",
    concept: JustifyAgenticComplexity,
    code: ""
  },

  {
    id: "coordinator-routing",
    category: "Multi-Agent Architecture",
    title: "How does your Coordinator decide which Delegator to invoke?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the routing mechanisms used by a Coordinator to identify the appropriate Delegator based on user intent, agent capabilities, context, policies, and task requirements.",
    concept: CoordinatorRouting,
    code: ""
  },

  {
    id: "delegator-worker-selection",
    category: "Multi-Agent Architecture",
    title: "How does the Delegator select the appropriate Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how Delegator agents select Workers based on capabilities, task requirements, availability, policies, and execution context.",
    concept: DelegatorWorkerSelection,
    code: ""
  },

  {
    id: "agent-discovery",
    category: "Agentic AI Protocols",
    title: "How does an agent discover another agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand agent discovery mechanisms, capability advertisement, agent registries, Agent Cards, service discovery, and dynamic selection of agents in distributed multi-agent systems.",
    concept: AgentDiscovery,
    code: ""
  },

  {
    id: "agent-communication",
    category: "Multi-Agent Architecture",
    title: "How do your agents communicate with each other?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the communication mechanisms between agents, including protocols, message formats, synchronous and asynchronous communication, task delegation, and result exchange.",
    concept: AgentCommunication,
    code: ""
  },

  {
    id: "cross-agent-state",
    category: "Multi-Agent Architecture",
    title: "How do you maintain state across agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how shared context, execution state, conversation state, checkpoints, and persistent state are managed across Coordinator, Delegator, and Worker agents.",
    concept: CrossAgentState,
    code: ""
  },

  {
    id: "worker-failure",
    category: "Multi-Agent Reliability",
    title: "How do you handle failure of a Worker agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand failure-handling strategies for Worker agents, including retries, timeouts, fallback agents, circuit breakers, task reassignment, compensation, and graceful degradation.",
    concept: WorkerFailure,
    code: ""
  },

  {
    id: "coordinator-wrong-routing",
    category: "Multi-Agent Reliability",
    title: "What happens if the Coordinator makes the wrong routing decision?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to detect, prevent, recover from, and monitor incorrect routing decisions made by a Coordinator in a multi-agent architecture.",
    concept: CoordinatorRouting,
    code: ""
  },

  {
    id: "conflicting-agent-results",
    category: "Multi-Agent Reliability",
    title: "What happens if two agents return conflicting answers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand strategies for resolving conflicting outputs from multiple agents using validation, confidence scoring, evaluator agents, source verification, consensus, and human escalation.",
    concept: ConflictingAgentResults,
    code: ""
  },

  {
    id: "agent-circular-dependency",
    category: "Multi-Agent Reliability",
    title: "How do you prevent agents from repeatedly calling each other?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand techniques for preventing circular delegation and infinite communication loops using execution limits, state tracking, correlation IDs, routing policies, and termination conditions.",
    concept: AgentCircularDependency,
    code: ""
  },

  {
    id: "agent-observability",
    category: "Agentic AI Operations",
    title: "How do you monitor and trace the complete multi-agent execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand end-to-end observability for multi-agent systems, including distributed tracing, agent execution logs, tool calls, LLM calls, latency, token usage, failures, and business-level outcomes.",
    concept: AgentObservability,
    code: ""
  },
    
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