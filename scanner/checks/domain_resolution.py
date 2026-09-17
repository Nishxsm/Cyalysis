import socket


def run(domain):
    try:
        socket.gethostbyname(domain)

        return {
            "name": "Domain Resolution",
            "status": "passed",
            "severity": "info",
            "evidence": f"Domain {domain} resolved successfully."
        }

    except socket.gaierror:
        return {
            "name": "Domain Resolution",
            "status": "failed",
            "severity": "high",
            "evidence": f"Unable to resolve domain {domain}."
        }