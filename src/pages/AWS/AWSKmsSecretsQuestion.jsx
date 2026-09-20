import CookbookApp from "../../components/CookbookApp";

import Q161 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/161-where-would-you-use-aws-kms.md?raw";
import Q162 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/162-what-data-would-you-encrypt.md?raw";
import Q163 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/163-aws-managed-key-vs-customer-managed-key.md?raw";
import Q164 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/164-how-would-you-encrypt-s3.md?raw";
import Q165 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/165-how-would-you-encrypt-dynamodb.md?raw";
import Q166 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/166-how-would-you-encrypt-application-secrets.md?raw";
import Q167 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/167-why-use-secrets-manager.md?raw";
import Q168 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/168-secrets-manager-vs-parameter-store.md?raw";
import Q169 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/169-how-would-lambda-retrieve-secrets.md?raw";
import Q170 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/170-how-would-you-rotate-secrets.md?raw";
import Q171 from "../../assets/docs/aws-interview-questions/aws-core-services/12-kms-and-secrets-manager/171-how-would-you-prevent-secrets-from-appearing-in-logs.md?raw";

const AWSKmsSecretsQuestion = [
  {
    id: "161-where-would-you-use-aws-kms",
    category: "KMS & Secrets Manager",
    title: "Where would you use AWS KMS?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q161,
    code: "",
  },

  {
    id: "162-what-data-would-you-encrypt",
    category: "KMS & Secrets Manager",
    title: "What data would you encrypt?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q162,
    code: "",
  },

  {
    id: "163-aws-managed-key-vs-customer-managed-key",
    category: "KMS & Secrets Manager",
    title: "AWS-managed key vs customer-managed key?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q163,
    code: "",
  },

  {
    id: "164-how-would-you-encrypt-s3",
    category: "KMS & Secrets Manager",
    title: "How would you encrypt S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q164,
    code: "",
  },

  {
    id: "165-how-would-you-encrypt-dynamodb",
    category: "KMS & Secrets Manager",
    title: "How would you encrypt DynamoDB?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q165,
    code: "",
  },

  {
    id: "166-how-would-you-encrypt-application-secrets",
    category: "KMS & Secrets Manager",
    title: "How would you encrypt application secrets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q166,
    code: "",
  },

  {
    id: "167-why-use-secrets-manager",
    category: "KMS & Secrets Manager",
    title: "Why use Secrets Manager?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q167,
    code: "",
  },

  {
    id: "168-secrets-manager-vs-parameter-store",
    category: "KMS & Secrets Manager",
    title: "Secrets Manager vs Parameter Store?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q168,
    code: "",
  },

  {
    id: "169-how-would-lambda-retrieve-secrets",
    category: "KMS & Secrets Manager",
    title: "How would Lambda retrieve secrets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q169,
    code: "",
  },

  {
    id: "170-how-would-you-rotate-secrets",
    category: "KMS & Secrets Manager",
    title: "How would you rotate secrets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q170,
    code: "",
  },

  {
    id: "171-how-would-you-prevent-secrets-from-appearing-in-logs",
    category: "KMS & Secrets Manager",
    title: "How would you prevent secrets from appearing in logs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q171,
    code: "",
  },

];

export default function AWSKmsSecretsQuestionPage() {
  return (
    <CookbookApp
      data={AWSKmsSecretsQuestion}
      title="KMS & Secrets Manager Cookbook"
      subtitle="Encryption keys, secrets retrieval, rotation and log hygiene"
      icon="🗝️"
      patternLabel="Questions"
    />
  );
}
