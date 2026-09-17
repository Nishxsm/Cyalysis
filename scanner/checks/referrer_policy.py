from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Referrer Policy Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    policy = response.headers.get("Referrer-Policy")

    if not policy:
        return {
            "name": "Referrer Policy Analysis",
            "status": "review",
            "severity": "low",
            "evidence": "Referrer-Policy header was not present.",
            "data": {
                "present": False
            }
        }

    return {
        "name": "Referrer Policy Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": f"Referrer-Policy is configured as: {policy}.",
        "data": {
            "present": True,
            "policy": policy
        }
    }