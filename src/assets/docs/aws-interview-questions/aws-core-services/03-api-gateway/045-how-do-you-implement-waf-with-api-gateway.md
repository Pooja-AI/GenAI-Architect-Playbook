# How do you implement WAF with API Gateway?

## Short answer

I use **AWS WAF** in front of the API Gateway to inspect incoming HTTP requests and block common web attacks before they reach the CWD application.

```text
Client
   ↓
AWS WAF
   ↓
API Gateway
   ↓
Authentication / Authorization
   ↓
CWD API
   ↓
Coordinator
   ↓
Delegator
   ↓
Workers
```

For an AWS architecture, I would use **AWS WAF Web ACL rules** attached to the supported API Gateway resource, then monitor WAF actions through **CloudWatch** and WAF logging.

## Key points

1. **Create a WAF Web ACL**
2. **Associate it with API Gateway**
3. Use **AWS Managed Rules**
4. Add custom rules for CWD
5. Apply **rate-based rules**
6. Use IP/geo rules when appropriate
7. Monitor blocked/allowed requests
8. Tune rules to avoid false positives

---

## 1. Create a WAF Web ACL

A Web ACL contains the rules that decide:

```text
ALLOW
BLOCK
COUNT
```

Example:

```text
AWS WAF Web ACL
       ↓
 ┌─────┼───────────┐
 ↓     ↓           ↓
SQLi  XSS      Rate Limit
 ↓     ↓           ↓
BLOCK BLOCK       BLOCK
```

---

## 2. Associate WAF with API Gateway

Conceptually:

```text id="j6a1uo"
Internet
   ↓
AWS WAF
   ↓
API Gateway
   ↓
CWD
```

The WAF evaluates the HTTP request before it reaches the API integration.

---

## 3. Use AWS Managed Rules

I would start with AWS-managed rule groups rather than building every security rule myself.

They can help detect common patterns such as:

* SQL injection
* Cross-site scripting
* Malicious HTTP requests
* Known bad inputs
* Common web exploits

This gives a baseline protection layer.

---

## 4. Add rate-based rules

This is particularly useful for API abuse.

For example:

```text id="q18y9u"
Same source/IP
      ↓
Too many requests
      ↓
AWS WAF rate-based rule
      ↓
BLOCK
```

But I wouldn't rely only on IP because legitimate users can share IPs through NAT, proxies, or corporate networks.

For CWD, I would combine WAF controls with **API Gateway/user/tenant-level throttling**.

---

## 5. Add custom CWD rules

Suppose CWD exposes:

```text
/api/v1/customer-briefing
/api/v1/search
/api/v1/documents
```

I can create rules based on:

* URI path
* HTTP method
* IP reputation
* Request characteristics
* Rate
* Header patterns
* Request size

For example:

```text
POST /api/v1/customer-briefing
        ↓
WAF inspection
        ↓
Allowed → API Gateway
Blocked → Request rejected
```

---

## 6. Don't use WAF as authorization

This is an important interview distinction.

WAF answers:

> **“Does this HTTP request look malicious or abusive?”**

Authorization answers:

> **“Is this user allowed to access customer C12345?”**

So:

```text id="n0f7pq"
WAF
 ↓
API Gateway authentication
 ↓
CWD authorization
 ↓
Worker
 ↓
MCP authorization
 ↓
Salesforce / ServiceNow
```

WAF does **not** replace IAM, JWT authorization, RBAC, or enterprise entitlements.

---

## 7. Monitor WAF

I monitor:

```text id="v8d7v3"
Allowed requests
Blocked requests
Counted requests
Rate-limit matches
Rule matches
Top source IPs
```

I can send WAF logs to logging/analytics destinations and create CloudWatch alarms for unusual spikes.

For example:

```text id="u2v5n1"
Normal:
100 blocked requests/hour

Suddenly:
50,000 blocked requests/hour
          ↓
CloudWatch alarm
          ↓
Security investigation
```

---

## 8. Start with COUNT before BLOCK

For a new custom rule, I may initially use:

```text id="50kwr9"
COUNT
  ↓
Observe matches
  ↓
Check false positives
  ↓
Tune rule
  ↓
BLOCK
```

This is useful because an overly aggressive rule could block legitimate enterprise users.

---

## Example

Suppose an attacker sends a large number of suspicious requests:

```text id="fl48i9"
Attacker
   ↓
AWS WAF
   ↓
Rate-based rule
   ↓
BLOCK
   X
API Gateway
```

Normal request:

```text id="c9xj2m"
Employee
   ↓
AWS WAF
   ↓
ALLOW
   ↓
API Gateway
   ↓
JWT validation
   ↓
Authorization
   ↓
CWD
```

---

## 🎯 Strong interview answer

> **“I implement AWS WAF by creating a Web ACL and associating it with the API Gateway API. I start with AWS Managed Rules for common web attacks and add custom rules and rate-based rules for CWD-specific abuse patterns. WAF blocks malicious or excessive HTTP traffic before it reaches API Gateway and the CWD backend. I monitor allowed and blocked requests through WAF and CloudWatch, and I tune rules to avoid false positives. WAF is an additional security layer; it doesn't replace authentication, authorization, API Gateway throttling, or downstream entitlement checks.”**

## Easy memory trick

**A → R → C → M**

* **A**ssociate WAF
* **R**ules
* **C**ontrol abuse
* **M**onitor

### Key distinction

| Layer                     | Purpose                            |
| ------------------------- | ---------------------------------- |
| **AWS WAF**               | Detect/block malicious web traffic |
| **API Gateway**           | API boundary + throttling          |
| **Authentication**        | Identify caller                    |
| **Authorization**         | Determine permissions              |
| **CWD**                   | Agent orchestration                |
| **MCP/Enterprise system** | Downstream tool/data authorization |

**Interview line:**

> **“WAF protects the HTTP boundary; API Gateway controls API access; CWD authorization controls business and data access.”**
