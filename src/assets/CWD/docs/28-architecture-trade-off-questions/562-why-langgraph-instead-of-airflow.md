### Why LangGraph instead of Airflow?

* **LangGraph** is designed for **LLM/agent orchestration and stateful agent workflows**.
* **Airflow** is primarily designed for **data pipelines and scheduled batch workflows**.

For CWD, we needed:

* Dynamic **Coordinator → Delegator → Worker** routing
* Agent state and checkpointing
* LLM-based decisions
* Tool/MCP calling
* Parallel agent execution
* Human-in-the-loop
* Retry and resume at the agent level

**Interview answer:**

> “I chose LangGraph because CWD is primarily an LLM-driven multi-agent orchestration problem. We needed dynamic routing between the Coordinator, Delegators, and Workers, along with agent state, tool calling, parallel execution, checkpointing, and human-in-the-loop. Airflow is better suited for scheduled data and ETL pipelines. So LangGraph was a better fit for the agent orchestration layer.”
