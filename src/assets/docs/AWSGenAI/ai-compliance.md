# AI Compliance

## Overview
AI compliance refers to meeting the legal, regulatory, and contractual obligations applicable to generative AI systems — a landscape that varies significantly by jurisdiction, industry, and specific use case, and that continues to evolve as AI-specific regulation matures globally.

## Categories of Applicable Requirements

### General Data Protection Regulations
Regulations like GDPR (EU) and CCPA/CPRA (California) govern how personal data can be collected, processed, and retained — directly relevant to any GenAI system processing user data, including data used for RAG retrieval, conversation logging, or model fine-tuning. Key obligations include data subject rights (access, deletion, correction), lawful basis for processing, and breach notification requirements.

### Sector-Specific Regulations
- **Healthcare**: HIPAA (US) governs protected health information; AI systems processing health data need appropriate safeguards and, where applicable, Business Associate Agreements with cloud providers
- **Financial Services**: various regulations govern automated decision-making in lending, fraud detection, and financial advice, often requiring explainability and human oversight for consequential decisions
- **Employment**: emerging regulations in several jurisdictions specifically address AI use in hiring and employment decisions, often requiring bias auditing and disclosure

### Emerging AI-Specific Regulation
Frameworks like the EU AI Act introduce risk-tiered regulatory requirements specifically for AI systems, with more stringent obligations (documentation, human oversight, bias testing, transparency) for "high-risk" AI applications — organizations operating globally need to track applicable AI-specific regulation across every jurisdiction where their systems operate or their users are located, as this landscape is still actively developing.

### Industry and Contractual Standards
Beyond legal requirements, industry certifications (SOC 2, ISO 27001) and customer contractual commitments often impose additional requirements on how AI systems handle data, make decisions, and provide audit trails — particularly relevant for B2B SaaS providers building GenAI features for enterprise customers.

## Practical Compliance Measures
- **Data governance**: clear policies on what data can be used for RAG, fine-tuning, or logging, with mechanisms to honor deletion requests across all these data stores (not just a primary database)
- **Explainability and audit trails**: comprehensive logging (see agent-tracing.md and multi-agent-observability.md) supporting the ability to explain and reconstruct why a system produced a particular output or took a particular action, especially for consequential decisions
- **Human oversight for high-risk decisions**: applying human-in-the-loop patterns (see human-in-the-loop.md) not just as a quality/safety measure but as a compliance requirement in regulated decision categories
- **Bias and fairness testing**: for AI systems influencing consequential decisions about individuals, proactive testing for disparate impact across protected characteristics, integrated into the evaluation process
- **Vendor and sub-processor management**: understanding and documenting the compliance posture of foundation model providers and any third-party tools/data sources (including MCP servers, see mcp-security.md) integrated into the system

## Cross-Functional Ownership
AI compliance cannot be managed by engineering alone — it requires ongoing collaboration with legal/compliance teams who track the evolving regulatory landscape, and should be integrated into the broader enterprise AI governance process described in enterprise-ai-governance.md rather than treated as a separate, siloed workstream.

## Staying Current
Because AI-specific regulation is evolving rapidly and varies significantly by jurisdiction, treat compliance requirements as a moving target requiring periodic reassessment — a system compliant at launch may need updates as new regulations take effect or as the system's use cases and user base expand into new jurisdictions.

## Summary
AI compliance spans general data protection law, sector-specific regulation, emerging AI-specific frameworks, and contractual/industry standards — requiring data governance, explainability, human oversight for high-risk decisions, and bias testing as practical technical measures, implemented through ongoing cross-functional collaboration between engineering and legal/compliance functions given the continually evolving regulatory landscape.
