# Structured Tool Inputs

## Overview
When an LLM invokes a tool, it must produce arguments that conform to a well-defined schema — typically JSON Schema — so the application can reliably parse, validate, and execute the call. Getting structured input generation right is critical for tool-use reliability.

## Why Structure Matters
Free-form natural language arguments are ambiguous and error-prone to parse programmatically. Structured schemas (defining field names, types, required/optional status, enums, and descriptions) let the model produce machine-parseable output and let the application validate it deterministically before executing anything.

## Schema Design Best Practices

### Use Precise Types
Specify exact types (string, integer, boolean, enum, array, nested object) rather than leaving fields as generic strings when a more specific type is possible — this reduces the chance of malformed or ambiguous values.

### Constrain with Enums Where Possible
If a parameter only accepts a fixed set of values (e.g., `status: ["open", "closed", "pending"]`), define it as an enum rather than a free-text string — this dramatically reduces invalid-value errors.

### Mark Required vs. Optional Fields Explicitly
Ambiguity about which fields are mandatory leads to incomplete tool calls; explicit `required` fields in the schema reduce this failure mode.

### Write Field-Level Descriptions
Just as tool-level descriptions guide tool selection, field-level descriptions guide correct argument construction — describe format expectations (e.g., "date in YYYY-MM-DD format") explicitly rather than assuming the model will infer them.

### Avoid Deeply Nested or Overly Complex Schemas
Very deep nesting or a large number of optional fields increases the chance of malformed output — flatten where possible and split overly complex tools into narrower ones.

## Validation Layer
Never execute a tool call based solely on the model's raw output — always validate the structured arguments against the schema (type checking, enum membership, required field presence, range/format validation) before execution, and return a clear validation error back to the model if it fails, giving it a chance to self-correct.

## Handling Malformed Output
Even with well-designed schemas, models occasionally produce invalid structured output (wrong type, missing field, hallucinated field name). Strategies:
- **Schema-constrained decoding**: some model serving frameworks support constraining generation to only produce schema-valid JSON, eliminating this failure mode structurally
- **Retry with error feedback**: return the specific validation error to the model and ask it to correct the call — usually resolves the issue in one additional turn
- **Fallback to a stricter reformulation prompt**: if repeated attempts fail, use a more constrained, example-heavy prompt specifically for argument extraction

## Versioning Tool Schemas
As tools evolve (new parameters added, old ones deprecated), version tool schemas explicitly and maintain backward compatibility where feasible — an agent's prompt/context may reference an older schema version if not carefully synchronized with tool implementation changes.

## Testing Structured Tool Inputs
Build a test suite of representative user requests mapped to expected tool calls and arguments, and run it against any prompt or model change to catch regressions in argument construction accuracy — this is a distinct evaluation dimension from general response quality (see tool-selection-evaluation.md).

## Summary
Well-designed, precisely typed, clearly described schemas combined with a strict validation layer are essential for reliable tool use. Treat structured tool input generation as a first-class reliability concern, not an incidental detail of prompt engineering.
