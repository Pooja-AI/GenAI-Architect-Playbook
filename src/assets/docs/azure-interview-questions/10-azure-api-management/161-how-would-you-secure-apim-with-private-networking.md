# How would you secure APIM with private networking?

## Short answer
Place APIM in a private network and expose it only through a controlled entry point.

## Key points
- VNet injection or integration (capability depends on the tier).
- Front with Application Gateway or Front Door; NSG rules and private DNS.
- Backends private with public access disabled.

## CWD context
Verify tier features against requirements before choosing.
