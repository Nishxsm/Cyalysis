from utils.http_utils import make_request


def get_cors_headers(response):
    headers = response.headers

    return {
        "access_control_allow_origin": headers.get(
            "Access-Control-Allow-Origin"
        ),
        "access_control_allow_credentials": headers.get(
            "Access-Control-Allow-Credentials"
        ),
        "access_control_allow_methods": headers.get(
            "Access-Control-Allow-Methods"
        ),
        "access_control_allow_headers": headers.get(
            "Access-Control-Allow-Headers"
        ),
        "access_control_expose_headers": headers.get(
            "Access-Control-Expose-Headers"
        ),
        "access_control_max_age": headers.get(
            "Access-Control-Max-Age"
        )
    }


def fetch_cors_information(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "success": False,
            "error": result["error"]
        }

    return {
        "success": True,
        "response": result["response"],
        "headers": get_cors_headers(result["response"])
    }