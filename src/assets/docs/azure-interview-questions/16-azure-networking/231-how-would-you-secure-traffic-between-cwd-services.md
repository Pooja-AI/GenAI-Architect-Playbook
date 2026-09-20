# How would you secure traffic between CWD services?

## Short answer
Secure service-to-service traffic with private paths, identity and encryption, not network position alone.

## Key points
- Private endpoints, internal ingress and NSG micro-segmentation.
- Entra tokens between services; mTLS inside the environment where supported.
- TLS 1.2 or higher; restricted egress via Firewall.

## CWD context
Assume the network can be breached; authenticate every call.
