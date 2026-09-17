from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Response Header Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    headers = dict(response.headers)

    return {
        "name": "Response Header Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": f"Received {len(headers)} response headers.",
        "data": {
            "headers": headers
        }
    }