from utils.http_utils import make_request
from utils.technology_utils import (
    get_html,
    get_headers,
    get_script_sources
)


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Framework Detection",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]
    html = get_html(response)
    headers = get_headers(response)
    scripts = get_script_sources(html)

    detections = []

    # React
    if "__next_data__" in html.lower():
        detections.append({
            "name": "Next.js",
            "confidence": "high",
            "evidence": "__NEXT_DATA__ marker detected."
        })

    elif any(
        "react" in src.lower()
        for src in scripts
    ):
        detections.append({
            "name": "React",
            "confidence": "medium",
            "evidence": "React-related script source detected."
        })

    # Vue
    if any(
        "vue" in src.lower()
        for src in scripts
    ):
        detections.append({
            "name": "Vue.js",
            "confidence": "medium",
            "evidence": "Vue-related script source detected."
        })

    # Angular
    if (
        "ng-version" in html.lower()
        or any("angular" in src.lower() for src in scripts)
    ):
        detections.append({
            "name": "Angular",
            "confidence": "medium",
            "evidence": "Angular marker or script source detected."
        })

    # Django
    if "csrftoken" in headers.get("set-cookie", "").lower():
        detections.append({
            "name": "Django",
            "confidence": "low",
            "evidence": "Potential Django CSRF cookie marker detected."
        })

    if not detections:
        return {
            "name": "Framework Detection",
            "status": "review",
            "severity": "info",
            "evidence": "No supported framework fingerprint was detected.",
            "data": {
                "frameworks": []
            }
        }

    return {
        "name": "Framework Detection",
        "status": "passed",
        "severity": "info",
        "evidence": f"Detected {len(detections)} framework fingerprint(s).",
        "data": {
            "frameworks": detections
        }
    }