import CookbookApp from "../../components/CookbookApp";

import Q148 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/148-explain-iam-architecture-for-cwd.md?raw";
import Q149 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/149-iam-user-vs-iam-role.md?raw";
import Q150 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/150-why-use-iam-roles-instead-of-access-keys.md?raw";
import Q151 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/151-how-would-lambda-access-s3-securely.md?raw";
import Q152 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/152-how-would-ecs-access-bedrock-securely.md?raw";
import Q153 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/153-how-would-workers-access-aws-services.md?raw";
import Q154 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/154-how-do-you-implement-least-privilege.md?raw";
import Q155 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/155-how-do-you-secure-cross-service-communication.md?raw";
import Q156 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/156-how-do-you-implement-resource-based-policies.md?raw";
import Q157 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/157-identity-based-vs-resource-based-policies.md?raw";
import Q158 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/158-how-do-you-prevent-privilege-escalation.md?raw";
import Q159 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/159-how-do-you-audit-iam-activity.md?raw";
import Q160 from "../../assets/docs/aws-interview-questions/aws-core-services/11-iam-and-security/160-how-does-aws-cloudtrail-help.md?raw";

const AWSIamSecurityQuestion = [
  {
    id: "148-explain-iam-architecture-for-cwd",
    category: "IAM & Security",
    title: "Explain IAM architecture for CWD.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q148,
    code: "",
  },

  {
    id: "149-iam-user-vs-iam-role",
    category: "IAM & Security",
    title: "IAM user vs IAM role?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q149,
    code: "",
  },

  {
    id: "150-why-use-iam-roles-instead-of-access-keys",
    category: "IAM & Security",
    title: "Why use IAM roles instead of access keys?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q150,
    code: "",
  },

  {
    id: "151-how-would-lambda-access-s3-securely",
    category: "IAM & Security",
    title: "How would Lambda access S3 securely?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q151,
    code: "",
  },

  {
    id: "152-how-would-ecs-access-bedrock-securely",
    category: "IAM & Security",
    title: "How would ECS access Bedrock securely?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q152,
    code: "",
  },

  {
    id: "153-how-would-workers-access-aws-services",
    category: "IAM & Security",
    title: "How would Workers access AWS services?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q153,
    code: "",
  },

  {
    id: "154-how-do-you-implement-least-privilege",
    category: "IAM & Security",
    title: "How do you implement least privilege?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q154,
    code: "",
  },

  {
    id: "155-how-do-you-secure-cross-service-communication",
    category: "IAM & Security",
    title: "How do you secure cross-service communication?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q155,
    code: "",
  },

  {
    id: "156-how-do-you-implement-resource-based-policies",
    category: "IAM & Security",
    title: "How do you implement resource-based policies?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q156,
    code: "",
  },

  {
    id: "157-identity-based-vs-resource-based-policies",
    category: "IAM & Security",
    title: "Identity-based vs resource-based policies?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q157,
    code: "",
  },

  {
    id: "158-how-do-you-prevent-privilege-escalation",
    category: "IAM & Security",
    title: "How do you prevent privilege escalation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q158,
    code: "",
  },

  {
    id: "159-how-do-you-audit-iam-activity",
    category: "IAM & Security",
    title: "How do you audit IAM activity?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q159,
    code: "",
  },

  {
    id: "160-how-does-aws-cloudtrail-help",
    category: "IAM & Security",
    title: "How does AWS CloudTrail help?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q160,
    code: "",
  },

];

export default function AWSIamSecurityQuestionPage() {
  return (
    <CookbookApp
      data={AWSIamSecurityQuestion}
      title="IAM & Security Cookbook"
      subtitle="Roles, least privilege, policies, auditing and CloudTrail"
      icon="🔐"
      patternLabel="Questions"
    />
  );
}
