from utils.http_utils import make_request


def run(target):
    if target.startswith("https://"):
        http_url = target.replace("https://", "http://", 1)
    else:
        http_url = target

    result = make_request(http_url, allow_redirects=False)

    if not result["success"]:
        return {
            "name": "HTTPS Enforcement Check",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    location = response.headers.get("Location", "")

    if response.status_code in (301, 302, 303, 307, 308):
        if location.lower().startswith("https://"):
            return {
                "name": "HTTPS Enforcement Check",
                "status": "passed",
                "severity": "info",
                "evidence": "HTTP redirects to HTTPS.",
                "data": {
                    "status_code": response.status_code,
                    "location": location
                }
            }

    return {
        "name": "HTTPS Enforcement Check",
        "status": "review",
        "severity": "medium",
        "evidence": "HTTP does not appear to redirect directly to HTTPS.",
        "data": {
            "status_code": response.status_code,
            "location": location
        }
    }