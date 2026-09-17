from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Server Banner Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    server = response.headers.get("Server")

    if not server:
        return {
            "name": "Server Banner Detection",
            "status": "passed",
            "severity": "info",
            "evidence": "No Server header was exposed.",
            "data": {
                "server": None
            }
        }

    return {
        "name": "Server Banner Detection",
        "status": "review",
        "severity": "low",
        "evidence": f"Server banner exposed: {server}",
        "data": {
            "server": server
        }
    }