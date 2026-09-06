import CookbookApp from "../../components/CookbookApp";
import CWDA2A from "../../assets/CWD/docs/cwd-a2a.md?raw";
import WhatIsA2A from "../../assets/CWD/docs/what-is-a2a.md?raw";
import WhyAgentToAgent from "../../assets/CWD/docs/why-agent-to-agent.md?raw";
import CoordinatorDelegatorA2A from "../../assets/CWD/docs/coordinator-delegator-a2a.md?raw"; 
import DelegatorWorkerA2A from "../../assets/CWD/docs/delegator-worker-a2a.md?raw";
import WorkerDelegatorA2A from "../../assets/CWD/docs/worker-delegator-a2a.md?raw";
import DelegatorCoordinatorA2A from "../../assets/CWD/docs/delegator-coordinator-a2a.md?raw";
import A2AMessageStructure from "../../assets/CWD/docs/a2a-message-structure.md?raw";
import A2ACorrelationIDs from "../../assets/CWD/docs/a2a-correlation-ids.md?raw";
import A2AKafka from "../../assets/CWD/docs/a2a-kafka.md?raw";
import A2AServiceBus from "../../assets/CWD/docs/a2a-service-bus.md?raw";
import A2AAsyncCommunication from "../../assets/CWD/docs/a2a-async-communication.md?raw";
// import A2AInterview from "../../assets/CWD/docs/a2a-interview.md?raw";

const A2ACOMMUNICATION = [
  // =====================================================
  // 09. A2A COMMUNICATION
  // =====================================================
  {
    id: "cwd-a2a",
    category: "CWD Project",
    title: "A2A Communication",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand agent-to-agent communication and how independent CWD agents exchange tasks and results.",
  concept: CWDA2A,
    },
      {
        id: "what-is-a2a",
        category: "A2A Communication",
        title: "What is A2A?",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand the Agent2Agent protocol, its purpose, core concepts, and how it enables interoperability and communication between independent AI agents.",
        concept: WhatIsA2A,
        code: "",
      },
      {
        id: "why-agent-to-agent",
        category: "A2A Communication",
        title: "Why Agent-to-Agent Communication?",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand why independent agents require standardized communication.",
        concept: WhyAgentToAgent,
        code: "",
        
      },
      {
        id: "coordinator-delegator-a2a",
        category: "A2A Communication",
        title: "Coordinator → Delegator",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand communication between Coordinator and Delegator agents.",
        concept: CoordinatorDelegatorA2A,
        code: "",
      },
      {
        id: "delegator-worker-a2a",
        category: "A2A Communication",
        title: "Delegator → Worker",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand task communication between Delegators and Workers.",
        concept: DelegatorWorkerA2A,
        code: "",
      },
      {
        id: "worker-delegator-a2a",
        category: "A2A Communication",
        title: "Worker → Delegator",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand how Workers return execution results to Delegators.",
        concept: WorkerDelegatorA2A,
        code: "",
      },
      {
        id: "delegator-coordinator-a2a",
        category: "A2A Communication",
        title: "Delegator → Coordinator",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand how Delegators return results to the Coordinator.",
        concept: DelegatorCoordinatorA2A,
        code: "",
      },
      {
        id: "a2a-message-structure",
        category: "A2A Communication",
        title: "Message Structure",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand the structure and metadata of agent communication messages.",
        concept: A2AMessageStructure,
        code: "",
      },
      {
        id: "a2a-correlation-ids",
        category: "A2A Communication",
        title: "Correlation IDs",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand correlation IDs for distributed agent execution tracking.",
        concept: A2ACorrelationIDs,
        code: "",
      },
      {
        id: "a2a-kafka",
        category: "A2A Communication",
        title: "Kafka",
        difficulty: "Advanced",
        time: "~15 min",
        description: "Understand how Kafka can support asynchronous agent communication.",
        concept: A2AKafka,
        code: "",
      },
      {
        id: "a2a-service-bus",
        category: "A2A Communication",
        title: "Azure Service Bus",
        difficulty: "Advanced",
        time: "~15 min",
        description: "Understand Service Bus based messaging between agents.",
        concept: A2AServiceBus,
        code: "",
      },
      {
        id: "a2a-async-communication",
        category: "A2A Communication",
        title: "Async Communication",
        difficulty: "Advanced",
        time: "~10 min",
        description: "Understand asynchronous agent communication and long-running tasks.",
        concept: A2AAsyncCommunication,
        code: "",
      },
      {
        id: "a2a-interview",
        category: "A2A Communication",
        title: "A2A Interview Questions",
        difficulty: "Advanced",
        time: "~20 min",
        description: "Prepare for A2A architecture and scenario-based interview questions.",
        concept: "",
        code: "",
      },
  
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={A2ACOMMUNICATION}
      title="A2A Communication Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}