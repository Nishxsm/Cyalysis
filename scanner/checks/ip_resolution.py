import socket


def run(domain):
    try:
        addresses = socket.getaddrinfo(
            domain,
            None,
            socket.AF_UNSPEC,
            socket.SOCK_STREAM
        )

        ips = sorted({
            address[4][0]
            for address in addresses
        })

        if not ips:
            return {
                "name": "IP Resolution",
                "status": "failed",
                "severity": "high",
                "evidence": "No IP addresses were resolved."
            }

        return {
            "name": "IP Resolution",
            "status": "passed",
            "severity": "info",
            "evidence": f"Resolved IP addresses: {', '.join(ips)}",
            "data": {
                "ips": ips
            }
        }

    except socket.gaierror:
        return {
            "name": "IP Resolution",
            "status": "failed",
            "severity": "high",
            "evidence": "Unable to resolve target IP address."
        }