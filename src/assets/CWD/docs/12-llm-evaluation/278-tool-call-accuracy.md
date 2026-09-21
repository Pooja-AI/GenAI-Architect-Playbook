**Tool-call accuracy** measures whether an agent called the right tools with the right arguments to complete a task. It evaluates the actions the agent took, not just the final text.

**What gets checked**
1. **Tool selection:** Did it call the correct tool, and did it avoid unnecessary or forbidden ones?
2. **Arguments:** Are the parameters correct (right customer ID, valid types, no invented values)?
3. **Order and completeness:** Were all required calls made, in a sensible sequence?
4. **Restraint:** Did it avoid calling a tool when none was needed?

**How it's calculated**
- **Against a reference:** Compare the agent's calls with the expected calls in your golden dataset. Score = correct calls ÷ expected calls, or precision, recall and F1 if you also want to penalise extra calls.
- **Match strictness:** Exact match on tool name and arguments, or flexible match where the argument values may be phrased differently. An LLM judge can score the flexible cases.
- **Without a reference:** An LLM judge decides whether each call was appropriate for the request.

**Example**
- Request: "Close ticket INC123 and email the customer."
- Expected: `update_ticket(id="INC123", status="closed")`, then `send_email(...)`.
- Agent calls `update_ticket(id="INC132", ...)` and never sends the email. The tool name is right, but the argument is wrong and a call is missing, so the score is low.

**How it differs from related metrics**
- **Task completion:** Did the goal get achieved? An agent can complete the task through the wrong path, or fail despite correct calls.
- **Trajectory evaluation:** Judges the whole sequence of steps, including reasoning. Tool-call accuracy is one part of it.
- **Answer faithfulness or relevance:** These score the final text, not the actions.

**Why it matters for CWD**
Workers call MCP tools that can read or write enterprise systems. A wrong customer ID or wrong tool can leak data or change the wrong record. This metric catches those errors before production, and it helps separate routing mistakes (wrong Worker) from tool-selection mistakes (wrong tool) from argument mistakes.

**Ways to improve it**
- Clear, distinct tool names and descriptions, with strict JSON schemas.
- Validate arguments in code, and check the customer ID against the user's entitlements rather than trusting the model.
- Fewer, well-scoped tools per agent.
- Add failed production runs to the golden dataset.

**Caveat:** Several correct paths can exist for one task. Your reference set should allow acceptable alternatives, or you will penalise valid behaviour.

