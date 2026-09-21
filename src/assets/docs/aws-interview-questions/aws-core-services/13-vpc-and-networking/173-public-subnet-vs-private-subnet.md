# Public subnet vs private subnet?

## Short answer
A public subnet has a route to an internet gateway; a private subnet does not.

## Key points
- Public: resources can have public IPs and be reached from the internet.
- Private: outbound traffic goes through a NAT gateway or VPC endpoints; inbound only from inside the VPC or through a load balancer.

## CWD context
Only edge components belong in public subnets.
