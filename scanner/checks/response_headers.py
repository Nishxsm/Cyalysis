from utils.http_utils import make_request


def sanitize_headers(headers):
    sanitized = {}

    for key, value in headers.items():
        if key.lower() == "set-cookie":
            cookies = []

            # Keep cookie names and security attributes,
            # but never expose the actual cookie values.
            for cookie in value.split(", "):
                parts = cookie.split(";")
                if not parts:
                    continue

                cookie_name = parts[0].split("=", 1)[0].strip()

                attributes = []

                for attribute in parts[1:]:
                    attribute = attribute.strip()

                    if attribute:
                        attributes.append(attribute)

                if cookie_name:
                    sanitized_cookie = cookie_name

                    if attributes:
                        sanitized_cookie += "; " + "; ".join(attributes)

                    cookies.append(sanitized_cookie)

            sanitized[key] = ", ".join(cookies)

        else:
            sanitized[key] = value

    return sanitized


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Response Header Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    headers = sanitize_headers(dict(response.headers))

    return {
        "name": "Response Header Analysis",
        "status": "passed",
        "severity": "info",
        "evidence": f"Received {len(headers)} response headers.",
        "data": {
            "headers": headers
        }
    }