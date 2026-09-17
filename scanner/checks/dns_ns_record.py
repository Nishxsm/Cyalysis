from utils.dns_utils import query_records


def run(domain):
    result = query_records(domain, "NS")

    if not result["success"]:
        return {
            "name": "DNS NS Record",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    records = result["records"]

    if not records:
        return {
            "name": "DNS NS Record",
            "status": "passed",
            "severity": "info",
            "evidence": "No NS records found.",
            "data": {
                "records": []
            }
        }

    return {
        "name": "DNS NS Record",
        "status": "passed",
        "severity": "info",
        "evidence": f"Found NS records: {', '.join(records)}",
        "data": {
            "records": records
        }
    }