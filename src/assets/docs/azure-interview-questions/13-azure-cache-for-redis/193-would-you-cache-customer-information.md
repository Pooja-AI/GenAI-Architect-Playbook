# Would you cache customer information?

## Short answer
Cache customer information only briefly and with strict scoping.

## Key points
- Short TTL, key scoped by tenant and user entitlement.
- Encrypt and minimise fields; avoid caching regulated data.
- Invalidate on update events.

## CWD context
Freshness for customer data usually outweighs caching benefit.
