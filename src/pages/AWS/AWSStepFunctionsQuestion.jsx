import CookbookApp from "../../components/CookbookApp";

import Q91 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/091-why-use-aws-step-functions-in-cwd.md?raw";
import Q92 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/092-step-functions-standard-vs-express.md?raw";
import Q93 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/093-how-would-you-model-worker-dependencies-using-step-functions.md?raw";
import Q94 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/094-how-would-you-execute-workers-in-parallel.md?raw";
import Q95 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/095-how-would-you-handle-worker-failure.md?raw";
import Q96 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/096-how-would-you-implement-retry-and-catch.md?raw";
import Q97 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/097-how-would-you-implement-timeout.md?raw";
import Q98 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/098-how-would-you-resume-a-workflow.md?raw";
import Q99 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/099-how-would-you-handle-long-running-workflows.md?raw";
import Q100 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/100-step-functions-vs-sqs.md?raw";
import Q101 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/101-step-functions-vs-lambda-orchestration.md?raw";
import Q102 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/102-step-functions-vs-application-level-orchestration.md?raw";
import Q103 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/103-how-would-you-visualize-workflow-execution.md?raw";
import Q104 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/104-how-would-you-monitor-step-functions.md?raw";
import Q105 from "../../assets/docs/aws-interview-questions/aws-core-services/07-step-functions/105-how-would-you-control-step-functions-cost.md?raw";

const AWSStepFunctionsQuestion = [
  {
    id: "091-why-use-aws-step-functions-in-cwd",
    category: "Step Functions",
    title: "Why use AWS Step Functions in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q91,
    code: "",
  },

  {
    id: "092-step-functions-standard-vs-express",
    category: "Step Functions",
    title: "Step Functions Standard vs Express?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q92,
    code: "",
  },

  {
    id: "093-how-would-you-model-worker-dependencies-using-step-functions",
    category: "Step Functions",
    title: "How would you model Worker dependencies using Step Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q93,
    code: "",
  },

  {
    id: "094-how-would-you-execute-workers-in-parallel",
    category: "Step Functions",
    title: "How would you execute Workers in parallel?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q94,
    code: "",
  },

  {
    id: "095-how-would-you-handle-worker-failure",
    category: "Step Functions",
    title: "How would you handle Worker failure?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q95,
    code: "",
  },

  {
    id: "096-how-would-you-implement-retry-and-catch",
    category: "Step Functions",
    title: "How would you implement retry and catch?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q96,
    code: "",
  },

  {
    id: "097-how-would-you-implement-timeout",
    category: "Step Functions",
    title: "How would you implement timeout?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q97,
    code: "",
  },

  {
    id: "098-how-would-you-resume-a-workflow",
    category: "Step Functions",
    title: "How would you resume a workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q98,
    code: "",
  },

  {
    id: "099-how-would-you-handle-long-running-workflows",
    category: "Step Functions",
    title: "How would you handle long-running workflows?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q99,
    code: "",
  },

  {
    id: "100-step-functions-vs-sqs",
    category: "Step Functions",
    title: "Step Functions vs SQS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q100,
    code: "",
  },

  {
    id: "101-step-functions-vs-lambda-orchestration",
    category: "Step Functions",
    title: "Step Functions vs Lambda orchestration?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q101,
    code: "",
  },

  {
    id: "102-step-functions-vs-application-level-orchestration",
    category: "Step Functions",
    title: "Step Functions vs application-level orchestration?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q102,
    code: "",
  },

  {
    id: "103-how-would-you-visualize-workflow-execution",
    category: "Step Functions",
    title: "How would you visualize workflow execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q103,
    code: "",
  },

  {
    id: "104-how-would-you-monitor-step-functions",
    category: "Step Functions",
    title: "How would you monitor Step Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q104,
    code: "",
  },

  {
    id: "105-how-would-you-control-step-functions-cost",
    category: "Step Functions",
    title: "How would you control Step Functions cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q105,
    code: "",
  },

];

export default function AWSStepFunctionsQuestionPage() {
  return (
    <CookbookApp
      data={AWSStepFunctionsQuestion}
      title="Step Functions Cookbook"
      subtitle="Workflow orchestration, retries, parallelism and cost"
      icon="🔀"
      patternLabel="Questions"
    />
  );
}
