from utils.http_utils import make_request


def run(target):
    result = make_request(target)

    if not result["success"]:
        return {
            "name": "Clickjacking Protection Analysis",
            "status": "failed",
            "severity": "medium",
            "evidence": result["error"]
        }

    response = result["response"]

    x_frame_options = response.headers.get("X-Frame-Options")
    csp = response.headers.get("Content-Security-Policy", "")

    frame_ancestors_present = "frame-ancestors" in csp.lower()

    if x_frame_options or frame_ancestors_present:
        evidence_parts = []

        if x_frame_options:
            evidence_parts.append(
                f"X-Frame-Options: {x_frame_options}"
            )

        if frame_ancestors_present:
            evidence_parts.append(
                "CSP frame-ancestors directive present"
            )

        return {
            "name": "Clickjacking Protection Analysis",
            "status": "passed",
            "severity": "info",
            "evidence": "; ".join(evidence_parts),
            "data": {
                "x_frame_options": x_frame_options,
                "frame_ancestors": frame_ancestors_present
            }
        }

    return {
        "name": "Clickjacking Protection Analysis",
        "status": "review",
        "severity": "medium",
        "evidence": "No X-Frame-Options header or CSP frame-ancestors directive was detected.",
        "data": {
            "x_frame_options": None,
            "frame_ancestors": False
        }
    }