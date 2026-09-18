from typing import Dict, List

from analysis.check_definitions import CHECK_DEFINITIONS
from analysis.result_normalizer import get_canonical_name



# FINDING DETAILS

FINDING_DETAILS = {

    # HTTPS

    "HTTPS Availability": {
        "title": "HTTPS Not Available",
        "description": (
            "The target does not appear to provide HTTPS access."
        ),
        "impact": (
            "Without HTTPS, data exchanged between clients and the "
            "target may be exposed to interception or modification."
        ),
        "remediation": (
            "Enable HTTPS using a valid TLS certificate and configure "
            "the application to serve content securely over HTTPS."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },

    "HTTPS Enforcement": {
        "title": "HTTPS Enforcement Not Detected",
        "description": (
            "The target does not appear to consistently redirect "
            "HTTP requests to HTTPS."
        ),
        "impact": (
            "Users may initially connect over unencrypted HTTP, "
            "creating an opportunity for traffic interception."
        ),
        "remediation": (
            "Configure the web server or reverse proxy to redirect "
            "HTTP requests to HTTPS."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },



    # SERVER BANNER

    "Server Banner": {
        "title": "Server Banner Exposed",
        "description": (
            "The target exposes server information through its "
            "HTTP response headers."
        ),
        "impact": (
            "Exposed server information can provide useful "
            "fingerprinting information to an observer."
        ),
        "remediation": (
            "Minimize unnecessary server information exposed "
            "through HTTP response headers."
        ),
        "references": [
            "OWASP Information Exposure Through HTTP Headers"
        ],
    },



    # CONTENT TYPE

    "Content-Type": {
        "title": "Content-Type Header Missing",
        "description": (
            "The target response does not appear to specify "
            "a Content-Type header."
        ),
        "impact": (
            "Missing content type information can cause browsers "
            "to interpret responses incorrectly."
        ),
        "remediation": (
            "Configure the application or web server to return "
            "an appropriate Content-Type header."
        ),
        "references": [
            "OWASP Secure Headers Project"
        ],
    },



    # SECURITY HEADERS

    "CSP Analysis": {
        "title": "Content Security Policy Missing",
        "description": (
            "The target does not appear to define a "
            "Content-Security-Policy response header."
        ),
        "impact": (
            "Without CSP, the browser has fewer restrictions "
            "on the sources from which content can be loaded."
        ),
        "remediation": (
            "Define and deploy a Content-Security-Policy appropriate "
            "to the application's resources."
        ),
        "references": [
            "OWASP Content Security Policy Cheat Sheet"
        ],
    },

    "HSTS Analysis": {
        "title": "HSTS Header Missing",
        "description": (
            "The target does not appear to define a "
            "Strict-Transport-Security response header."
        ),
        "impact": (
            "Without HSTS, browsers may continue allowing "
            "future HTTP connections to the site."
        ),
        "remediation": (
            "Configure Strict-Transport-Security with an appropriate "
            "max-age and deployment policy."
        ),
        "references": [
            "OWASP HTTP Strict Transport Security Cheat Sheet"
        ],
    },

    "X-Content-Type Analysis": {
        "title": "X-Content-Type-Options Protection Missing",
        "description": (
            "The target does not appear to configure "
            "X-Content-Type-Options with the expected nosniff value."
        ),
        "impact": (
            "Without this protection, browsers may perform MIME "
            "type sniffing in situations where it is not desired."
        ),
        "remediation": (
            "Configure the X-Content-Type-Options header with "
            "the value nosniff."
        ),
        "references": [
            "OWASP Secure Headers Project"
        ],
    },

    "Clickjacking Analysis": {
        "title": "Clickjacking Protection Missing",
        "description": (
            "The target does not appear to configure X-Frame-Options "
            "or an appropriate CSP frame-ancestors directive."
        ),
        "impact": (
            "Without frame restrictions, the application may be "
            "more exposed to clickjacking attacks."
        ),
        "remediation": (
            "Configure X-Frame-Options or CSP frame-ancestors "
            "according to the application's framing requirements."
        ),
        "references": [
            "OWASP Clickjacking Defense Cheat Sheet"
        ],
    },

    "Referrer Policy": {
        "title": "Referrer Policy Missing",
        "description": (
            "The target does not appear to define a Referrer-Policy "
            "response header."
        ),
        "impact": (
            "Without an explicit policy, more referrer information "
            "may be exposed than intended."
        ),
        "remediation": (
            "Define a Referrer-Policy appropriate to the application's "
            "privacy and navigation requirements."
        ),
        "references": [
            "OWASP Secure Headers Project"
        ],
    },

    "Permissions Policy": {
        "title": "Permissions Policy Missing",
        "description": (
            "The target does not appear to define a "
            "Permissions-Policy response header."
        ),
        "impact": (
            "Without an explicit Permissions Policy, the application "
            "has less control over which browser features can be used "
            "by the document and embedded content."
        ),
        "remediation": (
            "Define a Permissions-Policy appropriate to the browser "
            "features required by the application."
        ),
        "references": [
            "OWASP Secure Headers Project"
        ],
    },

    "Security Header Completeness": {
        "title": "Security Header Configuration Incomplete",
        "description": (
            "One or more recommended security headers were not "
            "detected in the target response."
        ),
        "impact": (
            "Missing security headers may reduce the browser-side "
            "security controls available to the application."
        ),
        "remediation": (
            "Review the missing security headers and configure those "
            "that are appropriate for the application."
        ),
        "references": [
            "OWASP Secure Headers Project"
        ],
    },



    # COOKIES

    "Secure Flag Analysis": {
        "title": "Cookie Secure Flag Missing",
        "description": (
            "One or more detected cookies do not use the Secure flag."
        ),
        "impact": (
            "Cookies without the Secure flag may be transmitted "
            "over non-HTTPS connections when such connections are used."
        ),
        "remediation": (
            "Set the Secure attribute on cookies that should only "
            "be transmitted over HTTPS."
        ),
        "references": [
            "OWASP Session Management Cheat Sheet"
        ],
    },

    "HttpOnly Flag Analysis": {
        "title": "Cookie HttpOnly Flag Missing",
        "description": (
            "One or more detected cookies do not use the HttpOnly flag."
        ),
        "impact": (
            "Cookies without HttpOnly may be accessible to "
            "client-side scripts, increasing exposure if an "
            "XSS vulnerability is present."
        ),
        "remediation": (
            "Set the HttpOnly attribute on cookies that do not "
            "need to be accessed by client-side JavaScript."
        ),
        "references": [
            "OWASP Session Management Cheat Sheet"
        ],
    },

    "Cookie Security": {
        "title": "Cookie Security Attribute Issue",
        "description": (
            "One or more detected cookies do not appear to use "
            "the expected security attributes."
        ),
        "impact": (
            "Weak cookie security attributes can increase the "
            "exposure of session or application-related cookies."
        ),
        "remediation": (
            "Review the affected cookies and configure appropriate "
            "Secure and HttpOnly attributes."
        ),
        "references": [
            "OWASP Session Management Cheat Sheet"
        ],
    },

    "SameSite Analysis": {
        "title": "Cookie SameSite Attribute Missing",
        "description": (
            "One or more detected cookies do not specify a SameSite "
            "attribute."
        ),
        "impact": (
            "Missing SameSite configuration can increase the risk "
            "of unwanted cross-site cookie transmission."
        ),
        "remediation": (
            "Configure SameSite appropriately, such as Lax or Strict "
            "where compatible with the application's requirements."
        ),
        "references": [
            "OWASP Cross-Site Request Forgery Prevention Cheat Sheet"
        ],
    },


    # CORS

    "CORS Origin Policy": {
        "title": "Permissive CORS Origin Policy",
        "description": (
            "The target appears to expose a permissive or potentially "
            "unsafe cross-origin policy."
        ),
        "impact": (
            "An overly permissive origin policy may allow unintended "
            "origins to interact with application resources."
        ),
        "remediation": (
            "Restrict Access-Control-Allow-Origin to trusted origins "
            "required by the application."
        ),
        "references": [
            "OWASP Cross-Origin Resource Sharing"
        ],
    },

    "CORS Credential Policy": {
        "title": "Permissive CORS Credential Policy",
        "description": (
            "The target appears to allow credentials in a potentially "
            "unsafe cross-origin configuration."
        ),
        "impact": (
            "Improper credential handling in CORS can expose "
            "authenticated resources to unintended origins."
        ),
        "remediation": (
            "Allow credentials only when required and combine them "
            "with an explicit trusted-origin policy."
        ),
        "references": [
            "OWASP Cross-Origin Resource Sharing"
        ],
    },

    "CORS Method Analysis": {
        "title": "Permissive CORS Method Policy",
        "description": (
            "The target appears to allow cross-origin HTTP methods "
            "beyond those required by the application."
        ),
        "impact": (
            "Unnecessarily broad cross-origin method permissions "
            "can increase the application's exposed attack surface."
        ),
        "remediation": (
            "Restrict Access-Control-Allow-Methods to only the "
            "methods required by the application."
        ),
        "references": [
            "OWASP Cross-Origin Resource Sharing"
        ],
    },

    "CORS Header Policy": {
        "title": "Permissive CORS Header Policy",
        "description": (
            "The target appears to allow cross-origin request headers "
            "beyond those required by the application."
        ),
        "impact": (
            "Broad cross-origin header permissions can increase "
            "the amount of functionality exposed to other origins."
        ),
        "remediation": (
            "Restrict Access-Control-Allow-Headers to the headers "
            "actually required by the application."
        ),
        "references": [
            "OWASP Cross-Origin Resource Sharing"
        ],
    },


    # TLS

    "TLS Certificate": {
        "title": "TLS Certificate Validation Issue",
        "description": (
            "The target's TLS certificate could not be successfully "
            "validated."
        ),
        "impact": (
            "Certificate validation problems can undermine the "
            "trust established by HTTPS connections."
        ),
        "remediation": (
            "Install and maintain a valid certificate issued for "
            "the target hostname."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },

    "TLS Expiration": {
        "title": "TLS Certificate Expired",
        "description": (
            "The target's TLS certificate has expired."
        ),
        "impact": (
            "An expired certificate can cause browser warnings "
            "and prevent clients from establishing trusted connections."
        ),
        "remediation": (
            "Renew the TLS certificate before expiration and "
            "deploy the renewed certificate correctly."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },

    "TLS Hostname": {
        "title": "TLS Hostname Verification Issue",
        "description": (
            "The TLS certificate does not appear to match the "
            "target hostname."
        ),
        "impact": (
            "Hostname mismatch can cause clients to reject the "
            "TLS connection or display security warnings."
        ),
        "remediation": (
            "Use a certificate whose subject or SAN entries "
            "correctly cover the target hostname."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },

    "TLS Chain": {
        "title": "TLS Certificate Chain Issue",
        "description": (
            "The TLS certificate chain could not be properly assessed "
            "or appears to contain a validation problem."
        ),
        "impact": (
            "Certificate chain problems can prevent clients from "
            "establishing a trusted TLS connection."
        ),
        "remediation": (
            "Ensure the complete and correct certificate chain is "
            "configured on the server."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },

    "TLS Version": {
        "title": "Weak TLS Version Configuration",
        "description": (
            "The target appears to support an obsolete or insecure "
            "TLS protocol version."
        ),
        "impact": (
            "Older TLS versions may provide weaker cryptographic "
            "protection and may no longer meet modern security requirements."
        ),
        "remediation": (
            "Disable obsolete TLS versions and prefer modern "
            "protocols such as TLS 1.2 or TLS 1.3."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },

    "Cipher Configuration": {
        "title": "Weak TLS Cipher Configuration",
        "description": (
            "The target appears to negotiate a weak or obsolete "
            "TLS cipher configuration."
        ),
        "impact": (
            "Weak cryptographic configurations can reduce the "
            "security of encrypted communications."
        ),
        "remediation": (
            "Disable weak cipher suites and configure modern "
            "cryptographic algorithms."
        ),
        "references": [
            "OWASP Transport Layer Security"
        ],
    },



    # INFORMATION DISCLOSURE

    "Server Version Disclosure": {
        "title": "Server Version Information Disclosed",
        "description": (
            "The target response exposes specific server version "
            "information through its HTTP response."
        ),
        "impact": (
            "Detailed server version information can help an observer "
            "identify the underlying software and compare it against "
            "known vulnerabilities or outdated versions."
        ),
        "remediation": (
            "Configure the web server or reverse proxy to minimize "
            "unnecessary version information in response headers."
        ),
        "references": [
            "OWASP Information Exposure Through HTTP Headers"
        ],
    },

    "Technology Version Disclosure": {
        "title": "Technology Version Information Disclosed",
        "description": (
            "The target exposes specific versions of detected "
            "technologies or software."
        ),
        "impact": (
            "Technology version information can assist fingerprinting "
            "and vulnerability research against the target."
        ),
        "remediation": (
            "Minimize unnecessary technology and software version "
            "information exposed to clients."
        ),
        "references": [
            "OWASP Information Exposure Through HTTP Headers"
        ],
    },

    "Debug Information": {
        "title": "Debug Information Exposed",
        "description": (
            "The target response contains indicators of debugging "
            "or development information."
        ),
        "impact": (
            "Debug information can reveal internal implementation "
            "details that may assist further security analysis."
        ),
        "remediation": (
            "Disable debug output in production and ensure detailed "
            "diagnostic information is not returned to clients."
        ),
        "references": [
            "OWASP Error Handling"
        ],
    },

    "Verbose Error Analysis": {
        "title": "Verbose Error Information Exposed",
        "description": (
            "The target appears to expose excessive technical "
            "information through error responses."
        ),
        "impact": (
            "Detailed error messages and stack traces can reveal "
            "internal application or infrastructure information."
        ),
        "remediation": (
            "Return generic production error messages and keep "
            "detailed diagnostics in server-side logs."
        ),
        "references": [
            "OWASP Error Handling"
        ],
    },

    "Metadata Analysis": {
        "title": "Metadata Disclosure Detected",
        "description": (
            "The target exposes metadata that may provide unnecessary "
            "information about the application or its implementation."
        ),
        "impact": (
            "Exposed metadata can assist fingerprinting and "
            "information gathering."
        ),
        "remediation": (
            "Review publicly exposed metadata and remove information "
            "that is not required by the application."
        ),
        "references": [
            "OWASP Information Exposure"
        ],
    },


    # HTTP METHODS

    "HTTP Method Enumeration": {
        "title": "Unexpected HTTP Methods Detected",
        "description": (
            "The target appears to expose HTTP methods that may "
            "not be required by the application."
        ),
        "impact": (
            "Unnecessary HTTP methods can increase the exposed "
            "attack surface of a web application."
        ),
        "remediation": (
            "Restrict supported HTTP methods to those required "
            "by the application."
        ),
        "references": [
            "OWASP HTTP Methods"
        ],
    },

    "Method Restriction": {
        "title": "HTTP Method Restrictions Require Review",
        "description": (
            "The target's HTTP method restrictions could not be "
            "adequately determined or appear overly permissive."
        ),
        "impact": (
            "Unnecessary HTTP methods may increase the application's "
            "attack surface."
        ),
        "remediation": (
            "Explicitly restrict HTTP methods to those required "
            "by the application."
        ),
        "references": [
            "OWASP HTTP Methods"
        ],
    },

    "TRACE Analysis": {
        "title": "TRACE Method Enabled",
        "description": (
            "The target accepted an HTTP TRACE request."
        ),
        "impact": (
            "An enabled TRACE method can expose unnecessary HTTP "
            "functionality and may contribute to certain attack scenarios."
        ),
        "remediation": (
            "Disable the TRACE method unless it is explicitly "
            "required by the application."
        ),
        "references": [
            "OWASP HTTP Methods"
        ],
    },

    "Unsupported Methods": {
        "title": "Unsupported HTTP Method Accepted",
        "description": (
            "The target did not properly reject an unsupported "
            "HTTP method."
        ),
        "impact": (
            "Unexpected handling of unsupported methods may indicate "
            "unnecessary server-side request processing."
        ),
        "remediation": (
            "Configure the server or application to reject "
            "unsupported HTTP methods with an appropriate 4xx response."
        ),
        "references": [
            "OWASP HTTP Methods"
        ],
    },
}



# CATEGORY

def get_category(check_name):
    """
    Resolve the category using the canonical check name.
    """

    canonical_name = get_canonical_name(check_name)

    definition = CHECK_DEFINITIONS.get(canonical_name)

    if definition:
        return definition["category"]

    return "Uncategorized"



# BUILD SINGLE FINDING

def build_finding(normalized_result):

    raw_name = normalized_result.get("name", "")

    canonical_name = get_canonical_name(raw_name)

    severity = normalized_result.get(
        "severity",
        "low"
    )

    evidence = normalized_result.get(
        "evidence",
        ""
    )



    # Prefer the raw check name where a specific definition
    # exists. This is important for Secure vs HttpOnly.

    details = FINDING_DETAILS.get(raw_name)

    if not details:
        details = FINDING_DETAILS.get(canonical_name)



    # Fallback

    if not details:

        details = {
            "title": canonical_name,
            "description": (
                "The check identified a condition that "
                "requires security review."
            ),
            "impact": "",
            "remediation": "",
            "references": []
        }


    return {
        "id": None,
        "title": details["title"],
        "category": get_category(canonical_name),
        "severity": severity,
        "status": "open",
        "evidence": evidence,
        "description": details["description"],
        "impact": details["impact"],
        "remediation": details["remediation"],
        "references": details["references"]
    }



# BUILD ALL FINDINGS

def build_findings(normalized_results):

    findings = []

    for result in normalized_results:

        assessment = result.get(
            "assessment",
            {}
        )

        if assessment.get("state") != "finding":
            continue

        findings.append(
            build_finding(result)
        )

    return findings