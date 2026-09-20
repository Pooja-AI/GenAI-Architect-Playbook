import CookbookApp from "../../components/CookbookApp";

import Q162 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/162-why-azure-service-bus-in-cwd.md?raw";
import Q163 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/163-queue-vs-topic.md?raw";
import Q164 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/164-when-would-you-use-service-bus-queues.md?raw";
import Q165 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/165-when-would-you-use-topics-subscriptions.md?raw";
import Q166 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/166-how-would-you-asynchronously-execute-workers.md?raw";
import Q167 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/167-how-do-you-handle-message-failures.md?raw";
import Q168 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/168-what-is-a-dead-letter-queue.md?raw";
import Q169 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/169-how-do-you-retry-failed-messages.md?raw";
import Q170 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/170-how-do-you-prevent-duplicate-processing.md?raw";
import Q171 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/171-how-do-you-implement-idempotency.md?raw";
import Q172 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/172-how-do-you-handle-message-ordering.md?raw";
import Q173 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/173-how-do-you-monitor-queue-depth.md?raw";
import Q174 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/174-how-does-service-bus-improve-scalability.md?raw";
import Q175 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/175-service-bus-vs-event-grid.md?raw";
import Q176 from "../../assets/docs/azure-interview-questions/11-azure-service-bus/176-service-bus-vs-event-hubs.md?raw";

const AzureServiceBusQuestion = [
  {
    id: "162-why-azure-service-bus-in-cwd",
    category: "Azure Service Bus",
    title: "Why Azure Service Bus in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q162,
    code: "",
  },

  {
    id: "163-queue-vs-topic",
    category: "Azure Service Bus",
    title: "Queue vs Topic?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q163,
    code: "",
  },

  {
    id: "164-when-would-you-use-service-bus-queues",
    category: "Azure Service Bus",
    title: "When would you use Service Bus queues?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q164,
    code: "",
  },

  {
    id: "165-when-would-you-use-topics-subscriptions",
    category: "Azure Service Bus",
    title: "When would you use topics/subscriptions?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q165,
    code: "",
  },

  {
    id: "166-how-would-you-asynchronously-execute-workers",
    category: "Azure Service Bus",
    title: "How would you asynchronously execute Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q166,
    code: "",
  },

  {
    id: "167-how-do-you-handle-message-failures",
    category: "Azure Service Bus",
    title: "How do you handle message failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q167,
    code: "",
  },

  {
    id: "168-what-is-a-dead-letter-queue",
    category: "Azure Service Bus",
    title: "What is a dead-letter queue?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q168,
    code: "",
  },

  {
    id: "169-how-do-you-retry-failed-messages",
    category: "Azure Service Bus",
    title: "How do you retry failed messages?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q169,
    code: "",
  },

  {
    id: "170-how-do-you-prevent-duplicate-processing",
    category: "Azure Service Bus",
    title: "How do you prevent duplicate processing?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q170,
    code: "",
  },

  {
    id: "171-how-do-you-implement-idempotency",
    category: "Azure Service Bus",
    title: "How do you implement idempotency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q171,
    code: "",
  },

  {
    id: "172-how-do-you-handle-message-ordering",
    category: "Azure Service Bus",
    title: "How do you handle message ordering?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q172,
    code: "",
  },

  {
    id: "173-how-do-you-monitor-queue-depth",
    category: "Azure Service Bus",
    title: "How do you monitor queue depth?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q173,
    code: "",
  },

  {
    id: "174-how-does-service-bus-improve-scalability",
    category: "Azure Service Bus",
    title: "How does Service Bus improve scalability?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q174,
    code: "",
  },

  {
    id: "175-service-bus-vs-event-grid",
    category: "Azure Service Bus",
    title: "Service Bus vs Event Grid?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q175,
    code: "",
  },

  {
    id: "176-service-bus-vs-event-hubs",
    category: "Azure Service Bus",
    title: "Service Bus vs Event Hubs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q176,
    code: "",
  },

];

export default function AzureServiceBusQuestionPage() {
  return (
    <CookbookApp
      data={AzureServiceBusQuestion}
      title="Azure Service Bus Cookbook"
      subtitle="Queues, topics, DLQs, duplicates, ordering and scalability"
      icon="📬"
      patternLabel="Questions"
    />
  );
}
