import CookbookApp from "../../../components/CookbookApp";

import Q501 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/501-what-is-a-bit.md?raw";
import Q502 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/502-what-is-binary-representation.md?raw";
import Q503 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/503-what-is-bitwise-and.md?raw";
import Q504 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/504-what-is-bitwise-or.md?raw";
import Q505 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/505-what-is-xor.md?raw";
import Q506 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/506-what-is-not.md?raw";
import Q507 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/507-what-are-left-and-right-shifts.md?raw";
import Q508 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/508-difference-between-logical-and-arithmetic-shift.md?raw";
import Q509 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/509-what-is-a-bit-mask.md?raw";
import Q510 from "../../../assets/docs/data-structures-interview-questions/24-bit-manipulation/concept/510-why-is-xor-useful.md?raw";

const DSBitManipulationConceptQuestion = [
  {
    id: "501-what-is-a-bit",
    category: "Bit Manipulation",
    title: "What is a bit?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q501,
    code: "",
  },

  {
    id: "502-what-is-binary-representation",
    category: "Bit Manipulation",
    title: "What is binary representation?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q502,
    code: "",
  },

  {
    id: "503-what-is-bitwise-and",
    category: "Bit Manipulation",
    title: "What is bitwise AND?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q503,
    code: "",
  },

  {
    id: "504-what-is-bitwise-or",
    category: "Bit Manipulation",
    title: "What is bitwise OR?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q504,
    code: "",
  },

  {
    id: "505-what-is-xor",
    category: "Bit Manipulation",
    title: "What is XOR?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q505,
    code: "",
  },

  {
    id: "506-what-is-not",
    category: "Bit Manipulation",
    title: "What is NOT?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q506,
    code: "",
  },

  {
    id: "507-what-are-left-and-right-shifts",
    category: "Bit Manipulation",
    title: "What are left and right shifts?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q507,
    code: "",
  },

  {
    id: "508-difference-between-logical-and-arithmetic-shift",
    category: "Bit Manipulation",
    title: "Difference between logical and arithmetic shift?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q508,
    code: "",
  },

  {
    id: "509-what-is-a-bit-mask",
    category: "Bit Manipulation",
    title: "What is a bit mask?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q509,
    code: "",
  },

  {
    id: "510-why-is-xor-useful",
    category: "Bit Manipulation",
    title: "Why is XOR useful?",
    difficulty: "Beginner",
    time: "~5 min",
    concept: Q510,
    code: "",
  },
];

export default function DSBitManipulationConceptQuestionPage() {
  return (
    <CookbookApp
      data={DSBitManipulationConceptQuestion}
      title="Bit Manipulation Cookbook"
      subtitle="Fundamentals and theory questions on Bit Manipulation"
      icon="💾"
      patternLabel="Questions"
    />
  );
}
