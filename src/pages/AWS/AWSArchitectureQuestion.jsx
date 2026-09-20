import CookbookApp from "../../components/CookbookApp";

import Q1 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/001-explain-the-complete-aws-architecture-for-cwd.md?raw";
import Q2 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/002-which-aws-services-did-you-use-in-cwd-and-why.md?raw";
import Q3 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/003-why-did-you-choose-amazon-bedrock.md?raw";
import Q4 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/004-why-did-you-choose-api-gateway.md?raw";
import Q5 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/005-why-did-you-choose-lambda.md?raw";
import Q6 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/006-why-would-you-choose-ecs-fargate-instead-of-lambda.md?raw";
import Q7 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/007-when-would-you-choose-eks.md?raw";
import Q8 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/008-where-would-you-use-step-functions.md?raw";
import Q9 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/009-where-would-you-use-sqs.md?raw";
import Q10 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/010-where-would-you-use-eventbridge.md?raw";
import Q11 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/011-where-would-you-use-dynamodb.md?raw";
import Q12 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/012-where-would-you-use-elasticache-redis.md?raw";
import Q13 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/013-where-would-you-use-opensearch-serverless.md?raw";
import Q14 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/014-where-would-you-use-s3.md?raw";
import Q15 from "../../assets/docs/aws-interview-questions/aws-core-services/01-aws-architecture/015-explain-the-complete-aws-request-flow-from-api-gateway-to-final-response.md?raw";

const AWSArchitectureQuestion = [
  {
    id: "001-explain-the-complete-aws-architecture-for-cwd",
    category: "AWS Architecture",
    title: "Explain the complete AWS architecture for CWD.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q1,
    code: "",
  },

  {
    id: "002-which-aws-services-did-you-use-in-cwd-and-why",
    category: "AWS Architecture",
    title: "Which AWS services did you use in CWD and why?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q2,
    code: "",
  },

  {
    id: "003-why-did-you-choose-amazon-bedrock",
    category: "AWS Architecture",
    title: "Why did you choose Amazon Bedrock?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q3,
    code: "",
  },

  {
    id: "004-why-did-you-choose-api-gateway",
    category: "AWS Architecture",
    title: "Why did you choose API Gateway?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q4,
    code: "",
  },

  {
    id: "005-why-did-you-choose-lambda",
    category: "AWS Architecture",
    title: "Why did you choose Lambda?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q5,
    code: "",
  },

  {
    id: "006-why-would-you-choose-ecs-fargate-instead-of-lambda",
    category: "AWS Architecture",
    title: "Why would you choose ECS/Fargate instead of Lambda?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q6,
    code: "",
  },

  {
    id: "007-when-would-you-choose-eks",
    category: "AWS Architecture",
    title: "When would you choose EKS?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q7,
    code: "",
  },

  {
    id: "008-where-would-you-use-step-functions",
    category: "AWS Architecture",
    title: "Where would you use Step Functions?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q8,
    code: "",
  },

  {
    id: "009-where-would-you-use-sqs",
    category: "AWS Architecture",
    title: "Where would you use SQS?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q9,
    code: "",
  },

  {
    id: "010-where-would-you-use-eventbridge",
    category: "AWS Architecture",
    title: "Where would you use EventBridge?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q10,
    code: "",
  },

  {
    id: "011-where-would-you-use-dynamodb",
    category: "AWS Architecture",
    title: "Where would you use DynamoDB?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q11,
    code: "",
  },

  {
    id: "012-where-would-you-use-elasticache-redis",
    category: "AWS Architecture",
    title: "Where would you use ElastiCache/Redis?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q12,
    code: "",
  },

  {
    id: "013-where-would-you-use-opensearch-serverless",
    category: "AWS Architecture",
    title: "Where would you use OpenSearch Serverless?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q13,
    code: "",
  },

  {
    id: "014-where-would-you-use-s3",
    category: "AWS Architecture",
    title: "Where would you use S3?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q14,
    code: "",
  },

  {
    id: "015-explain-the-complete-aws-request-flow-from-api-gateway-to-final-response",
    category: "AWS Architecture",
    title: "Explain the complete AWS request flow from API Gateway to final response.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q15,
    code: "",
  },

];

export default function AWSArchitectureQuestionPage() {
  return (
    <CookbookApp
      data={AWSArchitectureQuestion}
      title="AWS Architecture Cookbook"
      subtitle="End-to-end AWS architecture, service choices and request flow"
      icon="🏗️"
      patternLabel="Questions"
    />
  );
}
