import CookbookApp from "../../components/CookbookApp";

import Q81 from "../../assets/docs/azure-interview-questions/06-azure-databricks/081-why-use-azure-databricks-in-cwd.md?raw";
import Q82 from "../../assets/docs/azure-interview-questions/06-azure-databricks/082-what-workloads-would-you-run-in-databricks.md?raw";
import Q83 from "../../assets/docs/azure-interview-questions/06-azure-databricks/083-how-would-databricks-process-enterprise-data.md?raw";
import Q84 from "../../assets/docs/azure-interview-questions/06-azure-databricks/084-how-would-you-implement-etl.md?raw";
import Q85 from "../../assets/docs/azure-interview-questions/06-azure-databricks/085-how-would-you-implement-incremental-processing.md?raw";
import Q86 from "../../assets/docs/azure-interview-questions/06-azure-databricks/086-how-would-you-handle-large-datasets.md?raw";
import Q87 from "../../assets/docs/azure-interview-questions/06-azure-databricks/087-what-is-delta-lake.md?raw";
import Q88 from "../../assets/docs/azure-interview-questions/06-azure-databricks/088-why-use-delta-lake.md?raw";
import Q89 from "../../assets/docs/azure-interview-questions/06-azure-databricks/089-how-would-you-handle-schema-evolution.md?raw";
import Q90 from "../../assets/docs/azure-interview-questions/06-azure-databricks/090-how-would-you-optimize-spark-jobs.md?raw";
import Q91 from "../../assets/docs/azure-interview-questions/06-azure-databricks/091-how-would-you-partition-data.md?raw";
import Q92 from "../../assets/docs/azure-interview-questions/06-azure-databricks/092-how-would-you-monitor-databricks-jobs.md?raw";
import Q93 from "../../assets/docs/azure-interview-questions/06-azure-databricks/093-databricks-vs-azure-data-factory.md?raw";
import Q94 from "../../assets/docs/azure-interview-questions/06-azure-databricks/094-databricks-vs-azure-ml.md?raw";
import Q95 from "../../assets/docs/azure-interview-questions/06-azure-databricks/095-how-would-you-integrate-databricks-with-azure-ai-search.md?raw";

const AzureDatabricksQuestion = [
  {
    id: "081-why-use-azure-databricks-in-cwd",
    category: "Azure Databricks",
    title: "Why use Azure Databricks in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q81,
    code: "",
  },

  {
    id: "082-what-workloads-would-you-run-in-databricks",
    category: "Azure Databricks",
    title: "What workloads would you run in Databricks?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q82,
    code: "",
  },

  {
    id: "083-how-would-databricks-process-enterprise-data",
    category: "Azure Databricks",
    title: "How would Databricks process enterprise data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q83,
    code: "",
  },

  {
    id: "084-how-would-you-implement-etl",
    category: "Azure Databricks",
    title: "How would you implement ETL?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q84,
    code: "",
  },

  {
    id: "085-how-would-you-implement-incremental-processing",
    category: "Azure Databricks",
    title: "How would you implement incremental processing?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q85,
    code: "",
  },

  {
    id: "086-how-would-you-handle-large-datasets",
    category: "Azure Databricks",
    title: "How would you handle large datasets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q86,
    code: "",
  },

  {
    id: "087-what-is-delta-lake",
    category: "Azure Databricks",
    title: "What is Delta Lake?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q87,
    code: "",
  },

  {
    id: "088-why-use-delta-lake",
    category: "Azure Databricks",
    title: "Why use Delta Lake?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q88,
    code: "",
  },

  {
    id: "089-how-would-you-handle-schema-evolution",
    category: "Azure Databricks",
    title: "How would you handle schema evolution?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q89,
    code: "",
  },

  {
    id: "090-how-would-you-optimize-spark-jobs",
    category: "Azure Databricks",
    title: "How would you optimize Spark jobs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q90,
    code: "",
  },

  {
    id: "091-how-would-you-partition-data",
    category: "Azure Databricks",
    title: "How would you partition data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q91,
    code: "",
  },

  {
    id: "092-how-would-you-monitor-databricks-jobs",
    category: "Azure Databricks",
    title: "How would you monitor Databricks jobs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q92,
    code: "",
  },

  {
    id: "093-databricks-vs-azure-data-factory",
    category: "Azure Databricks",
    title: "Databricks vs Azure Data Factory?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q93,
    code: "",
  },

  {
    id: "094-databricks-vs-azure-ml",
    category: "Azure Databricks",
    title: "Databricks vs Azure ML?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q94,
    code: "",
  },

  {
    id: "095-how-would-you-integrate-databricks-with-azure-ai-search",
    category: "Azure Databricks",
    title: "How would you integrate Databricks with Azure AI Search?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q95,
    code: "",
  },

];

export default function AzureDatabricksQuestionPage() {
  return (
    <CookbookApp
      data={AzureDatabricksQuestion}
      title="Azure Databricks Cookbook"
      subtitle="Spark ETL, Delta Lake, schema evolution and AI Search integration"
      icon="🧱"
      patternLabel="Questions"
    />
  );
}
