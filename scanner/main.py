import sys
import json
from urllib.parse import urlparse

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



    # FINAL RESULT

    return {
        "target": target,
        "domain": domain,
        "status": "completed",
        "checks": results
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "failed",
            "error": "No target URL provided."
        }, indent=2))

        sys.exit(1)

    target = sys.argv[1].strip()

    result = run_scan(target)

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()