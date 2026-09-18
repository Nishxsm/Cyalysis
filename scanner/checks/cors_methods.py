from utils.cors_utils import fetch_cors_information


def run(target):
    result = fetch_cors_information(target)

    if not result["success"]:
        return {
            "name": "CORS Method Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    methods = result["headers"]["access_control_allow_methods"]

    if not methods:
        return {
            "name": "CORS Method Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": (
                "Access-Control-Allow-Methods header was not present."
            ),
            "data": {
                "methods": []
            }
        }

    method_list = [
        method.strip().upper()
        for method in methods.split(",")
        if method.strip()
    ]

    return {
        "name": "CORS Method Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"CORS allows {len(method_list)} HTTP method(s)."
        ),
        "data": {
            "methods": method_list
        }
    }