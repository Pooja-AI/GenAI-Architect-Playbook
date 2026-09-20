import CookbookApp from "../../components/CookbookApp";

import Q216 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/216-what-is-the-biggest-cost-driver-in-cwd.md?raw";
import Q217 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/217-how-would-you-reduce-bedrock-costs.md?raw";
import Q218 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/218-how-would-you-reduce-lambda-costs.md?raw";
import Q219 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/219-how-would-you-reduce-ecs-costs.md?raw";
import Q220 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/220-how-would-you-reduce-opensearch-costs.md?raw";
import Q221 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/221-how-would-you-optimize-s3-costs.md?raw";
import Q222 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/222-how-would-you-use-caching-to-reduce-cost.md?raw";
import Q223 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/223-how-would-you-use-smaller-bedrock-models.md?raw";
import Q224 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/224-how-would-you-monitor-aws-cost-per-request.md?raw";
import Q225 from "../../assets/docs/aws-interview-questions/aws-core-services/16-aws-cost-optimization/225-how-would-you-investigate-a-sudden-aws-bill-increase.md?raw";

const AWSCostOptimizationQuestion = [
  {
    id: "216-what-is-the-biggest-cost-driver-in-cwd",
    category: "AWS Cost Optimization",
    title: "What is the biggest cost driver in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q216,
    code: "",
  },

  {
    id: "217-how-would-you-reduce-bedrock-costs",
    category: "AWS Cost Optimization",
    title: "How would you reduce Bedrock costs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q217,
    code: "",
  },

  {
    id: "218-how-would-you-reduce-lambda-costs",
    category: "AWS Cost Optimization",
    title: "How would you reduce Lambda costs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q218,
    code: "",
  },

  {
    id: "219-how-would-you-reduce-ecs-costs",
    category: "AWS Cost Optimization",
    title: "How would you reduce ECS costs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q219,
    code: "",
  },

  {
    id: "220-how-would-you-reduce-opensearch-costs",
    category: "AWS Cost Optimization",
    title: "How would you reduce OpenSearch costs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q220,
    code: "",
  },

  {
    id: "221-how-would-you-optimize-s3-costs",
    category: "AWS Cost Optimization",
    title: "How would you optimize S3 costs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q221,
    code: "",
  },

  {
    id: "222-how-would-you-use-caching-to-reduce-cost",
    category: "AWS Cost Optimization",
    title: "How would you use caching to reduce cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q222,
    code: "",
  },

  {
    id: "223-how-would-you-use-smaller-bedrock-models",
    category: "AWS Cost Optimization",
    title: "How would you use smaller Bedrock models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q223,
    code: "",
  },

  {
    id: "224-how-would-you-monitor-aws-cost-per-request",
    category: "AWS Cost Optimization",
    title: "How would you monitor AWS cost per request?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q224,
    code: "",
  },

  {
    id: "225-how-would-you-investigate-a-sudden-aws-bill-increase",
    category: "AWS Cost Optimization",
    title: "How would you investigate a sudden AWS bill increase?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q225,
    code: "",
  },

];

export default function AWSCostOptimizationQuestionPage() {
  return (
    <CookbookApp
      data={AWSCostOptimizationQuestion}
      title="AWS Cost Optimization Cookbook"
      subtitle="Cost drivers, caching, smaller models and bill investigation"
      icon="💰"
      patternLabel="Questions"
    />
  );
}
