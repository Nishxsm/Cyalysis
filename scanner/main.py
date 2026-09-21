import sys
import json
import re
from urllib.parse import urlparse

from utils.progress import write_progress

from analysis.result_normalizer import (
    normalize_results,
    build_summary
)

from analysis.finding_builder import build_findings

# TARGET OPERATIONS

from checks.url_validation import run as validate_url
from checks.domain_resolution import run as resolve_domain
from checks.ip_resolution import run as resolve_ip
from checks.port_identification import run as identify_port


# DNS OPERATIONS

from checks.dns_a_record import run as check_a
from checks.dns_aaaa_record import run as check_aaaa
from checks.dns_cname_record import run as check_cname
from checks.dns_mx_record import run as check_mx
from checks.dns_ns_record import run as check_ns
from checks.dns_txt_record import run as check_txt


# HTTP OPERATIONS

from checks.http_status import run as check_http_status
from checks.https_availability import run as check_https_availability
from checks.https_enforcement import run as check_https_enforcement
from checks.redirect_chain import run as check_redirect_chain
from checks.response_headers import run as check_response_headers
from checks.server_banner import run as check_server_banner
from checks.response_time import run as check_response_time
from checks.content_type import run as check_content_type


# TECHNOLOGY OPERATIONS

from checks.web_server import run as check_web_server
from checks.framework import run as check_framework
from checks.cms import run as check_cms
from checks.library import run as check_library
from checks.cdn import run as check_cdn


# SECURITY HEADER OPERATIONS

from checks.csp import run as check_csp
from checks.hsts import run as check_hsts
from checks.x_content_type import run as check_x_content_type
from checks.clickjacking import run as check_clickjacking
from checks.referrer_policy import run as check_referrer_policy
from checks.permissions_policy import run as check_permissions_policy
from checks.security_header_completeness import run as check_security_header_completeness



# COOKIE OPERATIONS

from checks.cookie_enumeration import run as check_cookie_enumeration
from checks.cookie_secure import run as check_cookie_secure
from checks.cookie_httponly import run as check_cookie_httponly
from checks.samesite import run as check_samesite
from checks.cookie_scope import run as check_cookie_scope
from checks.cookie_expiration import run as check_cookie_expiration


# CORS OPERATIONS

from checks.cors_header import run as check_cors_header
from checks.cors_origin_policy import run as check_cors_origin_policy
from checks.cors_credentials import run as check_cors_credentials
from checks.cors_methods import run as check_cors_methods
from checks.cors_header_policy import run as check_cors_header_policy


# TLS OPERATIONS

from checks.certificate_validation import run as check_certificate_validation
from checks.certificate_expiration import run as check_certificate_expiration
from checks.hostname_verification import run as check_hostname_verification
from checks.certificate_chain import run as check_certificate_chain
from checks.tls_version import run as check_tls_version
from checks.cipher_configuration import run as check_cipher_configuration


# INFORMATION DISCLOSURE

from checks.server_version_disclosure import run as check_server_version_disclosure
from checks.technology_version_disclosure import run as check_technology_version_disclosure
from checks.debug_information import run as check_debug_information
from checks.verbose_error_analysis import run as check_verbose_error_analysis
from checks.metadata_disclosure import run as check_metadata_disclosure



# HTTP METHOD OPERATIONS

from checks.http_method_enumeration import run as check_http_method_enumeration
from checks.options_analysis import run as check_options_analysis
from checks.method_restriction import run as check_method_restriction
from checks.trace import run as check_trace
from checks.unsupported_method import run as check_unsupported_method


# TARGET NORMALIZATION

def normalize_target(raw_target):
    target = raw_target.strip()

    markdown_match = re.search(
        r"https?://[^\s\]\)]+",
        target
    )

    if markdown_match:
        return markdown_match.group(0)

    return target


# SCAN

def run_scan(target):

    results = []

    total_checks = 57
    completed_checks = 0


    # Helper for progress-aware checks
    def execute_check(check_name, check_function, argument):

        nonlocal completed_checks

        # Tell the progress system which check is currently running.
        write_progress(
            current_check=check_name,
            completed=completed_checks,
            total=total_checks,
            status="running"
        )

        try:
            result = check_function(argument)
        except Exception as error:
            result = {
                "name": check_name,
                "status": "failed",
                "severity": "medium",
                "evidence": f"Check execution failed: {error}"
            }

        results.append(result)

        completed_checks += 1

        # Tell the progress system that this check completed.
        write_progress(
            current_check=check_name,
            completed=completed_checks,
            total=total_checks,
            status="running"
        )

        return result


   
    # URL VALIDATION

    url_result = execute_check(
        "URL Validation",
        validate_url,
        target
    )

    if url_result["status"] == "failed":
        write_progress(
            current_check="URL Validation",
            completed=completed_checks,
            total=total_checks,
            status="failed"
        )

        return {
            "target": target,
            "status": "failed",
            "checks": results
        }


    # DOMAIN RESOLUTION

    parsed = urlparse(target)
    domain = parsed.hostname

    domain_result = execute_check(
        "Domain Resolution",
        resolve_domain,
        domain
    )

    if domain_result["status"] == "failed":
        write_progress(
            current_check="Domain Resolution",
            completed=completed_checks,
            total=total_checks,
            status="failed"
        )

        return {
            "target": target,
            "domain": domain,
            "status": "failed",
            "checks": results
        }


    # IP RESOLUTION

    execute_check(
        "IP Resolution",
        resolve_ip,
        domain
    )


    # PORT IDENTIFICATION

    execute_check(
        "Port Identification",
        identify_port,
        target
    )

    # DNS RECORDS

    dns_checks = [
        ("DNS A Record", check_a),
        ("DNS AAAA Record", check_aaaa),
        ("DNS CNAME Record", check_cname),
        ("DNS MX Record", check_mx),
        ("DNS NS Record", check_ns),
        ("DNS TXT Record", check_txt)
    ]

    for check_name, check_function in dns_checks:
        execute_check(
            check_name,
            check_function,
            domain
        )


    # HTTP OPERATIONS

    http_checks = [
        ("HTTP Status Analysis", check_http_status),
        ("HTTPS Availability Check", check_https_availability),
        ("HTTPS Enforcement Check", check_https_enforcement),
        ("Redirect Chain Analysis", check_redirect_chain),
        ("Response Header Analysis", check_response_headers),
        ("Server Banner Detection", check_server_banner),
        ("Response Time Measurement", check_response_time),
        ("Content-Type Analysis", check_content_type)
    ]

    for check_name, check_function in http_checks:
        execute_check(
            check_name,
            check_function,
            target
        )



    # TECHNOLOGY OPERATIONS

    technology_checks = [
        ("Web Server Detection", check_web_server),
        ("Framework Detection", check_framework),
        ("CMS Detection", check_cms),
        ("Library Detection", check_library),
        ("CDN Detection", check_cdn)
    ]

    for check_name, check_function in technology_checks:
        execute_check(
            check_name,
            check_function,
            target
        )


    # SECURITY HEADER OPERATIONS

    security_header_checks = [
        ("CSP Analysis", check_csp),
        ("HSTS Analysis", check_hsts),
        ("X-Content-Type Analysis", check_x_content_type),
        ("Clickjacking Protection Analysis", check_clickjacking),
        ("Referrer Policy Analysis", check_referrer_policy),
        ("Permissions Policy Analysis", check_permissions_policy),
        ("Security Header Completeness", check_security_header_completeness)
    ]

    for check_name, check_function in security_header_checks:
        execute_check(
            check_name,
            check_function,
            target
        )

    # COOKIE OPERATIONS

    cookie_checks = [
        ("Cookie Enumeration", check_cookie_enumeration),
        ("Secure Flag Analysis", check_cookie_secure),
        ("HttpOnly Flag Analysis", check_cookie_httponly),
        ("SameSite Analysis", check_samesite),
        ("Cookie Scope Analysis", check_cookie_scope),
        ("Cookie Expiration Analysis", check_cookie_expiration)
    ]

    for check_name, check_function in cookie_checks:
        execute_check(
            check_name,
            check_function,
            target
        )


    # CORS OPERATIONS

    cors_checks = [
        ("CORS Header Analysis", check_cors_header),
        ("CORS Origin Policy", check_cors_origin_policy),
        ("CORS Credential Policy", check_cors_credentials),
        ("CORS Method Analysis", check_cors_methods),
        ("CORS Header Policy", check_cors_header_policy)
    ]

    for check_name, check_function in cors_checks:
        execute_check(
            check_name,
            check_function,
            target
        )

    # TLS OPERATIONS

    tls_checks = [
        ("Certificate Validation", check_certificate_validation),
        ("Certificate Expiration", check_certificate_expiration),
        ("Hostname Verification", check_hostname_verification),
        ("Certificate Chain", check_certificate_chain),
        ("TLS Version", check_tls_version),
        ("Cipher Configuration", check_cipher_configuration)
    ]

    for check_name, check_function in tls_checks:
        execute_check(
            check_name,
            check_function,
            target
        )

    # INFORMATION DISCLOSURE

    information_disclosure_checks = [
        ("Server Version Disclosure", check_server_version_disclosure),
        ("Technology Version Disclosure", check_technology_version_disclosure),
        ("Debug Information Detection", check_debug_information),
        ("Verbose Error Analysis", check_verbose_error_analysis),
        ("Metadata Disclosure Analysis", check_metadata_disclosure)
    ]

    for check_name, check_function in information_disclosure_checks:
        execute_check(
            check_name,
            check_function,
            target
        )


    # HTTP METHOD OPERATIONS

    http_method_checks = [
        ("HTTP Method Enumeration", check_http_method_enumeration),
        ("OPTIONS Analysis", check_options_analysis),
        ("Method Restriction", check_method_restriction),
        ("TRACE Analysis", check_trace),
        ("Unsupported Method Analysis", check_unsupported_method)
    ]

    for check_name, check_function in http_method_checks:
        execute_check(
            check_name,
            check_function,
            target
        )


    # NORMALIZE RESULTS

    normalized_results = normalize_results(results)


    # BUILD SUMMARY

    summary = build_summary(normalized_results)


    # BUILD FINDINGS

    findings = build_findings(normalized_results)


    # FINAL PROGRESS

    write_progress(
        current_check="Scan Complete",
        completed=total_checks,
        total=total_checks,
        status="completed"
    )

    # FINAL RESULT

    return {
        "target": target,
        "domain": domain,
        "status": "completed",
        "summary": summary,
        "results": normalized_results,
        "findings": findings
    }

# MAIN

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

    write_progress(
        current_check="Scan Complete",
        completed=57,
        total=57,
        status="completed"
    )


if __name__ == "__main__":
    main()