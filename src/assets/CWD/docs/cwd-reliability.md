# Reliability & Failure Handling in CWD

Advanced · ~60 minutes

Reliability in CWD means that a failure in one component does not automatically become a failure of the entire application. The platform must detect the problem, contain its impact, retry only when appropriate, recover when possible, and preserve enough state to explain what happened.

The key principle is:

> Every execution step must have a clear failure policy: retry, recover, compensate, escalate, or stop.

## 1. What you should understand

By the end of this topic, you should be able to explain:

* How the Gateway handles request failures, timeouts, and overload.

* How the Coordinator preserves workflow state and manages failed executions.

* How the Delegator handles worker selection, unavailable workers, and partial results.

* How Workers recover from tool errors, invalid outputs, and interrupted tasks.

* How LLMs are handled when they time out, return invalid responses, or exceed limits.

* How tools and data sources are isolated from failures and retried safely.

* How messaging infrastructure handles delivery failures, duplicate messages, and unavailable brokers.

* How CWD uses observability, circuit breakers, dead-letter queues, and recovery workflows to maintain reliability.

## 2. Reliability architecture

Diagram options

![](data\:image/svg+xml;utf8,%3Csvg%20id%3D%22mermaid-_r_79_%22%20width%3D%221263.851806640625%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20class%3D%22flowchart%22%20height%3D%22776%22%20viewBox%3D%224%204%201263.851806640625%20776%22%20role%3D%22graphics-document%20document%22%20aria-roledescription%3D%22flowchart-v2%22%3E%3Cstyle%3E%23mermaid-_r_79_%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%40keyframes%20edge-animation-frame%7Bfrom%7Bstroke-dashoffset%3A0%3B%7D%7D%40keyframes%20dash%7Bto%7Bstroke-dashoffset%3A0%3B%7D%7D%23mermaid-_r_79_%20.edge-animation-slow%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2050s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_79_%20.edge-animation-fast%7Bstroke-dasharray%3A9%2C5!important%3Bstroke-dashoffset%3A900%3Banimation%3Adash%2020s%20linear%20infinite%3Bstroke-linecap%3Around%3B%7D%23mermaid-_r_79_%20.error-icon%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3B%7D%23mermaid-_r_79_%20.error-text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bstroke%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20.edge-thickness-normal%7Bstroke-width%3A1px%3B%7D%23mermaid-_r_79_%20.edge-thickness-thick%7Bstroke-width%3A3.5px%3B%7D%23mermaid-_r_79_%20.edge-pattern-solid%7Bstroke-dasharray%3A0%3B%7D%23mermaid-_r_79_%20.edge-thickness-invisible%7Bstroke-width%3A0%3Bfill%3Anone%3B%7D%23mermaid-_r_79_%20.edge-pattern-dashed%7Bstroke-dasharray%3A3%3B%7D%23mermaid-_r_79_%20.edge-pattern-dotted%7Bstroke-dasharray%3A2%3B%7D%23mermaid-_r_79_%20.marker%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_79_%20.marker.cross%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_79_%20svg%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A14px%3B%7D%23mermaid-_r_79_%20p%7Bmargin%3A0%3B%7D%23mermaid-_r_79_%20.label%7Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20.cluster-label%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20.cluster-label%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20.cluster-label%20span%20p%7Bbackground-color%3Atransparent%3B%7D%23mermaid-_r_79_%20.label%20text%2C%23mermaid-_r_79_%20span%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20.node%20rect%2C%23mermaid-_r_79_%20.node%20circle%2C%23mermaid-_r_79_%20.node%20ellipse%2C%23mermaid-_r_79_%20.node%20polygon%2C%23mermaid-_r_79_%20.node%20path%7Bfill%3Argb\(9%2C%2023%2C%2044\)%3Bstroke%3Argb\(31%2C%2078%2C%20148\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_79_%20.rough-node%20.label%20text%2C%23mermaid-_r_79_%20.node%20.label%20text%2C%23mermaid-_r_79_%20.image-shape%20.label%2C%23mermaid-_r_79_%20.icon-shape%20.label%7Btext-anchor%3Amiddle%3B%7D%23mermaid-_r_79_%20.node%20.katex%20path%7Bfill%3A%23000%3Bstroke%3A%23000%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_79_%20.rough-node%20.label%2C%23mermaid-_r_79_%20.node%20.label%2C%23mermaid-_r_79_%20.image-shape%20.label%2C%23mermaid-_r_79_%20.icon-shape%20.label%7Btext-align%3Acenter%3B%7D%23mermaid-_r_79_%20.node.clickable%7Bcursor%3Apointer%3B%7D%23mermaid-_r_79_%20.root%20.anchor%20path%7Bfill%3Argb\(205%2C%20205%2C%20205\)!important%3Bstroke-width%3A0%3Bstroke%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_79_%20.arrowheadPath%7Bfill%3Argb\(205%2C%20205%2C%20205\)%3B%7D%23mermaid-_r_79_%20.edgePath%20.path%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bstroke-width%3A2.0px%3B%7D%23mermaid-_r_79_%20.flowchart-link%7Bstroke%3Argb\(205%2C%20205%2C%20205\)%3Bfill%3Anone%3B%7D%23mermaid-_r_79_%20.edgeLabel%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_79_%20.edgeLabel%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_79_%20.edgeLabel%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_79_%20.labelBkg%7Bbackground-color%3Argba\(0%2C%200%2C%200%2C%200.5\)%3B%7D%23mermaid-_r_79_%20.cluster%20rect%7Bfill%3Argb\(33%2C%2033%2C%2033\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.05\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_79_%20.cluster%20text%7Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20.cluster%20span%7Bcolor%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20div.mermaidTooltip%7Bposition%3Aabsolute%3Btext-align%3Acenter%3Bmax-width%3A200px%3Bpadding%3A2px%3Bfont-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3Bfont-size%3A12px%3Bbackground%3Argb\(33%2C%2033%2C%2033\)%3Bborder%3A1px%20solid%20rgba\(255%2C%20255%2C%20255%2C%200.05\)%3Bborder-radius%3A2px%3Bpointer-events%3Anone%3Bz-index%3A100%3B%7D%23mermaid-_r_79_%20.flowchartTitleText%7Btext-anchor%3Amiddle%3Bfont-size%3A18px%3Bfill%3Argb\(255%2C%20255%2C%20255\)%3B%7D%23mermaid-_r_79_%20rect.text%7Bfill%3Anone%3Bstroke-width%3A0%3B%7D%23mermaid-_r_79_%20.icon-shape%2C%23mermaid-_r_79_%20.image-shape%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Btext-align%3Acenter%3B%7D%23mermaid-_r_79_%20.icon-shape%20p%2C%23mermaid-_r_79_%20.image-shape%20p%7Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bpadding%3A2px%3B%7D%23mermaid-_r_79_%20.icon-shape%20rect%2C%23mermaid-_r_79_%20.image-shape%20rect%7Bopacity%3A0.5%3Bbackground-color%3Argb\(0%2C%200%2C%200\)%3Bfill%3Argb\(0%2C%200%2C%200\)%3B%7D%23mermaid-_r_79_%20.label-icon%7Bdisplay%3Ainline-block%3Bheight%3A1em%3Boverflow%3Avisible%3Bvertical-align%3A-0.125em%3B%7D%23mermaid-_r_79_%20.node%20.label-icon%20path%7Bfill%3AcurrentColor%3Bstroke%3Arevert%3Bstroke-width%3Arevert%3B%7D%23mermaid-_r_79_%20.node%20text%7Bfont-size%3A16px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.32px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_79_%20.edgeLabels%20text%7Bfont-size%3A13px%3Bfont-weight%3A600%3Bletter-spacing%3A-0.08px%3Bfill%3A%2399ceff%3B%7D%23mermaid-_r_79_%20.node%20tspan%5Bfont-weight%3D%22normal%22%5D%2C%23mermaid-_r_79_%20.edgeLabels%20tspan%5Bfont-weight%3D%22normal%22%5D%7Bfont-weight%3A600%3B%7D%23mermaid-_r_79_%20.edgeLabel%20.label%20rect%7Bopacity%3A1%3Brx%3A13px%3Bry%3A13px%3Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_79_%20.node%20rect%2C%23mermaid-_r_79_%20.node%20circle%2C%23mermaid-_r_79_%20.node%20ellipse%2C%23mermaid-_r_79_%20.node%20polygon%2C%23mermaid-_r_79_%20.node%20path%7Bfill%3Argb\(0%2C%2040%2C%2077\)%3Bstroke%3Argba\(255%2C%20255%2C%20255%2C%200.1\)%3Bstroke-width%3A1px%3B%7D%23mermaid-_r_79_%20.node%20rect%7Brx%3A16px%3Bry%3A16px%3B%7D%23mermaid-_r_79_%20.node.mermaid-decision%20.label-container%7Bfill%3A%23000e1a%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-dasharray%3A2%202%3B%7D%23mermaid-_r_79_%20.edgePaths%20.flowchart-link%7Bstroke%3Argb\(26%2C%2062%2C%2095\)%3Bstroke-width%3A1px%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3B%7D%23mermaid-_r_79_%20.marker%7Bfill%3Argb\(26%2C%2062%2C%2095\)%3Bstroke%3Argb\(26%2C%2062%2C%2095\)%3B%7D%23mermaid-_r_79_%20.node%7Bcolor-scheme%3Adark%3B%7D%23mermaid-_r_79_%20%3Aroot%7B--mermaid-font-family%3A%22-apple-system%22%2C%22BlinkMacSystemFont%22%2C%22Segoe%20UI%22%2C%22Roboto%22%2C%22Oxygen%22%2C%22Ubuntu%22%2C%22Cantarell%22%2C%22Helvetica%20Neue%22%2C%22Arial%22%2C%22sans-serif%22%3B%7D%3C%2Fstyle%3E%3Cg%3E%3Cmarker%20id%3D%22mermaid-_r_79__flowchart-v2-pointEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%204%200%20M%200.8180194846605362%20-3.181980515339464%20L%204%200%20L%200.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_79__flowchart-v2-pointStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%22-5%20-5%2010%2010%22%20refX%3D%220%22%20refY%3D%220%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2210%22%20markerHeight%3D%2210%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%200%200%20L%20-4%200%20M%20-0.8180194846605362%20-3.181980515339464%20L%20-4%200%20L%20-0.8180194846605362%203.181980515339464%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20fill%3A%20none%3B%20stroke-linecap%3A%20round%3B%20stroke-linejoin%3A%20round%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_79__flowchart-v2-circleEnd%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%2211%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_79__flowchart-v2-circleStart%22%20class%3D%22marker%20flowchart-v2%22%20viewBox%3D%220%200%2010%2010%22%20refX%3D%22-1%22%20refY%3D%225%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Ccircle%20cx%3D%225%22%20cy%3D%225%22%20r%3D%225%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%201%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fcircle%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_79__flowchart-v2-crossEnd%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%2212%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3Cmarker%20id%3D%22mermaid-_r_79__flowchart-v2-crossStart%22%20class%3D%22marker%20cross%20flowchart-v2%22%20viewBox%3D%220%200%2011%2011%22%20refX%3D%22-1%22%20refY%3D%225.2%22%20markerUnits%3D%22userSpaceOnUse%22%20markerWidth%3D%2211%22%20markerHeight%3D%2211%22%20orient%3D%22auto%22%3E%3Cpath%20d%3D%22M%201%2C1%20l%209%2C9%20M%2010%2C1%20l%20-9%2C9%22%20class%3D%22arrowMarkerPath%22%20style%3D%22stroke-width%3A%202%3B%20stroke-dasharray%3A%201%2C%200%3B%22%3E%3C%2Fpath%3E%3C%2Fmarker%3E%3C%2Fg%3E%3Cg%20class%3D%22subgraphs%22%3E%3C%2Fg%3E%3Cg%20class%3D%22nodes%22%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-U-0%22%20transform%3D%22translate\(271.3675295511881%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-79.34939193725586%22%20y%3D%22-30%22%20width%3D%22158.69878387451172%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EUser%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Client%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-G-1%22%20transform%3D%22translate\(293.53894170125324%2C%20182\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-66.51423454284668%22%20y%3D%22-30%22%20width%3D%22133.02846908569336%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EGateway%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-C-3%22%20transform%3D%22translate\(673.2606381734213%2C%20282\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-78.38908767700195%22%20y%3D%22-30%22%20width%3D%22156.7781753540039%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECoordinator%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-D-5%22%20transform%3D%22translate\(670.7527214050293%2C%20402\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-70.8653335571289%22%20y%3D%22-30%22%20width%3D%22141.7306671142578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDelegator%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-W1-7%22%20transform%3D%22translate\(447.94728469848627%2C%20522\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-69.61422348022461%22%20y%3D%22-30%22%20width%3D%22139.22844696044922%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20A%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-W2-9%22%20transform%3D%22translate\(656.5796546936035%2C%20522\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-68.81422424316406%22%20y%3D%22-30%22%20width%3D%22137.62844848632812%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20B%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-W3-11%22%20transform%3D%22translate\(1109.3827285766602%2C%20522\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-68.82500076293945%22%20y%3D%22-30%22%20width%3D%22137.6500015258789%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EWorker%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20C%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-L-13%22%20transform%3D%22translate\(133.90501403808594%2C%20642\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-50.73750019073486%22%20y%3D%22-30%22%20width%3D%22101.47500038146973%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ELLM%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-T-15%22%20transform%3D%22translate\(832.5470275878906%2C%20642\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-54.24126052856445%22%20y%3D%22-30%22%20width%3D%22108.4825210571289%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ETools%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-DB-17%22%20transform%3D%22translate\(656.5796546936035%2C%20642\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-81.72611236572266%22%20y%3D%22-30%22%20width%3D%22163.4522247314453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EData%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Sources%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-M-19%22%20transform%3D%22translate\(1133.9431457519531%2C%20642\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-73.6812515258789%22%20y%3D%22-30%22%20width%3D%22147.3625030517578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EMessaging%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-R-21%22%20transform%3D%22translate\(271.3675295511881%2C%20282\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-133.37501525878906%22%20y%3D%22-30%22%20width%3D%22266.7500305175781%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ERetry%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Timeout%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Rate%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Limit%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-S-23%22%20transform%3D%22translate\(896.7044960021973%2C%20402\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-115.08643341064453%22%20y%3D%22-30%22%20width%3D%22230.17286682128906%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3ECheckpoint%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Recovery%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-F-25%22%20transform%3D%22translate\(856.0438804626465%2C%20522\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-90.6500015258789%22%20y%3D%22-30%22%20width%3D%22181.3000030517578%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFailure%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Isolation%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-E-27%22%20transform%3D%22translate\(447.94728469848627%2C%20642\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-86.90625381469727%22%20y%3D%22-30%22%20width%3D%22173.81250762939453%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EError%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Handling%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-B-29%22%20transform%3D%22translate\(133.90501403808594%2C%20742\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-121.90502166748047%22%20y%3D%22-30%22%20width%3D%22243.81004333496094%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EFallback%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Circuit%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Breaker%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-Q-31%22%20transform%3D%22translate\(832.5470275878906%2C%20742\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-135.4875030517578%22%20y%3D%22-30%22%20width%3D%22270.9750061035156%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EDead-Letter%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Compensation%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-I-33%22%20transform%3D%22translate\(1133.9431457519531%2C%20742\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-125.90862274169922%22%20y%3D%22-30%22%20width%3D%22251.81724548339844%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EIdempotency%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%2F%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Redelivery%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22node%20default%22%20id%3D%22flowchart-O-34%22%20transform%3D%22translate\(699.3903327941895%2C%2042\)%22%3E%3Crect%20class%3D%22basic%20label-container%22%20style%3D%22%22%20x%3D%22-112.1572036743164%22%20y%3D%22-30%22%20width%3D%22224.3144073486328%22%20height%3D%2260%22%3E%3C%2Frect%3E%3Cg%20class%3D%22label%22%20style%3D%22%22%20transform%3D%22translate\(0%2C%20-10.800000190734863\)%22%3E%3Crect%3E%3C%2Frect%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3Ctext%20y%3D%22-10.1%22%20style%3D%22%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3EObservability%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20%26amp%3B%3C%2Ftspan%3E%3Ctspan%20font-style%3D%22normal%22%20class%3D%22text-inner-tspan%22%20font-weight%3D%22normal%22%3E%20Alerts%3C%2Ftspan%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edges%20edgePaths%22%3E%3Cpath%20d%3D%22M271.3675295511881%2C72L271.3675295511881%2C140%22%20id%3D%22L_U_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_U_G_0%22%20data-points%3D%22W3sieCI6MjcxLjM2NzUyOTU1MTE4ODEsInkiOjcyfSx7IngiOjI3MS4zNjc1Mjk1NTExODgxLCJ5IjoxNDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M315.71035385131836%2C212L315.71035385131836%2C225.21704397470535Q315.71035385131836%2C227%20316.79614028894525%2C228.4142135623731L316.79614028894525%2C228.4142135623731Q317.88192672657215%2C229.82842712474618%20319.29614028894525%2C230.91421356237308L319.29614028894525%2C230.9142135623731Q320.71035385131836%2C232%20322.493309876613%2C232L640.3479875273584%2C232Q642.1309435526531%2C232%20643.5451571150262%2C233.0857864376269L643.5451571150262%2C233.08578643762692Q644.9593706773993%2C234.17157287525382%20646.0451571150262%2C235.5857864376269L646.0451571150262%2C235.5857864376269Q647.1309435526531%2C237%20647.1309435526531%2C238.78295602529465L647.1309435526531%2C242%22%20id%3D%22L_G_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_C_0%22%20data-points%3D%22W3sieCI6MzE1LjcxMDM1Mzg1MTMxODM2LCJ5IjoyMTJ9LHsieCI6MzE1LjcxMDM1Mzg1MTMxODM2LCJ5IjoyMzJ9LHsieCI6NjQ3LjEzMDk0MzU1MjY1MzEsInkiOjIzMn0seyJ4Ijo2NDcuMTMwOTQzNTUyNjUzMSwieSI6MjQ2fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M647.1309435526531%2C312L647.130943552653%2C360%22%20id%3D%22L_C_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_D_0%22%20data-points%3D%22W3sieCI6NjQ3LjEzMDk0MzU1MjY1MzEsInkiOjMxMn0seyJ4Ijo2NDcuMTMwOTQzNTUyNjUzLCJ5IjozNjR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M628.233521270752%2C432L628.233521270752%2C445.21704397470535Q628.233521270752%2C447%20627.1477348331251%2C448.4142135623731L627.1477348331251%2C448.4142135623731Q626.0619483954982%2C449.8284271247462%20624.6477348331251%2C450.9142135623731L624.6477348331251%2C450.9142135623731Q623.233521270752%2C452%20621.4505652454574%2C452L477.93498061229%2C452Q476.15202458699537%2C452%20474.73781102462226%2C453.0857864376269L474.73781102462226%2C453.0857864376269Q473.32359746224915%2C454.1715728752538%20472.23781102462226%2C455.5857864376269L472.23781102462226%2C455.5857864376269Q471.15202458699537%2C457%20471.15202458699537%2C458.78295602529465L471.15202458699537%2C480%22%20id%3D%22L_D_W1_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_W1_0%22%20data-points%3D%22W3sieCI6NjI4LjIzMzUyMTI3MDc1MiwieSI6NDMyfSx7IngiOjYyOC4yMzM1MjEyNzA3NTIsInkiOjQ1Mn0seyJ4Ijo0NzEuMTUyMDI0NTg2OTk1MzcsInkiOjQ1Mn0seyJ4Ijo0NzEuMTUyMDI0NTg2OTk1MzcsInkiOjQ4NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M656.5796546936035%2C432L656.5796546936035%2C480%22%20id%3D%22L_D_W2_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_W2_0%22%20data-points%3D%22W3sieCI6NjU2LjU3OTY1NDY5MzYwMzUsInkiOjQzMn0seyJ4Ijo2NTYuNTc5NjU0NjkzNjAzNSwieSI6NDg0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M713.2719215393066%2C432L713.2719215393066%2C445.21704397470535Q713.2719215393066%2C447%20714.3577079769335%2C448.4142135623731L714.3577079769335%2C448.4142135623731Q715.4434944145604%2C449.8284271247462%20716.8577079769335%2C450.9142135623731L716.8577079769335%2C450.9142135623731Q718.2719215393066%2C452%20720.0548775646013%2C452L1102.5997725513655%2C452Q1104.3827285766602%2C452%201105.7969421390333%2C453.0857864376269L1105.7969421390333%2C453.0857864376269Q1107.2111557014064%2C454.1715728752538%201108.2969421390333%2C455.5857864376269L1108.2969421390333%2C455.5857864376269Q1109.3827285766602%2C457%201109.3827285766602%2C458.78295602529465L1109.3827285766602%2C480%22%20id%3D%22L_D_W3_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_W3_0%22%20data-points%3D%22W3sieCI6NzEzLjI3MTkyMTUzOTMwNjYsInkiOjQzMn0seyJ4Ijo3MTMuMjcxOTIxNTM5MzA2NiwieSI6NDUyfSx7IngiOjExMDkuMzgyNzI4NTc2NjYwMiwieSI6NDUyfSx7IngiOjExMDkuMzgyNzI4NTc2NjYwMiwieSI6NDg0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M413.14017486572254%2C552L413.1401748657226%2C564.9289321881346Q413.1401748657226%2C572%20406.0691070538571%2C572L157.60046980906742%2C572Q155.81751378377277%2C572%20154.40330022139966%2C573.0857864376269L154.40330022139966%2C573.0857864376269Q152.98908665902658%2C574.1715728752538%20151.9033002213997%2C575.5857864376269L151.90330022139966%2C575.5857864376269Q150.81751378377277%2C577%20150.81751378377277%2C578.7829560252947L150.81751378377277%2C600%22%20id%3D%22L_W1_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_W1_L_0%22%20data-points%3D%22W3sieCI6NDEzLjE0MDE3NDg2NTcyMjU0LCJ5Ijo1NTJ9LHsieCI6NDEzLjE0MDE3NDg2NTcyMjYsInkiOjU3Mn0seyJ4IjoxNTAuODE3NTEzNzgzNzcyNzcsInkiOjU3Mn0seyJ4IjoxNTAuODE3NTEzNzgzNzcyNzcsInkiOjYwNH1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M482.75439453125%2C552L482.75439453124994%2C564.9289321881346Q482.75439453124994%2C572%20489.8254623431154%2C572L807.6836513864079%2C572Q809.4666074117025%2C572%20810.8808209740756%2C573.0857864376269L810.8808209740756%2C573.0857864376269Q812.2950345364487%2C574.1715728752538%20813.3808209740756%2C575.5857864376269L813.3808209740756%2C575.5857864376269Q814.4666074117025%2C577%20814.4666074117025%2C578.7829560252947L814.4666074117025%2C600%22%20id%3D%22L_W1_T_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_W1_T_0%22%20data-points%3D%22W3sieCI6NDgyLjc1NDM5NDUzMTI1LCJ5Ijo1NTJ9LHsieCI6NDgyLjc1NDM5NDUzMTI0OTk0LCJ5Ijo1NzJ9LHsieCI6ODE0LjQ2NjYwNzQxMTcwMjUsInkiOjU3Mn0seyJ4Ijo4MTQuNDY2NjA3NDExNzAyNSwieSI6NjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M656.5796546936035%2C552L656.5796546936035%2C600%22%20id%3D%22L_W2_DB_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_W2_DB_0%22%20data-points%3D%22W3sieCI6NjU2LjU3OTY1NDY5MzYwMzUsInkiOjU1Mn0seyJ4Ijo2NTYuNTc5NjU0NjkzNjAzNSwieSI6NjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1109.3827285766602%2C552L1109.3827285766602%2C600%22%20id%3D%22L_W3_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-solid%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_W3_M_0%22%20data-points%3D%22W3sieCI6MTEwOS4zODI3Mjg1NzY2NjAyLCJ5Ijo1NTJ9LHsieCI6MTEwOS4zODI3Mjg1NzY2NjAyLCJ5Ijo2MDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M271.3675295511881%2C212L271.3675295511881%2C240%22%20id%3D%22L_G_R_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_G_R_0%22%20data-points%3D%22W3sieCI6MjcxLjM2NzUyOTU1MTE4ODEsInkiOjIxMn0seyJ4IjoyNzEuMzY3NTI5NTUxMTg4MSwieSI6MjQ0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M699.3903327941895%2C312L699.3903327941895%2C325.21704397470535Q699.3903327941895%2C327%20700.4761192318164%2C328.4142135623731L700.4761192318164%2C328.4142135623731Q701.5619056694433%2C329.8284271247462%20702.9761192318164%2C330.9142135623731L702.9761192318164%2C330.9142135623731Q704.3903327941895%2C332%20706.1732888194841%2C332L889.9215399769026%2C332Q891.7044960021973%2C332%20893.1187095645704%2C333.0857864376269L893.1187095645704%2C333.0857864376269Q894.5329231269435%2C334.1715728752538%20895.6187095645704%2C335.5857864376269L895.6187095645704%2C335.5857864376269Q896.7044960021973%2C337%20896.7044960021973%2C338.78295602529465L896.7044960021973%2C360%22%20id%3D%22L_C_S_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_C_S_0%22%20data-points%3D%22W3sieCI6Njk5LjM5MDMzMjc5NDE4OTUsInkiOjMxMn0seyJ4Ijo2OTkuMzkwMzMyNzk0MTg5NSwieSI6MzMyfSx7IngiOjg5Ni43MDQ0OTYwMDIxOTczLCJ5IjozMzJ9LHsieCI6ODk2LjcwNDQ5NjAwMjE5NzMsInkiOjM2NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M684.9257881164551%2C432L684.9257881164551%2C465.21704397470535Q684.9257881164551%2C467%20686.011574554082%2C468.4142135623731L686.011574554082%2C468.4142135623731Q687.0973609917089%2C469.8284271247462%20688.511574554082%2C470.9142135623731L688.511574554082%2C470.9142135623731Q689.9257881164551%2C472%20691.7087441417498%2C472L849.2609244373518%2C472Q851.0438804626465%2C472%20852.4580940250196%2C473.0857864376269L852.4580940250196%2C473.0857864376269Q853.8723075873927%2C474.1715728752538%20854.9580940250196%2C475.5857864376269L854.9580940250196%2C475.5857864376269Q856.0438804626465%2C477%20856.0438804626465%2C478.78295602529465L856.0438804626465%2C482%22%20id%3D%22L_D_F_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_D_F_0%22%20data-points%3D%22W3sieCI6Njg0LjkyNTc4ODExNjQ1NTEsInkiOjQzMn0seyJ4Ijo2ODQuOTI1Nzg4MTE2NDU1MSwieSI6NDcyfSx7IngiOjg1Ni4wNDM4ODA0NjI2NDY1LCJ5Ijo0NzJ9LHsieCI6ODU2LjA0Mzg4MDQ2MjY0NjUsInkiOjQ4Nn1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M447.94728469848627%2C552L447.94728469848627%2C600%22%20id%3D%22L_W1_E_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_W1_E_0%22%20data-points%3D%22W3sieCI6NDQ3Ljk0NzI4NDY5ODQ4NjI3LCJ5Ijo1NTJ9LHsieCI6NDQ3Ljk0NzI4NDY5ODQ4NjI3LCJ5Ijo2MDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M133.90501403808594%2C672L133.90501403808594%2C700%22%20id%3D%22L_L_B_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_L_B_0%22%20data-points%3D%22W3sieCI6MTMzLjkwNTAxNDAzODA4NTk0LCJ5Ijo2NzJ9LHsieCI6MTMzLjkwNTAxNDAzODA4NTk0LCJ5Ijo3MDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M832.5470275878906%2C672L832.5470275878906%2C700%22%20id%3D%22L_T_Q_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_T_Q_0%22%20data-points%3D%22W3sieCI6ODMyLjU0NzAyNzU4Nzg5MDYsInkiOjY3Mn0seyJ4Ijo4MzIuNTQ3MDI3NTg3ODkwNiwieSI6NzA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M1133.9431457519531%2C672L1133.9431457519531%2C700%22%20id%3D%22L_M_I_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_M_I_0%22%20data-points%3D%22W3sieCI6MTEzMy45NDMxNDU3NTE5NTMxLCJ5Ijo2NzJ9LHsieCI6MTEzMy45NDMxNDU3NTE5NTMxLCJ5Ijo3MDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M643.3117309570313%2C72L643.3117309570313%2C105.21704397470535Q643.3117309570313%2C107%20642.2259445194044%2C108.41421356237309L642.2259445194044%2C108.41421356237309Q641.1401580817775%2C109.82842712474618%20639.7259445194044%2C110.91421356237308L639.7259445194044%2C110.91421356237309Q638.3117309570313%2C112%20636.5287749317366%2C112L322.493309876613%2C112Q320.71035385131836%2C112%20319.29614028894525%2C113.08578643762691L319.29614028894525%2C113.08578643762692Q317.88192672657215%2C114.17157287525382%20316.79614028894525%2C115.58578643762691L316.79614028894525%2C115.58578643762691Q315.71035385131836%2C117%20315.71035385131836%2C118.78295602529465L315.71035385131836%2C140%22%20id%3D%22L_O_G_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_G_0%22%20data-points%3D%22W3sieCI6NjQzLjMxMTczMDk1NzAzMTMsInkiOjcyfSx7IngiOjY0My4zMTE3MzA5NTcwMzEzLCJ5IjoxMTJ9LHsieCI6MzE1LjcxMDM1Mzg1MTMxODM2LCJ5IjoxMTJ9LHsieCI6MzE1LjcxMDM1Mzg1MTMxODM2LCJ5IjoxNDR9XQ%3D%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M699.3903327941895%2C72L699.3903327941895%2C182L699.3903327941895%2C240%22%20id%3D%22L_O_C_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_C_0%22%20data-points%3D%22W3sieCI6Njk5LjM5MDMzMjc5NDE4OTUsInkiOjcyfSx7IngiOjY5OS4zOTAzMzI3OTQxODk1LCJ5IjoxODJ9LHsieCI6Njk5LjM5MDMzMjc5NDE4OTUsInkiOjI0NH1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M727.4296337127686%2C72L727.4296337127686%2C125.21704397470535Q727.4296337127686%2C127%20728.5154201503955%2C128.4142135623731L728.5154201503955%2C128.4142135623731Q729.6012065880224%2C129.82842712474618%20731.0154201503955%2C130.91421356237308L731.0154201503955%2C130.9142135623731Q732.4296337127686%2C132%20734.2125897380632%2C132L764.8667660104313%2C132Q766.649722035726%2C132%20768.0639355980991%2C133.0857864376269L768.0639355980991%2C133.08578643762692Q769.4781491604722%2C134.17157287525382%20770.5639355980991%2C135.5857864376269L770.5639355980991%2C135.5857864376269Q771.649722035726%2C137%20771.649722035726%2C138.78295602529465L771.649722035726%2C182L771.649722035726%2C282L771.649722035726%2C345.21704397470535Q771.649722035726%2C347%20770.5639355980991%2C348.4142135623731L770.5639355980991%2C348.4142135623731Q769.4781491604722%2C349.8284271247462%20768.0639355980991%2C350.9142135623731L768.0639355980991%2C350.9142135623731Q766.649722035726%2C352%20764.8667660104313%2C352L701.1574552827003%2C352Q699.3744992574057%2C352%20697.9602856950326%2C353.0857864376269L697.9602856950326%2C353.0857864376269Q696.5460721326594%2C354.1715728752538%20695.4602856950326%2C355.5857864376269L695.4602856950326%2C355.5857864376269Q694.3744992574057%2C357%20694.3744992574057%2C358.78295602529465L694.3744992574057%2C362%22%20id%3D%22L_O_D_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_D_0%22%20data-points%3D%22W3sieCI6NzI3LjQyOTYzMzcxMjc2ODYsInkiOjcyfSx7IngiOjcyNy40Mjk2MzM3MTI3Njg2LCJ5IjoxMzJ9LHsieCI6NzcxLjY0OTcyMjAzNTcyNiwieSI6MTMyfSx7IngiOjc3MS42NDk3MjIwMzU3MjYsInkiOjE4Mn0seyJ4Ijo3NzEuNjQ5NzIyMDM1NzI2LCJ5IjoyODJ9LHsieCI6NzcxLjY0OTcyMjAzNTcyNiwieSI6MzUyfSx7IngiOjY5NC4zNzQ0OTkyNTc0MDU3LCJ5IjozNTJ9LHsieCI6Njk0LjM3NDQ5OTI1NzQwNTcsInkiOjM2Nn1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M671.3510318756104%2C72L671.3510318756104%2C125.21704397470535Q671.3510318756104%2C127%20670.2652454379835%2C128.4142135623731L670.2652454379835%2C128.4142135623731Q669.1794590003566%2C129.82842712474618%20667.7652454379835%2C130.91421356237308L667.7652454379835%2C130.9142135623731Q666.3510318756104%2C132%20664.5680758503157%2C132L431.5255008352718%2C132Q429.7425448099772%2C132%20428.32833124760407%2C133.0857864376269L428.32833124760407%2C133.08578643762692Q426.91411768523096%2C134.17157287525382%20425.82833124760407%2C135.5857864376269L425.82833124760407%2C135.5857864376269Q424.7425448099772%2C137%20424.7425448099772%2C138.78295602529465L424.7425448099772%2C182L424.7425448099772%2C282L424.7425448099772%2C402L424.7425448099772%2C480%22%20id%3D%22L_O_W1_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_W1_0%22%20data-points%3D%22W3sieCI6NjcxLjM1MTAzMTg3NTYxMDQsInkiOjcyfSx7IngiOjY3MS4zNTEwMzE4NzU2MTA0LCJ5IjoxMzJ9LHsieCI6NDI0Ljc0MjU0NDgwOTk3NzIsInkiOjEzMn0seyJ4Ijo0MjQuNzQyNTQ0ODA5OTc3MiwieSI6MTgyfSx7IngiOjQyNC43NDI1NDQ4MDk5NzcyLCJ5IjoyODJ9LHsieCI6NDI0Ljc0MjU0NDgwOTk3NzIsInkiOjQwMn0seyJ4Ijo0MjQuNzQyNTQ0ODA5OTc3MiwieSI6NDg0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M615.2724300384522%2C72L615.2724300384522%2C85.21704397470535Q615.2724300384522%2C87%20614.1866436008253%2C88.41421356237309L614.1866436008253%2C88.41421356237309Q613.1008571631984%2C89.82842712474618%20611.6866436008253%2C90.91421356237308L611.6866436008253%2C90.91421356237309Q610.2724300384522%2C92%20608.4894740131575%2C92L123.77547031769373%2C92Q121.99251429239908%2C92%20120.57830073002599%2C93.08578643762691L120.57830073002599%2C93.08578643762691Q119.1640871676529%2C94.17157287525382%20118.07830073002599%2C95.58578643762691L118.07830073002599%2C95.58578643762691Q116.99251429239908%2C97%20116.99251429239908%2C98.78295602529465L116.99251429239908%2C182L116.99251429239908%2C282L116.99251429239908%2C402L116.99251429239908%2C522L116.99251429239908%2C600%22%20id%3D%22L_O_L_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_L_0%22%20data-points%3D%22W3sieCI6NjE1LjI3MjQzMDAzODQ1MjIsInkiOjcyfSx7IngiOjYxNS4yNzI0MzAwMzg0NTIyLCJ5Ijo5Mn0seyJ4IjoxMTYuOTkyNTE0MjkyMzk5MDgsInkiOjkyfSx7IngiOjExNi45OTI1MTQyOTIzOTkwOCwieSI6MTgyfSx7IngiOjExNi45OTI1MTQyOTIzOTkwOCwieSI6MjgyfSx7IngiOjExNi45OTI1MTQyOTIzOTkwOCwieSI6NDAyfSx7IngiOjExNi45OTI1MTQyOTIzOTkwOCwieSI6NTIyfSx7IngiOjExNi45OTI1MTQyOTIzOTkwOCwieSI6NjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M755.4689346313477%2C72L755.4689346313477%2C105.21704397470535Q755.4689346313477%2C107%20756.5547210689746%2C108.41421356237309L756.5547210689746%2C108.41421356237309Q757.6405075066015%2C109.82842712474618%20759.0547210689746%2C110.91421356237308L759.0547210689746%2C110.91421356237309Q760.4689346313477%2C112%20762.2518906566423%2C112L1191.4247694996077%2C112Q1193.2077255249023%2C112%201194.6219390872755%2C113.08578643762691L1194.6219390872755%2C113.08578643762692Q1196.0361526496486%2C114.17157287525382%201197.1219390872755%2C115.58578643762691L1197.1219390872755%2C115.58578643762691Q1198.2077255249023%2C117%201198.2077255249023%2C118.78295602529465L1198.2077255249023%2C182L1198.2077255249023%2C282L1198.2077255249023%2C402L1198.2077255249023%2C522L1198.2077255249023%2C565.2170439747053Q1198.2077255249023%2C567%201197.1219390872755%2C568.4142135623731L1197.1219390872755%2C568.4142135623731Q1196.0361526496486%2C569.8284271247462%201194.6219390872755%2C570.9142135623731L1194.6219390872755%2C570.9142135623731Q1193.2077255249023%2C572%201191.4247694996077%2C572L857.4104037893734%2C572Q855.6274477640787%2C572%20854.2132342017056%2C573.0857864376269L854.2132342017056%2C573.0857864376269Q852.7990206393325%2C574.1715728752538%20851.7132342017056%2C575.5857864376269L851.7132342017056%2C575.5857864376269Q850.6274477640787%2C577%20850.6274477640787%2C578.7829560252947L850.6274477640787%2C600%22%20id%3D%22L_O_T_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_T_0%22%20data-points%3D%22W3sieCI6NzU1LjQ2ODkzNDYzMTM0NzcsInkiOjcyfSx7IngiOjc1NS40Njg5MzQ2MzEzNDc3LCJ5IjoxMTJ9LHsieCI6MTE5OC4yMDc3MjU1MjQ5MDIzLCJ5IjoxMTJ9LHsieCI6MTE5OC4yMDc3MjU1MjQ5MDIzLCJ5IjoxODJ9LHsieCI6MTE5OC4yMDc3MjU1MjQ5MDIzLCJ5IjoyODJ9LHsieCI6MTE5OC4yMDc3MjU1MjQ5MDIzLCJ5Ijo0MDJ9LHsieCI6MTE5OC4yMDc3MjU1MjQ5MDIzLCJ5Ijo1MjJ9LHsieCI6MTE5OC4yMDc3MjU1MjQ5MDIzLCJ5Ijo1NzJ9LHsieCI6ODUwLjYyNzQ0Nzc2NDA3ODcsInkiOjU3Mn0seyJ4Ijo4NTAuNjI3NDQ3NzY0MDc4NywieSI6NjA0fV0%3D%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M783.5082355499268%2C72L783.5082355499268%2C85.21704397470535Q783.5082355499268%2C87%20784.5940219875537%2C88.41421356237309L784.5940219875537%2C88.41421356237309Q785.6798084251806%2C89.82842712474618%20787.0940219875537%2C90.91421356237308L787.0940219875537%2C90.91421356237309Q788.5082355499268%2C92%20790.2911915752214%2C92L1212.4247694996077%2C92Q1214.2077255249023%2C92%201215.6219390872755%2C93.08578643762691L1215.6219390872755%2C93.08578643762692Q1217.0361526496486%2C94.17157287525382%201218.1219390872755%2C95.58578643762691L1218.1219390872755%2C95.58578643762691Q1219.2077255249023%2C97%201219.2077255249023%2C98.78295602529465L1219.2077255249023%2C182L1219.2077255249023%2C282L1219.2077255249023%2C402L1219.2077255249023%2C522L1219.2077255249023%2C585.2170439747053Q1219.2077255249023%2C587%201218.1219390872755%2C588.4142135623731L1218.1219390872755%2C588.4142135623731Q1217.0361526496486%2C589.8284271247462%201215.6219390872755%2C590.9142135623731L1215.6219390872755%2C590.9142135623731Q1214.2077255249023%2C592%201212.4247694996077%2C592L1165.2865189525407%2C592Q1163.503562927246%2C592%201162.089349364873%2C593.0857864376269L1162.089349364873%2C593.0857864376269Q1160.6751358024999%2C594.1715728752538%201159.589349364873%2C595.5857864376269L1159.589349364873%2C595.5857864376269Q1158.503562927246%2C597%201158.503562927246%2C598.7829560252947L1158.503562927246%2C602%22%20id%3D%22L_O_M_0%22%20class%3D%22edge-thickness-normal%20edge-pattern-dotted%20edge-thickness-normal%20edge-pattern-solid%20flowchart-link%22%20style%3D%22%3B%22%20data-edge%3D%22true%22%20data-et%3D%22edge%22%20data-id%3D%22L_O_M_0%22%20data-points%3D%22W3sieCI6NzgzLjUwODIzNTU0OTkyNjgsInkiOjcyfSx7IngiOjc4My41MDgyMzU1NDk5MjY4LCJ5Ijo5Mn0seyJ4IjoxMjE5LjIwNzcyNTUyNDkwMjMsInkiOjkyfSx7IngiOjEyMTkuMjA3NzI1NTI0OTAyMywieSI6MTgyfSx7IngiOjEyMTkuMjA3NzI1NTI0OTAyMywieSI6MjgyfSx7IngiOjEyMTkuMjA3NzI1NTI0OTAyMywieSI6NDAyfSx7IngiOjEyMTkuMjA3NzI1NTI0OTAyMywieSI6NTIyfSx7IngiOjEyMTkuMjA3NzI1NTI0OTAyMywieSI6NTkyfSx7IngiOjExNTguNTAzNTYyOTI3MjQ2LCJ5Ijo1OTJ9LHsieCI6MTE1OC41MDM1NjI5MjcyNDYsInkiOjYwNn1d%22%20marker-end%3D%22url\(%23mermaid-_r_79__flowchart-v2-pointEnd\)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabels%22%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%3E%3Crect%20class%3D%22background%22%20style%3D%22stroke%3A%20none%22%3E%3C%2Frect%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_U_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_W1_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_W2_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_W3_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_W1_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_W1_T_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_W2_DB_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_W3_M_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_G_R_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_C_S_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_D_F_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_W1_E_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_L_B_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_T_Q_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_M_I_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_G_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_C_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_D_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_W1_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_L_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_T_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20class%3D%22edgeLabel%22%3E%3Cg%20class%3D%22label%22%20data-id%3D%22L_O_M_0%22%20transform%3D%22translate\(0%2C%200\)%22%3E%3Ctext%20y%3D%22-10.1%22%3E%3Ctspan%20class%3D%22text-outer-tspan%22%20x%3D%220%22%20y%3D%22-0.1em%22%20dy%3D%221.1em%22%3E%3C%2Ftspan%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E)

How to read this: The solid arrows show execution flow. The dotted arrows show reliability controls that monitor or protect each component.

## 3. Failure handling across the execution lifecycle

1. Detect

Identify failures through exceptions, timeouts, health checks, validation errors, and monitoring signals.

2. Isolate

Prevent one failed request, worker, or dependency from taking down unrelated executions.

3. Retry

Repeat transient failures with controlled limits and backoff, without creating duplicate side effects.

4. Recover

Resume from a checkpoint, restore a worker, use a fallback, or compensate for a completed side effect.

5. Escalate

Move unrecoverable failures to human review, a dead-letter queue, or an incident workflow.

## 4. Failure types you must distinguish

|
Failure type

|

Example

|

Typical response

|
| --- | --- | --- |
|

Transient

|

Network timeout, temporary 503

|

Retry with backoff

|
|

Permanent

|

Invalid API key, unsupported request

|

Fail fast and alert

|
|

Dependency

|

LLM or database unavailable

|

Fallback, circuit breaker

|
|

Data

|

Missing or corrupted input

|

Validate, reject, or quarantine

|
|

Execution

|

Worker crashes midway

|

Checkpoint and resume

|
|

Messaging

|

Duplicate or lost delivery

|

Idempotency, redelivery

|
|

Business

|

Payment succeeded but confirmation failed

|

Compensation and reconciliation

|
|

Resource

|

Queue saturation, token exhaustion

|

Rate limiting, backpressure

|

Important: Not every error should be retried. Retrying a permanent failure wastes resources, and retrying a non-idempotent operation can create duplicate side effects.

## 5. Component-by-component understanding


### Gateway — Protect the entry point

The Gateway is the first reliability boundary. It prevents invalid or excessive requests from reaching the agent system.

Failure scenarios

* Client disconnects while the request is processing.

* Request exceeds its deadline.

* Too many requests arrive simultaneously.

* Authentication or authorization service is unavailable.

* Downstream Coordinator is unreachable.

Reliability mechanisms

|
Mechanism

|

Purpose

|
| --- | --- |
|

Timeouts

|

Stop waiting indefinitely for downstream services.

|
|

Rate limiting

|

Prevent overload and resource exhaustion.

|
|

Request validation

|

Reject malformed or unsafe requests early.

|
|

Idempotency keys

|

Prevent duplicate processing when clients retry.

|
|

Circuit breaker

|

Temporarily stop calls to an unhealthy dependency.

|
|

Correlation ID

|

Trace the request across every component.

|

Example: If the Coordinator is unavailable, the Gateway should return a controlled error such as `503 Service Unavailable`, not hang until the client times out.

### Coordinator — Preserve workflow state

The Coordinator manages the overall execution lifecycle. Its reliability responsibility is to ensure that a workflow does not lose its state when a worker or dependency fails.

Failure scenarios

* Coordinator process crashes.

* Workflow execution times out.

* A worker returns an error.

* The application restarts during execution.

* A previously completed step is accidentally executed again.

Reliability mechanisms

* Checkpointing: Persist workflow state after important steps.

* Durable execution state: Store status, inputs, outputs, and retry counts.

* Resume: Continue from the last safe checkpoint.

* State-machine transitions: Prevent invalid transitions such as `completed → running`.

* Execution deadlines: Stop workflows that exceed their allowed duration.

* Recovery workers: Resume interrupted executions after a restart.

Example:

```
Workflow: Generate customer report

1. Receive request
2. Retrieve customer data       ✓ checkpoint
3. Analyze data                 ✓ checkpoint
4. Generate report              ✗ LLM timeout
5. Retry LLM
6. Continue from step 4
7. Save report                   ✓ completed
```

Without checkpointing, the system may repeat steps 2 and 3 unnecessarily.

### Delegator — Isolate worker failures

The Delegator distributes work to Workers. Its reliability responsibility is to ensure that one unavailable worker does not stop unrelated work.

Failure scenarios

* Selected worker is unavailable.

* Worker crashes during execution.

* Worker returns an invalid result.

* Worker queue becomes overloaded.

* One task in a parallel workflow fails while others succeed.

Reliability mechanisms

* Worker health checks

* Task timeouts

* Retry with bounded attempts

* Worker selection and failover

* Partial-result handling

* Task cancellation

* Dead-letter queues for unrecoverable tasks

Example:

```
Coordinator
    |
    v
Delegator
    |
    +--> Worker A: Customer data ✓
    |
    +--> Worker B: Risk analysis ✗ timeout
    |
    +--> Worker C: Report formatting ✓
                 |
                 v
          Retry Worker B
                 |
                 v
          All results combined
```

The Delegator should not automatically restart every worker. It should identify whether the failure is transient, permanent, or caused by invalid input.

### Workers — Handle local execution failures

Workers perform the actual business tasks. They must protect themselves from failures in tools, LLMs, databases, and external APIs.

Failure scenarios

* Tool call fails.

* LLM returns invalid JSON.

* Database query times out.

* Worker crashes after completing a side effect.

* Input is missing required fields.

Reliability mechanisms

* Input validation

* Output schema validation

* Exception handling

* Timeouts

* Retry policies

* Checkpointing

* Compensation for side effects

* Structured error reporting

Example:

Python

Run

```
try:
    result = await worker.execute(task)

    # Validate before returning
    validated = TaskOutput.model_validate(result)

    return validated

except TimeoutError:
    return WorkerResult(
        status="retryable_failure",
        error_code="WORKER_TIMEOUT"
    )

except ValidationError:
    return WorkerResult(
        status="permanent_failure",
        error_code="INVALID_OUTPUT"
    )
```

The Worker should return a structured failure, not simply crash and leave the Coordinator guessing.

### LLMs — Manage model and inference failures

LLM calls are one of the most important reliability boundaries in an agentic system.

Failure scenarios

* Request timeout.

* Rate limit exceeded.

* Provider returns `5xx`.

* Model returns malformed JSON.

* Context window exceeded.

* Token budget exhausted.

* Model produces an unsafe or unusable response.

Reliability mechanisms

|
Mechanism

|

Example

|
| --- | --- |
|

Timeout

|

Stop waiting after 30 seconds.

|
|

Retry

|

Retry temporary provider errors.

|
|

Fallback model

|

Use another model when the primary is unavailable.

|
|

Structured output validation

|

Reject malformed tool arguments.

|
|

Token budget

|

Prevent runaway generation.

|
|

Circuit breaker

|

Stop calling a failing provider temporarily.

|
|

Model routing

|

Use a smaller or alternate model for supported tasks.

|

Example:

```
Primary LLM
    |
    +--> Success → Continue
    |
    +--> Timeout → Retry
    |
    +--> Rate limit → Backoff
    |
    +--> Repeated failure → Fallback model
    |
    +--> Invalid output → Validate / repair / retry
    |
    +--> Permanent failure → Escalate
```

Important: A fallback model should only be used when it can safely perform the required task. A weaker model may not be suitable for every workflow.

### Tools & Data Sources — Contain dependency failures

Tools connect Workers to enterprise systems such as CRM, databases, search engines, APIs, and file stores.

Failure scenarios

* CRM API returns `500`.

* Database connection is lost.

* Search service returns no results.

* External API is slow.

* Data source returns stale or invalid data.

* Tool succeeds but the response is lost.

Reliability mechanisms

* Timeouts

* Retry with exponential backoff

* Circuit breakers

* Connection pooling

* Bulkheads

* Schema validation

* Fallback data sources

* Caching where appropriate

* Compensation for completed operations

Example:

```
Worker
   |
   v
CRM Tool
   |
   +--> Timeout → Retry
   |
   +--> 503 → Retry with backoff
   |
   +--> Repeated failure → Circuit breaker
   |
   +--> Invalid response → Reject / alert
   |
   +--> Permanent failure → Escalate
```

Critical distinction: A failed read operation is usually easier to retry than a failed write operation. A write may have succeeded even if the response was lost.

### Messaging Infrastructure — Guarantee controlled delivery

Messaging allows CWD components to communicate asynchronously. Reliability depends on preventing lost work, duplicate processing, and uncontrolled redelivery.

Failure scenarios

* Message broker unavailable.

* Consumer crashes after receiving a message.

* Message is delivered twice.

* Processing takes longer than the visibility timeout.

* Queue grows faster than consumers can process it.

* Poison message repeatedly fails.

Reliability mechanisms

|
Mechanism

|

Purpose

|
| --- | --- |
|

Acknowledgment

|

Confirm successful processing.

|
|

Redelivery

|

Retry messages that were not acknowledged.

|
|

Dead-letter queue

|

Isolate messages that repeatedly fail.

|
|

Idempotent consumers

|

Safely handle duplicate messages.

|
|

Message ordering

|

Preserve order where required.

|
|

Backpressure

|

Prevent consumers from being overwhelmed.

|
|

Retry delay

|

Avoid immediate repeated failures.

|

Example:

```
Queue
  |
  v
Worker receives message
  |
  +--> Success → ACK
  |
  +--> Temporary failure → Retry
  |
  +--> Repeated failure → Dead-letter queue
  |
  +--> Duplicate message → Idempotency check
```

## 6. Retry strategy: The most important concept

A retry policy should answer five questions:

1. What failed?

2. Is the failure transient?

3. How many times should we retry?

4. How long should we wait?

5. What happens if all retries fail?

### Exponential backoff

Instead of retrying immediately, increase the delay between attempts.

dn=min(dmax,d0cdot2n)d_n = min(d_{max}, d_0 cdot 2^n)dn=min(dmax,d0cdot2n)

Example:

|
Attempt

|

Delay

|
| --- | --- |
|

1

|

1 second

|
|

2

|

2 seconds

|
|

3

|

4 seconds

|
|

4

|

8 seconds

|

Add jitter so that many workers do not retry at exactly the same time.

### When NOT to retry

* Invalid authentication.

* Invalid request parameters.

* Unsupported operation.

* Permanent business rule failure.

* Non-idempotent operation without a safe recovery strategy.

## 7. Circuit breaker: Stop cascading failures

A circuit breaker prevents CWD from repeatedly calling an unhealthy dependency.

```
CLOSED
  |
  | Failures exceed threshold
  v
OPEN
  |
  | Wait for recovery period
  v
HALF-OPEN
  |
  +--> Success → CLOSED
  |
  +--> Failure → OPEN
```

Example: If the LLM provider returns repeated timeouts, the circuit breaker opens. New requests are rejected or routed to a fallback instead of creating more load on the failing provider.

## 8. Idempotency: Prevent duplicate side effects

Idempotency means that processing the same request more than once produces the same intended result.

This is essential when retries are used.

### Dangerous example

```
Worker sends payment request
    |
    v
Payment succeeds
    |
    v
Network timeout
    |
    v
Worker retries
    |
    v
Second payment is created
```

### Safe approach

```
Request ID: payment-123

Worker sends payment request
    |
    v
Payment succeeds
    |
    v
Response lost
    |
    v
Worker retries with same idempotency key
    |
    v
Payment service returns existing result
```

Rule: Every side-effecting operation should have a clear idempotency or compensation strategy.

## 9. Recovery patterns

|
Pattern

|

When to use

|
| --- | --- |
|

Retry

|

Temporary failure

|
|

Fallback

|

Primary dependency unavailable

|
|

Resume

|

Workflow interrupted

|
|

Compensation

|

Side effect completed but later step failed

|
|

Dead-letter queue

|

Message repeatedly fails

|
|

Human escalation

|

Automated recovery is unsafe

|
|

Reconciliation

|

System state is uncertain

|
|

Fail fast

|

Permanent or invalid request

|

### Example: Compensation

```
1. Create CRM lead       ✓
2. Send email            ✓
3. Update CRM status     ✗
4. Retry update
5. If still failing:
   - Mark workflow as "needs_reconciliation"
   - Alert operations
   - Retry reconciliation later
```

The system should not assume that a failed response means the operation did not happen.

## 10. Observability & failure detection

Reliability cannot be managed without visibility.

CWD dashboards should track:

* Request success and failure rates.

* Latency and timeout rates.

* Worker availability.

* Queue depth and message age.

* LLM error rates and token usage.

* Tool failure rates.

* Retry counts.

* Circuit breaker state.

* Dead-letter queue size.

* Workflow recovery status.

### Example alert rules

```
IF LLM timeout rate > 10%
    → Alert + consider fallback

IF queue depth continuously increases
    → Alert + investigate consumer capacity

IF worker failure rate > threshold
    → Isolate worker + route tasks elsewhere

IF dead-letter queue grows
    → Alert operations + inspect failed messages
```

## 11. End-to-end failure scenario

### Scenario: Customer Support Agent

```
User asks:
"Where is my order?"
        |
        v
Gateway
        |
        v
Coordinator
        |
        v
Delegator
        |
        v
Order Worker
        |
        v
CRM / Order API
        |
        X
    API timeout
        |
        v
Retry with backoff
        |
        X
    API still unavailable
        |
        v
Circuit breaker opens
        |
        v
Fallback: cached order status
        |
        v
If no reliable fallback:
    Escalate to human support
        |
        v
Return controlled response
```

What the user should experience: A useful response or a clear explanation that the request could not be completed—not an unexplained crash or an infinite wait.

## 12. Advanced learning roadmap — 60 minutes

Suggested study plan

0–10 min

Foundations

Understand transient vs permanent failures, timeouts, retries, and failure boundaries.

10–25 min

Architecture

Study how Gateway, Coordinator, Delegator, and Workers isolate failures.

25–40 min

Advanced patterns

Learn circuit breakers, idempotency, backpressure, dead-letter queues, and compensation.

40–50 min

Implementation

Design retry policies, checkpointing, and recovery workflows.

50–60 min

Architecture review

Explain one complete failure scenario and how CWD detects, isolates, retries, and recovers.

## 13. Interview-ready explanation

> Reliability & Failure Handling in CWD is the capability that ensures failures in the Gateway, Coordinator, Delegator, Workers, LLMs, tools, data sources, and messaging infrastructure are detected, isolated, and recovered without causing uncontrolled system-wide outages. CWD uses timeouts, retries with exponential backoff, circuit breakers, checkpointing, idempotency, dead-letter queues, fallback mechanisms, and compensation workflows. The Coordinator preserves execution state, the Delegator isolates worker failures, Workers handle local errors, and observability provides visibility into failures, retries, latency, and recovery status. The goal is to build an agentic system that is resilient, recoverable, and operationally reliable in production.

## 14. Practical exercise

Design a failure-handling strategy for this workflow:

```
User → Gateway → Coordinator → Delegator
     → Order Worker → CRM Tool → LLM → Response
```

Answer these questions:

1. What happens if the Gateway times out?

2. What happens if the Coordinator crashes?

3. What happens if the Order Worker fails?

4. What happens if the CRM API returns `503`?

5. What happens if the LLM returns invalid JSON?

6. What happens if the CRM update succeeds but the response is lost?

7. What happens if the same message is delivered twice?

8. What happens if all retries fail?

9. What metrics and alerts should operations see?

10. How does the workflow recover without duplicating side effects?

The main takeaway: Reliability is not just “retry on error.” It is designing every component and workflow step so that failure is expected, controlled, observable, and recoverable.
