import CookbookApp from "../../../components/CookbookApp";

import Q69 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/069-count-frequencies-using-a-dictionary.md?raw";
import Q70 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/070-find-duplicates-using-a-dictionary.md?raw";
import Q71 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/071-two-sum.md?raw";
import Q72 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/072-group-anagrams.md?raw";
import Q73 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/073-first-unique-character.md?raw";
import Q74 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/074-find-common-elements-between-arrays.md?raw";
import Q75 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/075-find-the-intersection-of-two-arrays.md?raw";
import Q76 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/076-find-elements-occurring-more-than-once.md?raw";
import Q77 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/077-find-the-majority-element.md?raw";
import Q78 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/078-find-the-longest-consecutive-sequence.md?raw";
import Q79 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/079-find-subarray-with-sum-k.md?raw";
import Q80 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/080-count-subarrays-with-sum-k.md?raw";
import Q81 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/081-find-pairs-with-a-given-difference.md?raw";
import Q82 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/082-find-the-longest-substring-with-k-distinct-characters.md?raw";
import Q83 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/083-implement-a-simple-hash-table.md?raw";
import Q84 from "../../../assets/docs/data-structures-interview-questions/03-hash-table-dictionary/code/084-design-an-lru-cache.md?raw";

const DSHashTableDictionaryCodeQuestion = [
  {
    id: "069-count-frequencies-using-a-dictionary",
    category: "Hash Table / Dictionary",
    title: "Count frequencies using a dictionary.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q69,
  },

  {
    id: "070-find-duplicates-using-a-dictionary",
    category: "Hash Table / Dictionary",
    title: "Find duplicates using a dictionary.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q70,
  },

  {
    id: "071-two-sum",
    category: "Hash Table / Dictionary",
    title: "Two Sum.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q71,
  },

  {
    id: "072-group-anagrams",
    category: "Hash Table / Dictionary",
    title: "Group Anagrams.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q72,
  },

  {
    id: "073-first-unique-character",
    category: "Hash Table / Dictionary",
    title: "First Unique Character.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q73,
  },

  {
    id: "074-find-common-elements-between-arrays",
    category: "Hash Table / Dictionary",
    title: "Find common elements between arrays.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q74,
  },

  {
    id: "075-find-the-intersection-of-two-arrays",
    category: "Hash Table / Dictionary",
    title: "Find the intersection of two arrays.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q75,
  },

  {
    id: "076-find-elements-occurring-more-than-once",
    category: "Hash Table / Dictionary",
    title: "Find elements occurring more than once.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q76,
  },

  {
    id: "077-find-the-majority-element",
    category: "Hash Table / Dictionary",
    title: "Find the majority element.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q77,
  },

  {
    id: "078-find-the-longest-consecutive-sequence",
    category: "Hash Table / Dictionary",
    title: "Find the longest consecutive sequence.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q78,
  },

  {
    id: "079-find-subarray-with-sum-k",
    category: "Hash Table / Dictionary",
    title: "Find subarray with sum K.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q79,
  },

  {
    id: "080-count-subarrays-with-sum-k",
    category: "Hash Table / Dictionary",
    title: "Count subarrays with sum K.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q80,
  },

  {
    id: "081-find-pairs-with-a-given-difference",
    category: "Hash Table / Dictionary",
    title: "Find pairs with a given difference.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q81,
  },

  {
    id: "082-find-the-longest-substring-with-k-distinct-characters",
    category: "Hash Table / Dictionary",
    title: "Find the longest substring with K distinct characters.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q82,
  },

  {
    id: "083-implement-a-simple-hash-table",
    category: "Hash Table / Dictionary",
    title: "Implement a simple hash table.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q83,
  },

  {
    id: "084-design-an-lru-cache",
    category: "Hash Table / Dictionary",
    title: "Design an LRU cache.",
    difficulty: "Intermediate",
    time: "~15 min",
    concept: "",
    code: Q84,
  },
];

export default function DSHashTableDictionaryCodeQuestionPage() {
  return (
    <CookbookApp
      data={DSHashTableDictionaryCodeQuestion}
      title="Hash Table / Dictionary Cookbook"
      subtitle="Coding practice problems on Hash Table / Dictionary"
      icon="🗂️"
      patternLabel="Questions"
    />
  );
}
