**Agent routing accuracy** measures how often the router sends a request to the correct agent. In CWD, the router is the Coordinator choosing a Delegator, and a Delegator choosing its Workers.

**How it's calculated**
1. Build a labelled dataset of requests, each with the correct agent (or set of agents) recorded.
2. Run the requests through the router.
3. Score = correctly routed requests ÷ total requests.

**Levels worth measuring separately**
- **Coordinator → Delegator:** Did the request reach the right domain (CRM, ITSM, knowledge and so on)?
- **Delegator → Worker:** Did it pick the right Workers?
- **Multi-agent requests:** If a request needs two Delegators, score precision and recall on the set, not a single yes or no.
- **No-route cases:** Out-of-scope or unsafe requests should be refused or escalated. Count these as correct only if the router does that.

**Useful breakdowns**
- A confusion matrix, showing which agents get mistaken for which.
- Accuracy per intent, tenant type and difficulty.
- Ambiguous requests, where the right behaviour is to ask a clarifying question.
- Hallucinated routes, meaning a Delegator that isn't in the Agent Registry.

**Example**
- Request: "Why is my ServiceNow ticket still open, and what's our escalation policy?"
- Correct route: the ITSM Delegator for the ticket, plus the knowledge Delegator for the policy.
- The router sends it only to knowledge. It has lost the ticket part, so recall on that request is 0.5.

**How it differs from related metrics**
- **Tool-call accuracy:** Checks the tools and arguments inside an agent. Routing accuracy checks which agent gets the work.
- **Task completion:** A wrong route usually fails the task, but a right route can still fail later. Measuring routing separately shows where the failure started.
- **Intent classification accuracy:** Closely related. Routing also depends on availability, permissions and the registry.

**Why it matters for CWD**
Routing errors are costly because they waste LLM calls, produce off-topic answers and can send a request to an agent that shouldn't see the data. It is also cheap to test, since you don't need to run the full workflow.

**Ways to improve it**
- Clear capability descriptions in the Agent Registry.
- A rules layer for obvious cases, with the LLM only for ambiguous ones.
- Few-shot examples or a small trained classifier for intent.
- Validate the chosen agent against the registry and the user's permissions.
- Turn every production misroute into a new test case.

**Caveat:** Labels can be subjective when a request could go to two agents. Agree on the labelling rules first, and accept a set of valid routes where several are reasonable.

