import CookbookApp from "../../components/CookbookApp";

import Q106 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/106-why-use-dynamodb-for-cwd-state.md?raw";
import Q107 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/107-what-cwd-data-would-you-store-in-dynamodb.md?raw";
import Q108 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/108-how-would-you-design-the-dynamodb-partition-key.md?raw";
import Q109 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/109-how-would-you-design-the-sort-key.md?raw";
import Q110 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/110-how-would-you-store-session-task-run-information.md?raw";
import Q111 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/111-how-would-you-prevent-hot-partitions.md?raw";
import Q112 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/112-how-does-dynamodb-scale.md?raw";
import Q113 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/113-on-demand-vs-provisioned-capacity.md?raw";
import Q114 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/114-how-do-you-implement-ttl.md?raw";
import Q115 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/115-how-do-you-handle-concurrent-updates.md?raw";
import Q116 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/116-what-are-conditional-writes.md?raw";
import Q117 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/117-how-would-you-implement-idempotency-using-dynamodb.md?raw";
import Q118 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/118-how-would-you-recover-from-a-failed-workflow-using-dynamodb.md?raw";
import Q119 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/119-dynamodb-vs-rds.md?raw";
import Q120 from "../../assets/docs/aws-interview-questions/aws-core-services/08-dynamodb/120-dynamodb-vs-elasticache.md?raw";

const AWSDynamoDbQuestion = [
  {
    id: "106-why-use-dynamodb-for-cwd-state",
    category: "DynamoDB",
    title: "Why use DynamoDB for CWD state?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q106,
    code: "",
  },

  {
    id: "107-what-cwd-data-would-you-store-in-dynamodb",
    category: "DynamoDB",
    title: "What CWD data would you store in DynamoDB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q107,
    code: "",
  },

  {
    id: "108-how-would-you-design-the-dynamodb-partition-key",
    category: "DynamoDB",
    title: "How would you design the DynamoDB partition key?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q108,
    code: "",
  },

  {
    id: "109-how-would-you-design-the-sort-key",
    category: "DynamoDB",
    title: "How would you design the sort key?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q109,
    code: "",
  },

  {
    id: "110-how-would-you-store-session-task-run-information",
    category: "DynamoDB",
    title: "How would you store session/task/run information?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q110,
    code: "",
  },

  {
    id: "111-how-would-you-prevent-hot-partitions",
    category: "DynamoDB",
    title: "How would you prevent hot partitions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q111,
    code: "",
  },

  {
    id: "112-how-does-dynamodb-scale",
    category: "DynamoDB",
    title: "How does DynamoDB scale?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q112,
    code: "",
  },

  {
    id: "113-on-demand-vs-provisioned-capacity",
    category: "DynamoDB",
    title: "On-demand vs provisioned capacity?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q113,
    code: "",
  },

  {
    id: "114-how-do-you-implement-ttl",
    category: "DynamoDB",
    title: "How do you implement TTL?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q114,
    code: "",
  },

  {
    id: "115-how-do-you-handle-concurrent-updates",
    category: "DynamoDB",
    title: "How do you handle concurrent updates?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q115,
    code: "",
  },

  {
    id: "116-what-are-conditional-writes",
    category: "DynamoDB",
    title: "What are conditional writes?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q116,
    code: "",
  },

  {
    id: "117-how-would-you-implement-idempotency-using-dynamodb",
    category: "DynamoDB",
    title: "How would you implement idempotency using DynamoDB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q117,
    code: "",
  },

  {
    id: "118-how-would-you-recover-from-a-failed-workflow-using-dynamodb",
    category: "DynamoDB",
    title: "How would you recover from a failed workflow using DynamoDB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q118,
    code: "",
  },

  {
    id: "119-dynamodb-vs-rds",
    category: "DynamoDB",
    title: "DynamoDB vs RDS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q119,
    code: "",
  },

  {
    id: "120-dynamodb-vs-elasticache",
    category: "DynamoDB",
    title: "DynamoDB vs ElastiCache?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q120,
    code: "",
  },

];

export default function AWSDynamoDbQuestionPage() {
  return (
    <CookbookApp
      data={AWSDynamoDbQuestion}
      title="DynamoDB Cookbook"
      subtitle="State modelling, keys, capacity, TTL and conditional writes"
      icon="🗃️"
      patternLabel="Questions"
    />
  );
}
