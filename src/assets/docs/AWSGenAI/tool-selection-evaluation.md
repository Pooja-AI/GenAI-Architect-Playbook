# Tool Selection Evaluation

## Overview
Tool selection evaluation specifically measures whether an agent correctly identifies which tool(s) to use for a given sub-task, constructs correct arguments for those tools, and appropriately avoids invoking tools when none are actually needed — a distinct, granular evaluation dimension within the broader agent evaluation practice described in agent-evaluation.md.

## Why Tool Selection Deserves Dedicated Evaluation
Tool selection errors can be subtle and don't always manifest as an obviously broken final output — an agent might select a plausible-but-suboptimal tool, produce a technically valid but suboptimal argument set, or use an unnecessary tool that adds cost/latency without improving the result, none of which necessarily produce an obviously wrong final answer but all of which represent real quality/efficiency issues worth tracking.

## Key Metrics

### Tool Selection Accuracy
Given a task requiring a specific tool (or set of tools), did the agent select the correct one(s)? Measured against a labeled test set where the "correct" tool choice for each scenario is known.

### Argument Construction Accuracy
Given a correct tool selection, were the arguments passed to it correct and complete? This is evaluated separately from tool selection accuracy since an agent can correctly identify the right tool but still fail by constructing invalid or suboptimal arguments (see structured-tool-inputs.md for the underlying schema design considerations that affect this).

### Unnecessary Tool Use (False Positive Rate)
Did the agent invoke a tool when the task could have been (or should have been) handled without one — e.g., calling a search tool for a question the agent already has sufficient information to answer directly? Unnecessary tool calls add latency and cost without corresponding benefit.

### Missed Tool Use (False Negative Rate)
Did the agent fail to invoke a necessary tool, instead attempting to answer from its own (potentially outdated or incomplete) parametric knowledge when a tool call was actually required for an accurate, grounded response?

### Multi-Tool Sequencing Accuracy
For tasks requiring multiple tool calls in sequence, did the agent invoke them in a correct, logical order, correctly using the output of earlier calls to inform later ones?

## Building a Tool Selection Test Set
Construct scenarios covering:
- Clear-cut cases where exactly one tool is obviously correct
- Ambiguous cases where multiple tools could plausibly apply, testing whether the agent selects the most appropriate one
- Cases requiring no tool at all, testing for unnecessary tool use
- Cases requiring a specific sequence of multiple tools, testing sequencing accuracy
- Cases with deliberately similar/overlapping tool descriptions, stress-testing whether tool description quality (see function-calling-tool-use.md) is sufficient for reliable disambiguation

## Diagnosing Tool Selection Failures
When evaluation reveals tool selection errors, the root cause is often traceable to:
- **Ambiguous or overlapping tool descriptions** that don't give the model sufficient signal to disambiguate between similar tools
- **Missing tools** for legitimate sub-task needs, forcing the agent into an awkward or incorrect substitute selection
- **Insufficient context** provided to the agent about the current task state, leading to reasonable-seeming but ultimately incorrect tool choices

## Continuous Monitoring
Track tool selection and argument accuracy as ongoing production metrics (via sampled evaluation of live agent traces, see agent-tracing.md), since tool selection behavior can drift as new tools are added to an agent's available set or as underlying models are updated.

## Summary
Tool selection evaluation is a granular, dedicated evaluation dimension distinct from overall task success — measuring selection accuracy, argument correctness, and appropriate tool use (avoiding both unnecessary and missed tool calls) — essential for diagnosing and improving the specific mechanics of how an agent interacts with its available tools.
