import CookbookApp from "../../components/CookbookApp";
import Q90 from "../../assets/CWD/docs/04-delegator-architecture/90-why-introduce-delegators.md?raw";
import Q91 from "../../assets/CWD/docs/04-delegator-architecture/91-difference-between-coordinator-and-delegator.md?raw";
import Q92 from "../../assets/CWD/docs/04-delegator-architecture/92-difference-between-delegator-and-worker.md?raw";
import Q93 from "../../assets/CWD/docs/04-delegator-architecture/93-can-a-delegator-call-another-delegator.md?raw";
import Q94 from "../../assets/CWD/docs/04-delegator-architecture/94-can-a-worker-call-another-worker.md?raw";
import Q95 from "../../assets/CWD/docs/04-delegator-architecture/95-should-workers-know-about-other-workers.md?raw";
import Q96 from "../../assets/CWD/docs/04-delegator-architecture/96-how-delegator-discovers-its-workers.md?raw";
import Q97 from "../../assets/CWD/docs/04-delegator-architecture/97-does-the-delegator-use-an-llm.md?raw";
import Q98 from "../../assets/CWD/docs/04-delegator-architecture/98-if-yes-what-does-the-llm-decide.md?raw";
import Q99 from "../../assets/CWD/docs/04-delegator-architecture/99-if-no-how-are-workers-selected.md?raw";
import Q100 from "../../assets/CWD/docs/04-delegator-architecture/100-how-to-prevent-unauthorized-worker-calls.md?raw";
import Q101 from "../../assets/CWD/docs/04-delegator-architecture/101-how-delegator-passes-context-to-workers.md?raw";
import Q102 from "../../assets/CWD/docs/04-delegator-architecture/102-how-delegator-handles-worker-failures.md?raw";
import Q103 from "../../assets/CWD/docs/04-delegator-architecture/103-how-delegator-aggregates-worker-results.md?raw";
import Q104 from "../../assets/CWD/docs/04-delegator-architecture/104-how-delegator-validates-worker-responses.md?raw";
import Q105 from "../../assets/CWD/docs/04-delegator-architecture/105-how-delegator-handles-partial-success.md?raw";
import Q106 from "../../assets/CWD/docs/04-delegator-architecture/106-how-delegator-handles-conflicting-worker-results.md?raw";
import Q107 from "../../assets/CWD/docs/04-delegator-architecture/107-how-delegator-enforces-execution-order.md?raw";
import Q108 from "../../assets/CWD/docs/04-delegator-architecture/108-how-delegator-executes-workers-in-parallel.md?raw";
import Q109 from "../../assets/CWD/docs/04-delegator-architecture/109-how-delegator-implements-fan-out-fan-in.md?raw";
import Q110 from "../../assets/CWD/docs/04-delegator-architecture/110-how-delegator-handles-worker-timeouts.md?raw";
import Q111 from "../../assets/CWD/docs/04-delegator-architecture/111-how-delegator-handles-duplicate-worker-execution.md?raw";
import Q112 from "../../assets/CWD/docs/04-delegator-architecture/112-how-delegator-guarantees-idempotency.md?raw";

const CWDDelegatorArchitecture = [
  // =====================================================
  // 04. DELEGATOR ARCHITECTURE
  // =====================================================

  {
    id: "90-why-introduce-delegators",
    category: "Delegator Architecture",
    title: "Why did you introduce Delegators?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q90,
    code: "",
  },

  {
    id: "91-difference-between-coordinator-and-delegator",
    category: "Delegator Architecture",
    title: "What is the difference between Coordinator and Delegator?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q91,
    code: "",
  },

  {
    id: "92-difference-between-delegator-and-worker",
    category: "Delegator Architecture",
    title: "What is the difference between Delegator and Worker?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q92,
    code: "",
  },

  {
    id: "93-can-a-delegator-call-another-delegator",
    category: "Delegator Architecture",
    title: "Can a Delegator call another Delegator?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q93,
    code: "",
  },

  {
    id: "94-can-a-worker-call-another-worker",
    category: "Delegator Architecture",
    title: "Can a Worker call another Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q94,
    code: "",
  },

  {
    id: "95-should-workers-know-about-other-workers",
    category: "Delegator Architecture",
    title: "Should Workers know about other Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q95,
    code: "",
  },

  {
    id: "96-how-delegator-discovers-its-workers",
    category: "Delegator Architecture",
    title: "How does a Delegator discover its Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q96,
    code: "",
  },

  {
    id: "97-does-the-delegator-use-an-llm",
    category: "Delegator Architecture",
    title: "Does the Delegator use an LLM?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q97,
    code: "",
  },

  {
    id: "98-if-yes-what-does-the-llm-decide",
    category: "Delegator Architecture",
    title: "If yes, what does the LLM decide?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q98,
    code: "",
  },

  {
    id: "99-if-no-how-are-workers-selected",
    category: "Delegator Architecture",
    title: "If no, how are Workers selected?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q99,
    code: "",
  },

  {
    id: "100-how-to-prevent-unauthorized-worker-calls",
    category: "Delegator Architecture",
    title: "How do you prevent a Delegator from calling unauthorized Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q100,
    code: "",
  },

  {
    id: "101-how-delegator-passes-context-to-workers",
    category: "Delegator Architecture",
    title: "How does a Delegator pass context to Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q101,
    code: "",
  },

  {
    id: "102-how-delegator-handles-worker-failures",
    category: "Delegator Architecture",
    title: "How does a Delegator handle Worker failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q102,
    code: "",
  },

  {
    id: "103-how-delegator-aggregates-worker-results",
    category: "Delegator Architecture",
    title: "How does it aggregate Worker results?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q103,
    code: "",
  },

  {
    id: "104-how-delegator-validates-worker-responses",
    category: "Delegator Architecture",
    title: "How does it validate Worker responses?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q104,
    code: "",
  },

  {
    id: "105-how-delegator-handles-partial-success",
    category: "Delegator Architecture",
    title: "How does it handle partial success?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q105,
    code: "",
  },

  {
    id: "106-how-delegator-handles-conflicting-worker-results",
    category: "Delegator Architecture",
    title: "How does it handle conflicting Worker results?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q106,
    code: "",
  },

  {
    id: "107-how-delegator-enforces-execution-order",
    category: "Delegator Architecture",
    title: "How does it enforce execution order?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q107,
    code: "",
  },

  {
    id: "108-how-delegator-executes-workers-in-parallel",
    category: "Delegator Architecture",
    title: "How does it execute Workers in parallel?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q108,
    code: "",
  },

  {
    id: "109-how-delegator-implements-fan-out-fan-in",
    category: "Delegator Architecture",
    title: "How does it implement fan-out/fan-in?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q109,
    code: "",
  },

  {
    id: "110-how-delegator-handles-worker-timeouts",
    category: "Delegator Architecture",
    title: "How does it handle Worker timeouts?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q110,
    code: "",
  },

  {
    id: "111-how-delegator-handles-duplicate-worker-execution",
    category: "Delegator Architecture",
    title: "How does it handle duplicate Worker execution?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q111,
    code: "",
  },

  {
    id: "112-how-delegator-guarantees-idempotency",
    category: "Delegator Architecture",
    title: "How does it guarantee idempotency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: delegator responsibilities, worker orchestration, aggregation and idempotency.",
    concept: Q112,
    code: "",
  },

];

export default function CWDDelegatorArchitecturePage() {
  return (
    <CookbookApp
      data={CWDDelegatorArchitecture}
      title="CWD Delegator Architecture Cookbook"
      subtitle="Delegator responsibilities, worker orchestration, aggregation and idempotency"
      icon="🧩"
      patternLabel="Questions"
    />
  );
}
