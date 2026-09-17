from utils.http_utils import make_request


def run(target):
    result = make_request(target, allow_redirects=True)

    if not result["success"]:
        return {
            "name": "Redirect Chain Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    chain = []

    for redirect in response.history:
        chain.append({
            "status_code": redirect.status_code,
            "url": redirect.url,
            "location": redirect.headers.get("Location")
        })

    return {
        "name": "Redirect Chain Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": f"Detected {len(chain)} redirect(s).",
        "data": {
            "redirects": chain,
            "final_url": response.url
        }
    }