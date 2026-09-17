from utils.dns_utils import query_records


def run(domain):
    result = query_records(domain, "TXT")

    if not result["success"]:
        return {
            "name": "DNS TXT Record",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    records = result["records"]

    if not records:
        return {
            "name": "DNS TXT Record",
            "status": "passed",
            "severity": "info",
            "evidence": "No TXT records found.",
            "data": {
                "records": []
            }
        }

    return {
        "name": "DNS TXT Record",
        "status": "passed",
        "severity": "info",
        "evidence": f"Found {len(records)} TXT record(s).",
        "data": {
            "records": records
        }
    }