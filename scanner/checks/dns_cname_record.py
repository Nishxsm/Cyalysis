from utils.dns_utils import query_records


def run(domain):
    result = query_records(domain, "CNAME")

    if not result["success"]:
        return {
            "name": "DNS CNAME Record",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    records = result["records"]

    if not records:
        return {
            "name": "DNS CNAME Record",
            "status": "passed",
            "severity": "info",
            "evidence": "No CNAME records found.",
            "data": {
                "records": []
            }
        }

    return {
        "name": "DNS CNAME Record",
        "status": "passed",
        "severity": "info",
        "evidence": f"Found CNAME records: {', '.join(records)}",
        "data": {
            "records": records
        }
    }