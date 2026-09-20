import CookbookApp from "../../components/CookbookApp";

import Q186 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/186-how-would-you-implement-cwd-monitoring-using-cloudwatch.md?raw";
import Q187 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/187-what-cloudwatch-metrics-would-you-monitor.md?raw";
import Q188 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/188-what-logs-would-you-collect.md?raw";
import Q189 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/189-how-would-you-trace-one-request-across-aws-services.md?raw";
import Q190 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/190-how-would-you-create-correlation-ids.md?raw";
import Q191 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/191-how-would-you-monitor-lambda-errors.md?raw";
import Q192 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/192-how-would-you-monitor-ecs.md?raw";
import Q193 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/193-how-would-you-monitor-api-gateway.md?raw";
import Q194 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/194-how-would-you-monitor-sqs.md?raw";
import Q195 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/195-how-would-you-monitor-bedrock.md?raw";
import Q196 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/196-how-would-you-create-cloudwatch-alarms.md?raw";
import Q197 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/197-how-would-you-detect-latency-degradation.md?raw";
import Q198 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/198-how-would-you-detect-a-cost-spike.md?raw";
import Q199 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/199-how-would-you-troubleshoot-a-production-request-using-cloudwatch.md?raw";
import Q200 from "../../assets/docs/aws-interview-questions/aws-core-services/14-cloudwatch-and-observability/200-cloudwatch-vs-cloudtrail-vs-x-ray.md?raw";

const AWSCloudWatchQuestion = [
  {
    id: "186-how-would-you-implement-cwd-monitoring-using-cloudwatch",
    category: "CloudWatch & Observability",
    title: "How would you implement CWD monitoring using CloudWatch?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q186,
    code: "",
  },

  {
    id: "187-what-cloudwatch-metrics-would-you-monitor",
    category: "CloudWatch & Observability",
    title: "What CloudWatch metrics would you monitor?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q187,
    code: "",
  },

  {
    id: "188-what-logs-would-you-collect",
    category: "CloudWatch & Observability",
    title: "What logs would you collect?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q188,
    code: "",
  },

  {
    id: "189-how-would-you-trace-one-request-across-aws-services",
    category: "CloudWatch & Observability",
    title: "How would you trace one request across AWS services?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q189,
    code: "",
  },

  {
    id: "190-how-would-you-create-correlation-ids",
    category: "CloudWatch & Observability",
    title: "How would you create correlation IDs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q190,
    code: "",
  },

  {
    id: "191-how-would-you-monitor-lambda-errors",
    category: "CloudWatch & Observability",
    title: "How would you monitor Lambda errors?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q191,
    code: "",
  },

  {
    id: "192-how-would-you-monitor-ecs",
    category: "CloudWatch & Observability",
    title: "How would you monitor ECS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q192,
    code: "",
  },

  {
    id: "193-how-would-you-monitor-api-gateway",
    category: "CloudWatch & Observability",
    title: "How would you monitor API Gateway?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q193,
    code: "",
  },

  {
    id: "194-how-would-you-monitor-sqs",
    category: "CloudWatch & Observability",
    title: "How would you monitor SQS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q194,
    code: "",
  },

  {
    id: "195-how-would-you-monitor-bedrock",
    category: "CloudWatch & Observability",
    title: "How would you monitor Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q195,
    code: "",
  },

  {
    id: "196-how-would-you-create-cloudwatch-alarms",
    category: "CloudWatch & Observability",
    title: "How would you create CloudWatch alarms?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q196,
    code: "",
  },

  {
    id: "197-how-would-you-detect-latency-degradation",
    category: "CloudWatch & Observability",
    title: "How would you detect latency degradation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q197,
    code: "",
  },

  {
    id: "198-how-would-you-detect-a-cost-spike",
    category: "CloudWatch & Observability",
    title: "How would you detect a cost spike?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q198,
    code: "",
  },

  {
    id: "199-how-would-you-troubleshoot-a-production-request-using-cloudwatch",
    category: "CloudWatch & Observability",
    title: "How would you troubleshoot a production request using CloudWatch?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q199,
    code: "",
  },

  {
    id: "200-cloudwatch-vs-cloudtrail-vs-x-ray",
    category: "CloudWatch & Observability",
    title: "CloudWatch vs CloudTrail vs X-Ray?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q200,
    code: "",
  },

];

export default function AWSCloudWatchQuestionPage() {
  return (
    <CookbookApp
      data={AWSCloudWatchQuestion}
      title="CloudWatch & Observability Cookbook"
      subtitle="Metrics, logs, alarms, tracing and production troubleshooting"
      icon="📡"
      patternLabel="Questions"
    />
  );
}
