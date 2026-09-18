from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

from utils.tls_utils import get_tls_information


def run(target):
    result = get_tls_information(target)

    if not result["success"]:
        return {
            "name": "Certificate Expiration",
            "status": "failed",
            "severity": "high",
            "evidence": result["error"]
        }

    certificate = result["certificate"]

    not_before = certificate.get("notBefore")
    not_after = certificate.get("notAfter")

    if not_after:
        try:
            expiration = parsedate_to_datetime(not_after)

            if expiration.tzinfo is None:
                expiration = expiration.replace(tzinfo=timezone.utc)

            now = datetime.now(timezone.utc)

            if expiration <= now:
                return {
                    "name": "Certificate Expiration",
                    "status": "failed",
                    "severity": "high",
                    "evidence": "TLS certificate has expired.",
                    "data": {
                        "not_after": not_after,
                        "expired": True
                    }
                }

            return {
                "name": "Certificate Expiration",
                "status": "passed",
                "severity": "info",
                "evidence": "TLS certificate has not expired.",
                "data": {
                    "not_before": not_before,
                    "not_after": not_after,
                    "expired": False
                }
            }

        except (TypeError, ValueError):
            pass

    return {
        "name": "Certificate Expiration",
        "status": "review",
        "severity": "medium",
        "evidence": "Certificate expiration information could not be parsed.",
        "data": {
            "not_before": not_before,
            "not_after": not_after
        }
    }