import CookbookApp from "../../components/CookbookApp";

import Q1 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/01-why-did-you-use-aws-glue-in-cwd.md?raw";
import Q2 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/02-what-data-sources-would-cwd-ingest-using-glue.md?raw";
import Q3 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/03-how-would-glue-ingest-data-from-salesforce.md?raw";
import Q4 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/04-how-would-glue-ingest-data-from-servicenow.md?raw";
import Q5 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/05-how-would-glue-ingest-data-from-s3.md?raw";
import Q6 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/06-how-would-glue-integrate-data-from-oracle-snowflake.md?raw";
import Q7 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/07-what-is-a-glue-data-catalog.md?raw";
import Q8 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/08-what-metadata-would-you-maintain-in-glue-data-catalog.md?raw";
import Q9 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/09-glue-crawler-vs-glue-etl-job.md?raw";
import Q10 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/10-how-does-a-glue-crawler-discover-schemas.md?raw";
import Q11 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/11-how-would-you-handle-schema-changes.md?raw";
import Q12 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/12-how-would-you-implement-incremental-data-ingestion.md?raw";
import Q13 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/13-full-load-vs-incremental-load.md?raw";
import Q14 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/14-how-would-you-identify-new-or-changed-records.md?raw";
import Q15 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/15-how-would-you-handle-deleted-records.md?raw";
import Q16 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/16-how-would-you-handle-duplicate-records.md?raw";
import Q17 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/17-how-would-you-partition-data-in-s3.md?raw";
import Q18 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/18-why-use-parquet-instead-of-csv.md?raw";
import Q19 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/19-how-would-you-optimize-glue-etl-performance.md?raw";
import Q20 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/01-data-integration-and-etl/20-how-would-you-handle-very-large-datasets.md?raw";
import Q21 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/21-explain-s3-glue-opensearch-architecture.md?raw";
import Q22 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/22-how-would-glue-prepare-enterprise-documents-for-rag.md?raw";
import Q23 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/23-where-would-document-preprocessing-happen.md?raw";
import Q24 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/24-where-would-chunking-happen.md?raw";
import Q25 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/25-where-would-metadata-extraction-happen.md?raw";
import Q26 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/26-how-would-you-maintain-document-lineage.md?raw";
import Q27 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/27-how-would-you-identify-the-source-system-for-each-document.md?raw";
import Q28 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/28-how-would-you-attach-acl-metadata-to-documents.md?raw";
import Q29 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/29-how-would-you-prevent-unauthorized-documents-from-entering-the-rag-index.md?raw";
import Q30 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/30-how-would-you-handle-document-updates.md?raw";
import Q31 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/31-how-would-you-handle-document-deletion.md?raw";
import Q32 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/32-how-would-glue-trigger-downstream-processing.md?raw";
import Q33 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/33-glue-vs-lambda-for-data-transformation.md?raw";
import Q34 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/34-glue-vs-emr.md?raw";
import Q35 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/35-how-would-you-monitor-glue-jobs.md?raw";
import Q36 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/36-how-would-you-troubleshoot-a-failed-glue-job.md?raw";
import Q37 from "../../assets/docs/aws-interview-questions/aws-glue-sagemaker/aws-glue/02-glue-cwd-rag/37-how-would-you-optimize-glue-cost.md?raw";

const AWSGlueQuestion = [
  {
    id: "01-why-did-you-use-aws-glue-in-cwd",
    category: "Data Integration & ETL",
    title: "Why did you use AWS Glue in CWD?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q1,
    code: "",
  },

  {
    id: "02-what-data-sources-would-cwd-ingest-using-glue",
    category: "Data Integration & ETL",
    title: "What data sources would CWD ingest using Glue?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q2,
    code: "",
  },

  {
    id: "03-how-would-glue-ingest-data-from-salesforce",
    category: "Data Integration & ETL",
    title: "How would Glue ingest data from Salesforce?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q3,
    code: "",
  },

  {
    id: "04-how-would-glue-ingest-data-from-servicenow",
    category: "Data Integration & ETL",
    title: "How would Glue ingest data from ServiceNow?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q4,
    code: "",
  },

  {
    id: "05-how-would-glue-ingest-data-from-s3",
    category: "Data Integration & ETL",
    title: "How would Glue ingest data from S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q5,
    code: "",
  },

  {
    id: "06-how-would-glue-integrate-data-from-oracle-snowflake",
    category: "Data Integration & ETL",
    title: "How would Glue integrate data from Oracle/Snowflake?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q6,
    code: "",
  },

  {
    id: "07-what-is-a-glue-data-catalog",
    category: "Data Integration & ETL",
    title: "What is a Glue Data Catalog?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q7,
    code: "",
  },

  {
    id: "08-what-metadata-would-you-maintain-in-glue-data-catalog",
    category: "Data Integration & ETL",
    title: "What metadata would you maintain in Glue Data Catalog?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q8,
    code: "",
  },

  {
    id: "09-glue-crawler-vs-glue-etl-job",
    category: "Data Integration & ETL",
    title: "Glue Crawler vs Glue ETL job?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q9,
    code: "",
  },

  {
    id: "10-how-does-a-glue-crawler-discover-schemas",
    category: "Data Integration & ETL",
    title: "How does a Glue Crawler discover schemas?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q10,
    code: "",
  },

  {
    id: "11-how-would-you-handle-schema-changes",
    category: "Data Integration & ETL",
    title: "How would you handle schema changes?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q11,
    code: "",
  },

  {
    id: "12-how-would-you-implement-incremental-data-ingestion",
    category: "Data Integration & ETL",
    title: "How would you implement incremental data ingestion?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q12,
    code: "",
  },

  {
    id: "13-full-load-vs-incremental-load",
    category: "Data Integration & ETL",
    title: "Full load vs incremental load?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q13,
    code: "",
  },

  {
    id: "14-how-would-you-identify-new-or-changed-records",
    category: "Data Integration & ETL",
    title: "How would you identify new or changed records?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q14,
    code: "",
  },

  {
    id: "15-how-would-you-handle-deleted-records",
    category: "Data Integration & ETL",
    title: "How would you handle deleted records?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q15,
    code: "",
  },

  {
    id: "16-how-would-you-handle-duplicate-records",
    category: "Data Integration & ETL",
    title: "How would you handle duplicate records?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q16,
    code: "",
  },

  {
    id: "17-how-would-you-partition-data-in-s3",
    category: "Data Integration & ETL",
    title: "How would you partition data in S3?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q17,
    code: "",
  },

  {
    id: "18-why-use-parquet-instead-of-csv",
    category: "Data Integration & ETL",
    title: "Why use Parquet instead of CSV?",
    difficulty: "Intermediate",
    time: "~10 min",
    concept: Q18,
    code: "",
  },

  {
    id: "19-how-would-you-optimize-glue-etl-performance",
    category: "Data Integration & ETL",
    title: "How would you optimize Glue ETL performance?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q19,
    code: "",
  },

  {
    id: "20-how-would-you-handle-very-large-datasets",
    category: "Data Integration & ETL",
    title: "How would you handle very large datasets?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q20,
    code: "",
  },

  {
    id: "21-explain-s3-glue-opensearch-architecture",
    category: "Glue + CWD RAG",
    title: "Explain S3 → Glue → OpenSearch architecture.",
    difficulty: "Advanced",
    time: "~20 min",
    concept: Q21,
    code: "",
  },

  {
    id: "22-how-would-glue-prepare-enterprise-documents-for-rag",
    category: "Glue + CWD RAG",
    title: "How would Glue prepare enterprise documents for RAG?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q22,
    code: "",
  },

  {
    id: "23-where-would-document-preprocessing-happen",
    category: "Glue + CWD RAG",
    title: "Where would document preprocessing happen?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q23,
    code: "",
  },

  {
    id: "24-where-would-chunking-happen",
    category: "Glue + CWD RAG",
    title: "Where would chunking happen?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q24,
    code: "",
  },

  {
    id: "25-where-would-metadata-extraction-happen",
    category: "Glue + CWD RAG",
    title: "Where would metadata extraction happen?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q25,
    code: "",
  },

  {
    id: "26-how-would-you-maintain-document-lineage",
    category: "Glue + CWD RAG",
    title: "How would you maintain document lineage?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q26,
    code: "",
  },

  {
    id: "27-how-would-you-identify-the-source-system-for-each-document",
    category: "Glue + CWD RAG",
    title: "How would you identify the source system for each document?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q27,
    code: "",
  },

  {
    id: "28-how-would-you-attach-acl-metadata-to-documents",
    category: "Glue + CWD RAG",
    title: "How would you attach ACL metadata to documents?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q28,
    code: "",
  },

  {
    id: "29-how-would-you-prevent-unauthorized-documents-from-entering-the-rag-index",
    category: "Glue + CWD RAG",
    title: "How would you prevent unauthorized documents from entering the RAG index?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q29,
    code: "",
  },

  {
    id: "30-how-would-you-handle-document-updates",
    category: "Glue + CWD RAG",
    title: "How would you handle document updates?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q30,
    code: "",
  },

  {
    id: "31-how-would-you-handle-document-deletion",
    category: "Glue + CWD RAG",
    title: "How would you handle document deletion?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q31,
    code: "",
  },

  {
    id: "32-how-would-glue-trigger-downstream-processing",
    category: "Glue + CWD RAG",
    title: "How would Glue trigger downstream processing?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q32,
    code: "",
  },

  {
    id: "33-glue-vs-lambda-for-data-transformation",
    category: "Glue + CWD RAG",
    title: "Glue vs Lambda for data transformation?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q33,
    code: "",
  },

  {
    id: "34-glue-vs-emr",
    category: "Glue + CWD RAG",
    title: "Glue vs EMR?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q34,
    code: "",
  },

  {
    id: "35-how-would-you-monitor-glue-jobs",
    category: "Glue + CWD RAG",
    title: "How would you monitor Glue jobs?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q35,
    code: "",
  },

  {
    id: "36-how-would-you-troubleshoot-a-failed-glue-job",
    category: "Glue + CWD RAG",
    title: "How would you troubleshoot a failed Glue job?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q36,
    code: "",
  },

  {
    id: "37-how-would-you-optimize-glue-cost",
    category: "Glue + CWD RAG",
    title: "How would you optimize Glue cost?",
    difficulty: "Advanced",
    time: "~15 min",
    concept: Q37,
    code: "",
  },

];

export default function AWSGlueQuestionPage() {
  return (
    <CookbookApp
      data={AWSGlueQuestion}
      title="AWS Glue Cookbook"
      subtitle="ETL, Data Catalog, incremental ingestion and RAG data preparation"
      icon="🧪"
      patternLabel="Questions"
    />
  );
}
