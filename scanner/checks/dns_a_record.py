from utils.dns_utils import query_records


def run(domain):
    result = query_records(domain, "A")

    if not result["success"]:
        return {
            "name": "DNS A Record",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    records = result["records"]

    if not records:
        return {
            "name": "DNS A Record",
            "status": "passed",
            "severity": "info",
            "evidence": "No A records found.",
            "data": {
                "records": []
            }
        }

    return {
        "name": "DNS A Record",
        "status": "passed",
        "severity": "info",
        "evidence": f"Found A records: {', '.join(records)}",
        "data": {
            "records": records
        }
    }