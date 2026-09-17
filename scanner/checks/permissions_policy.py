from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Permissions Policy Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    policy = response.headers.get("Permissions-Policy")

    if not policy:
        return {
            "name": "Permissions Policy Analysis",
            "status": "review",
            "severity": "low",
            "evidence": "Permissions-Policy header was not present.",
            "data": {
                "present": False
            }
        }

    return {
        "name": "Permissions Policy Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": "Permissions-Policy header is present.",
        "data": {
            "present": True,
            "policy": policy
        }
    }