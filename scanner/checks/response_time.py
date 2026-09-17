from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Response Time Measurement",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response_time = result["response_time"]

    return {
        "name": "Response Time Measurement",
        "status": "passed",
        "severity": "info",
        "evidence": f"Response received in {response_time} ms.",
        "data": {
            "response_time_ms": response_time
        }
    }