import CookbookApp from "../../components/CookbookApp";

import CWDReliability from "../../assets/CWD/docs/cwd-reliability.md?raw";
import AgentFailure from "../../assets/CWD/docs/agent-failure.md?raw";
import WorkerFailure from "../../assets/CWD/docs/worker-failure.md?raw";
import DelegatorFailure from "../../assets/CWD/docs/delegator-failure.md?raw";
import CoordinatorFailure from "../../assets/CWD/docs/coordinator-failure.md?raw";
import ReliabilityRetry from "../../assets/CWD/docs/reliability-retry.md?raw";
import Timeout from "../../assets/CWD/docs/timeout.md?raw";
import CircuitBreaker from "../../assets/CWD/docs/circuit-breaker.md?raw";
import Compensation from "../../assets/CWD/docs/compensation.md?raw";
import Replay from "../../assets/CWD/docs/replay.md?raw";
import ReliabilityDLQ from "../../assets/CWD/docs/reliability-dlq.md?raw";
import GracefulDegradation from "../../assets/CWD/docs/graceful-degradation.md?raw";

const ReliabilityFailureHandling = [
  {
    id: "cwd-reliability",
    category: "Reliability & Failure Handling",
    title: "Reliability & Failure Handling",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand how CWD detects, isolates, retries, recovers, and manages failures across the Gateway, Coordinator, Delegator, Workers, LLMs, tools, data sources, and messaging infrastructure.",
    concept: CWDReliability,
    code: "",
  },

  {
    id: "agent-failure",
    category: "Reliability & Failure Handling",
    title: "Agent Failure",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how agent failures are detected through health checks, execution status, timeouts, exceptions, and telemetry, and how failed agents are recovered or rerouted.",
    concept: AgentFailure,
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
    concept: WorkerFailure,
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
    concept: DelegatorFailure,
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
    concept: CoordinatorFailure,
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
    concept: ReliabilityRetry,
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
    concept: Timeout,
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
    concept: CircuitBreaker,
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
    concept: Compensation,
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
    concept: Replay,
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
    concept: ReliabilityDLQ,
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
    concept: GracefulDegradation,
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

