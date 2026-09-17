from utils.http_utils import make_request


def run(target):
    if target.startswith("https://"):
        https_url = target
    else:
        https_url = target.replace("http://", "https://", 1)

    result = make_request(https_url)

    if not result["success"]:
        return {
            "name": "HTTPS Availability Check",
            "status": "failed",
            "severity": "medium",
            "evidence": "HTTPS is not available or could not be reached.",
            "data": {
                "https_url": https_url
            }
        }

    response = result["response"]

    return {
        "name": "HTTPS Availability Check",
        "status": "passed",
        "severity": "info",
        "evidence": "HTTPS is available.",
        "data": {
            "https_url": https_url,
            "status_code": response.status_code
        }
    }