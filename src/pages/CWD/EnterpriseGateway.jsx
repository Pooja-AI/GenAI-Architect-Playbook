import CookbookApp from "../../components/CookbookApp";

const EnterpriseGateway = [
  // =====================================================
  // 18. ENTERPRISE GATEWAY
  // =====================================================

  {
    id: "cwd-gateway",
    category: "Enterprise Gateway",
    title: "Enterprise Gateway",
    difficulty: "Advanced",
    time: "~45 min",
    description:
      "Understand the secure enterprise entry point for CWD requests, including API exposure, real-time communication, authentication, authorization, request validation, traffic protection, routing, and Web Application Firewall security.",

  },
      {
        id: "api-gateway",
        category: "Enterprise Gateway",
        title: "API Gateway",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand the role of the API Gateway as the controlled entry point into CWD, including request forwarding, authentication integration, traffic management, API protection, observability, and service routing.",
        concept: "",
        code: "",
      },

      {
        id: "websocket",
        category: "Enterprise Gateway",
        title: "WebSocket",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how WebSockets enable real-time, bidirectional communication between clients and CWD, including streaming agent responses, execution updates, notifications, connection management, and failure handling.",
        concept: "",
        code: "",
      },

      {
        id: "gateway-authentication",
        category: "Enterprise Gateway",
        title: "Authentication",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the gateway authenticates users and services before allowing access to CWD, including enterprise identity providers, tokens, service identities, token validation, and secure identity propagation.",
        concept: "",
        code: "",
      },

      {
        id: "gateway-authorization",
        category: "Enterprise Gateway",
        title: "Authorization",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how authorization policies determine what an authenticated user or service can access, including roles, permissions, entitlements, agent access, tool access, and enterprise data boundaries.",
        concept: "",
        code: "",
      },

      {
        id: "request-validation",
        category: "Enterprise Gateway",
        title: "Request Validation",
        difficulty: "Intermediate",
        time: "~10 min",
        description:
          "Understand how incoming requests are validated for schema correctness, required fields, supported operations, payload constraints, security requirements, and malformed or potentially unsafe input before entering the agent workflow.",
        concept: "",
        code: "",
      },

      {
        id: "rate-limiting",
        category: "Enterprise Gateway",
        title: "Rate Limiting",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how rate limiting protects CWD from excessive traffic, abuse, accidental overload, and uncontrolled agent requests using quotas, throttling, concurrency limits, and user or service-specific policies.",
        concept: "",
        code: "",
      },

      {
        id: "gateway-routing",
        category: "Enterprise Gateway",
        title: "Routing",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how the gateway routes validated requests to the appropriate CWD services and orchestration components while supporting service discovery, load balancing, versioning, failover, and controlled traffic distribution.",
        concept: "",
        code: "",
      },

      {
        id: "waf",
        category: "Enterprise Gateway",
        title: "WAF",
        difficulty: "Advanced",
        time: "~10 min",
        description:
          "Understand how a Web Application Firewall protects the CWD entry point against common web threats, malicious requests, injection attacks, abnormal traffic patterns, and other application-layer security risks.",
        concept: "",
        code: "",
      },
   
];

export default function EnterpriseGatewayPage() {
  return (
    <CookbookApp
      data={EnterpriseGateway}
      title="Enterprise Gateway Cookbook"
      subtitle="Secure entry, authentication, authorization, routing and traffic protection"
      icon="🛡️"
      patternLabel="Topics"
    />
  );
}

