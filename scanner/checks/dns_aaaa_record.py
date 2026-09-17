from utils.dns_utils import query_records


def run(domain):
    result = query_records(domain, "AAAA")

    if not result["success"]:
        return {
            "name": "DNS AAAA Record",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    records = result["records"]

    if not records:
        return {
            "name": "DNS AAAA Record",
            "status": "passed",
            "severity": "info",
            "evidence": "No AAAA records found.",
            "data": {
                "records": []
            }
        }

    return {
        "name": "DNS AAAA Record",
        "status": "passed",
        "severity": "info",
        "evidence": f"Found AAAA records: {', '.join(records)}",
        "data": {
            "records": records
        }
    }