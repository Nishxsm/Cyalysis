import re

from utils.http_utils import make_request
from utils.technology_utils import get_html


METADATA_PATTERNS = {
    "generator": r'<meta[^>]+name=["\']generator["\'][^>]*>',
    "generator_content": r'<meta[^>]+content=["\'][^"\']*(?:wordpress|drupal|joomla)[^"\']*["\']',
    "author": r'<meta[^>]+name=["\']author["\'][^>]*>',
}


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Metadata Disclosure Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    html = get_html(result["response"])

    detected = []

    for name, pattern in METADATA_PATTERNS.items():
        if re.search(pattern, html, re.IGNORECASE):
            detected.append(name)

    if not detected:
        return {
            "name": "Metadata Disclosure Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": (
                "No notable metadata disclosure indicators were detected."
            ),
            "data": {
                "detected": []
            }
        }

    return {
        "name": "Metadata Disclosure Analysis",
        "status": "review",
        "severity": "low",
        "evidence": (
            f"Detected {len(detected)} metadata disclosure indicator(s)."
        ),
        "data": {
            "detected": detected
        }
    }