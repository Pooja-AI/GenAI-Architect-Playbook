import CookbookApp from "../../../components/CookbookApp";

import Q101 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/101-what-is-a-linked-list.md?raw";
import Q102 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/102-array-vs-linked-list.md?raw";
import Q103 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/103-singly-vs-doubly-linked-list.md?raw";
import Q104 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/104-what-is-a-node.md?raw";
import Q105 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/105-what-is-the-head.md?raw";
import Q106 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/106-what-is-the-tail.md?raw";
import Q107 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/107-why-does-a-linked-list-require-extra-memory.md?raw";
import Q108 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/108-what-is-the-complexity-of-accessing-an-element.md?raw";
import Q109 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/109-what-is-the-complexity-of-insertion.md?raw";
import Q110 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/110-what-is-the-complexity-of-deletion.md?raw";
import Q111 from "../../../assets/docs/data-structures-interview-questions/05-linked-list/concept/111-when-would-you-choose-a-linked-list-over-an-array.md?raw";

const DSLinkedListConceptQuestion = [
  {
    id: "101-what-is-a-linked-list",
    category: "Linked List",
    title: "What is a linked list?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q101,
    code: "",
  },

  {
    id: "102-array-vs-linked-list",
    category: "Linked List",
    title: "Array vs linked list?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q102,
    code: "",
  },

  {
    id: "103-singly-vs-doubly-linked-list",
    category: "Linked List",
    title: "Singly vs doubly linked list?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q103,
    code: "",
  },

  {
    id: "104-what-is-a-node",
    category: "Linked List",
    title: "What is a node?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q104,
    code: "",
  },

  {
    id: "105-what-is-the-head",
    category: "Linked List",
    title: "What is the head?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q105,
    code: "",
  },

  {
    id: "106-what-is-the-tail",
    category: "Linked List",
    title: "What is the tail?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q106,
    code: "",
  },

  {
    id: "107-why-does-a-linked-list-require-extra-memory",
    category: "Linked List",
    title: "Why does a linked list require extra memory?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q107,
    code: "",
  },

  {
    id: "108-what-is-the-complexity-of-accessing-an-element",
    category: "Linked List",
    title: "What is the complexity of accessing an element?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q108,
    code: "",
  },

  {
    id: "109-what-is-the-complexity-of-insertion",
    category: "Linked List",
    title: "What is the complexity of insertion?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q109,
    code: "",
  },

  {
    id: "110-what-is-the-complexity-of-deletion",
    category: "Linked List",
    title: "What is the complexity of deletion?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q110,
    code: "",
  },

  {
    id: "111-when-would-you-choose-a-linked-list-over-an-array",
    category: "Linked List",
    title: "When would you choose a linked list over an array?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q111,
    code: "",
  },
];

export default function DSLinkedListConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSLinkedListConceptQuestion}
      title="Linked List Cookbook"
      subtitle="Fundamentals and theory questions on Linked List"
      icon="🔗"
      patternLabel="Questions"
    />
  );
}
