import CookbookApp from "../components/CookbookApp";

import WhatIsA2A from "../assets/docs/A2A/what-is-a2a.md?raw";
import WhyAgentToAgentCommunication from "../assets/docs/A2A/why-agent-to-agent-communication.md?raw";
import A2AVsMCP from "../assets/docs/A2A/a2a-vs-mcp.md?raw";
import HowAgentsCommunicate from "../assets/docs/A2A/how-agents-communicate.md?raw";  
import WhatIsAgentCard from "../assets/docs/A2A/what-is-agent-card.md?raw";
import AgentDiscoveryA2A from "../assets/docs/A2A/agent-discovery-a2a.md?raw";
import A2AAgentAuthentication from "../assets/docs/A2A/a2a-agent-authentication.md?raw";
import A2AAsynchronousCommunication from "../assets/docs/A2A/a2a-asynchronous-communication.md?raw";
import A2AAgentFailures from "../assets/docs/A2A/a2a-agent-failures.md?raw";
import A2AAgentCapabilities from "../assets/docs/A2A/a2a-agent-capabilities.md?raw";
import EnterpriseA2AArchitecture from "../assets/docs/A2A/enterprise-a2a-architecture.md?raw";
import MCPAndA2ATogether from "../assets/docs/A2A/mcp-and-a2a-together.md?raw";


const A2AQuestion = 
[
  {
    id: "what-is-a2a",
    category: "Agentic AI Protocols",
    title: "What is A2A?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the Agent2Agent (A2A) protocol, its purpose, core concepts, and how it enables interoperability and communication between independent AI agents.",
    concept: WhatIsA2A,
    code: ""
  },

  {
    id: "why-agent-to-agent-communication",
    category: "Agentic AI Protocols",
    title: "Why do agents need agent-to-agent communication?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand why distributed AI agents need standardized communication for task delegation, collaboration, capability sharing, interoperability, and independent execution.",
    concept: WhyAgentToAgentCommunication,
    code: ""
  },

  {
    id: "a2a-vs-mcp",
    category: "Agentic AI Protocols",
    title: "How is A2A different from MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the architectural differences between A2A and MCP, including agent-to-agent collaboration versus agent-to-tool, resource, and context integration.",
    concept: A2AVsMCP,
    code: ""
  },

  {
    id: "how-agents-communicate",
    category: "Agentic AI Protocols",
    title: "How do two agents communicate?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how two independent agents exchange tasks, messages, context, status, and results using agent communication protocols and structured message formats.",
    concept: HowAgentsCommunicate,
    code: ""
  },

  {
    id: "what-is-agent-card",
    category: "Agentic AI Protocols",
    title: "What is an Agent Card?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand the purpose of an Agent Card, how it describes an agent's identity, capabilities, skills, supported communication methods, and endpoint information.",
    concept: WhatIsAgentCard,
    code: ""
  },

  {
    id: "agent-discovery-a2a",
    category: "Agentic AI Protocols",
    title: "How does an agent discover another agent?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand agent discovery mechanisms using Agent Cards, registries, service discovery, capability metadata, and endpoint information in distributed A2A systems.",
    concept: AgentDiscoveryA2A,
    code: ""
  },

  {
    id: "a2a-agent-authentication",
    category: "Agentic AI Security",
    title: "How do you authenticate agents?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand authentication mechanisms for agent-to-agent communication, including identity verification, OAuth, tokens, certificates, workload identity, and enterprise security controls.",
    concept: A2AAgentAuthentication,
    code: ""
  },

  {
    id: "a2a-asynchronous-communication",
    category: "Agentic AI Protocols",
    title: "How do you handle asynchronous agent communication?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how to design asynchronous A2A interactions for long-running tasks using task identifiers, callbacks, event notifications, message queues, polling, and status tracking.",
    concept: A2AAsynchronousCommunication,
    code: ""
  },

  {
    id: "a2a-agent-failures",
    category: "Multi-Agent Reliability",
    title: "How do you handle agent failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand failure-handling strategies for A2A systems, including retries, timeouts, circuit breakers, fallback agents, task recovery, idempotency, dead-letter handling, and graceful degradation.",
    concept: A2AAgentFailures,
    code: ""
  },

  {
    id: "a2a-agent-capabilities",
    category: "Agentic AI Architecture",
    title: "How do you manage agent capabilities?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how agent capabilities and skills are defined, advertised, discovered, versioned, governed, and matched against incoming tasks in an enterprise multi-agent ecosystem.",
    concept: A2AAgentCapabilities,
    code: ""
  },

  {
    id: "enterprise-a2a-architecture",
    category: "Agentic AI Architecture",
    title: "How would you design an enterprise A2A architecture?",
    difficulty: "Advanced",
    time: "~20 min",
    description:
      "Design an enterprise-grade A2A architecture covering agent discovery, Agent Cards, authentication, authorization, communication, orchestration, asynchronous tasks, observability, security, scalability, and failure handling.",
    concept: EnterpriseA2AArchitecture,
    code: ""
  },

  {
    id: "mcp-and-a2a-together",
    category: "Agentic AI Protocols",
    title: "Can MCP and A2A be used together?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand how MCP and A2A can coexist in an enterprise Agentic AI architecture, where A2A enables agent-to-agent collaboration and MCP enables agents to access tools, resources, and external systems.",
    concept: MCPAndA2ATogether,
    code: ""
  }
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={A2AQuestion}
      title="A2AQuestion Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}