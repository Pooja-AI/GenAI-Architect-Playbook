import CookbookApp from "../../components/CookbookApp";

import Q31 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/031-why-use-api-gateway-for-cwd.md?raw";
import Q32 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/032-rest-api-vs-http-api-which-would-you-choose.md?raw";
import Q33 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/033-how-do-you-authenticate-api-gateway-requests.md?raw";
import Q34 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/034-how-do-you-authorize-users.md?raw";
import Q35 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/035-how-do-you-implement-throttling.md?raw";
import Q36 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/036-how-do-you-protect-apis-from-abuse.md?raw";
import Q37 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/037-how-do-you-handle-api-gateway-timeout.md?raw";
import Q38 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/038-how-do-you-configure-request-validation.md?raw";
import Q39 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/039-how-do-you-version-cwd-apis.md?raw";
import Q40 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/040-how-do-you-implement-api-gateway-logging.md?raw";
import Q41 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/041-how-do-you-monitor-api-gateway.md?raw";
import Q42 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/042-how-do-you-handle-high-request-volume.md?raw";
import Q43 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/043-how-would-you-integrate-api-gateway-with-lambda.md?raw";
import Q44 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/044-how-would-you-integrate-api-gateway-with-ecs.md?raw";
import Q45 from "../../assets/docs/aws-interview-questions/aws-core-services/03-api-gateway/045-how-do-you-implement-waf-with-api-gateway.md?raw";

const AWSApiGatewayQuestion = [
  {
    id: "031-why-use-api-gateway-for-cwd",
    category: "API Gateway",
    title: "Why use API Gateway for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q31,
    code: "",
  },

  {
    id: "032-rest-api-vs-http-api-which-would-you-choose",
    category: "API Gateway",
    title: "REST API vs HTTP API—which would you choose?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q32,
    code: "",
  },

  {
    id: "033-how-do-you-authenticate-api-gateway-requests",
    category: "API Gateway",
    title: "How do you authenticate API Gateway requests?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q33,
    code: "",
  },

  {
    id: "034-how-do-you-authorize-users",
    category: "API Gateway",
    title: "How do you authorize users?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q34,
    code: "",
  },

  {
    id: "035-how-do-you-implement-throttling",
    category: "API Gateway",
    title: "How do you implement throttling?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q35,
    code: "",
  },

  {
    id: "036-how-do-you-protect-apis-from-abuse",
    category: "API Gateway",
    title: "How do you protect APIs from abuse?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q36,
    code: "",
  },

  {
    id: "037-how-do-you-handle-api-gateway-timeout",
    category: "API Gateway",
    title: "How do you handle API Gateway timeout?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q37,
    code: "",
  },

  {
    id: "038-how-do-you-configure-request-validation",
    category: "API Gateway",
    title: "How do you configure request validation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q38,
    code: "",
  },

  {
    id: "039-how-do-you-version-cwd-apis",
    category: "API Gateway",
    title: "How do you version CWD APIs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q39,
    code: "",
  },

  {
    id: "040-how-do-you-implement-api-gateway-logging",
    category: "API Gateway",
    title: "How do you implement API Gateway logging?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q40,
    code: "",
  },

  {
    id: "041-how-do-you-monitor-api-gateway",
    category: "API Gateway",
    title: "How do you monitor API Gateway?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q41,
    code: "",
  },

  {
    id: "042-how-do-you-handle-high-request-volume",
    category: "API Gateway",
    title: "How do you handle high request volume?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q42,
    code: "",
  },

  {
    id: "043-how-would-you-integrate-api-gateway-with-lambda",
    category: "API Gateway",
    title: "How would you integrate API Gateway with Lambda?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q43,
    code: "",
  },

  {
    id: "044-how-would-you-integrate-api-gateway-with-ecs",
    category: "API Gateway",
    title: "How would you integrate API Gateway with ECS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q44,
    code: "",
  },

  {
    id: "045-how-do-you-implement-waf-with-api-gateway",
    category: "API Gateway",
    title: "How do you implement WAF with API Gateway?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q45,
    code: "",
  },

];

export default function AWSApiGatewayQuestionPage() {
  return (
    <CookbookApp
      data={AWSApiGatewayQuestion}
      title="API Gateway Cookbook"
      subtitle="Authentication, throttling, validation, WAF and monitoring"
      icon="🚪"
      patternLabel="Questions"
    />
  );
}
