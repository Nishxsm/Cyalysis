from utils.http_utils import make_request
from utils.cookie_utils import parse_cookies


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Cookie Enumeration",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    cookies = parse_cookies(result["response"])

    return {
        "name": "Cookie Enumeration",
        "status": "passed",
        "severity": "info",
        "evidence": f"Detected {len(cookies)} cookie(s).",
        "data": {
            "count": len(cookies),
            "cookies": cookies
        }
    }