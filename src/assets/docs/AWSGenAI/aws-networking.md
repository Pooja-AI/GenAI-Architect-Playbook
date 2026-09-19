# AWS Networking for GenAI Applications

## Overview
Proper network architecture — VPC design, private connectivity, and traffic control — is essential for securing GenAI applications, particularly given the number of external integrations (Bedrock, vector stores, third-party tools/MCP servers) these systems typically involve.

## Core Networking Components

### VPC (Virtual Private Cloud)
Isolate GenAI application compute (Lambda, ECS, EKS) and data resources (RDS/Aurora, OpenSearch) within a VPC, providing network-level isolation from the public internet and other AWS accounts/workloads.

### VPC Endpoints (PrivateLink)
Use VPC endpoints to connect to AWS services (Bedrock, S3, DynamoDB, Secrets Manager) over private AWS network paths rather than routing through the public internet — reducing exposure surface and often improving latency and reliability compared to internet-routed traffic.

### Security Groups and NACLs
Apply security groups (stateful, instance/ENI-level firewall rules) and Network ACLs (stateless, subnet-level rules) to control exactly what network traffic is permitted between GenAI application components and to/from external resources — following least-privilege principles analogous to IAM's approach for identity-based access control (see aws-iam.md).

### Private Subnets for Sensitive Compute
Place compute resources that don't need direct internet access (e.g., backend orchestration logic invoking Bedrock via VPC endpoints) in private subnets without a direct route to the internet, reducing the attack surface compared to placing everything in public subnets by default.

## GenAI-Specific Networking Considerations

### Third-Party Tool and MCP Server Connectivity
For agentic systems connecting to external tools or MCP servers (see mcp-security.md), evaluate whether private connectivity options (VPN, Direct Connect, or private API endpoints) are available for particularly sensitive integrations, rather than defaulting to public internet connectivity for every external tool call.

### Multi-Region Architecture
For multi-region deployments (supporting model fallback, see bedrock-model-fallback.md, or serving geographically distributed users with lower latency), design VPC peering or Transit Gateway architecture to support necessary cross-region connectivity while maintaining appropriate network segmentation and security boundaries between regions.

### API Gateway as the Controlled External Entry Point
Route all external-facing traffic through API Gateway (rather than exposing backend compute directly to the internet), providing a controlled chokepoint for authentication, rate limiting, and request validation before traffic reaches internal GenAI application logic.

## Bedrock Networking
Bedrock supports VPC endpoints (via AWS PrivateLink), allowing applications running in a VPC to invoke Bedrock models without traffic traversing the public internet — an important consideration for organizations with strict data-in-transit requirements or network security policies mandating private connectivity to AWS services.

## Monitoring Network Traffic
Use VPC Flow Logs to capture network traffic metadata for security monitoring and troubleshooting — particularly valuable for investigating unusual traffic patterns that might indicate a security issue (e.g., unexpected outbound connections from a compute resource that shouldn't be initiating such traffic, potentially indicating a compromised or manipulated agent, see prompt-injection.md).

## Balancing Security and Operational Complexity
While maximal network isolation (private subnets everywhere, VPC endpoints for every service, no direct internet access) provides the strongest security posture, evaluate this against the operational complexity it introduces — particularly for smaller applications or early-stage systems where a simpler, still reasonably secure network architecture may be a more pragmatic starting point, with tightening applied as the application matures and its risk profile is better understood.

## Summary
AWS networking for GenAI applications centers on VPC isolation, private connectivity via VPC endpoints (particularly for Bedrock and other AWS service access), carefully scoped security groups, and API Gateway as the controlled external entry point — with particular attention to secure connectivity patterns for the diverse external tool and MCP server integrations common in agentic systems.
