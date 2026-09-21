# What is a NAT Gateway?

## Short answer
A NAT gateway lets private resources make outbound connections without allowing inbound ones.

## Key points
- Lives in a public subnet with an Elastic IP; one per AZ for availability.
- Charged per hour and per GB processed.

## CWD context
NAT cost grows with traffic, so keep AWS-service traffic on VPC endpoints.
