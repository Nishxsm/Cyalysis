import time
import requests


DEFAULT_TIMEOUT = 10

DEFAULT_HEADERS = {
    "User-Agent": "CYALYSIS-Security-Scanner/1.0"
}


def make_request(url, allow_redirects=True):
    start_time = time.perf_counter()

    try:
        response = requests.get(
            url,
            headers=DEFAULT_HEADERS,
            timeout=DEFAULT_TIMEOUT,
            allow_redirects=allow_redirects
        )

        elapsed = time.perf_counter() - start_time

        return {
            "success": True,
            "response": response,
            "response_time": round(elapsed * 1000, 2)
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "HTTP request timed out."
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