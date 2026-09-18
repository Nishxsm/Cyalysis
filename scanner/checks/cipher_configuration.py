from utils.tls_utils import get_tls_information


def run(target):
    result = get_tls_information(target)

    if not result["success"]:
        return {
            "name": "Cipher Configuration",
            "status": "failed",
            "severity": "high",
            "evidence": result["error"]
        }

    cipher = result["cipher"]

    if not cipher["name"]:
        return {
            "name": "Cipher Configuration",
            "status": "review",
            "severity": "medium",
            "evidence": "Negotiated cipher could not be determined."
        }

    return {
        "name": "Cipher Configuration",
        "status": "passed",
        "severity": "info",
        "evidence": (
            f"Negotiated cipher: {cipher['name']} "
            f"({cipher['protocol']}, {cipher['bits']} bits)."
        ),
        "data": {
            "cipher": cipher
        }
    }