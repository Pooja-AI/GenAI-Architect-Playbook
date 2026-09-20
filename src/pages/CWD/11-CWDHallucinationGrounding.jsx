import CookbookApp from "../../components/CookbookApp";
import Q253 from "../../assets/CWD/docs/11-hallucination-and-grounding/253-how-to-prevent-hallucinations.md?raw";
import Q254 from "../../assets/CWD/docs/11-hallucination-and-grounding/254-can-you-completely-eliminate-hallucination.md?raw";
import Q255 from "../../assets/CWD/docs/11-hallucination-and-grounding/255-how-to-ground-responses.md?raw";
import Q256 from "../../assets/CWD/docs/11-hallucination-and-grounding/256-how-rag-improves-grounding.md?raw";
import Q257 from "../../assets/CWD/docs/11-hallucination-and-grounding/257-what-if-retrieved-documents-are-wrong.md?raw";
import Q258 from "../../assets/CWD/docs/11-hallucination-and-grounding/258-what-if-retrieval-returns-nothing.md?raw";
import Q259 from "../../assets/CWD/docs/11-hallucination-and-grounding/259-what-should-llm-do-when-evidence-is-insufficient.md?raw";
import Q260 from "../../assets/CWD/docs/11-hallucination-and-grounding/260-how-to-enforce-i-dont-know-behavior.md?raw";
import Q261 from "../../assets/CWD/docs/11-hallucination-and-grounding/261-how-to-validate-factuality.md?raw";
import Q262 from "../../assets/CWD/docs/11-hallucination-and-grounding/262-what-metrics-measure-hallucination.md?raw";
import Q263 from "../../assets/CWD/docs/11-hallucination-and-grounding/263-what-is-faithfulness.md?raw";
import Q264 from "../../assets/CWD/docs/11-hallucination-and-grounding/264-what-is-groundedness.md?raw";
import Q265 from "../../assets/CWD/docs/11-hallucination-and-grounding/265-how-to-implement-citation-generation.md?raw";
import Q266 from "../../assets/CWD/docs/11-hallucination-and-grounding/266-how-to-detect-unsupported-claims.md?raw";

const CWDHallucinationGrounding = [
  // =====================================================
  // 11. HALLUCINATION & GROUNDING
  // =====================================================

  {
    id: "253-how-to-prevent-hallucinations",
    category: "Hallucination & Grounding",
    title: "How do you prevent hallucinations?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q253,
    code: "",
  },

  {
    id: "254-can-you-completely-eliminate-hallucination",
    category: "Hallucination & Grounding",
    title: "Can you completely eliminate hallucination?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q254,
    code: "",
  },

  {
    id: "255-how-to-ground-responses",
    category: "Hallucination & Grounding",
    title: "How do you ground responses?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q255,
    code: "",
  },

  {
    id: "256-how-rag-improves-grounding",
    category: "Hallucination & Grounding",
    title: "How does RAG improve grounding?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q256,
    code: "",
  },

  {
    id: "257-what-if-retrieved-documents-are-wrong",
    category: "Hallucination & Grounding",
    title: "What if retrieved documents are wrong?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q257,
    code: "",
  },

  {
    id: "258-what-if-retrieval-returns-nothing",
    category: "Hallucination & Grounding",
    title: "What if retrieval returns nothing?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q258,
    code: "",
  },

  {
    id: "259-what-should-llm-do-when-evidence-is-insufficient",
    category: "Hallucination & Grounding",
    title: "What should the LLM do when evidence is insufficient?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q259,
    code: "",
  },

  {
    id: "260-how-to-enforce-i-dont-know-behavior",
    category: "Hallucination & Grounding",
    title: "How do you enforce “I don't know” behavior?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q260,
    code: "",
  },

  {
    id: "261-how-to-validate-factuality",
    category: "Hallucination & Grounding",
    title: "How do you validate factuality?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q261,
    code: "",
  },

  {
    id: "262-what-metrics-measure-hallucination",
    category: "Hallucination & Grounding",
    title: "What metrics measure hallucination?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q262,
    code: "",
  },

  {
    id: "263-what-is-faithfulness",
    category: "Hallucination & Grounding",
    title: "What is faithfulness?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q263,
    code: "",
  },

  {
    id: "264-what-is-groundedness",
    category: "Hallucination & Grounding",
    title: "What is groundedness?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q264,
    code: "",
  },

  {
    id: "265-how-to-implement-citation-generation",
    category: "Hallucination & Grounding",
    title: "How do you implement citation generation?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q265,
    code: "",
  },

  {
    id: "266-how-to-detect-unsupported-claims",
    category: "Hallucination & Grounding",
    title: "How do you detect unsupported claims?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: grounding, faithfulness, citations and unsupported-claim detection.",
    concept: Q266,
    code: "",
  },

];

export default function CWDHallucinationGroundingPage() {
  return (
    <CookbookApp
      data={CWDHallucinationGrounding}
      title="CWD Hallucination & Grounding Cookbook"
      subtitle="Grounding, faithfulness, citations and unsupported-claim detection"
      icon="🔍"
      patternLabel="Questions"
    />
  );
}
