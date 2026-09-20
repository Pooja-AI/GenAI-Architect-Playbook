import CookbookApp from "../../components/CookbookApp";

import Q172 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/172-explain-the-aws-network-architecture-for-cwd.md?raw";
import Q173 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/173-public-subnet-vs-private-subnet.md?raw";
import Q174 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/174-which-cwd-components-belong-in-private-subnets.md?raw";
import Q175 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/175-why-deploy-workers-in-private-subnets.md?raw";
import Q176 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/176-what-is-a-nat-gateway.md?raw";
import Q177 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/177-where-would-you-use-nat-gateway.md?raw";
import Q178 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/178-how-would-private-workloads-access-aws-services.md?raw";
import Q179 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/179-what-are-vpc-endpoints.md?raw";
import Q180 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/180-gateway-endpoint-vs-interface-endpoint.md?raw";
import Q181 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/181-how-would-you-privately-access-s3.md?raw";
import Q182 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/182-how-would-you-privately-access-bedrock.md?raw";
import Q183 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/183-how-would-you-secure-traffic-between-services.md?raw";
import Q184 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/184-security-group-vs-nacl.md?raw";
import Q185 from "../../assets/docs/aws-interview-questions/aws-core-services/13-vpc-and-networking/185-how-would-you-troubleshoot-a-networking-failure.md?raw";

const AWSVpcNetworkingQuestion = [
  {
    id: "172-explain-the-aws-network-architecture-for-cwd",
    category: "VPC & Networking",
    title: "Explain the AWS network architecture for CWD.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q172,
    code: "",
  },

  {
    id: "173-public-subnet-vs-private-subnet",
    category: "VPC & Networking",
    title: "Public subnet vs private subnet?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q173,
    code: "",
  },

  {
    id: "174-which-cwd-components-belong-in-private-subnets",
    category: "VPC & Networking",
    title: "Which CWD components belong in private subnets?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q174,
    code: "",
  },

  {
    id: "175-why-deploy-workers-in-private-subnets",
    category: "VPC & Networking",
    title: "Why deploy Workers in private subnets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q175,
    code: "",
  },

  {
    id: "176-what-is-a-nat-gateway",
    category: "VPC & Networking",
    title: "What is a NAT Gateway?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q176,
    code: "",
  },

  {
    id: "177-where-would-you-use-nat-gateway",
    category: "VPC & Networking",
    title: "Where would you use NAT Gateway?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q177,
    code: "",
  },

  {
    id: "178-how-would-private-workloads-access-aws-services",
    category: "VPC & Networking",
    title: "How would private workloads access AWS services?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q178,
    code: "",
  },

  {
    id: "179-what-are-vpc-endpoints",
    category: "VPC & Networking",
    title: "What are VPC endpoints?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q179,
    code: "",
  },

  {
    id: "180-gateway-endpoint-vs-interface-endpoint",
    category: "VPC & Networking",
    title: "Gateway endpoint vs interface endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q180,
    code: "",
  },

  {
    id: "181-how-would-you-privately-access-s3",
    category: "VPC & Networking",
    title: "How would you privately access S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q181,
    code: "",
  },

  {
    id: "182-how-would-you-privately-access-bedrock",
    category: "VPC & Networking",
    title: "How would you privately access Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q182,
    code: "",
  },

  {
    id: "183-how-would-you-secure-traffic-between-services",
    category: "VPC & Networking",
    title: "How would you secure traffic between services?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q183,
    code: "",
  },

  {
    id: "184-security-group-vs-nacl",
    category: "VPC & Networking",
    title: "Security Group vs NACL?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q184,
    code: "",
  },

  {
    id: "185-how-would-you-troubleshoot-a-networking-failure",
    category: "VPC & Networking",
    title: "How would you troubleshoot a networking failure?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q185,
    code: "",
  },

];

export default function AWSVpcNetworkingQuestionPage() {
  return (
    <CookbookApp
      data={AWSVpcNetworkingQuestion}
      title="VPC & Networking Cookbook"
      subtitle="Subnets, NAT, VPC endpoints, security groups and troubleshooting"
      icon="🌐"
      patternLabel="Questions"
    />
  );
}
