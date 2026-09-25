import CookbookApp from "../../../components/CookbookApp";

import Q159 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/159-what-is-a-queue.md?raw";
import Q160 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/160-what-is-fifo.md?raw";
import Q161 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/161-queue-vs-stack.md?raw";
import Q162 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/162-what-are-enqueue-and-dequeue.md?raw";
import Q163 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/163-what-is-a-circular-queue.md?raw";
import Q164 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/164-what-is-a-deque.md?raw";
import Q165 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/165-why-is-collections-deque-preferred-for-queues-in-python.md?raw";
import Q166 from "../../../assets/docs/data-structures-interview-questions/07-queue/concept/166-what-is-a-priority-queue.md?raw";

const DSQueueConceptQuestion = [
  {
    id: "159-what-is-a-queue",
    category: "Queue",
    title: "What is a queue?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q159,
    code: "",
  },

  {
    id: "160-what-is-fifo",
    category: "Queue",
    title: "What is FIFO?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q160,
    code: "",
  },

  {
    id: "161-queue-vs-stack",
    category: "Queue",
    title: "Queue vs stack?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q161,
    code: "",
  },

  {
    id: "162-what-are-enqueue-and-dequeue",
    category: "Queue",
    title: "What are enqueue and dequeue?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q162,
    code: "",
  },

  {
    id: "163-what-is-a-circular-queue",
    category: "Queue",
    title: "What is a circular queue?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q163,
    code: "",
  },

  {
    id: "164-what-is-a-deque",
    category: "Queue",
    title: "What is a deque?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q164,
    code: "",
  },

  {
    id: "165-why-is-collections-deque-preferred-for-queues-in-python",
    category: "Queue",
    title: "Why is collections.deque preferred for queues in Python?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q165,
    code: "",
  },

  {
    id: "166-what-is-a-priority-queue",
    category: "Queue",
    title: "What is a priority queue?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q166,
    code: "",
  },
];

export default function DSQueueConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSQueueConceptQuestion}
      title="Queue Cookbook"
      subtitle="Fundamentals and theory questions on Queue"
      icon="🚶"
      patternLabel="Questions"
    />
  );
}
