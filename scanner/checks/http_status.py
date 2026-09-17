from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "HTTP Status Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    return {
        "name": "HTTP Status Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": f"Target returned HTTP status {response.status_code}.",
        "data": {
            "status_code": response.status_code,
            "reason": response.reason
        }
    }