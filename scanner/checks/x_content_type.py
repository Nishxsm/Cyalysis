from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "X-Content-Type Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    value = response.headers.get("X-Content-Type-Options")

    if not value:
        return {
            "name": "X-Content-Type Analysis",
            "status": "review",
            "severity": "low",
            "evidence": "X-Content-Type-Options header was not present.",
            "data": {
                "present": False
            }
        }

    normalized = value.strip().lower()

    if normalized == "nosniff":
        return {
            "name": "X-Content-Type Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "X-Content-Type-Options is configured as nosniff.",
            "data": {
                "present": True,
                "value": value
            }
        }

    return {
        "name": "X-Content-Type Analysis",
        "status": "review",
        "severity": "low",
        "evidence": f"X-Content-Type-Options is present with value: {value}.",
        "data": {
            "present": True,
            "value": value
        }
    }