# Technology Selection for GenAI Systems

## Overview
Technology selection — choosing models, frameworks, vector stores, orchestration platforms, and infrastructure — should be driven by the specific requirements surfaced during discovery (see ai-architecture-discovery.md) rather than by trend-following or defaulting to whatever technology is most familiar to the team, regardless of fit.

## A Structured Selection Process
1. **Define selection criteria explicitly** before evaluating options — latency requirements, cost constraints, team expertise, compliance needs, integration requirements
2. **Identify candidate options** for each technology decision point (model, vector store, orchestration framework, compute platform)
3. **Evaluate candidates against criteria** using both documented capabilities and, where feasible, direct hands-on evaluation/benchmarking against representative workloads
4. **Make and document the decision** including the reasoning and trade-offs considered, supporting future reassessment as requirements or the technology landscape evolve

## Key Decision Points and Relevant Trade-offs

### Model Selection
See bedrock-model-selection.md's evaluation process — balancing capability, latency, and cost against the specific task's requirements, ideally validated through direct testing rather than relying solely on published benchmarks that may not reflect your specific use case.

### Vector Store Selection
See vector-database-selection.md — balancing scale requirements, hybrid search needs, operational maturity, and existing team familiarity with candidate options.

### Orchestration Framework
See langgraph-vs-langchain.md and the broader Multi-Agent Systems section — matching framework choice to the actual control-flow complexity (simple chains vs. stateful cyclic graphs) the application genuinely requires.

### Compute Platform
See lambda-vs-eks.md — matching compute choice to execution duration, throughput, and operational maturity considerations.

### Managed vs. Self-Hosted
See bedrock-vs-sagemaker.md and bedrock-vs-direct-llm.md — a recurring theme across many technology decisions is managed/serverless options (faster to production, less operational overhead) versus more control-intensive self-hosted or direct-integration alternatives (more flexibility, more operational responsibility).

## Avoiding Common Technology Selection Pitfalls

### Resume-Driven or Trend-Driven Selection
Choosing a technology because it's currently popular or because team members want experience with it, rather than because it genuinely fits the project's requirements — leads to accumulated technical debt and mismatched tooling.

### Over-Engineering
Selecting more sophisticated, complex technology (a full multi-agent framework, a highly customizable vector database requiring significant operational investment) than the actual use case complexity warrants, adding unnecessary development and operational overhead.

### Under-Engineering
The opposite failure — choosing overly simple technology that will require a costly, disruptive migration once the application's genuine scale or complexity requirements become clear, when a moderately more capable initial choice would have avoided this.

### Ignoring Total Cost of Ownership
Evaluating technology options purely on initial development speed or per-unit cost without considering the full lifecycle cost — operational overhead, required expertise, migration costs if requirements change — can lead to a technology choice that looks attractive initially but proves costly over the application's full lifespan.

## Revisiting Technology Decisions
Technology selection isn't a permanent, one-time decision — as the application's usage grows, as requirements evolve, and as the technology landscape itself matures (new models, new framework capabilities), periodically revisit prior technology decisions with the same rigor applied to the original selection, rather than treating early choices as permanently fixed regardless of how well they continue to fit evolving needs.

## Summary
Technology selection for GenAI systems should be driven by explicit, discovery-informed criteria evaluated through structured comparison (and ideally direct testing) across candidate options, avoiding both trend-driven over-engineering and requirements-blind under-engineering, with technology decisions treated as revisitable rather than permanently fixed.
