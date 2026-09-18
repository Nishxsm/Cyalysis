import re

from utils.http_utils import make_request
from utils.technology_utils import get_html


DEBUG_PATTERNS = [
    r"debug\s*=\s*true",
    r"debug\s*mode",
    r"stack\s*trace",
    r"traceback",
    r"exception\s*trace",
    r"development\s*mode"
]


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Debug Information Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    html = get_html(result["response"])

    detected = []

    for pattern in DEBUG_PATTERNS:
        if re.search(pattern, html, re.IGNORECASE):
            detected.append(pattern)

    if not detected:
        return {
            "name": "Debug Information Detection",
            "status": "passed",
            "severity": "info",
            "evidence": "No obvious debug information was detected.",
            "data": {
                "detected": []
            }
        }

    return {
        "name": "Debug Information Detection",
        "status": "review",
        "severity": "medium",
        "evidence": (
            f"Detected {len(detected)} possible debug indicator(s)."
        ),
        "data": {
            "detected": detected
        }
    }