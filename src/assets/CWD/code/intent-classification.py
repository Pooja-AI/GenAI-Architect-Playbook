Yes. Below is a Python reference implementation for the CWD Coordinator that identifies intent, classifies the business domain, maps the request to a workflow, and discovers the appropriate Delegator.

The example uses Pydantic for structured output and a capability registry. The LLM adapter is intentionally separated from routing so that authorization and agent selection remain controlled by the platform.


Python

Run

```
# coordinator_intent_routing.py
#
# Reference implementation for:
# User request
#   → Intent identification
#   → Domain classification
#   → Action identification
#   → Workflow mapping
#   → Delegator discovery
#   → Execution path selection

from __future__ import annotations

from enum import Enum
from typing import Any, Protocol

from pydantic import BaseModel, Field


# ============================================================
# 1. Structured intent models
# ============================================================

class BusinessDomain(str, Enum):
    SALES = "sales"
    FINANCE = "finance"
    SUPPLY_CHAIN = "supply_chain"
    HR = "hr"
    QUALITY = "quality"
    CALENDAR = "calendar"
    CUSTOMER_EXPERIENCE = "customer_experience"
    BUSINESS_ANALYSIS = "business_analysis"
    UNKNOWN = "unknown"


class ExecutionMode(str, Enum):
    DIRECT = "direct"
    SEQUENTIAL = "sequential"
    PARALLEL_THEN_AGGREGATE = "parallel_then_aggregate"
    MULTI_DOMAIN = "multi_domain"
    HUMAN_APPROVAL = "human_approval"


class IntentAnalysis(BaseModel):
    intent: str = Field(description="Canonical business intent")
    domain: BusinessDomain
    confidence: float = Field(ge=0.0, le=1.0)

    entities: dict[str, Any] = Field(default_factory=dict)
    actions: list[str] = Field(default_factory=list)

    required_capability: str
    workflow_id: str | None = None

    output_type: str = "text"
    requires_enterprise_data: bool = False
    requires_clarification: bool = False
    clarification_question: str | None = None

    execution_mode: ExecutionMode = ExecutionMode.DIRECT


class UserRequest(BaseModel):
    user_id: str
    session_id: str
    message_id: str
    correlation_id: str
    message: str
    channel: str = "teams"
    roles: list[str] = Field(default_factory=list)


class AgentMetadata(BaseModel):
    agent_id: str
    agent_type: str
    domain: BusinessDomain
    capabilities: list[str]
    supported_workflows: list[str]
    endpoint: str
    status: str = "healthy"


class ExecutionPlan(BaseModel):
    task_id: str
    intent: str
    domain: BusinessDomain
    workflow_id: str
    delegator_id: str
    execution_mode: ExecutionMode
    entities: dict[str, Any]
    actions: list[str]
    required_capability: str
    correlation_id: str


# ============================================================
# 2. LLM interface
# ============================================================

class IntentLLM(Protocol):
    def analyze_intent(self, message: str) -> IntentAnalysis:
        ...


class MockIntentLLM:
    """
    Local mock implementation.

    Replace this class with the actual Azure OpenAI / LLM service
    used by the production Coordinator.
    """

    def analyze_intent(self, message: str) -> IntentAnalysis:
        text = message.lower()

        if "customer briefing" in text:
            return IntentAnalysis(
                intent="create_customer_briefing",
                domain=BusinessDomain.SALES,
                confidence=0.96,
                entities={"customer": "ABC"},
                actions=[
                    "retrieve_customer_profile",
                    "retrieve_sales_information",
                    "retrieve_open_opportunities",
                    "retrieve_recent_interactions",
                    "generate_customer_briefing",
                ],
                required_capability="customer_briefing",
                workflow_id="customer_briefing_workflow",
                output_type="business_document",
                requires_enterprise_data=True,
                execution_mode=ExecutionMode.PARALLEL_THEN_AGGREGATE,
            )

        if "open opportunities" in text:
            return IntentAnalysis(
                intent="retrieve_open_opportunities",
                domain=BusinessDomain.SALES,
                confidence=0.94,
                entities={"customer": "ABC"},
                actions=["retrieve_open_opportunities"],
                required_capability="opportunity_analysis",
                workflow_id="opportunity_retrieval_workflow",
                requires_enterprise_data=True,
            )

        if "revenue" in text and "analy" in text:
            return IntentAnalysis(
                intent="analyze_revenue",
                domain=BusinessDomain.FINANCE,
                confidence=0.91,
                entities={},
                actions=["retrieve_revenue", "analyze_revenue"],
                required_capability="revenue_analysis",
                workflow_id="revenue_analysis_workflow",
                requires_enterprise_data=True,
                execution_mode=ExecutionMode.SEQUENTIAL,
            )

        return IntentAnalysis(
            intent="unknown",
            domain=BusinessDomain.UNKNOWN,
            confidence=0.20,
            required_capability="unknown",
            requires_clarification=True,
            clarification_question=(
                "Could you clarify what business information or action "
                "you need?"
            ),
        )


# ============================================================
# 3. Agent Registry
# ============================================================

class AgentRegistry:
    """
    In production, this can call the CWD Agent Registry API.

    The Coordinator searches by capability rather than hard-coding
    every Worker implementation.
    """

    def __init__(self) -> None:
        self.agents = [
            AgentMetadata(
                agent_id="sales-delegator",
                agent_type="delegator",
                domain=BusinessDomain.SALES,
                capabilities=[
                    "customer_briefing",
                    "opportunity_analysis",
                    "customer_status",
                ],
                supported_workflows=[
                    "customer_briefing_workflow",
                    "opportunity_retrieval_workflow",
                ],
                endpoint="https://sales-delegator.internal",
            ),
            AgentMetadata(
                agent_id="finance-delegator",
                agent_type="delegator",
                domain=BusinessDomain.FINANCE,
                capabilities=["revenue_analysis"],
                supported_workflows=[
                    "revenue_analysis_workflow",
                ],
                endpoint="https://finance-delegator.internal",
            ),
        ]

    def discover(
        self,
        domain: BusinessDomain,
        capability: str,
        workflow_id: str | None = None,
    ) -> AgentMetadata | None:

        candidates = [
            agent
            for agent in self.agents
            if agent.agent_type == "delegator"
            and agent.domain == domain
            and capability in agent.capabilities
            and agent.status == "healthy"
        ]

        if workflow_id:
            candidates = [
                agent
                for agent in candidates
                if workflow_id in agent.supported_workflows
            ]

        return candidates[0] if candidates else None


# ============================================================
# 4. Workflow Registry
# ============================================================

class WorkflowRegistry:
    """
    Maps canonical business intents to approved workflows.

    This prevents the LLM from inventing arbitrary workflow names.
    """

    def __init__(self) -> None:
        self.workflows = {
            "create_customer_briefing": {
                "workflow_id": "customer_briefing_workflow",
                "domain": BusinessDomain.SALES,
                "required_capability": "customer_briefing",
                "execution_mode": ExecutionMode.PARALLEL_THEN_AGGREGATE,
            },
            "retrieve_open_opportunities": {
                "workflow_id": "opportunity_retrieval_workflow",
                "domain": BusinessDomain.SALES,
                "required_capability": "opportunity_analysis",
                "execution_mode": ExecutionMode.DIRECT,
            },
            "analyze_revenue": {
                "workflow_id": "revenue_analysis_workflow",
                "domain": BusinessDomain.FINANCE,
                "required_capability": "revenue_analysis",
                "execution_mode": ExecutionMode.SEQUENTIAL,
            },
        }

    def resolve(self, intent: str) -> dict[str, Any] | None:
        return self.workflows.get(intent)


# ============================================================
# 5. Policy and authorization service
# ============================================================

class PolicyService:
    """
    Simplified policy layer.

    Production implementation should use Entra ID, RBAC, domain
    policies, data entitlements, and OFA/data-access controls.
    """

    def authorize(
        self,
        request: UserRequest,
        analysis: IntentAnalysis,
    ) -> bool:

        if analysis.domain == BusinessDomain.SALES:
            return "sales-user" in request.roles

        if analysis.domain == BusinessDomain.FINANCE:
            return "finance-user" in request.roles

        return False


# ============================================================
# 6. Coordinator
# ============================================================

class Coordinator:
    def __init__(
        self,
        llm: IntentLLM,
        agent_registry: AgentRegistry,
        workflow_registry: WorkflowRegistry,
        policy_service: PolicyService,
    ) -> None:

        self.llm = llm
        self.agent_registry = agent_registry
        self.workflow_registry = workflow_registry
        self.policy_service = policy_service

    def identify_intent(
        self,
        request: UserRequest,
    ) -> IntentAnalysis:

        # The LLM interprets the natural-language request.
        analysis = self.llm.analyze_intent(request.message)

        # Confidence and clarification are checked before routing.
        if analysis.confidence < 0.70:
            analysis.requires_clarification = True
            analysis.clarification_question = (
                "Could you provide more details about the business "
                "information or action you need?"
            )

        return analysis

    def validate_intent(
        self,
        analysis: IntentAnalysis,
    ) -> None:

        if analysis.domain == BusinessDomain.UNKNOWN:
            raise ValueError("Unable to identify a supported business domain")

        if not analysis.required_capability:
            raise ValueError("No required capability identified")

        if not analysis.actions:
            raise ValueError("No business actions identified")

    def authorize_request(
        self,
        request: UserRequest,
        analysis: IntentAnalysis,
    ) -> None:

        if not self.policy_service.authorize(request, analysis):
            raise PermissionError(
                f"User is not authorized for domain: {analysis.domain.value}"
            )

    def map_to_workflow(
        self,
        analysis: IntentAnalysis,
    ) -> dict[str, Any]:

        workflow = self.workflow_registry.resolve(analysis.intent)

        if workflow is None:
            raise LookupError(
                f"No approved workflow exists for intent: {analysis.intent}"
            )

        if workflow["domain"] != analysis.domain:
            raise ValueError("Intent domain does not match workflow domain")

        return workflow

    def discover_delegator(
        self,
        analysis: IntentAnalysis,
        workflow: dict[str, Any],
    ) -> AgentMetadata:

        agent = self.agent_registry.discover(
            domain=analysis.domain,
            capability=workflow["required_capability"],
            workflow_id=workflow["workflow_id"],
        )

        if agent is None:
            raise LookupError(
                "No healthy Delegator supports the required capability"
            )

        return agent

    def create_execution_plan(
        self,
        request: UserRequest,
        analysis: IntentAnalysis,
        workflow: dict[str, Any],
        delegator: AgentMetadata,
    ) -> ExecutionPlan:

        return ExecutionPlan(
            task_id=f"task-{request.message_id}",
            intent=analysis.intent,
            domain=analysis.domain,
            workflow_id=workflow["workflow_id"],
            delegator_id=delegator.agent_id,
            execution_mode=workflow["execution_mode"],
            entities=analysis.entities,
            actions=analysis.actions,
            required_capability=workflow["required_capability"],
            correlation_id=request.correlation_id,
        )

    def interpret_and_route(
        self,
        request: UserRequest,
    ) -> dict[str, Any]:

        # ----------------------------------------------------
        # Step 1: Identify intent
        # ----------------------------------------------------
        analysis = self.identify_intent(request)

        if analysis.requires_clarification:
            return {
                "status": "clarification_required",
                "question": analysis.clarification_question,
                "intent": analysis.intent,
                "confidence": analysis.confidence,
            }

        # ----------------------------------------------------
        # Step 2: Validate interpretation
        # ----------------------------------------------------
        self.validate_intent(analysis)

        # ----------------------------------------------------
        # Step 3: Enforce authorization
        # ----------------------------------------------------
        self.authorize_request(request, analysis)

        # ----------------------------------------------------
        # Step 4: Map intent to approved workflow
        # ----------------------------------------------------
        workflow = self.map_to_workflow(analysis)

        # ----------------------------------------------------
        # Step 5: Discover appropriate Delegator
        # ----------------------------------------------------
        delegator = self.discover_delegator(
            analysis,
            workflow,
        )

        # ----------------------------------------------------
        # Step 6: Create execution plan
        # ----------------------------------------------------
        plan = self.create_execution_plan(
            request,
            analysis,
            workflow,
            delegator,
        )

        # ----------------------------------------------------
        # Step 7: Return routing decision
        # ----------------------------------------------------
        return {
            "status": "routed",
            "intent_analysis": analysis.model_dump(),
            "selected_delegator": delegator.model_dump(),
            "execution_plan": plan.model_dump(),
        }


# ============================================================
# 7. Example execution
# ============================================================

if __name__ == "__main__":

    coordinator = Coordinator(
        llm=MockIntentLLM(),
        agent_registry=AgentRegistry(),
        workflow_registry=WorkflowRegistry(),
        policy_service=PolicyService(),
    )

    request = UserRequest(
        user_id="user-123",
        session_id="session-456",
        message_id="message-789",
        correlation_id="corr-001",
        message=(
            "Prepare a customer briefing for customer ABC "
            "using the latest sales information and recent interactions."
        ),
        channel="teams",
        roles=["sales-user"],
    )

    result = coordinator.interpret_and_route(request)

    from pprint import pprint

    pprint(result)
```

## Expected Output

Python

Run

```
{
    "status": "routed",
    "intent_analysis": {
        "intent": "create_customer_briefing",
        "domain": "sales",
        "confidence": 0.96,
        "entities": {
            "customer": "ABC"
        },
        "actions": [
            "retrieve_customer_profile",
            "retrieve_sales_information",
            "retrieve_open_opportunities",
            "retrieve_recent_interactions",
            "generate_customer_briefing"
        ],
        "required_capability": "customer_briefing",
        "workflow_id": "customer_briefing_workflow",
        "output_type": "business_document",
        "requires_enterprise_data": True,
        "requires_clarification": False,
        "execution_mode": "parallel_then_aggregate"
    },
    "selected_delegator": {
        "agent_id": "sales-delegator",
        "agent_type": "delegator",
        "domain": "sales",
        "capabilities": [
            "customer_briefing",
            "opportunity_analysis",
            "customer_status"
        ],
        "supported_workflows": [
            "customer_briefing_workflow",
            "opportunity_retrieval_workflow"
        ],
        "endpoint": "https://sales-delegator.internal",
        "status": "healthy"
    },
    "execution_plan": {
        "task_id": "task-message-789",
        "intent": "create_customer_briefing",
        "domain": "sales",
        "workflow_id": "customer_briefing_workflow",
        "delegator_id": "sales-delegator",
        "execution_mode": "parallel_then_aggregate",
        "entities": {
            "customer": "ABC"
        },
        "actions": [
            "retrieve_customer_profile",
            "retrieve_sales_information",
            "retrieve_open_opportunities",
            "retrieve_recent_interactions",
            "generate_customer_briefing"
        ],
        "required_capability": "customer_briefing",
        "correlation_id": "corr-001"
    }
}
```

## How Each Component Maps to CWD

|
Python component

|

CWD responsibility

|
| --- | --- |
|

`IntentLLM`

|

LLM-based intent interpretation

|
|

`IntentAnalysis`

|

Structured intent, domain, entities, and actions

|
|

`WorkflowRegistry`

|

Approved intent-to-workflow mapping

|
|

`AgentRegistry`

|

Delegator capability discovery

|
|

`PolicyService`

|

Authorization and governance

|
|

`Coordinator`

|

Enterprise-level interpretation and routing

|
|

`ExecutionPlan`

|

Structured downstream execution request

|
|

`MockIntentLLM`

|

Local test adapter; replace with Azure OpenAI

|
|

`interpret_and_route()`

|

Main Coordinator routing workflow

|

## Production Execution After Routing

The code above stops after creating the execution plan. In the production CWD flow, the next step is:

```
ExecutionPlan
      ↓
A2A Task Factory
      ↓
A2A Gateway
      ↓
Sales Delegator
      ↓
LangGraph / Domain Workflow
      ↓
Workers
      ↓
MCP / Governed Tools
      ↓
Enterprise Systems
      ↓
A2A Result
      ↓
Coordinator Aggregation
```

### Important production distinction

The LLM may suggest:

```
Intent = create_customer_briefing
Domain = Sales
Capability = customer_briefing
```

But the Coordinator must independently verify:

```
Is the intent supported?
Is the domain valid?
Is the workflow approved?
Is the user authorized?
Does the Agent Registry contain a healthy Delegator?
Does the Delegator support the capability?
```

Only after these checks should the Coordinator route the task.

> LLM identifies the business meaning; the Coordinator validates the meaning and controls the execution path.
