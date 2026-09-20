# How do you implement rate limiting?

## Short answer
Limit call rates with rate-limit-by-key and quota-by-key.

## Key points
- Key by tenant ID, user claim or client IP.
- Return 429 with Retry-After.
- Different limits per tier or product.

## CWD context
Rate limits protect capacity; token limits protect model quota.
