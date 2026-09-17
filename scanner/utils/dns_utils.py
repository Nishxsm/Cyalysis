import dns.resolver


def query_records(domain, record_type):
    try:
        answers = dns.resolver.resolve(domain, record_type)

        records = [str(answer) for answer in answers]

        return {
            "success": True,
            "records": records
        }

    except dns.resolver.NoAnswer:
        return {
            "success": True,
            "records": []
        }

    except dns.resolver.NXDOMAIN:
        return {
            "success": False,
            "records": [],
            "error": "Domain does not exist."
        }

    except dns.resolver.NoNameservers:
        return {
            "success": False,
            "records": [],
            "error": "No authoritative nameservers available."
        }

    except dns.exception.Timeout:
        return {
            "success": False,
            "records": [],
            "error": "DNS query timed out."
        }

    except Exception as error:
        return {
            "success": False,
            "records": [],
            "error": str(error)
        }