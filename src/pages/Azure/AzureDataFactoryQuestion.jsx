import CookbookApp from "../../components/CookbookApp";

import Q65 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/065-why-azure-data-factory.md?raw";
import Q66 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/066-how-would-you-ingest-salesforce-data.md?raw";
import Q67 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/067-how-would-you-ingest-servicenow-data.md?raw";
import Q68 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/068-how-would-you-ingest-oracle-data.md?raw";
import Q69 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/069-how-would-you-ingest-sharepoint-m365-data.md?raw";
import Q70 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/070-how-would-you-implement-incremental-ingestion.md?raw";
import Q71 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/071-full-load-vs-incremental-load.md?raw";
import Q72 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/072-how-would-you-handle-schema-changes.md?raw";
import Q73 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/073-how-would-you-handle-duplicate-records.md?raw";
import Q74 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/074-how-would-you-handle-deleted-records.md?raw";
import Q75 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/075-how-would-you-schedule-pipelines.md?raw";
import Q76 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/076-how-would-you-monitor-failed-pipelines.md?raw";
import Q77 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/077-adf-vs-azure-functions.md?raw";
import Q78 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/078-adf-vs-databricks.md?raw";
import Q79 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/079-how-would-you-secure-adf-connections.md?raw";
import Q80 from "../../assets/docs/azure-interview-questions/05-azure-data-factory-data-integration/080-how-would-you-implement-data-lineage.md?raw";

const AzureDataFactoryQuestion = [
  {
    id: "065-why-azure-data-factory",
    category: "Azure Data Factory / Data Integration",
    title: "Why Azure Data Factory?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q65,
    code: "",
  },

  {
    id: "066-how-would-you-ingest-salesforce-data",
    category: "Azure Data Factory / Data Integration",
    title: "How would you ingest Salesforce data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q66,
    code: "",
  },

  {
    id: "067-how-would-you-ingest-servicenow-data",
    category: "Azure Data Factory / Data Integration",
    title: "How would you ingest ServiceNow data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q67,
    code: "",
  },

  {
    id: "068-how-would-you-ingest-oracle-data",
    category: "Azure Data Factory / Data Integration",
    title: "How would you ingest Oracle data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q68,
    code: "",
  },

  {
    id: "069-how-would-you-ingest-sharepoint-m365-data",
    category: "Azure Data Factory / Data Integration",
    title: "How would you ingest SharePoint/M365 data?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q69,
    code: "",
  },

  {
    id: "070-how-would-you-implement-incremental-ingestion",
    category: "Azure Data Factory / Data Integration",
    title: "How would you implement incremental ingestion?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q70,
    code: "",
  },

  {
    id: "071-full-load-vs-incremental-load",
    category: "Azure Data Factory / Data Integration",
    title: "Full load vs incremental load?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q71,
    code: "",
  },

  {
    id: "072-how-would-you-handle-schema-changes",
    category: "Azure Data Factory / Data Integration",
    title: "How would you handle schema changes?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q72,
    code: "",
  },

  {
    id: "073-how-would-you-handle-duplicate-records",
    category: "Azure Data Factory / Data Integration",
    title: "How would you handle duplicate records?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q73,
    code: "",
  },

  {
    id: "074-how-would-you-handle-deleted-records",
    category: "Azure Data Factory / Data Integration",
    title: "How would you handle deleted records?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q74,
    code: "",
  },

  {
    id: "075-how-would-you-schedule-pipelines",
    category: "Azure Data Factory / Data Integration",
    title: "How would you schedule pipelines?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q75,
    code: "",
  },

  {
    id: "076-how-would-you-monitor-failed-pipelines",
    category: "Azure Data Factory / Data Integration",
    title: "How would you monitor failed pipelines?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q76,
    code: "",
  },

  {
    id: "077-adf-vs-azure-functions",
    category: "Azure Data Factory / Data Integration",
    title: "ADF vs Azure Functions?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q77,
    code: "",
  },

  {
    id: "078-adf-vs-databricks",
    category: "Azure Data Factory / Data Integration",
    title: "ADF vs Databricks?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q78,
    code: "",
  },

  {
    id: "079-how-would-you-secure-adf-connections",
    category: "Azure Data Factory / Data Integration",
    title: "How would you secure ADF connections?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q79,
    code: "",
  },

  {
    id: "080-how-would-you-implement-data-lineage",
    category: "Azure Data Factory / Data Integration",
    title: "How would you implement data lineage?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q80,
    code: "",
  },

];

export default function AzureDataFactoryQuestionPage() {
  return (
    <CookbookApp
      data={AzureDataFactoryQuestion}
      title="Azure Data Factory Cookbook"
      subtitle="Enterprise ingestion, incremental loads, schema changes and lineage"
      icon="🔄"
      patternLabel="Questions"
    />
  );
}
