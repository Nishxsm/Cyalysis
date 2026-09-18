from utils.method_utils import send_method, get_allowed_methods


STANDARD_METHODS = {
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "OPTIONS"
}


def run(target):
    result = send_method(target, "OPTIONS")

    if not result["success"]:
        return {
            "name": "Method Restriction",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    methods = get_allowed_methods(response)

    if not methods:
        return {
            "name": "Method Restriction",
            "status": "review",
            "severity": "info",
            "evidence": (
                "Server did not advertise an Allow header; "
                "method restrictions could not be determined."
            ),
            "data": {
                "methods": []
            }
        }

    unusual_methods = [
        method
        for method in methods
        if method not in STANDARD_METHODS
    ]

    if unusual_methods:
        return {
            "name": "Method Restriction",
            "status": "review",
            "severity": "low",
            "evidence": (
                f"Server advertises methods outside the standard "
                f"HTTP method set: {', '.join(unusual_methods)}."
            ),
            "data": {
                "methods": methods,
                "unusual_methods": unusual_methods
            }
        }

    return {
        "name": "Method Restriction",
        "status": "passed",
        "severity": "info",
        "evidence": (
            "Advertised HTTP methods are within the expected "
            "standard method set."
        ),
        "data": {
            "methods": methods,
            "unusual_methods": []
        }
    }