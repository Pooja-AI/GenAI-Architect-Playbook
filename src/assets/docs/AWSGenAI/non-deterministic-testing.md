# Non-Deterministic Testing

## Overview
LLM outputs are inherently non-deterministic — the same input can produce meaningfully different outputs across separate calls, even at low sampling temperature settings. This document addresses the specific testing strategies needed to build reliable confidence in a system's behavior despite this variability, complementing the broader regression testing practices in llm-regression-testing.md.

## Sources of Non-Determinism
- **Sampling temperature and other generation parameters**: higher temperature settings intentionally introduce more output variability
- **Model-level non-determinism**: even at temperature zero, some model serving infrastructures exhibit minor non-determinism due to floating-point computation order effects in parallelized inference
- **Upstream variability**: retrieval results can vary slightly (e.g., due to index updates between test runs), and any tool/API calls an agent makes may return time-dependent or otherwise variable results

## Testing Strategies for Non-Deterministic Systems

### Property-Based Testing Instead of Exact Match
Rather than asserting an exact expected output string, assert properties the output must satisfy — does it contain required information, does it stay within a specified format, does it avoid prohibited content, does it pass a groundedness check — allowing acceptable variability in exact phrasing while still catching genuine failures.

### Statistical Sampling Across Multiple Runs
For metrics sensitive to sampling variability, run the same test case multiple times and evaluate the distribution of outcomes (e.g., pass rate across N runs) rather than treating a single run's result as definitive — particularly important when comparing two configurations where the "true" quality difference might be smaller than the noise from a single-run comparison.

### Fixed Seeds/Low Temperature for Deterministic-Leaning Tests
Where the testing goal is to validate a specific behavior as reliably and reproducibly as possible (rather than to characterize natural output variability), use the lowest available temperature setting and any available seeding mechanism to minimize incidental variability, understanding this doesn't guarantee perfect determinism but reduces noise in the specific test signal being measured.

### Confidence Intervals Rather Than Point Estimates
When reporting evaluation metrics (accuracy, groundedness rate, pass rate), report them with appropriate confidence intervals or variance measures given the sample size, rather than presenting a single point estimate that implies more precision than the underlying non-deterministic sampling actually supports.

### Testing for Consistency, Not Just Correctness
For some applications, output *consistency* across repeated identical inputs is itself a quality dimension worth testing explicitly (e.g., a customer shouldn't get meaningfully different answers to the exact same question asked twice in quick succession) — measure this directly rather than assuming acceptable per-run correctness implies acceptable consistency.

## Statistical Significance in Comparisons
When comparing two configurations (e.g., in A/B testing or regression testing), apply appropriate statistical tests to determine whether an observed difference in metrics is likely genuine or could plausibly be explained by sampling noise — especially important given the added variability non-deterministic LLM outputs introduce compared to testing deterministic traditional software.

## Practical Recommendations
- Use a sufficiently large and diverse test set to average out per-example sampling noise in aggregate metrics
- For high-stakes individual test cases, run multiple samples and require a high pass rate (not just a single passing run) before considering the case reliably handled
- Be explicit in evaluation reporting about the sampling methodology used, so consumers of the results understand the confidence level appropriately

## Summary
Testing non-deterministic LLM systems requires property-based assertions rather than exact-match testing, statistical sampling across multiple runs, appropriate confidence-interval reporting, and explicit attention to output consistency as its own quality dimension — adapting traditional software testing rigor to the genuinely different statistical nature of LLM-generated output.
