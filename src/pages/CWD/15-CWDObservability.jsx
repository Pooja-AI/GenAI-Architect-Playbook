import CookbookApp from "../../components/CookbookApp";
import Q341 from "../../assets/CWD/docs/15-observability/341-what-does-observability-mean-in-genai.md?raw";
import Q342 from "../../assets/CWD/docs/15-observability/342-monitoring-vs-observability.md?raw";
import Q343 from "../../assets/CWD/docs/15-observability/343-what-do-you-monitor-in-cwd.md?raw";
import Q344 from "../../assets/CWD/docs/15-observability/344-what-are-your-key-metrics.md?raw";
import Q345 from "../../assets/CWD/docs/15-observability/345-how-to-trace-request-across-coordinator-delegator-worker.md?raw";
import Q346 from "../../assets/CWD/docs/15-observability/346-what-is-a-correlation-id.md?raw";
import Q347 from "../../assets/CWD/docs/15-observability/347-what-is-distributed-tracing.md?raw";
import Q348 from "../../assets/CWD/docs/15-observability/348-what-information-do-you-log.md?raw";
import Q349 from "../../assets/CWD/docs/15-observability/349-what-information-should-never-be-logged.md?raw";
import Q350 from "../../assets/CWD/docs/15-observability/350-how-to-trace-llm-calls.md?raw";
import Q351 from "../../assets/CWD/docs/15-observability/351-how-to-trace-mcp-calls.md?raw";
import Q352 from "../../assets/CWD/docs/15-observability/352-how-to-trace-a2a-calls.md?raw";
import Q353 from "../../assets/CWD/docs/15-observability/353-how-to-identify-the-slowest-worker.md?raw";
import Q354 from "../../assets/CWD/docs/15-observability/354-how-to-identify-expensive-llm-calls.md?raw";
import Q355 from "../../assets/CWD/docs/15-observability/355-how-to-identify-retrieval-failures.md?raw";
import Q356 from "../../assets/CWD/docs/15-observability/356-how-to-detect-hallucination-increases.md?raw";
import Q357 from "../../assets/CWD/docs/15-observability/357-how-to-monitor-token-consumption.md?raw";
import Q358 from "../../assets/CWD/docs/15-observability/358-how-to-monitor-latency.md?raw";
import Q359 from "../../assets/CWD/docs/15-observability/359-how-to-monitor-error-rates.md?raw";
import Q360 from "../../assets/CWD/docs/15-observability/360-what-tools-did-you-use.md?raw";
import Q361 from "../../assets/CWD/docs/15-observability/361-how-would-you-use-langfuse.md?raw";
import Q362 from "../../assets/CWD/docs/15-observability/362-how-would-you-use-cloudwatch.md?raw";
import Q363 from "../../assets/CWD/docs/15-observability/363-how-would-you-use-azure-application-insights.md?raw";
import Q364 from "../../assets/CWD/docs/15-observability/364-what-alerts-would-you-configure.md?raw";

const CWDObservability = [
  // =====================================================
  // 15. OBSERVABILITY
  // =====================================================

  {
    id: "341-what-does-observability-mean-in-genai",
    category: "Observability",
    title: "What does observability mean in GenAI?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q341,
    code: "",
  },

  {
    id: "342-monitoring-vs-observability",
    category: "Observability",
    title: "Monitoring vs observability?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q342,
    code: "",
  },

  {
    id: "343-what-do-you-monitor-in-cwd",
    category: "Observability",
    title: "What do you monitor in CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q343,
    code: "",
  },

  {
    id: "344-what-are-your-key-metrics",
    category: "Observability",
    title: "What are your key metrics?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q344,
    code: "",
  },

  {
    id: "345-how-to-trace-request-across-coordinator-delegator-worker",
    category: "Observability",
    title: "How do you trace a request across Coordinator → Delegator → Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q345,
    code: "",
  },

  {
    id: "346-what-is-a-correlation-id",
    category: "Observability",
    title: "What is a correlation ID?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q346,
    code: "",
  },

  {
    id: "347-what-is-distributed-tracing",
    category: "Observability",
    title: "What is distributed tracing?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q347,
    code: "",
  },

  {
    id: "348-what-information-do-you-log",
    category: "Observability",
    title: "What information do you log?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q348,
    code: "",
  },

  {
    id: "349-what-information-should-never-be-logged",
    category: "Observability",
    title: "What information should never be logged?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q349,
    code: "",
  },

  {
    id: "350-how-to-trace-llm-calls",
    category: "Observability",
    title: "How do you trace LLM calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q350,
    code: "",
  },

  {
    id: "351-how-to-trace-mcp-calls",
    category: "Observability",
    title: "How do you trace MCP calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q351,
    code: "",
  },

  {
    id: "352-how-to-trace-a2a-calls",
    category: "Observability",
    title: "How do you trace A2A calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q352,
    code: "",
  },

  {
    id: "353-how-to-identify-the-slowest-worker",
    category: "Observability",
    title: "How do you identify the slowest Worker?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q353,
    code: "",
  },

  {
    id: "354-how-to-identify-expensive-llm-calls",
    category: "Observability",
    title: "How do you identify expensive LLM calls?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q354,
    code: "",
  },

  {
    id: "355-how-to-identify-retrieval-failures",
    category: "Observability",
    title: "How do you identify retrieval failures?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q355,
    code: "",
  },

  {
    id: "356-how-to-detect-hallucination-increases",
    category: "Observability",
    title: "How do you detect hallucination increases?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q356,
    code: "",
  },

  {
    id: "357-how-to-monitor-token-consumption",
    category: "Observability",
    title: "How do you monitor token consumption?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q357,
    code: "",
  },

  {
    id: "358-how-to-monitor-latency",
    category: "Observability",
    title: "How do you monitor latency?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q358,
    code: "",
  },

  {
    id: "359-how-to-monitor-error-rates",
    category: "Observability",
    title: "How do you monitor error rates?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q359,
    code: "",
  },

  {
    id: "360-what-tools-did-you-use",
    category: "Observability",
    title: "What tools did you use?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q360,
    code: "",
  },

  {
    id: "361-how-would-you-use-langfuse",
    category: "Observability",
    title: "How would you use Langfuse?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q361,
    code: "",
  },

  {
    id: "362-how-would-you-use-cloudwatch",
    category: "Observability",
    title: "How would you use CloudWatch?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q362,
    code: "",
  },

  {
    id: "363-how-would-you-use-azure-application-insights",
    category: "Observability",
    title: "How would you use Azure Application Insights?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q363,
    code: "",
  },

  {
    id: "364-what-alerts-would-you-configure",
    category: "Observability",
    title: "What alerts would you configure?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: tracing, metrics, logging, alerting and GenAI monitoring.",
    concept: Q364,
    code: "",
  },

];

export default function CWDObservabilityPage() {
  return (
    <CookbookApp
      data={CWDObservability}
      title="CWD Observability Cookbook"
      subtitle="Tracing, metrics, logging, alerting and GenAI monitoring"
      icon="📡"
      patternLabel="Questions"
    />
  );
}
