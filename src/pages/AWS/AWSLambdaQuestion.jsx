import CookbookApp from "../../components/CookbookApp";

import Q46 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/046-why-use-lambda-in-cwd.md?raw";
import Q47 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/047-which-cwd-components-would-you-deploy-as-lambda.md?raw";
import Q48 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/048-lambda-vs-ecs-fargate.md?raw";
import Q49 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/049-what-is-lambda-cold-start.md?raw";
import Q50 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/050-how-would-you-reduce-lambda-cold-start-latency.md?raw";
import Q51 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/051-how-does-lambda-concurrency-work.md?raw";
import Q52 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/052-reserved-vs-provisioned-concurrency.md?raw";
import Q53 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/053-how-would-you-prevent-lambda-concurrency-exhaustion.md?raw";
import Q54 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/054-how-do-you-handle-lambda-failures.md?raw";
import Q55 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/055-how-do-you-retry-lambda-execution.md?raw";
import Q56 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/056-how-do-you-make-lambda-execution-idempotent.md?raw";
import Q57 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/057-how-do-you-monitor-lambda.md?raw";
import Q58 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/058-how-do-you-manage-lambda-environment-variables.md?raw";
import Q59 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/059-how-do-you-securely-access-secrets-from-lambda.md?raw";
import Q60 from "../../assets/docs/aws-interview-questions/aws-core-services/04-lambda/060-what-are-lambdas-limitations-for-agentic-workloads.md?raw";

const AWSLambdaQuestion = [
  {
    id: "046-why-use-lambda-in-cwd",
    category: "Lambda",
    title: "Why use Lambda in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q46,
    code: "",
  },

  {
    id: "047-which-cwd-components-would-you-deploy-as-lambda",
    category: "Lambda",
    title: "Which CWD components would you deploy as Lambda?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q47,
    code: "",
  },

  {
    id: "048-lambda-vs-ecs-fargate",
    category: "Lambda",
    title: "Lambda vs ECS/Fargate?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q48,
    code: "",
  },

  {
    id: "049-what-is-lambda-cold-start",
    category: "Lambda",
    title: "What is Lambda cold start?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q49,
    code: "",
  },

  {
    id: "050-how-would-you-reduce-lambda-cold-start-latency",
    category: "Lambda",
    title: "How would you reduce Lambda cold-start latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q50,
    code: "",
  },

  {
    id: "051-how-does-lambda-concurrency-work",
    category: "Lambda",
    title: "How does Lambda concurrency work?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q51,
    code: "",
  },

  {
    id: "052-reserved-vs-provisioned-concurrency",
    category: "Lambda",
    title: "Reserved vs provisioned concurrency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q52,
    code: "",
  },

  {
    id: "053-how-would-you-prevent-lambda-concurrency-exhaustion",
    category: "Lambda",
    title: "How would you prevent Lambda concurrency exhaustion?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q53,
    code: "",
  },

  {
    id: "054-how-do-you-handle-lambda-failures",
    category: "Lambda",
    title: "How do you handle Lambda failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q54,
    code: "",
  },

  {
    id: "055-how-do-you-retry-lambda-execution",
    category: "Lambda",
    title: "How do you retry Lambda execution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q55,
    code: "",
  },

  {
    id: "056-how-do-you-make-lambda-execution-idempotent",
    category: "Lambda",
    title: "How do you make Lambda execution idempotent?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q56,
    code: "",
  },

  {
    id: "057-how-do-you-monitor-lambda",
    category: "Lambda",
    title: "How do you monitor Lambda?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q57,
    code: "",
  },

  {
    id: "058-how-do-you-manage-lambda-environment-variables",
    category: "Lambda",
    title: "How do you manage Lambda environment variables?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q58,
    code: "",
  },

  {
    id: "059-how-do-you-securely-access-secrets-from-lambda",
    category: "Lambda",
    title: "How do you securely access secrets from Lambda?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q59,
    code: "",
  },

  {
    id: "060-what-are-lambdas-limitations-for-agentic-workloads",
    category: "Lambda",
    title: "What are Lambda's limitations for agentic workloads?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q60,
    code: "",
  },

];

export default function AWSLambdaQuestionPage() {
  return (
    <CookbookApp
      data={AWSLambdaQuestion}
      title="AWS Lambda Cookbook"
      subtitle="Cold starts, concurrency, idempotency and agentic limits"
      icon="λ"
      patternLabel="Questions"
    />
  );
}
