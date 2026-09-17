from utils.http_utils import make_request
from utils.cookie_utils import parse_cookies


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Cookie Expiration Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    cookies = parse_cookies(result["response"])

    if not cookies:
        return {
            "name": "Cookie Expiration Analysis",
            "status": "review",
            "severity": "info",
            "evidence": "No cookies were returned by the target.",
            "data": {
                "cookies": []
            }
        }

    session_cookies = []
    persistent_cookies = []

    for cookie in cookies:
        if cookie["expires"] or cookie["max_age"]:
            persistent_cookies.append(cookie["name"])
        else:
            session_cookies.append(cookie["name"])

    return {
        "name": "Cookie Expiration Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"Identified {len(persistent_cookies)} persistent "
            f"and {len(session_cookies)} session cookie(s)."
        ),
        "data": {
            "persistent_cookies": persistent_cookies,
            "session_cookies": session_cookies
        }
    }