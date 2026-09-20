import CookbookApp from "../../components/CookbookApp";

import Q201 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/201-how-would-you-scale-cwd-horizontally.md?raw";
import Q202 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/202-how-would-you-design-cwd-for-10-000-concurrent-users.md?raw";
import Q203 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/203-how-would-you-handle-sudden-traffic-spikes.md?raw";
import Q204 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/204-how-would-you-scale-lambda.md?raw";
import Q205 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/205-how-would-you-scale-ecs.md?raw";
import Q206 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/206-how-would-you-scale-opensearch.md?raw";
import Q207 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/207-how-would-you-scale-dynamodb.md?raw";
import Q208 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/208-how-would-you-handle-bedrock-rate-limits.md?raw";
import Q209 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/209-where-would-you-introduce-sqs.md?raw";
import Q210 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/210-how-would-you-implement-backpressure.md?raw";
import Q211 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/211-how-would-you-eliminate-aws-single-points-of-failure.md?raw";
import Q212 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/212-how-would-you-design-multi-az-cwd.md?raw";
import Q213 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/213-how-would-you-design-multi-region-cwd.md?raw";
import Q214 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/214-what-is-your-disaster-recovery-strategy.md?raw";
import Q215 from "../../assets/docs/aws-interview-questions/aws-core-services/15-scalability-and-high-availability/215-what-rto-rpo-would-you-design-for-cwd.md?raw";

const AWSScalabilityHaQuestion = [
  {
    id: "201-how-would-you-scale-cwd-horizontally",
    category: "Scalability & High Availability",
    title: "How would you scale CWD horizontally?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q201,
    code: "",
  },

  {
    id: "202-how-would-you-design-cwd-for-10-000-concurrent-users",
    category: "Scalability & High Availability",
    title: "How would you design CWD for 10,000 concurrent users?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q202,
    code: "",
  },

  {
    id: "203-how-would-you-handle-sudden-traffic-spikes",
    category: "Scalability & High Availability",
    title: "How would you handle sudden traffic spikes?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q203,
    code: "",
  },

  {
    id: "204-how-would-you-scale-lambda",
    category: "Scalability & High Availability",
    title: "How would you scale Lambda?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q204,
    code: "",
  },

  {
    id: "205-how-would-you-scale-ecs",
    category: "Scalability & High Availability",
    title: "How would you scale ECS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q205,
    code: "",
  },

  {
    id: "206-how-would-you-scale-opensearch",
    category: "Scalability & High Availability",
    title: "How would you scale OpenSearch?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q206,
    code: "",
  },

  {
    id: "207-how-would-you-scale-dynamodb",
    category: "Scalability & High Availability",
    title: "How would you scale DynamoDB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q207,
    code: "",
  },

  {
    id: "208-how-would-you-handle-bedrock-rate-limits",
    category: "Scalability & High Availability",
    title: "How would you handle Bedrock rate limits?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q208,
    code: "",
  },

  {
    id: "209-where-would-you-introduce-sqs",
    category: "Scalability & High Availability",
    title: "Where would you introduce SQS?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q209,
    code: "",
  },

  {
    id: "210-how-would-you-implement-backpressure",
    category: "Scalability & High Availability",
    title: "How would you implement backpressure?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q210,
    code: "",
  },

  {
    id: "211-how-would-you-eliminate-aws-single-points-of-failure",
    category: "Scalability & High Availability",
    title: "How would you eliminate AWS single points of failure?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q211,
    code: "",
  },

  {
    id: "212-how-would-you-design-multi-az-cwd",
    category: "Scalability & High Availability",
    title: "How would you design multi-AZ CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q212,
    code: "",
  },

  {
    id: "213-how-would-you-design-multi-region-cwd",
    category: "Scalability & High Availability",
    title: "How would you design multi-region CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q213,
    code: "",
  },

  {
    id: "214-what-is-your-disaster-recovery-strategy",
    category: "Scalability & High Availability",
    title: "What is your disaster-recovery strategy?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q214,
    code: "",
  },

  {
    id: "215-what-rto-rpo-would-you-design-for-cwd",
    category: "Scalability & High Availability",
    title: "What RTO/RPO would you design for CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q215,
    code: "",
  },

];

export default function AWSScalabilityHaQuestionPage() {
  return (
    <CookbookApp
      data={AWSScalabilityHaQuestion}
      title="Scalability & High Availability Cookbook"
      subtitle="Horizontal scaling, multi-AZ, multi-region and disaster recovery"
      icon="📈"
      patternLabel="Questions"
    />
  );
}
