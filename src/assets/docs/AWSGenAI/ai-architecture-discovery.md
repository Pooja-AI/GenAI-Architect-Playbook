# AI Architecture Discovery

## Overview
Discovery is the structured process of gathering the information needed to design an appropriate GenAI architecture — understanding data sources, existing systems, constraints, and stakeholder needs before committing to specific technical decisions. Thorough discovery significantly reduces the risk of costly architectural rework later in a project.

## Key Discovery Areas

### Data Landscape
- What data sources exist that are relevant to the use case (documents, databases, APIs)?
- What is the current state of that data's quality, structure, and accessibility (see data-quality.md)?
- What access control and sensitivity considerations apply to this data (see rag-security-trimming.md and pii-prevention.md)?
- How frequently does the relevant data change, informing freshness requirements (see batch-vs-streaming.md)?

### Existing System Landscape
- What existing systems (CRM, ticketing, internal tools) would the GenAI solution need to integrate with?
- Are there existing APIs, or would new integration work (potentially via MCP, see what-is-mcp.md) be required?
- What authentication/authorization systems are already in place that the new solution should integrate with rather than duplicate?

### User and Workflow Understanding
- Who are the actual end users, and what is their current workflow without the proposed solution?
- What does a successful interaction look like from the user's perspective?
- What are the failure modes users would find most frustrating or costly, informing where extra guardrails/human oversight should be prioritized?

### Constraints
- Latency requirements (real-time interactive vs. batch-acceptable)
- Budget constraints, informing model selection and architecture complexity trade-offs (see cost-latency-quality-tradeoff.md)
- Compliance and regulatory constraints specific to the industry/data involved (see ai-compliance.md)
- Existing technology stack constraints or preferences (e.g., an organization already deeply invested in a specific cloud provider or orchestration framework)

## Discovery Techniques

### Stakeholder Interviews
Direct conversations with business stakeholders, end users, and technical teams owning relevant existing systems — essential for surfacing constraints and requirements that wouldn't be visible from documentation alone.

### Data Sampling and Profiling
Direct examination of representative samples of the actual data that would feed the solution (documents, historical queries/tickets) — surfaces data quality issues, format inconsistencies, and the genuine difficulty/ambiguity distribution of real queries far more effectively than assumptions made without looking at actual data.

### Prototype-Driven Discovery
Building a small, rough prototype early in discovery (even before full architecture is settled) can surface requirements and constraints that pure requirements-gathering conversations miss — seeing an early prototype often prompts stakeholders to articulate needs or concerns they hadn't previously thought to mention.

## Discovery Deliverables
A well-run discovery phase should produce:
- A clear problem and success-criteria statement (feeding into business-to-ai-architecture.md's translation process)
- A data landscape assessment identifying quality issues, access considerations, and freshness requirements
- An integration map of existing systems the solution needs to work with
- A risk/constraint summary informing governance and architectural rigor requirements

## Avoiding Analysis Paralysis
While thorough discovery reduces downstream risk, avoid extending discovery indefinitely — timebox the discovery phase and plan to refine understanding iteratively as the project progresses (informed by early prototype feedback and production learnings) rather than attempting to achieve perfect upfront certainty before any architecture or build work begins.

## Summary
AI architecture discovery systematically gathers data landscape, existing system integration, user workflow, and constraint information — through stakeholder interviews, direct data examination, and early prototyping — providing the foundation needed to make informed architectural decisions and avoid costly rework from requirements or constraints discovered too late in a project.
