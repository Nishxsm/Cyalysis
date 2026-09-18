import sys
import json
import re
from urllib.parse import urlparse

from analysis.result_normalizer import (
    normalize_results,
    build_summary
)

from analysis.finding_builder import build_findings


from checks.url_validation import run as validate_url
from checks.domain_resolution import run as resolve_domain
from checks.ip_resolution import run as resolve_ip

from checks.dns_a_record import run as check_a
from checks.dns_aaaa_record import run as check_aaaa
from checks.dns_cname_record import run as check_cname
from checks.dns_mx_record import run as check_mx
from checks.dns_ns_record import run as check_ns
from checks.dns_txt_record import run as check_txt
from checks.port_identification import run as identify_port

from checks.http_status import run as check_http_status
from checks.https_availability import run as check_https_availability
from checks.https_enforcement import run as check_https_enforcement
from checks.redirect_chain import run as check_redirect_chain
from checks.response_headers import run as check_response_headers
from checks.server_banner import run as check_server_banner
from checks.response_time import run as check_response_time
from checks.content_type import run as check_content_type

from checks.web_server import run as check_web_server
from checks.framework import run as check_framework
from checks.cms import run as check_cms
from checks.library import run as check_library
from checks.cdn import run as check_cdn

from checks.csp import run as check_csp
from checks.hsts import run as check_hsts
from checks.x_content_type import run as check_x_content_type
from checks.clickjacking import run as check_clickjacking
from checks.referrer_policy import run as check_referrer_policy
from checks.permissions_policy import run as check_permissions_policy
from checks.security_header_completeness import run as check_security_header_completeness

from checks.cookie_enumeration import run as check_cookie_enumeration
from checks.cookie_secure import run as check_cookie_secure
from checks.cookie_httponly import run as check_cookie_httponly
from checks.samesite import run as check_samesite
from checks.cookie_scope import run as check_cookie_scope
from checks.cookie_expiration import run as check_cookie_expiration

from checks.cors_header import run as check_cors_header
from checks.cors_origin_policy import run as check_cors_origin_policy
from checks.cors_credentials import run as check_cors_credentials
from checks.cors_methods import run as check_cors_methods
from checks.cors_header_policy import run as check_cors_header_policy

from checks.certificate_validation import run as check_certificate_validation
from checks.certificate_expiration import run as check_certificate_expiration
from checks.hostname_verification import run as check_hostname_verification
from checks.certificate_chain import run as check_certificate_chain
from checks.tls_version import run as check_tls_version
from checks.cipher_configuration import run as check_cipher_configuration

from checks.server_version_disclosure import run as check_server_version_disclosure
from checks.technology_version_disclosure import run as check_technology_version_disclosure
from checks.debug_information import run as check_debug_information
from checks.verbose_error_analysis import run as check_verbose_error_analysis
from checks.metadata_disclosure import run as check_metadata_disclosure

from checks.http_method_enumeration import run as check_http_method_enumeration
from checks.options_analysis import run as check_options_analysis
from checks.method_restriction import run as check_method_restriction
from checks.trace import run as check_trace
from checks.unsupported_method import run as check_unsupported_method

def normalize_target(raw_target):
    target = raw_target.strip()

    markdown_match = re.search(
        r"https?://[^\s\]\)]+",
        target
    )

    if markdown_match:
        return markdown_match.group(0)

    return target


def run_scan(target):
    results = []


    # URL VALIDATION

    url_result = validate_url(target)
    results.append(url_result)

    if url_result["status"] == "failed":
        return {
            "target": target,
            "status": "failed",
            "checks": results
        }



    # DOMAIN RESOLUTION

    parsed = urlparse(target)
    domain = parsed.hostname

    domain_result = resolve_domain(domain)
    results.append(domain_result)

    if domain_result["status"] == "failed":
        return {
            "target": target,
            "domain": domain,
            "status": "failed",
            "checks": results
        }

    # IP RESOLUTION

    ip_result = resolve_ip(domain)
    results.append(ip_result)


    # PORT IDENTIFICATION

    port_result = identify_port(target)
    results.append(port_result)


    # DNS RECORDS
    dns_checks = [
        check_a,
        check_aaaa,
        check_cname,
        check_mx,
        check_ns,
        check_txt
    ]

    for check in dns_checks:
        result = check(domain)
        results.append(result)

    # HTTP OPERATIONS
    http_checks = [
        check_http_status,
        check_https_availability,
        check_https_enforcement,
        check_redirect_chain,
        check_response_headers,
        check_server_banner,
        check_response_time,
        check_content_type
    ]

    for check in http_checks:
        result = check(target)
        results.append(result)



    # TECHNOLOGY OPERATIONS

    technology_checks = [
        check_web_server,
        check_framework,
        check_cms,
        check_library,
        check_cdn
    ]

    for check in technology_checks:
        result = check(target)
        results.append(result)



    # SECURITY HEADER OPERATIONS
    security_header_checks = [
        check_csp,
        check_hsts,
        check_x_content_type,
        check_clickjacking,
        check_referrer_policy,
        check_permissions_policy,
        check_security_header_completeness
    ]

    for check in security_header_checks:
        result = check(target)
        results.append(result)


    # COOKIE OPERATIONS
    cookie_checks = [
        check_cookie_enumeration,
        check_cookie_secure,
        check_cookie_httponly,
        check_samesite,
        check_cookie_scope,
        check_cookie_expiration
    ]

    for check in cookie_checks:
        result = check(target)
        results.append(result)



    # CORS OPERATIONS
    cors_checks = [
        check_cors_header,
        check_cors_origin_policy,
        check_cors_credentials,
        check_cors_methods,
        check_cors_header_policy
    ]

    for check in cors_checks:
        result = check(target)
        results.append(result)



    # TLS OPERATIONS
    tls_checks = [
        check_certificate_validation,
        check_certificate_expiration,
        check_hostname_verification,
        check_certificate_chain,
        check_tls_version,
        check_cipher_configuration
    ]

    for check in tls_checks:
        result = check(target)
        results.append(result)


    # INFORMATION DISCLOSURE
    information_disclosure_checks = [
        check_server_version_disclosure,
        check_technology_version_disclosure,
        check_debug_information,
        check_verbose_error_analysis,
        check_metadata_disclosure
    ]

    for check in information_disclosure_checks:
        result = check(target)
        results.append(result)


    # HTTP METHOD OPERATIONS
    http_method_checks = [
        check_http_method_enumeration,
        check_options_analysis,
        check_method_restriction,
        check_trace,
        check_unsupported_method
    ]

    for check in http_method_checks:
        result = check(target)
        results.append(result)


    # NORMALIZE RESULTS
    normalized_results = normalize_results(results)



    # BUILD SUMMARY
    summary = build_summary(normalized_results)



    # BUILD FINDINGS
    findings = build_findings(normalized_results)



    # FINAL RESULT
    return {
        "target": target,
        "domain": domain,
        "status": "completed",
        "summary": summary,
        "results": normalized_results,
        "findings": findings
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "failed",
            "error": "No target URL provided."
        }, indent=2))

        sys.exit(1)


    target = normalize_target(sys.argv[1])

    result = run_scan(target)

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()