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
 
const A2AQuestion = [ 
  { 
    id: "what-is-a2a", 
    category: "Agentic AI Protocols", 
    title: "What is A2A?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhatIsA2A, 
    code: "" 
  }, 
 
  { 
    id: "why-agent-to-agent-communication", 
    category: "Agentic AI Protocols", 
    title: "Why do agents need agent-to-agent communication?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhyAgentToAgentCommunication, 
    code: "" 
  }, 
 
  { 
    id: "a2a-vs-mcp", 
    category: "Agentic AI Protocols", 
    title: "How is A2A different from MCP?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AVsMCP, 
    code: "" 
  }, 
 
  { 
    id: "how-agents-communicate", 
    category: "Agentic AI Protocols", 
    title: "How do two agents communicate?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: HowAgentsCommunicate, 
    code: "" 
  }, 
 
  { 
    id: "what-is-agent-card", 
    category: "Agentic AI Protocols", 
    title: "What is an Agent Card?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: WhatIsAgentCard, 
    code: "" 
  }, 
 
  { 
    id: "agent-discovery-a2a", 
    category: "Agentic AI Protocols", 
    title: "How does an agent discover another agent?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: AgentDiscoveryA2A, 
    code: "" 
  }, 
 
  { 
    id: "a2a-agent-authentication", 
    category: "Agentic AI Security", 
    title: "How do you authenticate agents?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AAgentAuthentication, 
    code: "" 
  }, 
 
  { 
    id: "a2a-asynchronous-communication", 
    category: "Agentic AI Protocols", 
    title: "How do you handle asynchronous agent communication?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AAsynchronousCommunication, 
    code: "" 
  }, 
 
  { 
    id: "a2a-agent-failures", 
    category: "Multi-Agent Reliability", 
    title: "How do you handle agent failures?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AAgentFailures, 
    code: "" 
  }, 
 
  { 
    id: "a2a-agent-capabilities", 
    category: "Agentic AI Architecture", 
    title: "How do you manage agent capabilities?", 
    difficulty: "Advanced", 
    time: "~15 min", 
    concept: A2AAgentCapabilities, 
    code: "" 
  }, 
 
  { 
    id: "enterprise-a2a-architecture", 
    category: "Agentic AI Architecture", 
    title: "How would you design an enterprise A2A architecture?", 
    difficulty: "Advanced", 
    time: "~20 min", 
    concept: EnterpriseA2AArchitecture, 
    code: "" 
  }, 
 
  { 
    id: "mcp-and-a2a-together", 
    category: "Agentic AI Protocols", 
    title: "Can MCP and A2A be used together?", 
    difficulty: "Advanced", 
    time: "~15 min", 
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