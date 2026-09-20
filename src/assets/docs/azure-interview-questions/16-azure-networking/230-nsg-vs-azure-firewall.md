# NSG vs Azure Firewall?

## Short answer
NSGs are simple, distributed L3/L4 filters; Azure Firewall is a centralised, managed L3–L7 firewall service.

## Key points
- NSG: allow or deny by IP, port and service tag at subnet or NIC.
- Firewall: FQDN filtering, threat intelligence, TLS inspection and IDPS on premium, central logging.

## CWD context
Use NSGs for segmentation and Azure Firewall for controlled egress.
