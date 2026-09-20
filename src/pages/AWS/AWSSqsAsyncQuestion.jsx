import CookbookApp from "../../components/CookbookApp";

import Q76 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/076-where-would-you-use-sqs-in-cwd.md?raw";
import Q77 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/077-why-sqs-instead-of-synchronous-api-calls.md?raw";
import Q78 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/078-standard-queue-vs-fifo-queue.md?raw";
import Q79 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/079-how-would-you-process-worker-jobs-asynchronously.md?raw";
import Q80 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/080-how-do-you-handle-message-duplication.md?raw";
import Q81 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/081-how-do-you-implement-idempotency.md?raw";
import Q82 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/082-what-is-a-visibility-timeout.md?raw";
import Q83 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/083-how-do-you-configure-visibility-timeout.md?raw";
import Q84 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/084-what-happens-when-message-processing-fails.md?raw";
import Q85 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/085-what-is-a-dead-letter-queue.md?raw";
import Q86 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/086-how-would-you-replay-failed-cwd-requests.md?raw";
import Q87 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/087-how-do-you-monitor-queue-depth.md?raw";
import Q88 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/088-what-is-backpressure.md?raw";
import Q89 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/089-how-does-sqs-help-cwd-scalability.md?raw";
import Q90 from "../../assets/docs/aws-interview-questions/aws-core-services/06-sqs-and-asynchronous-processing/090-how-would-you-handle-a-sudden-100x-traffic-spike.md?raw";

const AWSSqsAsyncQuestion = [
  {
    id: "076-where-would-you-use-sqs-in-cwd",
    category: "SQS & Asynchronous Processing",
    title: "Where would you use SQS in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q76,
    code: "",
  },

  {
    id: "077-why-sqs-instead-of-synchronous-api-calls",
    category: "SQS & Asynchronous Processing",
    title: "Why SQS instead of synchronous API calls?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q77,
    code: "",
  },

  {
    id: "078-standard-queue-vs-fifo-queue",
    category: "SQS & Asynchronous Processing",
    title: "Standard queue vs FIFO queue?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q78,
    code: "",
  },

  {
    id: "079-how-would-you-process-worker-jobs-asynchronously",
    category: "SQS & Asynchronous Processing",
    title: "How would you process Worker jobs asynchronously?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q79,
    code: "",
  },

  {
    id: "080-how-do-you-handle-message-duplication",
    category: "SQS & Asynchronous Processing",
    title: "How do you handle message duplication?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q80,
    code: "",
  },

  {
    id: "081-how-do-you-implement-idempotency",
    category: "SQS & Asynchronous Processing",
    title: "How do you implement idempotency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q81,
    code: "",
  },

  {
    id: "082-what-is-a-visibility-timeout",
    category: "SQS & Asynchronous Processing",
    title: "What is a visibility timeout?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q82,
    code: "",
  },

  {
    id: "083-how-do-you-configure-visibility-timeout",
    category: "SQS & Asynchronous Processing",
    title: "How do you configure visibility timeout?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q83,
    code: "",
  },

  {
    id: "084-what-happens-when-message-processing-fails",
    category: "SQS & Asynchronous Processing",
    title: "What happens when message processing fails?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q84,
    code: "",
  },

  {
    id: "085-what-is-a-dead-letter-queue",
    category: "SQS & Asynchronous Processing",
    title: "What is a Dead Letter Queue?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q85,
    code: "",
  },

  {
    id: "086-how-would-you-replay-failed-cwd-requests",
    category: "SQS & Asynchronous Processing",
    title: "How would you replay failed CWD requests?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q86,
    code: "",
  },

  {
    id: "087-how-do-you-monitor-queue-depth",
    category: "SQS & Asynchronous Processing",
    title: "How do you monitor queue depth?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q87,
    code: "",
  },

  {
    id: "088-what-is-backpressure",
    category: "SQS & Asynchronous Processing",
    title: "What is backpressure?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q88,
    code: "",
  },

  {
    id: "089-how-does-sqs-help-cwd-scalability",
    category: "SQS & Asynchronous Processing",
    title: "How does SQS help CWD scalability?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q89,
    code: "",
  },

  {
    id: "090-how-would-you-handle-a-sudden-100x-traffic-spike",
    category: "SQS & Asynchronous Processing",
    title: "How would you handle a sudden 100× traffic spike?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q90,
    code: "",
  },

];

export default function AWSSqsAsyncQuestionPage() {
  return (
    <CookbookApp
      data={AWSSqsAsyncQuestion}
      title="SQS & Asynchronous Processing Cookbook"
      subtitle="Queues, DLQs, visibility timeouts, idempotency and backpressure"
      icon="📬"
      patternLabel="Questions"
    />
  );
}
