from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "CSP Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    csp = response.headers.get("Content-Security-Policy")

    if not csp:
        return {
            "name": "CSP Analysis",
            "status": "review",
            "severity": "medium",
            "evidence": "Content-Security-Policy header was not present.",
            "data": {
                "present": False
            }
        }

    return {
        "name": "CSP Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": "Content-Security-Policy header is present.",
        "data": {
            "present": True,
            "policy": csp
        }
    }