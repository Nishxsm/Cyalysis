from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Content-Type Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    content_type = response.headers.get("Content-Type")

    if not content_type:
        return {
            "name": "Content-Type Analysis",
            "status": "review",
            "severity": "low",
            "evidence": "No Content-Type header was returned.",
            "data": {
                "content_type": None
            }
        }

    return {
        "name": "Content-Type Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": f"Content-Type: {content_type}",
        "data": {
            "content_type": content_type
        }
    }