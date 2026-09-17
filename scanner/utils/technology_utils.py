import re


def get_html(response):
    try:
        return response.text
    except Exception:
        return ""


def get_headers(response):
    return {
        key.lower(): value
        for key, value in response.headers.items()
    }


def get_script_sources(html):
    return re.findall(
        r'<script[^>]+src=["\']([^"\']+)["\']',
        html,
        re.IGNORECASE
    )


def get_stylesheet_sources(html):
    return re.findall(
        r'<link[^>]+href=["\']([^"\']+)["\']',
        html,
        re.IGNORECASE
    )


def contains_pattern(text, pattern):
    return re.search(pattern, text, re.IGNORECASE) is not None