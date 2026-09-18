from utils.tls_utils import get_tls_information


def run(target):
    result = get_tls_information(target)

    if not result["success"]:
        return {
            "name": "TLS Version",
            "status": "failed",
            "severity": "high",
            "evidence": result["error"]
        }

    version = result["tls_version"]

    if not version:
        return {
            "name": "TLS Version",
            "status": "review",
            "severity": "medium",
            "evidence": "TLS version could not be determined."
        }

    return {
        "name": "TLS Version",
        "status": "passed",
        "severity": "info",
        "evidence": f"Negotiated TLS version: {version}.",
        "data": {
            "version": version
        }
    }