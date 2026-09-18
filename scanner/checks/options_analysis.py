from utils.method_utils import send_method, get_allowed_methods


def run(target):
    result = send_method(target, "OPTIONS")

    if not result["success"]:
        return {
            "name": "OPTIONS Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    methods = get_allowed_methods(response)

    return {
        "name": "OPTIONS Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"OPTIONS returned HTTP {response.status_code}."
        ),
        "data": {
            "status_code": response.status_code,
            "allow": methods,
            "allow_header_present": bool(methods)
        }
    }
