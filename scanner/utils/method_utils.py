import requests

from utils.http_utils import DEFAULT_HEADERS, DEFAULT_TIMEOUT


def send_method(target, method):
    try:
        response = requests.request(
            method,
            target,
            headers=DEFAULT_HEADERS,
            timeout=DEFAULT_TIMEOUT,
            allow_redirects=False
        )

        return {
            "success": True,
            "response": response
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "HTTP method request timed out."
        }

    except requests.exceptions.SSLError:
        return {
            "success": False,
            "error": "SSL/TLS verification failed."
        }

    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "error": "Unable to establish connection."
        }

    except requests.exceptions.RequestException as error:
        return {
            "success": False,
            "error": str(error)
        }


def get_allowed_methods(response):
    allow_header = response.headers.get("Allow")

    if not allow_header:
        return []

    return [
        method.strip().upper()
        for method in allow_header.split(",")
        if method.strip()
    ]