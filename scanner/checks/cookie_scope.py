from utils.http_utils import make_request
from utils.cookie_utils import parse_cookies


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Cookie Scope Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    cookies = parse_cookies(result["response"])

    if not cookies:
        return {
            "name": "Cookie Scope Analysis",
            "status": "review",
            "severity": "info",
            "evidence": "No cookies were returned by the target.",
            "data": {
                "cookies": []
            }
        }

    scope_data = []

    for cookie in cookies:
        scope_data.append({
            "name": cookie["name"],
            "domain": cookie["domain"],
            "path": cookie["path"]
        })

    return {
        "name": "Cookie Scope Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": "Cookie Domain and Path attributes were examined.",
        "data": {
            "cookies": scope_data
        }
    }