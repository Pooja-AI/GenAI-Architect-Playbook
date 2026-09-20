The key point is: **the LLM should never be trusted to create or invent a Delegator.** It can *propose* one, but deterministic CWD logic validates it before execution.

### CWD flow

```text
User Request
     ↓
Coordinator
     ↓
LLM understands intent
     ↓
LLM proposes: "SalesDelegator"
     ↓
Delegator Registry  ← Source of Truth
     ↓
Does SalesDelegator exist?
Does it support this intent?
Does it support required capabilities?
Is it authorized?
Is it healthy?
     ↓
YES → Execute
NO  → Reject / Re-route / Ask clarification
```

### Example

User:

> "Prepare a customer briefing for C123."

LLM might produce:

```json
{
  "intent": "CustomerBriefing",
  "delegator": "SalesDelegator"
}
```

Coordinator **does not immediately call** `SalesDelegator`.

It validates:

```python
def validate_delegator(intent, proposed_delegator):
    delegator = DELEGATOR_REGISTRY.get(proposed_delegator)

    if not delegator:
        raise ValueError("Unknown Delegator")

    if intent not in delegator["intents"]:
        raise ValueError("Delegator does not support this intent")

    return True
```

Suppose the LLM hallucinates:

```json
{
  "intent": "CustomerBriefing",
  "delegator": "CustomerRelationshipDelegator"
}
```

But `CustomerRelationshipDelegator` doesn't exist in the registry.

```text
LLM proposal
     ↓
CustomerRelationshipDelegator
     ↓
Registry lookup
     ↓
NOT FOUND
     ↓
❌ Do not execute
```

The Coordinator can then either use the deterministic routing map:

```python
INTENT_ROUTING = {
    "CustomerBriefing": "SalesDelegator",
    "IncidentAnalysis": "ITDelegator",
    "ManufacturingFailureAnalysis": "ManufacturingDelegator"
}
```

or ask for clarification if the request itself is ambiguous.

### Multiple layers of protection

In production CWD, I would use several controls:

1. **Delegator Registry** — authoritative list of valid Delegators.
2. **Schema validation** — LLM must return a structured response.
3. **Intent → Delegator mapping** — deterministic routing for known workflows.
4. **Capability validation** — Delegator must support the requested capabilities.
5. **Authorization** — user must be entitled to use that Delegator/domain.
6. **Health check** — Delegator must currently be available.
7. **Allowlist** — LLM cannot dynamically invent arbitrary agent/service names.
8. **Observability** — log the proposed and final Delegator for auditing and troubleshooting.

### Very important architectural principle

**Don't let the LLM directly instantiate or call an arbitrary Delegator.**

Instead:

```text
LLM = Intelligence / Proposal
Registry + Policy = Control
Coordinator = Orchestration
Delegator = Domain execution
```

### Interview-ready answer

> **"We prevent hallucinated Delegators by treating the Delegator Registry as the source of truth. The LLM only proposes the intent or possible Delegator; it cannot directly invoke an arbitrary agent. The Coordinator validates the proposed Delegator against the registry, supported intents, capabilities, authorization policies, and health status. For known workflows, we can use deterministic intent-to-Delegator mappings. If the proposed Delegator is not registered or doesn't support the requested capability, we don't execute it—we either use the validated route or ask for clarification."**

**One line to memorize:**

> **"The LLM can propose a Delegator, but only the registry and deterministic policy can authorize its execution."**
