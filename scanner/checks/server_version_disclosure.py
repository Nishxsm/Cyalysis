from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Server Version Disclosure",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    server = result["response"].headers.get("Server")

    if not server:
        return {
            "name": "Server Version Disclosure",
            "status": "passed",
            "severity": "info",
            "evidence": "No Server version information was exposed.",
            "data": {
                "server": None,
                "version_exposed": False
            }
        }

    import re

    version_pattern = r"\b\d+(?:\.\d+)+\b"
    match = re.search(version_pattern, server)

    if match:
        return {
            "name": "Server Version Disclosure",
            "status": "review",
            "severity": "low",
            "evidence": "Server header exposes version information.",
            "data": {
                "server": server,
                "version_exposed": True,
                "version": match.group(0)
            }
        }

    return {
        "name": "Server Version Disclosure",
        "status": "passed",
        "severity": "info",
        "evidence": "Server header is present but no version number was detected.",
        "data": {
            "server": server,
            "version_exposed": False
        }
    }