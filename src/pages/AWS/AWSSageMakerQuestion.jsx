import CookbookApp from "../../components/CookbookApp";

import Q38 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/38-why-would-you-use-sagemaker-in-cwd.md?raw";
import Q39 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/39-what-role-does-sagemaker-play-alongside-bedrock.md?raw";
import Q40 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/40-sagemaker-vs-bedrock.md?raw";
import Q41 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/41-when-would-you-use-sagemaker-instead-of-bedrock.md?raw";
import Q42 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/42-what-models-would-you-deploy-using-sagemaker.md?raw";
import Q43 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/43-would-you-use-sagemaker-for-foundation-models-or-traditional-ml.md?raw";
import Q44 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/44-how-would-sagemaker-support-the-cwd-ml-pipeline.md?raw";
import Q45 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/45-how-would-you-deploy-a-custom-model-to-sagemaker.md?raw";
import Q46 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/46-how-would-workers-consume-a-sagemaker-endpoint.md?raw";
import Q47 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/47-api-gateway-worker-sagemaker-architecture.md?raw";
import Q48 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/48-how-would-you-secure-sagemaker-endpoints.md?raw";
import Q49 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/49-how-would-you-monitor-sagemaker-endpoints.md?raw";
import Q50 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/01-sagemaker-in-cwd/50-how-would-you-handle-sagemaker-endpoint-failures.md?raw";
import Q51 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/51-how-would-you-train-a-model-using-sagemaker.md?raw";
import Q52 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/52-what-data-would-come-from-s3.md?raw";
import Q53 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/53-how-would-glue-prepare-training-data-for-sagemaker.md?raw";
import Q54 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/54-explain-s3-glue-sagemaker-training.md?raw";
import Q55 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/55-how-would-you-perform-distributed-training.md?raw";
import Q56 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/56-how-would-you-select-sagemaker-instance-types.md?raw";
import Q57 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/57-how-would-you-manage-training-datasets.md?raw";
import Q58 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/58-how-would-you-track-experiments.md?raw";
import Q59 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/59-how-would-you-version-models.md?raw";
import Q60 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/02-sagemaker-training/60-how-would-you-reproduce-a-previous-training-run.md?raw";
import Q61 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/61-explain-a-sagemaker-mlops-pipeline.md?raw";
import Q62 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/62-how-would-you-automate-model-training.md?raw";
import Q63 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/63-how-would-you-implement-model-validation.md?raw";
import Q64 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/64-how-would-you-implement-model-evaluation.md?raw";
import Q65 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/65-how-would-you-implement-model-approval.md?raw";
import Q66 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/66-what-is-sagemaker-model-registry.md?raw";
import Q67 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/67-how-would-you-promote-a-model-from-dev-test-production.md?raw";
import Q68 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/68-how-would-you-implement-model-rollback.md?raw";
import Q69 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/69-how-would-you-detect-model-drift.md?raw";
import Q70 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/70-how-would-you-detect-data-drift.md?raw";
import Q71 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/71-how-would-you-monitor-model-quality.md?raw";
import Q72 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/72-how-would-you-perform-continuous-training.md?raw";
import Q73 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/03-sagemaker-pipelines-mlops/73-how-would-you-integrate-sagemaker-with-ci-cd.md?raw";
import Q74 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/74-why-use-bedrock-for-llm-inference-but-sagemaker-for-another-ml-model.md?raw";
import Q75 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/75-how-would-you-decide-whether-a-model-belongs-in-bedrock-or-sagemaker.md?raw";
import Q76 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/76-how-would-a-worker-call-a-sagemaker-endpoint.md?raw";
import Q77 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/77-how-would-you-handle-sagemaker-inference-latency.md?raw";
import Q78 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/78-how-would-you-scale-sagemaker-endpoints.md?raw";
import Q79 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/79-real-time-vs-asynchronous-sagemaker-inference.md?raw";
import Q80 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/80-when-would-you-use-sagemaker-serverless-inference.md?raw";
import Q81 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/81-when-would-you-use-sagemaker-asynchronous-inference.md?raw";
import Q82 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/82-how-would-you-implement-autoscaling.md?raw";
import Q83 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/83-how-would-you-handle-endpoint-throttling.md?raw";
import Q84 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/84-how-would-you-implement-model-fallback.md?raw";
import Q85 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/85-how-would-you-perform-a-b-testing-between-models.md?raw";
import Q86 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/86-how-would-you-perform-canary-deployment.md?raw";
import Q87 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/87-how-would-you-monitor-inference-cost.md?raw";
import Q88 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/amazon-sagemaker/04-sagemaker-cwd-agentic-ai/88-how-would-you-optimize-inference-latency.md?raw";

const AWSSageMakerQuestion = [
  {
    id: "38-why-would-you-use-sagemaker-in-cwd",
    category: "SageMaker in CWD",
    title: "Why would you use SageMaker in CWD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q38,
    code: "",
  },

  {
    id: "39-what-role-does-sagemaker-play-alongside-bedrock",
    category: "SageMaker in CWD",
    title: "What role does SageMaker play alongside Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q39,
    code: "",
  },

  {
    id: "40-sagemaker-vs-bedrock",
    category: "SageMaker in CWD",
    title: "SageMaker vs Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q40,
    code: "",
  },

  {
    id: "41-when-would-you-use-sagemaker-instead-of-bedrock",
    category: "SageMaker in CWD",
    title: "When would you use SageMaker instead of Bedrock?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q41,
    code: "",
  },

  {
    id: "42-what-models-would-you-deploy-using-sagemaker",
    category: "SageMaker in CWD",
    title: "What models would you deploy using SageMaker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q42,
    code: "",
  },

  {
    id: "43-would-you-use-sagemaker-for-foundation-models-or-traditional-ml",
    category: "SageMaker in CWD",
    title: "Would you use SageMaker for foundation models or traditional ML?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q43,
    code: "",
  },

  {
    id: "44-how-would-sagemaker-support-the-cwd-ml-pipeline",
    category: "SageMaker in CWD",
    title: "How would SageMaker support the CWD ML pipeline?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q44,
    code: "",
  },

  {
    id: "45-how-would-you-deploy-a-custom-model-to-sagemaker",
    category: "SageMaker in CWD",
    title: "How would you deploy a custom model to SageMaker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q45,
    code: "",
  },

  {
    id: "46-how-would-workers-consume-a-sagemaker-endpoint",
    category: "SageMaker in CWD",
    title: "How would Workers consume a SageMaker endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q46,
    code: "",
  },

  {
    id: "47-api-gateway-worker-sagemaker-architecture",
    category: "SageMaker in CWD",
    title: "API Gateway → Worker → SageMaker architecture?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q47,
    code: "",
  },

  {
    id: "48-how-would-you-secure-sagemaker-endpoints",
    category: "SageMaker in CWD",
    title: "How would you secure SageMaker endpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q48,
    code: "",
  },

  {
    id: "49-how-would-you-monitor-sagemaker-endpoints",
    category: "SageMaker in CWD",
    title: "How would you monitor SageMaker endpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q49,
    code: "",
  },

  {
    id: "50-how-would-you-handle-sagemaker-endpoint-failures",
    category: "SageMaker in CWD",
    title: "How would you handle SageMaker endpoint failures?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q50,
    code: "",
  },

  {
    id: "51-how-would-you-train-a-model-using-sagemaker",
    category: "SageMaker Training",
    title: "How would you train a model using SageMaker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q51,
    code: "",
  },

  {
    id: "52-what-data-would-come-from-s3",
    category: "SageMaker Training",
    title: "What data would come from S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q52,
    code: "",
  },

  {
    id: "53-how-would-glue-prepare-training-data-for-sagemaker",
    category: "SageMaker Training",
    title: "How would Glue prepare training data for SageMaker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q53,
    code: "",
  },

  {
    id: "54-explain-s3-glue-sagemaker-training",
    category: "SageMaker Training",
    title: "Explain S3 → Glue → SageMaker Training.",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q54,
    code: "",
  },

  {
    id: "55-how-would-you-perform-distributed-training",
    category: "SageMaker Training",
    title: "How would you perform distributed training?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q55,
    code: "",
  },

  {
    id: "56-how-would-you-select-sagemaker-instance-types",
    category: "SageMaker Training",
    title: "How would you select SageMaker instance types?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q56,
    code: "",
  },

  {
    id: "57-how-would-you-manage-training-datasets",
    category: "SageMaker Training",
    title: "How would you manage training datasets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q57,
    code: "",
  },

  {
    id: "58-how-would-you-track-experiments",
    category: "SageMaker Training",
    title: "How would you track experiments?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q58,
    code: "",
  },

  {
    id: "59-how-would-you-version-models",
    category: "SageMaker Training",
    title: "How would you version models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q59,
    code: "",
  },

  {
    id: "60-how-would-you-reproduce-a-previous-training-run",
    category: "SageMaker Training",
    title: "How would you reproduce a previous training run?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q60,
    code: "",
  },

  {
    id: "61-explain-a-sagemaker-mlops-pipeline",
    category: "SageMaker Pipelines / MLOps",
    title: "Explain a SageMaker MLOps pipeline.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q61,
    code: "",
  },

  {
    id: "62-how-would-you-automate-model-training",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you automate model training?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q62,
    code: "",
  },

  {
    id: "63-how-would-you-implement-model-validation",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you implement model validation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q63,
    code: "",
  },

  {
    id: "64-how-would-you-implement-model-evaluation",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you implement model evaluation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q64,
    code: "",
  },

  {
    id: "65-how-would-you-implement-model-approval",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you implement model approval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q65,
    code: "",
  },

  {
    id: "66-what-is-sagemaker-model-registry",
    category: "SageMaker Pipelines / MLOps",
    title: "What is SageMaker Model Registry?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q66,
    code: "",
  },

  {
    id: "67-how-would-you-promote-a-model-from-dev-test-production",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you promote a model from dev → test → production?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q67,
    code: "",
  },

  {
    id: "68-how-would-you-implement-model-rollback",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you implement model rollback?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q68,
    code: "",
  },

  {
    id: "69-how-would-you-detect-model-drift",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you detect model drift?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q69,
    code: "",
  },

  {
    id: "70-how-would-you-detect-data-drift",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you detect data drift?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q70,
    code: "",
  },

  {
    id: "71-how-would-you-monitor-model-quality",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you monitor model quality?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q71,
    code: "",
  },

  {
    id: "72-how-would-you-perform-continuous-training",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you perform continuous training?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q72,
    code: "",
  },

  {
    id: "73-how-would-you-integrate-sagemaker-with-ci-cd",
    category: "SageMaker Pipelines / MLOps",
    title: "How would you integrate SageMaker with CI/CD?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q73,
    code: "",
  },

  {
    id: "74-why-use-bedrock-for-llm-inference-but-sagemaker-for-another-ml-model",
    category: "SageMaker + CWD Agentic AI",
    title: "Why use Bedrock for LLM inference but SageMaker for another ML model?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q74,
    code: "",
  },

  {
    id: "75-how-would-you-decide-whether-a-model-belongs-in-bedrock-or-sagemaker",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you decide whether a model belongs in Bedrock or SageMaker?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q75,
    code: "",
  },

  {
    id: "76-how-would-a-worker-call-a-sagemaker-endpoint",
    category: "SageMaker + CWD Agentic AI",
    title: "How would a Worker call a SageMaker endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q76,
    code: "",
  },

  {
    id: "77-how-would-you-handle-sagemaker-inference-latency",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you handle SageMaker inference latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q77,
    code: "",
  },

  {
    id: "78-how-would-you-scale-sagemaker-endpoints",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you scale SageMaker endpoints?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q78,
    code: "",
  },

  {
    id: "79-real-time-vs-asynchronous-sagemaker-inference",
    category: "SageMaker + CWD Agentic AI",
    title: "Real-time vs asynchronous SageMaker inference?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q79,
    code: "",
  },

  {
    id: "80-when-would-you-use-sagemaker-serverless-inference",
    category: "SageMaker + CWD Agentic AI",
    title: "When would you use SageMaker Serverless Inference?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q80,
    code: "",
  },

  {
    id: "81-when-would-you-use-sagemaker-asynchronous-inference",
    category: "SageMaker + CWD Agentic AI",
    title: "When would you use SageMaker Asynchronous Inference?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q81,
    code: "",
  },

  {
    id: "82-how-would-you-implement-autoscaling",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you implement autoscaling?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q82,
    code: "",
  },

  {
    id: "83-how-would-you-handle-endpoint-throttling",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you handle endpoint throttling?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q83,
    code: "",
  },

  {
    id: "84-how-would-you-implement-model-fallback",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you implement model fallback?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q84,
    code: "",
  },

  {
    id: "85-how-would-you-perform-a-b-testing-between-models",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you perform A/B testing between models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q85,
    code: "",
  },

  {
    id: "86-how-would-you-perform-canary-deployment",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you perform canary deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q86,
    code: "",
  },

  {
    id: "87-how-would-you-monitor-inference-cost",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you monitor inference cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q87,
    code: "",
  },

  {
    id: "88-how-would-you-optimize-inference-latency",
    category: "SageMaker + CWD Agentic AI",
    title: "How would you optimize inference latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q88,
    code: "",
  },

];

export default function AWSSageMakerQuestionPage() {
  return (
    <CookbookApp
      data={AWSSageMakerQuestion}
      title="Amazon SageMaker Cookbook"
      subtitle="Training, pipelines, MLOps, endpoints and inference strategy"
      icon="🤖"
      patternLabel="Questions"
    />
  );
}
