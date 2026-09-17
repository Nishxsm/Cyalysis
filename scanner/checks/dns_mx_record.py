import dns.resolver


def run(domain):
    try:
        answers = dns.resolver.resolve(domain, "MX")

        records = [
            {
                "priority": answer.preference,
                "mail_server": str(answer.exchange)
            }
            for answer in answers
        ]

        return {
            "name": "DNS MX Record",
            "status": "passed",
            "severity": "info",
            "evidence": f"Found {len(records)} MX record(s).",
            "data": {
                "records": records
            }
        }

    except dns.resolver.NoAnswer:
        return {
            "name": "DNS MX Record",
            "status": "passed",
            "severity": "info",
            "evidence": "No MX records found.",
            "data": {
                "records": []
            }
        }

    except Exception as error:
        return {
            "name": "DNS MX Record",
            "status": "failed",
            "severity": "medium",
            "evidence": str(error)
        }