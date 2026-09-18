import re

from utils.http_utils import make_request
from utils.technology_utils import get_html


VERSION_PATTERN = re.compile(
    r"\b(?:"
    r"wordpress|drupal|joomla|jquery|bootstrap|"
    r"react|vue|angular|django|laravel|php"
    r")"
    r"[\s/_-]*v?"
    r"(\d+(?:\.\d+){1,3})\b",
    re.IGNORECASE
)


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Technology Version Disclosure",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    html = get_html(result["response"])

    matches = VERSION_PATTERN.findall(html)

    if not matches:
        return {
            "name": "Technology Version Disclosure",
            "status": "passed",
            "severity": "info",
            "evidence": "No supported technology version information was detected.",
            "data": {
                "versions": []
            }
        }

    versions = sorted(set(matches))

    return {
        "name": "Technology Version Disclosure",
        "status": "review",
        "severity": "low",
        "evidence": (
            f"Detected {len(versions)} technology version reference(s)."
        ),
        "data": {
            "versions": versions
        }
    }