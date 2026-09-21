# REST API vs HTTP API—which would you choose?

## Short answer
HTTP APIs are cheaper and simpler; REST APIs are richer.

## Key points
- HTTP API: lower cost and latency, JWT authorisers, simple proxying; no direct WAF association.
- REST API: usage plans and API keys, request validation models, WAF, caching, resource policies, private APIs.
- Choose REST for external CWD needing WAF, usage plans and validation; HTTP for simple internal JWT proxying.

## CWD context
If using HTTP APIs externally, put CloudFront with WAF in front.
