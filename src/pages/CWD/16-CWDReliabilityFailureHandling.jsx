import CookbookApp from "../../components/CookbookApp";
import Q365 from "../../assets/CWD/docs/16-reliability-and-failure-handling/365-what-happens-if-the-coordinator-fails.md?raw";
import Q366 from "../../assets/CWD/docs/16-reliability-and-failure-handling/366-what-happens-if-a-delegator-fails.md?raw";
import Q367 from "../../assets/CWD/docs/16-reliability-and-failure-handling/367-what-happens-if-worker-1-succeeds-and-worker-2-fails.md?raw";
import Q368 from "../../assets/CWD/docs/16-reliability-and-failure-handling/368-what-happens-if-the-llm-times-out.md?raw";
import Q369 from "../../assets/CWD/docs/16-reliability-and-failure-handling/369-what-happens-if-salesforce-is-unavailable.md?raw";
import Q370 from "../../assets/CWD/docs/16-reliability-and-failure-handling/370-what-happens-if-servicenow-is-unavailable.md?raw";
import Q371 from "../../assets/CWD/docs/16-reliability-and-failure-handling/371-what-happens-if-mcp-server-fails.md?raw";
import Q372 from "../../assets/CWD/docs/16-reliability-and-failure-handling/372-what-happens-if-the-database-fails.md?raw";
import Q373 from "../../assets/CWD/docs/16-reliability-and-failure-handling/373-what-happens-if-redis-fails.md?raw";
import Q374 from "../../assets/CWD/docs/16-reliability-and-failure-handling/374-how-do-you-retry.md?raw";
import Q375 from "../../assets/CWD/docs/16-reliability-and-failure-handling/375-how-many-retries.md?raw";
import Q376 from "../../assets/CWD/docs/16-reliability-and-failure-handling/376-what-is-exponential-backoff.md?raw";
import Q377 from "../../assets/CWD/docs/16-reliability-and-failure-handling/377-what-is-jitter.md?raw";
import Q378 from "../../assets/CWD/docs/16-reliability-and-failure-handling/378-what-is-a-circuit-breaker.md?raw";
import Q379 from "../../assets/CWD/docs/16-reliability-and-failure-handling/379-where-would-you-implement-circuit-breakers.md?raw";
import Q380 from "../../assets/CWD/docs/16-reliability-and-failure-handling/380-what-is-a-dead-letter-queue.md?raw";
import Q381 from "../../assets/CWD/docs/16-reliability-and-failure-handling/381-how-does-dlq-help-cwd.md?raw";
import Q382 from "../../assets/CWD/docs/16-reliability-and-failure-handling/382-how-do-you-replay-failed-requests.md?raw";
import Q383 from "../../assets/CWD/docs/16-reliability-and-failure-handling/383-how-do-you-guarantee-idempotency.md?raw";
import Q384 from "../../assets/CWD/docs/16-reliability-and-failure-handling/384-how-do-you-handle-duplicate-events.md?raw";
import Q385 from "../../assets/CWD/docs/16-reliability-and-failure-handling/385-how-do-you-handle-partial-completion.md?raw";
import Q386 from "../../assets/CWD/docs/16-reliability-and-failure-handling/386-how-do-you-implement-graceful-degradation.md?raw";
import Q387 from "../../assets/CWD/docs/16-reliability-and-failure-handling/387-how-do-you-implement-fallback.md?raw";
import Q388 from "../../assets/CWD/docs/16-reliability-and-failure-handling/388-how-do-you-prevent-cascading-failures.md?raw";

const CWDReliabilityFailureHandling = [
  // =====================================================
  // 16. RELIABILITY & FAILURE HANDLING
  // =====================================================

  {
    id: "365-what-happens-if-the-coordinator-fails",
    category: "Reliability & Failure Handling",
    title: "What happens if the Coordinator fails?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q365,
    code: "",
  },

  {
    id: "366-what-happens-if-a-delegator-fails",
    category: "Reliability & Failure Handling",
    title: "What happens if a Delegator fails?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q366,
    code: "",
  },

  {
    id: "367-what-happens-if-worker-1-succeeds-and-worker-2-fails",
    category: "Reliability & Failure Handling",
    title: "What happens if Worker 1 succeeds and Worker 2 fails?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q367,
    code: "",
  },

  {
    id: "368-what-happens-if-the-llm-times-out",
    category: "Reliability & Failure Handling",
    title: "What happens if the LLM times out?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q368,
    code: "",
  },

  {
    id: "369-what-happens-if-salesforce-is-unavailable",
    category: "Reliability & Failure Handling",
    title: "What happens if Salesforce is unavailable?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q369,
    code: "",
  },

  {
    id: "370-what-happens-if-servicenow-is-unavailable",
    category: "Reliability & Failure Handling",
    title: "What happens if ServiceNow is unavailable?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q370,
    code: "",
  },

  {
    id: "371-what-happens-if-mcp-server-fails",
    category: "Reliability & Failure Handling",
    title: "What happens if MCP server fails?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q371,
    code: "",
  },

  {
    id: "372-what-happens-if-the-database-fails",
    category: "Reliability & Failure Handling",
    title: "What happens if the database fails?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q372,
    code: "",
  },

  {
    id: "373-what-happens-if-redis-fails",
    category: "Reliability & Failure Handling",
    title: "What happens if Redis fails?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q373,
    code: "",
  },

  {
    id: "374-how-do-you-retry",
    category: "Reliability & Failure Handling",
    title: "How do you retry?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q374,
    code: "",
  },

  {
    id: "375-how-many-retries",
    category: "Reliability & Failure Handling",
    title: "How many retries?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q375,
    code: "",
  },

  {
    id: "376-what-is-exponential-backoff",
    category: "Reliability & Failure Handling",
    title: "What is exponential backoff?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q376,
    code: "",
  },

  {
    id: "377-what-is-jitter",
    category: "Reliability & Failure Handling",
    title: "What is jitter?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q377,
    code: "",
  },

  {
    id: "378-what-is-a-circuit-breaker",
    category: "Reliability & Failure Handling",
    title: "What is a circuit breaker?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q378,
    code: "",
  },

  {
    id: "379-where-would-you-implement-circuit-breakers",
    category: "Reliability & Failure Handling",
    title: "Where would you implement circuit breakers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q379,
    code: "",
  },

  {
    id: "380-what-is-a-dead-letter-queue",
    category: "Reliability & Failure Handling",
    title: "What is a dead-letter queue?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q380,
    code: "",
  },

  {
    id: "381-how-does-dlq-help-cwd",
    category: "Reliability & Failure Handling",
    title: "How does DLQ help CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q381,
    code: "",
  },

  {
    id: "382-how-do-you-replay-failed-requests",
    category: "Reliability & Failure Handling",
    title: "How do you replay failed requests?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q382,
    code: "",
  },

  {
    id: "383-how-do-you-guarantee-idempotency",
    category: "Reliability & Failure Handling",
    title: "How do you guarantee idempotency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q383,
    code: "",
  },

  {
    id: "384-how-do-you-handle-duplicate-events",
    category: "Reliability & Failure Handling",
    title: "How do you handle duplicate events?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q384,
    code: "",
  },

  {
    id: "385-how-do-you-handle-partial-completion",
    category: "Reliability & Failure Handling",
    title: "How do you handle partial completion?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q385,
    code: "",
  },

  {
    id: "386-how-do-you-implement-graceful-degradation",
    category: "Reliability & Failure Handling",
    title: "How do you implement graceful degradation?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q386,
    code: "",
  },

  {
    id: "387-how-do-you-implement-fallback",
    category: "Reliability & Failure Handling",
    title: "How do you implement fallback?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q387,
    code: "",
  },

  {
    id: "388-how-do-you-prevent-cascading-failures",
    category: "Reliability & Failure Handling",
    title: "How do you prevent cascading failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: failures, retries, circuit breakers, DLQs and graceful degradation.",
    concept: Q388,
    code: "",
  },

];

export default function CWDReliabilityFailureHandlingPage() {
  return (
    <CookbookApp
      data={CWDReliabilityFailureHandling}
      title="CWD Reliability & Failure Handling Cookbook"
      subtitle="Failures, retries, circuit breakers, DLQs and graceful degradation"
      icon="♻️"
      patternLabel="Questions"
    />
  );
}
