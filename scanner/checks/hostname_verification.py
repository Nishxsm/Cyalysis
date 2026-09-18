from utils.tls_utils import get_tls_information


def run(target):
    result = get_tls_information(target)

    if result["success"]:
        return {
            "name": "Hostname Verification",
            "status": "passed",
            "severity": "info",
            "evidence": (
                f"TLS certificate successfully verified for "
                f"{result['hostname']}."
            ),
            "data": {
                "hostname": result["hostname"],
                "verified": True
            }
        }

    return {
        "name": "Hostname Verification",
        "status": "failed",
        "severity": "high",
        "evidence": result["error"],
        "data": {
            "verified": False
        }
    }