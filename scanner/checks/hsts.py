from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "HSTS Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    hsts = response.headers.get("Strict-Transport-Security")

    if not hsts:
        return {
            "name": "HSTS Analysis",
            "status": "review",
            "severity": "medium",
            "evidence": "Strict-Transport-Security header was not present.",
            "data": {
                "present": False
            }
        }

    return {
        "name": "HSTS Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": "Strict-Transport-Security header is present.",
        "data": {
            "present": True,
            "policy": hsts
        }
    }