# Explain the VNet architecture for CWD.

## Short answer
Use a hub-spoke VNet design with segmented subnets and private connectivity.

## Key points
- Subnets for ingress (Application Gateway / APIM), Container Apps environment, private endpoints and integration components.
- NSGs per subnet; Azure Firewall for central egress control.
- Private DNS zones linked to the VNets; ExpressRoute or VPN to on-premises sources.
- Separate networks and subscriptions per environment.

## CWD context
Only the ingress layer is internet-facing.
