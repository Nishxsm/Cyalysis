from utils.method_utils import send_method


UNSUPPORTED_METHOD = "CYALYSIS_TEST"


def run(target):
    result = send_method(target, UNSUPPORTED_METHOD)

    if not result["success"]:
        return {
            "name": "Unsupported Method Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    if 400 <= response.status_code < 500:
        return {
            "name": "Unsupported Method Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": (
                f"Server rejected the unsupported HTTP method "
                f"with status {response.status_code}."
            ),
            "data": {
                "method": UNSUPPORTED_METHOD,
                "status_code": response.status_code,
                "rejected": True
            }
        }

    if response.status_code >= 500:
        return {
            "name": "Unsupported Method Analysis",
            "status": "review",
            "severity": "medium",
            "evidence": (
                f"Unsupported HTTP method caused a server-side "
                f"error: HTTP {response.status_code}."
            ),
            "data": {
                "method": UNSUPPORTED_METHOD,
                "status_code": response.status_code,
                "rejected": False
            }
        }

    return {
        "name": "Unsupported Method Analysis",
        "status": "review",
        "severity": "low",
        "evidence": (
            f"Server returned HTTP {response.status_code} "
            f"for the unsupported HTTP method."
        ),
        "data": {
            "method": UNSUPPORTED_METHOD,
            "status_code": response.status_code,
            "rejected": False
        }
    }