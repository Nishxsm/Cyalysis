from http.cookies import SimpleCookie


def parse_cookies(response):
    cookies = []

    raw_headers = response.raw.headers

    try:
        set_cookie_headers = raw_headers.get_all("Set-Cookie")
    except AttributeError:
        set_cookie_headers = None

    if not set_cookie_headers:
        single_header = response.headers.get("Set-Cookie")

        if not single_header:
            return []

        set_cookie_headers = [single_header]

    for header in set_cookie_headers:
        cookie = SimpleCookie()

        try:
            cookie.load(header)
        except Exception:
            continue

        for name, morsel in cookie.items():
            cookies.append({
                "name": name,
                "secure": bool(morsel["secure"]),
                "httponly": bool(morsel["httponly"]),
                "samesite": morsel["samesite"] or None,
                "domain": morsel["domain"] or None,
                "path": morsel["path"] or None,
                "expires": morsel["expires"] or None,
                "max_age": morsel["max-age"] or None
            })

    return cookies