# Golden Dataset

## Overview
A golden dataset is a curated, high-quality collection of representative inputs paired with verified correct (or acceptable) outputs, used as the foundation for both offline evaluation and regression testing of an LLM-based system. Building and maintaining a good golden dataset is one of the highest-leverage investments in a production GenAI system's quality assurance process.

## What Makes a Good Golden Dataset

### Representativeness
The dataset should reflect the actual distribution of real user queries/tasks the system will encounter in production — including common cases, edge cases, and known difficult scenarios — not just a convenient set of clean, easy examples that make the system look better than it will perform in reality.

### Diversity of Difficulty
Include a range from straightforward cases (validating basic functionality) to genuinely hard cases (ambiguous phrasing, multi-part questions, queries at the boundary of the knowledge base's coverage) — a dataset composed only of easy cases fails to surface the failure modes that matter most.

### Explicit "No Good Answer" Cases
For RAG systems specifically, include queries where the knowledge base genuinely doesn't contain a relevant answer, with the expected correct behavior being an appropriate "I don't know" or escalation response rather than a fabricated answer — testing this negative case is as important as testing positive, answerable cases (see preventing-rag-hallucination.md).

### Verified Ground Truth
Each example's expected output (or acceptable output criteria) should be verified by a domain expert or authoritative source, not just accepted from an initial model generation — a golden dataset built from unverified model outputs risks baking in and reinforcing existing model errors rather than serving as an independent quality check.

### Supporting Metadata
Beyond the input/expected-output pair, include supporting information useful for evaluation: the source document(s) that should be retrieved (for RAG retrieval evaluation), the category/difficulty tier of the example, and any specific quality dimensions this example is meant to test.

## Building the Dataset

### Initial Construction
Combine hand-crafted examples covering known important scenarios with real (anonymized, appropriately handled per data governance policy) queries mined from production usage or early user testing, ensuring the dataset reflects genuine usage patterns rather than only what engineers anticipated.

### Continuous Expansion
Add new examples over time as new failure modes are discovered in production, as the application's scope expands, and as edge cases surface through user feedback or monitoring — a golden dataset that's never updated after initial launch becomes decreasingly representative of the system's actual current usage and risk profile.

### Versioning
Version the golden dataset alongside the application, tracking which version of the dataset was used for each evaluation run — enabling meaningful comparison of evaluation results across different points in time and correctly attributing quality changes to actual system changes rather than dataset drift.

## Using the Golden Dataset
- **Pre-deployment regression testing**: validate that a proposed prompt, model, or configuration change doesn't degrade performance on previously passing cases (see llm-regression-testing.md)
- **Ongoing quality benchmarking**: track performance trends over time as the dataset and system both evolve
- **Model/configuration comparison**: provide a consistent basis for comparing different models or configurations (see bedrock-model-selection.md's evaluation process)

## Common Pitfalls
- Building the dataset once at launch and never revisiting it as the application and its usage patterns evolve
- Over-representing easy cases, giving a falsely reassuring picture of overall system quality
- Not including negative/no-good-answer cases, missing a critical dimension of hallucination risk
- Allowing dataset "answers" to be sourced from unverified model outputs rather than genuine ground truth

## Summary
A well-constructed, representative, continuously maintained golden dataset — including diverse difficulty levels, negative cases, and verified ground truth — is the essential foundation enabling meaningful, ongoing evaluation and regression testing of any production LLM-based system.
