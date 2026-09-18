from utils.cors_utils import fetch_cors_information


def run(target):
    result = fetch_cors_information(target)

    if not result["success"]:
        return {
            "name": "CORS Header Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    origin = result["headers"]["access_control_allow_origin"]

    if not origin:
        return {
            "name": "CORS Header Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "Access-Control-Allow-Origin header was not present.",
            "data": {
                "present": False
            }
        }

    return {
        "name": "CORS Header Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"Access-Control-Allow-Origin header detected: {origin}"
        ),
        "data": {
            "present": True,
            "origin": origin
        }
    }