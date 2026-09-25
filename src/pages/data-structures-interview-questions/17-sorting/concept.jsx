import CookbookApp from "../../../components/CookbookApp";

import Q375 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/375-what-is-sorting.md?raw";
import Q376 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/376-why-do-we-sort-data.md?raw";
import Q377 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/377-stable-vs-unstable-sorting.md?raw";
import Q378 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/378-in-place-vs-out-of-place-sorting.md?raw";
import Q379 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/379-comparison-vs-non-comparison-sorting.md?raw";
import Q380 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/380-explain-bubble-sort.md?raw";
import Q381 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/381-explain-selection-sort.md?raw";
import Q382 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/382-explain-insertion-sort.md?raw";
import Q383 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/383-explain-merge-sort.md?raw";
import Q384 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/384-explain-quick-sort.md?raw";
import Q385 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/385-explain-heap-sort.md?raw";
import Q386 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/386-explain-counting-sort.md?raw";
import Q387 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/387-explain-radix-sort.md?raw";
import Q388 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/388-explain-bucket-sort.md?raw";
import Q389 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/389-merge-sort-vs-quick-sort.md?raw";
import Q390 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/390-quick-sort-worst-case.md?raw";
import Q391 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/391-why-is-merge-sort-useful-for-linked-lists.md?raw";
import Q392 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/392-which-sorting-algorithm-is-stable.md?raw";
import Q393 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/393-which-algorithms-are-in-place.md?raw";
import Q394 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/394-what-is-the-best-possible-comparison-based-sorting-complexit.md?raw";
import Q395 from "../../../assets/docs/data-structures-interview-questions/17-sorting/concept/395-pythons-sorting-algorithm-what-does-python-use.md?raw";

const DSSortingConceptQuestion = [
  {
    id: "375-what-is-sorting",
    category: "Sorting",
    title: "What is sorting?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q375,
    code: "",
  },

  {
    id: "376-why-do-we-sort-data",
    category: "Sorting",
    title: "Why do we sort data?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q376,
    code: "",
  },

  {
    id: "377-stable-vs-unstable-sorting",
    category: "Sorting",
    title: "Stable vs unstable sorting?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q377,
    code: "",
  },

  {
    id: "378-in-place-vs-out-of-place-sorting",
    category: "Sorting",
    title: "In-place vs out-of-place sorting?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q378,
    code: "",
  },

  {
    id: "379-comparison-vs-non-comparison-sorting",
    category: "Sorting",
    title: "Comparison vs non-comparison sorting?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q379,
    code: "",
  },

  {
    id: "380-explain-bubble-sort",
    category: "Sorting",
    title: "Explain Bubble Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q380,
    code: "",
  },

  {
    id: "381-explain-selection-sort",
    category: "Sorting",
    title: "Explain Selection Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q381,
    code: "",
  },

  {
    id: "382-explain-insertion-sort",
    category: "Sorting",
    title: "Explain Insertion Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q382,
    code: "",
  },

  {
    id: "383-explain-merge-sort",
    category: "Sorting",
    title: "Explain Merge Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q383,
    code: "",
  },

  {
    id: "384-explain-quick-sort",
    category: "Sorting",
    title: "Explain Quick Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q384,
    code: "",
  },

  {
    id: "385-explain-heap-sort",
    category: "Sorting",
    title: "Explain Heap Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q385,
    code: "",
  },

  {
    id: "386-explain-counting-sort",
    category: "Sorting",
    title: "Explain Counting Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q386,
    code: "",
  },

  {
    id: "387-explain-radix-sort",
    category: "Sorting",
    title: "Explain Radix Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q387,
    code: "",
  },

  {
    id: "388-explain-bucket-sort",
    category: "Sorting",
    title: "Explain Bucket Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q388,
    code: "",
  },

  {
    id: "389-merge-sort-vs-quick-sort",
    category: "Sorting",
    title: "Merge Sort vs Quick Sort.",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q389,
    code: "",
  },

  {
    id: "390-quick-sort-worst-case",
    category: "Sorting",
    title: "Quick Sort worst case?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q390,
    code: "",
  },

  {
    id: "391-why-is-merge-sort-useful-for-linked-lists",
    category: "Sorting",
    title: "Why is Merge Sort useful for linked lists?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q391,
    code: "",
  },

  {
    id: "392-which-sorting-algorithm-is-stable",
    category: "Sorting",
    title: "Which sorting algorithm is stable?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q392,
    code: "",
  },

  {
    id: "393-which-algorithms-are-in-place",
    category: "Sorting",
    title: "Which algorithms are in-place?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q393,
    code: "",
  },

  {
    id: "394-what-is-the-best-possible-comparison-based-sorting-complexit",
    category: "Sorting",
    title: "What is the best possible comparison-based sorting complexity?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q394,
    code: "",
  },

  {
    id: "395-pythons-sorting-algorithm-what-does-python-use",
    category: "Sorting",
    title: "Python's sorting algorithm what does Python use?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q395,
    code: "",
  },
];

export default function DSSortingConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSSortingConceptQuestion}
      title="Sorting Cookbook"
      subtitle="Fundamentals and theory questions on Sorting"
      icon="🔃"
      patternLabel="Questions"
    />
  );
}
