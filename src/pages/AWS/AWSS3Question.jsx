import CookbookApp from "../../components/CookbookApp";

import Q121 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/121-what-would-you-store-in-s3.md?raw";
import Q122 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/122-how-would-you-design-the-cwd-document-ingestion-pipeline.md?raw";
import Q123 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/123-how-would-you-secure-s3.md?raw";
import Q124 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/124-how-would-you-implement-bucket-policies.md?raw";
import Q125 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/125-how-would-you-prevent-public-access.md?raw";
import Q126 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/126-what-is-s3-versioning.md?raw";
import Q127 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/127-how-would-you-handle-document-updates.md?raw";
import Q128 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/128-how-would-you-handle-document-deletion.md?raw";
import Q129 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/129-how-would-you-encrypt-s3-data.md?raw";
import Q130 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/130-s3-sse-s3-vs-sse-kms.md?raw";
import Q131 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/131-how-would-you-trigger-processing-when-a-document-arrives-in-s3.md?raw";
import Q132 from "../../assets/docs/aws-interview-questions/aws-core-services/09-s3/132-how-would-you-control-access-to-documents.md?raw";

const AWSS3Question = [
  {
    id: "121-what-would-you-store-in-s3",
    category: "S3",
    title: "What would you store in S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q121,
    code: "",
  },

  {
    id: "122-how-would-you-design-the-cwd-document-ingestion-pipeline",
    category: "S3",
    title: "How would you design the CWD document ingestion pipeline?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q122,
    code: "",
  },

  {
    id: "123-how-would-you-secure-s3",
    category: "S3",
    title: "How would you secure S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q123,
    code: "",
  },

  {
    id: "124-how-would-you-implement-bucket-policies",
    category: "S3",
    title: "How would you implement bucket policies?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q124,
    code: "",
  },

  {
    id: "125-how-would-you-prevent-public-access",
    category: "S3",
    title: "How would you prevent public access?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q125,
    code: "",
  },

  {
    id: "126-what-is-s3-versioning",
    category: "S3",
    title: "What is S3 versioning?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q126,
    code: "",
  },

  {
    id: "127-how-would-you-handle-document-updates",
    category: "S3",
    title: "How would you handle document updates?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q127,
    code: "",
  },

  {
    id: "128-how-would-you-handle-document-deletion",
    category: "S3",
    title: "How would you handle document deletion?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q128,
    code: "",
  },

  {
    id: "129-how-would-you-encrypt-s3-data",
    category: "S3",
    title: "How would you encrypt S3 data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q129,
    code: "",
  },

  {
    id: "130-s3-sse-s3-vs-sse-kms",
    category: "S3",
    title: "S3 SSE-S3 vs SSE-KMS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q130,
    code: "",
  },

  {
    id: "131-how-would-you-trigger-processing-when-a-document-arrives-in-s3",
    category: "S3",
    title: "How would you trigger processing when a document arrives in S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q131,
    code: "",
  },

  {
    id: "132-how-would-you-control-access-to-documents",
    category: "S3",
    title: "How would you control access to documents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q132,
    code: "",
  },

];

export default function AWSS3QuestionPage() {
  return (
    <CookbookApp
      data={AWSS3Question}
      title="Amazon S3 Cookbook"
      subtitle="Ingestion, security, versioning, encryption and event triggers"
      icon="🪣"
      patternLabel="Questions"
    />
  );
}
