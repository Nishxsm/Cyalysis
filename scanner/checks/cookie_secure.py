from utils.http_utils import make_request
from utils.cookie_utils import parse_cookies


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Secure Flag Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    cookies = parse_cookies(result["response"])

    if not cookies:
        return {
            "name": "Secure Flag Analysis",
            "status": "review",
            "severity": "info",
            "evidence": "No cookies were returned by the target.",
            "data": {
                "cookies": []
            }
        }

    missing_secure = [
        cookie["name"]
        for cookie in cookies
        if not cookie["secure"]
    ]

    if not missing_secure:
        return {
            "name": "Secure Flag Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "All detected cookies have the Secure flag.",
            "data": {
                "cookies": cookies
            }
        }

    return {
        "name": "Secure Flag Analysis",
        "status": "review",
        "severity": "medium",
        "evidence": (
            f"{len(missing_secure)} cookie(s) do not have the Secure flag."
        ),
        "data": {
            "missing_secure": missing_secure,
            "cookies": cookies
        }
    }