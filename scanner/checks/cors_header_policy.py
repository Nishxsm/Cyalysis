from utils.cors_utils import fetch_cors_information


def run(target):
    result = fetch_cors_information(target)

    if not result["success"]:
        return {
            "name": "CORS Header Policy",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    headers = result["headers"]

    present_headers = [
        name
        for name, value in headers.items()
        if value is not None
    ]

    if not present_headers:
        return {
            "name": "CORS Header Policy",
            "status": "passed",
            "severity": "info",
            "evidence": "No CORS response headers were detected.",
            "data": {
                "present": []
            }
        }

    return {
        "name": "CORS Header Policy",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"Detected {len(present_headers)} CORS response header(s)."
        ),
        "data": {
            "present": present_headers
        }
    }