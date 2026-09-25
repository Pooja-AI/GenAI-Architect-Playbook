# How would you implement Retry and Catch?

In CWD, I use **Retry for temporary failures** and **Catch for failures that cannot be successfully retried**.

```text
Worker
  ↓
Error
  ↓
Is it transient?
 ↙          ↘
Yes          No
 ↓            ↓
Retry        Catch
 ↓            ↓
Success?    Fallback / Partial Result / Fail
```

## 1. Retry transient failures

Examples:

* Timeout
* Temporary network error
* HTTP 429 throttling
* Temporary 5xx error
* Temporary Salesforce/ServiceNow unavailability

Example policy:

```text
Attempt 1
   ↓
Wait 2 sec
   ↓
Attempt 2
   ↓
Wait 4 sec
   ↓
Attempt 3
   ↓
Wait 8 sec
```

Use **exponential backoff** and preferably **jitter** to avoid many Workers retrying simultaneously.

---

## 2. Catch permanent/unrecoverable failures

Examples:

* Invalid request
* Invalid tool parameters
* Authorization failure
* Business validation failure
* Maximum retries exceeded

Then use `Catch`:

```text
Salesforce Worker
       ↓
     Retry
       ↓
 Still failing
       ↓
     Catch
       ↓
 ┌─────┴─────────┐
 ↓               ↓
Optional       Mandatory
 ↓               ↓
Continue       Fail workflow
```

---

## 3. CWD example

Suppose the Incident Worker calls ServiceNow.

```text
Incident Worker
      ↓
ServiceNow
      ↓
HTTP 503
      ↓
Retry
      ↓
HTTP 503
      ↓
Retry
      ↓
Success
```

If all retries fail:

```text
Incident Worker
      ↓
Retry exhausted
      ↓
Catch
      ↓
Incident Worker failed
      ↓
Is Incident optional?
      ↓
Yes
      ↓
Continue with Customer + Sales results
```

The final response should explicitly indicate that incident information was unavailable.

---

## 4. Don't retry everything

This is very important in an interview.

```text
429 / timeout / temporary 5xx
        → Retry

400 invalid request
        → Don't retry

401/403 authorization
        → Don't blindly retry

Business validation error
        → Don't retry
```

Otherwise, you can create a **retry storm**.

---

## 🎯 Strong interview answer

> **“I implement Retry for transient failures such as timeouts, throttling, temporary network failures, and selected 5xx errors. I use exponential backoff with jitter and a maximum retry count. If the error is non-retryable or retries are exhausted, I use Catch to route the workflow to an appropriate recovery path. In CWD, an optional Worker can return a partial result, while failure of a mandatory Worker can fail or pause the workflow. I also use idempotency so retries don't create duplicate Salesforce or ServiceNow operations.”**

### Easy memory trick

**Retry = Try again**

**Catch = What should I do if retry doesn't work?**

### Key distinction

**Retry handles temporary failure.**
**Catch handles the recovery path after an error cannot be successfully retried.**
