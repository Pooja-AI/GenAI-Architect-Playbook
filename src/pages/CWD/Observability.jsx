import CookbookApp from "../../components/CookbookApp";

import CWDObservability from "../../assets/CWD/docs/cwd-observability.md?raw";
import WhyObservability from "../../assets/CWD/docs/why-observability.md?raw";
import CorrelationIds from "../../assets/CWD/docs/correlation-ids.md?raw";
import SessionId from "../../assets/CWD/docs/session-id.md?raw";
import TaskId from "../../assets/CWD/docs/task-id.md?raw";
import RunId from "../../assets/CWD/docs/run-id.md?raw";
import TurnId from "../../assets/CWD/docs/turn-id.md?raw";
import StepId from "../../assets/CWD/docs/step-id.md?raw";
import MLflow from "../../assets/CWD/docs/mlflow3.md?raw";
import ApplicationInsights from "../../assets/CWD/docs/application-insights.md?raw";
import LogAnalytics from "../../assets/CWD/docs/log-analytics.md?raw";
import DistributedTracing from "../../assets/CWD/docs/distributed-tracing.md?raw";
import Metrics from "../../assets/CWD/docs/cwd-metrics.md?raw";
import DashboardsAlerts from "../../assets/CWD/docs/dashboards-alerts.md?raw";



const Observability = [
  // =====================================================
  // 16. OBSERVABILITY
  // =====================================================

  {
    id: "cwd-observability",
    category: "Observability",
    title: "Observability",
    difficulty: "Advanced",
    time: "~50 min",
    description:
      "Understand end-to-end observability across the CWD agent, application, LLM, tool, data, messaging, and infrastructure layers, including correlation, distributed tracing, logs, metrics, dashboards, alerts, latency, token usage, cost, failures, and AI-specific quality signals.",
concept: CWDObservability,
  },
{
    id: "why-observability",
    category: "Observability",
    title: "Why Observability?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand why observability is critical for enterprise multi-agent systems, where a single user request can involve multiple agents, LLM calls, tools, data sources, messaging systems, and distributed services.",
    concept: WhyObservability,
    code: "",
  },

  {
    id: "correlation-ids",
    category: "Observability",
    title: "Correlation IDs",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how correlation IDs provide end-to-end request tracking across the CWD platform, allowing logs, traces, agent executions, tool calls, messages, and downstream service operations to be connected to a single user request.",
    concept: CorrelationIds,
    code: "",
  },

  {
    id: "session-id",
    category: "Observability",
    title: "Session ID",
    difficulty: "Intermediate",
    time: "~5 min",
    description:
      "Understand how a Session ID identifies the broader user interaction and connects multiple requests, conversations, tasks, and executions belonging to the same CWD session.",
    concept: SessionId,
    code: "",
  },

  {
    id: "task-id",
    category: "Observability",
    title: "Task ID",
    difficulty: "Intermediate",
    time: "~5 min",
    description:
      "Understand how a Task ID tracks a logical business or technical objective across Coordinator, Delegator, and Worker execution, enabling task-level monitoring, debugging, and lifecycle analysis.",
    concept: TaskId,
    code: "",
  },

  {
    id: "run-id",
    category: "Observability",
    title: "Run ID",
    difficulty: "Intermediate",
    time: "~5 min",
    description:
      "Understand how a Run ID identifies a specific execution attempt for a task, including execution status, retries, timestamps, participating agents, failures, and completion information.",
    concept: RunId,
    code: "",
  },

  {
    id: "turn-id",
    category: "Observability",
    title: "Turn ID",
    difficulty: "Intermediate",
    time: "~5 min",
    description:
      "Understand how a Turn ID tracks an individual conversational interaction between the user and CWD, connecting the user request, agent processing, tool activity, intermediate results, and final response.",
    concept: TurnId,
    code: "",
  },

  {
    id: "step-id",
    category: "Observability",
    title: "Step ID",
    difficulty: "Intermediate",
    time: "~5 min",
    description:
      "Understand how a Step ID tracks individual execution operations such as planning, delegation, retrieval, LLM invocation, tool execution, validation, aggregation, and response generation.",
    concept: StepId,
    code: "",
  },

  {
    id: "mlflow3",
    category: "Observability",
    title: "MLflow",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how MLflow can support experiment tracking, model lifecycle visibility, evaluation results, artifacts, parameters, metrics, and comparison of AI and ML experiments as part of the broader CWD observability and LLMOps strategy.",
    concept: MLflow,
    code: "",
  },

  {
    id: "application-insights",
    category: "Observability",
    title: "Application Insights",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand how Application Insights provides application telemetry for CWD services, including requests, dependencies, exceptions, performance, availability, distributed operations, and service-level health.",
    concept: ApplicationInsights,
    code: "",
  },

  {
    id: "log-analytics",
    category: "Observability",
    title: "Log Analytics",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand centralized log collection and analysis for CWD, including structured application logs, agent events, errors, security events, tool invocations, infrastructure logs, query-based troubleshooting, and operational investigation.",
    concept: LogAnalytics,
    code: "",
  },

  {
    id: "distributed-tracing",
    category: "Observability",
    title: "Distributed Tracing",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Understand distributed tracing across the complete CWD execution path, including Gateway → Coordinator → Delegator → Worker → LLM → MCP Tool → Data Source → Aggregation, and how trace context helps identify latency, failures, bottlenecks, and dependency issues.",
    concept: DistributedTracing,
    code: "",
  },

  {
    id: "cwd-metrics",
    category: "Observability",
    title: "Metrics",
    difficulty: "Advanced",
    time: "~10 min",
    description:
      "Understand operational and AI-specific metrics such as request volume, throughput, error rate, agent execution time, LLM latency, time to first token, token consumption, tool latency, retrieval performance, queue depth, success rate, and cost.",
    concept: Metrics,
    code: "",
  },

  {
    id: "dashboards-alerts",
    category: "Observability",
    title: "Dashboards & Alerts",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Understand how CWD dashboards provide real-time visibility into application, agent, infrastructure, LLM, messaging, and business metrics, while alerts detect failures, latency degradation, unusual traffic, cost spikes, and service-health issues.",
    concept: DashboardsAlerts,
    code: "",
  }, 
    
];

export default function ObservabilityPage() {
  return (
    <CookbookApp
      data={Observability}
      title="Observability Cookbook"
      subtitle="Tracing, logging, metrics, AI telemetry, dashboards and alerting"
      icon="📈"
      patternLabel="Topics"
    />
  );
}

