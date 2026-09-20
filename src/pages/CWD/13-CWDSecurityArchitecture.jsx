import CookbookApp from "../../components/CookbookApp";
import Q293 from "../../assets/CWD/docs/13-security-architecture/293-how-is-cwd-authenticated.md?raw";
import Q294 from "../../assets/CWD/docs/13-security-architecture/294-how-is-authorization-implemented.md?raw";
import Q295 from "../../assets/CWD/docs/13-security-architecture/295-why-use-microsoft-entra-id.md?raw";
import Q296 from "../../assets/CWD/docs/13-security-architecture/296-what-is-managed-identity.md?raw";
import Q297 from "../../assets/CWD/docs/13-security-architecture/297-managed-identity-vs-client-secret.md?raw";
import Q298 from "../../assets/CWD/docs/13-security-architecture/298-how-to-implement-rbac.md?raw";
import Q299 from "../../assets/CWD/docs/13-security-architecture/299-what-is-least-privilege.md?raw";
import Q300 from "../../assets/CWD/docs/13-security-architecture/300-how-to-protect-enterprise-data.md?raw";
import Q301 from "../../assets/CWD/docs/13-security-architecture/301-how-to-protect-pii.md?raw";
import Q302 from "../../assets/CWD/docs/13-security-architecture/302-how-to-implement-dlp.md?raw";
import Q303 from "../../assets/CWD/docs/13-security-architecture/303-how-to-secure-prompts.md?raw";
import Q304 from "../../assets/CWD/docs/13-security-architecture/304-how-to-prevent-prompt-injection.md?raw";
import Q305 from "../../assets/CWD/docs/13-security-architecture/305-how-to-prevent-indirect-prompt-injection.md?raw";
import Q306 from "../../assets/CWD/docs/13-security-architecture/306-how-to-prevent-data-exfiltration.md?raw";
import Q307 from "../../assets/CWD/docs/13-security-architecture/307-how-to-prevent-unauthorized-tool-access.md?raw";
import Q308 from "../../assets/CWD/docs/13-security-architecture/308-how-to-secure-mcp.md?raw";
import Q309 from "../../assets/CWD/docs/13-security-architecture/309-how-to-secure-a2a.md?raw";
import Q310 from "../../assets/CWD/docs/13-security-architecture/310-how-to-secure-apis.md?raw";
import Q311 from "../../assets/CWD/docs/13-security-architecture/311-how-to-protect-secrets.md?raw";
import Q312 from "../../assets/CWD/docs/13-security-architecture/312-why-use-key-vault.md?raw";
import Q313 from "../../assets/CWD/docs/13-security-architecture/313-how-to-rotate-secrets.md?raw";
import Q314 from "../../assets/CWD/docs/13-security-architecture/314-how-to-encrypt-data-at-rest.md?raw";
import Q315 from "../../assets/CWD/docs/13-security-architecture/315-how-to-encrypt-data-in-transit.md?raw";
import Q316 from "../../assets/CWD/docs/13-security-architecture/316-what-is-your-network-architecture.md?raw";
import Q317 from "../../assets/CWD/docs/13-security-architecture/317-why-private-endpoints.md?raw";
import Q318 from "../../assets/CWD/docs/13-security-architecture/318-why-private-vnet.md?raw";
import Q319 from "../../assets/CWD/docs/13-security-architecture/319-how-to-implement-tenant-isolation.md?raw";
import Q320 from "../../assets/CWD/docs/13-security-architecture/320-how-to-implement-entitlement-first-security.md?raw";
import Q321 from "../../assets/CWD/docs/13-security-architecture/321-what-if-user-asks-for-confidential-hr-information.md?raw";
import Q322 from "../../assets/CWD/docs/13-security-architecture/322-can-the-llm-decide-whether-the-user-has-permission.md?raw";

const CWDSecurityArchitecture = [
  // =====================================================
  // 13. SECURITY ARCHITECTURE
  // =====================================================

  {
    id: "293-how-is-cwd-authenticated",
    category: "Security Architecture",
    title: "How is CWD authenticated?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q293,
    code: "",
  },

  {
    id: "294-how-is-authorization-implemented",
    category: "Security Architecture",
    title: "How is authorization implemented?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q294,
    code: "",
  },

  {
    id: "295-why-use-microsoft-entra-id",
    category: "Security Architecture",
    title: "Why use Microsoft Entra ID?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q295,
    code: "",
  },

  {
    id: "296-what-is-managed-identity",
    category: "Security Architecture",
    title: "What is Managed Identity?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q296,
    code: "",
  },

  {
    id: "297-managed-identity-vs-client-secret",
    category: "Security Architecture",
    title: "Managed Identity vs client secret?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q297,
    code: "",
  },

  {
    id: "298-how-to-implement-rbac",
    category: "Security Architecture",
    title: "How do you implement RBAC?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q298,
    code: "",
  },

  {
    id: "299-what-is-least-privilege",
    category: "Security Architecture",
    title: "What is least privilege?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q299,
    code: "",
  },

  {
    id: "300-how-to-protect-enterprise-data",
    category: "Security Architecture",
    title: "How do you protect enterprise data?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q300,
    code: "",
  },

  {
    id: "301-how-to-protect-pii",
    category: "Security Architecture",
    title: "How do you protect PII?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q301,
    code: "",
  },

  {
    id: "302-how-to-implement-dlp",
    category: "Security Architecture",
    title: "How do you implement DLP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q302,
    code: "",
  },

  {
    id: "303-how-to-secure-prompts",
    category: "Security Architecture",
    title: "How do you secure prompts?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q303,
    code: "",
  },

  {
    id: "304-how-to-prevent-prompt-injection",
    category: "Security Architecture",
    title: "How do you prevent prompt injection?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q304,
    code: "",
  },

  {
    id: "305-how-to-prevent-indirect-prompt-injection",
    category: "Security Architecture",
    title: "How do you prevent indirect prompt injection?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q305,
    code: "",
  },

  {
    id: "306-how-to-prevent-data-exfiltration",
    category: "Security Architecture",
    title: "How do you prevent data exfiltration?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q306,
    code: "",
  },

  {
    id: "307-how-to-prevent-unauthorized-tool-access",
    category: "Security Architecture",
    title: "How do you prevent unauthorized tool access?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q307,
    code: "",
  },

  {
    id: "308-how-to-secure-mcp",
    category: "Security Architecture",
    title: "How do you secure MCP?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q308,
    code: "",
  },

  {
    id: "309-how-to-secure-a2a",
    category: "Security Architecture",
    title: "How do you secure A2A?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q309,
    code: "",
  },

  {
    id: "310-how-to-secure-apis",
    category: "Security Architecture",
    title: "How do you secure APIs?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q310,
    code: "",
  },

  {
    id: "311-how-to-protect-secrets",
    category: "Security Architecture",
    title: "How do you protect secrets?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q311,
    code: "",
  },

  {
    id: "312-why-use-key-vault",
    category: "Security Architecture",
    title: "Why use Key Vault?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q312,
    code: "",
  },

  {
    id: "313-how-to-rotate-secrets",
    category: "Security Architecture",
    title: "How do you rotate secrets?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q313,
    code: "",
  },

  {
    id: "314-how-to-encrypt-data-at-rest",
    category: "Security Architecture",
    title: "How do you encrypt data at rest?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q314,
    code: "",
  },

  {
    id: "315-how-to-encrypt-data-in-transit",
    category: "Security Architecture",
    title: "How do you encrypt data in transit?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q315,
    code: "",
  },

  {
    id: "316-what-is-your-network-architecture",
    category: "Security Architecture",
    title: "What is your network architecture?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q316,
    code: "",
  },

  {
    id: "317-why-private-endpoints",
    category: "Security Architecture",
    title: "Why private endpoints?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q317,
    code: "",
  },

  {
    id: "318-why-private-vnet",
    category: "Security Architecture",
    title: "Why private VNet?",
    difficulty: "Intermediate",
    time: "~10 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q318,
    code: "",
  },

  {
    id: "319-how-to-implement-tenant-isolation",
    category: "Security Architecture",
    title: "How do you implement tenant isolation?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q319,
    code: "",
  },

  {
    id: "320-how-to-implement-entitlement-first-security",
    category: "Security Architecture",
    title: "How do you implement entitlement-first security?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q320,
    code: "",
  },

  {
    id: "321-what-if-user-asks-for-confidential-hr-information",
    category: "Security Architecture",
    title: "What happens if a user asks for confidential HR information?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q321,
    code: "",
  },

  {
    id: "322-can-the-llm-decide-whether-the-user-has-permission",
    category: "Security Architecture",
    title: "Can the LLM decide whether the user has permission?",
    difficulty: "Advanced",
    time: "~15 min",
    description:
      "Prepare a structured interview answer covering the rationale, design, trade-offs and CWD-specific implementation. Section focus: identity, access control, data protection, prompt injection and network security.",
    concept: Q322,
    code: "",
  },

];

export default function CWDSecurityArchitecturePage() {
  return (
    <CookbookApp
      data={CWDSecurityArchitecture}
      title="CWD Security Architecture Cookbook"
      subtitle="Identity, access control, data protection, prompt injection and network security"
      icon="🔐"
      patternLabel="Questions"
    />
  );
}
