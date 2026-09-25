import CookbookApp from "../../../components/CookbookApp";

import Q1 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/001-what-is-an-array.md?raw";
import Q2 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/002-what-is-the-difference-between-an-array-and-a-python-list.md?raw";
import Q3 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/003-how-are-arrays-stored-in-memory.md?raw";
import Q4 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/004-what-is-random-access.md?raw";
import Q5 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/005-what-is-the-time-complexity-of-accessing-arr-i.md?raw";
import Q6 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/006-what-is-the-time-complexity-of-searching-an-unsorted-array.md?raw";
import Q7 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/007-what-is-the-time-complexity-of-inserting-at-the-beginning.md?raw";
import Q8 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/008-what-is-the-time-complexity-of-inserting-at-the-end.md?raw";
import Q9 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/009-what-is-the-difference-between-static-and-dynamic-arrays.md?raw";
import Q10 from "../../../assets/docs/data-structures-interview-questions/01-arrays-lists/concept/010-what-are-the-advantages-and-disadvantages-of-arrays.md?raw";

const DSArraysListsConceptQuestion = [
  {
    id: "001-what-is-an-array",
    category: "Arrays / Lists",
    title: "What is an array?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q1,
    code: "",
  },

  {
    id: "002-what-is-the-difference-between-an-array-and-a-python-list",
    category: "Arrays / Lists",
    title: "What is the difference between an array and a Python list?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q2,
    code: "",
  },

  {
    id: "003-how-are-arrays-stored-in-memory",
    category: "Arrays / Lists",
    title: "How are arrays stored in memory?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q3,
    code: "",
  },

  {
    id: "004-what-is-random-access",
    category: "Arrays / Lists",
    title: "What is random access?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q4,
    code: "",
  },

  {
    id: "005-what-is-the-time-complexity-of-accessing-arr-i",
    category: "Arrays / Lists",
    title: "What is the time complexity of accessing `arr[i]`?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q5,
    code: "",
  },

  {
    id: "006-what-is-the-time-complexity-of-searching-an-unsorted-array",
    category: "Arrays / Lists",
    title: "What is the time complexity of searching an unsorted array?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q6,
    code: "",
  },

  {
    id: "007-what-is-the-time-complexity-of-inserting-at-the-beginning",
    category: "Arrays / Lists",
    title: "What is the time complexity of inserting at the beginning?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q7,
    code: "",
  },

  {
    id: "008-what-is-the-time-complexity-of-inserting-at-the-end",
    category: "Arrays / Lists",
    title: "What is the time complexity of inserting at the end?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q8,
    code: "",
  },

  {
    id: "009-what-is-the-difference-between-static-and-dynamic-arrays",
    category: "Arrays / Lists",
    title: "What is the difference between static and dynamic arrays?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q9,
    code: "",
  },

  {
    id: "010-what-are-the-advantages-and-disadvantages-of-arrays",
    category: "Arrays / Lists",
    title: "What are the advantages and disadvantages of arrays?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q10,
    code: "",
  },
];

export default function DSArraysListsConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSArraysListsConceptQuestion}
      title="Arrays / Lists Cookbook"
      subtitle="Fundamentals and theory questions on Arrays / Lists"
      icon="📊"
      patternLabel="Questions"
    />
  );
}
