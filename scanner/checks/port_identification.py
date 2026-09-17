from urllib.parse import urlparse


def run(target):
    parsed = urlparse(target)

    if parsed.scheme == "https":
        ports = [443]

    elif parsed.scheme == "http":
        ports = [80]

    else:
        return {
            "name": "Port Identification",
            "status": "failed",
            "severity": "medium",
            "evidence": "Unable to determine HTTP/HTTPS service port."
        }

    return {
        "name": "Port Identification",
        "status": "passed",
        "severity": "info",
        "evidence": f"Expected {parsed.scheme.upper()} service port: {ports[0]}",
        "data": {
            "protocol": parsed.scheme.upper(),
            "ports": ports
        }
    }