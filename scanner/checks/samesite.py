from utils.http_utils import make_request
from utils.cookie_utils import parse_cookies


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "SameSite Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    cookies = parse_cookies(result["response"])

    if not cookies:
        return {
            "name": "SameSite Analysis",
            "status": "review",
            "severity": "info",
            "evidence": "No cookies were returned by the target.",
            "data": {
                "cookies": []
            }
        }

    missing_samesite = [
        cookie["name"]
        for cookie in cookies
        if not cookie["samesite"]
    ]

    if not missing_samesite:
        return {
            "name": "SameSite Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "All detected cookies specify SameSite.",
            "data": {
                "cookies": cookies
            }
        }

    return {
        "name": "SameSite Analysis",
        "status": "review",
        "severity": "low",
        "evidence": (
            f"{len(missing_samesite)} cookie(s) do not specify SameSite."
        ),
        "data": {
            "missing_samesite": missing_samesite,
            "cookies": cookies
        }
    }