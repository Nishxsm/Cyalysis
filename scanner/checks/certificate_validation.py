from utils.tls_utils import get_tls_information


def run(target):
    result = get_tls_information(target)

    if result["success"]:
        return {
            "name": "Certificate Validation",
            "status": "passed",
            "severity": "info",
            "evidence": "TLS certificate was successfully validated.",
            "data": {
                "valid": True
            }
        }

    return {
        "name": "Certificate Validation",
        "status": "failed",
        "severity": "high",
        "evidence": result["error"],
        "data": {
            "valid": False
        }
    }