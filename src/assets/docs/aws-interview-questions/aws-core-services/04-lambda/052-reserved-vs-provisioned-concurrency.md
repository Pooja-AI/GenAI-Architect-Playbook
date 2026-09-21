# Reserved vs provisioned concurrency?

## Short answer
Reserved concurrency guarantees and caps a function's share; provisioned concurrency keeps environments pre-initialised.

## Key points
- Reserved: no extra charge; protects critical functions and caps noisy ones and downstream systems.
- Provisioned: extra cost; removes cold starts.
- They can be combined.

## CWD context
Use reserved concurrency to protect Bedrock and MCP servers from Lambda fan-out.
