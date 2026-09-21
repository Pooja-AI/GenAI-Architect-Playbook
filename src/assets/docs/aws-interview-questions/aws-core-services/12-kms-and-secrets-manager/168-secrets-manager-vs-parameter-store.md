# Secrets Manager vs Parameter Store?

## Short answer
Secrets Manager adds rotation and replication at higher cost; Parameter Store is cheaper and simpler.

## Key points
- Secrets Manager: built-in rotation, replication, per-secret charge.
- Parameter Store: free standard tier, SecureString, hierarchy; no built-in rotation.

## CWD context
Secrets Manager for rotating credentials; Parameter Store or AppConfig for configuration.
