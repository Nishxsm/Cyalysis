from utils.http_utils import make_request
from utils.technology_utils import get_html


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "CMS Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    html = get_html(response).lower()

    detections = []

    # WordPress
    if (
        "/wp-content/" in html
        or "/wp-includes/" in html
        or 'name="generator" content="wordpress' in html
    ):
        detections.append({
            "name": "WordPress",
            "confidence": "high",
            "evidence": "WordPress-specific path or generator marker detected."
        })

    # Drupal
    if (
        "drupalsettings" in html
        or "/sites/default/files/" in html
    ):
        detections.append({
            "name": "Drupal",
            "confidence": "high",
            "evidence": "Drupal-specific marker detected."
        })

    # Joomla
    if (
        "/media/system/" in html
        or "/media/jui/" in html
    ):
        detections.append({
            "name": "Joomla",
            "confidence": "medium",
            "evidence": "Joomla-specific asset path detected."
        })

    if not detections:
        return {
            "name": "CMS Detection",
            "status": "review",
            "severity": "info",
            "evidence": "No supported CMS fingerprint was detected.",
            "data": {
                "cms": []
            }
        }

    return {
        "name": "CMS Detection",
        "status": "passed",
        "severity": "info",
        "evidence": f"Detected {len(detections)} CMS fingerprint(s).",
        "data": {
            "cms": detections
        }
    }