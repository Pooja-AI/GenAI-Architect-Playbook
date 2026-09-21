# DynamoDB vs RDS?

## Short answer
DynamoDB suits key-based operational state; RDS or Aurora suits relational data and ad-hoc queries.

## Key points
- DynamoDB: massive scale, serverless, flexible schema, limited query flexibility.
- RDS: joins, SQL, cross-table transactions, reporting.

## CWD context
Runtime state in DynamoDB; analytics in Athena, Redshift or Aurora.
