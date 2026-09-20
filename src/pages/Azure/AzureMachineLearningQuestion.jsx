import CookbookApp from "../../components/CookbookApp";

import Q96 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/096-why-azure-machine-learning-in-cwd.md?raw";
import Q97 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/097-azure-ml-vs-azure-openai.md?raw";
import Q98 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/098-when-would-you-use-azure-ml-instead-of-azure-openai.md?raw";
import Q99 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/099-what-models-would-you-train-using-azure-ml.md?raw";
import Q100 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/100-how-would-you-train-a-custom-ml-model.md?raw";
import Q101 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/101-how-would-azure-ml-consume-data-from-azure-data-lake-s3-equivalent-storage.md?raw";
import Q102 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/102-how-would-you-create-an-azure-ml-training-pipeline.md?raw";
import Q103 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/103-how-would-you-track-experiments.md?raw";
import Q104 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/104-how-would-you-version-models.md?raw";
import Q105 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/105-what-is-an-azure-ml-model-registry.md?raw";
import Q106 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/106-how-would-you-deploy-a-model-to-an-online-endpoint.md?raw";
import Q107 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/107-managed-online-endpoint-vs-batch-endpoint.md?raw";
import Q108 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/108-how-would-a-cwd-worker-call-an-azure-ml-endpoint.md?raw";
import Q109 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/109-how-would-you-secure-the-endpoint.md?raw";
import Q110 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/110-how-would-you-scale-an-azure-ml-endpoint.md?raw";
import Q111 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/111-how-would-you-monitor-inference-latency.md?raw";
import Q112 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/112-how-would-you-detect-data-drift.md?raw";
import Q113 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/113-how-would-you-detect-model-drift.md?raw";
import Q114 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/114-how-would-you-implement-continuous-training.md?raw";
import Q115 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/115-how-would-you-implement-model-approval.md?raw";
import Q116 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/116-how-would-you-perform-model-rollback.md?raw";
import Q117 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/117-how-would-you-implement-a-b-testing.md?raw";
import Q118 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/118-how-would-you-implement-canary-deployment.md?raw";
import Q119 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/119-how-would-you-integrate-azure-ml-with-azure-devops.md?raw";
import Q120 from "../../assets/docs/azure-interview-questions/07-azure-machine-learning/120-how-would-you-reduce-azure-ml-inference-cost.md?raw";

const AzureMachineLearningQuestion = [
  {
    id: "096-why-azure-machine-learning-in-cwd",
    category: "Azure Machine Learning",
    title: "Why Azure Machine Learning in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q96,
    code: "",
  },

  {
    id: "097-azure-ml-vs-azure-openai",
    category: "Azure Machine Learning",
    title: "Azure ML vs Azure OpenAI?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q97,
    code: "",
  },

  {
    id: "098-when-would-you-use-azure-ml-instead-of-azure-openai",
    category: "Azure Machine Learning",
    title: "When would you use Azure ML instead of Azure OpenAI?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q98,
    code: "",
  },

  {
    id: "099-what-models-would-you-train-using-azure-ml",
    category: "Azure Machine Learning",
    title: "What models would you train using Azure ML?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q99,
    code: "",
  },

  {
    id: "100-how-would-you-train-a-custom-ml-model",
    category: "Azure Machine Learning",
    title: "How would you train a custom ML model?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q100,
    code: "",
  },

  {
    id: "101-how-would-azure-ml-consume-data-from-azure-data-lake-s3-equivalent-storage",
    category: "Azure Machine Learning",
    title: "How would Azure ML consume data from Azure Data Lake/S3-equivalent storage?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q101,
    code: "",
  },

  {
    id: "102-how-would-you-create-an-azure-ml-training-pipeline",
    category: "Azure Machine Learning",
    title: "How would you create an Azure ML training pipeline?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q102,
    code: "",
  },

  {
    id: "103-how-would-you-track-experiments",
    category: "Azure Machine Learning",
    title: "How would you track experiments?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q103,
    code: "",
  },

  {
    id: "104-how-would-you-version-models",
    category: "Azure Machine Learning",
    title: "How would you version models?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q104,
    code: "",
  },

  {
    id: "105-what-is-an-azure-ml-model-registry",
    category: "Azure Machine Learning",
    title: "What is an Azure ML Model Registry?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q105,
    code: "",
  },

  {
    id: "106-how-would-you-deploy-a-model-to-an-online-endpoint",
    category: "Azure Machine Learning",
    title: "How would you deploy a model to an online endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q106,
    code: "",
  },

  {
    id: "107-managed-online-endpoint-vs-batch-endpoint",
    category: "Azure Machine Learning",
    title: "Managed online endpoint vs batch endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q107,
    code: "",
  },

  {
    id: "108-how-would-a-cwd-worker-call-an-azure-ml-endpoint",
    category: "Azure Machine Learning",
    title: "How would a CWD Worker call an Azure ML endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q108,
    code: "",
  },

  {
    id: "109-how-would-you-secure-the-endpoint",
    category: "Azure Machine Learning",
    title: "How would you secure the endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q109,
    code: "",
  },

  {
    id: "110-how-would-you-scale-an-azure-ml-endpoint",
    category: "Azure Machine Learning",
    title: "How would you scale an Azure ML endpoint?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q110,
    code: "",
  },

  {
    id: "111-how-would-you-monitor-inference-latency",
    category: "Azure Machine Learning",
    title: "How would you monitor inference latency?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q111,
    code: "",
  },

  {
    id: "112-how-would-you-detect-data-drift",
    category: "Azure Machine Learning",
    title: "How would you detect data drift?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q112,
    code: "",
  },

  {
    id: "113-how-would-you-detect-model-drift",
    category: "Azure Machine Learning",
    title: "How would you detect model drift?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q113,
    code: "",
  },

  {
    id: "114-how-would-you-implement-continuous-training",
    category: "Azure Machine Learning",
    title: "How would you implement continuous training?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q114,
    code: "",
  },

  {
    id: "115-how-would-you-implement-model-approval",
    category: "Azure Machine Learning",
    title: "How would you implement model approval?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q115,
    code: "",
  },

  {
    id: "116-how-would-you-perform-model-rollback",
    category: "Azure Machine Learning",
    title: "How would you perform model rollback?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q116,
    code: "",
  },

  {
    id: "117-how-would-you-implement-a-b-testing",
    category: "Azure Machine Learning",
    title: "How would you implement A/B testing?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q117,
    code: "",
  },

  {
    id: "118-how-would-you-implement-canary-deployment",
    category: "Azure Machine Learning",
    title: "How would you implement canary deployment?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q118,
    code: "",
  },

  {
    id: "119-how-would-you-integrate-azure-ml-with-azure-devops",
    category: "Azure Machine Learning",
    title: "How would you integrate Azure ML with Azure DevOps?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q119,
    code: "",
  },

  {
    id: "120-how-would-you-reduce-azure-ml-inference-cost",
    category: "Azure Machine Learning",
    title: "How would you reduce Azure ML inference cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q120,
    code: "",
  },

];

export default function AzureMachineLearningQuestionPage() {
  return (
    <CookbookApp
      data={AzureMachineLearningQuestion}
      title="Azure Machine Learning Cookbook"
      subtitle="Training, registry, endpoints, drift, MLOps and inference cost"
      icon="🤖"
      patternLabel="Questions"
    />
  );
}
