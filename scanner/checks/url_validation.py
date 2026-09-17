from urllib.parse import urlparse


def run(target):
    parsed = urlparse(target)

    if parsed.scheme not in ("http", "https"):
        return {
            "name": "URL Validation",
            "status": "failed",
            "severity": "high",
            "evidence": "URL must use HTTP or HTTPS."
        }

    if not parsed.hostname:
        return {
            "name": "URL Validation",
            "status": "failed",
            "severity": "high",
            "evidence": "Target hostname is missing."
        }

    return {
        "name": "URL Validation",
        "status": "passed",
        "severity": "info",
        "evidence": "Target URL is syntactically valid."
    }