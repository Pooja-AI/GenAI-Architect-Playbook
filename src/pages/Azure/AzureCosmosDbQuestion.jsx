import CookbookApp from "../../components/CookbookApp";

import Q177 from "../../assets/docs/azure-interview-questions/12-cosmos-db/177-why-cosmos-db-for-cwd.md?raw";
import Q178 from "../../assets/docs/azure-interview-questions/12-cosmos-db/178-what-cwd-data-would-you-store-in-cosmos-db.md?raw";
import Q179 from "../../assets/docs/azure-interview-questions/12-cosmos-db/179-how-would-you-store-session-task-run-turn-step-state.md?raw";
import Q180 from "../../assets/docs/azure-interview-questions/12-cosmos-db/180-how-would-you-design-the-partition-key.md?raw";
import Q181 from "../../assets/docs/azure-interview-questions/12-cosmos-db/181-how-would-you-avoid-hot-partitions.md?raw";
import Q182 from "../../assets/docs/azure-interview-questions/12-cosmos-db/182-how-does-cosmos-db-scale.md?raw";
import Q183 from "../../assets/docs/azure-interview-questions/12-cosmos-db/183-how-would-you-implement-optimistic-concurrency.md?raw";
import Q184 from "../../assets/docs/azure-interview-questions/12-cosmos-db/184-how-would-you-implement-ttl.md?raw";
import Q185 from "../../assets/docs/azure-interview-questions/12-cosmos-db/185-how-would-you-handle-workflow-state.md?raw";
import Q186 from "../../assets/docs/azure-interview-questions/12-cosmos-db/186-how-would-you-recover-a-failed-workflow.md?raw";
import Q187 from "../../assets/docs/azure-interview-questions/12-cosmos-db/187-cosmos-db-vs-azure-sql.md?raw";
import Q188 from "../../assets/docs/azure-interview-questions/12-cosmos-db/188-cosmos-db-vs-azure-cache-for-redis.md?raw";

const AzureCosmosDbQuestion = [
  {
    id: "177-why-cosmos-db-for-cwd",
    category: "Cosmos DB",
    title: "Why Cosmos DB for CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q177,
    code: "",
  },

  {
    id: "178-what-cwd-data-would-you-store-in-cosmos-db",
    category: "Cosmos DB",
    title: "What CWD data would you store in Cosmos DB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q178,
    code: "",
  },

  {
    id: "179-how-would-you-store-session-task-run-turn-step-state",
    category: "Cosmos DB",
    title: "How would you store session/task/run/turn/step state?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q179,
    code: "",
  },

  {
    id: "180-how-would-you-design-the-partition-key",
    category: "Cosmos DB",
    title: "How would you design the partition key?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q180,
    code: "",
  },

  {
    id: "181-how-would-you-avoid-hot-partitions",
    category: "Cosmos DB",
    title: "How would you avoid hot partitions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q181,
    code: "",
  },

  {
    id: "182-how-does-cosmos-db-scale",
    category: "Cosmos DB",
    title: "How does Cosmos DB scale?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q182,
    code: "",
  },

  {
    id: "183-how-would-you-implement-optimistic-concurrency",
    category: "Cosmos DB",
    title: "How would you implement optimistic concurrency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q183,
    code: "",
  },

  {
    id: "184-how-would-you-implement-ttl",
    category: "Cosmos DB",
    title: "How would you implement TTL?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q184,
    code: "",
  },

  {
    id: "185-how-would-you-handle-workflow-state",
    category: "Cosmos DB",
    title: "How would you handle workflow state?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q185,
    code: "",
  },

  {
    id: "186-how-would-you-recover-a-failed-workflow",
    category: "Cosmos DB",
    title: "How would you recover a failed workflow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q186,
    code: "",
  },

  {
    id: "187-cosmos-db-vs-azure-sql",
    category: "Cosmos DB",
    title: "Cosmos DB vs Azure SQL?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q187,
    code: "",
  },

  {
    id: "188-cosmos-db-vs-azure-cache-for-redis",
    category: "Cosmos DB",
    title: "Cosmos DB vs Azure Cache for Redis?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q188,
    code: "",
  },

];

export default function AzureCosmosDbQuestionPage() {
  return (
    <CookbookApp
      data={AzureCosmosDbQuestion}
      title="Cosmos DB Cookbook"
      subtitle="Workflow state, partition keys, concurrency, TTL and recovery"
      icon="🗃️"
      patternLabel="Questions"
    />
  );
}
