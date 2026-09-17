from utils.http_utils import make_request
from utils.cookie_utils import parse_cookies


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "HttpOnly Flag Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    cookies = parse_cookies(result["response"])

    if not cookies:
        return {
            "name": "HttpOnly Flag Analysis",
            "status": "review",
            "severity": "info",
            "evidence": "No cookies were returned by the target.",
            "data": {
                "cookies": []
            }
        }

    missing_httponly = [
        cookie["name"]
        for cookie in cookies
        if not cookie["httponly"]
    ]

    if not missing_httponly:
        return {
            "name": "HttpOnly Flag Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "All detected cookies have the HttpOnly flag.",
            "data": {
                "cookies": cookies
            }
        }

    return {
        "name": "HttpOnly Flag Analysis",
        "status": "review",
        "severity": "low",
        "evidence": (
            f"{len(missing_httponly)} cookie(s) do not have the HttpOnly flag."
        ),
        "data": {
            "missing_httponly": missing_httponly,
            "cookies": cookies
        }
    }