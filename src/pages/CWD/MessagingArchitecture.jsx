import CookbookApp from "../../components/CookbookApp";

const MessagingArchitecture = [
  // =====================================================
  // 17. MESSAGING
  // =====================================================

  {
    id: "cwd-messaging",
    category: "Messaging Architecture",
    title: "Messaging Architecture",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand the event-driven and asynchronous messaging architecture used by CWD to decouple agents and services, support reliable task execution, handle high workloads, enable scalable communication, and provide resilient message processing.",

  },
      {
        id: "messaging-kafka",
        category: "Messaging Architecture",
        title: "Kafka",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how Apache Kafka can support high-throughput, distributed event streaming in CWD, including topics, partitions, producers, consumers, consumer groups, ordering, offsets, replay, scalability, and asynchronous agent communication.",
        concept: "",
        code: "",
      },

      {
        id: "messaging-service-bus",
        category: "Messaging Architecture",
        title: "Azure Service Bus",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how Azure Service Bus provides reliable enterprise messaging for CWD using queues and topics, including asynchronous task delivery, competing consumers, message locks, retries, dead-lettering, duplicate detection, and reliable delivery.",
        concept: "",
        code: "",
      },

      {
        id: "event-driven-architecture",
        category: "Messaging Architecture",
        title: "Event-Driven Architecture",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand event-driven architecture in CWD, including event producers, consumers, event contracts, asynchronous processing, loose coupling, event propagation, workflow triggers, and how agent activities can generate events for downstream services.",
        concept: "",
        code: "",
      },

      {
        id: "command-delivery",
        category: "Messaging Architecture",
        title: "Command Delivery",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how commands are reliably delivered from orchestration components to Delegators and Workers, including command identifiers, delivery guarantees, acknowledgements, idempotency, timeout handling, retries, and execution tracking.",
        concept: "",
        code: "",
      },

      {
        id: "pub-sub",
        category: "Messaging Architecture",
        title: "Pub/Sub",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand the publish-subscribe pattern and how CWD can distribute events to multiple independent consumers without tightly coupling the event producer to downstream services or agents.",
        concept: "",
        code: "",
      },

      {
        id: "messaging-retry",
        category: "Messaging Architecture",
        title: "Retry",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand message retry strategies for transient failures, including retry counts, exponential backoff, retryable versus non-retryable errors, visibility or lock timeouts, idempotent processing, and preventing repeated failed execution.",
        concept: "",
        code: "",
      },

      {
        id: "dead-letter-queue",
        category: "Messaging Architecture",
        title: "Dead Letter Queue",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how dead-letter queues isolate messages that cannot be successfully processed after configured retry attempts, including failure diagnostics, message inspection, remediation, replay strategies, and operational monitoring.",
        concept: "",
        code: "",
      },

      {
        id: "backpressure",
        category: "Messaging Architecture",
        title: "Backpressure",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD handles workload spikes when message production exceeds processing capacity, including queue buffering, consumer scaling, concurrency controls, throttling, rate limiting, load shedding, and protecting downstream services.",
        concept: "",
        code: "",
      },

      {
        id: "priority-lanes",
        category: "Messaging Architecture",
        title: "Priority Lanes",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand priority-based workload processing where critical CWD tasks receive preferential processing over lower-priority workloads, including priority queues, workload classification, scheduling, starvation prevention, and SLA-aware execution.",
        concept: "",
        code: "",
      },
    
  
];

export default function MessagingArchitecturePage() {
  return (
    <CookbookApp
      data={MessagingArchitecture}
      title="Messaging Architecture Cookbook"
      subtitle="Kafka, Service Bus, event-driven processing, retries and resilient messaging"
      icon="📨"
      patternLabel="Topics"
    />
  );
}

