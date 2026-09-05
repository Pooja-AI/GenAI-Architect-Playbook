import CookbookApp from "../../components/CookbookApp";

// =====================================================
// 22. Reliability & Failure Handling
// =====================================================

const ReliabilityFailureHandling = [
  {
    id: "cwd-reliability",
    category: "Reliability & Failure Handling",
    title: "Reliability & Failure Handling",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand how CWD detects, isolates, retries, recovers, and manages failures across the Gateway, Coordinator, Delegator, Workers, LLMs, tools, data sources, and messaging infrastructure.",
  },
      {
        id: "agent-failure",
        category: "Reliability & Failure Handling",
        title: "Agent Failure",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how agent failures are detected through health checks, execution status, timeouts, exceptions, and telemetry, and how failed agents are recovered or rerouted.",
        concept: "",
        code: "",
      },

      {
        id: "worker-failure",
        category: "Reliability & Failure Handling",
        title: "Worker Failure",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD handles specialized Worker failures using retry, timeout, alternate Worker selection, checkpointing, and failure isolation.",
        concept: "",
        code: "",
      },

      {
        id: "delegator-failure",
        category: "Reliability & Failure Handling",
        title: "Delegator Failure",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Delegator failures are detected and recovered while preserving domain-level task orchestration, Worker selection, task state, and execution continuity.",
        concept: "",
        code: "",
      },

      {
        id: "coordinator-failure",
        category: "Reliability & Failure Handling",
        title: "Coordinator Failure",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD recovers from Coordinator failures using persisted execution state, checkpoints, retries, failover, and workflow resumption without losing the overall request context.",
        concept: "",
        code: "",
      },

      {
        id: "reliability-retry",
        category: "Reliability & Failure Handling",
        title: "Retry",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand retry strategies such as fixed delay, exponential backoff, jitter, bounded retries, and retry policies based on transient versus permanent failures.",
        concept: "",
        code: "",
      },

      {
        id: "timeout",
        category: "Reliability & Failure Handling",
        title: "Timeout",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand timeout management across agents, LLM calls, MCP tools, data sources, APIs, and messaging systems to prevent long-running executions from blocking workflows.",
        concept: "",
        code: "",
      },

      {
        id: "circuit-breaker",
        category: "Reliability & Failure Handling",
        title: "Circuit Breaker",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how circuit breakers prevent repeated calls to unhealthy downstream services and protect CWD from cascading failures.",
        concept: "",
        code: "",
      },

      {
        id: "compensation",
        category: "Reliability & Failure Handling",
        title: "Compensation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand compensation patterns for partially completed workflows, including corrective actions, rollback strategies, and recovery when distributed operations cannot be fully reversed.",
        concept: "",
        code: "",
      },

      {
        id: "replay",
        category: "Reliability & Failure Handling",
        title: "Replay",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how persisted execution state, checkpoints, events, and messages can be replayed to recover failed executions or reproduce workflow behavior.",
        concept: "",
        code: "",
      },

      {
        id: "reliability-dlq",
        category: "Reliability & Failure Handling",
        title: "Dead Letter Queue",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Dead Letter Queues isolate messages that repeatedly fail processing and support investigation, remediation, controlled reprocessing, and operational recovery.",
        concept: "",
        code: "",
      },

      {
        id: "graceful-degradation",
        category: "Reliability & Failure Handling",
        title: "Graceful Degradation",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD continues providing useful responses when selected agents, tools, data sources, or downstream services are unavailable by using fallbacks, partial results, alternate paths, and controlled failure responses.",
        concept: "",
        code: "",
      },
   
];

export default function ReliabilityFailureHandlingPage() {
  return (
    <CookbookApp
      data={ReliabilityFailureHandling}
      title="Reliability & Failure Handling Cookbook"
      subtitle="Retries, recovery, resilience, failover and graceful degradation"
      icon="🛡️"
      patternLabel="Topics"
    />
  );
}

