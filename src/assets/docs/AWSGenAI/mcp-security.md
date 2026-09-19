# MCP Security

## Overview
Because MCP servers can expose powerful data access and action-taking capabilities to AI agents — often across organizational boundaries or from third-party server implementations — securing MCP integrations requires careful attention to authentication, authorization, data handling, and the broader prompt injection risks inherent to any system where an LLM processes external, potentially untrusted content.

## Authentication and Authorization
- MCP servers should require proper authentication (API keys, OAuth, or other standard mechanisms) rather than allowing anonymous access to sensitive tools/resources
- Authorization should be scoped appropriately — an MCP client connecting on behalf of a specific user should only have access to the tools/data that user is actually permitted to use, mirroring the RBAC/ABAC principles described in rbac-abac.md, not a blanket set of permissions for every connection

## Least-Privilege Tool Exposure
Only expose the minimum set of tools/capabilities genuinely needed for the intended use case — an MCP server exposing a broad set of destructive or sensitive actions (e.g., arbitrary database writes) to any connecting agent significantly expands the attack surface and blast radius of a compromised or misbehaving agent, consistent with the least-privilege principle discussed throughout secure-agent-tools.md.

## Prompt Injection via Server-Returned Data
Data returned by an MCP server (search results, document content, API responses) becomes part of the LLM's context and is processed the same way any other retrieved content is — this makes it a potential vector for prompt injection attacks (see prompt-injection.md) if a malicious or compromised data source embeds instructions designed to manipulate the agent's subsequent behavior. Treat all MCP server-returned content as untrusted data, not as trusted instructions, and apply the defenses described in prompt-injection-defense.md.

## Third-Party MCP Server Risk
Connecting to an MCP server built and operated by a third party introduces supply-chain-style risk: a compromised or malicious server could return manipulated data, attempt to exfiltrate information passed to it as tool arguments, or otherwise behave outside the expected specification. Apply the same scrutiny to third-party MCP servers that you would to any third-party dependency or integration — review provenance, scope permissions minimally, and monitor behavior.

## Data Exfiltration Risks
Be cautious about what data flows to an MCP server as part of tool invocation arguments — sensitive data (PII, credentials, proprietary information) passed as a tool argument to an untrusted or insufficiently vetted server represents a genuine data leakage risk (see data-leakage-prevention.md and pii-prevention.md), independent of whether the server's *response* is well-behaved.

## Auditing and Monitoring
Log every MCP tool invocation — including which server, which tool, what arguments, and what was returned — to support the audit trail needed for both security incident investigation and general observability (see agent-tracing.md), particularly important given that MCP's dynamic discovery model means the exact set of tools available to an agent can change as new servers are connected.

## Network-Level Controls
Where feasible, run MCP server connections over private network paths (VPC endpoints, private links) rather than the public internet, and apply standard network security controls (allowlisting, TLS) consistent with the broader AWS networking security practices described in aws-networking.md.

## Summary
MCP's dynamic, standardized tool discovery model introduces real value but also expands the potential attack surface compared to a small, fixed, carefully vetted set of hardcoded tool integrations — requiring deliberate attention to authentication/authorization scoping, treating server-returned data as untrusted input, vetting third-party servers, and comprehensive audit logging of all MCP tool invocations.
