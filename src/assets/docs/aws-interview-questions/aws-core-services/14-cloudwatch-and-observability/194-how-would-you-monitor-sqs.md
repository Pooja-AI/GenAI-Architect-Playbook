### Monitor SQS

Use **CloudWatch metrics + DLQ monitoring**.

```text id="x2m7qa"
Producer
   ↓
 SQS Queue
   ↓
 Worker
   ↓
CloudWatch
 ├── Queue Depth
 ├── Message Age
 ├── DLQ Messages
 └── Processing/Failure
```

Monitor:

* **ApproximateNumberOfMessagesVisible** → queue backlog
* **ApproximateAgeOfOldestMessage** → processing delay
* **ApproximateNumberOfMessagesNotVisible** → messages currently being processed
* **DLQ message count** → repeatedly failed messages
* **NumberOfMessagesSent/Received/Deleted** → traffic and processing behavior

### Interview answer

> “I monitor SQS using CloudWatch for queue depth, oldest message age, in-flight messages, and DLQ messages. If the backlog or message age increases, I check whether consumers are slow or failing and scale the Workers. If messages move to the DLQ, I investigate the failure before controlled replay.”

**Memory:**
**Backlog → Age → In-flight → DLQ → Scale**
