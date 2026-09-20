# How do you implement least privilege?

## Short answer
Grant the minimum roles at the narrowest scope, per component, and review regularly.

## Key points
- Separate identity per component; data-plane roles rather than management roles.
- PIM for time-bound human elevation; access reviews.
- Tool allowlists per Delegator and Worker.
- Policy as code and log review.

## CWD context
Least privilege applies to agents and tools as much as to people.
