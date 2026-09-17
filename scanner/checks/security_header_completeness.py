from utils.http_utils import make_request


SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy"
]


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Security Header Completeness",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    present = []
    missing = []

    for header in SECURITY_HEADERS:
        if response.headers.get(header):
            present.append(header)
        else:
            missing.append(header)

    total = len(SECURITY_HEADERS)

    return {
        "name": "Security Header Completeness",
        "status": "passed" if not missing else "review",
        "severity": "info" if not missing else "low",
        "evidence": f"{len(present)} of {total} security headers detected.",
        "data": {
            "total": total,
            "present": present,
            "missing": missing
        }
    }