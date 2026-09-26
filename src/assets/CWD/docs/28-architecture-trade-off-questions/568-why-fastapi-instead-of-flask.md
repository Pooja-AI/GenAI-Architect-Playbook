### Why FastAPI instead of Flask?

* **FastAPI** provides strong **async support**, useful for LLM, MCP, and downstream API calls.
* Built-in **Pydantic validation** for request/response schemas.
* Automatic **OpenAPI/Swagger documentation**.
* Better fit for **high-concurrency AI APIs**.
* Type hints make APIs easier to maintain.

**Interview answer:**

> “We chose FastAPI because CWD is an AI API platform with many asynchronous operations such as LLM calls, MCP calls, and downstream enterprise APIs. FastAPI gives us async support, Pydantic-based validation, automatic API documentation, and good performance for concurrent workloads. Flask could also work, but FastAPI was a better fit for our AI service architecture.”
