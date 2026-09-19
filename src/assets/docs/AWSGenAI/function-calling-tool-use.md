# Function Calling / Tool Use

## Overview
Function calling (also called tool use) is the mechanism that lets an LLM invoke external functions — APIs, databases, calculators, search engines, code execution environments — as part of generating a response. This is what turns a purely text-generating model into a system that can take real actions and access live, external information.

## How It Works
1. The application defines a set of available tools, each with a name, description, and a structured input schema (see structured-tool-inputs.md)
2. These tool definitions are provided to the model alongside the conversation
3. Given a user request, the model decides whether it needs a tool, and if so, produces a structured tool-call output (tool name + arguments matching the schema)
4. The application executes the actual function call (the model does not execute code itself — it only decides *what* to call and with *what arguments*)
5. The result is returned to the model as an observation, which it incorporates into further reasoning or a final response

## Tool Definition Best Practices
- **Clear, specific descriptions**: the model relies entirely on the tool's name and description to decide when to use it — vague descriptions lead to incorrect or missed tool selection
- **Narrow, single-purpose tools**: a tool that does one thing well is easier for the model to select correctly than an overloaded, multi-purpose tool
- **Meaningful parameter names and descriptions**: just as important as the tool description itself for correct argument construction
- **Return structured, model-friendly output**: JSON or clearly formatted text the model can easily parse and reason about in the next step

## Common Tool Categories
- **Information retrieval**: search engines, RAG retrieval, database queries
- **Computation**: calculators, code execution sandboxes
- **Action-taking**: sending emails, creating tickets, updating records, initiating transactions
- **External API integration**: weather, calendars, third-party SaaS platforms (see MCP for a standardized approach to this)

## Handling Tool Errors
Tools will fail — invalid arguments, downstream API errors, timeouts. Return errors to the model in a clear, structured format so it can reason about the failure and decide whether to retry with corrected arguments, try an alternative tool, or report the failure to the user rather than silently failing or hallucinating a fabricated result.

## Parallel vs. Sequential Tool Calls
Some model APIs support requesting multiple independent tool calls in a single turn (parallel execution), which reduces latency for tasks requiring several unrelated lookups. Sequential tool use is required when later calls depend on the results of earlier ones.

## Security Considerations
- Validate and sanitize all tool arguments before execution — never trust model-generated input blindly, especially for actions with side effects (database writes, external API calls with financial or data implications)
- Apply the principle of least privilege to what each tool is allowed to do
- Be alert to prompt injection risks where malicious content in retrieved data or user input attempts to manipulate the model into misusing tools (see prompt-injection.md and secure-agent-tools.md)

## Evaluating Tool Use Quality
Track and evaluate:
- **Tool selection accuracy**: did the model choose the correct tool for the task?
- **Argument correctness**: were the arguments passed to the tool valid and appropriate?
- **Appropriate tool avoidance**: did the model correctly avoid calling a tool when one wasn't needed?

See tool-selection-evaluation.md for a deeper treatment of this evaluation dimension.

## Summary
Function calling is the foundational capability enabling agentic behavior — it bridges an LLM's reasoning with real-world actions and live data. Well-designed tool definitions, robust error handling, and careful security controls are essential for reliable, safe tool-using systems.
