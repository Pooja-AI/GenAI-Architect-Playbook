import CookbookApp from "../../../components/CookbookApp";

import Q57 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/057-what-is-a-hash-table.md?raw";
import Q58 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/058-how-does-a-hash-table-work.md?raw";
import Q59 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/059-what-is-hashing.md?raw";
import Q60 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/060-what-is-a-hash-function.md?raw";
import Q61 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/061-what-is-a-hash-collision.md?raw";
import Q62 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/062-how-are-collisions-handled.md?raw";
import Q63 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/063-what-is-the-average-lookup-complexity.md?raw";
import Q64 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/064-what-is-the-worst-case-lookup-complexity.md?raw";
import Q65 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/065-why-is-a-dictionary-generally-o-1-for-lookup.md?raw";
import Q66 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/066-difference-between-dictionary-and-list.md?raw";
import Q67 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/067-difference-between-dictionary-and-set.md?raw";
import Q68 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/concept/068-what-makes-an-object-hashable-in-python.md?raw";

const DSHashTableDictionaryConceptQuestion = [
  {
    id: "057-what-is-a-hash-table",
    category: "Hash Table / Dictionary",
    title: "What is a hash table?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q57,
    code: "",
  },

  {
    id: "058-how-does-a-hash-table-work",
    category: "Hash Table / Dictionary",
    title: "How does a hash table work?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q58,
    code: "",
  },

  {
    id: "059-what-is-hashing",
    category: "Hash Table / Dictionary",
    title: "What is hashing?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q59,
    code: "",
  },

  {
    id: "060-what-is-a-hash-function",
    category: "Hash Table / Dictionary",
    title: "What is a hash function?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q60,
    code: "",
  },

  {
    id: "061-what-is-a-hash-collision",
    category: "Hash Table / Dictionary",
    title: "What is a hash collision?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q61,
    code: "",
  },

  {
    id: "062-how-are-collisions-handled",
    category: "Hash Table / Dictionary",
    title: "How are collisions handled?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q62,
    code: "",
  },

  {
    id: "063-what-is-the-average-lookup-complexity",
    category: "Hash Table / Dictionary",
    title: "What is the average lookup complexity?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q63,
    code: "",
  },

  {
    id: "064-what-is-the-worst-case-lookup-complexity",
    category: "Hash Table / Dictionary",
    title: "What is the worst-case lookup complexity?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q64,
    code: "",
  },

  {
    id: "065-why-is-a-dictionary-generally-o-1-for-lookup",
    category: "Hash Table / Dictionary",
    title: "Why is a dictionary generally O(1) for lookup?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q65,
    code: "",
  },

  {
    id: "066-difference-between-dictionary-and-list",
    category: "Hash Table / Dictionary",
    title: "Difference between dictionary and list?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q66,
    code: "",
  },

  {
    id: "067-difference-between-dictionary-and-set",
    category: "Hash Table / Dictionary",
    title: "Difference between dictionary and set?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q67,
    code: "",
  },

  {
    id: "068-what-makes-an-object-hashable-in-python",
    category: "Hash Table / Dictionary",
    title: "What makes an object hashable in Python?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q68,
    code: "",
  },
];

export default function DSHashTableDictionaryConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSHashTableDictionaryConceptQuestion}
      title="Hash Table / Dictionary Cookbook"
      subtitle="Fundamentals and theory questions on Hash Table / Dictionary"
      icon="🗂️"
      patternLabel="Questions"
    />
  );
}
