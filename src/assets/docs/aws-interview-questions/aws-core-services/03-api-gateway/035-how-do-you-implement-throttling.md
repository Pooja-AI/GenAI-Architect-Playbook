# How do you implement throttling?

## Short answer
Throttle at account, stage, method and usage-plan levels.

## Key points
- Account default is a steady rate plus burst per region; override per stage or method.
- Usage plans give per-key rate, burst and quota (REST APIs); excess requests get 429.
- Add WAF rate-based rules for abusive clients.

## CWD context
Gateway throttling protects the backend; token quotas protect Bedrock.
