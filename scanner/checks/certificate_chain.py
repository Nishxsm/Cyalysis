from utils.tls_utils import get_tls_information


def run(target):
    result = get_tls_information(target)

    if not result["success"]:
        return {
            "name": "Certificate Chain",
            "status": "failed",
            "severity": "high",
            "evidence": result["error"]
        }

    certificate = result["certificate"]

    issuer = certificate.get("issuer")
    subject = certificate.get("subject")

    if not issuer:
        return {
            "name": "Certificate Chain",
            "status": "review",
            "severity": "medium",
            "evidence": "Certificate issuer information was not available.",
            "data": {
                "subject": subject,
                "issuer": None
            }
        }

    return {
        "name": "Certificate Chain",
        "status": "passed",
        "severity": "info",
        "evidence": "Certificate issuer information was successfully obtained.",
        "data": {
            "subject": subject,
            "issuer": issuer
        }
    }