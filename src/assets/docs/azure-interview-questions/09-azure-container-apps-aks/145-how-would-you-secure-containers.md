# How would you secure containers?

## Short answer
Secure containers from image to runtime.

## Key points
- Minimal base images, non-root, vulnerability scanning (Defender, ACR).
- Private ACR with managed identity pull; no secrets in images.
- Network isolation, egress control, resource limits, patching.
- Signed images and admission policies on AKS.

## CWD context
Build once, scan, sign, then promote the same image.
