### Scenario 10: MCP tool succeeds but Worker reports failure

I would investigate the **response-handling layer**:

1. **Check MCP response**

   * Did MCP return HTTP 200 / successful result?
   * Was the response complete and valid?

2. **Check response parsing**

   * Is the Worker correctly parsing the MCP response?
   * Schema mismatch or serialization issue?

3. **Check timeout**

   * Tool may succeed, but Worker timeout may occur while processing the response.

4. **Check validation**

   * Did the response fail **Pydantic/JSON Schema validation**?

5. **Check error handling**

   * Is the Worker incorrectly converting a successful response into a failure?
   * Check exception handling and retry logic.

6. **Use correlation ID**

   * Trace:
     `Worker → MCP → Tool → MCP Response → Worker Processing`

### Interview answer

> **"If the MCP tool succeeds but the Worker reports failure, I would compare the MCP success response with the Worker's processing logs. I would check response parsing, schema validation, timeouts, serialization, and exception handling. Using the correlation ID and distributed tracing, I can identify exactly where the successful response was converted into a failure."**
