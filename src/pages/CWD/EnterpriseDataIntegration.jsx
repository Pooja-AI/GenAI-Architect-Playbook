import CookbookApp from "../../components/CookbookApp";

const EnterpriseDataIntegration = [
  // =====================================================
  // 14. ENTERPRISE DATA INTEGRATION
  // =====================================================

  {
    id: "cwd-data-integration",
    category: "Enterprise Data Integration",
    title: "Enterprise Data Integration",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Understand how CWD securely connects Coordinator, Delegator, and Worker agents to enterprise applications, structured and unstructured data sources, external services, and governed connectors while enforcing authorization, data-access policies, and security controls.",

  },
      {
        id: "snowflake",
        category: "Enterprise Data Integration",
        title: "Snowflake",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD integrates with Snowflake for governed access to enterprise analytics data, including secure querying, authorization, data filtering, and using business data as context for agent workflows.",
        concept: "",
        code: "",
      },

      {
        id: "salesforce",
        category: "Enterprise Data Integration",
        title: "Salesforce",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how Worker agents securely access Salesforce customer, account, opportunity, and activity information through approved APIs or tools while respecting user permissions and enterprise data-access policies.",
        concept: "",
        code: "",
      },

      {
        id: "oracle",
        category: "Enterprise Data Integration",
        title: "Oracle",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD integrates with Oracle enterprise systems and databases to retrieve governed business data, execute approved queries or operations, and expose relevant information to authorized agents.",
        concept: "",
        code: "",
      },

      {
        id: "sharepoint",
        category: "Enterprise Data Integration",
        title: "SharePoint",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD integrates with SharePoint documents, sites, and knowledge repositories for enterprise search and RAG, including document retrieval, indexing, metadata filtering, permissions, and source attribution.",
        concept: "",
        code: "",
      },

      {
        id: "outlook-m365",
        category: "Enterprise Data Integration",
        title: "Outlook / M365",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD can integrate with Microsoft 365 and Outlook services to access approved emails, calendars, documents, and collaboration data while enforcing identity, authorization, privacy, and data-access boundaries.",
        concept: "",
        code: "",
      },

      {
        id: "hr-systems",
        category: "Enterprise Data Integration",
        title: "HR Systems",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD integrates with HR systems through governed interfaces while protecting sensitive employee information, enforcing role-based access, limiting data exposure, and ensuring agents only access authorized information.",
        concept: "",
        code: "",
      },

      {
        id: "finance-systems",
        category: "Enterprise Data Integration",
        title: "Finance Systems",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how CWD connects to enterprise finance systems for approved financial data retrieval and business workflows while enforcing authorization, data classification, auditability, and strict access controls.",
        concept: "",
        code: "",
      },

      {
        id: "marketing-data",
        category: "Enterprise Data Integration",
        title: "Marketing Data",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how marketing data from campaigns, customer insights, product information, and analytics platforms can be integrated into CWD workflows and made available to authorized domain Workers.",
        concept: "",
        code: "",
      },

      {
        id: "web-search",
        category: "Enterprise Data Integration",
        title: "Web Search",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how controlled external web search can complement enterprise knowledge by retrieving current public information while applying approved domains, query restrictions, source validation, security policies, and hallucination controls.",
        concept: "",
        code: "",
      },

      {
        id: "governed-connectors",
        category: "Enterprise Data Integration",
        title: "Governed Connectors",
        difficulty: "Advanced",
        time: "~15 min",
        description:
          "Understand how governed connectors provide a standardized and secure integration layer between CWD agents and enterprise systems, including authentication, authorization, secrets management, tool permissions, data filtering, auditing, rate limiting, and policy enforcement.",
        concept: "",
        code: "",
      },
   
];

export default function EnterpriseDataIntegrationPage() {
  return (
    <CookbookApp
      data={EnterpriseDataIntegration}
      title="Enterprise Data Integration Cookbook"
      subtitle="Enterprise systems, governed connectors, data access and secure integration"
      icon="🔌"
      patternLabel="Topics"
    />
  );
}

