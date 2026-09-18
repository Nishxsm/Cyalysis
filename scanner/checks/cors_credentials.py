from utils.cors_utils import fetch_cors_information


def run(target):
    result = fetch_cors_information(target)

    if not result["success"]:
        return {
            "name": "CORS Credential Policy",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    credentials = result["headers"][
        "access_control_allow_credentials"
    ]

    if not credentials:
        return {
            "name": "CORS Credential Policy",
            "status": "passed",
            "severity": "info",
            "evidence": (
                "Access-Control-Allow-Credentials header was not present."
            ),
            "data": {
                "credentials_allowed": False
            }
        }

    if credentials.lower() == "true":
        return {
            "name": "CORS Credential Policy",
            "status": "review",
            "severity": "medium",
            "evidence": (
                "CORS requests are configured to allow credentials."
            ),
            "data": {
                "credentials_allowed": True
            }
        }

    return {
        "name": "CORS Credential Policy",
        "status": "review",
        "severity": "low",
        "evidence": (
            f"Unexpected Access-Control-Allow-Credentials value: "
            f"{credentials}"
        ),
        "data": {
            "credentials_allowed": False,
            "value": credentials
        }
    }