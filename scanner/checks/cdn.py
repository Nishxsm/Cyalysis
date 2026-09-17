from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "CDN Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    headers = {
        key.lower(): value.lower()
        for key, value in response.headers.items()
    }

    detections = []

    # Cloudflare
    if (
        "cf-ray" in headers
        or "cf-cache-status" in headers
        or "server" in headers
        and "cloudflare" in headers["server"]
    ):
        detections.append({
            "name": "Cloudflare",
            "confidence": "high",
            "evidence": "Cloudflare-specific response headers detected."
        })

    # Fastly
    if (
        "fastly" in headers.get("via", "")
        or "fastly" in headers.get("x-served-by", "")
    ):
        detections.append({
            "name": "Fastly",
            "confidence": "medium",
            "evidence": "Fastly-related response header detected."
        })

    # Amazon CloudFront
    if (
        "x-amz-cf-id" in headers
        or "x-amz-cf-pop" in headers
    ):
        detections.append({
            "name": "Amazon CloudFront",
            "confidence": "high",
            "evidence": "CloudFront-specific response headers detected."
        })

    if not detections:
        return {
            "name": "CDN Detection",
            "status": "review",
            "severity": "info",
            "evidence": "No supported CDN fingerprint was detected.",
            "data": {
                "cdn": []
            }
        }

    return {
        "name": "CDN Detection",
        "status": "passed",
        "severity": "info",
        "evidence": f"Detected {len(detections)} CDN/proxy fingerprint(s).",
        "data": {
            "cdn": detections
        }
    }