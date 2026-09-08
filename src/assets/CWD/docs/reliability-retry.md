# Retry Strategies in CWD

Retry strategies determine when a failed operation should be attempted again, how long to wait, and when to stop.

In CWD, retries should be applied to the smallest failed operation—such as an LLM call, tool invocation, message delivery, or Worker task—not blindly to the entire workflow.

## 1. Why retries are necessary

Distributed systems fail temporarily because of:

* Network interruptions

* Service overload

* Rate limits

* Temporary database unavailability

* LLM provider timeouts

* Messaging broker delays

* Worker startup failures

* Connection pool exhaustion

A retry can recover from these transient failures without requiring the user to submit the request again.

However, retrying every error is dangerous. It can cause:

* Duplicate business actions

* Increased latency

* Higher LLM cost

* Traffic amplification during outages

* Repeated failures

* Cascading system overload

Therefore, CWD needs a failure-aware retry policy.

# 2. Transient versus permanent failures

The first decision is whether the failure is likely to disappear if the operation is attempted again.

## Transient failure

A transient failure is temporary and may succeed later.

Examples:

```
HTTP 429 Too Many Requests
HTTP 500 Internal Server Error
HTTP 502 Bad Gateway
HTTP 503 Service Unavailable
HTTP 504 Gateway Timeout
Network timeout
Temporary connection failure
Worker temporarily unavailable
```

These failures are usually retryable, subject to limits.

## Permanent failure

A permanent failure is unlikely to succeed without changing the request, configuration, credentials, or data.

Examples:

```
Invalid API key
HTTP 400 Bad Request
Invalid tool arguments
Malformed workflow definition
Missing required customer ID
Unauthorized operation
Unsupported model
Nonexistent database record
Business validation failure
```

These should normally not be retried.

```
Transient failure → wait → retry
Permanent failure → stop → return error or escalate
```

# 3. Retry decision flow

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_kt_%22%20width%3D%22585.32080078125%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%221382.4000244140625%22%20viewBox%3D%224%204%20585.32080078125%201382.4000244140625%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_kt_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_kt_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_kt_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_kt_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_kt_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_kt_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_kt_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_kt_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_kt_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_kt_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_kt_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_kt_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_kt_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_kt_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_kt_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_kt_%20.label%20text%2C%23mermaid-_r_kt_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20.node%20rect%2C%23mermaid-_r_kt_%20.node%20circle%2C%23mermaid-_r_kt_%20.node%20ellipse%2C%23mermaid-_r_kt_%20.node%20polygon%2C%23mermaid-_r_kt_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_kt_%20.rough-node%20.label%20text%2C%23mermaid-_r_kt_%20.node%20.label%20text%2C%23mermaid-_r_kt_%20.image-shape%20.label%2C%23mermaid-_r_kt_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_kt_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_kt_%20.rough-node%20.label%2C%23mermaid-_r_kt_%20.node%20.label%2C%23mermaid-_r_kt_%20.image-shape%20.label%2C%23mermaid-_r_kt_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_kt_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_kt_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_kt_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_kt_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_kt_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_kt_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_kt_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_kt_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_kt_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_kt_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_kt_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_kt_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_kt_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_kt_%20.icon-shape%2C%23mermaid-_r_kt_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_kt_%20.icon-shape%20p%2C%23mermaid-_r_kt_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_kt_%20.icon-shape%20rect%2C%23mermaid-_r_kt_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_kt_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_kt_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_kt_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_kt_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_kt_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_kt_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_kt_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_kt_%20.node%20rect%2C%23mermaid-_r_kt_%20.node%20circle%2C%23mermaid-_r_kt_%20.node%20ellipse%2C%23mermaid-_r_kt_%20.node%20polygon%2C%23mermaid-_r_kt_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_kt_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_kt_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_kt_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_kt_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_kt_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_kt_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_kt__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_kt__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_kt__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_kt__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_kt__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_kt__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(436.21099853515625%2C%20882.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-87.35626220703125%22%20y%3D%22-30%22%20width%3D%22174.7125244140625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EOperation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20fails%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(436.21099853515625%2C%20982.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-86.06361389160156%22%20y%3D%22-30%22%20width%3D%22172.12722778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EClassify%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failure%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(227.8824284871419%2C%201148.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-117.80471801757812%22%20y%3D%22-30%22%20width%3D%22235.60943603515625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20budget%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20available%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(464.89886983235675%2C%201148.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-79.21173095703125%22%20y%3D%22-30%22%20width%3D%22158.4234619140625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDo%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20not%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20retry%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-7%22%20transform%3D%22translate\(227.8824284871419%2C%201348.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-114.89033508300781%22%20y%3D%22-30%22%20width%3D%22229.78067016601562%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMark%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failed%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20escalate%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-F-9%22%20transform%3D%22translate\(384.38528696695965%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-118.6829833984375%22%20y%3D%22-30%22%20width%3D%22237.365966796875%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EOperation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20safe%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20to%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20retry%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-11%22%20transform%3D%22translate\(267.1139628092448%2C%20233.5999984741211\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-114.6128158569336%22%20y%3D%22-35.599998474121094%22%20width%3D%22229.2256317138672%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECheck%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20idempotency%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Ecompensation%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-13%22%20transform%3D%22translate\(414.1525548299154%2C%20408.93332926432294\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-88.72267150878906%22%20y%3D%22-30%22%20width%3D%22177.44534301757812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECalculate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20delay%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-17%22%20transform%3D%22translate\(180.82956441243493%2C%20410.7999954223633\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-104.6003189086914%22%20y%3D%22-35.599998474121094%22%20width%3D%22209.2006378173828%22%20height%3D%2271.19999694824219%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-19.599998474121094\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPause%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20for%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20human%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3C%2Ftspan%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%221em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3Erecovery%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20action%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-19%22%20transform%3D%22translate\(414.1525548299154%2C%20516.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-52.80360221862793%22%20y%3D%22-30%22%20width%3D%22105.60720443725586%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWait%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-K-21%22%20transform%3D%22translate\(414.1525548299154%2C%20616.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-90.47500228881836%22%20y%3D%22-30%22%20width%3D%22180.95000457763672%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20operation%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-L-23%22%20transform%3D%22translate\(414.1525548299154%2C%20716.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-66.17532920837402%22%20y%3D%22-30%22%20width%3D%22132.35065841674805%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ESuccess%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-25%22%20transform%3D%22translate\(181.9273681640625%2C%20882.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.9273681640625%22%20y%3D%22-30%22%20width%3D%22253.854736328125%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPersist%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20success%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20checkpoint%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-N-29%22%20transform%3D%22translate\(464.89886983235675%2C%201248.3999938964844\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-116.42189025878906%22%20y%3D%22-30%22%20width%3D%22232.84378051757812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReturn%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20structured%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20error%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M436.21099853515625%2C912.3999938964844L436.21099853515625%2C940.3999938964844%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6NDM2LjIxMDk5ODUzNTE1NjI1LCJ5Ijo5MTIuMzk5OTkzODk2NDg0NH0seyJ4Ijo0MzYuMjEwOTk4NTM1MTU2MjUsInkiOjk0NC4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M407.5231272379557%2C1012.3999938964844L407.5231272379557%2C1025.6170378711897Q407.5231272379557%2C1027.3999938964844%20406.4373408003288%2C1028.8142074588575L406.4373408003288%2C1028.8142074588575Q405.3515543627019%2C1030.2284210212306%20403.9373408003288%2C1031.3142074588575L403.9373408003288%2C1031.3142074588575Q402.5231272379557%2C1032.3999938964844%20400.74017121266104%2C1032.3999938964844L273.9336213084978%2C1032.3999938964844Q272.1506652832031%2C1032.3999938964844%20270.73645172083%2C1033.4857803341113L270.73645172083%2C1033.4857803341113Q269.3222381584569%2C1034.5715667717382%20268.23645172083%2C1035.9857803341113L268.23645172083%2C1035.9857803341113Q267.1506652832031%2C1037.3999938964844%20267.1506652832031%2C1039.182949921779L267.1506652832031%2C1106.3999938964844%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6NDA3LjUyMzEyNzIzNzk1NTcsInkiOjEwMTIuMzk5OTkzODk2NDg0NH0seyJ4Ijo0MDcuNTIzMTI3MjM3OTU1NywieSI6MTAzMi4zOTk5OTM4OTY0ODQ0fSx7IngiOjI2Ny4xNTA2NjUyODMyMDMxLCJ5IjoxMDMyLjM5OTk5Mzg5NjQ4NDR9LHsieCI6MjY3LjE1MDY2NTI4MzIwMzEsInkiOjExMTAuMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M464.89886983235675%2C1012.3999938964844L464.89886983235675%2C1106.3999938964844%22%20id%3D%22L_B_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_D_0%22%20data-points%3D%22W3sieCI6NDY0Ljg5ODg2OTgzMjM1Njc1LCJ5IjoxMDEyLjM5OTk5Mzg5NjQ4NDR9LHsieCI6NDY0Ljg5ODg2OTgzMjM1Njc1LCJ5IjoxMTEwLjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M227.8824284871419%2C1178.3999938964844L227.8824284871419%2C1306.3999938964844%22%20id%3D%22L_C_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_E_0%22%20data-points%3D%22W3sieCI6MjI3Ljg4MjQyODQ4NzE0MTksInkiOjExNzguMzk5OTkzODk2NDg0NH0seyJ4IjoyMjcuODgyNDI4NDg3MTQxOSwieSI6MTMxMC4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M188.61419169108086%2C1118.3999938964844L188.61419169108078%2C1105.47106170835Q188.61419169108072%2C1098.3999938964844%20181.54312387921522%2C1098.3999938964844L40.78295602529465%2C1098.3999938964844Q39%2C1098.3999938964844%2037.58578643762691%2C1097.3142074588575L37.58578643762691%2C1097.3142074588575Q36.17157287525381%2C1096.2284210212306%2035.085786437626915%2C1094.8142074588575L35.08578643762691%2C1094.8142074588575Q34%2C1093.3999938964844%2034%2C1091.6170378711897L34%2C1065.3999938964844L34%2C982.3999938964844L34%2C882.3999938964844L34%2C799.3999938964844L34%2C716.3999938964844L34%2C516.3999938964844L34%2C410.7999954223633L34%2C322.1999969482422L34%2C233.5999984741211L34%2C145L34%2C98.78295602529465Q34%2C97%2035.08578643762691%2C95.58578643762691L35.08578643762691%2C95.58578643762691Q36.17157287525381%2C94.17157287525382%2037.5857864376269%2C93.08578643762691L37.58578643762691%2C93.08578643762691Q39%2C92%2040.78295602529466%2C92L318.26083924244625%2C92Q320.0437952677409%2C92%20321.458008830114%2C90.91421356237309L321.458008830114%2C90.91421356237308Q322.8722223924871%2C89.82842712474618%20323.958008830114%2C88.41421356237309L323.958008830114%2C88.41421356237309Q325.0437952677409%2C87%20325.0437952677409%2C85.21704397470535L325.0437952677409%2C82%22%20id%3D%22L_C_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_F_0%22%20data-points%3D%22W3sieCI6MTg4LjYxNDE5MTY5MTA4MDg2LCJ5IjoxMTE4LjM5OTk5Mzg5NjQ4NDR9LHsieCI6MTg4LjYxNDE5MTY5MTA4MDcyLCJ5IjoxMDk4LjM5OTk5Mzg5NjQ4NDR9LHsieCI6MzQsInkiOjEwOTguMzk5OTkzODk2NDg0NH0seyJ4IjozNCwieSI6MTA2NS4zOTk5OTM4OTY0ODQ0fSx7IngiOjM0LCJ5Ijo5ODIuMzk5OTkzODk2NDg0NH0seyJ4IjozNCwieSI6ODgyLjM5OTk5Mzg5NjQ4NDR9LHsieCI6MzQsInkiOjc5OS4zOTk5OTM4OTY0ODQ0fSx7IngiOjM0LCJ5Ijo3MTYuMzk5OTkzODk2NDg0NH0seyJ4IjozNCwieSI6NTE2LjM5OTk5Mzg5NjQ4NDR9LHsieCI6MzQsInkiOjQxMC43OTk5OTU0MjIzNjMzfSx7IngiOjM0LCJ5IjozMjIuMTk5OTk2OTQ4MjQyMn0seyJ4IjozNCwieSI6MjMzLjU5OTk5ODQ3NDEyMTF9LHsieCI6MzQsInkiOjE0NX0seyJ4IjozNCwieSI6OTJ9LHsieCI6MzI1LjA0Mzc5NTI2Nzc0MDksInkiOjkyfSx7IngiOjMyNS4wNDM3OTUyNjc3NDA5LCJ5Ijo3OH1d%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M384.38528696695965%2C72L384.38528696695965%2C105.21704397470535Q384.38528696695965%2C107%20383.29950052933276%2C108.41421356237309L383.29950052933276%2C108.41421356237309Q382.21371409170587%2C109.82842712474618%20380.79950052933276%2C110.91421356237308L380.79950052933276%2C110.91421356237309Q379.38528696695965%2C112%20377.602330941665%2C112L273.89691883453946%2C112Q272.1139628092448%2C112%20270.6997492468717%2C113.08578643762691L270.6997492468717%2C113.08578643762692Q269.2855356844986%2C114.17157287525382%20268.1997492468717%2C115.58578643762691L268.1997492468717%2C115.58578643762691Q267.1139628092448%2C117%20267.1139628092448%2C118.78295602529465L267.1139628092448%2C186%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6Mzg0LjM4NTI4Njk2Njk1OTY1LCJ5Ijo3Mn0seyJ4IjozODQuMzg1Mjg2OTY2OTU5NjUsInkiOjExMn0seyJ4IjoyNjcuMTEzOTYyODA5MjQ0OCwieSI6MTEyfSx7IngiOjI2Ny4xMTM5NjI4MDkyNDQ4LCJ5IjoxOTB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M443.72677866617846%2C72L443.7267786661784%2C145L443.7267786661784%2C322.1999969482422L443.7267786661784%2C366.93332926432294%22%20id%3D%22L_F_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_H_0%22%20data-points%3D%22W3sieCI6NDQzLjcyNjc3ODY2NjE3ODQ2LCJ5Ijo3Mn0seyJ4Ijo0NDMuNzI2Nzc4NjY2MTc4NCwieSI6MTQ1fSx7IngiOjQ0My43MjY3Nzg2NjYxNzg0LCJ5IjozMjIuMTk5OTk2OTQ4MjQyMn0seyJ4Ijo0NDMuNzI2Nzc4NjY2MTc4NCwieSI6MzcwLjkzMzMyOTI2NDMyMjk0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M305.318234761556%2C269.1999969482422L305.318234761556%2C348.41704092294754Q305.318234761556%2C350.1999969482422%20306.4040211991829%2C351.6142105106153L306.4040211991829%2C351.6142105106153Q307.4898076368098%2C353.0284240729884%20308.9040211991829%2C354.1142105106153L308.9040211991829%2C354.1142105106153Q310.318234761556%2C355.1999969482422%20312.1011907868507%2C355.1999969482422L377.7953749683577%2C355.1999969482422Q379.57833099365234%2C355.1999969482422%20380.99254455602545%2C356.2857833858691L380.99254455602545%2C356.2857833858691Q382.40675811839856%2C357.371569823496%20383.49254455602545%2C358.7857833858691L383.49254455602545%2C358.7857833858691Q384.57833099365234%2C360.1999969482422%20384.57833099365234%2C361.98295297353684L384.57833099365234%2C367.0666631062826%22%20id%3D%22L_G_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_H_0%22%20data-points%3D%22W3sieCI6MzA1LjMxODIzNDc2MTU1NiwieSI6MjY5LjE5OTk5Njk0ODI0MjJ9LHsieCI6MzA1LjMxODIzNDc2MTU1NiwieSI6MzU1LjE5OTk5Njk0ODI0MjJ9LHsieCI6Mzg0LjU3ODMzMDk5MzY1MjM0LCJ5IjozNTUuMTk5OTk2OTQ4MjQyMn0seyJ4IjozODQuNTc4MzMwOTkzNjUyMzQsInkiOjM3MS4wNjY2NjMxMDYyODI2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M228.90969085693365%2C269.1999969482422L228.90969085693362%2C282.1289291363767Q228.90969085693362%2C289.1999969482422%20221.83862304506815%2C289.1999969482422L187.6125204377296%2C289.1999969482422Q185.82956441243493%2C289.1999969482422%20184.41535085006183%2C290.2857833858691L184.41535085006183%2C290.2857833858691Q183.00113728768875%2C291.371569823496%20181.91535085006186%2C292.7857833858691L181.91535085006183%2C292.7857833858691Q180.82956441243493%2C294.1999969482422%20180.82956441243493%2C295.98295297353684L180.82956441243493%2C363.1999969482422%22%20id%3D%22L_G_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_I_0%22%20data-points%3D%22W3sieCI6MjI4LjkwOTY5MDg1NjkzMzY1LCJ5IjoyNjkuMTk5OTk2OTQ4MjQyMn0seyJ4IjoyMjguOTA5NjkwODU2OTMzNjIsInkiOjI4OS4xOTk5OTY5NDgyNDIyfSx7IngiOjE4MC44Mjk1NjQ0MTI0MzQ5MywieSI6Mjg5LjE5OTk5Njk0ODI0MjJ9LHsieCI6MTgwLjgyOTU2NDQxMjQzNDkzLCJ5IjozNjcuMTk5OTk2OTQ4MjQyMn1d%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M414.1525548299154%2C438.93332926432294L414.1525548299154%2C474.3999938964844%22%20id%3D%22L_H_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_H_J_0%22%20data-points%3D%22W3sieCI6NDE0LjE1MjU1NDgyOTkxNTQsInkiOjQzOC45MzMzMjkyNjQzMjI5NH0seyJ4Ijo0MTQuMTUyNTU0ODI5OTE1NCwieSI6NDc4LjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M414.1525548299154%2C546.3999938964844L414.1525548299154%2C574.3999938964844%22%20id%3D%22L_J_K_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_J_K_0%22%20data-points%3D%22W3sieCI6NDE0LjE1MjU1NDgyOTkxNTQsInkiOjU0Ni4zOTk5OTM4OTY0ODQ0fSx7IngiOjQxNC4xNTI1NTQ4Mjk5MTU0LCJ5Ijo1NzguMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M414.1525548299154%2C646.3999938964844L414.1525548299154%2C674.3999938964844%22%20id%3D%22L_K_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_K_L_0%22%20data-points%3D%22W3sieCI6NDE0LjE1MjU1NDgyOTkxNTQsInkiOjY0Ni4zOTk5OTM4OTY0ODQ0fSx7IngiOjQxNC4xNTI1NTQ4Mjk5MTU0LCJ5Ijo2NzguMzk5OTkzODk2NDg0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M392.0941111246745%2C746.3999938964844L392.0941111246745%2C759.6170378711897Q392.0941111246745%2C761.3999938964844%20391.0083246870476%2C762.8142074588575L391.0083246870476%2C762.8142074588575Q389.9225382494207%2C764.2284210212306%20388.5083246870476%2C765.3142074588575L388.5083246870476%2C765.3142074588575Q387.0941111246745%2C766.3999938964844%20385.31115509937985%2C766.3999938964844L188.71032418935715%2C766.3999938964844Q186.9273681640625%2C766.3999938964844%20185.5131546016894%2C767.4857803341113L185.5131546016894%2C767.4857803341113Q184.09894103931632%2C768.5715667717382%20183.01315460168942%2C769.9857803341113L183.0131546016894%2C769.9857803341113Q181.9273681640625%2C771.3999938964844%20181.9273681640625%2C773.182949921779L181.9273681640625%2C840.3999938964844%22%20id%3D%22L_L_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_M_0%22%20data-points%3D%22W3sieCI6MzkyLjA5NDExMTEyNDY3NDUsInkiOjc0Ni4zOTk5OTM4OTY0ODQ0fSx7IngiOjM5Mi4wOTQxMTExMjQ2NzQ1LCJ5Ijo3NjYuMzk5OTkzODk2NDg0NH0seyJ4IjoxODEuOTI3MzY4MTY0MDYyNSwieSI6NzY2LjM5OTk5Mzg5NjQ4NDR9LHsieCI6MTgxLjkyNzM2ODE2NDA2MjUsInkiOjg0NC4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M436.21099853515625%2C746.3999938964844L436.21099853515625%2C840.3999938964844%22%20id%3D%22L_L_A_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_A_0%22%20data-points%3D%22W3sieCI6NDM2LjIxMDk5ODUzNTE1NjI1LCJ5Ijo3NDYuMzk5OTkzODk2NDg0NH0seyJ4Ijo0MzYuMjEwOTk4NTM1MTU2MjUsInkiOjg0NC4zOTk5OTM4OTY0ODQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M464.89886983235675%2C1178.3999938964844L464.89886983235675%2C1206.3999938964844%22%20id%3D%22L_D_N_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_N_0%22%20data-points%3D%22W3sieCI6NDY0Ljg5ODg2OTgzMjM1Njc1LCJ5IjoxMTc4LjM5OTk5Mzg5NjQ4NDR9LHsieCI6NDY0Ljg5ODg2OTgzMjM1Njc1LCJ5IjoxMjEwLjM5OTk5Mzg5NjQ4NDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_kt__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(267.1247367858887%2C%201065.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(-26.474071502685547%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2276.94814682006836%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETransient%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(464.6065839131673%2C%201065.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_D_0%22%20transform%3D%22translate\(-31.707714080810547%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2287.41543197631836%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EPermanent%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(227.82851537068683%2C%201248.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_E_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(33.7469596862793%2C%20616.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_F_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(267.06004969278973%2C%20145\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(443.4737383524577%2C%20233.5999984741211\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_H_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(305.29948933919275%2C%20322.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_H_0%22%20transform%3D%22translate\(-59.98125457763672%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%22143.96250915527344%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ESafe%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20after%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20protection%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(180.5286534627279%2C%20322.1999969482422\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_I_0%22%20transform%3D%22translate\(-20.19908905029297%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2264.3981819152832%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUnsafe%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_H_J_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_J_K_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_K_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(181.6743278503418%2C%20799.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_M_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(436.1570854187012%2C%20799.3999938964844\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_A_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_N_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

# 4. Fixed-delay retry

A fixed-delay strategy waits for the same amount of time between attempts.

For example:

```
Attempt 1 fails
Wait 2 seconds
Attempt 2 fails
Wait 2 seconds
Attempt 3 fails
Wait 2 seconds
Attempt 4
```

## Formula

delay=ddelay = ddelay=d

Where ddd is a constant delay.

## Example

Python

Run

```
def fixed_delay(attempt: int, delay_seconds: float = 2.0) -> float:
    return delay_seconds
```

## Advantages

* Simple to implement

* Predictable

* Suitable for small, low-volume operations

* Useful when the downstream service recovers quickly

## Disadvantages

* Many clients may retry simultaneously

* Can overload an already-unhealthy service

* Does not adapt to repeated failures

Fixed delay is acceptable for simple operations, but exponential backoff is generally safer for distributed systems.

# 5. Exponential backoff

Exponential backoff increases the delay after each failed attempt.

A common formula is:

delay=base×2attempt−1delay = base \times 2^{attempt-1}delay=base×2attempt−1

For a base delay of two seconds:

|
Attempt

|

Delay

|
| --- | --- |
|

1

|

2 seconds

|
|

2

|

4 seconds

|
|

3

|

8 seconds

|
|

4

|

16 seconds

|
|

5

|

32 seconds

|

The sequence becomes:

```
Failure → 2s → retry
Failure → 4s → retry
Failure → 8s → retry
Failure → 16s → retry
```

## Python example

Python

Run

```
def exponential_backoff(
    attempt: int,
    base_delay: float = 2.0,
    max_delay: float = 30.0,
) -> float:
    delay = base_delay * (2 ** (attempt - 1))
    return min(delay, max_delay)
```

## Why it helps

Exponential backoff gives the downstream service time to recover and reduces repeated pressure during an outage.

# 6. Jitter

If thousands of clients use the same exponential schedule, they may all retry at exactly the same time:

```
Client A → retry at 8 seconds
Client B → retry at 8 seconds
Client C → retry at 8 seconds
Client D → retry at 8 seconds
```

This creates a thundering herd.

Jitter adds randomness to the delay so that retries are distributed over time.

## Full jitter

Python

Run

```
import random


def full_jitter(
    attempt: int,
    base_delay: float = 2.0,
    max_delay: float = 30.0,
) -> float:
    exponential_delay = min(
        base_delay * (2 ** (attempt - 1)),
        max_delay,
    )

    return random.uniform(0, exponential_delay)
```

For an exponential delay of eight seconds, the actual wait might be:

```
1.4 seconds
5.7 seconds
3.2 seconds
7.8 seconds
```

## Common jitter strategies

|
Strategy

|

Description

|
| --- | --- |
|

Full jitter

|

Random value between zero and calculated delay

|
|

Equal jitter

|

Half the delay plus a random value

|
|

Decorrelated jitter

|

Next delay depends on the previous randomized delay

|

For most CWD service calls, exponential backoff with full jitter is a strong default.

# 7. Bounded retries

Retries must have limits. Otherwise, a failed operation could continue forever.

A retry budget may include:

* Maximum number of attempts

* Maximum total retry time

* Maximum delay per attempt

* Maximum workflow deadline

* Maximum cost

* Maximum number of retryable failures

Example:

```
Maximum attempts: 4
Maximum delay: 30 seconds
Maximum total retry time: 60 seconds
```

Even if the operation continues failing, CWD stops retrying after the budget is exhausted.

## Example

Python

Run

```
def can_retry(
    attempt: int,
    max_attempts: int,
    elapsed_seconds: float,
    max_elapsed_seconds: float,
) -> bool:
    return (
        attempt < max_attempts
        and elapsed_seconds < max_elapsed_seconds
    )
```

Bounded retries protect the system from infinite loops and uncontrolled latency.

# 8. Retry policy based on failure type

A retry policy should consider the failure category, not only the HTTP status code.

Python

Run

```
from dataclasses import dataclass
from enum import Enum


class FailureType(str, Enum):
    TRANSIENT = "transient"
    PERMANENT = "permanent"
    UNKNOWN = "unknown"


@dataclass
class RetryDecision:
    retryable: bool
    failure_type: FailureType
    reason: str
```

Python

Run

```
def classify_failure(error: Exception) -> RetryDecision:
    status_code = getattr(error, "status_code", None)

    if status_code in {408, 429, 500, 502, 503, 504}:
        return RetryDecision(
            retryable=True,
            failure_type=FailureType.TRANSIENT,
            reason=f"Temporary service failure: {status_code}",
        )

    if status_code in {400, 401, 403, 404, 422}:
        return RetryDecision(
            retryable=False,
            failure_type=FailureType.PERMANENT,
            reason=f"Request or authorization failure: {status_code}",
        )

    if isinstance(error, TimeoutError):
        return RetryDecision(
            retryable=True,
            failure_type=FailureType.TRANSIENT,
            reason="Operation timed out",
        )

    return RetryDecision(
        retryable=False,
        failure_type=FailureType.UNKNOWN,
        reason="Unknown failure; requires explicit policy",
    )
```

Unknown errors should not automatically be retried indefinitely. They should be logged and handled conservatively.

# 9. Retry-After and rate limits

When a downstream service returns a `Retry-After` value, CWD should respect it.

For example:

```
HTTP 429
Retry-After: 15
```

The service is requesting that the client wait approximately 15 seconds.

The effective delay can be calculated as:

Python

Run

```
def choose_delay(
    calculated_delay: float,
    retry_after: float | None,
    max_delay: float,
) -> float:
    if retry_after is not None:
        return min(max(retry_after, calculated_delay), max_delay)

    return min(calculated_delay, max_delay)
```

This prevents CWD from retrying too quickly against a rate-limited provider.

# 10. Idempotency and duplicate side effects

Retries are safe only when repeating the operation does not create harmful duplicate effects.

For example, retrying a read operation is usually safe:

```
Get customer profile
Search knowledge base
Read order status
```

But retrying a payment or notification may create duplicates:

```
Charge credit card
Send email
Create purchase order
Submit refund
Update CRM record
```

CWD should use an idempotency key:

Python

Run

```
idempotency_key = f"{request_id}:{task_id}:send-notification"
```

The downstream service stores the result for that key.

```
First attempt:
  key = abc123
  Email sent
  Result stored

Retry:
  key = abc123
  Existing result returned
  Email is not sent again
```

This provides at-most-once business effect even when the underlying execution is at-least-once.

# 11. Retry policy by CWD component

|
Component

|

Typical retry behavior

|
| --- | --- |
|

API Gateway

|

Retry connection failures and selected 5xx errors

|
|

Coordinator

|

Retry persistence and transient orchestration operations

|
|

Delegator

|

Retry Worker selection or dispatch when safe

|
|

Worker

|

Retry transient tool or LLM failures

|
|

LLM provider

|

Retry rate limits, timeouts, and temporary provider errors

|
|

MCP tool

|

Retry only if the tool operation is idempotent

|
|

Message broker

|

Retry temporary publish or acknowledgment failures

|
|

Database

|

Retry transient connection or serialization errors

|
|

Business operation

|

Require idempotency or compensation before retry

|

The retry policy should be different for each operation.

For example:

```
Knowledge search:
    3 attempts
    Exponential backoff
    Full jitter

Payment:
    1 execution attempt
    Idempotency key
    Query status before retrying

LLM request:
    3 attempts
    Respect Retry-After
    Reduce request size after repeated failures

Worker task:
    2 attempts on same Worker
    Then alternate Worker
    Then escalate
```

# 12. Complete retry implementation

Python

Run

```
import asyncio
import random
from dataclasses import dataclass
from typing import Awaitable, Callable, TypeVar

T = TypeVar("T")


@dataclass
class RetryPolicy:
    max_attempts: int = 4
    base_delay: float = 1.0
    max_delay: float = 30.0
    max_total_time: float = 60.0
    jitter: bool = True


class RetryExhaustedError(Exception):
    pass


def is_retryable(error: Exception) -> bool:
    status_code = getattr(error, "status_code", None)

    if isinstance(error, (TimeoutError, ConnectionError)):
        return True

    return status_code in {408, 429, 500, 502, 503, 504}


def calculate_delay(
    attempt: int,
    policy: RetryPolicy,
) -> float:
    exponential_delay = min(
        policy.base_delay * (2 ** (attempt - 1)),
        policy.max_delay,
    )

    if policy.jitter:
        return random.uniform(0, exponential_delay)

    return exponential_delay


async def execute_with_retry(
    operation: Callable[[], Awaitable[T]],
    policy: RetryPolicy,
) -> T:
    loop = asyncio.get_running_loop()
    start_time = loop.time()
    last_error: Exception | None = None

    for attempt in range(1, policy.max_attempts + 1):
        try:
            return await operation()

        except Exception as error:
            last_error = error

            if not is_retryable(error):
                raise

            elapsed = loop.time() - start_time

            if attempt >= policy.max_attempts:
                break

            delay = calculate_delay(attempt, policy)

            if elapsed + delay >= policy.max_total_time:
                break

            retry_after = getattr(error, "retry_after", None)

            if retry_after is not None:
                delay = min(
                    max(delay, retry_after),
                    policy.max_delay,
                )

            await asyncio.sleep(delay)

    raise RetryExhaustedError(
        f"Operation failed after {policy.max_attempts} attempts"
    ) from last_error
```

Usage:

Python

Run

```
result = await execute_with_retry(
    operation=lambda: llm_client.generate(prompt),
    policy=RetryPolicy(
        max_attempts=3,
        base_delay=1,
        max_delay=10,
        max_total_time=25,
        jitter=True,
    ),
)
```

# 13. Retry versus fallback versus escalation

Retries are only one recovery mechanism.

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_l1_%22%20width%3D%22759.2962646484375%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%22608%22%20viewBox%3D%224%204%20759.2962646484375%20608%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_l1_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_l1_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_l1_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_l1_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_l1_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_l1_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_l1_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_l1_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_l1_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_l1_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_l1_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_l1_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_l1_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_l1_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_l1_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_l1_%20.label%20text%2C%23mermaid-_r_l1_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20.node%20rect%2C%23mermaid-_r_l1_%20.node%20circle%2C%23mermaid-_r_l1_%20.node%20ellipse%2C%23mermaid-_r_l1_%20.node%20polygon%2C%23mermaid-_r_l1_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_l1_%20.rough-node%20.label%20text%2C%23mermaid-_r_l1_%20.node%20.label%20text%2C%23mermaid-_r_l1_%20.image-shape%20.label%2C%23mermaid-_r_l1_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_l1_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_l1_%20.rough-node%20.label%2C%23mermaid-_r_l1_%20.node%20.label%2C%23mermaid-_r_l1_%20.image-shape%20.label%2C%23mermaid-_r_l1_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_l1_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_l1_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_l1_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_l1_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_l1_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_l1_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_l1_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_l1_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_l1_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_l1_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_l1_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_l1_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_l1_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_l1_%20.icon-shape%2C%23mermaid-_r_l1_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_l1_%20.icon-shape%20p%2C%23mermaid-_r_l1_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_l1_%20.icon-shape%20rect%2C%23mermaid-_r_l1_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_l1_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_l1_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_l1_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_l1_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_l1_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_l1_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_l1_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_l1_%20.node%20rect%2C%23mermaid-_r_l1_%20.node%20circle%2C%23mermaid-_r_l1_%20.node%20ellipse%2C%23mermaid-_r_l1_%20.node%20polygon%2C%23mermaid-_r_l1_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_l1_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_l1_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_l1_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_l1_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_l1_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_l1_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_l1__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_l1__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_l1__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_l1__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_l1__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_l1__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-A-0%22%20transform%3D%22translate\(259.11920166015625%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-87.35626220703125%22%20y%3D%22-30%22%20width%3D%22174.7125244140625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EOperation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20fails%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-B-1%22%20transform%3D%22translate\(259.11920166015625%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-70.8162727355957%22%20y%3D%22-30%22%20width%3D%22141.6325454711914%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETransient%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(345.21854400634766%2C%20308\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-99.95423889160156%22%20y%3D%22-30%22%20width%3D%22199.90847778320312%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20with%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20backoff%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(557.6346549987793%2C%20142\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-123.13284301757812%22%20y%3D%22-30%22%20width%3D%22246.26568603515625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20budget%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20exhausted%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-9%22%20transform%3D%22translate\(619.2010726928711%2C%20308\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-134.0282974243164%22%20y%3D%22-30%22%20width%3D%22268.0565948486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFallback%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20alternate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Worker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-F-11%22%20transform%3D%22translate\(219.83245086669922%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-126.79065704345703%22%20y%3D%22-30%22%20width%3D%22253.58131408691406%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECan%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20request%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20be%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20corrected%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-13%22%20transform%3D%22translate\(126.87188720703125%2C%20574\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-114.87188720703125%22%20y%3D%22-30%22%20width%3D%22229.7437744140625%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EReturn%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20validation%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20error%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-H-15%22%20transform%3D%22translate\(395.9125213623047%2C%20574\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-114.16875457763672%22%20y%3D%22-30%22%20width%3D%22228.33750915527344%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EEscalate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20or%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20mark%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20failed%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%20%20mermaid-decision%22%20id%3D%22flowchart-I-17%22%20transform%3D%22translate\(619.2010726928711%2C%20408\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-100.46315002441406%22%20y%3D%22-30%22%20width%3D%22200.92630004882812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFallback%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20succeeds%3F%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-J-19%22%20transform%3D%22translate\(652.6887893676758%2C%20574\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-102.6075210571289%22%20y%3D%22-30%22%20width%3D%22205.2150421142578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EContinue%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20workflow%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M259.11920166015625%2C72L259.11920166015625%2C100%22%20id%3D%22L_A_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_A_B_0%22%20data-points%3D%22W3sieCI6MjU5LjExOTIwMTY2MDE1NjI1LCJ5Ijo3Mn0seyJ4IjoyNTkuMTE5MjAxNjYwMTU2MjUsInkiOjEwNH1d%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M282.72462463378906%2C172L282.72462463378906%2C251.21704397470535Q282.72462463378906%2C253%20283.81041107141596%2C254.4142135623731L283.81041107141596%2C254.4142135623731Q284.89619750904285%2C255.82842712474618%20286.31041107141596%2C256.9142135623731L286.72648095001193%2C257.2336582652838Q287.72462463378906%2C258%20288.98302459716797%2C258L288.98302459716797%2C258Q290.2414245605469%2C258%20291.239568244324%2C258.7663417347162L291.65563812292%2C259.0857864376269Q293.0698516852931%2C260.1715728752538%20294.15563812292%2C261.5857864376269L294.15563812292%2C261.5857864376269Q295.2414245605469%2C263%20295.2414245605469%2C264.78295602529465L295.2414245605469%2C268%22%20id%3D%22L_B_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_C_0%22%20data-points%3D%22W3sieCI6MjgyLjcyNDYyNDYzMzc4OTA2LCJ5IjoxNzJ9LHsieCI6MjgyLjcyNDYyNDYzMzc4OTA2LCJ5IjoyNTh9LHsieCI6Mjk1LjI0MTQyNDU2MDU0NjksInkiOjI1OH0seyJ4IjoyOTUuMjQxNDI0NTYwNTQ2OSwieSI6MjcyfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M395.19566345214844%2C278L395.19566345214844%2C264.78295602529465Q395.19566345214844%2C263%20396.28144988977533%2C261.5857864376269L396.28144988977533%2C261.5857864376269Q397.3672363274022%2C260.1715728752538%20398.78144988977533%2C259.0857864376269L398.78144988977533%2C259.0857864376269Q400.19566345214844%2C258%20401.9786194774431%2C258L550.8516989734846%2C258Q552.6346549987793%2C258%20554.0488685611524%2C256.9142135623731L554.0488685611524%2C256.9142135623731Q555.4630821235255%2C255.82842712474618%20556.5488685611524%2C254.4142135623731L556.5488685611524%2C254.4142135623731Q557.6346549987793%2C253%20557.6346549987793%2C251.21704397470535L557.6346549987793%2C225L557.6346549987793%2C184%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6Mzk1LjE5NTY2MzQ1MjE0ODQ0LCJ5IjoyNzh9LHsieCI6Mzk1LjE5NTY2MzQ1MjE0ODQ0LCJ5IjoyNTh9LHsieCI6NTU3LjYzNDY1NDk5ODc3OTMsInkiOjI1OH0seyJ4Ijo1NTcuNjM0NjU0OTk4Nzc5MywieSI6MjI1fSx7IngiOjU1Ny42MzQ2NTQ5OTg3NzkzLCJ5IjoxODB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M496.0682373046875%2C172L496.0682373046875%2C185.21704397470535Q496.0682373046875%2C187%20494.9824508670606%2C188.4142135623731L494.9824508670606%2C188.4142135623731Q493.8966644294337%2C189.82842712474618%20492.4824508670606%2C190.91421356237308L492.4824508670606%2C190.9142135623731Q491.0682373046875%2C192%20489.28528127939285%2C192L352.0015000316423%2C192Q350.21854400634766%2C192%20348.80433044397455%2C193.0857864376269L348.80433044397455%2C193.08578643762692Q347.39011688160144%2C194.17157287525382%20346.30433044397455%2C195.5857864376269L346.30433044397455%2C195.5857864376269Q345.21854400634766%2C197%20345.21854400634766%2C198.78295602529465L345.21854400634766%2C266%22%20id%3D%22L_D_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_C_0%22%20data-points%3D%22W3sieCI6NDk2LjA2ODIzNzMwNDY4NzUsInkiOjE3Mn0seyJ4Ijo0OTYuMDY4MjM3MzA0Njg3NSwieSI6MTkyfSx7IngiOjM0NS4yMTg1NDQwMDYzNDc2NiwieSI6MTkyfSx7IngiOjM0NS4yMTg1NDQwMDYzNDc2NiwieSI6MjcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M619.2010726928711%2C172L619.2010726928711%2C266%22%20id%3D%22L_D_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_E_0%22%20data-points%3D%22W3sieCI6NjE5LjIwMTA3MjY5Mjg3MTEsInkiOjE3Mn0seyJ4Ijo2MTkuMjAxMDcyNjkyODcxMSwieSI6MjcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M235.51377868652344%2C172L235.51377868652344%2C185.21704397470535Q235.51377868652344%2C187%20234.42799224889654%2C188.4142135623731L234.42799224889654%2C188.4142135623731Q233.34220581126962%2C189.82842712474618%20231.92799224889654%2C190.9142135623731L231.92799224889654%2C190.9142135623731Q230.51377868652344%2C192%20228.73082266122879%2C192L226.61540689199387%2C192Q224.83245086669922%2C192%20223.4182373043261%2C193.0857864376269L223.4182373043261%2C193.0857864376269Q222.00402374195303%2C194.17157287525382%20220.9182373043261%2C195.5857864376269L220.9182373043261%2C195.5857864376269Q219.83245086669922%2C197%20219.83245086669922%2C198.78295602529465L219.83245086669922%2C308L219.83245086669922%2C366%22%20id%3D%22L_B_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_B_F_0%22%20data-points%3D%22W3sieCI6MjM1LjUxMzc3ODY4NjUyMzQ0LCJ5IjoxNzJ9LHsieCI6MjM1LjUxMzc3ODY4NjUyMzQ0LCJ5IjoxOTJ9LHsieCI6MjE5LjgzMjQ1MDg2NjY5OTIyLCJ5IjoxOTJ9LHsieCI6MjE5LjgzMjQ1MDg2NjY5OTIyLCJ5IjozMDh9LHsieCI6MjE5LjgzMjQ1MDg2NjY5OTIyLCJ5IjozNzB9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M177.56889597574872%2C438L177.56889597574872%2C451.21704397470535Q177.56889597574872%2C453%20176.48310953812182%2C454.4142135623731L176.4831095381218%2C454.4142135623731Q175.3973231004949%2C455.8284271247462%20173.98310953812182%2C456.9142135623731L173.98310953812182%2C456.9142135623731Q172.56889597574872%2C458%20170.78593995045406%2C458L133.6548432323259%2C458Q131.87188720703125%2C458%20130.45767364465814%2C459.0857864376269L130.45767364465814%2C459.0857864376269Q129.04346008228507%2C460.1715728752538%20127.95767364465817%2C461.5857864376269L127.95767364465816%2C461.5857864376269Q126.87188720703125%2C463%20126.87188720703125%2C464.78295602529465L126.87188720703125%2C532%22%20id%3D%22L_F_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_G_0%22%20data-points%3D%22W3sieCI6MTc3LjU2ODg5NTk3NTc0ODcyLCJ5Ijo0Mzh9LHsieCI6MTc3LjU2ODg5NTk3NTc0ODcyLCJ5Ijo0NTh9LHsieCI6MTI2Ljg3MTg4NzIwNzAzMTI1LCJ5Ijo0NTh9LHsieCI6MTI2Ljg3MTg4NzIwNzAzMTI1LCJ5Ijo1MzZ9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M262.0960057576498%2C438L262.0960057576498%2C517.2170439747053Q262.0960057576498%2C519%20263.18179219527667%2C520.4142135623731L263.18179219527667%2C520.4142135623731Q264.26757863290356%2C521.8284271247462%20265.68179219527667%2C522.9142135623731L265.68179219527667%2C522.9142135623731Q267.0960057576498%2C524%20268.87896178294443%2C524L351.0733163542626%2C524Q352.85627237955725%2C524%20354.27048594193036%2C525.0857864376269L354.27048594193036%2C525.0857864376269Q355.68469950430347%2C526.1715728752538%20356.77048594193036%2C527.5857864376269L356.77048594193036%2C527.5857864376269Q357.85627237955725%2C529%20357.85627237955725%2C530.7829560252947L357.85627237955725%2C534%22%20id%3D%22L_F_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_F_H_0%22%20data-points%3D%22W3sieCI6MjYyLjA5NjAwNTc1NzY0OTgsInkiOjQzOH0seyJ4IjoyNjIuMDk2MDA1NzU3NjQ5OCwieSI6NTI0fSx7IngiOjM1Ny44NTYyNzIzNzk1NTcyNSwieSI6NTI0fSx7IngiOjM1Ny44NTYyNzIzNzk1NTcyNSwieSI6NTM4fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M619.2010726928711%2C338L619.2010726928711%2C366%22%20id%3D%22L_E_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_E_I_0%22%20data-points%3D%22W3sieCI6NjE5LjIwMTA3MjY5Mjg3MTEsInkiOjMzOH0seyJ4Ijo2MTkuMjAxMDcyNjkyODcxMSwieSI6MzcwfV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M652.6887893676758%2C438L652.6887893676758%2C532%22%20id%3D%22L_I_J_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_J_0%22%20data-points%3D%22W3sieCI6NjUyLjY4ODc4OTM2NzY3NTgsInkiOjQzOH0seyJ4Ijo2NTIuNjg4Nzg5MzY3Njc1OCwieSI6NTM2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M585.7133560180664%2C438L585.7133560180664%2C451.21704397470535Q585.7133560180664%2C453%20584.6275695804395%2C454.4142135623731L584.6275695804395%2C454.4142135623731Q583.5417831428126%2C455.8284271247462%20582.1275695804395%2C456.9142135623731L582.1275695804395%2C456.9142135623731Q580.7133560180664%2C458%20578.9303999927718%2C458L440.7517263703467%2C458Q438.96877034505206%2C458%20437.55455678267896%2C459.0857864376269L437.55455678267896%2C459.0857864376269Q436.14034322030585%2C460.1715728752538%20435.05455678267896%2C461.5857864376269L435.05455678267896%2C461.5857864376269Q433.96877034505206%2C463%20433.96877034505206%2C464.78295602529465L433.96877034505206%2C532%22%20id%3D%22L_I_H_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_I_H_0%22%20data-points%3D%22W3sieCI6NTg1LjcxMzM1NjAxODA2NjQsInkiOjQzOH0seyJ4Ijo1ODUuNzEzMzU2MDE4MDY2NCwieSI6NDU4fSx7IngiOjQzMy45Njg3NzAzNDUwNTIwNiwieSI6NDU4fSx7IngiOjQzMy45Njg3NzAzNDUwNTIwNiwieSI6NTM2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_l1__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_A_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(282.47158432006836%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_C_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(345.1646308898926%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_C_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(618.9480323791504%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_E_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(219.77853775024414%2C%20225\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_B_F_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(126.61884689331055%2C%20491\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_G_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(262.0420926411947%2C%20491\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_F_H_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_E_I_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(652.4357490539551%2C%20491\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_J_0%22%20transform%3D%22translate\(-8.946959495544434%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12.800000011920929%22%20y%3D%22-5.599999785423279%22%20width%3D%2243.49392127990723%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EYes%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%20transform%3D%22translate\(433.914857228597%2C%20491\)%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_I_H_0%22%20transform%3D%22translate\(-8.946086883544922%2C-7.40000057220459\)%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22%22%20x%3D%22-12%22%20y%3D%22-5.599999785423279%22%20width%3D%2241.89217567443848%22%20height%3D%2226%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ENo%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

Examples:

* Retry the same LLM provider.

* Switch to an alternate LLM provider.

* Route the task to another Worker.

* Use a cached response.

* Reduce the request payload.

* Ask the user for missing information.

* Escalate to a human operator.

# 14. Important CWD design principle

Retries should preserve the existing execution context.

The retry operation should retain:

Python

Run

```
{
    "request_id": "req-1001",
    "workflow_id": "wf-2001",
    "task_id": "task-3001",
    "user_goal": "Resolve customer delivery issue",
    "current_step": "order_lookup",
    "attempt": 2,
    "max_attempts": 4,
    "idempotency_key": "req-1001:task-3001",
    "previous_error": "HTTP 503",
    "deadline": "2026-09-07T21:30:00Z",
}
```

CWD should retry the failed step, not reconstruct the entire request from scratch.

```
Coordinator
   ↓
Load persisted context
   ↓
Identify failed task
   ↓
Classify failure
   ↓
Apply retry policy
   ↓
Retry only failed task
   ↓
Checkpoint result
   ↓
Continue workflow
```

# 15. Example: customer-support workflow

Suppose a customer asks:

> “Where is my order, and can you notify me if delivery is delayed?”

The workflow is:

```
Coordinator
   → Delegator
      → Order Lookup Worker
      → Notification Worker
```

The Order Lookup Worker calls an order-management API.

### Scenario

```
Attempt 1:
Order API returns 503

Decision:
Transient failure

Action:
Wait using exponential backoff with jitter

Attempt 2:
Order API returns 503

Decision:
Retry budget remains

Action:
Wait again

Attempt 3:
Order API succeeds

Action:
Persist order result
Continue to Notification Worker
```

If the Notification Worker fails after sending the notification, CWD should not automatically send another notification. It should first query the notification status using the idempotency key.

# 16. Recommended default policy

A practical default for CWD is:

```
1. Classify the error.
2. Never retry permanent validation or authorization errors.
3. Retry only known transient failures.
4. Use exponential backoff.
5. Add full jitter.
6. Respect Retry-After.
7. Enforce maximum attempts.
8. Enforce a total workflow deadline.
9. Use idempotency for side-effecting operations.
10. Persist retry state and the last error.
11. Retry the smallest failed operation.
12. Escalate after the retry budget is exhausted.
```

## Interview-ready explanation

> CWD uses failure-aware retry policies to distinguish transient failures from permanent failures. Transient errors such as timeouts, rate limits, and temporary service unavailability are retried using exponential backoff with jitter to avoid overwhelming downstream services. Retries are bounded by maximum attempts, total execution time, and workflow deadlines. Permanent errors such as invalid input, authentication failures, and unsupported operations are not retried. For side-effecting operations, CWD uses idempotency keys and persisted execution state to prevent duplicate business effects. If retries are exhausted, CWD can use a fallback Worker, alternate provider, compensation logic, or human escalation while preserving the original request context.
