from utils.http_utils import make_request
from utils.technology_utils import (
    get_html,
    get_script_sources,
    get_stylesheet_sources
)


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Library Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    html = get_html(result["response"])

    scripts = get_script_sources(html)
    stylesheets = get_stylesheet_sources(html)

    all_sources = scripts + stylesheets

    signatures = {
        "jquery": "jQuery",
        "bootstrap": "Bootstrap",
        "lodash": "Lodash",
        "axios": "Axios",
        "font-awesome": "Font Awesome",
        "tailwind": "Tailwind CSS",
        "alpine": "Alpine.js"
    }

    detections = []

    for signature, library_name in signatures.items():

        matching_sources = [
            source
            for source in all_sources
            if signature in source.lower()
        ]

        if matching_sources:
            detections.append({
                "name": library_name,
                "confidence": "medium",
                "evidence": matching_sources[:3]
            })

    if not detections:
        return {
            "name": "Library Detection",
            "status": "review",
            "severity": "info",
            "evidence": "No supported library fingerprint was detected.",
            "data": {
                "libraries": []
            }
        }

    return {
        "name": "Library Detection",
        "status": "passed",
        "severity": "info",
        "evidence": f"Detected {len(detections)} library fingerprint(s).",
        "data": {
            "libraries": detections
        }
    }