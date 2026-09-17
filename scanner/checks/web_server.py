from utils.http_utils import make_request


SERVER_SIGNATURES = {
    "apache": "Apache",
    "nginx": "Nginx",
    "microsoft-iis": "Microsoft IIS",
    "caddy": "Caddy",
    "lighttpd": "Lighttpd",
    "cloudflare": "Cloudflare"
}


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Web Server Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    server_header = response.headers.get("Server", "")

    if not server_header:
        return {
            "name": "Web Server Detection",
            "status": "review",
            "severity": "info",
            "evidence": "Web server could not be identified.",
            "data": {
                "server": None
            }
        }

    server_lower = server_header.lower()

    for signature, server_name in SERVER_SIGNATURES.items():
        if signature in server_lower:
            return {
                "name": "Web Server Detection",
                "status": "passed",
                "severity": "info",
                "evidence": f"Detected web server: {server_name}.",
                "data": {
                    "server": server_name,
                    "evidence": {
                        "header": "Server",
                        "value": server_header
                    }
                }
            }

    return {
        "name": "Web Server Detection",
        "status": "passed",
        "severity": "info",
        "evidence": f"Server identified from response: {server_header}.",
        "data": {
            "server": server_header,
            "evidence": {
                "header": "Server",
                "value": server_header
            }
        }
    }