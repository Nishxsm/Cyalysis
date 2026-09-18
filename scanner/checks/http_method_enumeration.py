from utils.method_utils import send_method, get_allowed_methods


def run(target):
    result = send_method(target, "OPTIONS")

    if not result["success"]:
        return {
            "name": "HTTP Method Enumeration",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    methods = get_allowed_methods(response)

    if not methods:
        return {
            "name": "HTTP Method Enumeration",
            "status": "review",
            "severity": "info",
            "evidence": (
                "No Allow header was returned during HTTP method enumeration."
            ),
            "data": {
                "methods": []
            }
        }

    return {
        "name": "HTTP Method Enumeration",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"Server advertised {len(methods)} HTTP method(s)."
        ),
        "data": {
            "methods": methods
        }
    }