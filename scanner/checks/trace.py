from utils.method_utils import send_method


def run(target):
    result = send_method(target, "TRACE")

    if not result["success"]:
        return {
            "name": "TRACE Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    if response.status_code < 400:
        return {
            "name": "TRACE Analysis",
            "status": "review",
            "severity": "medium",
            "evidence": (
                f"TRACE method received HTTP {response.status_code}; "
                "the method appears to be enabled."
            ),
            "data": {
                "status_code": response.status_code,
                "enabled": True
            }
        }

    return {
        "name": "TRACE Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"TRACE method was not accepted; server returned "
            f"HTTP {response.status_code}."
        ),
        "data": {
            "status_code": response.status_code,
            "enabled": False
        }
    }