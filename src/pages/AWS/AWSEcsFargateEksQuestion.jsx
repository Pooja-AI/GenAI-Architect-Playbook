import CookbookApp from "../../components/CookbookApp";

import Q61 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/061-why-would-you-deploy-cwd-on-ecs-fargate.md?raw";
import Q62 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/062-ecs-vs-lambda-for-workers.md?raw";
import Q63 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/063-ecs-vs-eks.md?raw";
import Q64 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/064-how-would-you-containerize-the-coordinator.md?raw";
import Q65 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/065-how-would-you-containerize-delegators.md?raw";
import Q66 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/066-how-would-you-containerize-workers.md?raw";
import Q67 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/067-how-does-ecs-service-auto-scaling-work.md?raw";
import Q68 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/068-how-do-you-implement-health-checks.md?raw";
import Q69 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/069-how-do-you-perform-zero-downtime-deployment.md?raw";
import Q70 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/070-how-do-you-handle-container-failures.md?raw";
import Q71 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/071-how-do-you-distribute-traffic-across-containers.md?raw";
import Q72 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/072-how-would-you-implement-service-discovery.md?raw";
import Q73 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/073-how-would-you-configure-ecs-networking.md?raw";
import Q74 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/074-how-would-you-secure-ecs-tasks.md?raw";
import Q75 from "../../assets/docs/aws-interview-questions/aws-core-services/05-ecs-fargate-eks/075-when-would-you-move-from-ecs-to-eks.md?raw";

const AWSEcsFargateEksQuestion = [
  {
    id: "061-why-would-you-deploy-cwd-on-ecs-fargate",
    category: "ECS / Fargate / EKS",
    title: "Why would you deploy CWD on ECS/Fargate?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q61,
    code: "",
  },

  {
    id: "062-ecs-vs-lambda-for-workers",
    category: "ECS / Fargate / EKS",
    title: "ECS vs Lambda for Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q62,
    code: "",
  },

  {
    id: "063-ecs-vs-eks",
    category: "ECS / Fargate / EKS",
    title: "ECS vs EKS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q63,
    code: "",
  },

  {
    id: "064-how-would-you-containerize-the-coordinator",
    category: "ECS / Fargate / EKS",
    title: "How would you containerize the Coordinator?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q64,
    code: "",
  },

  {
    id: "065-how-would-you-containerize-delegators",
    category: "ECS / Fargate / EKS",
    title: "How would you containerize Delegators?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q65,
    code: "",
  },

  {
    id: "066-how-would-you-containerize-workers",
    category: "ECS / Fargate / EKS",
    title: "How would you containerize Workers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q66,
    code: "",
  },

  {
    id: "067-how-does-ecs-service-auto-scaling-work",
    category: "ECS / Fargate / EKS",
    title: "How does ECS service auto scaling work?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q67,
    code: "",
  },

  {
    id: "068-how-do-you-implement-health-checks",
    category: "ECS / Fargate / EKS",
    title: "How do you implement health checks?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q68,
    code: "",
  },

  {
    id: "069-how-do-you-perform-zero-downtime-deployment",
    category: "ECS / Fargate / EKS",
    title: "How do you perform zero-downtime deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q69,
    code: "",
  },

  {
    id: "070-how-do-you-handle-container-failures",
    category: "ECS / Fargate / EKS",
    title: "How do you handle container failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q70,
    code: "",
  },

  {
    id: "071-how-do-you-distribute-traffic-across-containers",
    category: "ECS / Fargate / EKS",
    title: "How do you distribute traffic across containers?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q71,
    code: "",
  },

  {
    id: "072-how-would-you-implement-service-discovery",
    category: "ECS / Fargate / EKS",
    title: "How would you implement service discovery?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q72,
    code: "",
  },

  {
    id: "073-how-would-you-configure-ecs-networking",
    category: "ECS / Fargate / EKS",
    title: "How would you configure ECS networking?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q73,
    code: "",
  },

  {
    id: "074-how-would-you-secure-ecs-tasks",
    category: "ECS / Fargate / EKS",
    title: "How would you secure ECS tasks?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q74,
    code: "",
  },

  {
    id: "075-when-would-you-move-from-ecs-to-eks",
    category: "ECS / Fargate / EKS",
    title: "When would you move from ECS to EKS?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q75,
    code: "",
  },

];

export default function AWSEcsFargateEksQuestionPage() {
  return (
    <CookbookApp
      data={AWSEcsFargateEksQuestion}
      title="ECS / Fargate / EKS Cookbook"
      subtitle="Containers, scaling, networking, deployments and EKS trade-offs"
      icon="📦"
      patternLabel="Questions"
    />
  );
}
