from utils.cors_utils import fetch_cors_information


def run(target):
    result = fetch_cors_information(target)

    if not result["success"]:
        return {
            "name": "CORS Origin Policy",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    origin = result["headers"]["access_control_allow_origin"]

    if not origin:
        return {
            "name": "CORS Origin Policy",
            "status": "passed",
            "severity": "info",
            "evidence": "No cross-origin origin policy was exposed.",
            "data": {
                "origin": None
            }
        }

    if origin == "*":
        return {
            "name": "CORS Origin Policy",
            "status": "review",
            "severity": "medium",
            "evidence": (
                "Access-Control-Allow-Origin permits all origins."
            ),
            "data": {
                "origin": origin,
                "wildcard": True
            }
        }

    return {
        "name": "CORS Origin Policy",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"CORS policy specifies the origin: {origin}"
        ),
        "data": {
            "origin": origin,
            "wildcard": False
        }
    }