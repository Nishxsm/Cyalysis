from analysis.check_definitions import CHECK_DEFINITIONS



# CHECK NAME NORMALIZATION
#
# Python checks use descriptive operation names.
# The frontend has its own canonical naming scheme.
#
# Raw scanner names are NOT modified.
# only usedcanonical names internally for classification.


CHECK_NAME_ALIASES = {

    # HTTP
    "HTTPS Availability Check": "HTTPS Availability",
    "HTTPS Enforcement Check": "HTTPS Enforcement",

    "Server Banner Detection": "Server Banner",
    "Content-Type Analysis": "Content-Type",

    # Security Headers
    "Clickjacking Protection Analysis": "Clickjacking Analysis",
    "Referrer Policy Analysis": "Referrer Policy",
    "Permissions Policy Analysis": "Permissions Policy",

    # Cookies
    "Secure Flag Analysis": "Cookie Security",
    "HttpOnly Flag Analysis": "Cookie Security",

    "Cookie Scope Analysis": "Cookie Scope",
    "Cookie Expiration Analysis": "Cookie Expiration",

    # CORS
    "CORS Header Analysis": "CORS Header",

    # TLS
    "Certificate Validation": "TLS Certificate",
    "Certificate Expiration": "TLS Expiration",
    "Hostname Verification": "TLS Hostname",
    "Certificate Chain": "TLS Chain",

    # Information Disclosure
    "Debug Information Detection": "Debug Information",
    "Metadata Disclosure Analysis": "Metadata Analysis",

    # HTTP Methods
    "Method Restriction": "Method Restriction",
    "Unsupported Method Analysis": "Unsupported Methods",
}



# OBSERVATIONAL CHECKS

OBSERVATION_CHECKS = {
    "URL Validation",
    "Domain Resolution",
    "IP Resolution",
    "Port Identification",

    "DNS A Record",
    "DNS AAAA Record",
    "DNS CNAME Record",
    "DNS MX Record",
    "DNS NS Record",
    "DNS TXT Record",

    "HTTP Status Analysis",
    "Redirect Chain",
    "Response Headers",
    "Response Time",

    "Web Server Detection",
    "Framework Detection",
    "CMS Detection",
    "Library Detection",
    "CDN Detection",

    "Cookie Enumeration",
    "Cookie Scope",
    "Cookie Expiration",

    "CORS Header",

    "OPTIONS Analysis",
}


# SECURITY CONTROL CHECKS

SECURITY_CONTROL_CHECKS = {

    "HTTPS Availability",
    "HTTPS Enforcement",
    "Server Banner",
    "Content-Type",

    "CSP Analysis",
    "HSTS Analysis",
    "X-Content-Type Analysis",
    "Clickjacking Analysis",
    "Referrer Policy",
    "Permissions Policy",
    "Security Header Completeness",

    "Cookie Security",
    "SameSite Analysis",

    "CORS Origin Policy",
    "CORS Credential Policy",
    "CORS Method Analysis",
    "CORS Header Policy",

    "TLS Certificate",
    "TLS Expiration",
    "TLS Hostname",
    "TLS Chain",
    "TLS Version",
    "Cipher Configuration",

    "Server Version Disclosure",
    "Technology Version Disclosure",
    "Debug Information",
    "Verbose Error Analysis",
    "Metadata Analysis",

    "HTTP Method Enumeration",
    "Method Restriction",
    "TRACE Analysis",
    "Unsupported Methods",
}


# HELPERS

def get_canonical_name(check_name):
    """
    Convert a raw Python check name into the canonical
    analysis name used by CYALYSIS.
    """

    return CHECK_NAME_ALIASES.get(
        check_name,
        check_name
    )


def indicates_security_issue(check_name, evidence):
    """
    Determine whether a review result contains evidence
    of an actual security issue.

    This is intentionally evidence-aware.
    A 'review' result alone is NOT treated as a finding.
    """

    name = get_canonical_name(check_name)

    evidence = (evidence or "").lower()



    # HTTPS

    if name == "HTTPS Availability":
        return any(
            phrase in evidence
            for phrase in [
                "https is not available",
                "https unavailable",
                "https is unavailable"
            ]
        )


    if name == "HTTPS Enforcement":
        return any(
            phrase in evidence
            for phrase in [
                "not enforced",
                "not redirected",
                "does not redirect",
                "http does not redirect"
            ]
        )


    # SERVER BANNER

    if name == "Server Banner":
        return any(
            phrase in evidence
            for phrase in [
                "version exposed",
                "version disclosed",
                "server version exposed",
                "server version disclosed"
            ]
        )


    # CONTENT TYPE

    if name == "Content-Type":
        return any(
            phrase in evidence
            for phrase in [
                "content-type header was not found",
                "content-type was not found",
                "content-type header is missing",
                "content-type is missing"
            ]
        )


    # SECURITY HEADERS

    security_header_names = {
        "CSP Analysis",
        "HSTS Analysis",
        "X-Content-Type Analysis",
        "Clickjacking Analysis",
        "Referrer Policy",
        "Permissions Policy",
    }

    if name in security_header_names:
        return any(
            phrase in evidence
            for phrase in [
                "not found",
                "not present",
                "missing",
                "header is absent",
                "header was absent",
                "no protection"
            ]
        )


    # SECURITY HEADER COMPLETENESS

    if name == "Security Header Completeness":
        return any(
            phrase in evidence
            for phrase in [
                "missing",
                "not detected",
                "not present"
            ]
        )


    # COOKIE SECURITY

    if name == "Cookie Security":
        return any(
            phrase in evidence
            for phrase in [
                "do not have the secure flag",
                "do not have the httponly flag",
                "missing secure",
                "missing httponly",
                "without the secure flag",
                "without the httponly flag"
            ]
        )


    # SAME SITE

    if name == "SameSite Analysis":
        return any(
            phrase in evidence
            for phrase in [
                "do not specify samesite",
                "missing samesite",
                "samesite was not set",
                "samesite was not specified"
            ]
        )



    # CORS

    cors_names = {
        "CORS Origin Policy",
        "CORS Credential Policy",
        "CORS Method Analysis",
        "CORS Header Policy",
    }

    if name in cors_names:
        return any(
            phrase in evidence
            for phrase in [
                "wildcard",
                "permissive",
                "reflect",
                "arbitrary origin",
                "credentials allowed",
                "unsafe",
                "unrestricted"
            ]
        )


    # TLS

    tls_names = {
        "TLS Certificate",
        "TLS Expiration",
        "TLS Hostname",
        "TLS Chain",
        "TLS Version",
        "Cipher Configuration",
    }

    if name in tls_names:
        return any(
            phrase in evidence
            for phrase in [
                "invalid",
                "expired",
                "hostname mismatch",
                "mismatch",
                "weak",
                "obsolete",
                "deprecated",
                "insecure"
            ]
        )



    # INFORMATION DISCLOSURE

    information_disclosure_names = {
        "Server Version Disclosure",
        "Technology Version Disclosure",
        "Debug Information",
        "Verbose Error Analysis",
        "Metadata Analysis",
    }

    if name in information_disclosure_names:

        return any(
            phrase in evidence
            for phrase in [
                "version exposed",
                "version disclosed",
                "debug information detected",
                "debug information exposed",
                "verbose error",
                "stack trace",
                "metadata disclosure",
                "metadata exposed"
            ]
        )


    # HTTP METHODS

    if name == "HTTP Method Enumeration":
        return any(
            phrase in evidence
            for phrase in [
                "unsafe method",
                "unnecessary method",
                "unexpected method"
            ]
        )


    if name == "Method Restriction":
        return any(
            phrase in evidence
            for phrase in [
                "unnecessary method",
                "unsafe method",
                "unexpected method",
                "method accepted"
            ]
        )


    if name == "TRACE Analysis":
        return any(
            phrase in evidence
            for phrase in [
                "trace method was accepted",
                "trace method is enabled",
                "trace is enabled",
                "trace method enabled"
            ]
        )


    if name == "Unsupported Methods":
        return any(
            phrase in evidence
            for phrase in [
                "not rejected",
                "was not rejected",
                "unsupported method was accepted",
                "unexpected response"
            ]
        )


    return False



# NORMALIZE SINGLE RESULT

def normalize_result(result):

    check_name = result.get("name", "")
    status = result.get("status", "unknown")
    severity = result.get("severity", "info")
    evidence = result.get("evidence", "")

    canonical_name = get_canonical_name(check_name)


    # SECURITY HEADER COMPLETENESS
    #
    # This check is a coverage summary.
    # Individual missing headers are handled by their own
    # dedicated checks, such as Permissions Policy.
    #
    # Therefore this must remain an observation and must
    # never become a separate finding.


    if canonical_name == "Security Header Completeness":

        assessment = {
            "state": "observation",
            "scorable": False
        }


    # FAILED

    elif status == "failed":

        assessment = {
            "state": "unable_to_assess",
            "scorable": False
        }


    # PASSED

    elif status == "passed":

        assessment = {
            "state": "passed",
            "scorable": False
        }



    # REVIEW

    elif status == "review":

        if indicates_security_issue(
            canonical_name,
            evidence
        ):

            assessment = {
                "state": "finding",
                "scorable": True
            }

        elif canonical_name in OBSERVATION_CHECKS:

            assessment = {
                "state": "observation",
                "scorable": False
            }

        elif canonical_name in SECURITY_CONTROL_CHECKS:

            assessment = {
                "state": "unknown",
                "scorable": False
            }

        else:

            assessment = {
                "state": "unknown",
                "scorable": False
            }


    # UNKNOWN STATUS

    else:

        assessment = {
            "state": "unknown",
            "scorable": False
        }



    # FINAL NORMALIZED RESULT

    normalized = dict(result)

    normalized["assessment"] = assessment

    normalized["assessment"]["canonical_name"] = canonical_name

    return normalized



# NORMALIZE ALL RESULTS

def normalize_results(results):

    return [
        normalize_result(result)
        for result in results
    ]



# BUILD SUMMARY

def build_summary(normalized_results):

    summary = {
        "total": len(normalized_results),
        "findings": 0,
        "observations": 0,
        "passed": 0,
        "unable_to_assess": 0,
        "unknown": 0
    }


    for result in normalized_results:

        state = result.get(
            "assessment",
            {}
        ).get(
            "state"
        )


        if state == "finding":
            summary["findings"] += 1

        elif state == "observation":
            summary["observations"] += 1

        elif state == "passed":
            summary["passed"] += 1

        elif state == "unable_to_assess":
            summary["unable_to_assess"] += 1

        else:
            summary["unknown"] += 1


    return summary