import re

from utils.http_utils import make_request
from utils.technology_utils import get_html


ERROR_PATTERNS = [
    r"stack trace",
    r"traceback",
    r"fatal error",
    r"uncaught exception",
    r"sql syntax",
    r"database error",
    r"internal server error",
    r"warning:",
    r"exception in"
]


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Verbose Error Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    html = get_html(response)

    detected = []

    for pattern in ERROR_PATTERNS:
        if re.search(pattern, html, re.IGNORECASE):
            detected.append(pattern)

    if not detected:
        return {
            "name": "Verbose Error Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "No obvious verbose error information was detected.",
            "data": {
                "detected": []
            }
        }

    return {
        "name": "Verbose Error Analysis",
        "status": "review",
        "severity": "medium",
        "evidence": (
            f"Detected {len(detected)} possible verbose error indicator(s)."
        ),
        "data": {
            "detected": detected,
            "status_code": response.status_code
        }
    }