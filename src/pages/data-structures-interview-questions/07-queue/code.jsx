import CookbookApp from "../../../components/CookbookApp";

import Q167 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/167-implement-a-queue-using-a-list.md?raw";
import Q168 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/168-implement-a-queue-using-deque.md?raw";
import Q169 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/169-implement-a-queue-using-a-linked-list.md?raw";
import Q170 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/170-implement-a-queue-using-two-stacks.md?raw";
import Q171 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/171-implement-a-stack-using-two-queues.md?raw";
import Q172 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/172-implement-a-circular-queue.md?raw";
import Q173 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/173-generate-binary-numbers-using-a-queue.md?raw";
import Q174 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/174-first-non-repeating-character-in-a-stream.md?raw";
import Q175 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/175-sliding-window-maximum.md?raw";
import Q176 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/176-bfs-using-a-queue.md?raw";
import Q177 from "../../../assets/docs/data-structures-interview-questions/07-queue/code/177-task-scheduling-using-a-queue.md?raw";

const DSQueueCodeQuestion = [
  {
    id: "167-implement-a-queue-using-a-list",
    category: "Queue",
    title: "Implement a queue using a list.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q167,
  },

  {
    id: "168-implement-a-queue-using-deque",
    category: "Queue",
    title: "Implement a queue using deque.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q168,
  },

  {
    id: "169-implement-a-queue-using-a-linked-list",
    category: "Queue",
    title: "Implement a queue using a linked list.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q169,
  },

  {
    id: "170-implement-a-queue-using-two-stacks",
    category: "Queue",
    title: "Implement a queue using two stacks.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q170,
  },

  {
    id: "171-implement-a-stack-using-two-queues",
    category: "Queue",
    title: "Implement a stack using two queues.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q171,
  },

  {
    id: "172-implement-a-circular-queue",
    category: "Queue",
    title: "Implement a circular queue.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q172,
  },

  {
    id: "173-generate-binary-numbers-using-a-queue",
    category: "Queue",
    title: "Generate binary numbers using a queue.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q173,
  },

  {
    id: "174-first-non-repeating-character-in-a-stream",
    category: "Queue",
    title: "First non-repeating character in a stream.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q174,
  },

  {
    id: "175-sliding-window-maximum",
    category: "Queue",
    title: "Sliding window maximum.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q175,
  },

  {
    id: "176-bfs-using-a-queue",
    category: "Queue",
    title: "BFS using a queue.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q176,
  },

  {
    id: "177-task-scheduling-using-a-queue",
    category: "Queue",
    title: "Task scheduling using a queue.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q177,
  },
];

export default function DSQueueCodeQuestionPage() {
  return (
    <CookbookApp
      data={DSQueueCodeQuestion}
      title="Queue Cookbook"
      subtitle="Coding practice problems on Queue"
      icon="🚶"
      patternLabel="Questions"
    />
  );
}
