# From Business Requirements to AI Architecture

## Overview
Translating a business problem into a well-architected generative AI solution requires a disciplined process — understanding the actual business need, evaluating whether GenAI is even the right tool, and only then moving to specific architectural decisions. This document outlines that translation process.

## Step 1: Clarify the Actual Business Problem
Before any architecture discussion, ensure genuine clarity on:
- What business outcome is desired (cost reduction, faster response times, improved customer satisfaction, new capability)
- Who the end users are and what their current experience/pain point looks like
- What "success" concretely looks like, ideally with measurable criteria

A common failure mode is jumping to "we need a chatbot" or "we need an AI agent" as the starting point rather than the business problem itself — architecture decisions made before the problem is clearly understood tend to over-fit to an assumed solution shape.

## Step 2: Determine Whether GenAI Is the Right Tool
Not every business problem benefits from generative AI — some are better served by traditional deterministic software, simple automation/rules engines, or traditional ML. GenAI tends to add genuine value when:
- The task involves unstructured data (documents, natural language) that traditional software struggles to process
- The task benefits from natural language interaction or generation
- The task requires flexible reasoning across varied, hard-to-enumerate scenarios rather than a fixed, well-defined rule set

## Step 3: Identify the Right GenAI Pattern
Once GenAI is determined to be appropriate, identify which pattern(s) fit:
- **Simple generation/summarization**: a single LLM call may suffice
- **Knowledge-grounded Q&A**: RAG (see what-is-rag.md)
- **Multi-step task automation**: agentic AI (see what-is-agentic-ai.md)
- **Complex, multi-domain workflows**: multi-agent systems (see why-multi-agent.md)

Resist defaulting to the most sophisticated pattern (multi-agent, highly autonomous agents) when a simpler pattern (a single well-designed RAG system) would adequately serve the actual business need — see the "why multi-agent" decision heuristic for a concrete example of this discipline.

## Step 4: Define Risk Tolerance and Governance Requirements
Assess the risk profile of the use case (see enterprise-ai-governance.md's risk classification approach) — a high-stakes, customer-facing, or regulated use case warrants more extensive guardrails, human oversight, and evaluation rigor than a low-stakes internal productivity tool, and this risk assessment should directly inform architectural decisions (how much autonomy to grant an agent, what human-in-the-loop checkpoints are needed).

## Step 5: Architect the Specific Solution
Only at this point should specific technical architecture decisions be made — model selection (see bedrock-model-selection.md), data pipeline design (see enterprise-data-pipeline.md), compute platform choice (see lambda-vs-eks.md), and the full stack of security, observability, and evaluation practices covered throughout this knowledge base.

## Common Pitfalls in This Translation Process
- Skipping directly to architecture/technology selection without genuine business problem clarity
- Over-engineering (choosing agentic or multi-agent architectures for problems a simple RAG system would solve)
- Under-engineering (choosing a simple pattern for a use case whose actual complexity or risk profile warrants more sophisticated guardrails and architecture)
- Not revisiting the business problem definition as the project progresses and new information emerges

## Communicating the Translation to Stakeholders
Document and communicate this translation process explicitly to business stakeholders (see stakeholder-communication.md) — helping them understand why a particular architectural approach was chosen in terms of the business problem it solves, rather than presenting technology choices as an unexplained given.

## Summary
Translating business requirements into GenAI architecture requires clarifying the actual business problem, validating that GenAI is the appropriate tool, identifying the right pattern (simple generation, RAG, agentic, or multi-agent) matched to genuine task complexity, and calibrating governance/risk requirements — before moving to specific technical architecture decisions.
